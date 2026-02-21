import { Group, Box, ActionIcon, Text, rem, Flex, Button, TextInput, Select } from "@mantine/core";
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
import { MASTER_DATA_ROUTES } from "@/constants/routes";
import tableCss from "@assets/css/TableAdmin.module.css";
import { deleteEntityData, editEntityData, storeEntityData } from "@/app/store/core/crudThunk";
import { setInsertType, setRefetchData } from "@/app/store/core/crudSlice.js";
import { ERROR_NOTIFICATION_COLOR } from "@/constants/index.js";
import { deleteNotification } from "@components/notification/deleteNotification";
import { useEffect, useState } from "react";
import inlineInputCss from "@assets/css/InlineInputField.module.css";
import { errorNotification } from "@components/notification/errorNotification";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import { CORE_DROPDOWNS, HOSPITAL_DROPDOWNS } from "@/app/store/core/utilitySlice";
import usePagination from "@hooks/usePagination";
import UserSyncButton from "@components/buttons/UserSyncButton";
import {getDataWithoutStore} from "@/services/apiService";

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

	// for infinity table data scroll, call the hook
	const { records, fetching, sortStatus, setSortStatus, handlePageChange, page, total, perPage } = usePagination({
		module,
		fetchUrl: MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR.INDEX,
		filterParams: {
			name: filterData?.name,
			particular_type: "nurse",
			user_group: "nurse",
			term: searchKeyword,
		},
		perPage: PER_PAGE,
		sortByKey: "name",
	});

	const handleSyncUser = async () => {
		const res = await getDataWithoutStore({
			url: `${MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR.USER_SYNC}?user_group=nurse`,
		});
	};

	const [viewDrawer, setViewDrawer] = useState(false);

	const handleEntityEdit = (id) => {
		dispatch(setInsertType({ insertType: "update", module }));
		dispatch(
			editEntityData({
				url: `${MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR.VIEW}/${id}`,
				module,
			})
		);
		navigate(`${MASTER_DATA_ROUTES.NAVIGATION_LINKS.PARTICULAR.INDEX}/${id}`);
	};

	const { data: warehouseDropdown } = useGlobalDropdownData({
		path: CORE_DROPDOWNS.WAREHOUSE.PATH,
		utility: CORE_DROPDOWNS.WAREHOUSE.UTILITY,
	});

	const { data: getParticularUnits } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.PARTICULAR_UNIT_MODE.PATH,
		params: { "dropdown-type": HOSPITAL_DROPDOWNS.PARTICULAR_UNIT_MODE.TYPE },
		utility: HOSPITAL_DROPDOWNS.PARTICULAR_UNIT_MODE.UTILITY,
	});

	const { data: getOpdRooms } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.PARTICULAR_OPD_ROOM.PATH,
		params: { "dropdown-type": HOSPITAL_DROPDOWNS.PARTICULAR_OPD_ROOM.TYPE },
		utility: HOSPITAL_DROPDOWNS.PARTICULAR_OPD_ROOM.UTILITY,
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
				url: `${MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR.DELETE}/${id}`,
				module,
				id,
			})
		);

		if (deleteEntityData.fulfilled.match(res)) {
			dispatch(setRefetchData({ module, refetching: true }));
			deleteNotification(t("DeletedSuccessfully"), ERROR_NOTIFICATION_COLOR);
			navigate(MASTER_DATA_ROUTES.NAVIGATION_LINKS.NURSE);
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
				url: `${MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR.VIEW}/${id}`,
				module,
			})
		);
		setViewDrawer(true);
	};

	const handleCreateForm = () => {
		open();
		dispatch(setInsertType({ insertType: "create", module }));
		navigate(MASTER_DATA_ROUTES.NAVIGATION_LINKS.NURSE.INDEX);
	};

	useEffect(() => {
		if (!records?.length) return;
		const initialFormData = records.reduce((acc, item) => {
			acc[item.id] = {
				name: item.name || "",
				unit_id: item.unit_id || "",
				opd_room_id: item.opd_room_id || "",
				store_id: item.store_id || "",
			};
			return acc;
		}, {});

		setSubmitFormData(initialFormData);
	}, [records]);

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

	useHotkeys([[os === "macos" ? "ctrl+n" : "alt+n", () => handleCreateForm()]]);

	return (
		<>
			<Box p="xs" className="boxBackground borderRadiusAll border-bottom-none ">
				<Flex align="center" justify="space-between" gap={4}>
					<KeywordSearch module={module} />
					<UserSyncButton handleModal={handleSyncUser} text="NurseSync" />
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
						},
						{
							accessor: "unit_id",
							title: t("UnitName"),
							render: (item) => (
								<Select
									size="xs"
									className={inlineInputCss.inputText}
									placeholder={t("SelectUnitName")}
									data={getParticularUnits}
									value={String(submitFormData[item.id]?.unit_id) ?? ""}
									onChange={(val) => handleFieldChange(item.id, "unit_id", val)}
									rightSection={updatingRows[item.id]}
								/>
							),
						},
						{
							accessor: "opd_room_id",
							title: t("OPDRoom"),
							render: (item) => (
								<Select
									size="xs"
									className={inlineInputCss.inputText}
									placeholder={t("SelectOpdRoom")}
									data={getOpdRooms}
									value={String(submitFormData[item.id]?.opd_room_id) ?? ""}
									onChange={(val) => handleFieldChange(item.id, "opd_room_id", val)}
									rightSection={updatingRows[item.id]}
								/>
							),
						},

						{
							accessor: "store_id",
							title: t("Store"),
							render: (item) => (
								<Select
									size="xs"
									className={inlineInputCss.inputText}
									placeholder={t("SelectStore")}
									data={warehouseDropdown}
									value={String(submitFormData[item.id]?.store_id) || ""}
									onChange={(val) => {
										handleFieldChange(item.id, "store_id", val);
									}}
								/>
							),
						},

						{
							title: "",
							textAlign: "right",
							titleClassName: "title-right",
							render: (values) => (
								<Group gap={4} justify="right" wrap="nowrap">
									<Button.Group>
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
					height={height - 22}
					page={page}
					totalRecords={total}
					recordsPerPage={perPage}
					onPageChange={handlePageChange}
					sortStatus={sortStatus}
					onSortStatusChange={setSortStatus}
					sortIcons={{
						sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
						unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
					}}
				/>
			</Box>

			<ViewDrawer viewDrawer={viewDrawer} setViewDrawer={setViewDrawer} module={module} />
		</>
	);
}
