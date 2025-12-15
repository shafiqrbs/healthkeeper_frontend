import GlobalDrawer from "@components/drawers/GlobalDrawer";
import { Box, Grid, Stack, Text, List, Divider, Paper, Title, Group, ScrollArea, Flex, Button } from "@mantine/core";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PrescriptionFull from "@/common/components/print-formats/prescription/PrescriptionFull";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export default function RefrerredPrescriptionDetailsDrawer({ opened, close, prescriptionData }) {
	const prescriptionFullRef = useRef(null);
	const { mainAreaHeight } = useOutletContext();
	const { t } = useTranslation();

	const printPrescriptionFull = useReactToPrint({
		documentTitle: `prescription-${Date.now().toLocaleString()}`,
		content: () => prescriptionFullRef.current,
	});

	// =============== parse prescription data and handle null cases ================
	const prescription = prescriptionData?.data;
	const jsonContent = prescription?.referred_json_content ? JSON.parse(prescription.referred_json_content) : null;
	const patientReport = jsonContent?.patient_report;
	const basicInfo = patientReport?.basic_info;
	const patientExamination = patientReport?.patient_examination;
	const medicines = jsonContent?.medicines || [];
	const advice = jsonContent?.advise;
	const followUpDate = jsonContent?.follow_up_date;

	// =============== check if prescription data is available ================
	const isPrescriptionDataAvailable = prescription && jsonContent;

	return (
		<GlobalDrawer opened={opened} close={close} title="Prescription Details" size="45%">
			<Box pos="relative">
				{isPrescriptionDataAvailable ? (
					<ScrollArea scrollbars="y" type="hover" h={mainAreaHeight - 110}>
						<Grid columns={14} h="100%" w="100%" mt="xs">
							{/* =============== left column with patient info, OLE, complaints, investigation =============== */}
							<Grid.Col span={6} h="100%">
								<Paper withBorder p="lg" radius="sm" bg="var(--theme-tertiary-color-0)" h="100%">
									<Stack gap="md">
										<Box>
											<Title order={4} fw={700} mb="es">
												{prescription?.name || "N/A"}
											</Title>
											<Text mt="les" size="xs" c="var(--theme-tertiary-color-7)">
												Patient ID: {prescription?.patient_id || "N/A"}
											</Text>
											<Group gap="xs" mb="es">
												<Text size="xs" c="var(--theme-tertiary-color-7)">
													Age: {prescription?.day ? `${prescription.day} days` : "N/A"}
												</Text>
												<Text size="xs" c="var(--theme-tertiary-color-7)">
													| Gender:{" "}
													{prescription?.gender
														? prescription.gender.charAt(0).toUpperCase() +
														  prescription.gender.slice(1)
														: "N/A"}
												</Text>
											</Group>
											<Text size="xs" c="var(--theme-tertiary-color-7)">
												Date: {prescription?.appointment || prescription?.created || "N/A"}
											</Text>
										</Box>
										<Divider
											mt="xs"
											label={
												<Text size="xs" c="var(--theme-tertiary-color-7)">
													Vitals
												</Text>
											}
											labelPosition="left"
										/>
										<Stack gap="3xs" mb="es">
											<Text fw={500} size="sm">
												B/P:{" "}
												<Text span fw={400}>
													{basicInfo?.bp || "N/A"}
												</Text>
											</Text>
											<Text fw={500} size="sm">
												Blood Group:{" "}
												<Text span fw={400}>
													{basicInfo?.bloodGroup || "N/A"}
												</Text>
											</Text>
											<Text fw={500} size="sm">
												Weight:{" "}
												<Text span fw={400}>
													{basicInfo?.weight ? `${basicInfo.weight} kg` : "N/A"}
												</Text>
											</Text>
										</Stack>
										<Divider
											mt="xs"
											label={
												<Text size="xs" c="var(--theme-tertiary-color-7)">
													Chief Complaints
												</Text>
											}
											labelPosition="left"
										/>
										{patientExamination?.chief_complaints &&
										patientExamination.chief_complaints.length > 0 ? (
											<List size="sm" pl="sm" spacing="es">
												{patientExamination.chief_complaints.map((complaint, index) => (
													<List.Item key={index}>
														{complaint.name} {complaint.value ? `(${complaint.value})` : ""}
													</List.Item>
												))}
											</List>
										) : (
											<Text size="sm" c="var(--theme-tertiary-color-7)" fs="italic">
												No chief complaints recorded
											</Text>
										)}
										<Divider
											mt="xs"
											label={
												<Text size="xs" c="var(--theme-tertiary-color-7)">
													Investigation
												</Text>
											}
											labelPosition="left"
										/>
										{patientExamination?.investigation &&
										patientExamination.investigation.length > 0 ? (
											<List
												c="var(--theme-tertiary-color-9)"
												type="ordered"
												size="sm"
												pl="sm"
												spacing="es"
											>
												{patientExamination.investigation.map((investigation, index) => (
													<List.Item key={index}>
														{investigation.name}{" "}
														{investigation.value ? `(${investigation.value})` : ""}
													</List.Item>
												))}
											</List>
										) : (
											<Text size="sm" c="var(--theme-tertiary-color-7)" fs="italic">
												No investigations ordered
											</Text>
										)}
										<Divider
											mt="xs"
											label={
												<Text size="xs" c="var(--theme-tertiary-color-7)">
													Comorbidity
												</Text>
											}
											labelPosition="left"
										/>
										{patientExamination?.comorbidity &&
										patientExamination.comorbidity.length > 0 ? (
											<List size="sm" pl="sm" spacing="es">
												{patientExamination.comorbidity
													.filter((item) => item.value)
													.map((item, index) => (
														<List.Item key={index}>{item.name}</List.Item>
													))}
											</List>
										) : (
											<Text size="sm" c="var(--theme-tertiary-color-7)" fs="italic">
												No comorbidity recorded
											</Text>
										)}
										<Divider
											mt="xs"
											label={
												<Text size="xs" c="var(--theme-tertiary-color-7)">
													Past Illness
												</Text>
											}
											labelPosition="left"
										/>
										{patientExamination?.ho_past_illness &&
										patientExamination.ho_past_illness.length > 0 ? (
											<List size="sm" pl="sm" spacing="es">
												{patientExamination.ho_past_illness
													.filter((item) => item.value)
													.map((item, index) => (
														<List.Item key={index}>{item.name}</List.Item>
													))}
											</List>
										) : (
											<Text size="sm" c="var(--theme-tertiary-color-7)" fs="italic">
												No past illness recorded
											</Text>
										)}
									</Stack>
								</Paper>
							</Grid.Col>
							{/* =============== right column with medicine, advice, follow up =============== */}
							<Grid.Col span={8} h="100%">
								<Paper withBorder p="lg" radius="sm" h="100%" bg="var(--mantine-color-white)">
									<Stack gap="lg" h="100%">
										<Box>
											<Group align="center" mb="xs">
												<Title order={5} fw={600} c="var(--theme-tertiary-color-9)">
													List of Medicines
												</Title>
											</Group>
											{medicines.length > 0 ? (
												<List type="ordered" size="sm" pl="md" spacing="es">
													{medicines.map((medicine, index) => (
														<List.Item key={index}>
															{medicine.medicine_name ||
																medicine.generic ||
																"Unknown Medicine"}
															<Text size="xs" mt="es" c="var(--theme-tertiary-color-7)">
																{medicine.quantity &&
																	`${medicine.quantity} ${
																		medicine.duration || "days"
																	}`}
																{medicine.times && `, ${medicine.times} times`}
																{medicine.by_meal && `, ${medicine.by_meal}`}
																{medicine.dose_details &&
																	`, Dose: ${medicine.dose_details}`}
															</Text>
														</List.Item>
													))}
												</List>
											) : (
												<Text size="sm" c="var(--theme-tertiary-color-7)" fs="italic">
													No medicines prescribed
												</Text>
											)}
										</Box>
										<Divider
											mt="xs"
											label={
												<Text size="xs" c="var(--theme-tertiary-color-7)">
													Advise
												</Text>
											}
											labelPosition="left"
										/>
										<Box>
											<Text size="sm" c="var(--theme-tertiary-color-7)">
												{advice || "No advice provided"}
											</Text>
										</Box>
										<Divider
											mt="xs"
											label={
												<Text size="xs" c="var(--theme-tertiary-color-7)">
													Follow up & Discount
												</Text>
											}
											labelPosition="left"
										/>
										<Group gap="xl" align="flex-start">
											<Box>
												<Text fw={500} size="sm">
													Follow up
												</Text>
												<Text size="sm" c="var(--theme-tertiary-color-7)">
													{followUpDate
														? new Date(followUpDate).toLocaleDateString()
														: "Not scheduled"}
												</Text>
											</Box>
										</Group>
										<Box>
											<Text fw={500} size="sm">
												Doctor
											</Text>
											<Text size="sm" c="var(--theme-tertiary-color-7)">
												{prescription?.doctor_name || "N/A"}
											</Text>
										</Box>
									</Stack>
								</Paper>
							</Grid.Col>
						</Grid>
					</ScrollArea>
				) : (
					<Stack p="xl" ta="center" h={mainAreaHeight - 110} justify="center" gap={0} align="center">
						<Text size="lg" c="var(--theme-tertiary-color-7)" fw={500} mb="md">
							Prescription data not available for this patient
						</Text>
						<Text size="sm" c="var(--theme-tertiary-color-6)">
							Please check if the prescription is processed or prescription data is created.
						</Text>
					</Stack>
				)}
				{isPrescriptionDataAvailable && (
					<Flex justify="flex-end" mt="xs" gap="3xs">
						{/* <Button variant="filled" color="var(--theme-tertiary-color-6)">
							{t("Share")}
						</Button> */}
						<Button variant="filled" color="var(--theme-print-color)" onClick={printPrescriptionFull}>
							{t("Print")}
						</Button>
					</Flex>
				)}
			</Box>
			{prescriptionData?.data && <PrescriptionFull data={prescriptionData?.data} ref={prescriptionFullRef} />}
		</GlobalDrawer>
	);
}
