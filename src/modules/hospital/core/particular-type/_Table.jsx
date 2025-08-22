import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import {Group, Box, ActionIcon, Text, rem, Flex, Button, Stack, Select, Checkbox, Center} from "@mantine/core";
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
import { DATA_TYPES } from "@/constants";
import SelectForm from "@components/form-builders/SelectForm";
import {storeEntityData} from "@/app/store/core/crudThunk";
import {successNotification} from "@components/notification/successNotification";
import {errorNotification} from "@components/notification/errorNotification";
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

	const { data: getParticularOperationModes } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.PARTICULAR_OPERATION_MODE.PATH,
		params: { "dropdown-type": HOSPITAL_DROPDOWNS.PARTICULAR_OPERATION_MODE.TYPE },
		utility: HOSPITAL_DROPDOWNS.PARTICULAR_OPERATION_MODE.UTILITY,
	});

	const [records, setRecords] = useState();

	const fetchData = async (pageNum = 1, append = false) => {
		setFetching(true);
		const value = {
			url: MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR_TYPE.INDEX,
			module,
		};
		try {
			const result = await dispatch(getIndexEntityData(value)).unwrap();
			setRecords(result?.data?.data);
		} catch (err) {
			console.error("Unexpected error:", err);
		} finally {
			setFetching(false);
		}
	};
	useEffect(()=>{
		fetchData()
	},[]);
	// =============== combined logic for data fetching and scroll reset ================

	const form = useForm({
		initialValues: {
			mode_id: "",
		},
	});

	const [submitFormData, setSubmitFormData] = useState({});
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
		if (!formData) return;
		formData.particular_type_id = rowId;
		try {
			//setIsLoading(true);
			const value = {
				url: MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR_TYPE.CREATE,
				data: formData,
				module,
			};
			const resultAction = await dispatch(storeEntityData(value));
			if (storeEntityData.rejected.match(resultAction)) {
				const fieldErrors = resultAction.payload.errors;
				if (fieldErrors) {
					const errorObject = {};
					Object.keys(fieldErrors).forEach((key) => {
						errorObject[key] = fieldErrors[key][0];
					});
					form.setErrors(errorObject);
				}
			} else if (storeEntityData.fulfilled.match(resultAction)) {
				successNotification(t("InsertSuccessfully"),SUCCESS_NOTIFICATION_COLOR);
			}
		} catch (error) {
			errorNotification(error.message,ERROR_NOTIFICATION_COLOR);
		} finally {
			//setIsLoading(false);
		}
		console.log(formData)
	};

	console.log(getParticularOperationModes)
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
								<>
								<Text className="activate-link" fz="sm" onClick={() => handleDataShow(values.id)}>
									{values.name}
									<input type={"hidden"} name={'particular_type_id'} id={'particular_type_id'} value={values.id} />
								</Text>
								</>
							),
						},
						{
							accessor: "data_type",
							title: t("DataType"),
							width: "220px",
							render: (item) => (
								<Select
									placeholder= "SelectDataType"
									data={DATA_TYPES}
									value={submitFormData[item.id]?.data_type || ""}
									onChange={(val) => handleDataTypeChange(item.id, "data_type", val)}
								/>
							),
						},
						{
							accessor: "operation_modes",
							title: t("Operation Modes"),
							width: "220px",
							render: (item) => (
								<Stack>
									{getParticularOperationModes.map((mode) => (
										<Checkbox
											key={mode.id}
											label={mode.label}
											size="sm"
											checked={submitFormData[item.id]?.operation_modes?.includes(mode.value) || false}
											onChange={(e) => {
												const checked = e.currentTarget.checked;
												setSubmitFormData((prev) => {
													const prevModes = prev[item.id]?.operation_modes || [];
													return {
														...prev,
														[item.id]: {
															...prev[item.id],
															operation_modes: checked
																? [...prevModes, mode.value]
																: prevModes.filter((m) => m !== mode.value),
														},
													};
												});
											}}
										/>
									))}
								</Stack>
							),
						},

						{
							accessor: "action",
							title: "",
							render: (item) => (
								<Center>
									<Button
										onClick={() => handleRowSubmit(item.id)}
										variant="filled"
										size="xs"
										className={'btnPrimaryBg'}
										leftSection={<IconDeviceFloppy size={16} />}
									>
										{t("Save")}
									</Button>
								</Center>
							),
						},
						,
					]}
					fetching={fetching}
					loaderSize="xs"
					loaderColor="grape"
					height={height}
				/>
			</Box>
			<ViewDrawer viewDrawer={viewDrawer} setViewDrawer={setViewDrawer} entityObject={customerObject} />
		</>
	);
}
