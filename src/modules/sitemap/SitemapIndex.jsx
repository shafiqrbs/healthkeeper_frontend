import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
	Group,
	rem,
	Text,
	Badge,
	Title,
	Card,
	SimpleGrid,
	Container,
	ScrollArea,
	Grid,
	List,
	ThemeIcon,
	NavLink,
} from "@mantine/core";
import {
	IconBed,
	IconStethoscope,
	IconTestPipe,
	IconMicroscope,
	IconUser,
	IconUsers,
	IconFileInvoice,
	IconReportMoney,
	IconShoppingCart,
	IconPill,
	IconReport,
	IconCash,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import classes from "@assets/css/FeaturesCards.module.css";

// =============== sitemap sections and links for hospital management system ================
const SITEMAP_SECTIONS = [
	{
		title: "patientManagement",
		icon: IconBed,
		color: "var(--mantine-color-teal-6)",
		links: [
			{
				label: "admission",
				route: "/admission",
				icon: IconBed,
			},
			{
				label: "patient",
				route: "/patient",
				icon: IconUser,
			},
			{
				label: "visit",
				route: "/visit",
				icon: IconStethoscope,
			},
		],
	},
	{
		title: "doctorAndDiagnostic",
		icon: IconStethoscope,
		color: "var(--mantine-color-blue-6)",
		links: [
			{
				label: "doctor",
				route: "/doctor",
				icon: IconStethoscope,
			},
			{
				label: "diagnostic",
				route: "/diagnostic",
				icon: IconTestPipe,
			},
			{
				label: "lab",
				route: "/lab",
				icon: IconMicroscope,
			},
		],
	},
	{
		title: "pharmacyAndBilling",
		icon: IconPill,
		color: "var(--mantine-color-orange-6)",
		links: [
			{
				label: "pharmacy",
				route: "/pharmacy",
				icon: IconPill,
			},
			{
				label: "billing",
				route: "/billing",
				icon: IconFileInvoice,
			},
			{
				label: "payment",
				route: "/payment",
				icon: IconCash,
			},
		],
	},
	{
		title: "Core",
		icon: IconShoppingCart,
		color: "var(--mantine-color-cyan-6)",
		links: [
			{
				label: "User",
				route: "/user",
				icon: IconShoppingCart,
			},
			{
				label: "Vendor",
				route: "/core/vendor",
				icon: IconReportMoney,
			},
		],
	},
	{
		title: "inventoryAndPurchase",
		icon: IconShoppingCart,
		color: "var(--mantine-color-cyan-6)",
		links: [
			{
				label: "inventory",
				route: "/inventory",
				icon: IconShoppingCart,
			},
			{
				label: "purchase",
				route: "/purchase",
				icon: IconReportMoney,
			},
		],
	},
	{
		title: "reports",
		icon: IconReport,
		color: "var(--mantine-color-grape-6)",
		links: [
			{
				label: "reports",
				route: "/reports",
				icon: IconReport,
			},
		],
	},
	{
		title: "userAndStaff",
		icon: IconUsers,
		color: "var(--mantine-color-indigo-6)",
		links: [
			{
				label: "users",
				route: "/users",
				icon: IconUsers,
			},
			{
				label: "staff",
				route: "/staff",
				icon: IconUser,
			},
		],
	},
];

export default function SitemapIndex() {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 80;
	const navigate = useNavigate();

	return (
		<Container fluid pt="xs">
			<Group justify="center">
				<Badge variant="filled" size="lg">
					{t("Sitemap")}
				</Badge>
			</Group>
			<Title order={2} className={classes.title} ta="center" my="sm">
				{t("SitemapContent")}
			</Title>
			<ScrollArea h={height} scrollbarSize={2} type="never">
				<SimpleGrid cols={{ base: 1, md: 3, lg: 4 }} spacing="xs">
					{/* =============== render sitemap cards dynamically ================ */}
					{SITEMAP_SECTIONS.map((section, idx) => (
						<Card
							key={section.title}
							shadow="md"
							radius="md"
							className={classes.card}
							padding="lg"
							mih={220}
						>
							<Grid gutter={{ base: 2 }} align="center">
								<Grid.Col span={2}>
									<section.icon
										style={{ width: rem(38), height: rem(38) }}
										stroke={2}
										color={section.color}
									/>
								</Grid.Col>
								<Grid.Col span={10}>
									<Text fz="md" fw={600} className={classes.cardTitle}>
										{t(section.title)}
									</Text>
								</Grid.Col>
							</Grid>
							<Text fz="sm" c="dimmed" mt="sm">
								<List spacing="es" size="sm" center>
									{section.links.map((link) => (
										<List.Item
											key={link.label}
											pl="xs"
											icon={
												<ThemeIcon
													color={section.color}
													size={20}
													radius="xl"
													variant="outline"
												>
													<link.icon />
												</ThemeIcon>
											}
										>
											<NavLink
												pl="xs"
												href={link.route}
												label={t(link.label)}
												component="button"
												fz="sm"
												fw={500}
												onClick={() => navigate(link.route)}
											/>
										</List.Item>
									))}
								</List>
							</Text>
						</Card>
					))}
				</SimpleGrid>
			</ScrollArea>
		</Container>
	);
}
