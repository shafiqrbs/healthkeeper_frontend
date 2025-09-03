import { useEffect,useState } from "react";
import {
	Group,
	Box,
	ActionIcon,
	Text,
	rem,
	Flex,
	Button,
	Grid,
	Stack,
	Title,
	Select,
	Checkbox,
	Center,
	TextInput
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
	IconTrashX,
	IconAlertCircle,
	IconEdit,
	IconEye,
	IconChevronUp,
	IconSelector, IconDeviceFloppy,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { modals } from "@mantine/modals";
import KeywordSearch from "@modules/filter/KeywordSearch";
import ViewDrawer from "./__ViewDrawer";
import { notifications } from "@mantine/notifications";
import { useOs, useHotkeys } from "@mantine/hooks";
import CreateButton from "@components/buttons/CreateButton";
import DataTableFooter from "@components/tables/DataTableFooter";
import {HOSPITAL_DATA_ROUTES, MASTER_DATA_ROUTES} from "@/constants/routes";
import tableCss from "@assets/css/Table.module.css";
import {
	deleteEntityData,
	editEntityData, getIndexEntityData, storeEntityData,
} from "@/app/store/core/crudThunk";
import {
	setInsertType,
	setRefetchData,
} from "@/app/store/core/crudSlice.js";
import {
	ERROR_NOTIFICATION_COLOR,
} from "@/constants/index.js";
import { deleteNotification } from "@components/notification/deleteNotification";

import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll.js";
import InputForm from "@components/form-builders/InputForm";
import {useForm} from "@mantine/form";
import {getVendorFormInitialValues} from "@modules/hospital/emergency/helpers/request";
import {showNotificationComponent} from "@components/core-component/showNotificationComponent";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import SelectForm from "@components/form-builders/SelectForm";
import {DATA_TYPES, SUCCESS_NOTIFICATION_COLOR} from "@/constants/index";
import {successNotification} from "@components/notification/successNotification";
import {errorNotification} from "@components/notification/errorNotification";
import {getInitialReportValues} from "@modules/hospital/core/investigation/helpers/request";

export default function _ReportFormatTable({ module, open }) {
	const { t } = useTranslation();
	const os = useOs();
	const dispatch = useDispatch();
	const { mainAreaHeight } = useOutletContext();
	const navigate = useNavigate();
	const { id } = useParams();
	const height = mainAreaHeight - 78;
	const entityObject = useSelector((state) => state.crud[module].editData);
	const [records, setRecords] = useState([]);
	const [fetching, setFetching] = useState(false);
	const [submitFormData, setSubmitFormData] = useState({});

	useEffect(() => {
		fetchData()
	}, []);

	const fetchData = async () => {
		const value = {
			url: `${MASTER_DATA_ROUTES.API_ROUTES.INVESTIGATION.VIEW}/${id}`,
			module,
		};
		try {
			const result = await dispatch(editEntityData(value)).unwrap();
			console.log("API result:", result.data);
			setRecords(result?.data || []);
		} catch (err) {
			console.error("Unexpected error:", err);
		}
	};
	const entityData = records?.data?.report_format;

	const form = useForm(getInitialReportValues(t));
	const [showUserData, setShowUserData] = useState(false);

	const handleSubmit = (values) => {
		modals.openConfirmModal({
			title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
			labels: { confirm: t("Submit"), cancel: t("Cancel") },
			confirmProps: { color: "red" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleConfirmModal(values),
		});
	};
	async function handleConfirmModal(values) {
		try {
			setIsLoading(true);
			const value = {
				url: MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR.CREATE,
				data: values,
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
				form.reset();
				close(); // close the drawer
				setIndexData(null);
				dispatch(setRefetchData({ module, refetching: true }));
				successNotification(t("InsertSuccessfully"),SUCCESS_NOTIFICATION_COLOR);
			}
		} catch (error) {
			errorNotification(error.message,ERROR_NOTIFICATION_COLOR);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		if (!entityData?.length) return;
		const initialFormData = entityData.reduce((acc, item) => {
			/*const modes = Array.from(
				new Set((item.particular_matrix || []).map(p => p.particular_mode_id))
			);
			*/
			acc[item.id] = {
				name: item.name || "",
				parent_name: item.parent_name || "",
				unit_name: item.unit || "",
				reference_value: item.reference_value || "",
				sample_value: item.sample_value || "",
			};
			return acc;
		}, {});

		setSubmitFormData(initialFormData);
	}, [entityData]);

    const handleDataTypeChange = (rowId, field, value) => {
        setSubmitFormData(prev => ({
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
		console.log(formData)
		/*formData.particular_type_id = rowId;
		const value = {
			url: MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR_TYPE.CREATE,
			data: formData,
			module,
		};

		try {
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
			errorNotification(error.message);
		}*/
	};

	return (
		<>

			<Box className=" border-top-none">
				<Grid w="100%" columns={24}>
					<Grid.Col span={16}>
						<DataTable
							classNames={{
								root: tableCss.root,
								table: tableCss.table,
								body: tableCss.body,
								header: tableCss.header,
								footer: tableCss.footer,
							}}
							records={entityData}
							columns={[
								{
									accessor: "index",
									title: t("S/N"),
									textAlignment: "right",
									render: (item) => entityData?.indexOf(item) + 1,
								},
                                {
                                    accessor: "name",
                                    title: t("Name"),
                                    render: (item) => (
                                        <TextInput
                                            placeholder="SelectDataType"
                                            value={submitFormData[item.id]?.name || ""}
                                            onChange={(val) => handleDataTypeChange(item.id, "name", val.target.value)}
                                            onBlur={() => handleRowSubmit(item.id)}
                                        />
                                    ),
                                },
                                {
                                    accessor: "unit",
                                    title: t("UnitName"),
                                    render: (item) => (
                                        <TextInput
                                            placeholder="SelectDataType"
                                            value={submitFormData[item.id]?.unit || ""}
                                            onChange={(val) => handleDataTypeChange(item.id, "unit", val.target.value)}
                                            onBlur={() => handleRowSubmit(item.id)}
                                        />
                                    ),
                                },
                                {
                                    accessor: "parent_name",
                                    title: t("ParentName"),
                                    render: (item) => (
                                        <Select
                                            placeholder="SelectDataType"
                                            data={['Test-1', 'Test-2', 'Test-3']}
                                            value={submitFormData[item.id]?.parent_name || ""}
                                            onChange={(val) => {
                                                handleDataTypeChange(item.id, "parent_name", val);
                                                handleRowSubmit(item.id);
                                            }}
                                        />
                                    ),
                                },
                                {
                                    accessor: "sample_value",
                                    title: t("SampleValue"),
                                    render: (item) => (
                                        <TextInput
                                            placeholder="SelectDataType"
                                            value={submitFormData[item.id]?.sample_value || ""}
                                            onChange={(val) => handleDataTypeChange(item.id, "sample_value", val.target.value)}
                                            onBlur={() => handleRowSubmit(item.id)}
                                        />
                                    ),
                                },
                                {
                                    accessor: "reference_value",
                                    title: t("ReferenceValue"),
                                    render: (item) => (
                                        <TextInput
                                            placeholder="SelectDataType"
                                            value={submitFormData[item.id]?.reference_value || ""}
                                            onChange={(val) => handleDataTypeChange(item.id, "reference_value", val.target.value)}
                                            onBlur={() => handleRowSubmit(item.id)}
                                        />
                                    ),
                                },
								{
									accessor: "action",
									title: "",
									width: "100px",
									render: (item) => (
										<>
											<Group justify="center">
												<ActionIcon
													color="var(--theme-secondary-color-6)"
													onClick={() => handleRowSubmit(item.id)}
												>
													<IconDeviceFloppy height={18} width={18} stroke={1.5} />
												</ActionIcon>
												<ActionIcon
													color="var(--theme-delete-color)"
													onClick={() => handleDelete(values.id)}
												>
													<IconTrashX height={18} width={18} stroke={1.5} />
												</ActionIcon>
											</Group>

										</>

									),
								},

							]}
							fetching={fetching}
							loaderSize="xs"
							loaderColor="grape"
							height={height}
						/>
					</Grid.Col>
					<Grid.Col span={8}>
						<form onSubmit={form.onSubmit(handleSubmit)}>
						<Box pt={'4'} ml={'4'} pb={'4'} pr={'12'} bg="var(--theme-primary-color-1)" >
							<Stack right align="flex-end">
								<>
									<Button
										size="xs"
										bg="var(--theme-primary-color-6)"
										type="submit"
										id="EntityFormSubmit"
										leftSection={<IconDeviceFloppy size={16} />}
									>
										<Flex direction={`column`} gap={0}>
											<Text fz={14} fw={400}>
												{t("CreateAndSave")}
											</Text>
										</Flex>
									</Button>
								</>
							</Stack>
						</Box>
						<Stack mih={height} className="form-stack-vertical">
							<Grid align="center">
								<Grid.Col span={12} pb={0}>
									<SelectForm
										form={form}
										label={t("ParentName")}
										tooltip={t("ParentName")}
										placeholder={t("ParentName")}
										name="parent_id"
										id="parent_id"
										nextField="name"
										value={form.values.patient_id}
										required={false}
									/>
								</Grid.Col>
							</Grid>
							<Grid align="center">
								<Grid.Col span={12} pb={0}>
									<InputForm
										form={form}
										label={t("Name")}
										tooltip={t("NameValidationMessage")}
										placeholder={t("ParameterName")}
										name="name"
										id="name"
										nextField="sample_value"
										value={form.values.name}
										required={true}
									/>
								</Grid.Col>
							</Grid>
							<Grid align="center">
								<Grid.Col span={12} pb={0}>
									<InputForm
										form={form}
										label={t("SampleValue")}
										tooltip={t("SampleValue")}
										placeholder={t("SampleValue")}
										name="sample_value"
										id="sample_value"
										nextField="unit_name"
										value={form.values.sample_value}
									/>
								</Grid.Col>
							</Grid>
							<Grid align="center">
								<Grid.Col span={12} pb={0}>
									<InputForm
										form={form}
										label={t("UnitName")}
										tooltip={t("UnitName")}
										placeholder={t("UnitName")}
										name="unit_name"
										id="unit_name"
										nextField="reference_value"
										value={form.values.unit_name}
									/>
								</Grid.Col>
							</Grid>
							<Grid align="center">
								<Grid.Col span={12} pb={0}>
									<TextAreaForm
										form={form}
										label={t("ReferenceValue")}
										tooltip={t("ReferenceValue")}
										placeholder={t("ReferenceValue")}
										name="reference_value"
										id="reference_value"
										nextField=""
										value={form.values.reference_value}
									/>
								</Grid.Col>
							</Grid>
						</Stack>
						</form>
					</Grid.Col>
				</Grid>


			</Box>

		</>
	);
}

