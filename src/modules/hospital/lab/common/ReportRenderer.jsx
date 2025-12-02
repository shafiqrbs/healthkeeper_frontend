import { Box, Text, TextInput } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import tableCss from "@assets/css/TableAdmin.module.css";
import { forwardRef } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { IconChevronUp, IconSelector } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import Covid19 from "./report-formats/Covid19";
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
import GeneSputum from "./report-formats/GeneSputum";
import GenePulmonary from "./report-formats/GenePulmonary";
import XRay from "./report-formats/XRay";
import LPA from "./report-formats/LPA";
import Ultrasonography from "./report-formats/Ultrasonography";
import SarsCov2 from "./report-formats/SarsCov2";
import PulmonaryStatus from "./report-formats/PulmonaryStatus";
import Dengue from "./report-formats/Dengue";
import CTScan from "./report-formats/CTScan";
import Serology from "./report-formats/Serology";

const module = MODULES.LAB_TEST;

const ReportRenderer = forwardRef(
	({ diagnosticReport, fetching, inputsRef, refetchDiagnosticReport, refetchLabReport }) => {
		const { t } = useTranslation();
		const form = useForm(getFormValues(t));
		const { reportId } = useParams();
		const dispatch = useDispatch();
		const { mainAreaHeight } = useOutletContext();

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

		console.log(diagnosticReport);

		const renderCustomReport = () => {
			if (
				diagnosticReport?.custom_report !== null &&
				diagnosticReport?.custom_report !== undefined
			) {
				const slug = diagnosticReport?.particular?.slug;

				switch (slug) {
					case "covid-19":
						return (
							<Covid19
								diagnosticReport={diagnosticReport}
								refetchDiagnosticReport={refetchDiagnosticReport}
								refetchLabReport={refetchLabReport}
							/>
						);
					case "gene-sputum":
						return (
							<GeneSputum
								diagnosticReport={diagnosticReport}
								refetchDiagnosticReport={refetchDiagnosticReport}
								refetchLabReport={refetchLabReport}
							/>
						);
					case "gene-pulmonary":
						return (
							<GenePulmonary
								diagnosticReport={diagnosticReport}
								refetchDiagnosticReport={refetchDiagnosticReport}
								refetchLabReport={refetchLabReport}
							/>
						);
					case "x-ray-pa":
						return (
							<XRay
								diagnosticReport={diagnosticReport}
								refetchDiagnosticReport={refetchDiagnosticReport}
								refetchLabReport={refetchLabReport}
							/>
						);
					case "ultrasonography":
						return (
							<Ultrasonography
								diagnosticReport={diagnosticReport}
								refetchDiagnosticReport={refetchDiagnosticReport}
								refetchLabReport={refetchLabReport}
							/>
						);
					case "sars-cov2":
						return (
							<SarsCov2
								diagnosticReport={diagnosticReport}
								refetchDiagnosticReport={refetchDiagnosticReport}
								refetchLabReport={refetchLabReport}
							/>
						);
					case "gene-extra-sputum":
						return (
							<PulmonaryStatus
								diagnosticReport={diagnosticReport}
								refetchDiagnosticReport={refetchDiagnosticReport}
								refetchLabReport={refetchLabReport}
							/>
						);
					case "lpa":
						return (
							<LPA
								diagnosticReport={diagnosticReport}
								refetchDiagnosticReport={refetchDiagnosticReport}
								refetchLabReport={refetchLabReport}
							/>
						);
					case "dengue":
						return (
							<Dengue
								diagnosticReport={diagnosticReport}
								refetchDiagnosticReport={refetchDiagnosticReport}
								refetchLabReport={refetchLabReport}
							/>
						);
					case "ct-scan":
						// case "hrct-chest":
						return (
							<CTScan
								diagnosticReport={diagnosticReport}
								refetchDiagnosticReport={refetchDiagnosticReport}
								refetchLabReport={refetchLabReport}
							/>
						);
					// case "hrct-chest":
					case "serology":
						return (
							<Serology
								diagnosticReport={diagnosticReport}
								refetchDiagnosticReport={refetchDiagnosticReport}
								refetchLabReport={refetchLabReport}
							/>
						);
					default:
						return null;
				}
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

		const customReportComponent = renderCustomReport();

		if (customReportComponent) {
			return customReportComponent;
		}

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
								render: (item, rowIndex) =>
									diagnosticReport.process === "Done" ? (
										item.result
									) : (
										<TextInput
											size="xs"
											fz="xs"
											value={item.result}
											ref={(el) => (inputsRef.current[rowIndex] = el)}
											onKeyDown={(e) => handleKeyDown(e, rowIndex)}
											onBlur={(e) =>
												handleFieldChange(item.id, "result", e.target.value)
											}
										/>
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
						height={mainAreaHeight - 232}
						fetching={fetching}
						sortIcons={{
							sorted: (
								<IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />
							),
							unsorted: (
								<IconSelector color="var(--theme-tertiary-color-7)" size={14} />
							),
						}}
					/>
				</Box>
				<ReportSubmission
					diagnosticReport={diagnosticReport}
					form={form}
					handleSubmit={handleSubmit}
				/>
			</>
		);
	}
);

ReportRenderer.displayName = "ReportRenderer";

export default ReportRenderer;
