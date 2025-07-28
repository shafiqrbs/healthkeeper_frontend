import { Box, Text, Grid, Divider, Table, Group, Stack, Flex, Image } from "@mantine/core";
import { forwardRef } from "react";
import TbImage from "@assets/images/tb_logo.png";

const Prescription = forwardRef((props, ref) => {
	return (
		<Box display="none">
			<Box ref={ref} p="md" bg="white" miw="210mm" mih="297mm" className="borderRadiusAll watermark">
				<Box mb="md">
					<Group justify="space-between" align="flex-start">
						<Flex align="center" gap="md">
							<Image src={TbImage} alt="TB Hospital" w={100} h={100} fit="contain" />
							<Box>
								<Text size="xl" fw={700} c="var(--theme-primary-color-6)">
									TB HOSPITAL
								</Text>
								<Text size="sm" c="var(--theme-tertiary-color-9)">
									Address Line 1
								</Text>
								<Text size="sm" c="var(--theme-tertiary-color-9)">
									Phone: +880 1234567890
								</Text>
								<Text size="sm" c="var(--theme-tertiary-color-9)">
									Email: info@hospital.com
								</Text>
							</Box>
						</Flex>
						<Box ta="right">
							<Text size="lg" fw={600} c="var(--theme-primary-color-6)">
								PRESCRIPTION
							</Text>
							<Text size="sm" c="var(--theme-tertiary-color-9)">
								Date: {new Date().toLocaleDateString()}
							</Text>
							<Text size="sm" c="var(--theme-tertiary-color-9)">
								Prescription #: PR-{Date.now().toString().slice(-6)}
							</Text>
						</Box>
					</Group>
				</Box>

				<hr style={{ marginBottom: "10px" }} />

				{/* Patient Information */}
				<Box mb="lg">
					<Text size="lg" fw={600} mb="sm" c="var(--theme-primary-color-6)">
						Patient Information
					</Text>
					<Grid>
						<Grid.Col span={6}>
							<Stack gap="xs">
								<Group>
									<Text size="sm" fw={500} miw={100}>
										Name:
									</Text>
									<Text size="sm">[Patient Name]</Text>
								</Group>
								<Group>
									<Text size="sm" fw={500} miw={100}>
										Age:
									</Text>
									<Text size="sm">[Age] years</Text>
								</Group>
								<Group>
									<Text size="sm" fw={500} miw={100}>
										Gender:
									</Text>
									<Text size="sm">[Male/Female]</Text>
								</Group>
								<Group>
									<Text size="sm" fw={500} miw={100}>
										Blood Group:
									</Text>
									<Text size="sm">[Blood Group]</Text>
								</Group>
							</Stack>
						</Grid.Col>
						<Grid.Col span={6}>
							<Stack gap="xs">
								<Group>
									<Text size="sm" fw={500} miw={100}>
										Patient ID:
									</Text>
									<Text size="sm">[Patient ID]</Text>
								</Group>
								<Group>
									<Text size="sm" fw={500} miw={100}>
										Contact:
									</Text>
									<Text size="sm">[Phone Number]</Text>
								</Group>
								<Group>
									<Text size="sm" fw={500} miw={100}>
										Address:
									</Text>
									<Text size="sm">[Address]</Text>
								</Group>
								<Group>
									<Text size="sm" fw={500} miw={100}>
										Emergency:
									</Text>
									<Text size="sm">[Emergency Contact]</Text>
								</Group>
							</Stack>
						</Grid.Col>
					</Grid>
				</Box>

				{/* Doctor Information */}
				<Box mb="lg">
					<Text size="lg" fw={600} mb="sm" c="var(--theme-primary-color-6)">
						Doctor Information
					</Text>
					<Grid>
						<Grid.Col span={6}>
							<Stack gap="xs">
								<Group>
									<Text size="sm" fw={500} miw={100}>
										Doctor Name:
									</Text>
									<Text size="sm">[Doctor Name]</Text>
								</Group>
								<Group>
									<Text size="sm" fw={500} miw={100}>
										Specialization:
									</Text>
									<Text size="sm">[Specialization]</Text>
								</Group>
							</Stack>
						</Grid.Col>
						<Grid.Col span={6}>
							<Stack gap="xs">
								<Group>
									<Text size="sm" fw={500} miw={100}>
										License No:
									</Text>
									<Text size="sm">[License Number]</Text>
								</Group>
								<Group>
									<Text size="sm" fw={500} miw={100}>
										Contact:
									</Text>
									<Text size="sm">[Doctor Contact]</Text>
								</Group>
							</Stack>
						</Grid.Col>
					</Grid>
				</Box>

				{/* Diagnosis */}
				<Box mb="lg">
					<Text size="lg" fw={600} mb="sm" c="var(--theme-primary-color-6)">
						Diagnosis
					</Text>
					<Box p="sm" mih={60} bd="1px solid var(--theme-tertiary-color-4)" style={{ borderRadius: "4px" }}>
						<Text size="sm">[Primary Diagnosis]</Text>
						<Text size="sm" c="var(--theme-tertiary-color-9)">
							[Secondary Diagnosis if any]
						</Text>
					</Box>
				</Box>

				{/* Prescription Table */}
				<Box mb="sm">
					<Text size="lg" fw={600} c="var(--theme-primary-color-6)">
						Medications
					</Text>
					<Table withTableBorder withColumnBorders>
						<Table.Thead>
							<Table.Tr>
								<Table.Th w="5%">Sl.</Table.Th>
								<Table.Th w="25%">Medicine Name</Table.Th>
								<Table.Th w="10%">Dosage</Table.Th>
								<Table.Th w="15%">Frequency</Table.Th>
								<Table.Th w="10%">Duration</Table.Th>
								<Table.Th w="15%">Timing</Table.Th>
								<Table.Th w="20%">Instructions</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							<Table.Tr>
								<Table.Td>1</Table.Td>
								<Table.Td>[Medicine Name]</Table.Td>
								<Table.Td>[Dosage]</Table.Td>
								<Table.Td>[Frequency]</Table.Td>
								<Table.Td>[Duration]</Table.Td>
								<Table.Td>[Timing]</Table.Td>
								<Table.Td>[Instructions]</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td>2</Table.Td>
								<Table.Td>[Medicine Name]</Table.Td>
								<Table.Td>[Dosage]</Table.Td>
								<Table.Td>[Frequency]</Table.Td>
								<Table.Td>[Duration]</Table.Td>
								<Table.Td>[Timing]</Table.Td>
								<Table.Td>[Instructions]</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>
				</Box>

				{/* Instructions */}
				<Box mb="lg">
					<Text size="lg" fw={600} mb="sm" c="var(--theme-primary-color-6)">
						Instructions
					</Text>
					<Box p="sm" mih={80} bd="1px solid var(--theme-tertiary-color-4)" style={{ borderRadius: "4px" }}>
						<Text size="sm">• [General instructions for patient]</Text>
						<Text size="sm">• [Dietary restrictions if any]</Text>
						<Text size="sm">• [Lifestyle modifications]</Text>
					</Box>
				</Box>

				{/* Tests */}
				<Box mb="lg">
					<Text size="lg" fw={600} mb="sm" c="var(--theme-primary-color-6)">
						Recommended Tests
					</Text>
					<Box p="sm" mih={60} bd="1px solid var(--theme-tertiary-color-4)" style={{ borderRadius: "4px" }}>
						<Text size="sm">[List of recommended tests]</Text>
					</Box>
				</Box>

				{/* Footer */}
				<Box mt="xl">
					<Divider mb="lg" />
					<Group justify="space-between">
						<Box>
							<Text size="sm" fw={500}>
								Next Visit:
							</Text>
							<Text size="sm">[Date]</Text>
						</Box>
						<Box ta="center">
							<Text size="sm" fw={500} mb="xs">
								Doctor&apos;s Signature
							</Text>
							<Box bd="1px solid var(--theme-tertiary-color-4)" w={150} h={40} />
							<Text size="xs" c="var(--theme-tertiary-color-9)">
								[Doctor Name]
							</Text>
						</Box>
						<Box ta="center">
							<Text size="sm" fw={500} mb="xs">
								Hospital Stamp
							</Text>
							<Flex
								bd="1px solid var(--theme-tertiary-color-4)"
								w={80}
								h={80}
								align="center"
								justify="center"
							>
								<Text size="xs" c="var(--theme-tertiary-color-9)">
									STAMP
								</Text>
							</Flex>
						</Box>
					</Group>
				</Box>

				{/* Additional Notes */}
				{/* <Box mt="lg" p="sm" style={{ backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
					<Text size="sm" fw={500} mb="xs">
						Important Notes:
					</Text>
					<Text size="xs" c="var(--theme-tertiary-color-9)">
						• This prescription is valid for 30 days from the date of issue
					</Text>
					<Text size="xs" c="var(--theme-tertiary-color-9)">
						• Please bring this prescription for your next visit
					</Text>
				</Box> */}
			</Box>
		</Box>
	);
});

Prescription.displayName = "Prescription";

export default Prescription;
