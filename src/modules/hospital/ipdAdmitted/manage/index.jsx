import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getPrescriptionFormInitialValues } from "../helpers/request";
import { useForm } from "@mantine/form";
import { Box, Flex, Grid, LoadingOverlay, Stack, Text } from "@mantine/core";
import PatientReport from "@hospital-components/PatientReport";
import AddMedicineForm from "../common/AddMedicineForm";
import BaseTabs from "@components/tabs/BaseTabs";
import useParticularsData from "@hooks/useParticularsData";
import { useDisclosure } from "@mantine/hooks";
import { MODULES } from "@/constants";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import PatientPrescriptionHistoryList from "@hospital-components/PatientPrescriptionHistoryList";
import { getDataWithoutStore } from "@/services/apiService";
import DetailsDrawer from "@/modules/hospital/common/drawer/__IPDDetailsDrawer";
import { useOutletContext, useParams, useSearchParams } from "react-router-dom";
import Navigation from "@components/layout/Navigation";
import Medicine from "@modules/hospital/ipdAdmitted/common/tabs/Medicine";
import Investigation from "@modules/hospital/ipdAdmitted/common/tabs/Investigation";
import { modals } from "@mantine/modals";
import { formatDate } from "@utils/index";
import VitalsChart from "../common/tabs/VitalsChart";
import InsulinChart from "../common/tabs/InsulinChart";
import Dashboard from "../common/tabs/Dashboard";
import PrintSection from "../common/tabs/PrintSection";

const module = MODULES.E_FRESH;

const TAB_ITEMS = [
	"Dashboard",
	"E-Fresh",
	"Investigation",
	"Medicine",
	"Vitals Chart",
	"Insulin Chart",
	"Print Section",
];

export default function Index() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [records, setRecords] = useState([]);
	const { mainAreaHeight } = useOutletContext();
	const { id } = useParams();
	const [opened, { close }] = useDisclosure(false);
	const [showHistory, setShowHistory] = useState(false);
	const [medicines, setMedicines] = useState([]);
	const { t } = useTranslation();
	const [tabValue, setTabValue] = useState("All");
	const [baseTabValue, setBaseTabValue] = useState("dashboard");
	const { particularsData } = useParticularsData({ modeName: "E-Fresh Order" });

	const tabParticulars = particularsData?.map((item) => ({
		particular_type: item.particular_type,
		ordering: item?.ordering ?? 0,
	}));

	const tabList = [...(tabParticulars?.sort((a, b) => a?.ordering - b?.ordering) || [])]?.map(
		(item) => item?.particular_type?.name
	);

	const {
		data: prescriptionData,
		isLoading,
		refetch,
	} = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.INDEX}/${id}`,
	});

	const initialFormValues = JSON.parse(prescriptionData?.data?.json_content || "{}");
	const existingMedicines = prescriptionData?.data?.prescription_medicine || [];

	const form = useForm(getPrescriptionFormInitialValues(t, {}));

	useEffect(() => {
		// Always reset the form when prescription data changes
		const updatedFormValues = getPrescriptionFormInitialValues(t, initialFormValues);
		form.setValues(updatedFormValues.initialValues);
		setMedicines(existingMedicines || []);
		setRecords(prescriptionData?.data?.prescription_medicine_history || []);
	}, [prescriptionData]);

	useEffect(() => {
		const tab = searchParams.get("tab");
		if (tab) {
			setBaseTabValue(tab?.toLowerCase());
		}
	}, [searchParams]);

	const handleTabClick = async (tabItem) => {
		if (tabItem === "E-Fresh") {
			modals.openConfirmModal({
				title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
				children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
				labels: { confirm: t("Confirm"), cancel: t("Cancel") },
				confirmProps: { color: "red" },
				onCancel: () => console.info("Cancel"),
				onConfirm: async () => {
					await getDataWithoutStore({
						url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.EFRESH_ORDER}/${id}`,
					});
					refetch();
					setBaseTabValue(tabItem?.toLowerCase());
					setSearchParams({ tab: tabItem?.toLowerCase() });
				},
			});
		} else {
			setBaseTabValue(tabItem?.toLowerCase());
			setSearchParams({ tab: tabItem?.toLowerCase() });
		}
	};

	const hasRecords = records && records.length > 0;

	return (
		<Box pos="relative">
			<LoadingOverlay visible={isLoading} overlayProps={{ radius: "sm", blur: 2 }} />
			<Flex w="100%" gap="xs" p="16px">
				<Navigation module="home" mainAreaHeight={mainAreaHeight} />
				<Grid w="100%" columns={24} gutter="xs">
					<Grid.Col span={3}>
						<Box style={{ overflow: "hidden" }} h={mainAreaHeight - 14}>
							<Box mb="xs" bg="var(--theme-primary-color-1)">
								<Box
									bg="var(--theme-primary-color-1)"
									style={{ borderBottom: "1px solid var(--mantine-color-white)" }}
									p="xs"
								>
									{t("PatientInformation")}
								</Box>
								<Box p="xs" bg="var(--theme-primary-color-0)">
									<Text fz="xs">{prescriptionData?.data?.patient_id}</Text>
									<Text fz="xs">{prescriptionData?.data?.health_id || ""}</Text>
									<Text fz="sm" fw={600}>
										{prescriptionData?.data?.name}
									</Text>
									<Text fz="xs">{prescriptionData?.data?.gender}</Text>
									<Text fz="xs">
										{prescriptionData?.data?.year || 0}y {prescriptionData?.data?.month || 0}m{" "}
										{prescriptionData?.data?.day || 0}d{" "}
									</Text>
									<Text fz="xs">
										{t("Created")} {formatDate(prescriptionData?.data?.created_at)}
									</Text>
								</Box>
							</Box>
							<Stack bg="var(--mantine-color-white)" h="100%" py="xs" gap={0}>
								{TAB_ITEMS.map((tabItem, index) => (
									<Box
										key={index}
										mx={8}
										className={`cursor-pointer`}
										variant="default"
										onClick={() => handleTabClick(tabItem)}
										bg={
											baseTabValue === tabItem?.toLowerCase()
												? "var(--mantine-color-gray-1)"
												: "var(--mantine-color-white)"
										}
									>
										<Text
											c={
												baseTabValue === tabItem?.toLowerCase()
													? "var(--theme-primary-color-8)"
													: "var(--mantine-color-black)"
											}
											size="sm"
											py="3xs"
											pl="3xs"
											fw={500}
										>
											{t(tabItem)}
										</Text>
									</Box>
								))}
							</Stack>
						</Box>
					</Grid.Col>
					<Grid.Col w="100%" span={showHistory ? 17 : 21}>
						{baseTabValue === "e-fresh" && (
							<Stack w="100%" gap={0}>
								<BaseTabs
									tabValue={tabValue}
									setTabValue={setTabValue}
									tabList={["All", ...(tabList?.length > 0 ? tabList : ["No data"])]}
								/>
								<Flex gap="xs" w="100%">
									<Box w="40%">
										<PatientReport
											extraHeight={246}
											tabValue={tabValue}
											form={form}
											prescriptionData={prescriptionData}
											modeName="E-Fresh Order"
										/>
									</Box>
									<AddMedicineForm
										module={module}
										form={form}
										medicines={medicines || []}
										hasRecords={hasRecords}
										setMedicines={setMedicines}
										setShowHistory={setShowHistory}
										prescriptionData={prescriptionData}
										tabParticulars={tabParticulars}
									/>
								</Flex>
							</Stack>
						)}
						{baseTabValue === "dashboard" && <Dashboard />}
						{baseTabValue === "medicine" && <Medicine />}
						{baseTabValue === "investigation" && <Investigation />}
						{baseTabValue === "vitals chart" && (
							<VitalsChart refetch={refetch} data={prescriptionData?.data} />
						)}
						{baseTabValue === "insulin chart" && (
							<InsulinChart refetch={refetch} data={prescriptionData?.data} />
						)}
						{baseTabValue === "print section" && <PrintSection />}
						{!baseTabValue && (
							<Flex bg="var(--mantine-color-white)" align="center" justify="center" w="100%" h="100%">
								<Text size="sm" c="dimmed">
									No item selected
								</Text>
							</Flex>
						)}
					</Grid.Col>
					{hasRecords && (
						<Grid.Col display={showHistory ? "block" : "none"} span={4}>
							<PatientPrescriptionHistoryList historyList={records} />
						</Grid.Col>
					)}
				</Grid>
			</Flex>

			{id && <DetailsDrawer opened={opened} close={close} prescriptionId={id} />}
		</Box>
	);
}
