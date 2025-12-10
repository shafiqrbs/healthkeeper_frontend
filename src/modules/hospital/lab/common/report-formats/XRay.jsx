import { Box, Stack, Table, Group, Text, ScrollArea, Grid } from "@mantine/core";
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
import TextAreaForm from "@components/form-builders/TextAreaForm";

const module = MODULES.LAB_TEST;

// =============== sars cov2 results are now handled as individual boolean properties ===============
export default function XRay({ diagnosticReport, refetchDiagnosticReport, refetchLabReport }) {
	const { reportId } = useParams();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const custom_report = diagnosticReport?.custom_report || {};
	const is_completed = diagnosticReport?.process === "Done";
	const form = useForm({
		initialValues: {
			trachea: custom_report?.trachea || "",
			diaphragm: custom_report?.diaphragm || "",
			lungs: custom_report?.lungs || "",
			heart: custom_report?.heart || "",
			bony_thorax: custom_report?.bony_thorax || "",
			impression: custom_report?.impression || "",
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
					{/* =============== date specimen collection =============== */}

					<Grid>
						<Grid.Col span={3}>Trachea</Grid.Col>
						<Grid.Col span={9}>
							<TextAreaForm
								label=""
								placeholder="Enter Trachea"
								name="trachea"
								id="trachea"
								nextField="diaphragm"
								form={form}
								readOnly={is_completed}
							/>
						</Grid.Col>
					</Grid>
					<Grid>
						<Grid.Col span={3}>Diaphragm</Grid.Col>
						<Grid.Col span={9}>
							<TextAreaForm
								label=""
								placeholder="Enter Diaphragm"
								name="diaphragm"
								id="diaphragm"
								nextField="referral_center"
								form={form}
								readOnly={is_completed}
							/>
						</Grid.Col>
					</Grid>
					<Grid>
						<Grid.Col span={3}>Lungs</Grid.Col>
						<Grid.Col span={9}>
							<TextAreaForm
								label=""
								placeholder="Enter Diaphragm"
								name="lungs"
								id="lungs"
								nextField="heart"
								form={form}
								readOnly={is_completed}
							/>
						</Grid.Col>
					</Grid>
					<Grid>
						<Grid.Col span={3}>heart</Grid.Col>
						<Grid.Col span={9}>
							<TextAreaForm
								label=""
								placeholder="Enter Diaphragm"
								name="heart"
								id="heart"
								nextField="bony_thorax"
								form={form}
								readOnly={is_completed}
							/>
						</Grid.Col>
					</Grid>
					<Grid>
						<Grid.Col span={3}>Bony Thorax</Grid.Col>
						<Grid.Col span={9}>
							<TextAreaForm
								label=""
								placeholder="Enter Diaphragm"
								name="bony_thorax"
								id="bony_thorax"
								nextField="impression"
								form={form}
								readOnly={is_completed}
							/>
						</Grid.Col>
					</Grid>
					<Grid>
						<Grid.Col span={3}>Impression</Grid.Col>
						<Grid.Col span={9}>
							<TextAreaForm
								label=""
								placeholder="Enter Diaphragm"
								name="impression"
								id="impression"
								nextField="impression"
								form={form}
								readOnly={is_completed}
							/>
						</Grid.Col>
					</Grid>
				</Stack>
			</ScrollArea>
			<ReportSubmission
				diagnosticReport={diagnosticReport}
				form={form}
				handleSubmit={handleSubmit}
			/>
		</Box>
	);
}
