import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { getDataWithoutStore } from "@/services/apiService";
import {useEffect, useRef} from "react";
import {useOutletContext, useSearchParams} from "react-router-dom";
import DailyOverview from "@modules/home/common/DailyOverview";
import {ActionIcon, Box, Card, Flex, Grid, rem, Text} from "@mantine/core";
import {IconFileTypePdf, IconMicroscope, IconStethoscope, IconWallet} from "@tabler/icons-react";
import {useReactToPrint} from "react-to-print";
import SummaryReports from "@modules/hospital/reports/sales-summary/SummaryReports";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {MODULES_CORE} from "@/constants";
import {getUserRole} from "@utils/index";
const module = MODULES_CORE.DASHBOARD_DAILY_SUMMARY;

const quickBrowseCardData = [
	{
		label: "OPD Ticket",
		icon: IconMicroscope,
		route: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.VISIT.INDEX,
		color: "var(--theme-secondary-color-9)",
		backgroundColor: "var(--theme-secondary-color-0)",
		allowedRoles: ["admin_administrator", "operator_opd", "operator_manager"],
	},
	{
		label: "Emergency",
		icon: IconWallet,
		route: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.EMERGENCY.INDEX,
		color: "var(--mantine-color-cyan-8)",
		backgroundColor: "var(--mantine-color-cyan-0)",
		allowedRoles: ["admin_administrator", "operator_ipd", "operator_manager"],
	},
	{
		label: "IPD",
		icon: IconWallet,
		route: "/payment",
		color: "var(--mantine-color-cyan-7)",
		backgroundColor: "var(--mantine-color-cyan-0)",
		allowedRoles: ["admin_administrator", "operator_ipd", "operator_manager"],
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
		allowedRoles: ["doctor", "nurse", "admin"],
	},
	/*{
		label: "manageStock",
		icon: IconPackageExport,
		route: "/manage-stock",
		color: "var(--mantine-color-blue-7)",
		backgroundColor: "var(--mantine-color-blue-0)",
	},*/
];

export default function DashboardDailySummary() {
	const { t } = useTranslation();
	const [searchParams] = useSearchParams();
	const tab = searchParams.get("tab");
	const { height } = useOutletContext();
	useEffect(() => {
		(async () => {
			const res = await getDataWithoutStore({
				url: HOSPITAL_DATA_ROUTES.API_ROUTES.REPORT.DASHBOARD_DAILY_SUMMARY,
			});
			console.log(res);
		})();
	}, [tab]);
	const records = useSelector((state) => state.crud[module].data);

	const summaryReportsRef = useRef(null);
	const handleHomeOverviewPrint = useReactToPrint({
		content: () => summaryReportsRef.current,
	});

	return(
		<Box w="100%" bg="var(--mantine-color-white)">
			<Grid columns={40} h={height} gutter={{ base: "xs" }}>
				<Grid.Col span={40}>
					<Card padding="lg" radius="sm">
					<Card.Section h={32} withBorder component="div" bg="var(--theme-primary-color-7)">
						<Flex align="center" h="100%" px="lg" justify="space-between">
							<Text pb={0} fz="sm" c="white" fw={500}>
								{t("CollectionOverview")}
							</Text>
							<ActionIcon variant="default" c={"green.8"} size="md" aria-label="Filter">
								<IconFileTypePdf
									style={{ width: rem(16) }}
									stroke={1.2}
									onClick={handleHomeOverviewPrint}
								/>
							</ActionIcon>
						</Flex>
					</Card.Section>
					</Card>
					<DailyOverview/>
					{records?.data && <SummaryReports ref={summaryReportsRef} data={records?.data || []} />}
				</Grid.Col>
			</Grid>
		</Box>
	);
}
