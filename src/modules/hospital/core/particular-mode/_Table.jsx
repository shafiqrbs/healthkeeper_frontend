import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Group, Box, ActionIcon, Text, rem, Flex, Button } from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
	IconTrashX,
	IconAlertCircle,
	IconCheck,
	IconEdit,
	IconEye,
	IconChevronUp,
	IconSelector,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import KeywordSearch from "@modules/filter/KeywordSearch";
import { modals } from "@mantine/modals";
import { useHotkeys, useMounted } from "@mantine/hooks";
import { deleteEntityData, getIndexEntityData, editEntityData } from "@/app/store/core/crudThunk.js";
import { setRefetchData, setInsertType, setItemData } from "@/app/store/core/crudSlice.js";
import tableCss from "@assets/css/TableAdmin.module.css";
import ViewDrawer from "./__ViewDrawer.jsx";
import { notifications } from "@mantine/notifications";
import { getCustomers } from "@/common/utils";
import { SUCCESS_NOTIFICATION_COLOR, ERROR_NOTIFICATION_COLOR } from "@/constants/index.js";
import CreateButton from "@components/buttons/CreateButton.jsx";
import DataTableFooter from "@components/tables/DataTableFooter.jsx";
import { sortBy } from "lodash";
import { useOs } from "@mantine/hooks";
import { MASTER_DATA_ROUTES } from "@/constants/routes.js";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll";

const PER_PAGE = 100;

export default function _Table({ module, open, close }) {
	const isMounted = useMounted();
	const { mainAreaHeight } = useOutletContext();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { id } = useParams();
	const height = mainAreaHeight - 78; //TabList height 104
	const scrollViewportRef = useRef(null);
	const os = useOs();
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const searchKeyword = useSelector((state) => state.crud.searchKeyword);
	const refetchData = useSelector((state) => state.crud[module].refetching);
	const listData = useSelector((state) => state.crud[module].data);
	const filterData = useSelector((state) => state.crud[module].filterData);

	const [customerObject, setCustomerObject] = useState({});
	const navigate = useNavigate();
	const [viewDrawer, setViewDrawer] = useState(false);


	const { scrollRef, records, fetching, sortStatus, setSortStatus, handleScrollToBottom } = useInfiniteTableScroll({
		module,
		fetchUrl:  MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR_MODE.INDEX,
		filterParams: {
			name: filterData?.name,
			term: searchKeyword,
		},
		perPage: PER_PAGE,
		sortByKey: "name",
	});


	const handleEntityEdit = (id) => {
		dispatch(setInsertType({ insertType: "update", module }));
		dispatch(
			editEntityData({
				url: `${MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR_MODE.VIEW}/${id}`,
				module,
			})
		);
		navigate(`${MASTER_DATA_ROUTES.NAVIGATION_LINKS.PARTICULAR_MODE.INDEX}/${id}`);
	};

	const handleDelete = (id) => {
		modals.openConfirmModal({
			title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
			labels: {
				confirm: "Confirm",
				cancel: "Cancel",
			},
			confirmProps: { color: "var(--theme-delete-color)" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleDeleteSuccess(id),
		});
	};

	const handleDeleteSuccess = async (id) => {
		const resultAction = await dispatch(
			deleteEntityData({
				url: `${CORE_DATA_ROUTES.API_ROUTES.PARTICULAR.DELETE}/${id}`,
				module,
				id,
			})
		);
		if (deleteEntityData.fulfilled.match(resultAction)) {
			dispatch(setRefetchData({ module, refetching: true }));
			notifications.show({
				color: SUCCESS_NOTIFICATION_COLOR,
				title: t("DeleteSuccessfully"),
				icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
				loading: false,
				autoClose: 700,
				style: { backgroundColor: "lightgray" },
			});
			navigate(CORE_DATA_ROUTES.NAVIGATION_LINKS.PARTICULAR);
			dispatch(setInsertType({ insertType: "create", module }));
		} else {
			notifications.show({
				color: ERROR_NOTIFICATION_COLOR,
				title: t("Delete Failed"),
				icon: <IconAlertCircle style={{ width: rem(18), height: rem(18) }} />,
			});
		}
	};

	const handleDataShow = (id) => {
		const customers = getCustomers();
		const foundCustomers = customers.find((customer) => customer.id == id);
		if (foundCustomers) {
			setCustomerObject(foundCustomers);
			setViewDrawer(true);
		} else {
			notifications.show({
				color: "red",
				title: t("Something Went wrong , please try again"),
				icon: (
					<IconAlertCircle
						style={{
							width: rem(18),
							height: rem(18),
						}}
					/>
				),
				loading: false,
				autoClose: 900,
				style: { backgroundColor: "lightgray" },
			});
		}
	};

	const handleCreateForm = () => {
		 open();
		 dispatch(setInsertType({ insertType: "create", module }));
		navigate(CORE_DATA_ROUTES.NAVIGATION_LINKS.PARTICULAR);
	};

	useHotkeys([[os === "macos" ? "ctrl+n" : "alt+n", () => handleCreateForm()]]);

	return (
		<>
			<Box p="xs" className="boxBackground borderRadiusAll border-bottom-none ">
				<Flex align="center" justify="space-between" gap={4}>
					<KeywordSearch module={module} />
					<CreateButton handleModal={handleCreateForm} text="AddNew" />
				</Flex>
			</Box>
			<Box className="borderRadiusAll border-top-none">
				<DataTable
					classNames={{
						root: tableCss.root,
						table: tableCss.table,
						body: tableCss.body,
						header: tableCss.header,
						footer: tableCss.footer,
						pagination: tableCss.pagination,
					}}
					records={records}
					columns={[
						{
							accessor: "index",
							title: t("S/N"),
							textAlignment: "right",
							sortable: false,
							render: (_item, index) => index + 1,
						},
						{
							accessor: "setting_module_name",
							title: t("ModuleName"),
							sortable: true,
						},
						{
							accessor: "name",
							title: t("Name"),
							sortable: true,
							render: (values) => (
								<Text className="activate-link" fz="xs" onClick={() => handleDataShow(values.id)}>
									{values.name}
								</Text>
							),
						},{
							accessor: "name_bn",
							title: t("NameBangla"),
							sortable: true,

						},
						{
							accessor: "short_code",
							title: t("ShortName"),
							sortable: true,

						},
						{
							accessor: "action",
							title: "",
							textAlign: "right",
							titleClassName: "title-right",
							render: (values) =>
								values.is_private ? null : (
									<Group gap={4} justify="right" wrap="nowrap">
										<Button.Group>
											<Button
												onClick={() => {
													handleEntityEdit(values.id);
													open();
												}}
												variant="filled"
												c="white"
												fw={400}
												size="compact-xs"
												radius="es"
												leftSection={<IconEdit size={12} />}
												className="border-right-radius-none btnPrimaryBg"
											>
												{t("Edit")}
											</Button>
											<ActionIcon
												size="xs"
												onClick={() => handleDelete(values.id)}
												variant="light"
												color="var(--theme-delete-color)"
												radius="es"
												aria-label="Settings"
											>
												<IconTrashX stroke={1.5} />
											</ActionIcon>
										</Button.Group>
									</Group>
								),
						},
					]}
					textSelectionDisabled
					fetching={fetching}
					loaderSize="xs"
					loaderColor="grape"
					height={height - 72}
					onScrollToBottom={handleScrollToBottom}
					scrollViewportRef={scrollRef}
					sortStatus={sortStatus}
					onSortStatusChange={setSortStatus}
					sortIcons={{
						sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
						unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
					}}
				/>
			</Box>
			<DataTableFooter indexData={listData} module={module} />
			<ViewDrawer viewDrawer={viewDrawer} setViewDrawer={setViewDrawer} entityObject={customerObject} />
		</>
	);
}
