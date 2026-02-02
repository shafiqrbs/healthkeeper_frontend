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
import InputNumberForm from "@components/form-builders/InputNumberForm";
import InputForm from "@components/form-builders/InputForm";
import {formatDateForMySQL} from "@utils/index";

const module = MODULES.LAB_TEST;

// =============== sars cov2 results are now handled as individual boolean properties ===============
export default function SputumAFB({ diagnosticReport, refetchDiagnosticReport, refetchLabReport }) {
	const { reportId } = useParams();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const custom_report = diagnosticReport?.custom_report || {};

	const form = useForm({
		initialValues: {
			sample_id: custom_report?.sample_id || '',
			test_id: custom_report?.test_id || '',
			test_date: custom_report?.test_date
				? new Date(custom_report.test_date)
				: null,
			date_specimen_received: custom_report?.date_specimen_received
				? new Date(custom_report.date_specimen_received)
				: null,
			afb_found: custom_report?.afb_found || "",
			afb_not_found: custom_report?.afb_not_found || "",
			afb_scanty: custom_report?.afb_scanty || "",

			afb_sample_found: custom_report?.afb_sample_found || "",
			afb_sample_not_found: custom_report?.afb_sample_not_found || "",
			afb_sample_scanty: custom_report?.afb_sample_scanty || "",

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
						...values,
						test_date: formatDateForMySQL(values.test_date),
						date_specimen_received: formatDateForMySQL(values.date_specimen_received),
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
							name="date_specimen_received"
							id="date_specimen_received"
							nextField="comment"
							form={form}
							label="Receive Date"
							placeholder="Select receive date"
						/>
						<DatePickerForm
							name="test_date"
							id="test_date"
							nextField="comment"
							form={form}
							label="Test Date"
							placeholder="Select date"
						/>
						<InputNumberForm
							name="sample_id"
							id="sample_id"
							nextField="id"
							form={form}
							label="Sample ID"
							placeholder="Enter Sample ID"
						/>
						<InputNumberForm
							name="test_id"
							id="test_id"
							nextField="id"
							form={form}
							label="Lab Test ID"
							placeholder="Enter Lab Test ID"
						/>

					</Group>
					{/* =============== results table =============== */}
					<Box my="md">
						<Table withColumnBorders withTableBorder withRowBorders>
							<Table.Thead>
								<Table.Tr>
									<Table.Th ta="center"></Table.Th>
									<Table.Th>NO AFB FOUND</Table.Th>
									<Table.Th>SCANTY</Table.Th>
									<Table.Th>1+</Table.Th>
									<Table.Th>2+</Table.Th>
									<Table.Th>3+</Table.Th>
								</Table.Tr>
								<Table.Tr>
									<Table.Th ta="center">Sample 1</Table.Th>
									{/*<Table.Th ta="center">
										<InputForm
											w={120}
											name="afb_found"
											id="afb_found"
											nextField="afb_not_found"
											form={form}
											label=""
											placeholder="Enter value"
										/>
									</Table.Th>*/}
									<Table.Th ta="center">
										<InputForm
											w={120}
											name="afb_not_found"
											id="afb_not_found"
											nextField="afb_scanty"
											form={form}
											label=""
											placeholder="Enter value"
										/>
									</Table.Th>
									<Table.Th ta="center">
										<InputForm
											w={120}
											name="afb_scanty"
											id="afb_scanty"
											nextField="afb_scanty_one"
											form={form}
											label=""
											placeholder="Enter value"
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.afb_scanty_one}
											onChange={(event) =>
												form.setFieldValue(
													"afb_scanty_one",
													event.currentTarget.checked
												)
											}
											styles={{ body: { justifyContent: "center" } }}
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.afb_scanty_two}
											onChange={(event) =>
												form.setFieldValue(
													"afb_scanty_two",
													event.currentTarget.checked
												)
											}
											styles={{ body: { justifyContent: "center" } }}
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.afb_scanty_three}
											onChange={(event) =>
												form.setFieldValue(
													"afb_scanty_three",
													event.currentTarget.checked
												)
											}
											styles={{ body: { justifyContent: "center" } }}
										/>
									</Table.Th>
								</Table.Tr>
								<Table.Tr>
									<Table.Th ta="center">Sample 2</Table.Th>
									{/*<Table.Th ta="center">
										<InputForm
											w={120}
											name="afb_sample_found"
											id="afb_sample_found"
											nextField="afb_sample_not_found"
											form={form}
											label=""
											placeholder="Enter value"
										/>
									</Table.Th>*/}
									<Table.Th ta="center">
										<InputForm
											w={120}
											name="afb_sample_not_found"
											id="afb_sample_not_found"
											nextField="afb_sample_scanty"
											form={form}
											label=""
											placeholder="Enter value"
										/>
									</Table.Th>
									<Table.Th ta="center">
										<InputForm
											w={120}
											name="afb_sample_scanty"
											id="afb_sample_scanty"
											nextField="afb_sample_scanty_one"
											form={form}
											label=""
											placeholder="Enter value"
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.afb_sample_scanty_one}
											onChange={(event) =>
												form.setFieldValue(
													"afb_sample_scanty_one",
													event.currentTarget.checked
												)
											}
											styles={{ body: { justifyContent: "center" } }}
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.afb_sample_scanty_two}
											onChange={(event) =>
												form.setFieldValue(
													"afb_sample_scanty_two",
													event.currentTarget.checked
												)
											}
											styles={{ body: { justifyContent: "center" } }}
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.afb_sample_scanty_three}
											onChange={(event) =>
												form.setFieldValue(
													"afb_sample_scanty_three",
													event.currentTarget.checked
												)
											}
											styles={{ body: { justifyContent: "center" } }}
										/>
									</Table.Th>
								</Table.Tr>
							</Table.Thead>
						</Table>
					</Box>
				</Stack>
			</ScrollArea>
			<ReportSubmission diagnosticReport={diagnosticReport} form={form} handleSubmit={handleSubmit} />
		</Box>
	);
}
