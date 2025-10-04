import { Group, Box, ActionIcon, Text, rem, Flex, Button } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconTrashX, IconAlertCircle, IconEdit, IconEye, IconChevronUp, IconSelector } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import { modals } from "@mantine/modals";
import KeywordSearch from "@modules/filter/KeywordSearch";
import ViewDrawer from "./__ViewDrawer";
import { notifications } from "@mantine/notifications";
import { useOs, useHotkeys } from "@mantine/hooks";
import CreateButton from "@components/buttons/CreateButton";
import DataTableFooter from "@components/tables/DataTableFooter";
import { MASTER_DATA_ROUTES } from "@/constants/routes";
import tableCss from "@assets/css/TableAdmin.module.css";
import { deleteEntityData, editEntityData } from "@/app/store/core/crudThunk";
import { setInsertType, setRefetchData } from "@/app/store/core/crudSlice.js";
import { ERROR_NOTIFICATION_COLOR } from "@/constants/index.js";
import { deleteNotification } from "@components/notification/deleteNotification";
import { useState } from "react";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll.js";

const PER_PAGE = 50;

export default function _Table({ module, open }) {
	const { t } = useTranslation();
	const os = useOs();
	const dispatch = useDispatch();
	const { mainAreaHeight } = useOutletContext();
	const navigate = useNavigate();
	const height = mainAreaHeight - 78;
	const searchKeyword = useSelector((state) => state.crud.searchKeyword);
	const filterData = useSelector((state) => state.crud[module].filterData);
	const listData = useSelector((state) => state.crud[module].data);

	// for infinity table data scroll, call the hook
	const { scrollRef, records, fetching, sortStatus, setSortStatus, handleScrollToBottom } = useInfiniteTableScroll({
		module,
		fetchUrl: MASTER_DATA_ROUTES.API_ROUTES.STORE.INDEX,
		filterParams: {
			name: filterData?.name,
			term: searchKeyword,
		},
		perPage: PER_PAGE,
		sortByKey: "name",
	});

	const [viewDrawer, setViewDrawer] = useState(false);

	const handleEntityEdit = (id) => {
		dispatch(setInsertType({ insertType: "update", module }));
		dispatch(
			editEntityData({
				url: `${MASTER_DATA_ROUTES.API_ROUTES.STORE.VIEW}/${id}`,
				module,
			})
		);
		navigate(`${MASTER_DATA_ROUTES.NAVIGATION_LINKS.STORE.INDEX}/${id}`);
	};

	const handleDelete = (id) => {
		modals.openConfirmModal({
			title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
			labels: { confirm: "Confirm", cancel: "Cancel" },
			confirmProps: { color: "var(--theme-delete-color)" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleDeleteSuccess(id),
		});
	};

	const handleDeleteSuccess = async (id) => {
		const res = await dispatch(
			deleteEntityData({
				url: `${MASTER_DATA_ROUTES.API_ROUTES.STORE.DELETE}/${id}`,
				module,
				id,
			})
		);

		if (deleteEntityData.fulfilled.match(res)) {
			dispatch(setRefetchData({ module, refetching: true }));
			deleteNotification(t("DeletedSuccessfully"), ERROR_NOTIFICATION_COLOR);
			navigate(MASTER_DATA_ROUTES.NAVIGATION_LINKS.STORE);
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
		dispatch(
			editEntityData({
				url: `${MASTER_DATA_ROUTES.API_ROUTES.STORE.VIEW}/${id}`,
				module,
			})
		);
		setViewDrawer(true);
	};

	const handleCreateForm = () => {
		open();
		dispatch(setInsertType({ insertType: "create", module }));
		navigate(MASTER_DATA_ROUTES.NAVIGATION_LINKS.STORE.INDEX);
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
							accessor: "name",
							title: t("Name"),
							sortable: true,
							render: (values) => (
								<Text className="activate-link" fz="xs" onClick={() => handleDataShow(values.id)}>
									{values.name}
								</Text>
							),
						},
						{
							accessor: "action",
							title: "",
							textAlign: "right",
							titleClassName: "title-right",
							render: (values) =>
								values.is_default ? null : (
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
			<ViewDrawer viewDrawer={viewDrawer} setViewDrawer={setViewDrawer} module={module} />
		</>
	);
}
