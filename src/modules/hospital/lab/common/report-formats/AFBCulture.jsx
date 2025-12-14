import { Box, Stack, Table, Group, Text, ScrollArea, Grid } from "@mantine/core";
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
export default function AFBCulture({ diagnosticReport, refetchDiagnosticReport, refetchLabReport }) {
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
			contaminated: custom_report?.contaminated || 0,
			negative: custom_report?.negative || 0,
			atypical_mycobacteria_species: custom_report?.atypical_mycobacteria_species || 0,
			less_than_20_colonies_actual_count: custom_report?.less_than_20_colonies_actual_count || 0,
			more_than_20_colonies_1_to_100: custom_report?.more_than_20_colonies_1_to_100 || 0,
			more_than_20_colonies_100_to_200: custom_report?.more_than_20_colonies_100_to_200 || 0,
			more_than_20_colonies_200_and_above: custom_report?.more_than_20_colonies_200_and_above || 0,
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
					<InputForm
						name="diagnosis"
						id="diagnosis"
						nextField="test_name"
						form={form}
						label="Diagnosis"
						placeholder="Enter Diagnosis"
						readOnly={is_completed}
					/>
					<Box>
						<Text>Other test results (if any):</Text>
						<Grid columns={14}>
							<Grid.Col span={6}>Microscopy</Grid.Col>
							<Grid.Col span={8}>
								<InputForm
									name="microscopy"
									id="microscopy"
									nextField="microscopy"
									form={form}
									label="Microscopy"
									placeholder="Enter Microscopy"
									readOnly={is_completed}
								/>
							</Grid.Col>
							<Grid.Col span={6}>GeneXpert</Grid.Col>
							<Grid.Col span={8}>
								<InputForm
									name="genexpert"
									id="genexpert"
									nextField="genexpert"
									form={form}
									label="GeneXpert"
									placeholder="Enter GeneXpert"
									readOnly={is_completed}
								/>
							</Grid.Col>
							<Grid.Col span={6}>Culture</Grid.Col>
							<Grid.Col span={8}>
								<InputForm
									name="culture"
									id="culture"
									nextField="culture"
									form={form}
									label="Culture"
									placeholder="Enter Culture"
									readOnly={is_completed}
								/>
							</Grid.Col>
							<Grid.Col span={6}>DST</Grid.Col>
							<Grid.Col span={8}>
								<InputForm
									name="dst"
									id="dst"
									nextField="dst"
									form={form}
									label="DST"
									placeholder="Enter DST"
									readOnly={is_completed}
								/>
							</Grid.Col>
						</Grid>
					</Box>

					{/* =============== results table =============== */}
					<Box my="md">
						<Table withColumnBorders withTableBorder withRowBorders>
							<Table.Thead>
								<Table.Tr>
									<Table.Th colSpan={5}></Table.Th>
									<Table.Th colSpan={4} ta="center">
										Mycobacterium tuberculosis Complex
									</Table.Th>
								</Table.Tr>
								<Table.Tr>
									<Table.Th ta="center">ID#</Table.Th>
									<Table.Th ta="center">Contaminated</Table.Th>
									<Table.Th ta="center">Negative</Table.Th>
									<Table.Th ta="center">Positive</Table.Th>
									<Table.Th ta="center">Atypical Mycobacteria (Species)</Table.Th>
									<Table.Th ta="center">{"<20=1-19 Colonies actual count"}</Table.Th>
									<Table.Th ta="center">{"1+=20-100 Colonies"}</Table.Th>
									<Table.Th ta="center">{"2+=>100-200 Colonies"}</Table.Th>
									<Table.Th ta="center">{"3+=>200 Colonies"}</Table.Th>
								</Table.Tr>
								<Table.Tr>
									<Table.Th ta="center">
										<InputNumberForm
											w={120}
											name="id"
											id="id"
											nextField="rif_resistance_not_detected"
											form={form}
											label=""
											placeholder="Enter ID"
											readOnly={is_completed}
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.rif_resistance_not_detected}
											onChange={(event) =>
												form.setFieldValue("contaminated", event.currentTarget.checked)
											}
											styles={{ body: { justifyContent: "center" } }}
											readOnly={is_completed}
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.rif_resistance_detected}
											onChange={(event) =>
												form.setFieldValue("negative", event.currentTarget.checked)
											}
											styles={{ body: { justifyContent: "center" } }}
											readOnly={is_completed}
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.rif_resistance_indeterminate}
											onChange={(event) =>
												form.setFieldValue(
													"rif_resistance_indeterminate",
													event.currentTarget.checked
												)
											}
											styles={{ body: { justifyContent: "center" } }}
											readOnly={is_completed}
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.mtb_not_detected}
											onChange={(event) =>
												form.setFieldValue("mtb_not_detected", event.currentTarget.checked)
											}
											styles={{ body: { justifyContent: "center" } }}
											readOnly={is_completed}
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.invalid}
											onChange={(event) =>
												form.setFieldValue("invalid", event.currentTarget.checked)
											}
											styles={{ body: { justifyContent: "center" } }}
											readOnly={is_completed}
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.atypical_mycobacteria_species}
											onChange={(event) =>
												form.setFieldValue(
													"atypical_mycobacteria_species",
													event.currentTarget.checked
												)
											}
											styles={{ body: { justifyContent: "center" } }}
											readOnly={is_completed}
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.more_than_20_colonies_1_to_100}
											onChange={(event) =>
												form.setFieldValue("invalid", event.currentTarget.checked)
											}
											styles={{ body: { justifyContent: "center" } }}
											readOnly={is_completed}
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.less_than_20_colonies_actual_count}
											onChange={(event) =>
												form.setFieldValue(
													"less_than_20_colonies_actual_count",
													event.currentTarget.checked
												)
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
