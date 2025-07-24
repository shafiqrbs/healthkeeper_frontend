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
	useMantineTheme,
	ScrollArea,
	Grid,
	List,
	ThemeIcon,
	NavLink,
} from "@mantine/core";
import {
	IconBuildingStore,
	IconBasket,
	IconShoppingBagSearch,
	IconShoppingBagPlus,
	IconShoppingCartUp,
	IconMoneybag,
	IconUsersGroup,
	IconUsers,
	IconFileTypePdf,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import classes from "../../../assets/css/FeaturesCards.module.css";

function Sitemap() {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 80; //TabList height 104
	const theme = useMantineTheme();
	const navigate = useNavigate();

	return (
		<>
			<Container fluid pt="xs">
				<Group justify="center">
					<Badge variant="filled" size="lg">
						{t("Sitemap")}
					</Badge>
				</Group>
				<Title order={2} className={classes.title} ta="center" mt="sm">
					{t("SitemapContent")}
				</Title>
				<ScrollArea h={height} scrollbarSize={2} type="never">
					<SimpleGrid cols={{ base: 1, md: 4 }} spacing="xs">
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
							<Text fz="sm" c="dimmed" mt="sm">
								<List spacing="ms" size="sm" center>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon color="teal.6" size={20} radius="xl" variant="outline">
												<IconBasket />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="inventory/sales"
											label={t("ManageSales")}
											component="button"
											onClick={() => {
												navigate("/inventory/sales");
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon color="teal.6" size={20} radius="xl" variant="outline">
												<IconShoppingBagSearch />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="inventory/sales-invoice"
											label={t("NewSales")}
											component="button"
											onClick={() => {
												navigate("/inventory/sales");
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon color="teal.6" size={20} radius="xl" variant="outline">
												<IconShoppingBagPlus />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="inventory/purchase"
											label={t("ManagePurchase")}
											component="button"
											onClick={() => {
												navigate("/inventory/sales");
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon color="teal.6" size={20} radius="xl" variant="outline">
												<IconShoppingCartUp />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="inventory/purchase-invoice"
											label={t("NewPurchase")}
											component="button"
											onClick={() => {
												navigate("/inventory/sales");
											}}
										/>
									</List.Item>
								</List>
							</Text>
						</Card>
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
							<Text fz="sm" c="dimmed" mt="sm">
								<List spacing="ms" size="sm" center>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon color="blue.6" size={20} radius="xl" variant="outline">
												<IconBasket />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="accounting/sales"
											label={t("ManageSales")}
											component="button"
											onClick={() => {
												navigate("/inventory/sales");
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon color="blue.6" size={20} radius="xl" variant="outline">
												<IconShoppingBagSearch />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="accounting/sales-invoice"
											label={t("NewSales")}
											component="button"
											onClick={() => {
												navigate("/inventory/sales");
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon color="blue.6" size={20} radius="xl" variant="outline">
												<IconShoppingBagPlus />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="accounting/purchase"
											label={t("ManagePurchase")}
											component="button"
											onClick={() => {
												navigate("/inventory/sales");
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon color="blue.6" size={20} radius="xl" variant="outline">
												<IconShoppingCartUp />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="accounting/purchase-invoice"
											label={t("NewPurchase")}
											component="button"
											onClick={() => {
												navigate("/inventory/sales");
											}}
										/>
									</List.Item>
								</List>
							</Text>
						</Card>
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
							<Text fz="sm" c="dimmed" mt="sm">
								<List spacing="ms" size="sm" center>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon color="yellow.6" size={20} radius="xl" variant="outline">
												<IconBasket />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="accounting/sales"
											label={t("ManageProduct")}
											component="button"
											onClick={() => {
												navigate("/inventory/sales");
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon color="yellow.6" size={20} radius="xl" variant="outline">
												<IconShoppingBagSearch />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="accounting/sales-invoice"
											label={t("Category")}
											component="button"
											onClick={() => {
												navigate("/inventory/sales");
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon color="yellow.6" size={20} radius="xl" variant="outline">
												<IconShoppingBagPlus />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="accounting/purchase"
											label={t("CategoryGroup")}
											component="button"
											onClick={() => {
												navigate("/inventory/sales");
											}}
										/>
									</List.Item>
								</List>
							</Text>
						</Card>
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
							<Text fz="sm" c="dimmed" mt="sm">
								<List spacing="ms" size="sm" center>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon color="cyan.6" size={20} radius="xl" variant="outline">
												<IconUsersGroup />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="accounting/sales"
											label={t("ManageCustomers")}
											component="button"
											onClick={() => {
												navigate("/inventory/sales");
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon color="cyan.6" size={20} radius="xl" variant="outline">
												<IconUsersGroup />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="accounting/sales-invoice"
											label={t("ManageVendors")}
											component="button"
											onClick={() => {
												navigate("/inventory/sales");
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon color="cyan.6" size={20} radius="xl" variant="outline">
												<IconUsers />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="accounting/purchase"
											label={t("ManageUsers")}
											component="button"
											onClick={() => {
												navigate("/inventory/sales");
											}}
										/>
									</List.Item>
								</List>
							</Text>
						</Card>
						<Card shadow="md" radius="md" className={classes.card} padding="lg">
							<Grid gutter={{ base: 2 }}>
								<Grid.Col span={2}>
									<IconFileTypePdf
										style={{ width: rem(42), height: rem(42) }}
										stroke={2}
										color={theme.colors.teal[6]}
									/>
								</Grid.Col>
								<Grid.Col span={10}>
									<Text fz="md" fw={500} className={classes.cardTitle}>
										{t("Reporting")}
									</Text>
								</Grid.Col>
							</Grid>
							<Text fz="sm" c="dimmed" mt="sm">
								<List spacing="ms" size="sm" center>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon color="teal.6" size={20} radius="xl" variant="outline">
												<IconFileTypePdf />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="inventory/sales"
											label={t("GenerateReport")}
											component="button"
											onClick={() => navigate("/reporting/reports")}
										/>
									</List.Item>
								</List>
							</Text>
						</Card>
					</SimpleGrid>
				</ScrollArea>
			</Container>
		</>
	);
}
export default Sitemap;
