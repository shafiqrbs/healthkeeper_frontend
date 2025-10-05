import { ActionIcon, Box, Card, Flex, Grid, Stack, Text, rem } from "@mantine/core";
import { IconFileTypePdf, IconMicroscope, IconStethoscope, IconWallet } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CONFIGURATION_ROUTES, HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { formatDate, getLoggedInUser, getUserRole } from "@/common/utils";
import DailyOverview from "@modules/home/common/DailyOverview";
import { useReactToPrint } from "react-to-print";
import { useEffect, useRef } from "react";
import Home from "@components/print-formats/operator/Home";
import { getIndexEntityData } from "@/app/store/core/crudThunk";
import { MODULES_CORE } from "@/constants";
import { useDispatch, useSelector } from "react-redux";

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

const module = MODULES_CORE.DASHBOARD_DAILY_SUMMARY;

export default function OperatorBoard() {
	const roles = getUserRole();
	const user = getLoggedInUser();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const userRole = getUserRole();
	const homeRef = useRef(null);
	const dispatch = useDispatch();
	const records = useSelector((state) => state.crud[module].data);
	const filteredQuickBrowseCardData = quickBrowseCardData.filter((item) =>
		item.allowedRoles.some((role) => userRole.includes(role))
	);

	const handleHomeOverviewPrint = useReactToPrint({
		content: () => homeRef.current,
	});

	useEffect(() => {
		dispatch(
			getIndexEntityData({
				module,
				url: CONFIGURATION_ROUTES.API_ROUTES.HOSPITAL_CONFIG.OPD_DASHBOARD,
				params: {
					created: formatDate(new Date()),
					created_by_id: roles.includes("operator_manager") ? undefined : user?.id,
				},
			})
		);
	}, []);

	return (
		<Grid columns={40} gutter={{ base: "md" }}>
			<Grid.Col span={20}>
				<Card padding="lg" radius="sm" h="100%">
					<Card.Section h={32} withBorder component="div" bg="var(--theme-primary-color-7)">
						<Flex align="center" h="100%" px="lg">
							<Text pb={0} fz="sm" c="white" fw={500}>
								{t("QuickBrowse")}
							</Text>
						</Flex>
					</Card.Section>
					<Grid columns={9} gutter="md" mt="md">
						{filteredQuickBrowseCardData.map((item) => (
							<Grid.Col span={3} key={item.label}>
								<Box
									onClick={() => navigate(item.route)}
									bg={item.backgroundColor}
									h="100%"
									py="sm"
									style={{ cursor: "pointer", borderRadius: "4%" }}
								>
									<Stack direction="column" align="center" h="100%" px="lg" gap="les">
										<Flex
											w={32}
											h={32}
											bg={item.color}
											style={{ borderRadius: "50%" }}
											justify="center"
											align="center"
										>
											<item.icon color="white" size={16} />
										</Flex>
										<Text pb={0} fz="sm" fw={500}>
											{t(item.label)}
										</Text>
									</Stack>
								</Box>
							</Grid.Col>
						))}
					</Grid>
				</Card>
			</Grid.Col>
			<Grid.Col span={20}>
				<Card padding="lg" radius="sm" h="100%">
					<Card.Section h={32} withBorder component="div" bg="var(--theme-primary-color-7)">
						<Flex align="center" h="100%" px="lg" justify="space-between">
							<Text pb={0} fz="sm" c="white" fw={500}>
								{t("CollectionOverview")}
							</Text>
							<ActionIcon variant="default" c={"green.8"} size="md" aria-label="Filter">
								<IconFileTypePdf
									style={{ width: rem(20) }}
									stroke={1.5}
									onClick={handleHomeOverviewPrint}
								/>
							</ActionIcon>
						</Flex>
					</Card.Section>
					<DailyOverview />
					{/* print component for home overview */}
					{records?.data && <Home ref={homeRef} data={records.data} />}
				</Card>
			</Grid.Col>
		</Grid>
	);
}
