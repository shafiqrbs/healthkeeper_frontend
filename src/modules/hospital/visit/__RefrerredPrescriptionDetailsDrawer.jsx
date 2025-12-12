import GlobalDrawer from "@components/drawers/GlobalDrawer";
import { Box, Grid, Stack, Text, List, Divider, Paper, Title, Group, ScrollArea, Flex, Button } from "@mantine/core";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PrescriptionFullBN from "@hospital-components/print-formats/prescription/PrescriptionFullBN";
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

	// =============== ordering helpers (follow jsonContent.patient_report.order) ================
	const normalizeOrder = (inputOrder) => {
		if (Array.isArray(inputOrder)) {
			const entries = inputOrder.flatMap((obj) => Object.entries(obj));
			return entries.sort((a, b) => a[1] - b[1]).map(([key]) => key);
		}
		if (inputOrder && typeof inputOrder === "object") {
			return Object.keys(inputOrder).sort((a, b) => (inputOrder?.[a] ?? 0) - (inputOrder?.[b] ?? 0));
		}
		return [];
	};

	const orderedExamKeys = normalizeOrder(patientReport?.order);
	const sectionKeys = ["chief_complaints", "investigation", "comorbidity", "ho_past_illness"];
	const keysToRender = orderedExamKeys.length ? orderedExamKeys.filter((k) => sectionKeys.includes(k)) : sectionKeys;
	const renderSection = (key) => {
		switch (key) {
			case "chief_complaints":
				return (
					<>
						<Divider
							mt="xs"
							label={
								<Text size="xs" c={"var(--theme-tertiary-color-7)"}>
									Chief Complaints
								</Text>
							}
							labelPosition="left"
						/>
						{patientExamination?.chief_complaints && patientExamination.chief_complaints.length > 0 && (
							<List size="sm" pl="sm" spacing="es">
								{patientExamination.chief_complaints.map((complaint, index) => (
									<List.Item key={index}>
										{complaint.name} {complaint.value ? `(${complaint.value})` : ""}
									</List.Item>
								))}
							</List>
						)}
					</>
				);
			case "investigation":
				return (
					<>
						<Divider
							mt="xs"
							label={
								<Text size="xs" c={"var(--theme-tertiary-color-7)"}>
									Investigation
								</Text>
							}
							labelPosition="left"
						/>
						{patientExamination?.investigation && patientExamination.investigation.length > 0 && (
							<List c={"var(--theme-tertiary-color-9)"} type="ordered" size="sm" pl="sm" spacing="es">
								{patientExamination.investigation.map((investigation, index) => (
									<List.Item key={index}>
										{investigation.name} {investigation.value ? `(${investigation.value})` : ""}
									</List.Item>
								))}
							</List>
						)}
					</>
				);
			case "comorbidity":
				return (
					<>
						<Divider
							mt="xs"
							label={
								<Text size="xs" c={"var(--theme-tertiary-color-7)"}>
									Comorbidity
								</Text>
							}
							labelPosition="left"
						/>
						{patientExamination?.comorbidity && patientExamination.comorbidity.length > 0 && (
							<List size="sm" pl="sm" spacing="es">
								{patientExamination.comorbidity
									.filter((item) => item.value)
									.map((item, index) => (
										<List.Item key={index}>{item.name}</List.Item>
									))}
							</List>
						)}
					</>
				);
			case "ho_past_illness":
				return (
					<>
						<Divider
							mt="xs"
							label={
								<Text size="xs" c={"var(--theme-tertiary-color-7)"}>
									Past Illness
								</Text>
							}
							labelPosition="left"
						/>
						{patientExamination?.ho_past_illness && patientExamination.ho_past_illness.length > 0 && (
							<List size="sm" pl="sm" spacing="es">
								{patientExamination.ho_past_illness
									.filter((item) => item.value)
									.map((item, index) => (
										<List.Item key={index}>{item.name}</List.Item>
									))}
							</List>
						)}
					</>
				);
			default:
				return null;
		}
	};

	// =============== check if prescription data is available ================
	const isPrescriptionDataAvailable = prescription && jsonContent;
	return (
		<GlobalDrawer opened={opened} close={close} title="Prescription Details" size="60%">
			<Box pos="relative">
				{isPrescriptionDataAvailable ? (
					<Grid columns={16} h="100%" w="100%" mt="xs">
						{/* =============== left column with patient info, OLE, complaints, investigation =============== */}
						<Grid.Col span={6} h="100%">
							<Paper withBorder p="lg" radius="sm" bg="var(--theme-tertiary-color-0)" h="100%">
								<ScrollArea scrollbars="y" type="hover" h={mainAreaHeight - 180}>
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

									{patientExamination?.chief_complaints &&
										patientExamination.chief_complaints.length > 0 && (
											<>
												<Divider
													mt="xs"
													label={
														<Text size="xs" c="var(--theme-tertiary-color-7)">
															Chief Complaints
														</Text>
													}
													labelPosition="left"
												/>
												<List size="sm" pl="sm" spacing="es">
													{patientExamination.chief_complaints.map((complaint, index) => (
														<List.Item key={index}>
															{complaint.name}{" "}
															{complaint.value ? `(${complaint.value})` : ""}
														</List.Item>
													))}
												</List>
											</>
										)}

									{patientExamination?.investigation &&
										patientExamination.investigation.length > 0 && (
											<>
												<Divider
													mt="xs"
													label={
														<Text size="xs" c="var(--theme-tertiary-color-7)">
															Investigation
														</Text>
													}
													labelPosition="left"
												/>
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
											</>
										)}

									{patientExamination?.comorbidity && patientExamination.comorbidity.length > 0 && (
										<>
											<Divider
												mt="xs"
												label={
													<Text size="xs" c="var(--theme-tertiary-color-7)">
														Comorbidity
													</Text>
												}
												labelPosition="left"
											/>
											<List size="sm" pl="sm" spacing="es">
												{patientExamination.comorbidity
													.filter((item) => item.value)
													.map((item, index) => (
														<List.Item key={index}>{item.name}</List.Item>
													))}
											</List>
										</>
									)}

									{patientExamination?.ho_past_illness &&
										patientExamination.ho_past_illness.length > 0 && (
											<>
												<Divider
													mt="xs"
													label={
														<Text size="xs" c="var(--theme-tertiary-color-7)">
															Past Illness
														</Text>
													}
													labelPosition="left"
												/>
												<List size="sm" pl="sm" spacing="es">
													{patientExamination.ho_past_illness
														.filter((item) => item.value)
														.map((item, index) => (
															<List.Item key={index}>{item.name}</List.Item>
														))}
												</List>
											</>
										)}
								</ScrollArea>
							</Paper>
						</Grid.Col>
						{/* =============== right column with medicine, advice, follow up =============== */}
						<Grid.Col span={10} h="100%">
							<Paper withBorder p="lg" radius="sm" h="100%" bg="var(--mantine-color-white)">
								<ScrollArea scrollbars="y" type="hover" h={mainAreaHeight - 180}>
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
															{medicine.dose_details && `${medicine.dose_details}`}

															{medicine.by_meal && `, ------${medicine.by_meal}`}
															{medicine.quantity &&
																`----------- ${medicine.quantity} ${
																	medicine.duration || "days"
																}`}
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
										<Text size="sm" pl={"md"} pt={"xs"} c="var(--theme-tertiary-color-7)">
											{advice || "No advice provided"}
										</Text>
									</Box>
									<Divider
										label={
											<Text size="xs" pb={"xs"} pt={"xs"} c="var(--theme-tertiary-color-7)">
												Referred Information
											</Text>
										}
										labelPosition="left"
									/>
									{prescription?.referred_room && (
										<Box>
											<Text size="sm" pl={"md"} c="var(--theme-tertiary-color-7)">
												Room: {prescription?.referred_room}
											</Text>
										</Box>
									)}
									{prescription?.referred_hospital && (
										<Box>
											<Text size="sm" pl={"md"} c="var(--theme-tertiary-color-7)">
												Refer To: {prescription?.referred_hospital}
											</Text>
										</Box>
									)}
									<Box>
										<Text size="sm" pl={"md"} c="var(--theme-tertiary-color-7)">
											{prescription?.referred_comment}
										</Text>
									</Box>
									<Divider
										label={
											<Text size="xs" pb={"xs"} pt={"xs"} c="var(--theme-tertiary-color-7)">
												Follow up
											</Text>
										}
										labelPosition="left"
									/>
									<Group gap="xs" align="flex-justify">
										<Grid columns={12} w="100%">
											<Grid.Col span={6} h="100%">
												<Box>
													<Text pl={"md"} fw={500} size="sm">
														Follow up
													</Text>
													<Text size="sm" pl={"md"} c="var(--theme-tertiary-color-7)">
														{followUpDate
															? new Date(followUpDate).toLocaleDateString()
															: "Not scheduled"}
													</Text>
												</Box>
											</Grid.Col>
											<Grid.Col span={6} h="100%">
												<Box>
													<Text fw={500} size="sm">
														Doctor
													</Text>
													<Text size="sm" c="var(--theme-tertiary-color-7)">
														{prescription?.doctor_name || "N/A"}
													</Text>
												</Box>
											</Grid.Col>
										</Grid>
									</Group>
								</ScrollArea>
							</Paper>
						</Grid.Col>
					</Grid>
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
						<Button variant="filled" color="var(--theme-tertiary-color-6)" onClick={close}>
							{t("Share")}
						</Button>
						<Button variant="filled" color="var(--theme-print-color)" onClick={printPrescriptionFull}>
							{t("Print")}
						</Button>
					</Flex>
				)}
			</Box>
			{prescriptionData?.data && <PrescriptionFullBN data={prescriptionData?.data} ref={prescriptionFullRef} />}
		</GlobalDrawer>
	);
}
