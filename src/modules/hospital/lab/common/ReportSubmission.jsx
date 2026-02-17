import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { getDataWithoutStore } from "@/services/apiService";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import LabReportA4BN from "@hospital-components/print-formats/lab-reports/LabReportA4BN";
import { Box, Button, Flex, Grid, Group, Stack, Text } from "@mantine/core";
import { IconPrinter } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useReactToPrint } from "react-to-print";
import { useParams } from "react-router";
import useAppLocalStore from "@hooks/useAppLocalStore";
import InputForm from "@components/form-builders/InputForm";
import { useHotkeys } from "@mantine/hooks";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";

const ALLOWED_LAB_DOCTOR_ROLES = [ "doctor_lab" ];
const ALLOWED_LAB_USER_ROLES = [ "lab_assistant" ];

export default function ReportSubmission({ form, handleSubmit, diagnosticReport, submissionFunc }) {
	const labReportRef = useRef(null);
	const { t } = useTranslation();
	const [ labReportData, setLabReportData ] = useState(null);
	const { reportId } = useParams();
	const { userRoles } = useAppLocalStore();
	const printLabReport = useReactToPrint({
		content: () => labReportRef.current,
	});

	useEffect(() => {
		if (diagnosticReport?.comment) {
			form.setFieldValue("comment", diagnosticReport?.comment);
			form.setFieldValue("lab_no", diagnosticReport?.lab_no);
		}
	}, [ diagnosticReport?.comment ]);

	const handleLabReport = async (id) => {
		if (submissionFunc) {
			// use the submission return data as print data
			const res2 = await submissionFunc(form.values);
			setLabReportData(res2?.data);
		//	requestAnimationFrame(printLabReport);
			console.log("Save Response: ", res2?.data)
		} else {
			// fallback: will be removed after fixing the print issue
			const res = await getDataWithoutStore({
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.LAB_TEST.PRINT}/${id}`,
			});
			console.log("Print API: ", res?.data)
			setLabReportData(res?.data);
		}

	};

	useEffect(() => {
		if(labReportData){
			printLabReport();
		}
	}, [labReportData]);

	useHotkeys(
		[
			[
				"alt+s",
				() => {
					const submitButton =
						document.getElementById("handleSubmit");
					if (submitButton) {
						submitButton.click();
					}
				},
			],
			[
				"alt+p",
				() => {
					const submitButton =
						document.querySelector("#EntityFormSubmit.shortcut-helper");
					if (submitButton) {
						submitButton.click();
					}
				},
			],
		],
		[ "SELECT" ]
	);

	return (
		<Stack gap={0} justify="space-between" mt="xs">
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Box px="md" bg="var(--theme-tertiary-color-2)">
					<Grid columns={12}>
						<Grid.Col span={5} className="animate-ease-out">
							<Box w="100%">
								<TextAreaForm
									id="comment"
									form={form}
									tooltip={t("EnterComment")}
									placeholder={t("EnterComment")}
									name="comment"
								/>
							</Box>
						</Grid.Col>
						<Grid.Col span={7}>
							<Box>
								<Grid columns={12}>
									<Grid.Col span={5} className="animate-ease-out" mt={'xs'}>
										<InputForm
											id="lab_no"
											form={form}
											tooltip={t("EnterLabNo")}
											placeholder={t("EnterLabNo")}
											name="lab_no"
										/>
									</Grid.Col>
									<Grid.Col span={7} className="animate-ease-out" mt={'xs'}>
										<Group justify="center">
											{/* {diagnosticReport?.process === "Done" && ( */}
											<Button
												onClick={() => handleLabReport(reportId)}
												size="md"
												color="var(--theme-warn-color-5)"
												type="button"
												id="EntityFormSubmit"
												className="shortcut-helper"
											>
												<Flex direction="column" gap={0}>
													<Text fz="md">{t("Print")}</Text>
													<Flex
														direction="column"
														align="center"
														fz="2xs"
														c="white">
														alt+p
													</Flex>
												</Flex>
											</Button>
											{/* )} */}
											<Button
												size="md"
												fz={"xs"}
												bg="var(--theme-primary-color-6)"
												type="submit"
												id="handleSubmit"
											>
												<Flex direction="column" gap={0}>
													<Text fz="md">{t("Save")}</Text>
													<Flex
														direction="column"
														align="center"
														fz="2xs"
														c="white"
													>
														alt+s
													</Flex>
												</Flex>
											</Button>
										</Group>
									</Grid.Col>
								</Grid>
							</Box>
						</Grid.Col>
					</Grid>
				</Box>
			</form>
			<LabReportA4BN data={labReportData} ref={labReportRef} />
		</Stack>
	);
}
