import GlobalDrawer from "@components/drawers/GlobalDrawer";
import { Box, Grid, Stack, Text, List, Divider, Paper, Title, Group, ScrollArea, Flex, Button } from "@mantine/core";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function DetailsDrawer({ opened, close }) {
	const { mainAreaHeight } = useOutletContext();
	const { t } = useTranslation();

	return (
		<GlobalDrawer opened={opened} close={close} title="Visit Details" size="45%">
			<ScrollArea scrollbars="y" type="hover" h={mainAreaHeight - 110}>
				<Grid columns={14} h="100%" w="100%" mt="xs">
					{/* =============== left column with patient info, OLE, complaints, investigation =============== */}
					<Grid.Col span={6} h="100%">
						<Paper withBorder p="lg" radius="sm" bg="var(--theme-tertiary-color-0)" h="100%">
							<Stack gap="md">
								<Box>
									<Title order={4} fw={700} mb="es">
										Md. Shafiqul Islam
									</Title>
									<Text mt="les" size="xs" c="var(--theme-tertiary-color-7)">
										Patient ID: 000020
									</Text>
									<Group gap="xs" mb="es">
										<Text size="xs" c="var(--theme-tertiary-color-7)">
											Age: 25
										</Text>
										<Text size="xs" c="var(--theme-tertiary-color-7)">
											| Gender: Male
										</Text>
									</Group>
									<Text size="xs" c="var(--theme-tertiary-color-7)">
										Date: 30-06-25
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
											120/80
										</Text>
									</Text>
									<Text fw={500} size="sm">
										Blood Group:{" "}
										<Text span fw={400}>
											O+
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
								<List size="sm" pl="sm" spacing="es">
									<List.Item>Fever (For 2 days)</List.Item>
									<List.Item>Runny Nose</List.Item>
									<List.Item>Headache</List.Item>
									<List.Item>Bodyache</List.Item>
								</List>
								<Divider
									mt="xs"
									label={
										<Text size="xs" c="var(--theme-tertiary-color-7)">
											Investigation
										</Text>
									}
									labelPosition="left"
								/>
								<List c="var(--theme-tertiary-color-9)" type="ordered" size="sm" pl="sm" spacing="es">
									<List.Item>Chest X-Ray P/A</List.Item>
									<List.Item>Face X-Ray P/A</List.Item>
									<List.Item>Leg X-Ray P/A</List.Item>
									<List.Item>Hand X-Ray P/A</List.Item>
								</List>
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
									<List type="ordered" size="sm" pl="md" spacing="es">
										<List.Item>
											Napa
											<Text size="xs" mt="es" c="var(--theme-tertiary-color-7)">
												1 Tab, 3 times, 30 min B, 5 Year
											</Text>
										</List.Item>
										<List.Item>
											Paracetamol
											<Text size="xs" mt="es" c="var(--theme-tertiary-color-7)">
												1 Tab, 3 times, 30 min B, 5 Year
											</Text>
										</List.Item>
									</List>
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
										-
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
											28-06-2025
										</Text>
									</Box>
								</Group>
								<Box>
									<Text fw={500} size="sm">
										Special Discount
									</Text>
									<Text size="sm" c="var(--theme-tertiary-color-7)">
										Visit 20% &nbsp; Test 10%
									</Text>
								</Box>
							</Stack>
						</Paper>
					</Grid.Col>
				</Grid>
			</ScrollArea>
			<Flex justify="flex-end" mt="xs" gap="3xs">
				<Button variant="filled" color="var(--theme-tertiary-color-6)">
					{t("Share")}
				</Button>
				<Button variant="filled" color="var(--theme-print-color)">
					{t("Print")}
				</Button>
			</Flex>
		</GlobalDrawer>
	);
}
