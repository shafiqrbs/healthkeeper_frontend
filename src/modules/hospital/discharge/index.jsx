import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import Navigation from "@components/layout/Navigation";
import { Box, Flex, Grid, SegmentedControl, Text } from "@mantine/core";
import TabsWithSearch from "@components/advance-search/TabsWithSearch";
import { useDisclosure } from "@mantine/hooks";
import { MODULES } from "@/constants";
import Table from "./_Table";
import Prescription from "./_Prescription";
import PatientPrescriptionHistoryList from "@hospital-components/PatientPrescriptionHistoryList";
import { getDataWithoutStore } from "@/services/apiService";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import DetailsDrawer from "@hospital-components/drawer/__DetailsDrawer";

const module = MODULES.ADMISSION;

export default function Index() {
	const [showHistory, setShowHistory] = useState(false);
	const [fetching, setFetching] = useState(false);
	const [records, setRecords] = useState([]);
	const [customerId, setCustomerId] = useState("");
	const { dischargeId } = useParams();
	const [dischargeMode, setDischargeMode] = useState("current");
	const { t } = useTranslation();
	const { id } = useParams();
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();
	const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
	const [openedPrescriptionPreview, { open: openPrescriptionPreview, close: closePrescriptionPreview }] =
		useDisclosure(false);

	const fetchData = async () => {
		setFetching(true);
		try {
			const result = await getDataWithoutStore({
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.PATIENT_PRESCRIPTION}/${customerId}/${dischargeId}`,
			});
			setRecords(result?.data || []);
		} catch (err) {
			console.error("Unexpected error:", err);
		} finally {
			setFetching(false);
		}
	};

	useEffect(() => {
		if (customerId) {
			fetchData();
		}
	}, [customerId]);

	const hasRecords = records && records.length > 0;

	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
			) : (
				<Box p="md">
					<Flex w="100%" gap="xs">
						<Navigation module="home" mainAreaHeight={mainAreaHeight} />
						<Grid w="100%" columns={24} gutter="xs">
							<Grid.Col span={24} pos="relative" className="animate-ease-out">
								<Flex
									align="center"
									justify="space-between"
									px="sm"
									py="xs"
									bg="var(--mantine-color-white)"
								>
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
								{/* <TabsWithSearch
									tabList={["list"]}
									module={module}
									tabPanels={[
										{
											tab: "list",
											component: ( */}
								<Table
									ipdMode={dischargeMode}
									selectedPrescriptionId={selectedPrescriptionId}
									setSelectedPrescriptionId={setSelectedPrescriptionId}
								/>
								{/* ),
										},
									]}
								/> */}
							</Grid.Col>
							{/* <Grid.Col span={18} className="animate-ease-out">
								{dischargeId ? (
									<Prescription
										setCustomerId={setCustomerId}
										hasRecords={hasRecords}
										setShowHistory={setShowHistory}
										baseHeight={mainAreaHeight - 370}
									/>
								) : (
									<Flex
										justify="center"
										align="center"
										p="sm"
										px="md"
										bg="var(--mantine-color-white)"
										h={mainAreaHeight - 12}
									>
										<Text>No patient selected, please select a patient</Text>
									</Flex>
								)}
							</Grid.Col> */}
							{hasRecords && (
								<Grid.Col display={showHistory ? "block" : "none"} span={4}>
									<PatientPrescriptionHistoryList historyList={records} />
								</Grid.Col>
							)}
						</Grid>
					</Flex>
				</Box>
			)}
			{id && (
				<DetailsDrawer
					opened={openedPrescriptionPreview}
					close={closePrescriptionPreview}
					prescriptionId={id}
				/>
			)}
		</>
	);
}
