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

const PER_PAGE = 50;

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
	const [fetching, setFetching] = useState(false);
	const searchKeyword = useSelector((state) => state.crud.searchKeyword);
	const refetchData = useSelector((state) => state.crud[module].refetching);
	const listData = useSelector((state) => state.crud[module].data);
	const filterData = useSelector((state) => state.crud[module].filterData);

	const [customerObject, setCustomerObject] = useState({});
	const navigate = useNavigate();
	const [viewDrawer, setViewDrawer] = useState(false);

	const [sortStatus, setSortStatus] = useState({
		columnAccessor: "name",
		direction: "asc",
	});

	const [records, setRecords] = useState(sortBy(listData.data, "name"));

	useEffect(() => {
		const data = sortBy(listData.data, sortStatus.columnAccessor);
		setRecords(sortStatus.direction === "desc" ? data.reverse() : data);
	}, [sortStatus, listData.data]);

	const fetchData = async (pageNum = 1, append = false) => {
		if (!hasMore && pageNum > 1) return;

		setFetching(true);
		const value = {
			url: MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR_MODE.INDEX,
			params: {
				term: searchKeyword,
				name: filterData.name,
				page: pageNum,
				offset: PER_PAGE,
			},
			module,
		};

		try {
			const result = await dispatch(getIndexEntityData(value));
			if (result.payload) {
				const newData = result.payload.data;
				const total = result.payload.total;

				// Update hasMore based on whether we've loaded all data
				setHasMore(newData.length === PER_PAGE && pageNum * PER_PAGE < total);

				// If appending, combine with existing data
				if (append && pageNum > 1) {
					dispatch(
						setItemData({
							module,
							data: {
								...listData,
								data: [...listData.data, ...newData],
								total: total,
							},
						})
					);
				}
			}
		} catch (err) {
			console.error("Unexpected error:", err);
		} finally {
			setFetching(false);
		}
	};

	const loadMoreRecords = useCallback(() => {
		if (hasMore && !fetching) {
			const nextPage = page + 1;
			setPage(nextPage);
			fetchData(nextPage, true);
		} else if (!hasMore) {
			console.info("No more records");
		}
	}, [hasMore, fetching, page]);

	// =============== combined logic for data fetching and scroll reset ================
	useEffect(() => {
		if ((!id && (isMounted || refetchData)) || (id && !refetchData)) {
			fetchData(1, false);
			setPage(1);
			setHasMore(true);
			// reset scroll position when data is refreshed
			scrollViewportRef.current?.scrollTo(0, 0);
		}
	}, [dispatch, searchKeyword, filterData, refetchData, isMounted, id]);

	const handleCustomerEdit = (id) => {
		dispatch(setInsertType({ insertType: "update", module }));
		dispatch(
			editEntityData({
				url: `${CORE_DATA_ROUTES.API_ROUTES.PARTICULAR.UPDATE}/${id}`,
				module,
			})
		);
		navigate(`${CORE_DATA_ROUTES.NAVIGATION_LINKS.PARTICULAR.UPDATE}/${id}`);
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
							sortable: true,
							render: (item) => listData.data?.indexOf(item) + 1,
						},
						{
							accessor: "id",
							title: t("ID"),
							textAlignment: "right",
							sortable: true,
							render: (item) => item.id,
						},
						{
							accessor: "name",
							title: t("Name"),
							sortable: true,
							render: (values) => (
								<Text className="activate-link" fz="sm" onClick={() => handleDataShow(values.id)}>
									{values.name}
								</Text>
							),
						},
						{
							accessor: "customer_group",
							title: t("CustomerGroup"),
							sortable: true,
							render: (values) => values.customer_group || "N/A",
						},
						{ accessor: "mobile", title: t("Mobile"), sortable: true },
						{
							accessor: "credit_limit",
							title: t("CreditLimit"),
							sortable: true,
							render: (values) => values.credit_limit,
						},
						{
							accessor: "discount_percent",
							title: t("DiscountPercent"),
							sortable: true,
							render: (values) => values.discount_percent,
						},
						{
							accessor: "action",
							title: "",
							textAlign: "right",
							titleClassName: "title-right",
							render: (values) => (
								<>
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
											<Button
												onClick={() => handleDataShow(values.id)}
												variant="filled"
												c="white"
												bg="var(--theme-primary-color-6)"
												size="compact-xs"
												radius="es"
												fw={400}
												leftSection={<IconEye size={12} />}
												className="border-left-radius-none"
											>
												{t("View")}
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
								</>
							),
						},
					]}
					textSelectionDisabled
					fetching={fetching}
					loaderSize="xs"
					loaderColor="grape"
					height={height - 72}
					onScrollToBottom={loadMoreRecords}
					scrollViewportRef={scrollViewportRef}
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
