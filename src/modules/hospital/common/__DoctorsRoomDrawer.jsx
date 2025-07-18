import GlobalDrawer from "@components/drawers/GlobalDrawer";
import { Box, Flex, Grid, Text, ScrollArea } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconDoor, IconUsers } from "@tabler/icons-react";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import TabsWithSearch from "@components/advance-search/TabsWithSearch";
import PatientList from "../prescription/common/PatientList";

const doctorData = [
	{
		id: 1,
		name: "Dr. Shafiqul Islam",
		specialty: "Cardiologist",
	},
];

export default function DoctorsRoomDrawer({ form, opened, close }) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const [selectedRoom, setSelectedRoom] = useState(null);
	const [selectedDoctor, setSelectedDoctor] = useState({});
	const height = mainAreaHeight - 120;

	const selectDoctor = (doctor) => {
		setSelectedDoctor(doctor);
		form.setFieldValue("doctorId", doctor.id);
		form.setFieldValue("doctorName", doctor.name);
		form.setFieldValue("specialization", doctor.specialty);
	};

	const selectRoom = (room) => {
		setSelectedRoom(room);
		form.setFieldValue("roomNo", room);
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
							<Box bg="white" className="borderRadiusAll" mt="xs">
								<Text
									bg="var(--theme-primary-color-6"
									className="borderRadiusTop"
									c="white"
									p="sm"
									fz="sm"
								>
									{t("selectRoom")}
								</Text>
								<ScrollArea h={height} scrollbars="y" p="xs">
									{[...Array(20)].map((_, index) => (
										<Box
											key={index}
											p="xs"
											bg="var(--theme-tertiary-color-0)"
											mb="les"
											className={`borderRadiusAll cursor-pointer ${
												selectedRoom === index ? "active-box" : ""
											}`}
											onClick={() => selectRoom(index)}
										>
											<Flex justify="space-between" mb="xxxs">
												<Text fw={500} c="var(--theme-tertiary-color-6)" fz="sm">
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
												<Text fw={500} c="var(--theme-tertiary-color-6)" fz="sm">
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
							<Box bg="white" className="borderRadiusAll" mt="xs">
								<Text
									bg="var(--theme-secondary-color-9"
									className="borderRadiusTop"
									c="white"
									p="sm"
									fz="sm"
								>
									{t("selectDoctor")}
								</Text>
								<ScrollArea h={height} scrollbars="y" p="xs">
									{selectedRoom && (
										<>
											{[...Array(20)].map((_, index) => (
												<Box
													key={index}
													p="xs"
													bg="var(--theme-tertiary-color-0)"
													mb="les"
													className={`borderRadiusAll cursor-pointer ${
														selectedDoctor.id === index ? "active-box" : ""
													}`}
													onClick={() => {
														doctorData[0].id = index;
														selectDoctor(doctorData[0]);
													}}
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
					<Box className="borderRadiusAll" mt="xs">
						<TabsWithSearch
							tabList={["new", "report", "reVisit"]}
							tabPanels={[
								{
									tab: "new",
									component: <PatientList />,
								},
								{
									tab: "report",
									component: <PatientList />,
								},
								{
									tab: "reVisit",
									component: <PatientList />,
								},
							]}
						/>
					</Box>
				</Grid.Col>
			</Grid>
		</GlobalDrawer>
	);
}
