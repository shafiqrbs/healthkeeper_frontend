import GlobalDrawer from "@components/drawers/GlobalDrawer";
import { Box, Grid, Text, ScrollArea } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import RoomCard from "./RoomCard";

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

	const handleRoomClick = (room) => {
		selectRoom(room + 1);
	};

	return (
		<GlobalDrawer
			opened={opened}
			close={close}
			title="Doctor's Room"
			size="40%"
			bg="var(--theme-primary-color-0)"
			keepMounted
		>
			<Grid columns={12} gutter="xs">
				<Grid.Col span={6}>
					<Box bg="white" className="borderRadiusAll" mt="xs">
						<Text bg="var(--theme-primary-color-6" className="borderRadiusTop" c="white" p="sm" fz="sm">
							{t("selectRoom")}
						</Text>
						<ScrollArea h={height} scrollbars="y" p="xs">
							{[...Array(20)].map((_, index) => (
								<RoomCard
									key={index}
									room={index + 1}
									selectedRoom={selectedRoom}
									handleRoomClick={handleRoomClick}
								/>
							))}
						</ScrollArea>
					</Box>
				</Grid.Col>
				<Grid.Col span={6}>
					<Box bg="white" className="borderRadiusAll" mt="xs">
						<Text bg="var(--theme-secondary-color-9" className="borderRadiusTop" c="white" p="sm" fz="sm">
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
		</GlobalDrawer>
	);
}
