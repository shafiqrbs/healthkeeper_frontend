import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { getDataWithoutStore } from "@/services/apiService";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import LabReportA4BN from "@hospital-components/print-formats/lab-reports/LabReportA4BN";
import {Box, Button, Flex, Grid, Group, Stack, Text} from "@mantine/core";
import { IconPrinter } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useReactToPrint } from "react-to-print";
import { useParams } from "react-router";
import useAppLocalStore from "@hooks/useAppLocalStore";

export default function ReportSubmission({ form, handleSubmit, diagnosticReport }) {
	const labReportRef = useRef(null);
	const { t } = useTranslation();
	const [labReportData, setLabReportData] = useState(null);
	const { reportId } = useParams();
	const { userRoles } = useAppLocalStore();

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
	const ALLOWED_LAB_DOCTOR_ROLES = ["doctor_lab"];
	const ALLOWED_LAB_USER_ROLES = ["lab_assistant"];
	const isViewOnly = (diagnosticReport.process === "Done" || (
		diagnosticReport.process === "In-progress" && userRoles.some((role) =>
			ALLOWED_LAB_USER_ROLES.includes(role)
		)));


	return (
		<Stack gap={0} justify="space-between" mt="xs">
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Box px="md" bg="var(--theme-tertiary-color-2)">
					<Grid columns={12}>
						<Grid.Col span={8} className="animate-ease-out">
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
						<Grid.Col span={4}>
							<Box>
								<Group justify="center">
								{diagnosticReport?.process === "Done" && (

										<Button
											onClick={() => handleLabReport(reportId)}
											size="md"
											color="var(--theme-warn-color-5)"
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
								)}

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

								{/*{(diagnosticReport?.process === "In-progress" || diagnosticReport?.process === "Done") &&
								userRoles.some((role) =>
									ALLOWED_LAB_DOCTOR_ROLES.includes(role)
								) && (
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
								)}*/}
								</Group>
							</Box>
						</Grid.Col>
					</Grid>
				</Box>
			</form>
			<LabReportA4BN data={labReportData} ref={labReportRef} />
		</Stack>
	);
}
