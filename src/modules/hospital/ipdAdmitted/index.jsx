import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useOutletContext, useParams, useSearchParams } from "react-router-dom";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import Navigation from "@components/layout/Navigation";
import { ActionIcon, Box, Flex, Text } from "@mantine/core";
import TabsWithSearch from "@components/advance-search/TabsWithSearch";
import Table from "./_Table";
import Investigation from "./common/tabs/Investigation";
import Medicine from "./common/tabs/Medicine";
import Advice from "./common/tabs/Advice";
import Charge from "./common/tabs/Charge";
import Billing from "./common/tabs/Billing";
import FinalBill from "./common/tabs/FinalBill";
import Discharge from "./common/tabs/Discharge";
import AdmissionPrescription from "./common/AdmissionPrescription";
import GlobalDrawer from "@components/drawers/GlobalDrawer";
import PrescriptionPreview from "@hospital-components/PrescriptionPreview";
import { useDisclosure } from "@mantine/hooks";
import Room from "./common/tabs/Room";
import { IconPencil, IconPrescription } from "@tabler/icons-react";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";

export default function Index() {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const queryValue = searchParams.get("redirect");
	const [ipdMode, setIpdMode] = useState("prescription");
	const { t } = useTranslation();
	const { id } = useParams();
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();
	const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
	const [openedPrescriptionPreview, { open: openPrescriptionPreview, close: closePrescriptionPreview }] =
		useDisclosure(false);

	const { state } = useLocation();

	const showTabs = searchParams.get("tabs") === "true";
	const showPrescriptionForm = !selectedPrescriptionId && id;

	const handlePrescriptionEdit = () => {
		navigate(
			`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.IPD_ADMITTED.IPD_PRESCRIPTION}/${state?.prescriptionId}?redirect=prescription&ipd=${id}`
		);
	};

	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
			) : (
				<Box p="md">
					<Flex w="100%" gap="xs">
						<Navigation module="home" mainAreaHeight={mainAreaHeight} />

						{id ? (
							<Box w="100%">
								{showTabs ? (
									<TabsWithSearch
										tabList={[
											"Investigation",
											"Medicine",
											// "Room",
											// "Advice",
											// "Instruction",
											// "OT",
											"Charge",
											"Billing",
											"Final Bill",
											"Discharge",
										]}
										hideSearchbar
										tabPanels={[
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

											// {
											// 	tab: "Instruction",
											// 	component: <Instruction />,
											// },
											// {
											// 	tab: "OT",
											// 	component: <OT />,
											// },
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
										rightSection={
											<Flex gap="les">
												<ActionIcon
													onClick={handlePrescriptionEdit}
													bg="var(--theme-secondary-color-6)"
													h="100%"
													w="36px"
												>
													<IconPencil size={18} />
												</ActionIcon>
												<ActionIcon
													onClick={openPrescriptionPreview}
													bg="var(--theme-primary-color-6)"
													h="100%"
													w="36px"
												>
													<IconPrescription size={18} />
												</ActionIcon>
											</Flex>
										}
									/>
								) : showPrescriptionForm ? (
									<AdmissionPrescription />
								) : (
									<Flex
										justify="center"
										align="center"
										p="sm"
										px="md"
										bg="white"
										h={mainAreaHeight - 12}
									>
										<Text>No patient selected, please select a patient</Text>
									</Flex>
								)}
							</Box>
						) : (
							<Box w="100%">
								<Table
									ipdMode={ipdMode}
									setIpdMode={setIpdMode}
									selectedPrescriptionId={selectedPrescriptionId}
									setSelectedPrescriptionId={setSelectedPrescriptionId}
								/>
							</Box>
						)}
					</Flex>
				</Box>
			)}
			{id && (
				<GlobalDrawer
					opened={openedPrescriptionPreview}
					close={closePrescriptionPreview}
					title={t("PrescriptionPreview")}
					size="50%"
				>
					<Box my="sm">
						<PrescriptionPreview prescriptionId={id} />
					</Box>
				</GlobalDrawer>
			)}
		</>
	);
}
