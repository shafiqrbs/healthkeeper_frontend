import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { getDataWithoutStore } from "@/services/apiService";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import LabReportA4BN from "@hospital-components/print-formats/lab-reports/LabReportA4BN";
import { Box, Button, Flex, Grid, Stack, Text } from "@mantine/core";
import { IconPrinter } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useReactToPrint } from "react-to-print";
import { useParams } from "react-router";

export default function ReportSubmission({ form, handleSubmit, diagnosticReport }) {
	const labReportRef = useRef(null);
	const { t } = useTranslation();
	const [labReportData, setLabReportData] = useState(null);
	const { reportId } = useParams();

	const printLabReport = useReactToPrint({
		content: () => labReportRef.current,
	});

	const handleLabReport = async (id) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.LAB_TEST.PRINT}/${id}`,
		});
		setLabReportData(res?.data);
		requestAnimationFrame(printLabReport);
	};

	return (
		<Stack gap={0} justify="space-between" mt="xs">
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Box px="md" bg="var(--theme-tertiary-color-2)">
					<Grid columns={12}>
						<Grid.Col span={10} className="animate-ease-out">
							<Box w="100%">
								{diagnosticReport?.process === "Done" ? (
									<Box h={"56"}>
										<strong>Comment:</strong> {diagnosticReport?.comment}
									</Box>
								) : (
									<TextAreaForm
										id="comment"
										form={form}
										tooltip={t("EnterComment")}
										placeholder={t("EnterComment")}
										name="comment"
									/>
								)}
							</Box>
						</Grid.Col>
						<Grid.Col span={2}>
							<Box>
								{diagnosticReport?.process === "Done" && (
									<Flex
										mt={"les"}
										gap="xs"
										justify="flex-start"
										align="center"
										direction="row"
										wrap="wrap"
									>
										<Button
											onClick={() => handleLabReport(reportId)}
											size="md"
											color="var(--theme-secondary-color-5)"
											type="button"
											id="EntityFormSubmit"
											rightSection={<IconPrinter size="18px" />}
										>
											<Flex direction="column" gap={0}>
												<Text fz={"xs"}>{t("Print")}</Text>
												<Flex
													direction="column"
													align="center"
													fz="2xs"
													c="white"
												>
													alt+p
												</Flex>
											</Flex>
										</Button>
									</Flex>
								)}
								<Flex
									mt={"les"}
									justify="center"
									align="flex-start"
									direction="row"
									wrap="wrap"
								>
									{diagnosticReport?.process === "Tagged" && (
										<Button
											size="md"
											className="btnPrimaryBg"
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
									)}
									{diagnosticReport?.process === "In-progress" && (
										<Button
											size="md"
											fz={"xs"}
											bg="var(--theme-primary-color-6)"
											type="submit"
											id="handleSubmit"
										>
											<Flex direction="column" gap={0}>
												<Text fz="xs">{t("Confirm")}</Text>
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
									)}
								</Flex>
							</Box>
						</Grid.Col>
					</Grid>
				</Box>
			</form>
			<LabReportA4BN data={labReportData} ref={labReportRef} />
		</Stack>
	);
}
