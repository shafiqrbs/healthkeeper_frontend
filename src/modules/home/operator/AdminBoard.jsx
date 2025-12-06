import { Box, Button, Card, Divider, Flex, Grid, Stack, Text } from "@mantine/core";
import {
	IconBed,
	IconBuildingHospital,
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

const quickBrowseButtonData = [
	{
		label: "Outdoor Ticket",
		icon: IconStethoscope,
		route: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.VISIT.INDEX,
		color: "var(--mantine-color-yellow-8)",
		allowedRoles: ["admin_administrator", "operator_opd", "operator_manager"],
	},
	{
		label: "IPD",
		icon: IconBed,
		route: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.ADMISSION.INDEX,
		color: "var(--mantine-color-blue-7)",
		allowedRoles: ["admin_administrator", "operator_opd", "operator_manager"],
	},
	{
		label: "Emergency",
		icon: IconTestPipe2,
		route: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.EMERGENCY.INDEX,
		color: "var(--mantine-color-cyan-8)",
		allowedRoles: ["admin_administrator", "operator_opd", "operator_manager"],
	},
	{
		label: "reportDelivery",
		icon: IconMailForward,
		route: "/report-delivery",
		color: "var(--mantine-color-indigo-8)",
		allowedRoles: ["doctor", "nurse", "admin"],
	},
	{
		label: "Medicine",
		icon: IconTestPipe,
		route: "/add-diagnostic",
		color: "var(--theme-secondary-color-8)",
		allowedRoles: ["doctor", "nurse", "admin"],
	},

	{
		label: "reportPrepared",
		icon: IconClipboardText,
		route: "/report-prepare",
		color: "var(--mantine-color-red-8)",
		allowedRoles: ["doctor", "nurse", "admin"],
	},
];

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

export default function AdminBoard() {
	const { userRoles } = useAppLocalStore();
	const navigate = useNavigate();
	const { t } = useTranslation();

	const filteredQuickBrowseButtonData = quickBrowseButtonData.filter((item) =>
		item.allowedRoles.some((role) => userRoles.includes(role))
	);

	const filteredQuickBrowseCardData = quickBrowseCardData.filter((item) =>
		item.allowedRoles.some((role) => userRoles.includes(role))
	);

	return (
		<Grid columns={40} gutter={{ base: "md" }}>
			<Grid.Col span={20}>
				<Card padding="lg" radius="sm" h="100%">
					<Card.Section
						h={32}
						withBorder
						component="div"
						bg="var(--theme-primary-color-7)"
					>
						<Flex align="center" h="100%" px="lg">
							<Text pb={0} fz="sm" c="white" fw={500}>
								{t("quickBrowse")}
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
									<Stack
										direction="column"
										align="center"
										h="100%"
										px="lg"
										gap="les"
									>
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
			</Grid.Col>
		</Grid>
	);
}
