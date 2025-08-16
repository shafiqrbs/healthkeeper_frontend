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
	IconSelector,IconDeviceFloppy
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import KeywordSearch from "@modules/filter/KeywordSearch";
import { modals } from "@mantine/modals";
import { useHotkeys, useMounted } from "@mantine/hooks";
import { deleteEntityData, getIndexEntityData, editEntityData } from "@/app/store/core/crudThunk.js";
import { setRefetchData, setInsertType, setItemData } from "@/app/store/core/crudSlice.js";
import tableCss from "@assets/css/Table.module.css";
import ViewDrawer from "./__ViewDrawer.jsx";
import { notifications } from "@mantine/notifications";
import { getCustomers } from "@/common/utils";
import { SUCCESS_NOTIFICATION_COLOR, ERROR_NOTIFICATION_COLOR } from "@/constants/index.js";
import CreateButton from "@components/buttons/CreateButton.jsx";
import DataTableFooter from "@components/tables/DataTableFooter.jsx";
import { sortBy } from "lodash";
import { useOs } from "@mantine/hooks";
import { MASTER_DATA_ROUTES } from "@/constants/routes.js";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import {HOSPITAL_DROPDOWNS} from "@/app/store/core/utilitySlice";
import { useForm } from "@mantine/form";
import SelectForm from "@components/form-builders/SelectForm";
const PER_PAGE = 50;

export default function _Table({ module, open, close }) {
	const isMounted = useMounted();
	const { mainAreaHeight } = useOutletContext();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { id } = useParams();
	const height = mainAreaHeight - 48; //TabList height 104
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

	const { data: particularTypeDropdown } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.PARTICULAR_TYPE.PATH,
		utility: HOSPITAL_DROPDOWNS.PARTICULAR_TYPE.UTILITY,
	});

	const [records, setRecords] = useState(sortBy(listData.data, "name"));

	const fetchData = async (pageNum = 1, append = false) => {
		setFetching(true);
		const value = {
			url: MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR_TYPE.INDEX,
			module,
		};
		try {
			const result = await dispatch(getIndexEntityData(value));

		} catch (err) {
			console.error("Unexpected error:", err);
		} finally {
			setFetching(false);
		}
	};

	// =============== combined logic for data fetching and scroll reset ================

	const form = useForm({
		initialValues: {
			mode_id: "",
		},
	});

	const handleDomainTypeChange = async (id, value) => {
		setDomainTypeMap((prev) => ({ ...prev, [id]: value }));

		try {
			const payload = {
				url: "domain/b2b/inline-update/domain",
				data: {
					domain_id: id,
					field_name: "domain_type",
					value,
				},
			};
			await dispatch(storeEntityData(payload));
			setRefresh(true);
		} catch (error) {
			console.error("Domain type update failed", error);
			showNotificationComponent(t("Update failed"), "red");
		}
	};


	useHotkeys([[os === "macos" ? "ctrl+n" : "alt+n", () => handleCreateForm()]]);

	return (
		<>

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
							render: (item) => listData.data?.indexOf(item) + 1,
						},

						{
							accessor: "name",
							title: t("Name"),
							render: (values) => (
								<Text className="activate-link" fz="sm" onClick={() => handleDataShow(values.id)}>
									{values.name}
								</Text>
							),
						},
						{
							accessor: "data_type",
							title: t("DataType"),
							width: "220px",
							textAlign: "center",
							render: (item) => (
								<SelectForm
									form={form}
									tooltip={t("ParticularTypeValidateMessage")}
									placeholder={t("ParticularType")}
									name="data_type"
									id="data_type"
									nextField="category_id"
									required={true}
									value={form.values.particular_type_id}
									dropdownValue={particularTypeDropdown}
								/>
							),
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
												onClick={() => handleDataShow(values.id)}
												variant="filled"
												c="white"
												bg="var(--theme-primary-color-6)"
												size="xs"
												radius="es"
												leftSection={<IconDeviceFloppy size={16} />}
												className="border-left-radius-none"
											>
												{t("Save")}
											</Button>
										</Button.Group>
									</Group>
								</>
							),
						},
					]}
					fetching={fetching}
					loaderSize="xs"
					loaderColor="grape"
					height={height}
					scrollViewportRef={scrollViewportRef}
				/>
			</Box>
			<ViewDrawer viewDrawer={viewDrawer} setViewDrawer={setViewDrawer} entityObject={customerObject} />
		</>
	);
}
