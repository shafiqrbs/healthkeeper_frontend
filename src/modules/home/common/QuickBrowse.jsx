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
import { HOSPITAL_DATA_ROUTES } from "@/constants/appRoutes";

const quickBrowseButtonData = [
	{
		label: "Ticket",
		icon: IconStethoscope,
		route: "/hospital/visit",
		color: "var(--mantine-color-yellow-8)",
	},
	{
		label: "admission",
		icon: IconBed,
		route: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.ADMISSION.INDEX,
		color: "var(--mantine-color-blue-7)",
	},
	{
		label: "doctorRevisit",
		icon: IconTestPipe,
		route: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.DOCTOR_REVISIT.INDEX,
		color: "var(--theme-secondary-color-8)",
	},
	{
		label: "doctorReport",
		icon: IconMailForward,
		route: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.DOCTOR_REPORT.INDEX,
		color: "var(--mantine-color-indigo-8)",
	},
	{
		label: "diagnosis",
		icon: IconTestPipe2,
		route: "/diagnosis",
		color: "var(--mantine-color-cyan-8)",
	},
	{
		label: "reportPrepared",
		icon: IconClipboardText,
		route: "/report-prepare",
		color: "var(--mantine-color-red-8)",
	},
];

const quickBrowseCardData = [
	{
		label: "commission",
		icon: IconChecklist,
		route: "/commission",
		color: "var(--mantine-color-indigo-7)",
		backgroundColor: "var(--mantine-color-indigo-0)",
	},
	{
		label: "diagnosticTest",
		icon: IconMicroscope,
		route: "/diagnostic-test",
		color: "var(--theme-secondary-color-9)",
		backgroundColor: "var(--theme-secondary-color-0)",
	},
	{
		label: "payment",
		icon: IconWallet,
		route: "/payment",
		color: "var(--mantine-color-cyan-7)",
		backgroundColor: "var(--mantine-color-cyan-0)",
	},
	{
		label: "itemIssue",
		icon: IconBuildingHospital,
		route: "/item-issue",
		color: "var(--mantine-color-red-7)",
		backgroundColor: "var(--mantine-color-red-0)",
	},
	{
		label: "newDoctor",
		icon: IconStethoscope,
		route: "/new-doctor",
		color: "var(--mantine-color-yellow-7)",
		backgroundColor: "var(--mantine-color-yellow-0)",
	},
	{
		label: "manageStock",
		icon: IconPackageExport,
		route: "/manage-stock",
		color: "var(--mantine-color-blue-7)",
		backgroundColor: "var(--mantine-color-blue-0)",
	},
];

export default function QuickBrowse() {
	const navigate = useNavigate();
	const { t } = useTranslation();

	return (
		<Card padding="lg" radius="sm" h="100%">
			<Card.Section h={32} withBorder component="div" bg="var(--theme-primary-color-7)">
				<Flex align="center" h="100%" px="lg">
					<Text pb={0} fz="sm" c="white" fw={500}>
						{t("quickBrowse")}
					</Text>
				</Flex>
			</Card.Section>

			<Grid columns={9} gutter="md" mt="md">
				{quickBrowseButtonData.map((item) => (
					<Grid.Col span={3} key={item.label}>
						<Link to={item.route} style={{ textDecoration: "none" }}>
							<Button leftSection={<item.icon size={16} />} color="white" bg={item.color} fullWidth>
								{t(item.label)}
							</Button>
						</Link>
					</Grid.Col>
				))}
			</Grid>
			<Divider my="md" c="var(--theme-gray-color-0)" />
			<Grid columns={9} gutter="md">
				{quickBrowseCardData.map((item) => (
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
	);
}
