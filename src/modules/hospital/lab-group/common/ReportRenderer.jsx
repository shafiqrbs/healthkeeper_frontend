import { Box, Text, TextInput } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import tableCss from "@assets/css/TableAdmin.module.css";
import { forwardRef, useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { IconChevronUp, IconSelector } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import ReportSubmission from "./ReportSubmission";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { storeEntityData, updateEntityData } from "@/app/store/core/crudThunk";
import { ERROR_NOTIFICATION_COLOR, MODULES, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import { useDispatch } from "react-redux";
import { errorNotification } from "@components/notification/errorNotification";
import { modals } from "@mantine/modals";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { successNotification } from "@components/notification/successNotification";
import { useForm } from "@mantine/form";
import { getFormValues } from "../helpers/request";

const module = MODULES.LAB_TEST;

const ReportRenderer = forwardRef(
	({ diagnosticReport, fetching, inputsRef, refetchDiagnosticReport, refetchLabReport, refreshKey }) => {
		const { t } = useTranslation();
		const form = useForm(getFormValues(t));
		const { reportId } = useParams();
		const dispatch = useDispatch();
		const { mainAreaHeight } = useOutletContext();

		// =============== local state to track input values for editing ================
		const [inputValues, setInputValues] = useState({});

		// =============== initialize input values from diagnostic report data ================
		useEffect(() => {
			if (diagnosticReport?.reports) {
				const initialValues = {};
				diagnosticReport.reports.forEach((report) => {
					initialValues[report.id] = {
						ordering: report.ordering || "",
						result: report.result || "",
					};
				});
				setInputValues(initialValues);
			}
		}, [diagnosticReport, refreshKey]);

		// =============== handle input value change locally ================
		const handleInputChange = (rowId, field, value) => {
			setInputValues((prev) => ({
				...prev,
				[rowId]: {
					...prev[rowId],
					[field]: value,
				},
			}));
		};

		// =============== save field change to backend ================
		const handleFieldChange = async (rowId, field, value) => {
			try {
				await dispatch(
					storeEntityData({
						url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.LAB_TEST.INLINE_UPDATE}/${rowId}`,
						data: { [field]: value },
						module,
					})
				);
			} catch (error) {
				console.error(error);
				errorNotification(error.message);
			}
		};

		const handleKeyDown = (e, index) => {
			if (e.key === "Enter") {
				e.preventDefault();
				if (inputsRef?.current) {
					const nextInput = inputsRef.current[index + 1];
					if (nextInput) {
						nextInput.focus();
					}
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

		// this handler for the default reports only
		async function handleConfirmModal(values) {
			try {
				const value = {
					url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.LAB_GROUP_TEST.UPDATE}/${reportId}`,
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
					if (refetchLabReport && typeof refetchLabReport === "function") {
						refetchLabReport();
					}
				}
			} catch (error) {
				console.error(error);
				errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
			}
		}

		// default reports table and submission form
		return (
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
								accessor: "ordering",
								title: t("S/N"),
								width: 100,
								textAlignment: "right",
								render: (_, index) => index + 1,
								/*

								render: (item, rowIndex) => (
									<TextInput
										size="xs"
										fz="xs"
										styles={{
											input: {
												width: "100%",
												textAlign: "center",
												border: "1px solid blue",
											},
										}}
										value={inputValues[item.id]?.ordering ?? item.ordering ?? ""}
										onChange={(e) => handleInputChange(item.id, "ordering", e.target.value)}
										ref={(el) => (inputsRef.current[rowIndex] = el)}
										onKeyDown={(e) => handleKeyDown(e, rowIndex)}
										onBlur={(e) => handleFieldChange(item.id, "ordering", e.target.value)}
									/>
								),

								*/
							},
							{
								accessor: "name",
								width: 180,
								title: t("Name"),
							},
							{
								accessor: "result",
								title: t("Result"),
								width: 180,
								render: (item, rowIndex) => (
									<TextInput
										size="xs"
										fz="xs"
										value={inputValues[item.id]?.result ?? item.result ?? ""}
										onChange={(e) => handleInputChange(item.id, "result", e.target.value)}
										styles={{
											input: {
												width: "100%",
												textAlign: "center",
												border: "1px solid blue",
											},
										}}
										ref={(el) => (inputsRef.current[rowIndex] = el)}
										onKeyDown={(e) => handleKeyDown(e, rowIndex)}
										onBlur={(e) => handleFieldChange(item.id, "result", e.target.value)}
									/>
								),
							},
							{
								accessor: "unit",
								width: 100,
								textAlignment: "center",
								title: t("Unit"),
							},
							{
								accessor: "reference_value",
								title: t("ReferenceValue"),
							},
						]}
						loaderSize="xs"
						loaderColor="grape"
						height={mainAreaHeight - 232}
						fetching={fetching}
						sortIcons={{
							sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
							unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
						}}
					/>
				</Box>
				<ReportSubmission diagnosticReport={diagnosticReport} form={form} handleSubmit={handleSubmit} />
			</>
		);
	}
);

ReportRenderer.displayName = "ReportRenderer";

export default ReportRenderer;
