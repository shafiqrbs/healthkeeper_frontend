import { useOutletContext } from "react-router-dom";

import GlobalDrawer from "@components/drawers/GlobalDrawer";
import { Box, Grid, ScrollArea, Text, TextInput } from "@mantine/core";
import TabsWithSearch from "@components/advance-search/TabsWithSearch";
import { useState } from "react";
import Ward from "../common/Ward";
import { IconSearch } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

const doctorData = [
	{
		id: 0,
		name: "Dr. Shafiqul Islam",
		specialty: "Cardiologist",
	},
	{
		id: 1,
		name: "Dr. Shafiqul Islam",
		specialty: "Cardiologist",
	},
	{
		id: 2,
		name: "Dr. Shafiqul Islam",
		specialty: "Cardiologist",
	},
	{
		id: 3,
		name: "Dr. Shafiqul Islam",
		specialty: "Cardiologist",
	},
	{
		id: 4,
		name: "Dr. Shafiqul Islam",
		specialty: "Cardiologist",
	},
	{
		id: 5,
		name: "Dr. Shafiqul Islam",
		specialty: "Cardiologist",
	},
	{
		id: 6,
		name: "Dr. Shafiqul Islam",
		specialty: "Cardiologist",
	},
	{
		id: 7,
		name: "Dr. Shafiqul Islam",
		specialty: "Cardiologist",
	},
	{
		id: 8,
		name: "Dr. Shafiqul Islam",
		specialty: "Cardiologist",
	},
	{
		id: 9,
		name: "Dr. Shafiqul Islam",
		specialty: "Cardiologist",
	},
	{
		id: 10,
		name: "Dr. Shafiqul Islam",
		specialty: "Cardiologist",
	},
	{
		id: 11,
		name: "Dr. Shafiqul Islam",
		specialty: "Cardiologist",
	},
	{
		id: 12,
		name: "Dr. Shafiqul Islam",
		specialty: "Cardiologist",
	},
	{
		id: 13,
		name: "Dr. Shafiqul Islam",
		specialty: "Cardiologist",
	},
	{
		id: 14,
		name: "Dr. Shafiqul Islam",
		specialty: "Cardiologist",
	},
	{
		id: 15,
		name: "Dr. Shafiqul Islam",
		specialty: "Cardiologist",
	},
	{
		id: 16,
		name: "Dr. Shafiqul Islam",
		specialty: "Cardiologist",
	},
];

export default function ConfirmModal({ opened, close }) {
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 80;
	const [selectedRoom, setSelectedRoom] = useState(null);
	const { t } = useTranslation();
	const [selectedDoctor, setSelectedDoctor] = useState({});

	const handleRoomClick = (room) => {
		setSelectedRoom(room);
	};

	const selectDoctor = (doctor) => {
		setSelectedDoctor(doctor);
	};

	return (
		<GlobalDrawer opened={opened} close={close} title="Confirm Admission" size="80%">
			<Box py="sm">
				<Grid columns={24}>
					<Grid.Col span={8}>
						<Box p="xs" bg="var(--theme-primary-color-0)" mb="sm">
							<TextInput
								leftSection={<IconSearch size={18} />}
								name="searchPatient"
								placeholder="Mr. Rafiqul Alam"
							/>
						</Box>
						<TabsWithSearch
							tabList={["Ward", "Cabin", "ICU"]}
							searchbarContainerBg="var(--theme-primary-color-1)"
							tabPanels={[
								{
									tab: "Ward",
									component: <Ward selectedRoom={selectedRoom} handleRoomClick={handleRoomClick} />,
								},
								{
									tab: "Cabin",
									component: <Text>Report</Text>,
								},
								{
									tab: "ICU",
									component: <Text>Report</Text>,
								},
							]}
						/>
					</Grid.Col>
					<Grid.Col span={8}>
						<Box bg="white" className="borderRadiusAll">
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
										{doctorData.map((doctor, index) => (
											<Box
												key={index}
												p="xs"
												bg="var(--theme-tertiary-color-0)"
												mb="les"
												className={`borderRadiusAll cursor-pointer ${
													selectedDoctor.id === doctor.id ? "active-box" : ""
												}`}
												onClick={() => {
													selectDoctor(doctor);
												}}
											>
												<Text fw={500} fz="sm">
													{doctor.name}
												</Text>
												<Text fz="xs">{doctor.specialty}</Text>
											</Box>
										))}
									</>
								)}
							</ScrollArea>
						</Box>
					</Grid.Col>
					<Grid.Col span={8}>
						<ScrollArea mt="sm" h={height}>
							hello
						</ScrollArea>
					</Grid.Col>
				</Grid>
			</Box>
		</GlobalDrawer>
	);
}
