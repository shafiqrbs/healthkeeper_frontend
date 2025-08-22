import { useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { Box, Text, Button, Stack, Select, Checkbox, Center } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import { useHotkeys } from "@mantine/hooks";
import { getIndexEntityData } from "@/app/store/core/crudThunk.js";
import tableCss from "@assets/css/Table.module.css";
import ViewDrawer from "./__ViewDrawer.jsx";
import { SUCCESS_NOTIFICATION_COLOR, ERROR_NOTIFICATION_COLOR } from "@/constants/index.js";
import { useOs } from "@mantine/hooks";
import { MASTER_DATA_ROUTES } from "@/constants/routes.js";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import { HOSPITAL_DROPDOWNS } from "@/app/store/core/utilitySlice";
import { useForm } from "@mantine/form";
import { DATA_TYPES } from "@/constants";
import SelectForm from "@components/form-builders/SelectForm";
import { storeEntityData } from "@/app/store/core/crudThunk";
import { successNotification } from "@components/notification/successNotification";
import { errorNotification } from "@components/notification/errorNotification";
import { API_KEY } from "@/constants/index";
const PER_PAGE = 50;

export default function _Table({ module }) {
	const { mainAreaHeight } = useOutletContext();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const height = mainAreaHeight - 48;
	const os = useOs();
	const [fetching, setFetching] = useState(false);
	const listData = useSelector((state) => state.crud[module].data);

	const [customerObject, setCustomerObject] = useState({});
	const [viewDrawer, setViewDrawer] = useState(false);

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
	useEffect(() => {
		fetchData();
	}, []);
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
			/*const value = {
				url: MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR_TYPE.CREATE,
				data: formData,
				module,
			};*/

			const response = await fetch("http://www.tbd.local/api/hospital/core/particular-type", {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*", // not really needed on client
					"X-Api-Key": "poskeeper",
					"X-Api-User": 15,
				},
				body: JSON.stringify(formData),
			});
			const result = await response.json();

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
				successNotification(t("InsertSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
			}
		} catch (error) {
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		} finally {
			//setIsLoading(false);
		}
		console.log(formData);
	};

	console.log(getParticularOperationModes);
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
										<input
											type={"hidden"}
											name={"particular_type_id"}
											id={"particular_type_id"}
											value={values.id}
										/>
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
									placeholder="SelectDataType"
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
											checked={
												submitFormData[item.id]?.operation_modes?.includes(mode.value) || false
											}
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
										className={"btnPrimaryBg"}
										leftSection={<IconDeviceFloppy size={16} />}
									>
										{t("Save")}
									</Button>
								</Center>
							),
						},
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
