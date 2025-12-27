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
export default function AFBCulture({ diagnosticReport, refetchDiagnosticReport, refetchLabReport }) {
	const { reportId } = useParams();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const custom_report = diagnosticReport?.custom_report || {};
	const is_completed = diagnosticReport?.process?.toLowerCase() === "done";
	console.log(custom_report);
	const form = useForm({
		initialValues: {
			afb_diagnosis: custom_report?.afb_diagnosis || "",
			afb_contaminated: custom_report?.afb_contaminated || "",
			negative: custom_report?.negative || "",
			positive: custom_report?.positive || "",
			atypical_mycobacteria_species: custom_report?.atypical_mycobacteria_species || "",
			follow_up_month: custom_report?.follow_up_month ? new Date(custom_report.follow_up_month) : null,
			colonies_1: custom_report?.colonies_1 || 0,
			colonies_2: custom_report?.colonies_2 || 0,
			colonies_3: custom_report?.colonies_3 || 0,
			colonies_4: custom_report?.colonies_4 || 0,
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
						<Grid.Col span={6}>
							<InputForm
								name="afb_diagnosis"
								id="afb_diagnosis"
								nextField="test_name"
								form={form}
								label="Diagnosis"
								placeholder="Enter Diagnosis"
							/>
						</Grid.Col>
						<Grid.Col span={6}>
							<DatePickerForm
								name="follow_up_month"
								id="follow_up_month"
								nextField="test_name"
								form={form}
								label="Follow Up Month"
								placeholder="Select Follow Up Month"
							/>
						</Grid.Col>
					</Grid>
					{/* =============== results table =============== */}
					<Box my="md">
						<Table withColumnBorders withTableBorder withRowBorders>
							<Table.Thead>
								<Table.Tr>
									<Table.Th colSpan={5}/>
									<Table.Th colSpan={4} ta="center">
										Mycobacterium tuberculosis Complex
									</Table.Th>
								</Table.Tr>
								<Table.Tr>
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
										<InputForm
											w={120}
											name="afb_contaminated"
											id="afb_contaminated"
											nextField="negative"
											form={form}
											label=""
											placeholder="Yes/No"
										/>
									</Table.Th>
									<Table.Th ta="center">
										<InputForm
											w={120}
											name="negative"
											id="negative"
											nextField="positive"
											form={form}
											label=""
											placeholder="Yes/No"
										/>
									</Table.Th>
									<Table.Th ta="center">
										<InputForm
											w={120}
											name="positive"
											id="positive"
											nextField="atypical_mycobacteria_species"
											form={form}
											label=""
											placeholder="Yes/No"
										/>
									</Table.Th>
									<Table.Th ta="center">
										<InputForm
											w={120}
											name="atypical_mycobacteria_species"
											form={form}
											label=""
											placeholder="Describe"
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.colonies_1}
											onChange={(event) =>
												form.setFieldValue("colonies_1", event.currentTarget.checked)
											}
											styles={{ body: { justifyContent: "center" } }}
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.colonies_2}
											onChange={(event) =>
												form.setFieldValue("colonies_2", event.currentTarget.checked)
											}
											styles={{ body: { justifyContent: "center" } }}
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.colonies_3}
											onChange={(event) =>
												form.setFieldValue("colonies_3", event.currentTarget.checked)
											}
											styles={{ body: { justifyContent: "center" } }}
										/>
									</Table.Th>
									<Table.Th ta="center">
										<Checkbox
											checked={form.values.colonies_4}
											onChange={(event) =>
												form.setFieldValue("colonies_4", event.currentTarget.checked)
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
