import { Avatar, Flex, Grid, Paper, Stack, Text } from "@mantine/core";

export default function PatientSearchResult({ results, handlePatientSelect }) {
	return (
		<Paper
			style={{
				zIndex: 1000,
				overflowY: "auto",
				border: "1px solid var(--mantine-color-gray-3)",
			}}
			shadow="md"
			radius="md"
			p="xs"
			mt="xs"
			pos="absolute"
			top="100%"
			left={0}
			right={0}
			mah="400px"
		>
			<Stack gap="xs">
				<Text fw={600} fz="sm" c="dimmed" px="xs">
					Select a patient:
				</Text>
				{results?.length === 0 ? (
					<Text fw={600} fz="sm" c="dimmed" px="xs">
						No patients found
					</Text>
				) : (
					<>
						{results?.map((patient) => (
							<Paper
								key={patient.id}
								p="sm"
								radius="sm"
								style={{
									cursor: "pointer",
									border: "1px solid var(--mantine-color-gray-2)",
									transition: "all 0.2s ease",
								}}
								onClick={() => handlePatientSelect(patient.id, patient)}
								onMouseEnter={(e) => {
									e.currentTarget.style.backgroundColor = "var(--mantine-color-gray-0)";
									e.currentTarget.style.borderColor = "var(--mantine-color-blue-3)";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = "transparent";
									e.currentTarget.style.borderColor = "var(--mantine-color-gray-2)";
								}}
							>
								<Grid columns={24} w="100%">
									<Grid.Col span={2}>
										<Flex align="center" justify="center" h="100%">
											<Avatar size="sm" color="blue">
												{patient.name.charAt(0)}
											</Avatar>
										</Flex>
									</Grid.Col>
									<Grid.Col span={13}>
										<Text fw={600} fz="sm">
											{patient.name || "N/A"}
										</Text>
										<Flex justify="space-between">
											<Text fz="xs" c="dimmed">
												{patient.mobile || "N/A"}
											</Text>
											<Text fw={500} fz="xs">
												NID: {patient.nid || "N/A"}
											</Text>
										</Flex>
									</Grid.Col>
									<Grid.Col span={9}>
										<Text fw={500} fz="xs" mt="4px">
											{patient.patient_id || "N/A"}
										</Text>
										<Text fw={500} fz="xs">
											{patient.health_id || "N/A"}
										</Text>
									</Grid.Col>
								</Grid>
							</Paper>
						))}
					</>
				)}
			</Stack>
		</Paper>
	);
}
