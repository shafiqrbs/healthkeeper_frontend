import { Box, Stack, Group, Text, ScrollArea } from "@mantine/core";
import { useForm } from "@mantine/form";
import ReportSubmission from "../ReportSubmission";
import { useOutletContext, useParams } from "react-router-dom";
import DatePickerForm from "@components/form-builders/DatePicker";
import InputForm from "@components/form-builders/InputForm";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import { useTranslation } from "react-i18next";
import { modals } from "@mantine/modals";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useDispatch } from "react-redux";
import { updateEntityData } from "@/app/store/core/crudThunk";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { ERROR_NOTIFICATION_COLOR, MODULES, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import { errorNotification } from "@components/notification/errorNotification";
import { successNotification } from "@components/notification/successNotification";
import { formatDateForMySQL } from "@utils/index";

const module = MODULES.LAB_TEST;

export default function CTScan({ diagnosticReport, refetchDiagnosticReport, refetchLabReport }) {
	const { reportId } = useParams();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const custom_report = diagnosticReport?.custom_report || {};
	const is_completed = diagnosticReport?.process === "Done";

	const form = useForm({
		initialValues: {
			test_date: custom_report?.test_date ? new Date(custom_report.test_date) : null,
			lab_no: custom_report?.lab_no || "",
			ref_by: custom_report?.ref_by || "",
			test_name: custom_report?.test_name || "",
			patient_age: custom_report?.patient_age ? new Date(custom_report.patient_age) : null,
			technique: custom_report?.technique || "",
			findings: custom_report?.findings || "",
			after_iv_contrast: custom_report?.after_iv_contrast || "",
			impression: custom_report?.impression || "",
			comment: diagnosticReport?.comment || "",
		},
	});

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
				data: {
					json_content: {
						...values,
						test_date: formatDateForMySQL(values.test_date),
						patient_age: formatDateForMySQL(values.patient_age),
					},
					comment: values.comment,
				},
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
					console.error("Field Error occurred!", errorObject);
					form.setErrors(errorObject);
				}
			} else if (updateEntityData.fulfilled.match(resultAction)) {
				dispatch(setRefetchData({ module, refetching: true }));
				refetchDiagnosticReport();
				if (refetchLabReport && typeof refetchLabReport === "function") {
					refetchLabReport();
				}
				successNotification(t("UpdateSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
			}
		} catch (error) {
			console.error(error);
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		}
	}

	return (
		<>
			<Box className="border-top-none" px="sm" mt="xs">
				<ScrollArea h={mainAreaHeight - 232} scrollbarSize={2} scrollbars="y">
					<Stack gap="md">
						{/* =============== test date and lab no =============== */}
						<Group grow>
							<DatePickerForm
								label="Test Date"
								placeholder="Select date"
								name="test_date"
								id="test_date"
								nextField="lab_no"
								form={form}
								tooltip={t("EnterTheTestDate")}
								readOnly={is_completed}
							/>

							{/* =============== lab no =============== */}
							<InputForm
								label="Lab No"
								placeholder="Enter lab number"
								name="lab_no"
								id="lab_no"
								nextField="ref_by"
								form={form}
								readOnly={is_completed}
							/>
						</Group>

						{/* =============== ref by and test name =============== */}
						<Group grow>
							<InputForm
								label="Ref By"
								placeholder="Enter referring doctor"
								name="ref_by"
								id="ref_by"
								nextField="test_name"
								form={form}
								readOnly={is_completed}
							/>

							{/* =============== test name =============== */}
							<InputForm
								label="Test Name"
								placeholder="Enter test name (e.g., CT: Brain)"
								name="test_name"
								id="test_name"
								nextField="patient_age"
								form={form}
								readOnly={is_completed}
							/>
						</Group>

						{/* =============== patient age and after i/v contrast =============== */}
						<Group grow>
							{/* =============== patient age =============== */}
							<DatePickerForm
								label="Patient Age"
								placeholder="Select date"
								name="patient_age"
								id="patient_age"
								nextField="after_iv_contrast"
								form={form}
								tooltip={t("EnterPatientAge")}
								readOnly={is_completed}
							/>

							{/* =============== after i/v contrast =============== */}
							<InputForm
								label="After I/V Contrast"
								placeholder="Enter contrast information (e.g., Not given)"
								name="after_iv_contrast"
								id="after_iv_contrast"
								nextField="technique"
								form={form}
								readOnly={is_completed}
							/>
						</Group>

						{/* =============== technique textarea =============== */}
						<Box>
							<TextAreaForm
								form={form}
								name="technique"
								id="technique"
								label="Technique"
								placeholder="Enter technique description"
								resize="vertical"
								minRows={3}
								readOnly={is_completed}
							/>
						</Box>

						{/* =============== findings textarea =============== */}
						<Box>
							<TextAreaForm
								form={form}
								name="findings"
								id="findings"
								label="Findings"
								placeholder="Enter findings (each finding on a new line)"
								resize="vertical"
								minRows={6}
								readOnly={is_completed}
							/>
						</Box>

						{/* =============== impression textarea =============== */}
						<Box>
							<TextAreaForm
								form={form}
								name="impression"
								id="impression"
								label="Impression"
								placeholder="Enter impression"
								resize="vertical"
								minRows={3}
								readOnly={is_completed}
							/>
						</Box>
					</Stack>
				</ScrollArea>
			</Box>
			<ReportSubmission
				diagnosticReport={diagnosticReport}
				form={form}
				handleSubmit={handleSubmit}
			/>
		</>
	);
}
