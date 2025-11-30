import { Box, Stack, Group, Text, ScrollArea } from "@mantine/core";
import { useForm } from "@mantine/form";
import ReportSubmission from "../ReportSubmission";
import { useOutletContext, useParams } from "react-router-dom";
import DatePickerForm from "@components/form-builders/DatePicker";
import InputForm from "@components/form-builders/InputForm";
import SelectForm from "@components/form-builders/SelectForm";
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
import InputNumberForm from "@components/form-builders/InputNumberForm";

const module = MODULES.LAB_TEST;

// =============== define dropdown options ===============
const dengueResultOptions = [
	{ value: "positive", label: "Positive (+Ve)" },
	{ value: "negative", label: "Negative (-Ve)" },
];

export default function Serology({ diagnosticReport, setDiagnosticReport, refetchDiagnosticReport }) {
	const { reportId } = useParams();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const custom_report = diagnosticReport?.custom_report || {};
	const is_completed = diagnosticReport?.process === "Done" || diagnosticReport?.process === "In-progress";

	const form = useForm({
		initialValues: {
			test_date: custom_report?.test_date ? new Date(custom_report.test_date) : null,
			lab_no: custom_report?.lab_no || "",
			fmh_name: custom_report?.fmh_name || "",
			test_name: custom_report?.test_name || "Dengue NSI Ag",
			patient_age: custom_report?.patient_age ? new Date(custom_report.patient_age) : null,
			dengue_result: custom_report?.dengue_result || "",
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
				successNotification(t("UpdateSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
				setDiagnosticReport(resultAction.payload.data?.data);
				form.reset();
			}
		} catch (error) {
			console.error(error);
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		}
	}

	return (
		<Box className="border-top-none" px="sm" mt="xs">
			<ScrollArea h={mainAreaHeight - 260} scrollbarSize={2} scrollbars="y">
				<Stack gap="md">
					{/* =============== test date and lab no =============== */}
					<Group grow>
						<DatePickerForm
							name="test_date"
							id="test_date"
							nextField="lab_no"
							form={form}
							label="Test Date"
							placeholder="Select date"
							readOnly={is_completed}
						/>

						{/* =============== lab no =============== */}
						<InputNumberForm
							name="lab_no"
							id="lab_no"
							nextField="fmh_name"
							form={form}
							label="Lab No"
							placeholder="Enter Lab No"
							readOnly={is_completed}
						/>
					</Group>

					{/* =============== f/m/h name and test name =============== */}
					<Group grow>
						<InputForm
							name="fmh_name"
							id="fmh_name"
							nextField="test_name"
							form={form}
							label="F/M/H Name"
							placeholder="Enter F/M/H Name"
							readOnly={is_completed}
						/>

						{/* =============== test name =============== */}
						<InputForm
							name="test_name"
							id="test_name"
							nextField="patient_age"
							form={form}
							label="Test Name"
							placeholder="Enter test name (e.g., Dengue NSI Ag)"
							readOnly={is_completed}
						/>
					</Group>

					<Group grow>
						{/* =============== patient age =============== */}
						<DatePickerForm
							name="patient_age"
							id="patient_age"
							nextField="dengue_result"
							form={form}
							label="Patient Age"
							placeholder="Select date"
							tooltip={t("EnterPatientAge")}
							readOnly={is_completed}
						/>

						{/* =============== dengue result dropdown =============== */}
						<SelectForm
							name="dengue_result"
							id="dengue_result"
							form={form}
							label="Dengue NSI Ag *"
							placeholder="Select result"
							dropdownValue={dengueResultOptions}
							required={true}
							disabled={is_completed}
						/>
					</Group>
				</Stack>
			</ScrollArea>
			<ReportSubmission diagnosticReport={diagnosticReport} form={form} handleSubmit={handleSubmit} />
		</Box>
	);
}
