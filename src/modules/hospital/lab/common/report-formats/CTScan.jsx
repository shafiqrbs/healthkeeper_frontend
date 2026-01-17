import { Box, Stack, Text, ScrollArea, Grid } from "@mantine/core";
import { useForm } from "@mantine/form";
import ReportSubmission from "../ReportSubmission";
import { useOutletContext, useParams } from "react-router-dom";
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
import ReportKeywordAutocomplete from "@components/form-builders/ReportKeywordAutocomplete";

const module = MODULES.LAB_TEST;

export default function CTScan({ diagnosticReport, refetchDiagnosticReport, refetchLabReport }) {
	const { reportId } = useParams();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const custom_report = diagnosticReport?.custom_report || {};

	const form = useForm({
		initialValues: {
			technique: custom_report?.technique || "5 mm non-contrast and contrast CT scan of chest were obtaiend",
			parenchyma: custom_report?.parenchyma || "No local or diffuse sen in lunge parenchyma Parenchyma",
			mediastinum_vessels: custom_report?.mediastinum_vessels || "Appear normal",
			mediastinum_lymph_nodes: custom_report?.mediastinum_lymph_nodes || "Central position",
			mediastinum_oesophagus: custom_report?.mediastinum_oesophagus || "Appear normal",
			mediastinum_thymus: custom_report?.mediastinum_thymus || "Not enlarged",
			mediastinum_trachea: custom_report?.mediastinum_trachea || "Central position",
			heart: custom_report?.heart || "Normal in ID",
			pleura: custom_report?.pleura || "Appear normal",
			bones: custom_report?.bones || "Appear normal",
			findings: custom_report?.parenchyma || "No local or diffuse sen in lunge parenchyma Parenchyma",
			after_iv_contrast: custom_report?.after_iv_contrast || "No abnormal contrast uptake is seen",
			impression: custom_report?.impression || "Normal CT scan of chest",
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
						<Grid>
							<Grid.Col span={3}>Technique</Grid.Col>
							<Grid.Col span={9}>
								<ReportKeywordAutocomplete
									particularId={diagnosticReport?.particular_id}
									baseUrl={HOSPITAL_DATA_ROUTES.API_ROUTES.LAB_TEST.SUGGESTIONS}
									fieldName="technique"
									form={form}
									name="technique"
									id="technique"
									placeholder="5 mm non-contrast and contrast CT scan of chest were obtained"
									clearable
								/>
							</Grid.Col>
						</Grid>
						<Grid>
							<Grid.Col span={12}>Findings</Grid.Col>
						</Grid>
						<Grid>
							<Grid.Col span={3}>Parenchyma</Grid.Col>
							<Grid.Col span={9}>
								<ReportKeywordAutocomplete
									particularId={diagnosticReport?.particular_id}
									baseUrl={HOSPITAL_DATA_ROUTES.API_ROUTES.LAB_TEST.SUGGESTIONS}
									fieldName="parenchyma"
									form={form}
									name="parenchyma"
									id="parenchyma"
									placeholder="No local or diffuse sen in lunge parenchyma Parenchyma"
									clearable
								/>
							</Grid.Col>
						</Grid>
						<Grid>
							<Grid.Col span={12}>Mediastinum</Grid.Col>
						</Grid>
						<Grid>
							<Grid.Col span={1} />
							<Grid.Col span={2} fz={"xs"}>
								a. Vessels
							</Grid.Col>
							<Grid.Col span={9}>
								<InputForm
									form={form}
									name="mediastinum_vessels"
									id="mediastinum_vessels"
									placeholder="Appear normal"
								/>
							</Grid.Col>
						</Grid>
						<Grid>
							<Grid.Col span={1} />
							<Grid.Col span={2} fz={"xs"}>
								b. Trachea-
							</Grid.Col>
							<Grid.Col span={9}>
								<InputForm
									form={form}
									name="mediastinum_trachea"
									id="mediastinum_trachea"
									placeholder="Central position"
								/>
							</Grid.Col>
						</Grid>
						<Grid>
							<Grid.Col span={1} />
							<Grid.Col span={2} fz={"xs"}>
								c. Oesophagus-
							</Grid.Col>
							<Grid.Col span={9}>
								<InputForm
									form={form}
									name="mediastinum_oesophagus"
									id="mediastinum_oesophagus"
									placeholder="Appear normal"
								/>
							</Grid.Col>
						</Grid>
						<Grid>
							<Grid.Col span={1} />
							<Grid.Col span={2} fz={"xs"}>
								d. Thymus-
							</Grid.Col>
							<Grid.Col span={9}>
								<InputForm
									form={form}
									name="mediastinum_thymus"
									id="mediastinum_thymus"
									placeholder="Not enlarged"
								/>
							</Grid.Col>
						</Grid>
						<Grid>
							<Grid.Col span={1} />
							<Grid.Col span={2} fz={"xs"}>
								d. Lymph Nodes-
							</Grid.Col>
							<Grid.Col span={9}>
								<InputForm
									form={form}
									name="mediastinum_lymph_nodes"
									id="mediastinum_lymph_nodes"
									placeholder="Not enlarged"
								/>
							</Grid.Col>
						</Grid>
						<Grid>
							<Grid.Col span={3}>Heart</Grid.Col>
							<Grid.Col span={9}>
								<InputForm form={form} name="heart" id="heart" placeholder="Normal in ID" minRows={3} />
							</Grid.Col>
						</Grid>

						<Grid>
							<Grid.Col span={3}>Pleura</Grid.Col>
							<Grid.Col span={9}>
								<InputForm
									form={form}
									name="pleura"
									id="pleura"
									placeholder="Appear normal"
									minRows={3}
								/>
							</Grid.Col>
						</Grid>
						<Grid>
							<Grid.Col span={3}>Bones</Grid.Col>
							<Grid.Col span={9}>
								<InputForm
									form={form}
									name="bones"
									id="bones"
									placeholder="Appear normal"
									minRows={3}
								/>
							</Grid.Col>
						</Grid>
						<Grid>
							<Grid.Col span={3}>After I/V Contrast</Grid.Col>
							<Grid.Col span={9}>
								<InputForm
									form={form}
									name="after_iv_contrast"
									id="after_iv_contrast"
									placeholder="No abnormal contrast uptake is seen"
									minRows={3}
								/>
							</Grid.Col>
						</Grid>

						<Grid>
							<Grid.Col span={3}>Impression</Grid.Col>
							<Grid.Col span={9}>
								<InputForm
									form={form}
									name="impression"
									id="impression"
									placeholder="Normal CT scan of chest"
									minRows={3}
								/>
							</Grid.Col>
						</Grid>
					</Stack>
				</ScrollArea>
			</Box>
			<ReportSubmission diagnosticReport={diagnosticReport} form={form} handleSubmit={handleSubmit} />
		</>
	);
}
