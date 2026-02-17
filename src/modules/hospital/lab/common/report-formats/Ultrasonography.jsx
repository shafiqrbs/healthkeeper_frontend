import { Box, Stack, Table, Group, Text, ScrollArea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Checkbox } from "@mantine/core";
import ReportSubmission from "../ReportSubmission";
import { useOutletContext, useParams } from "react-router-dom";
import DatePickerForm from "@components/form-builders/DatePicker";
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
import InputForm from "@components/form-builders/InputForm";
import TextAreaForm from "@components/form-builders/TextAreaForm";

const module = MODULES.LAB_TEST;

// =============== sars cov2 results are now handled as individual boolean properties ===============
export default function Ultrasonography({
	diagnosticReport,
	refetchDiagnosticReport,
	refetchLabReport,
}) {
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
			id: custom_report?.id || "",
			name: custom_report?.name || "",
			type_patient: custom_report?.type_patient || "",
			findings: custom_report?.findings || "",
			referral_center: custom_report?.referral_center || "",
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
				return resultAction.payload?.data;
			}
			return false;
		} catch (error) {
			console.error(error);
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		}
	}

	return (
		<Box className="border-top-none" px="sm" mt="xs">
			<ScrollArea h={mainAreaHeight - 260} scrollbarSize={2} scrollbars="y">
				<Stack gap="md">
					<Group grow>
						{/* =============== genexpert site/hospital =============== */}
						<DatePickerForm
							name="test_date"
							id="test_date"
							nextField="comment"
							form={form}
							label="Test Date"
							placeholder="Select date"
							readOnly={is_completed}
						/>

						{/* =============== reference laboratory specimen id =============== */}
						<InputNumberForm
							name="lab_no"
							id="lab_no"
							nextField="id"
							form={form}
							label="Lab No"
							placeholder="Enter Lab No"
							readOnly={is_completed}
						/>
						<InputForm
							name="type_patient"
							id="type_patient"
							nextField="comment"
							form={form}
							label="Type of Sample"
							placeholder="Enter Type of Patient"
							readOnly={is_completed}
						/>
					</Group>

					<Group grow>
						<InputForm
							name="name"
							id="name"
							nextField="findings"
							form={form}
							label="Test Name"
							placeholder="Enter Test Name"
							readOnly={is_completed}
						/>
						<InputForm
							name="referral_center"
							id="referral_center"
							nextField="findings"
							form={form}
							label="Ref by"
							placeholder="Ref by"
							readOnly={is_completed}
						/>
					</Group>

					{/* =============== results table =============== */}
					<Box my="xs">
						<TextAreaForm
							form={form}
							name="findings"
							id="findings"
							label="Findings"
							placeholder="Enter Findings"
							resize="vertical"
							minRows={6}
							readOnly={is_completed}
						/>
					</Box>
					{/* =============== text date =============== */}
				</Stack>
			</ScrollArea>
			<ReportSubmission diagnosticReport={diagnosticReport} form={form} submissionFunc={handleConfirmModal} handleSubmit={handleSubmit} />

		</Box>
	);
}
