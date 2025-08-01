import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getPrescriptionFormInitialValues } from "./helpers/request";
import { useOutletContext } from "react-router-dom";
import { useForm } from "@mantine/form";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import Navigation from "@components/layout/Navigation";
import { Box, Flex, Grid, ScrollArea, Text } from "@mantine/core";
import PatientReport from "../common/PatientReport";
import ActionButtons from "../common/_ActionButtons";
import { Form as PatientForm } from "../common/__PatientFormSingleGrid";
import TabsWithSearch from "@components/advance-search/TabsWithSearch";
import PatientListWithActions from "../common/PatientListWithActions";
import RoomCard from "../common/RoomCard";
import PatientListAdmission from "../common/PatientListAdmission";

export default function Index() {
	const { t } = useTranslation();
	const form = useForm(getPrescriptionFormInitialValues(t));
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();
	const [isOpenPatientInfo, setIsOpenPatientInfo] = useState(true);
	const [patientData, setPatientData] = useState({});
	const [selectedRoom, setSelectedRoom] = useState(null);

	const handleRoomClick = (room) => {
		setSelectedRoom(room);
	};

	const handleSubmit = (values) => {
		console.log(values);
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
							<Grid.Col span={isOpenPatientInfo ? 8 : 2} pos="relative" className="animate-ease-out">
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
							<Grid.Col span={isOpenPatientInfo ? 17 : 23} className="animate-ease-out">
								<Grid columns={25} gutter="les">
									<Grid.Col span={7}>
										<TabsWithSearch
											tabList={["Ward", "Cabin", "ICU"]}
											expand={isOpenPatientInfo}
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
									<Grid.Col span={9}>
										<PatientForm
											form={form}
											handleSubmit={handleSubmit}
											openDoctorsRoom={openDoctorsRoom}
											showTitle={true}
											heightOffset={288}
										/>
									</Grid.Col>
									<Grid.Col span={9}>
										<PatientForm
											form={form}
											handleSubmit={handleSubmit}
											openDoctorsRoom={openDoctorsRoom}
											showTitle={true}
											heightOffset={288}
										/>
									</Grid.Col>
									<Grid.Col span={25}>
										<ActionButtons form={form} />
									</Grid.Col>
								</Grid>
							</Grid.Col>
						</Grid>
					</Flex>
				</Box>
			)}
		</>
	);
}
