import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getPrescriptionFormInitialValues } from "./helpers/request";
import { useOutletContext } from "react-router-dom";
import { useForm } from "@mantine/form";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import Navigation from "@components/layout/Navigation";
import { Box, Flex, Grid, ScrollArea, Text } from "@mantine/core";
import ActionButtons from "../common/_ActionButtons";
import { Form as PatientForm } from "../common/__PatientForm";
import TabsWithSearch from "@components/advance-search/TabsWithSearch";
import PatientListWithActions from "../common/PatientListWithActions";
import RoomCard from "../common/RoomCard";
import PatientListAdmission from "../common/PatientListAdmission";

export default function Index() {
	const { t } = useTranslation();
	const form = useForm(getPrescriptionFormInitialValues(t));
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();
	const [patientData, setPatientData] = useState({});
	const [selectedRoom, setSelectedRoom] = useState(null);

	const handleRoomClick = (room) => {
		setSelectedRoom(room);
	};

	const handleSubmit = (values) => {
		console.log(values, patientData);
	};

	const openDoctorsRoom = () => {
		console.log("openDoctorsRoom");
	};

	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
			) : (
				<Box p="md">
					<Flex w="100%" gap="sm">
						<Navigation module="home" mainAreaHeight={mainAreaHeight} />
						<Grid w="100%" columns={25}>
							<Grid.Col span={4} pos="relative" className="animate-ease-out">
								<TabsWithSearch
									tabList={["Ward", "Cabin", "ICU"]}
									searchbarContainerBg="var(--theme-primary-color-1)"
									tabPanels={[
										{
											tab: "Ward",
											component: (
												<ScrollArea h={mainAreaHeight - 140} bg="white" p="xxxs">
													{Array.from({ length: 3 }).map((_, index) => (
														<RoomCard
															key={index}
															room={index + 1}
															selectedRoom={selectedRoom}
															handleRoomClick={handleRoomClick}
														/>
													))}
												</ScrollArea>
											),
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
							<Grid.Col span={7} pos="relative" className="animate-ease-out">
								<Box px="sm" py="md" bg="white">
									<Text fw={600} fz="sm">
										{t("patientInformation")}
									</Text>
								</Box>
								<TabsWithSearch
									tabList={["list"]}
									tabPanels={[
										{
											tab: "list",
											component: <PatientListAdmission />,
										},
									]}
								/>
							</Grid.Col>
							<Grid.Col span={14} className="animate-ease-out">
								<TabsWithSearch
									tabList={["Ward", "Cabin", "ICU"]}
									searchbarContainerBg="var(--theme-primary-color-1)"
									tabPanels={[
										{
											tab: "Ward",
											component: (
												<ScrollArea h={mainAreaHeight - 366} bg="white" p="xxxs">
													{Array.from({ length: 3 }).map((_, index) => (
														<RoomCard
															key={index}
															room={index + 1}
															selectedRoom={selectedRoom}
															handleRoomClick={handleRoomClick}
														/>
													))}
												</ScrollArea>
											),
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
						</Grid>
					</Flex>
				</Box>
			)}
		</>
	);
}
