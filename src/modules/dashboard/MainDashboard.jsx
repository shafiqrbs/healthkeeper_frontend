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
import pos from "@assets/images/pos/pos.png";
import useAppLocalStore from "@hooks/useAppLocalStore";
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
	const { userRoles } = useAppLocalStore();
	const { t } = useTranslation();
	height = height - 105;
	const navigate = useNavigate();
	const theme = useMantineTheme();

	return (
		<>
			<Container fluid mt={"xs"}>
				Rejected
			</Container>
		</>
	);
}

export default MainDashboard;
