import {
	IconDashboard,
	IconCategory,
	IconIcons,
	IconShoppingBag,
	IconShoppingCart,
} from "@tabler/icons-react";

export const sideNavigationLinks = {
	base: [
		{
			label: "Customer",
			path: "/core/customer",
			icon: IconDashboard,
			color: "#4CAF50",
		},
		{
			label: "Vendor",
			path: "/core/vendor",
			icon: IconDashboard,
			color: "#6f1225",
		},
		{
			label: "User",
			path: "/core/user",
			icon: IconCategory,
			color: "#E53935",
		},
		{
			label: "Warehouse",
			path: "/core/warehouse",
			icon: IconIcons,
			color: "#3F51B5",
		},
		{
			label: "MarketingExecutive",
			path: "/core/marketing-executive",
			icon: IconShoppingBag,
			color: "#F59E0B",
		},
		{
			label: "Setting",
			path: "/core/setting",
			icon: IconShoppingCart,
			color: "#06B6D4",
		},
	],
};
