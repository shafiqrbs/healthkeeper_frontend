import { ActionIcon, Box, Button, Card, Divider, Flex, Grid, Modal, Stack, Text } from "@mantine/core";
import {
	IconBed,
	IconBuildingHospital,
	IconChartAreaLineFilled,
	IconChecklist,
	IconClipboardText,
	IconMailForward,
	IconMicroscope,
	IconPackageExport,
	IconStethoscope,
	IconTestPipe,
	IconTestPipe2,
	IconWallet,
} from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import useAppLocalStore from "@hooks/useAppLocalStore";
import OperatorOverview from "@modules/home/operator/OperatorOverview";
import DailyOverview from "@modules/home/common/DailyOverview";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useDisclosure } from "@mantine/hooks";
import DashboardOverviewChart from "@components/charts/DashboardOverviewChart";

const quickBrowseButtonData = [
	{
		label: "Outdoor Ticket",
		icon: IconStethoscope,
		route: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.VISIT.INDEX,
		color: "var(--mantine-color-yellow-8)",
		allowedRoles: [ "admin_administrator", "operator_opd", "operator_manager" ],
	},
	{
		label: "IPD",
		icon: IconBed,
		route: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.ADMISSION.INDEX,
		color: "var(--mantine-color-blue-7)",
		allowedRoles: [ "admin_administrator", "operator_opd", "operator_manager" ],
	},
	{
		label: "Emergency",
		icon: IconTestPipe2,
		route: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.EMERGENCY.INDEX,
		color: "var(--mantine-color-cyan-8)",
		allowedRoles: [ "admin_administrator", "operator_opd", "operator_manager" ],
	},
	{
		label: "reportDelivery",
		icon: IconMailForward,
		route: "/report-delivery",
		color: "var(--mantine-color-indigo-8)",
		allowedRoles: [ "doctor", "nurse", "admin" ],
	},
	{
		label: "Medicine",
		icon: IconTestPipe,
		route: "/add-diagnostic",
		color: "var(--theme-secondary-color-8)",
		allowedRoles: [ "doctor", "nurse", "admin" ],
	},

	{
		label: "reportPrepared",
		icon: IconClipboardText,
		route: "/report-prepare",
		color: "var(--mantine-color-red-8)",
		allowedRoles: [ "doctor", "nurse", "admin" ],
	},
];

const quickBrowseCardData = [
	{
		label: "OPD Ticket",
		icon: IconMicroscope,
		route: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.VISIT.INDEX,
		color: "var(--theme-secondary-color-9)",
		backgroundColor: "var(--theme-secondary-color-0)",
		allowedRoles: [ "admin_administrator", "operator_opd", "operator_manager" ],
	},
	{
		label: "Emergency",
		icon: IconWallet,
		route: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.EMERGENCY.INDEX,
		color: "var(--mantine-color-cyan-8)",
		backgroundColor: "var(--mantine-color-cyan-0)",
		allowedRoles: [ "admin_administrator", "operator_ipd", "operator_manager" ],
	},
	{
		label: "IPD",
		icon: IconWallet,
		route: "/payment",
		color: "var(--mantine-color-cyan-7)",
		backgroundColor: "var(--mantine-color-cyan-0)",
		allowedRoles: [ "admin_administrator", "operator_ipd", "operator_manager" ],
	},

	/*{
		label: "itemIssue",
		icon: IconBuildingHospital,
		route: "/item-issue",
		color: "var(--mantine-color-red-7)",
		backgroundColor: "var(--mantine-color-red-0)",
		allowedRoles: ["doctor", "nurse", "admin"],
	},*/
	{
		label: "OPDQueue",
		icon: IconStethoscope,
		route: "/hospital/visit",
		color: "var(--mantine-color-yellow-7)",
		backgroundColor: "var(--mantine-color-yellow-0)",
		allowedRoles: [ "doctor", "nurse", "admin" ],
	},
	/*{
		label: "manageStock",
		icon: IconPackageExport,
		route: "/manage-stock",
		color: "var(--mantine-color-blue-7)",
		backgroundColor: "var(--mantine-color-blue-0)",
	},*/
];

export default function AdminBoard() {
	const { userRoles } = useAppLocalStore();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [ opened, { open, close } ] = useDisclosure(false);

	const filteredQuickBrowseButtonData = quickBrowseButtonData.filter((item) =>
		item.allowedRoles.some((role) => userRoles.includes(role))
	);

	const filteredQuickBrowseCardData = quickBrowseCardData.filter((item) =>
		item.allowedRoles.some((role) => userRoles.includes(role))
	);

	const { data: records, isLoading } = useDataWithoutStore({
		url: HOSPITAL_DATA_ROUTES.API_ROUTES.REPORT.DASHBOARD_OVERVIEW
	});
	const monthlyOverview = records?.data?.monthlyOverview ?? records?.monthlyOverview ?? null;

	// =============== one chart per section: OPD, Emergency, IPD, Discharged ===============
	const overviewChartSections = [
		{ key: "monthlyOpd", label: "OPD", color: "yellow.7" },
		{ key: "monthlyEmergency", label: "Emergency", color: "cyan.7" },
		{ key: "monthlyIpd", label: "IPD", color: "blue.7" },
		{ key: "monthlyDischarged", label: "Discharged", color: "teal.7" },
	];

	const collectionSummaryData = records?.data?.summary[ 0 ] || {};
	const invoiceModeData = records?.data?.invoiceMode || [];
	const patientModeCollectionData = records?.data?.patientMode || [];
	const userCollectionData = records?.data?.userBase || [];
	const serviceGroups = records?.data?.serviceGroups || [];
	const serviceData = records?.data?.services || [];
	const patientServiceModeData = records?.data?.patientServiceMode || [];
	const summaryReportsRef = useRef(null);
	const handleHomeOverviewPrint = useReactToPrint({
		content: () => summaryReportsRef.current,
	});

	return (
		<>
			<ActionIcon size={50} onClick={open} styles={{ root: { right: 0, position: "absolute", top: "50%", zIndex: 99, borderTopRightRadius: 0, borderBottomRightRadius: 0 } }}>
				<IconChartAreaLineFilled color="white" />
			</ActionIcon>
			<Grid columns={40} gutter={{ base: "md" }}>
				{overviewChartSections.map((section) => (
					<Grid.Col key={section.key} span={20}>
						<DashboardOverviewChart
							data={monthlyOverview?.[section.key] ?? []}
							sectionLabel={section.label}
							color={section.color}
						/>
					</Grid.Col>
				))}
			</Grid>

			<Modal size="70%" opened={opened} onClose={close} title="Collection Overview" centered>
				<Card padding="lg" radius="sm" h="100%">
					<Card.Section
						h={32}
						withBorder
						component="div"
						bg="var(--theme-primary-color-7)"
					>
						<Flex align="center" h="100%" px="lg">
							<Text pb={0} fz="sm" c="white" fw={500}>
								{t("CollectionOverview")}
							</Text>
						</Flex>
					</Card.Section>
					<DailyOverview />
				</Card>
			</Modal>
		</>
	);
}
