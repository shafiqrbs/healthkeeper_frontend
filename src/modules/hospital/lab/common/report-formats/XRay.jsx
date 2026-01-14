import { useState } from "react";
import { Box, Stack, Text, ScrollArea, Grid, Popover, ActionIcon, List } from "@mantine/core";
import { useForm } from "@mantine/form";
import ReportSubmission from "../ReportSubmission";
import { useOutletContext, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { modals } from "@mantine/modals";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useDispatch } from "react-redux";
import { updateEntityData } from "@/app/store/core/crudThunk";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { ERROR_NOTIFICATION_COLOR, MODULES, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import { errorNotification } from "@components/notification/errorNotification";
import { successNotification } from "@components/notification/successNotification";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import { IconBulb } from "@tabler/icons-react";

const module = MODULES.LAB_TEST;

const SUGGESTIONS_DATA = [
	"Central in position",
	"Normal is position and contour",
	"Clear",
	"Normal is position and size",
	"Appear normal",
	"Normal findings",
	"Normal X-ray of chest",
	"Normal X-ray of chest",
];

// =============== sars cov2 results are now handled as individual boolean properties ===============
export default function XRay({ diagnosticReport, refetchDiagnosticReport, refetchLabReport }) {
	const { reportId } = useParams();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const custom_report = diagnosticReport?.custom_report || {};

	const [suggestionsPopoverOpened, setSuggestionsPopoverOpened] = useState(false);

	const insertSuggestion = (field, value) => {
		form.setFieldValue(field, value);
		setSuggestionsPopoverOpened(false);
	};

	const form = useForm({
		initialValues: {
			trachea: custom_report?.trachea || "Central in position",
			diaphragm: custom_report?.diaphragm || "Normal is position and contour",
			lungs: custom_report?.lungs || "Clear",
			heart: custom_report?.heart || "Normal is position and size",
			bony_thorax: custom_report?.bony_thorax || "Appear normal",
			impression: custom_report?.impression || "",
			impression_two: custom_report?.impression_two || "",
			comment: diagnosticReport?.comment || "Normal findings",
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
							<Box pos="relative">
								<TextAreaForm
									label=""
									placeholder="Enter Trachea"
									name="trachea"
									id="trachea"
									nextField="diaphragm"
									form={form}
									showRightSection={false}
								/>

								<Popover
									opened={suggestionsPopoverOpened}
									onChange={setSuggestionsPopoverOpened}
									position="bottom-end"
									withArrow
									shadow="md"
									trapFocus={false}
								>
									<Popover.Target>
										<ActionIcon
											size="lg"
											variant="light"
											color="orange"
											pos="absolute"
											top={10}
											aria-label="Suggestions"
											right={8}
											onClick={() => setSuggestionsPopoverOpened((o) => !o)}
										>
											<IconBulb color="#ff7800" size={24} opacity={0.5} />
										</ActionIcon>
									</Popover.Target>

									<Popover.Dropdown p="xs">
										<List spacing="xs" size="sm">
											{SUGGESTIONS_DATA.map((item, index) => (
												<List.Item
													key={index}
													className="cursor-pointer hover:text-primary"
													onClick={() => insertSuggestion("trachea", item)}
												>
													{item}
												</List.Item>
											))}
										</List>
									</Popover.Dropdown>
								</Popover>
							</Box>
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
							/>
						</Grid.Col>
					</Grid>
					<Grid>
						<Grid.Col span={3}>Impression</Grid.Col>
						<Grid.Col span={9}>
							<TextAreaForm
								label=""
								placeholder="Enter Impression"
								name="impression"
								id="impression"
								nextField="impression_two"
								form={form}
							/>
						</Grid.Col>
					</Grid>
					<Grid>
						<Grid.Col span={3} />
						<Grid.Col span={9}>
							<TextAreaForm
								label=""
								placeholder="Enter Impression Other"
								name="impression_two"
								id="impression_two"
								form={form}
							/>
						</Grid.Col>
					</Grid>
				</Stack>
			</ScrollArea>
			<ReportSubmission diagnosticReport={diagnosticReport} form={form} handleSubmit={handleSubmit} />
		</Box>
	);
}
