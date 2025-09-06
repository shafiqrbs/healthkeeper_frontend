import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getPrescriptionFormInitialValues } from "./helpers/request";
import { useOutletContext, useParams } from "react-router-dom";
import { useForm } from "@mantine/form";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import Navigation from "@components/layout/Navigation";
import { Box, Flex, Grid, ScrollArea, Text } from "@mantine/core";
import TabsWithSearch from "@components/advance-search/TabsWithSearch";
import RoomCard from "../common/RoomCard";
import PatientListAdmission from "../common/PatientListAdmission";
import History from "./common/tabs/History";
import Investigation from "./common/tabs/Investigation";
import Medicine from "./common/tabs/Medicine";
import Advice from "./common/tabs/Advice";
import Instruction from "./common/tabs/Instruction";
import OT from "./common/tabs/OT";
import Charge from "./common/tabs/Charge";
import Billing from "./common/tabs/Billing";
import FinalBill from "./common/tabs/FinalBill";
import Discharge from "./common/tabs/Discharge";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { getDataWithoutStore } from "@/services/apiService";

export default function Index() {
	const { id } = useParams();
	const { t } = useTranslation();
	const form = useForm(getPrescriptionFormInitialValues(t));
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();
	const [patientData, setPatientData] = useState({});
	const [selectedRoom, setSelectedRoom] = useState(null);
	const [ipdData, setIpdData] = useState({});

	const handleRoomClick = (room) => {
		setSelectedRoom(room);
	};

	const handleSubmit = (values) => {
		console.log(values, patientData);
	};

	const openDoctorsRoom = () => {
		console.log("openDoctorsRoom");
	};

	const fetchData = async () => {
		const result = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.INDEX}/${id}`,
		});

		setIpdData(result);
	};

	console.log(ipdData);

	useEffect(() => {
		fetchData();
	}, [id]);

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
											component: <Text>Cabins</Text>,
										},
										{
											tab: "ICU",
											component: <Text>ICUs</Text>,
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
									tabList={[
										"History",
										"Investigation",
										"Medicine",
										"Advice",
										"Instruction",
										"OT",
										"Charge",
										"Billing",
										"Final Bill",
										"Discharge",
									]}
									hideSearchbar
									tabPanels={[
										{
											tab: "History",
											component: <History />,
										},
										{
											tab: "Investigation",
											component: <Investigation />,
										},
										{
											tab: "Medicine",
											component: <Medicine />,
										},
										{
											tab: "Advice",
											component: <Advice />,
										},

										{
											tab: "Instruction",
											component: <Instruction />,
										},
										{
											tab: "OT",
											component: <OT />,
										},
										{
											tab: "Charge",
											component: <Charge />,
										},
										{
											tab: "Billing",
											component: <Billing />,
										},
										{
											tab: "Final Bill",
											component: <FinalBill />,
										},
										{
											tab: "Discharge",
											component: <Discharge />,
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
