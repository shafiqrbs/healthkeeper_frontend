import {
	IconDashboard,
	IconCategory,
	IconIcons,
	IconShoppingBag,
	IconShoppingCart,
	IconHome,
	IconBuildingHospital,
	IconPrescription,
	IconPhoto,
	IconFileInvoice,
	IconUser,
	IconWorldWww,
	IconSettings,
	IconPhone,
} from "@tabler/icons-react";

export const sideNavigationLinks = {
	home: [
		{
			label: "Dashboard",
			path: "/",
			icon: IconHome,
			color: "#4CAF50",
		},
		{
			label: "hospitalAndDiagnostic",
			path: "/",
			icon: IconBuildingHospital,
			color: "#6F1126",
		},
		{
			label: "doctorPrescription",
			path: "/",
			icon: IconPrescription,
			color: "#E53834",
		},
		{
			label: "Accounting",
			path: "/",
			icon: IconFileInvoice,
			color: "#4050B5",
		},
		{
			label: "hrPayroll",
			path: "/",
			icon: IconUser,
			color: "#F59E0D",
		},
		{
			label: "manageWebsite",
			path: "/",
			icon: IconWorldWww,
			color: "#07B6D4",
		},
		{
			label: "media",
			path: "/",
			icon: IconPhoto,
			color: "#11B880",
		},
		{
			label: "manageAppearance",
			path: "/",
			icon: IconSettings,
			color: "#1E88E5",
		},
		{
			label: "invoiceSmsEmail",
			path: "/",
			icon: IconPhone,
			color: "#4CB050",
		},
	],
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
