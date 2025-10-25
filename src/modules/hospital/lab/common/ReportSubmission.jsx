import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { getDataWithoutStore } from "@/services/apiService";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import LabReportA4BN from "@components/print-formats/lab-reports/LabReportA4BN";
import { Box, Button, Flex, Grid, Stack, Text } from "@mantine/core";
import { IconPrinter } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useReactToPrint } from "react-to-print";

export default function ReportSubmission({ form, handleSubmit, diagnosticReport }) {
	const labReportRef = useRef(null);
	const { t } = useTranslation();
	const [labReportData, setLabReportData] = useState(null);

	const printLabReport = useReactToPrint({
		content: () => labReportRef.current,
	});

	const handleLabReport = async (id) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.LAB_TEST.PRINT}/${id}`,
		});
		console.log(res);
		setLabReportData(res?.data);
		requestAnimationFrame(printLabReport);
	};

	return (
		<Stack gap={0} justify="space-between" mt="xs">
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Box p="sm" px="md" bg="var(--theme-tertiary-color-1)">
					<Box w="100%">
						{diagnosticReport?.process === "Done" ? (
							<>
								<Box h={"56"}>
									<strong>Comment:</strong> {diagnosticReport?.comment}
								</Box>
							</>
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
					<Box mt="xs">
						<Grid columns={12}>
							<Grid.Col span={6} className="animate-ease-out">
								{diagnosticReport?.process === "Done" && (
									<Flex
										mih={50}
										gap="xs"
										justify="flex-start"
										align="center"
										direction="row"
										wrap="wrap"
									>
										<Button
											onClick={() => handleLabReport(diagnosticReport?.id)}
											size="xs"
											color="var(--theme-secondary-color-5)"
											type="button"
											id="EntityFormSubmit"
											rightSection={<IconPrinter size="18px" />}
										>
											<Flex direction="column" gap={0}>
												<Text fz={"xs"}>{t("Print")}</Text>
												<Flex direction="column" align="center" fz="xxs" c="white">
													alt+p
												</Flex>
											</Flex>
										</Button>
									</Flex>
								)}
							</Grid.Col>
							<Grid.Col span={6} className="animate-ease-out">
								<Flex mih={50} gap="xs" justify="flex-end" align="center" direction="row" wrap="wrap">
									{diagnosticReport?.process === "New" && (
										<Button size="xs" className="btnPrimaryBg" type="submit" id="handleSubmit">
											<Flex direction="column" gap={0}>
												<Text fz="xs">{t("Save")}</Text>
												<Flex direction="column" align="center" fz="xxs" c="white">
													alt+s
												</Flex>
											</Flex>
										</Button>
									)}
									{diagnosticReport?.process === "In-progress" && (
										<Button
											size="xs"
											fz={"xs"}
											bg="var(--theme-primary-color-6)"
											type="submit"
											id="handleSubmit"
										>
											<Flex direction="column" gap={0}>
												<Text fz="xs">{t("Confirm")}</Text>
												<Flex direction="column" align="center" fz="xxs" c="white">
													alt+s
												</Flex>
											</Flex>
										</Button>
									)}
								</Flex>
							</Grid.Col>
						</Grid>
					</Box>
				</Box>
			</form>
			<LabReportA4BN data={labReportData} ref={labReportRef} />
		</Stack>
	);
}
