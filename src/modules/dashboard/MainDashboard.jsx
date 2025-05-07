import React from "react";
import { useNavigate } from "react-router-dom";
import {
	rem,
	Text,
	Card,
	SimpleGrid,
	Container,
	useMantineTheme,
	List,
	ThemeIcon,
	ScrollArea,
	Grid,
	NavLink,
	Box,
	Image,
	Tooltip,
	Title,
	Divider,
} from "@mantine/core";
import {
	IconUsers,
	IconBuildingStore,
	IconBasket,
	IconShoppingBagSearch,
	IconShoppingBagPlus,
	IconMoneybag,
	IconListDetails,
	IconShoppingCart,
	IconShoppingBag,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import classes from "@assets/css/FeaturesCards.module.css";
import useConfigData from "@hooks/config-data/useConfigData.js";
import pos from "@assets/images/pos/pos.png";
import { getUserRole } from "@/common/utils";
import {
	ACCOUNTING_NAV_LINKS,
	CORE_NAV_LINKS,
	CORE_NAV_LINKS2,
	DOMAIN_NAV_LINKS,
	INVENTORY_NAV_LINKS,
	INVENTORY_NAV_LINKS2,
	PROCUREMENT_NAV_LINKS,
	PRODUCTION_NAV_LINKS,
} from "@/constants/mainDashboardLinks";

function NavigationItem({ icon: Icon, href, label, color = "teal.6" }) {
	const { t } = useTranslation();
	const navigate = useNavigate();

	return (
		<List.Item
			pl={"xs"}
			icon={
				<ThemeIcon color={color} size={20} radius="xl" variant="outline">
					<Icon />
				</ThemeIcon>
			}
		>
			<NavLink
				pl="md"
				href={href}
				label={t(label)}
				component="button"
				onClick={() => navigate(href)}
			/>
		</List.Item>
	);
}

function MainDashboard({ height }) {
	const { t } = useTranslation();
	const { configData } = useConfigData();
	const userRole = getUserRole();

	height = height - 105;
	const navigate = useNavigate();
	const theme = useMantineTheme();

	return (
		<>
			<Container fluid mt={"xs"}>
				<SimpleGrid cols={{ base: 1, md: 4 }} spacing="xs" mb={"xs"}>
					<Card shadow="md" radius="md" className={classes.card} padding="lg">
						<Grid gutter={{ base: 2 }}>
							<Grid.Col span={6}>
								<Tooltip
									label={t("PointOfSales")}
									withArrow
									position="top-center"
									bg={`red.4`}
									px={16}
									py={2}
									c={"white"}
									offset={2}
									transitionProps={{
										transition: "pop-bottom-left",
										duration: 500,
									}}
								>
									<Image
										bg={"#905a23"}
										h={60}
										radius="sm"
										src={pos}
										fit="cover"
										w="100%"
										onClick={() => {
											navigate("/pos/bakery");
										}}
										style={{ cursor: "pointer" }}
									/>
								</Tooltip>
							</Grid.Col>
							<Grid.Col span={"6"}>
								<Title order={4} align="center" mt={0} mb={0}>
									{t("Sales")}
								</Title>
								<Divider my={5} />
								<Grid columns={18}>
									<Grid.Col span={8}>
										<Title order={5} align="right" mt={0} mb={0}>
											{configData?.currency?.symbol} 0.00
										</Title>
									</Grid.Col>
									<Grid.Col span={2}>
										<Box
											style={{
												border: "1px solid #e0e0e0",
												height: "100%",
												width: "2px",
											}}
										></Box>
									</Grid.Col>
									<Grid.Col span={8}>
										<Title order={5} align="left" mt={0} mb={0}>
											0
										</Title>
									</Grid.Col>
								</Grid>
							</Grid.Col>
						</Grid>
					</Card>

					{(userRole?.includes("role_accounting") ||
						userRole?.includes("role_domain")) && (
						<Card shadow="md" radius="md" className={classes.card} padding="lg">
							<Grid gutter={{ base: 2 }}>
								<Grid.Col span={2}>
									<IconMoneybag
										style={{ width: rem(42), height: rem(42) }}
										stroke={2}
										color={theme.colors.blue[6]}
									/>
								</Grid.Col>
								<Grid.Col span={10}>
									<Text fz="md" fw={500} className={classes.cardTitle}>
										{t("Accounting")}
									</Text>
								</Grid.Col>
							</Grid>
						</Card>
					)}
					{["role_procurement", "role_domain"].some((value) =>
						userRole?.includes(value)
					) && (
						<Card shadow="md" radius="md" className={classes.card} padding="lg">
							<Grid gutter={{ base: 2 }}>
								<Grid.Col span={2}>
									<IconShoppingCart
										style={{ width: rem(42), height: rem(42) }}
										stroke={2}
										color={theme.colors.blue[6]}
									/>
								</Grid.Col>
								<Grid.Col span={10}>
									<Text fz="md" fw={500} className={classes.cardTitle}>
										{t("Procurement")}
									</Text>
								</Grid.Col>
							</Grid>
						</Card>
					)}
					{["role_inventory", "role_domain"].some((value) =>
						userRole?.includes(value)
					) && (
						<Card shadow="md" radius="md" className={classes.card} padding="lg">
							<Grid gutter={{ base: 2 }}>
								<Grid.Col span={2}>
									<IconMoneybag
										style={{ width: rem(42), height: rem(42) }}
										stroke={2}
										color={theme.colors.orange[6]}
									/>
								</Grid.Col>
								<Grid.Col span={10}>
									<Text fz="md" fw={500} className={classes.cardTitle}>
										{t("InventoryandProduct")}
									</Text>
								</Grid.Col>
							</Grid>
						</Card>
					)}
				</SimpleGrid>
				<ScrollArea h={height} scrollbarSize={2} type="never">
					<SimpleGrid cols={{ base: 1, md: 4 }} spacing="xs">
						{configData?.domain?.modules?.includes("sales-purchase") &&
							["role_sales_purchase", "role_domain"].some((value) =>
								userRole?.includes(value)
							) && (
								<Card shadow="md" radius="md" className={classes.card} padding="lg">
									<Grid gutter={{ base: 2 }}>
										<Grid.Col span={2}>
											<IconBuildingStore
												style={{ width: rem(42), height: rem(42) }}
												stroke={2}
												color={theme.colors.teal[6]}
											/>
										</Grid.Col>
										<Grid.Col span={10}>
											<Text fz="md" fw={500} className={classes.cardTitle}>
												{t("SalesandPurchase")}
											</Text>
										</Grid.Col>
									</Grid>
									<Box fz="sm" c="dimmed" mt="sm">
										<List spacing="ms" size="sm" center>
											<NavigationItem
												icon={IconBasket}
												href="/inventory/sales"
												label={"Sales"}
											/>
											{["role_sales", "role_domain"].some((value) =>
												userRole?.includes(value)
											) && (
												<NavigationItem
													icon={IconShoppingBagSearch}
													href="/inventory/sales-invoice"
													label={"NewSales"}
												/>
											)}
											{["role_purchase", "role_domain"].some((value) =>
												userRole?.includes(value)
											) && (
												<NavigationItem
													icon={IconShoppingBagPlus}
													href="/inventory/purchase"
													label={"Purchase"}
												/>
											)}
											{INVENTORY_NAV_LINKS.map((item, index) => (
												<NavigationItem
													key={index}
													icon={item.icon}
													href={item.href}
													label={item.label}
												/>
											))}
										</List>
									</Box>
								</Card>
							)}

						{configData?.domain?.modules?.includes("accounting") &&
							["role_accounting", "role_domain"].some((value) =>
								userRole?.includes(value)
							) && (
								<Card shadow="md" radius="md" className={classes.card} padding="lg">
									<Grid gutter={{ base: 2 }}>
										<Grid.Col span={2}>
											<IconMoneybag
												style={{ width: rem(42), height: rem(42) }}
												stroke={2}
												color={theme.colors.blue[6]}
											/>
										</Grid.Col>
										<Grid.Col span={10}>
											<Text fz="md" fw={500} className={classes.cardTitle}>
												{t("AccountingandFinancial")}
											</Text>
										</Grid.Col>
									</Grid>
									<Box fz="sm" c="dimmed" mt="sm">
										<List spacing="ms" size="sm" center>
											{["role_accounting"].some((value) =>
												userRole?.includes(value)
											) && (
												<NavigationItem
													color="blue.6"
													icon={IconBasket}
													href="/accounting/voucher-entry"
													label={"VoucherEntryList"}
												/>
											)}
											{ACCOUNTING_NAV_LINKS.map((item, index) => (
												<NavigationItem
													color="blue.6"
													key={index}
													icon={item.icon}
													href={item.href}
													label={item.label}
												/>
											))}
										</List>
									</Box>
								</Card>
							)}
						{configData?.domain?.modules?.includes("procurement") &&
							["role_procurement", "role_domain"].some((value) =>
								userRole?.includes(value)
							) && (
								<Card shadow="md" radius="md" className={classes.card} padding="lg">
									<Grid gutter={{ base: 2 }}>
										<Grid.Col span={2}>
											<IconShoppingCart
												style={{ width: rem(42), height: rem(42) }}
												stroke={2}
												color={theme.colors.blue[6]}
											/>
										</Grid.Col>
										<Grid.Col span={10}>
											<Text fz="md" fw={500} className={classes.cardTitle}>
												{t("Procurement")}
											</Text>
										</Grid.Col>
									</Grid>
									<Box fz="sm" c="dimmed" mt="sm">
										<List spacing="ms" size="sm" center>
											{configData?.child_domain_exists && (
												<NavigationItem
													color="blue.6"
													icon={IconShoppingBag}
													href="/procurement/requisition-board"
													label={t("AllRequisition")}
												/>
											)}

											{PROCUREMENT_NAV_LINKS.map((item, index) => (
												<NavigationItem
													color="blue.6"
													key={index}
													icon={item.icon}
													href={item.href}
													label={item.label}
												/>
											))}
										</List>
									</Box>
								</Card>
							)}
						{configData?.domain?.modules?.includes("inventory") &&
							["role_inventory", "role_domain"].some((value) =>
								userRole.includes(value)
							) && (
								<Card shadow="md" radius="md" className={classes.card} padding="lg">
									<Grid gutter={{ base: 2 }}>
										<Grid.Col span={2}>
											<IconMoneybag
												style={{ width: rem(42), height: rem(42) }}
												stroke={2}
												color={theme.colors.orange[6]}
											/>
										</Grid.Col>
										<Grid.Col span={10}>
											<Text fz="md" fw={500} className={classes.cardTitle}>
												{t("InventoryandProduct")}
											</Text>
										</Grid.Col>
									</Grid>
									<Box fz="sm" c="dimmed" mt="sm">
										<List spacing="ms" size="sm" center>
											{["role_inventory_stock"].some((value) =>
												userRole.includes(value)
											) && (
												<NavigationItem
													color="yellow.6"
													icon={IconListDetails}
													href="/inventory/stock"
													label={t("ManageStock")}
												/>
											)}

											{INVENTORY_NAV_LINKS2.map((item) => (
												<NavigationItem
													color="yellow.6"
													key={item.href}
													icon={item.icon}
													href={item.href}
													label={item.label}
												/>
											))}
										</List>
									</Box>
								</Card>
							)}
						{configData?.domain?.modules?.includes("domain") &&
							["role_domain", "role_core_admin"].some((value) =>
								userRole.includes(value)
							) && (
								<Card shadow="md" radius="md" className={classes.card} padding="lg">
									<Grid gutter={{ base: 2 }}>
										<Grid.Col span={2}>
											<IconMoneybag
												style={{ width: rem(42), height: rem(42) }}
												stroke={2}
												color={theme.colors.blue[6]}
											/>
										</Grid.Col>
										<Grid.Col span={10}>
											<Text fz="md" fw={500} className={classes.cardTitle}>
												{t("ManageDomain")}
											</Text>
										</Grid.Col>
									</Grid>
									<Box fz="sm" c="dimmed" mt="sm">
										<List spacing="ms" size="sm" center>
											{DOMAIN_NAV_LINKS.map((item) => (
												<NavigationItem
													color="blue.6"
													key={item.href}
													icon={item.icon}
													href={item.href}
													label={item.label}
												/>
											))}
										</List>
									</Box>
								</Card>
							)}
						{configData?.domain?.modules?.includes("core") &&
							["role_core", "role_domain"]?.some((value) =>
								userRole.includes(value)
							) && (
								<Card shadow="md" radius="md" className={classes.card} padding="lg">
									<Grid gutter={{ base: 2 }}>
										<Grid.Col span={2}>
											<IconMoneybag
												style={{ width: rem(42), height: rem(42) }}
												stroke={2}
												color={theme.colors.cyan[6]}
											/>
										</Grid.Col>
										<Grid.Col span={10}>
											<Text fz="md" fw={500} className={classes.cardTitle}>
												{t("CustomerAndVendor")}
											</Text>
										</Grid.Col>
									</Grid>
									<Box fz="sm" c="dimmed" mt="sm">
										<List spacing="ms" size="sm" center>
											{CORE_NAV_LINKS.map((item) => (
												<NavigationItem
													color="cyan.6"
													key={item.href}
													icon={item.icon}
													href={item.href}
													label={t(item.label)}
												/>
											))}

											{configData?.sku_warehouse == 1 && (
												<NavigationItem
													color="cyan.6"
													href="/core/warehouse"
													icon={IconUsers}
													label={t("Warehouse")}
												/>
											)}

											{CORE_NAV_LINKS2.map((item) => (
												<NavigationItem
													color="cyan.6"
													key={item.href}
													icon={item.icon}
													href={item.href}
													label={item.label}
												/>
											))}
										</List>
									</Box>
								</Card>
							)}
						{configData?.domain?.modules?.includes("production") &&
							["role_production", "role_domain"].some((value) =>
								userRole.includes(value)
							) && (
								<Card shadow="md" radius="md" className={classes.card} padding="lg">
									<Grid gutter={{ base: 2 }}>
										<Grid.Col span={2}>
											<IconShoppingCart
												style={{ width: rem(42), height: rem(42) }}
												stroke={2}
												color={theme.colors.red[6]}
											/>
										</Grid.Col>
										<Grid.Col span={10}>
											<Text fz="md" fw={500} className={classes.cardTitle}>
												{t("Production")}
											</Text>
										</Grid.Col>
									</Grid>
									<Box fz="sm" c="dimmed" mt="sm">
										<List spacing="ms" size="sm" center>
											{PRODUCTION_NAV_LINKS.map((item) => (
												<NavigationItem
													color="red.6"
													key={item.href}
													icon={item.icon}
													href={item.href}
													label={item.label}
												/>
											))}
										</List>
									</Box>
								</Card>
							)}
					</SimpleGrid>
				</ScrollArea>
			</Container>
		</>
	);
}

export default MainDashboard;
