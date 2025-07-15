import GlobalDrawer from "@components/drawers/GlobalDrawer";
import { Box, Flex, Grid, Tabs, Text, FloatingIndicator, TextInput, ScrollArea, Button, Center } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconBed, IconCalendarWeek, IconDoor, IconUser, IconUsers } from "@tabler/icons-react";
import { useState, useCallback } from "react";
import tabClass from "@assets/css/Tab.module.css";
import { useOutletContext } from "react-router-dom";

const data = [
	{ id: 1, date: "2025-01-01", patients: 234, name: "Shafiqul Islam", mobile: "+8801700099911" },
	{ id: 2, date: "2025-01-02", patients: 235, name: "Rafiqul Islam", mobile: "+8801700099911" },
	{ id: 3, date: "2025-01-03", patients: 236, name: "Safiqul Islam", mobile: "+8801700099911" },
	{ id: 4, date: "2025-01-04", patients: 237, name: "Latiful Islam", mobile: "+8801700099911" },
	{ id: 5, date: "2025-01-05", patients: 238, name: "Mehraz Islam", mobile: "+8801700099911" },
	{ id: 6, date: "2025-01-06", patients: 239, name: "Nazmul Islam", mobile: "+8801700099911" },
	{ id: 7, date: "2025-01-07", patients: 240, name: "Omar Islam", mobile: "+8801700099911" },
	{ id: 8, date: "2025-01-08", patients: 241, name: "Pavel Islam", mobile: "+8801700099911" },
];

const doctorData = [
	{
		id: 1,
		name: "Dr. Shafiqul Islam",
		specialty: "Cardiologist",
	},
];

export default function DoctorsRoomDrawer({ opened, close }) {
	const { t } = useTranslation();
	const [tabValue, setTabValue] = useState("new");
	const [rootRef, setRootRef] = useState(null);
	const [controlsRefs, setControlsRefs] = useState({});
	const { mainAreaHeight } = useOutletContext();
	const [selectedRoom, setSelectedRoom] = useState(null);
	const [selectedDoctor, setSelectedDoctor] = useState(null);

	const setControlRef = (val) => (node) => {
		controlsRefs[val] = node;
		setControlsRefs(controlsRefs);
	};

	const selectDoctor = (doctor) => {
		setSelectedDoctor(doctor);
	};

	const selectRoom = (room) => {
		setSelectedRoom(room);
	};

	return (
		<GlobalDrawer
			opened={opened}
			close={close}
			title="Doctor's Room"
			size="60%"
			bg="var(--theme-primary-color-0)"
			keepMounted
		>
			<Grid columns={12} gutter="xs">
				<Grid.Col span={6}>
					<Grid columns={12} gutter="xs">
						<Grid.Col span={6}>
							<Box bg="white" className="borderRadiusAll">
								<Text
									bg="var(--theme-primary-color-6"
									className="borderRadiusTop"
									c="white"
									p="sm"
									fz="sm"
								>
									{t("selectRoom")}
								</Text>
								<ScrollArea h={mainAreaHeight - 50} scrollbars="y" p="xs">
									{[...Array(20)].map((_, index) => (
										<Box
											key={index}
											p="xs"
											bg="var(--theme-secondary-color-0)"
											mb="les"
											className={`borderRadiusAll cursor-pointer ${
												selectedRoom === index ? "active-box" : ""
											}`}
											onClick={() => selectRoom(index)}
										>
											<Flex justify="space-between" mb="xxxs">
												<Text fw={500} c="var(--theme-secondary-color-6)" fz="sm">
													Patient
												</Text>
												<Flex align="center" gap="xxxs">
													<IconUsers
														color="var(--theme-primary-color-6)"
														size={16}
														stroke={1.5}
													/>
													<Text fz="sm">234</Text>
												</Flex>
											</Flex>
											<Flex justify="space-between">
												<Text fw={500} c="var(--theme-secondary-color-6)" fz="sm">
													Room
												</Text>
												<Flex align="center" gap="xxxs">
													<IconDoor
														color="var(--theme-primary-color-6)"
														size={16}
														stroke={1.5}
													/>
													<Text fz="sm">001</Text>
												</Flex>
											</Flex>
										</Box>
									))}
								</ScrollArea>
							</Box>
						</Grid.Col>
						<Grid.Col span={6}>
							<Box bg="white" className="borderRadiusAll">
								<Text
									bg="var(--theme-success-color-9"
									className="borderRadiusTop"
									c="white"
									p="sm"
									fz="sm"
								>
									{t("selectDoctor")}
								</Text>
								<ScrollArea h={mainAreaHeight - 50} scrollbars="y" p="xs">
									{selectedRoom && (
										<>
											{[...Array(20)].map((_, index) => (
												<Box
													key={index}
													p="xs"
													bg="var(--theme-secondary-color-0)"
													mb="les"
													className={`borderRadiusAll cursor-pointer ${
														selectedDoctor === index ? "active-box" : ""
													}`}
													onClick={() => selectDoctor(index)}
												>
													<Text fw={500} fz="sm">
														{doctorData[0].name}
													</Text>
													<Text fz="xs">{doctorData[0].specialty}</Text>
												</Box>
											))}
										</>
									)}
								</ScrollArea>
							</Box>
						</Grid.Col>
					</Grid>
				</Grid.Col>
				<Grid.Col span={6}>
					<Box className="borderRadiusAll">
						<Tabs variant="none" value={tabValue} onChange={setTabValue}>
							<Tabs.List px="sm" py="les" className={tabClass.list} ref={setRootRef}>
								<Flex w="100%" justify="space-between">
									<Tabs.Tab w="32%" value="new" ref={setControlRef("new")} className={tabClass.tab}>
										{t("new")}
									</Tabs.Tab>
									<Tabs.Tab
										w="32%"
										value="report"
										ref={setControlRef("report")}
										className={tabClass.tab}
									>
										{t("report")}
									</Tabs.Tab>
									<Tabs.Tab
										w="32%"
										value="re-visit"
										ref={setControlRef("re-visit")}
										className={tabClass.tab}
									>
										{t("reVisit")}
									</Tabs.Tab>
								</Flex>
								<FloatingIndicator
									target={tabValue ? controlsRefs[tabValue] : null}
									parent={rootRef}
									className={tabClass.indicator}
								/>
							</Tabs.List>

							<Tabs.Panel value="new">
								<Box p="sm" bg="white">
									<Box p="xs" bg="var(--theme-success-color-4)">
										<TextInput name="search" placeholder={t("search")} />
									</Box>
									<ScrollArea bg="white" h={mainAreaHeight - 146} scrollbars="y">
										{data.map((item) => (
											<Grid
												columns={12}
												key={item.id}
												my="xs"
												bg="var(--theme-secondary-color-0)"
												px="xs"
												gutter="xs"
											>
												<Grid.Col span={4}>
													<Flex align="center" gap="xxxs">
														<IconCalendarWeek size={16} stroke={1.5} />
														<Text fz="sm">{item.date}</Text>
													</Flex>
													<Flex align="center" gap="xxxs">
														<IconUser size={16} stroke={1.5} />
														<Text fz="sm">{item.patients}</Text>
													</Flex>
												</Grid.Col>
												<Grid.Col span={8}>
													<Flex justify="space-between" align="center">
														<Box>
															<Text fz="sm">{item.name}</Text>
															<Text fz="sm">{item.mobile}</Text>
														</Box>
														<Button
															bg="var(--theme-secondary-color-2)"
															c="var(--theme-secondary-color-8)"
															size="xs"
															bd="1px solid var(--theme-secondary-color-3)"
														>
															Done
														</Button>
													</Flex>
												</Grid.Col>
											</Grid>
										))}
									</ScrollArea>
								</Box>
							</Tabs.Panel>
						</Tabs>
					</Box>
				</Grid.Col>
			</Grid>
		</GlobalDrawer>
	);
}
