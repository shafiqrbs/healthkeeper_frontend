import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useOutletContext, useParams, useSearchParams } from "react-router-dom";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import Navigation from "@components/layout/Navigation";
import { ActionIcon, Box, Flex, Grid, SegmentedControl, Text } from "@mantine/core";
import TabsWithSearch from "@components/advance-search/TabsWithSearch";
import Table from "./_Table";
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
import { IconPencil, IconPrescription } from "@tabler/icons-react";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { MODULES } from "@/constants";

const module = MODULES.ADMISSION;

export default function Index() {
	const [searchParams, setSearchParams] = useSearchParams();
	const queryValue = searchParams.get("redirect");
	const navigate = useNavigate();
	const [ipdMode, setIpdMode] = useState("non-prescription");
	const { t } = useTranslation();
	const { id } = useParams();
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();
	const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
	const [openedPrescriptionPreview, { open: openPrescriptionPreview, close: closePrescriptionPreview }] =
		useDisclosure(false);

	const showTabs = searchParams.get("tabs") === "true";
	const showPrescriptionForm = !selectedPrescriptionId && id;

	const handlePrescriptionEdit = () => {
		const allParams = Object.fromEntries(searchParams.entries());
		const { tabs, ...restParams } = allParams;
		console.info(tabs);
		setSearchParams(restParams);
	};

	const handleChangeIpdMode = () => {
		navigate(HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.IPD_ADMITTED.INDEX, {
			replace: true,
		});
	};

	useEffect(() => {
		if (queryValue === "prescription") {
			setIpdMode(queryValue);
		} else {
			setIpdMode("non-prescription");
		}
	}, [queryValue]);

	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
			) : (
				<Box p="md">
					<Flex w="100%" gap="xs">
						<Navigation module="home" mainAreaHeight={mainAreaHeight} />
						<Grid w="100%" columns={24} gutter={"xs"}>
							<Grid.Col span={6} pos="relative" className="animate-ease-out">
								<Flex align="center" justify="space-between" px="sm" py="xs" bg="white">
									<Text fw={600} fz="sm">
										{t("PatientInformation")}
									</Text>
									<SegmentedControl
										size="sm"
										color="var(--theme-primary-color-6)"
										value={ipdMode}
										onChange={(value) => {
											setIpdMode(value);
											if (value === "non-prescription") {
												handleChangeIpdMode();
											}
										}}
										data={[
											{ label: t("Prescription"), value: "non-prescription" },
											{ label: t("Manage"), value: "prescription" },
										]}
									/>
								</Flex>
								<TabsWithSearch
									tabList={["list"]}
									module={module}
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
							<Grid.Col span={18} className="animate-ease-out">
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
									<AdmissionPrescription ipdId={id} />
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
