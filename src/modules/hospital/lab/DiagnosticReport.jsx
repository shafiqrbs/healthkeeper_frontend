import { getDataWithoutStore } from "@/services/apiService";
import { Box, Text, Stack, Grid, TextInput, Flex, Button } from "@mantine/core";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { DataTable } from "mantine-datatable";
import tableCss from "@assets/css/TableAdmin.module.css";
import { IconChevronUp, IconSelector, IconPrinter } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { getFormValues } from "@modules/hospital/lab/helpers/request";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import { modals } from "@mantine/modals";
import { storeEntityData, updateEntityData } from "@/app/store/core/crudThunk";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { successNotification } from "@components/notification/successNotification";
import { ERROR_NOTIFICATION_COLOR, MODULES_CORE, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import { errorNotification } from "@components/notification/errorNotification";
import { useDispatch } from "react-redux";
import { useHotkeys } from "@mantine/hooks";
import LabReportA4BN from "@components/print-formats/lab-reports/LabReportA4BN";
import { useReactToPrint } from "react-to-print";

const module = MODULES_CORE.LAB_USER;

export default function DiagnosticReport({ refetchDiagnosticReport }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const inputsRef = useRef([]);
	const { mainAreaHeight } = useOutletContext();
	const form = useForm(getFormValues(t));
	const [diagnosticReport, setDiagnosticReport] = useState([]);
	const [submitFormData, setSubmitFormData] = useState({});
	const [updatingRows, setUpdatingRows] = useState({});
	const { id, reportId } = useParams();
	const labReportRef = useRef(null);
	const [labReportData, setLabReportData] = useState(null);
	const [fetching, setFetching] = useState(false);
	const [refetch, setRefetch] = useState(false);

	const handleLabReport = async (id) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.LAB_TEST.PRINT}/${id}`,
		});
		console.log(res)
		setLabReportData(res?.data);
		requestAnimationFrame(printLabReport);
	};

	const printLabReport = useReactToPrint({
		content: () => labReportRef.current,
	});

	useEffect(() => {
		if (id && reportId) {
			fetchLabReport();
		}
	}, [id, reportId]);

	useEffect(() => {
		if (refetch) {
			fetchLabReport();
			setRefetch(false);
		}
	}, [refetch]);

	useEffect(() => {
		form.setFieldValue("comment", diagnosticReport.comment ? diagnosticReport.comment : null);
	}, [diagnosticReport]);

	async function fetchLabReport() {
		setFetching(true);
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.LAB_TEST.INDEX}/${id}/report/${reportId}`,
		});
		form.reset();
		setDiagnosticReport(res?.data);
		setFetching(false);
	}

	//const handleDataTypeChange = () => {};
	const handleFieldChange = async (rowId, field, value) => {
		setSubmitFormData((prev) => ({
			...prev,
			[rowId]: { ...prev[rowId], [field]: value },
		}));
		setUpdatingRows((prev) => ({ ...prev, [rowId]: true }));
		try {
			await dispatch(
				storeEntityData({
					url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.LAB_TEST.INLINE_UPDATE}/${rowId}`,
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

	const handleKeyDown = (e, index) => {
		if (e.key === "Enter") {
			e.preventDefault();
			const nextInput = inputsRef.current[index + 1];
			if (nextInput) {
				nextInput.focus();
			}
		}
	};

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
			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.LAB_TEST.UPDATE}/${reportId}`,
				data: values,
				module,
			};
			const resultAction = await dispatch(updateEntityData(value));
			if (updateEntityData.rejected.match(resultAction)) {
				const fieldErrors = resultAction.payload.errors;
				if (fieldErrors) {
					const errorObject = {};
					Object.keys(fieldErrors).forEach((key) => {
						errorObject[key] = fieldErrors[key][0];
					});
					form.setErrors(errorObject);
				}
			} else if (updateEntityData.fulfilled.match(resultAction)) {
				dispatch(setRefetchData({ module, refetching: true }));
				refetchDiagnosticReport();
				successNotification(t("UpdateSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
				setRefetch(true);
			}
		} catch (error) {
			console.error(error);
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		}
	}
	useHotkeys([["alt+s", () => document.getElementById("EntityFormSubmit").click()]], []);

	return (
		<Box className="borderRadiusAll" bg="white">
			<Box bg="var(--theme-primary-color-0)" p="sm">
				<Text fw={600} fz="sm" py="es">
					{t("DiagnosticReportPrepared")}: {diagnosticReport?.name}
				</Text>
			</Box>
			{reportId ? (
				<>
					<Box className="border-top-none" px="sm" mt={"xs"}>
						<DataTable
							striped
							highlightOnHover
							pinFirstColumn
							stripedColor="var(--theme-tertiary-color-1)"
							classNames={{
								root: tableCss.root,
								table: tableCss.table,
								header: tableCss.header,
								footer: tableCss.footer,
								pagination: tableCss.pagination,
							}}
							records={diagnosticReport?.reports || []}
							columns={[
								{
									accessor: "index",
									title: t("S/N"),
									textAlignment: "right",
									render: (_, index) => index + 1,
								},
								{
									accessor: "name",
									title: t("Name"),
								},
								{
									accessor: "result",
									title: t("Result"),
									render: (item) =>
										diagnosticReport.process === "Done" ? (
											item.result
										) : (
											<>
												<TextInput
													size="xs"
													fz="xs"
													value={item?.result}
													ref={(el) => (inputsRef.current[item.id] = el)}
													onKeyDown={(e) => handleKeyDown(e, item.id)}
													onBlur={(e) => handleFieldChange(item.id, "result", e.target.value)}
												/>
											</>
										),
								},
								{
									accessor: "unit",
									title: t("Unit"),
								},
								{
									accessor: "reference_value",
									title: t("ReferenceValue"),
								},
							]}
							loaderSize="xs"
							loaderColor="grape"
							height={mainAreaHeight - 315}
							fetching={fetching}
							sortIcons={{
								sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
								unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
							}}
						/>
					</Box>
					<Stack gap={0} justify="space-between" mt="xs">
						<form onSubmit={form.onSubmit(handleSubmit)}>
							<Box p="sm" px="md" bg="var(--theme-tertiary-color-1)">
								<Box w="100%">
									{diagnosticReport?.process === "Done" ? (
										<>
											<Box h={'56'}>
											<strong>Comment:</strong> {diagnosticReport?.comment}
											</Box>
										</>
									) : (
										<TextAreaForm
											id="comment"
											form={form}
											tooltip={t("EnterComment")}
											placeholder={t("EnterComment")}
											name="comment"
										/>
									)}
								</Box>
								<Box mt="xs">
									<Grid columns={12}>
										<Grid.Col span={6} className="animate-ease-out">
											{diagnosticReport?.process === "Done" && (
												<Flex
													mih={50}
													gap="xs"
													justify="flex-start"
													align="center"
													direction="row"
													wrap="wrap"
												>
													<Button
														onClick={() => handleLabReport(diagnosticReport?.id)}
														size="xs"
														color="var(--theme-secondary-color-5)"
														type="button"
														id="EntityFormSubmit"
														rightSection={<IconPrinter size="18px" />}
													>
														<Flex direction="column" gap={0}>
															<Text fz={'xs'}>{t("Print")}</Text>
															<Flex direction="column" align="center" fz="xxs" c="white">
																alt+p
															</Flex>
														</Flex>
													</Button>
												</Flex>
											)}
										</Grid.Col>
										<Grid.Col span={6} className="animate-ease-out">
											<Flex
												mih={50}
												gap="xs"
												justify="flex-end"
												align="center"
												direction="row"
												wrap="wrap"
											>
												{diagnosticReport?.process === "New" && (
													<Button
														size="xs"
														className="btnPrimaryBg"
														type="submit"
														id="handleSubmit"
													>
														<Flex direction="column" gap={0}>
															<Text fz="xs">{t("Save")}</Text>
															<Flex direction="column" align="center" fz="xxs" c="white">
																alt+s
															</Flex>
														</Flex>
													</Button>
												)}
												{diagnosticReport?.process === "In-progress" && (
													<Button
														size="xs"
														fz={'xs'}
														bg="var(--theme-primary-color-6)"
														type="submit"
														id="handleSubmit"
													>
														<Flex direction="column" gap={0}>
															<Text fz="xs" >{t("Confirm")}</Text>
															<Flex direction="column" align="center" fz="xxs" c="white">
																alt+s
															</Flex>
														</Flex>
													</Button>
												)}
											</Flex>
										</Grid.Col>
									</Grid>
								</Box>
							</Box>
						</form>
					</Stack>
				</>
			) : (
				<Box bg="white">
					<Stack
						h={mainAreaHeight - 154}
						bg="var(--mantine-color-body)"
						align="center"
						justify="center"
						gap="md"
					>
						{t("NoTestSelected")}
					</Stack>
				</Box>
			)}

			<LabReportA4BN data={labReportData} ref={labReportRef} />
		</Box>
	);
}
