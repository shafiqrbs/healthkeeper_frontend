import {Group, Box, ActionIcon, Text, rem, Flex, Button, TextInput, NumberInput, Select, Checkbox} from "@mantine/core";
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
import { MASTER_DATA_ROUTES } from "@/constants/routes";
import tableCss from "@assets/css/TableAdmin.module.css";
import inlineInputCss from "@assets/css/InlineInputField.module.css";
import { deleteEntityData, editEntityData, storeEntityData } from "@/app/store/core/crudThunk";
import { setInsertType, setRefetchData } from "@/app/store/core/crudSlice.js";
import { ERROR_NOTIFICATION_COLOR } from "@/constants/index.js";
import { deleteNotification } from "@components/notification/deleteNotification";
import { useEffect, useState } from "react";
import { errorNotification } from "@components/notification/errorNotification";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import { HOSPITAL_DROPDOWNS } from "@/app/store/core/utilitySlice";
import usePagination from "@hooks/usePagination";

const PER_PAGE = 25;

export default function _Table({ module, open }) {
	const { t } = useTranslation();
	const os = useOs();
	const dispatch = useDispatch();
	const { mainAreaHeight } = useOutletContext();
	const navigate = useNavigate();
	const height = mainAreaHeight - 78;
	const [submitFormData, setSubmitFormData] = useState({});
	const [updatingRows, setUpdatingRows] = useState({});
	const searchKeyword = useSelector((state) => state.crud.searchKeyword);
	const filterData = useSelector((state) => state.crud[module].filterData);

	const { records, fetching, sortStatus, setSortStatus, handlePageChange, page, total, perPage } = usePagination({
		module,
		fetchUrl: MASTER_DATA_ROUTES.API_ROUTES.INVESTIGATION.INDEX,
		filterParams: {
			name: filterData?.name,
			particular_type: "investigation",
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
				url: `${MASTER_DATA_ROUTES.API_ROUTES.INVESTIGATION.VIEW}/${id}`,
				module,
			})
		);
		navigate(`${MASTER_DATA_ROUTES.NAVIGATION_LINKS.INVESTIGATION.INDEX}/${id}`);
	};

	const { data: roomDropdown } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.PARTICULAR_MODE_DIAGNOSTIC_ROOM.PATH,
		utility: HOSPITAL_DROPDOWNS.PARTICULAR_MODE_DIAGNOSTIC_ROOM.UTILITY,
		params: { "dropdown-type": HOSPITAL_DROPDOWNS.PARTICULAR_MODE_DIAGNOSTIC_ROOM.TYPE },
	});

	const { data: departmentDropdown } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.PARTICULAR_MODE_DIAGNOSTIC_DEPARTMENT.PATH,
		utility: HOSPITAL_DROPDOWNS.PARTICULAR_MODE_DIAGNOSTIC_DEPARTMENT.UTILITY,
		params: { "dropdown-type": HOSPITAL_DROPDOWNS.PARTICULAR_MODE_DIAGNOSTIC_DEPARTMENT.TYPE },
	});

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
				url: `${MASTER_DATA_ROUTES.API_ROUTES.INVESTIGATION.DELETE}/${id}`,
				module,
				id,
			})
		);

		if (deleteEntityData.fulfilled.match(res)) {
			dispatch(setRefetchData({ module, refetching: true }));
			deleteNotification(t("DeletedSuccessfully"), ERROR_NOTIFICATION_COLOR);
			navigate(MASTER_DATA_ROUTES.NAVIGATION_LINKS.BED);
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
				url: `${MASTER_DATA_ROUTES.API_ROUTES.INVESTIGATION.VIEW}/${id}`,
				module,
			})
		);
		setViewDrawer(true);
	};

	const handleReportFormatTable = (id) => {
		dispatch(
			editEntityData({
				url: `${MASTER_DATA_ROUTES.API_ROUTES.INVESTIGATION.VIEW}/${id}`,
				module,
			})
		);
		navigate(`${MASTER_DATA_ROUTES.NAVIGATION_LINKS.INVESTIGATION.REPORT_FORMAT}/${id}`);
	};

	const handleCreateForm = () => {
		open();
		dispatch(setInsertType({ insertType: "create", module }));
		navigate(MASTER_DATA_ROUTES.NAVIGATION_LINKS.INVESTIGATION.INDEX);
	};

	useEffect(() => {
		if (!records?.length) return;
		const initialFormData = records.reduce((acc, item) => {
			acc[item.id] = {
				name: item.name || "",
				price: item.price?.toString() || 0,
				is_available: item?.is_available ?? false,
				status: item?.status ?? false,
				report_format: item?.report_format ?? false,
				is_custom_report: item?.is_custom_report ?? false,
				diagnostic_department_id: item.diagnostic_department_id?.toString() ?? "",
				diagnostic_room_id: item.diagnostic_room_id?.toString() ?? "",
			};
			return acc;
		}, {});

		setSubmitFormData(initialFormData);
	}, [records]);

	const handleDataTypeChange = (rowId, field, value, submitNow = false) => {
		const updatedRow = {
			...submitFormData[rowId],
			[field]: value,
		};

		setSubmitFormData((prev) => ({
			...prev,
			[rowId]: updatedRow,
		}));

		// optional immediate submit (for Select)
		if (submitNow) {
			handleRowSubmit(rowId, updatedRow);
		}
	};

	const handleFieldChange = async (rowId, field, value) => {
		setSubmitFormData((prev) => ({
			...prev,
			[rowId]: { ...prev[rowId], [field]: value },
		}));

		setUpdatingRows((prev) => ({ ...prev, [rowId]: true }));

		try {
			await dispatch(
				storeEntityData({
					url: `${MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR.INLINE_UPDATE}/${rowId}`,
					data: { [field]: value },
					module,
				})
			);
		} catch (error) {
			errorNotification(error.message);
		} finally {
			setUpdatingRows((prev) => ({ ...prev, [rowId]: false }));
		}
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
			url: `${MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR.INLINE_UPDATE}/${rowId}`,
			data: formData,
			module,
		};

		try {
			const resultAction = await dispatch(storeEntityData(value));
			console.log(resultAction);
		} catch (error) {
			console.error(error);
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
								<Text className="activate-link" fz="xs" onClick={() => handleDataShow(values.id)}>
									{values.display_name}
								</Text>
							),
						},
						/*{
							accessor: "diagnostic_department_id",
							title: t("Department"),
							render: (item) => (
								<Select
									size="xs"
									className={inlineInputCss.inputText}
									placeholder={t("Department")}
									data={departmentDropdown}
									value={submitFormData[item.id]?.diagnostic_department_id ?? ""}
									onChange={(val) => {
										handleDataTypeChange(item.id, "diagnostic_department_id", val, true);
									}}
									onBlur={() => handleRowSubmit(item.id)}
									rightSection={updatingRows[item.id]}
								/>
							),
						},*/
						{
							accessor: "diagnostic_department",
							title: t("Department"),
							textAlignment: "right",
							sortable: true,
							render: (item) => item.diagnostic_department,
						},
						{
							accessor: "diagnostic_room_id",
							title: t("Room"),
							sortable: true,
							width:80,
							render: (item) => (
								<Select
									size="xs"
									className={inlineInputCss.inputText}
									placeholder={t("Room")}
									data={roomDropdown}
									value={submitFormData[item.id]?.diagnostic_room_id ?? ""}
									onChange={(val) => {
										handleDataTypeChange(item.id, "diagnostic_room_id", val, true);
									}}
									onBlur={() => handleRowSubmit(item.id)}
									rightSection={updatingRows[item.id]}
								/>
							),
						},

						{
							accessor: "price",
							title: t("Price"),
							width:100,
							sortable: true,
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
							accessor: "status",
							title: t("Status"),
							render: (item) => (
								<Checkbox
									key={item.id}
									size="sm"
									checked={submitFormData[item.id]?.status ?? false}
									onChange={(val) => handleFieldChange(item.id, "status", val.currentTarget.checked)}
								/>
							),
						},
						{
							accessor: "is_available",
							title: t("Available"),
							sortable: true,
							render: (item) => (item.is_available ? "Yes" : "No"),
						},

						{
							accessor: "is_report_format",
							title: t("Report"),
							sortable: true,
							render: (item) => (item.is_report_format ? "Yes" : "No"),
						},

						{
							accessor: "is_custom_report",
							title: t("CustomReport"),
							sortable: true,
							render: (item) => (item.is_custom_report ? "Yes" : "No"),
						},

						{
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
										<>
										{ values?.is_report_format == 1 && (
										<Button
											onClick={() => handleReportFormatTable(values.id)}
											variant="filled"
											c="white"
											bg="var(--theme-warn-color-5)"
											fw={400}
											size="compact-xs"
											radius="es"
										>
											{t("Format")}
										</Button>
										)}
											</>
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
					height={height - 32}
					totalRecords={total}
					recordsPerPage={perPage}
					page={page}
					onPageChange={handlePageChange}
					sortStatus={sortStatus}
					onSortStatusChange={setSortStatus}
					sortIcons={{
						sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
						unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
					}}
					scrollAreaProps={{ type: "never" }}
				/>
			</Box>
			<ViewDrawer viewDrawer={viewDrawer} setViewDrawer={setViewDrawer} module={module} />
		</>
	);
}
