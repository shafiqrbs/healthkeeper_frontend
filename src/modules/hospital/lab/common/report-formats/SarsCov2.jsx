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

const module = MODULES.LAB_TEST;

export default function SarsCov2({ diagnosticReport, setDiagnosticReport, refetchDiagnosticReport }) {
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
			sars_cov_positive: custom_report?.sars_cov_positive || false,
			sars_covnegative: custom_report?.sars_covnegative || false,
			cov_invalid: custom_report?.cov_invalid || false,
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
					<Group grow>
						{/* =============== genexpert site/hospital =============== */}
						<DatePickerForm
							name="test_date"
							id="test_date"
							nextField="comment"
							form={form}
							label="Test Date"
							placeholder="Select date"
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
					</Group>

					{/* =============== results table =============== */}
					<Box my="md">
						<Table withColumnBorders withTableBorder withRowBorders>
							<Table.Thead>
								<Table.Tr>
									<Table.Th ta="center" rowSpan={3}>
										Result
									</Table.Th>
									<Table.Th ta="center" colSpan={4}>
										Sars CoV-2
									</Table.Th>
								</Table.Tr>
								<Table.Tr>
									<Table.Th>Positive</Table.Th>
									<Table.Th>Negative</Table.Th>
									<Table.Th>INVALID / ERROR / NO RESULT</Table.Th>
								</Table.Tr>
								<Table.Tr>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.sars_cov_positive}
											onChange={(event) =>
												form.setFieldValue("sars_cov_positive", event.currentTarget.checked)
											}
											styles={{ body: { justifyContent: "center" } }}
											readOnly={is_completed}
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.sars_covnegative}
											onChange={(event) =>
												form.setFieldValue("sars_covnegative", event.currentTarget.checked)
											}
											styles={{ body: { justifyContent: "center" } }}
											readOnly={is_completed}
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.cov_invalid}
											onChange={(event) =>
												form.setFieldValue("cov_invalid", event.currentTarget.checked)
											}
											styles={{ body: { justifyContent: "center" } }}
											readOnly={is_completed}
										/>
									</Table.Th>
								</Table.Tr>
							</Table.Thead>
						</Table>
					</Box>
					{/* =============== text date =============== */}
				</Stack>
			</ScrollArea>
			<ReportSubmission diagnosticReport={diagnosticReport} form={form} handleSubmit={handleSubmit} />
		</Box>
	);
}
