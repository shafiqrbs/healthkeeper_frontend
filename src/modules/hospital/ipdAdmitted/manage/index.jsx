import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getPrescriptionFormInitialValues } from "../helpers/request";
import { useForm } from "@mantine/form";
import {
	Box,
	Flex,
	Grid,
	LoadingOverlay,
	ScrollArea,
	Stack,
	Text,
	ActionIcon,
	Tooltip,
	Button,
	Group,
	Paper,
} from "@mantine/core";
import PatientReport from "@hospital-components/PatientReport";
import AddMedicineForm from "../common/AddMedicineForm";
import BaseTabs from "@components/tabs/BaseTabs";
import useParticularsData from "@hooks/useParticularsData";
import { useDisclosure } from "@mantine/hooks";
import { ERROR_NOTIFICATION_COLOR, MODULES } from "@/constants";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import PatientPrescriptionHistoryList from "@hospital-components/PatientPrescriptionHistoryList";
import { getDataWithoutStore } from "@/services/apiService";
import DetailsDrawer from "@/modules/hospital/common/drawer/__IPDDetailsDrawer";
import { useOutletContext, useParams, useSearchParams } from "react-router-dom";
import Navigation from "@components/layout/Navigation";
import Investigation from "@modules/hospital/ipdAdmitted/common/tabs/Investigation";
import { modals } from "@mantine/modals";
import { formatDate } from "@utils/index";
import useAppLocalStore from "@hooks/useAppLocalStore";
import VitalsChart from "../common/tabs/VitalsChart";
import InsulinChart from "../common/tabs/InsulinChart";
import Dashboard from "../common/tabs/Dashboard";
import PrintPrescriptionIndoor from "../common/tabs/PrintPrescriptionIndoor";
import Discharge from "../common/tabs/Discharge";
import RoomTransfer from "../common/tabs/RoomTransfer.jsx";
import DeathCertificate from "../common/tabs/DeathCertificate";
import DischargePrint from "../common/tabs/DischargePrint";
import RoomTransferPrint from "../common/tabs/RoomTransferPrint.jsx";
import DeathCertificatePrint from "../common/tabs/DeathCertificatePrint.jsx";
import { IconX, IconChevronRight } from "@tabler/icons-react";
import { errorNotification } from "@components/notification/errorNotification";

const module = MODULES.E_FRESH;

const RELEASE_TAB_MAP = {
	referred: "room-transfer",
	discharge: "discharge",
	death: "death-certificate",
};

const RELEASE_PRINT_MAP = {
	discharge: "discharge-print",
	death: "death-certificate-print",
};

const TAB_ITEMS = [
	{
		label: "Dashboard",
		value: "dashboard",
		allowedGroups: ["doctor_ipd", "admin_administrator", "nurse_incharge"],
	},
	{
		label: "E-Fresh",
		value: "e-fresh",
		allowedGroups: ["doctor_ipd", "admin_administrator", "nurse_incharge"],
	},
	{
		label: "Investigation",
		value: "investigation",
		allowedGroups: ["doctor_ipd", "admin_administrator", "nurse_incharge"],
	},
	{
		label: "Vitals Chart",
		value: "vitals-chart",
		allowedGroups: ["admin_administrator", "nurse_incharge"],
	},
	{
		label: "Insulin Chart",
		value: "insulin-chart",
		allowedGroups: ["admin_administrator", "nurse_incharge"],
	},
	{
		label: "Room Transfer",
		value: "room-transfer",
		allowedGroups: ["admin_administrator", "nurse_incharge"],
	},
	{
		label: "Discharge",
		value: "discharge",
		allowedGroups: ["doctor_ipd", "admin_administrator"],
	},
	{
		label: "DeathCertificate",
		value: "death-certificate",
		allowedGroups: ["doctor_ipd", "admin_administrator"],
	},
];

const PRINT_SECTION_ITEMS = [
	{
		label: "E-Fresh Print",
		value: "e-fresh-print",
		allowedGroups: ["doctor_ipd", "admin_administrator", "nurse_incharge"],
	},
	{
		label: "Discharge Print",
		value: "discharge-print",
		allowedGroups: ["doctor_ipd", "admin_administrator", "nurse_incharge"],
	},
	{
		label: "Death Certificate Print",
		value: "death-certificate-print",
		allowedGroups: ["doctor_ipd", "admin_administrator", "nurse_incharge"],
	},
];

export default function Index() {
	const { userRoles } = useAppLocalStore();
	const [searchParams, setSearchParams] = useSearchParams();
	const [records, setRecords] = useState([]);
	const { mainAreaHeight } = useOutletContext();
	const { id } = useParams();
	const [opened, { close }] = useDisclosure(false);
	const [showHistory, setShowHistory] = useState(false);
	const [showPatientReport, setShowPatientReport] = useState(false);
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
		data: ipdData,
		isLoading,
		refetch,
	} = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.INDEX}/${id}`,
	});

	const initialFormValues = JSON.parse(ipdData?.data?.json_content || "{}");
	const existingMedicines = ipdData?.data?.prescription_medicine || [];

	const form = useForm(getPrescriptionFormInitialValues(t, {}));

	useEffect(() => {
		// Always reset the form when prescription data changes
		const updatedFormValues = getPrescriptionFormInitialValues(t, initialFormValues);
		form.setValues(updatedFormValues.initialValues);
		setMedicines(existingMedicines || []);
		setRecords(ipdData?.data?.prescription_medicine_history || []);
	}, [ipdData]);

	useEffect(() => {
		const tab = searchParams.get("tab");
		if (tab) {
			setBaseTabValue(tab?.toLowerCase());
		}
	}, [searchParams]);

	// =============== filter tabs based on release_mode and process status ================
	const releaseMode = ipdData?.data?.release_mode;
	const isPaid = ipdData?.data?.process?.toLowerCase() === "paid";

	// =============== redirect to dashboard if current tab is not accessible ================
	useEffect(() => {
		if (!ipdData?.data || !baseTabValue) return;

		const currentReleaseMode = ipdData.data.release_mode;
		const currentIsPaid = ipdData.data.process?.toLowerCase() === "paid";

		// ❌ If not paid → release tabs & prints are forbidden
		if (!currentIsPaid) {
			const forbidden = [...Object.values(RELEASE_TAB_MAP), ...Object.values(RELEASE_PRINT_MAP)];

			if (forbidden.includes(baseTabValue)) {
				setBaseTabValue("dashboard");
				setSearchParams({ tab: "dashboard" });
			}
			return;
		}

		// ✅ Paid + release mode → ONLY dashboard + matching release tab/print
		if (currentReleaseMode) {
			const allowedTabs = getAllowedTabsForRelease(currentReleaseMode);
			const allowedPrints = getAllowedPrintsForRelease(currentReleaseMode);
			const allowed = [...allowedTabs, ...allowedPrints];

			if (!allowed.includes(baseTabValue)) {
				setBaseTabValue("dashboard");
				setSearchParams({ tab: "dashboard" });
			}
		}
	}, [ipdData?.data, baseTabValue, setSearchParams]);

	const DASHBOARD_TAB = "dashboard";

	const getAllowedTabsForRelease = (releaseMode) => {
		if (!releaseMode) return [];

		return [DASHBOARD_TAB, RELEASE_TAB_MAP[releaseMode]].filter(Boolean);
	};

	const getAllowedPrintsForRelease = (releaseMode) => {
		if (!releaseMode) return [];

		return [RELEASE_PRINT_MAP[releaseMode]].filter(Boolean);
	};

	const handleReleaseMode = (mode) => {
		modals.openConfirmModal({
			title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
			labels: { confirm: t("Submit"), cancel: t("Cancel") },
			confirmProps: { color: "red" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleConfirmApproved(mode),
		});
	};

	const handleConfirmApproved = async (mode) => {
		try {
			await getDataWithoutStore({
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.RELEASE}/${id}/${mode}`,
			});
			refetch();
		} catch (err) {
			console.error(err);
			errorNotification(err?.message, ERROR_NOTIFICATION_COLOR);
		}
	};

	const getFilteredTabs = (tabs) => {
		// ❌ Not paid → remove all release tabs
		if (!isPaid) {
			const RELEASE_TABS = Object.values(RELEASE_TAB_MAP);
			return tabs.filter((tab) => !RELEASE_TABS.includes(tab.value));
		}

		// ✅ Paid + release mode → ONLY dashboard + matching release tab
		if (releaseMode && RELEASE_TAB_MAP[releaseMode]) {
			const allowedTabs = getAllowedTabsForRelease(releaseMode);
			return tabs.filter((tab) => allowedTabs.includes(tab.value));
		}

		// ✅ Paid but no release mode → all tabs
		return tabs;
	};

	const getFilteredPrintItems = (printItems) => {
		// ❌ Not paid → remove all release prints
		if (!isPaid) {
			const RELEASE_PRINTS = Object.values(RELEASE_PRINT_MAP);
			return printItems.filter((item) => !RELEASE_PRINTS.includes(item.value));
		}

		// ✅ Paid + release mode → ONLY matching release print
		if (releaseMode && RELEASE_PRINT_MAP[releaseMode]) {
			const allowedPrints = getAllowedPrintsForRelease(releaseMode);
			return printItems.filter((item) => allowedPrints.includes(item.value));
		}

		// ✅ Paid but no release mode → all prints
		return printItems;
	};

	const handleTabClick = async (value) => {
		if (value === "e-fresh") {
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
					setBaseTabValue(value?.toLowerCase());
					setSearchParams({ tab: value?.toLowerCase() });
				},
			});
		} else if (PRINT_SECTION_ITEMS.includes(value)) {
			// =============== for print items, use item name as tab key ================
			setBaseTabValue(value?.toLowerCase());
			setSearchParams({ tab: value?.toLowerCase() });
		} else {
			setBaseTabValue(value?.toLowerCase());
			setSearchParams({ tab: value?.toLowerCase() });
		}
	};

	const hasRecords = records && records.length > 0;

	return (
		<Box pos="relative">
			<LoadingOverlay visible={isLoading} overlayProps={{ radius: "sm", blur: 2 }} />
			{baseTabValue === "e-fresh" && (
				<Tooltip
					label={showPatientReport ? t("hidePatientReport") : t("showPatientReport")}
					position={showPatientReport ? "left" : "right"}
				>
					<ActionIcon
						variant="filled"
						color={showPatientReport ? "red" : "blue"}
						size="xl"
						radius="xl"
						onClick={() => setShowPatientReport(!showPatientReport)}
						style={{
							position: "fixed",
							top: "50%",
							left: showPatientReport ? "calc(12.5% + 27.1%)" : "calc(12.5% + 56px)",
							transform: "translateY(-50%)",
							zIndex: 99,
							boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
						}}
					>
						{showPatientReport ? <IconX size={18} /> : <IconChevronRight size={18} />}
					</ActionIcon>
				</Tooltip>
			)}
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
									<Text fz="xs">{ipdData?.data?.patient_id}</Text>
									<Text fz="xs">{ipdData?.data?.health_id || ""}</Text>
									<Text fz="sm" fw={600}>
										{ipdData?.data?.name}
									</Text>
									<Text fz="xs">{ipdData?.data?.gender}</Text>
									<Text fz="xs">
										{ipdData?.data?.year || 0}y {ipdData?.data?.month || 0}m{" "}
										{ipdData?.data?.day || 0}d{" "}
									</Text>
									<Text fz="xs">
										{t("Created")} {formatDate(ipdData?.data?.created_at)}
									</Text>
								</Box>
							</Box>

							<ScrollArea
								bg="var(--mantine-color-white)"
								h={mainAreaHeight - 80}
								scrollbars="y"
							>
								<Stack h="100%" py="xs" gap={0}>
									{getFilteredTabs(
										TAB_ITEMS.filter((tabItem) =>
											userRoles.some((role) => tabItem.allowedGroups.includes(role))
										)
									).map((tabItem, index) => (
										<Box
											key={index}
											mx={8}
											className={`cursor-pointer`}
											variant="default"
											onClick={() => handleTabClick(tabItem.value)}
											bg={
												baseTabValue === tabItem.value
													? "var(--mantine-color-gray-1)"
													: "var(--mantine-color-white)"
											}
										>
											<Text
												c={
													baseTabValue === tabItem.value
														? "var(--theme-primary-color-8)"
														: "var(--mantine-color-black)"
												}
												size="sm"
												py="3xs"
												pl="3xs"
												fw={500}
											>
												{t(tabItem.label)}
											</Text>
										</Box>
									))}

									<Box bg="var(--mantine-color-gray-0)" my="3xs" py="sm" px="md">
										<Text size="sm" fw={600}>
											{t("PrintSection")}
										</Text>
									</Box>

									{getFilteredPrintItems(
										PRINT_SECTION_ITEMS.filter((tabItem) =>
											userRoles.some((role) => tabItem.allowedGroups.includes(role))
										)
									).map((tabItem, index) => (
										<Box
											key={index}
											mx={8}
											className={`cursor-pointer`}
											variant="default"
											onClick={() => handleTabClick(tabItem.value)}
											bg={
												baseTabValue === tabItem.value
													? "var(--mantine-color-gray-1)"
													: "var(--mantine-color-white)"
											}
										>
											<Text
												c={
													baseTabValue === tabItem.value
														? "var(--theme-primary-color-8)"
														: "var(--mantine-color-black)"
												}
												size="sm"
												py="3xs"
												pl="3xs"
												fw={500}
											>
												{t(tabItem.label)}
											</Text>
										</Box>
									))}
								</Stack>
								<Box>
									<Box
										bg="var(--theme-secondary-color-1)"
										style={{ borderBottom: "1px solid var(--mantine-color-white)" }}
										p="xs"
									>
										{t("Release Procedure")}
									</Box>
									{ipdData?.data?.release_mode &&
									ipdData?.data?.process?.toLowerCase() !== "paid" ? (
										<Paper
											m="md"
											p="md"
											withBorder
											radius="sm"
											bg="var(--theme-warn-color-1)"
											style={{ borderColor: "var(--theme-warn-color-4)" }}
										>
											<Text fw={600} size="md" c="var(--theme-warn-color-7)">
												{ipdData?.data?.release_mode.charAt(0).toUpperCase() +
													ipdData?.data?.release_mode.slice(1)}
												: waiting for the bill to be processed
											</Text>
										</Paper>
									) : ipdData?.data?.release_mode &&
									  ipdData?.data?.process?.toLowerCase() === "paid" ? (
										<Paper
											withBorder
											radius="sm"
											p={"xs"}
											bg="var(--theme-primary-color-0)"
											style={{ borderColor: "var(--theme-secondary-color-4)" }}
										>
											<Text fw={600} size="md" c="var(--theme-secondary-color-7)">
												{ipdData?.data?.release_mode.charAt(0).toUpperCase() +
													ipdData?.data?.release_mode.slice(1)}
												: Bill processed successfully
											</Text>
										</Paper>
									) : (
										<Group justify="center" py="md">
											<Button fullWidth onClick={() => handleReleaseMode("discharge")}>
												{" "}
												For Discharge{" "}
											</Button>
											<Button
												fullWidth
												color="red"
												onClick={() => handleReleaseMode("death")}
											>
												For Death
											</Button>
											<Button
												fullWidth
												color="green"
												onClick={() => handleReleaseMode("referred")}
											>
												For Referred
											</Button>
										</Group>
									)}
								</Box>
							</ScrollArea>
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
									{showPatientReport && (
										<Box w="40%">
											<PatientReport
												extraHeight={246}
												tabValue={tabValue}
												form={form}
												prescriptionData={ipdData}
												modeName="E-Fresh Order"
												showVitals={false}
											/>
										</Box>
									)}
									<Box w="100%">
										<AddMedicineForm
											module={module}
											form={form}
											medicines={medicines || []}
											hasRecords={hasRecords}
											setMedicines={setMedicines}
											setShowHistory={setShowHistory}
											prescriptionData={ipdData}
											tabParticulars={tabParticulars}
											section="e-fresh"
											baseHeight={mainAreaHeight}
											showBaseItems={false}
											refetch={refetch}
										/>
									</Box>
								</Flex>
							</Stack>
						)}
						{baseTabValue === "room-transfer" && <RoomTransfer data={ipdData?.data} />}
						{baseTabValue === "dashboard" && <Dashboard />}
						{/*{baseTabValue === "issue-medicine" && <IssueMedicine />}*/}
						{/*{baseTabValue === "medicine" && <Medicine refetch={refetch} data={prescriptionData?.data}  />}*/}
						{baseTabValue === "investigation" && <Investigation ipdData={ipdData?.data} />}
						{baseTabValue === "vitals-chart" && (
							<VitalsChart refetch={refetch} data={ipdData?.data} />
						)}
						{baseTabValue === "insulin-chart" && (
							<InsulinChart refetch={refetch} data={ipdData?.data} />
						)}
						{baseTabValue === "discharge" && (
							<Discharge ipdData={ipdData?.data} refetch={refetch} />
						)}
						{baseTabValue === "death-certificate" && <DeathCertificate data={ipdData?.data} />}
						{baseTabValue === "e-fresh-print" && <PrintPrescriptionIndoor />}
						{baseTabValue === "discharge-print" && (
							<DischargePrint data={ipdData?.data} refetch={refetch} />
						)}
						{baseTabValue === "death-certificate-print" && (
							<DeathCertificatePrint data={ipdData?.data} refetch={refetch} />
						)}
						{baseTabValue === "room-transfer-print" && (
							<RoomTransferPrint data={ipdData?.data} refetch={refetch} />
						)}
						{/*{baseTabValue === "admission form" && <PrintAdmissionForm />}*/}

						{!baseTabValue && (
							<Flex
								bg="var(--mantine-color-white)"
								align="center"
								justify="center"
								w="100%"
								h="100%"
							>
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
