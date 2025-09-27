import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import Navigation from "@components/layout/Navigation";
import { ActionIcon, Box, Button, Flex, Grid, SegmentedControl, Text } from "@mantine/core";
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
import GlobalDrawer from "@components/drawers/GlobalDrawer";
import PrescriptionPreview from "@hospital-components/PrescriptionPreview";
import { useDisclosure } from "@mantine/hooks";
import Room from "./common/tabs/Room";
import { IconPencil } from "@tabler/icons-react";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import useDataWithoutStore from "@hooks/useDataWithoutStore";

export default function Index() {
	const navigate = useNavigate();
	const [ipdMode, setIpdMode] = useState("non-prescription");
	const { t } = useTranslation();
	const { id } = useParams();
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();
	const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
	const [openedPrescriptionPreview, { open: openPrescriptionPreview, close: closePrescriptionPreview }] =
		useDisclosure(false);

	const showTabs = selectedPrescriptionId && id;
	const showPrescriptionForm = !selectedPrescriptionId && id;

	const handlePrescriptionEdit = () => {
		navigate(`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.PRESCRIPTION.UPDATE}/${selectedPrescriptionId}`);
	};




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
								<Flex align="center" justify="space-between" px="sm" py="xs" bg="white">
									<Text fw={600} fz="sm">
										{t("patientInformation")}
									</Text>
									<SegmentedControl
										size="sm"
										color="var(--theme-primary-color-6)"
										value={ipdMode}
										onChange={setIpdMode}
										data={[
											{ label: t("IPDPrescription"), value: "non-prescription" },
											{ label: t("IPDManage"), value: "prescription" },
										]}
									/>
								</Flex>
								<TabsWithSearch
									tabList={["list"]}
									tabPanels={[
										{
											tab: "list",
											component: (
												<Table
													ipdMode={ipdMode}
													selectedPrescriptionId={selectedPrescriptionId}
													setSelectedPrescriptionId={setSelectedPrescriptionId}
												/>
											),
										},
									]}
								/>
							</Grid.Col>
							<Grid.Col span={16} className="animate-ease-out">
								{showTabs ? (
									<TabsWithSearch
										tabList={[
											"History",
											"Investigation",
											"Medicine",
											"Room",
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
												tab: "Room",
												component: <Room />,
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
										leftSection={
											<Flex gap="les">
												<ActionIcon
													onClick={handlePrescriptionEdit}
													bg="var(--theme-primary-color-6)"
													h="100%"
													w="36px"
												>
													<IconPencil size={18} />
												</ActionIcon>
												<Button
													onClick={openPrescriptionPreview}
													miw={120}
													mr="les"
													bg="var(--theme-primary-color-6)"
													c="white"
													fw={400}
												>
													Prescription
												</Button>
											</Flex>
										}
									/>
								) : showPrescriptionForm ? (
									<AdmissionPrescription/>
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
			<GlobalDrawer
				opened={openedPrescriptionPreview}
				close={closePrescriptionPreview}
				title={t("PrescriptionPreview")}
				size="50%"
			>
				<Box my="sm">
					<PrescriptionPreview prescriptionId={selectedPrescriptionId} />
				</Box>
			</GlobalDrawer>
		</>
	);
}
