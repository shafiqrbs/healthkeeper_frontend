import { Group, Box, ActionIcon, Text, rem, Flex, Button, TextInput, NumberInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconTrashX, IconAlertCircle, IconEdit, IconChevronUp, IconSelector } from "@tabler/icons-react";
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
import tableCss from "@assets/css/Table.module.css";
import inlineInputCss from "@assets/css/InlineInputField.module.css";
import { deleteEntityData, editEntityData, storeEntityData } from "@/app/store/core/crudThunk";
import { setInsertType, setRefetchData } from "@/app/store/core/crudSlice.js";
import { ERROR_NOTIFICATION_COLOR } from "@/constants/index.js";
import { deleteNotification } from "@components/notification/deleteNotification";
import { useEffect, useState } from "react";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll.js";
import { errorNotification } from "@components/notification/errorNotification";

const PER_PAGE = 50;

export default function _Table({ module, open }) {
	const { t } = useTranslation();
	const os = useOs();
	const dispatch = useDispatch();
	const { mainAreaHeight } = useOutletContext();
	const navigate = useNavigate();
	const height = mainAreaHeight - 78;
	const [submitFormData, setSubmitFormData] = useState({});
	const searchKeyword = useSelector((state) => state.crud.searchKeyword);
	const filterData = useSelector((state) => state.crud[module].filterData);
	const listData = useSelector((state) => state.crud[module].data);

	// for infinity table data scroll, call the hook
	const { scrollRef, records, fetching, sortStatus, setSortStatus, handleScrollToBottom } = useInfiniteTableScroll({
		module,
		fetchUrl: MASTER_DATA_ROUTES.API_ROUTES.TREATMENT_TEMPLATES.INDEX,
		filterParams: {
			name: filterData?.name,
			particular_type: "treatment-templates",
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
				url: `${MASTER_DATA_ROUTES.API_ROUTES.TREATMENT_TEMPLATES.VIEW}/${id}`,
				module,
			})
		);
		navigate(`${MASTER_DATA_ROUTES.NAVIGATION_LINKS.TREATMENT_TEMPLATES.INDEX}/${id}`);
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
				url: `${MASTER_DATA_ROUTES.API_ROUTES.TREATMENT_TEMPLATES.DELETE}/${id}`,
				module,
				id,
			})
		);

		if (deleteEntityData.fulfilled.match(res)) {
			dispatch(setRefetchData({ module, refetching: true }));
			deleteNotification(t("DeletedSuccessfully"), ERROR_NOTIFICATION_COLOR);

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
				url: `${MASTER_DATA_ROUTES.API_ROUTES.TREATMENT_TEMPLATES.VIEW}/${id}`,
				module,
			})
		);
		setViewDrawer(true);
	};

	const handleReportFormatTable = (id) => {
		dispatch(
			editEntityData({
				url: `${MASTER_DATA_ROUTES.API_ROUTES.TREATMENT_TEMPLATES.VIEW}/${id}`,
				module,
			})
		);
		navigate(`${MASTER_DATA_ROUTES.NAVIGATION_LINKS.TREATMENT_TEMPLATES.REPORT_FORMAT}/${id}`);
	};

	const handleCreateForm = () => {
		open();
		dispatch(setInsertType({ insertType: "create", module }));
		navigate(MASTER_DATA_ROUTES.NAVIGATION_LINKS.TREATMENT_TEMPLATES.INDEX);
	};

	useEffect(() => {
		if (!records?.length) return;

		const initialFormData = records.reduce((acc, item) => {
			acc[item.id] = {
				name: item.name || "",
				price: item.price || "",
			};

			return acc;
		}, {});

		setSubmitFormData(initialFormData);
	}, [records]);

	const handleDataTypeChange = (rowId, field, value) => {
		setSubmitFormData((prev) => ({
			...prev,
			[rowId]: {
				...prev[rowId],
				[field]: value,
			},
		}));
	};

	const handleRowSubmit = async (rowId) => {
		const formData = submitFormData[rowId];
		if (!formData) return false;

		// 🔎 find original row data
		const originalRow = records.find((r) => r.id === rowId);
		if (!originalRow) return false;

		// ✅ check if there is any change
		const isChanged = Object.keys(formData).some((key) => formData[key] !== originalRow[key]);

		if (!isChanged) {
			// nothing changed → do not submit
			return false;
		}

		const value = {
			url: `${MASTER_DATA_ROUTES.API_ROUTES.TREATMENT_TEMPLATES.INLINE_UPDATE}/${rowId}`,
			data: formData,
			module,
		};
		try {
			await dispatch(storeEntityData(value));
		} catch (error) {
			errorNotification(error.message);
		}
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
							accessor: "category",
							title: t("Category"),
							textAlignment: "right",
							sortable: true,
							render: (item) => item.category,
						},
						{
							accessor: "name",
							title: t("Name"),
							sortable: true,
							render: (item) => (
								<TextInput
									size="xs"
									className={inlineInputCss.inputText}
									placeholder={t("Name")}
									value={submitFormData[item.id]?.name || ""}
									onChange={(event) =>
										handleDataTypeChange(item.id, "name", event.currentTarget.value)
									}
									onBlur={() => handleRowSubmit(item.id)}
								/>
							),
						},
						{
							accessor: "display_name",
							title: t("DisplayName"),
							sortable: true,
							render: (values) => (
								<Text className="activate-link" fz="sm" onClick={() => handleDataShow(values.id)}>
									{values.display_name}
								</Text>
							),
						},

						{
							accessor: "price",
							title: t("Price"),
							sortable: false,
							render: (item) => (
								<NumberInput
									size="xs"
									className={inlineInputCss.inputNumber}
									placeholder={t("Price")}
									value={submitFormData[item.id]?.price || ""}
									onChange={(val) => handleDataTypeChange(item.id, "price", val)}
									onBlur={() => handleRowSubmit(item.id)}
								/>
							),
						},

						{
							accessor: "action",
							title: "",
							textAlign: "right",
							titleClassName: "title-right",
							render: (values) => (
								<Group gap={4} justify="right" wrap="nowrap">
									<Button.Group>
										<Button
											onClick={() => {
												handleEntityEdit(values.id);
												open();
											}}
											variant="filled"
											bg="var(--theme-secondary-color-5)"
											c="white"
											size="xs"
											radius="es"
											leftSection={<IconEdit size={16} />}
											className="border-right-radius-none"
										>
											{t("Edit")}
										</Button>
										<Button
											onClick={() => handleDataShow(values.id)}
											variant="filled"
											c="white"
											bg="var(--theme-primary-color-5)"
											size="xs"
											radius="es"
											className="border-left-radius-none"
										>
											{t("View")}
										</Button>
										<Button
											onClick={() => handleReportFormatTable(values.id)}
											variant="filled"
											c="white"
											bg="var(--theme-warn-color-5)"
											size="xs"
											radius="es"
										>
											{t("Format")}
										</Button>
										<ActionIcon
											onClick={() => handleDelete(values.id)}
											className="action-icon-menu border-left-radius-none"
											variant="light"
											color="var(--theme-delete-color)"
											radius="es"
											ps="les"
											aria-label="Settings"
										>
											<IconTrashX height={18} width={18} stroke={1.5} />
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
