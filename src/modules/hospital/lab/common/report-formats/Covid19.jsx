import { Box, Stack, Table, Group, Text, ScrollArea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Checkbox, Radio } from "@mantine/core";
import ReportSubmission from "../ReportSubmission";
import { useOutletContext, useParams } from "react-router-dom";
import DatePickerForm from "@components/form-builders/DatePicker";
import InputForm from "@components/form-builders/InputForm";
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

// =============== define checkbox and radio options outside component ===============
const typeOfPatientOptions = [
	{ value: "new", label: "New" },
	{ value: "followUp", label: "Follow Up" },
];

const specimenOptions = [
	{ value: "nasal", label: "Nasal" },
	{ value: "nasopharyngeal", label: "Nasopharyngeal Swab / Nasal Wash / Aspirate" },
];

const preservativeOptions = [
	{ value: "vtm", label: "VTM" },
	{ value: "normalSaline", label: "Normal Saline" },
];

const testTypeOptions = [
	{ value: "genexpert", label: "Genexpert Test" },
	{ value: "rapid", label: "Rapid Test" },
	{ value: "rapidAntigen", label: "Rapid Antigen Test" },
	{ value: "rtPcr", label: "RT-PCR" },
];

const module = MODULES.LAB_TEST;

// =============== sars cov2 results are now handled as individual boolean properties ===============
export default function Covid19({ diagnosticReport, setDiagnosticReport, refetchDiagnosticReport }) {
	const { reportId } = useParams();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const custom_report = diagnosticReport?.custom_report || {};
	const is_completed = diagnosticReport?.process === "Done";

	const form = useForm({
		initialValues: {
			date_specimen_collection: custom_report?.date_specimen_collection
				? new Date(custom_report.date_specimen_collection)
				: null,
			specimen_identification_number: custom_report?.specimen_identification_number || "",
			referral_center: custom_report?.referral_center || "",
			type_patient: custom_report?.type_patient ? JSON.parse(custom_report.type_patient || "[]") : [],
			specimen: custom_report?.specimen ? JSON.parse(custom_report.specimen || "[]") : [],
			preservative: custom_report?.preservative ? JSON.parse(custom_report.preservative || "[]") : [],
			test_type: custom_report?.test_type || "",
			date_specimen_received: custom_report?.date_specimen_received
				? new Date(custom_report.date_specimen_received)
				: null,
			gene_xpert_hospital: custom_report?.gene_xpert_hospital || "",
			reference_laboratory_specimen_id: custom_report?.reference_laboratory_specimen_id || "",

			sars_cov_positive: custom_report?.sars_cov_positive || false,
			presumptive_pos: custom_report?.presumptive_pos || false,
			sars_covnegative: custom_report?.sars_covnegative || false,
			cov_invalid: custom_report?.cov_invalid || false,

			last_covid_test_date: custom_report?.last_covid_test_date
				? new Date(custom_report.last_covid_test_date)
				: null,
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
						preservative: JSON.stringify(values.preservative),
						specimen: JSON.stringify(values.specimen),
						type_patient: JSON.stringify(values.type_patient),

						date_specimen_collection: formatDateForMySQL(values.date_specimen_collection),
						date_specimen_received: formatDateForMySQL(values.date_specimen_received),
						last_covid_test_date: formatDateForMySQL(values.last_covid_test_date),
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
		<>
		<Box className="border-top-none" px="sm" mt="xs">
			<ScrollArea h={mainAreaHeight - 232} scrollbarSize={2} scrollbars="y">
				<Stack gap="md">
					{/* =============== date specimen collection =============== */}
					<Group grow>
						<DatePickerForm
							label="Date Specimen Collection"
							placeholder="Select date"
							name="date_specimen_collection"
							id="date_specimen_collection"
							nextField="specimen_identification_number"
							form={form}
							tooltip={t("EnterTheDateOfSpecimenCollection")}
							readOnly={is_completed}
						/>

						{/* =============== specimen identification number =============== */}
						<InputForm
							label="Specimen Identification Number"
							type="number"
							placeholder="Enter specimen identification number"
							name="specimen_identification_number"
							id="specimen_identification_number"
							nextField="referral_center"
							form={form}
							readOnly={is_completed}
						/>

						{/* =============== referral center =============== */}
						<InputForm
							label="Referral Center"
							placeholder="Enter referral center"
							name="referral_center"
							id="referral_center"
							nextField="type_patient"
							form={form}
							readOnly={is_completed}
						/>
					</Group>

					{/* =============== type of patient checkboxes =============== */}
					<Box>
						<Text size="sm" fw={500} mb="xs">
							Type of Patient
						</Text>
						<Checkbox.Group
							value={form.values.type_patient}
							onChange={(value) => form.setFieldValue("type_patient", value)}
							readOnly={is_completed}
						>
							<Group>
								{typeOfPatientOptions.map((option) => (
									<Checkbox key={option.value} value={option.value} label={option.label} />
								))}
							</Group>
						</Checkbox.Group>
					</Box>

					{/* =============== specimen checkboxes =============== */}
					<Box>
						<Text size="sm" fw={500} mb="xs">
							Specimen
						</Text>
						<Checkbox.Group
							value={form.values.specimen}
							onChange={(value) => form.setFieldValue("specimen", value)}
							readOnly={is_completed}
						>
							<Group>
								{specimenOptions.map((option) => (
									<Checkbox key={option.value} value={option.value} label={option.label} />
								))}
							</Group>
						</Checkbox.Group>
					</Box>

					{/* =============== preservative checkboxes =============== */}
					<Box>
						<Text size="sm" fw={500} mb="xs">
							Preservative
						</Text>
						<Checkbox.Group
							value={form.values.preservative}
							onChange={(value) => form.setFieldValue("preservative", value)}
							readOnly={is_completed}
						>
							<Group>
								{preservativeOptions.map((option) => (
									<Checkbox key={option.value} value={option.value} label={option.label} />
								))}
							</Group>
						</Checkbox.Group>
					</Box>

					{/* =============== test type radio buttons =============== */}
					<Box>
						<Text size="sm" fw={500} mb="xs">
							Test Type
						</Text>
						<Radio.Group
							value={form.values.test_type}
							onChange={(value) => form.setFieldValue("test_type", value)}
							readOnly={is_completed}
						>
							<Stack gap="xs">
								{testTypeOptions.map((option) => (
									<Radio key={option.value} value={option.value} label={option.label} />
								))}
							</Stack>
						</Radio.Group>
					</Box>

					<Group grow>
						{/* =============== genexpert site/hospital =============== */}
						<InputForm
							name="gene_xpert_hospital"
							id="gene_xpert_hospital"
							nextField="reference_laboratory_specimen_id"
							form={form}
							label="Genexpert Site/Hospital"
							placeholder="Enter genexpert site/hospital"
							readOnly={is_completed}
						/>

						{/* =============== reference laboratory specimen id =============== */}
						<InputForm
							name="reference_laboratory_specimen_id"
							id="reference_laboratory_specimen_id"
							nextField="sarsCov2Results"
							form={form}
							label="Reference Laboratory Specimen ID"
							placeholder="Enter reference laboratory specimen ID"
							readOnly={is_completed}
						/>
					</Group>

					{/* =============== results table =============== */}
					<Box my="md">
						<Table withColumnBorders withTableBorder withRowBorders>
							<Table.Thead>
								<Table.Tr>
									<Table.Th rowSpan={2}>Results</Table.Th>
									<Table.Th>SARS-CoV-2 POSITIVE</Table.Th>
									<Table.Th>SARS-CoV-2 PRESUMTIVE</Table.Th>
									<Table.Th>SARS-CoV-2 NEGATIVE</Table.Th>
									<Table.Th>INVALID/ERROR/NO RESULT</Table.Th>
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
											checked={form.values.presumptive_pos}
											onChange={(event) =>
												form.setFieldValue("presumptive_pos", event.currentTarget.checked)
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

					<Group grow>
						<DatePickerForm
							label="Date of Specimen Received/Collected"
							placeholder="Select date"
							name="date_specimen_received"
							id="date_specimen_received"
							nextField="gene_xpert_hospital"
							form={form}
							tooltip={t("EnterTheDateOfSpecimenReceivedOrCollected")}
							readOnly={is_completed}
						/>
						<DatePickerForm
							label="Test Date"
							placeholder="Select date"
							name="last_covid_test_date"
							id="last_covid_test_date"
							nextField="comment"
							form={form}
							tooltip={t("EnterTheDateOfLastCovidTest")}
							readOnly={is_completed}
						/>
					</Group>
					{/* =============== text date =============== */}
				</Stack>
			</ScrollArea>

		</Box>
	    <ReportSubmission diagnosticReport={diagnosticReport} form={form} handleSubmit={handleSubmit} />
		</>
	);
}
