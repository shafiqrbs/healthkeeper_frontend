import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import Navigation from "@components/layout/Navigation";
import { Box, Flex, Grid, SegmentedControl, Text } from "@mantine/core";
import TabsWithSearch from "@components/advance-search/TabsWithSearch";
import GlobalDrawer from "@components/drawers/GlobalDrawer";
import PrescriptionPreview from "@hospital-components/PrescriptionPreview";
import { useDisclosure } from "@mantine/hooks";
import { MODULES } from "@/constants";
import Table from "./_Table";
import Prescription from "./_Prescription";

const module = MODULES.ADMISSION;

export default function Index() {
	const { dischargeId } = useParams();
	const [dischargeMode, setDischargeMode] = useState("archive");
	const { t } = useTranslation();
	const { id } = useParams();
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();
	const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
	const [openedPrescriptionPreview, { open: openPrescriptionPreview, close: closePrescriptionPreview }] =
		useDisclosure(false);

	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
			) : (
				<Box p="md">
					<Flex w="100%" gap="xs">
						<Navigation module="home" mainAreaHeight={mainAreaHeight} />
						<Grid w="100%" columns={24} gutter="xs">
							<Grid.Col span={6} pos="relative" className="animate-ease-out">
								<Flex align="center" justify="space-between" px="sm" py="xs" bg="white">
									<Text fw={600} fz="sm">
										{t("PatientInformation")}
									</Text>
									<SegmentedControl
										size="sm"
										color="var(--theme-primary-color-6)"
										value={dischargeMode}
										onChange={(value) => {
											setDischargeMode(value);
										}}
										data={[
											{ label: t("Current"), value: "current" },
											{ label: t("Archive"), value: "archive" },
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
													ipdMode={dischargeMode}
													selectedPrescriptionId={selectedPrescriptionId}
													setSelectedPrescriptionId={setSelectedPrescriptionId}
												/>
											),
										},
									]}
								/>
							</Grid.Col>
							<Grid.Col span={18} className="animate-ease-out">
								{dischargeId ? (
									<Prescription />
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
