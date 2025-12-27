import { Box, Stack, Table, Text, ScrollArea, Grid } from "@mantine/core";
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

const module = MODULES.LAB_TEST;

// =============== sars cov2 results are now handled as individual boolean properties ===============
export default function MTTest({ diagnosticReport, refetchDiagnosticReport, refetchLabReport }) {
	const { reportId } = useParams();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const custom_report = diagnosticReport?.custom_report || {};
	const is_completed = diagnosticReport?.process?.toLowerCase() === "done";

	const form = useForm({
		initialValues: {

			mt_reading_date: custom_report?.mt_reading_date ? new Date(custom_report.mt_reading_date) : null,
			mt_examination_date: custom_report?.mt_examination_date ? new Date(custom_report.mt_examination_date) : null,
			mt_result: custom_report?.mt_result || "",

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
						mt_reading_date: formatDateForMySQL(values.mt_reading_date),
						mt_examination_date: formatDateForMySQL(values.mt_examination_date),
					},
					comment: values.comment,
					lab_no: values.lab_no,
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
		<Box className="border-top-none" px="sm" mt="xs">
			<ScrollArea h={mainAreaHeight - 260} scrollbarSize={2} scrollbars="y">
				<Stack gap="md">
					<Grid columns={12}>
						<Grid.Col span={3}>
							Date of Examination
						</Grid.Col>
						<Grid.Col span={6}>
							<DatePickerForm
								name="mt_examination_date"
								id="mt_examination_date"
								nextField="mt_reading_date"
								form={form}
								placeholder="Enter Examination Date"
							/>
						</Grid.Col>
					</Grid>
					<Grid columns={12}>
						<Grid.Col span={3}>
							Date of Reading
						</Grid.Col>
						<Grid.Col span={6}>
							<DatePickerForm
								name="mt_reading_date"
								id="mt_reading_date"
								nextField="mt_result"
								form={form}
								placeholder="Enter Reading Date"
							/>
						</Grid.Col>
					</Grid>
					<Grid columns={12}>
						<Grid.Col span={3}>
							Result
						</Grid.Col>
						<Grid.Col span={6}>
							<InputForm
								name="mt_result"
								id="mt_result"
								form={form}
								placeholder="Enter result"
							/>
						</Grid.Col>

					</Grid>

					{/* =============== text date =============== */}
				</Stack>
			</ScrollArea>
			<ReportSubmission diagnosticReport={diagnosticReport} form={form} handleSubmit={handleSubmit} />
		</Box>
	);
}
