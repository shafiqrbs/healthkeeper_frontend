import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import Navigation from "@components/layout/Navigation";
import { Box, Flex, Grid, Text } from "@mantine/core";
import TabsWithSearch from "@components/advance-search/TabsWithSearch";
import Table from "./_Table";
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
import AdmissionPrescription from "./common/AdmissionPrescription";
import { useState } from "react";

export default function Index() {
	const { t } = useTranslation();
	const { id } = useParams();
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();
	const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);

	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
			) : (
				<Box p="md">
					<Flex w="100%" gap="sm">
						<Navigation module="home" mainAreaHeight={mainAreaHeight} />
						<Grid w="100%" columns={24}>
							<Grid.Col span={8} pos="relative" className="animate-ease-out">
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
											component: (
												<Table
													selectedPrescriptionId={selectedPrescriptionId}
													setSelectedPrescriptionId={setSelectedPrescriptionId}
												/>
											),
										},
									]}
								/>
							</Grid.Col>
							<Grid.Col span={16} className="animate-ease-out">
								{selectedPrescriptionId && id ? (
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
								) : !selectedPrescriptionId && id ? (
									<AdmissionPrescription selectedPrescriptionId={selectedPrescriptionId} />
								) : (
									<Flex
										justify="center"
										align="center"
										p="sm"
										pl={"md"}
										pr={"md"}
										bg="white"
										h={mainAreaHeight - 12}
									>
										<Text>No patient selected, please select a patient</Text>
									</Flex>
								)}
							</Grid.Col>
						</Grid>
					</Flex>
				</Box>
			)}
		</>
	);
}
