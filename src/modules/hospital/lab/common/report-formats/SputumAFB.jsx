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

// =============== sars cov2 results are now handled as individual boolean properties ===============
export default function SputumAFB({ diagnosticReport, refetchDiagnosticReport, refetchLabReport }) {
	const { reportId } = useParams();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const custom_report = diagnosticReport?.custom_report || {};
	const is_completed = diagnosticReport?.process === "Done";

	const form = useForm({
		initialValues: {
			afb_found: custom_report?.afb_found || 0,
			afb_not_found: custom_report?.afb_not_found || 0,
			afb_scanty: custom_report?.afb_scanty || 0,
			
			afb_sample_found: custom_report?.afb_sample_found || 0,
			afb_sample_not_found: custom_report?.afb_sample_not_found || 0,
			afb_sample_scanty: custom_report?.afb_sample_scanty || 0,
			
			afb_scanty_one: custom_report?.afb_scanty_one || 0,
			afb_scanty_two: custom_report?.afb_scanty_two || 0,
			afb_scanty_three: custom_report?.afb_scanty_three || 0,
			afb_sample_scanty_one: custom_report?.afb_sample_scanty_one || 0,
			afb_sample_scanty_two: custom_report?.afb_sample_scanty_two || 0,
			afb_sample_scanty_three: custom_report?.afb_sample_scanty_three || 0,
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
						...values
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
							
						/>
					</Group>

					{/* =============== results table =============== */}
					<Box my="md">
						<Table withColumnBorders withTableBorder withRowBorders>
							<Table.Thead>
								<Table.Tr>
									<Table.Th ta="center"></Table.Th>
									<Table.Th>AFB FOUND</Table.Th>
									<Table.Th>AFB NOT FOUND</Table.Th>
									<Table.Th>SCANTY</Table.Th>
									<Table.Th>1+</Table.Th>
									<Table.Th>2+</Table.Th>
									<Table.Th>3+</Table.Th>
								</Table.Tr>
								<Table.Tr>
									<Table.Th ta="center">Sample 1</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.afb_found}
											onChange={(event) =>
												form.setFieldValue("afb_found", event.currentTarget.checked)
											}
											styles={{ body: { justifyContent: "center" } }}
											
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.afb_not_found}
											onChange={(event) =>
												form.setFieldValue("afb_not_found", event.currentTarget.checked)
											}
											styles={{ body: { justifyContent: "center" } }}
											
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.afb_scanty}
											onChange={(event) =>
												form.setFieldValue("afb_scanty", event.currentTarget.checked)
											}
											styles={{ body: { justifyContent: "center" } }}
											
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.afb_scanty_one}
											onChange={(event) =>
												form.setFieldValue("afb_scanty_one", event.currentTarget.checked)
											}
											styles={{ body: { justifyContent: "center" } }}
											
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.afb_scanty_two}
											onChange={(event) =>
												form.setFieldValue("afb_scanty_two", event.currentTarget.checked)
											}
											styles={{ body: { justifyContent: "center" } }}
											
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.afb_scanty_three}
											onChange={(event) =>
												form.setFieldValue("afb_scanty_three", event.currentTarget.checked)
											}
											styles={{ body: { justifyContent: "center" } }}
											
										/>
									</Table.Th>
								</Table.Tr>
								<Table.Tr>
									<Table.Th ta="center">Sample 2</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.afb_sample_found}
											onChange={(event) =>
												form.setFieldValue("afb_sample_found", event.currentTarget.checked)
											}
											styles={{ body: { justifyContent: "center" } }}
											
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.afb_sample_not_found}
											onChange={(event) =>
												form.setFieldValue("afb_sample_not_found", event.currentTarget.checked)
											}
											styles={{ body: { justifyContent: "center" } }}
											
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.afb_sample_scanty}
											onChange={(event) =>
												form.setFieldValue("afb_sample_scanty", event.currentTarget.checked)
											}
											styles={{ body: { justifyContent: "center" } }}
											
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.afb_sample_scanty_one}
											onChange={(event) =>
												form.setFieldValue("afb_sample_scanty_one", event.currentTarget.checked)
											}
											styles={{ body: { justifyContent: "center" } }}
											
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.afb_sample_scanty_two}
											onChange={(event) =>
												form.setFieldValue("afb_sample_scanty_two", event.currentTarget.checked)
											}
											styles={{ body: { justifyContent: "center" } }}
											
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.afb_sample_scanty_three}
											onChange={(event) =>
												form.setFieldValue("afb_sample_scanty_three", event.currentTarget.checked)
											}
											styles={{ body: { justifyContent: "center" } }}
											
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
