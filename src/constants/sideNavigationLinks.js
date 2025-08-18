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
	IconEmergencyBed,
	IconMicroscopeOff,
	IconMedicineSyrup,
	IconStethoscope,
	IconBrandVlc,
	IconReportMedical,
} from "@tabler/icons-react";
import { t } from "i18next";
import { MASTER_DATA_ROUTES } from "@/constants/routes.js";

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
			label: "VisitList",
			path: "/hospital/visit/list",
			icon: IconBuildingHospital,
			color: "#1D3557",
		},
		{
			label: "doctorPrescription",
			path: "/hospital/prescription",
			icon: IconPrescription,
			color: "#B5838D",
		},
		{
			label: "Emergency",
			path: "/hospital/emergency",
			icon: IconEmergencyBed,
			color: "#E63946",
		},
		{
			label: "Billing",
			path: "/hospital/billing",
			icon: IconBuildingHospital,
			color: "#6D597A",
		},
		{
			label: "Lab Test",
			path: "/hospital/lab-test",
			icon: IconMicroscopeOff,
			color: "#457B9D",
		},
		{
			label: "Lab Group Test",
			path: "/hospital/lab-group-test",
			icon: IconMicroscopeOff,
			color: "#4b9d45",
		},
		{
			label: "Medicine",
			path: "/hospital/medicine",
			icon: IconMedicineSyrup,
			color: "#2A9D8F",
		},
		{
			label: "Requisition",
			path: "/hospital/medicine-requisition",
			icon: IconReportMedical,
			color: "#F4A261",
		},
		{
			label: "Manage Investigation",
			path: "/hospital/investigation",
			icon: IconBrandVlc,
			color: "#A8DADC",
		},

		{
			label: "Doctor",
			path: "/hospital/doctor",
			icon: IconStethoscope,
			color: "#1D3557",
		},

		// {
		// 	label: "Accounting",
		// 	path: "/",
		// 	icon: IconFileInvoice,
		// 	color: "#4050B5",
		// },
		// {
		// 	label: "hrPayroll",
		// 	path: "/",
		// 	icon: IconUser,
		// 	color: "#F59E0D",
		// },
		// {
		// 	label: "manageWebsite",
		// 	path: "/",
		// 	icon: IconWorldWww,
		// 	color: "#07B6D4",
		// },
		// {
		// 	label: "media",
		// 	path: "/",
		// 	icon: IconPhoto,
		// 	color: "#11B880",
		// },
		// {
		// 	label: "manageAppearance",
		// 	path: "/",
		// 	icon: IconSettings,
		// 	color: "#1E88E5",
		// },
		// {
		// 	label: "invoiceSmsEmail",
		// 	path: "/",
		// 	icon: IconPhone,
		// 	color: "#4CB050",
		// },
	],

	base: [
		{
			label: t("Dashboard"),
			path: "/",
			icon: IconHome,
			color: "#4CAF50",
		},
		{
			label: t("OPD"),
			path: "/hospital/visit",
			icon: IconBuildingHospital,
			color: "#6F1126",
		},
		{
			label: t("Visited"),
			path: "/hospital/visit/list",
			icon: IconBuildingHospital,
			color: "#6F1126",
		},
		{
			label: t("Emergency"),
			path: "/hospital/emergency",
			icon: IconEmergencyBed,
			color: "#E63946",
		},
		{
			label: t("IPD"),
			path: "/hospital/ipd",
			icon: IconBuildingHospital,
			color: "#1D3557",
		},
		{
			label: t("User"),
			path: "/core/user",
			icon: IconUser,
			color: "#457B9D",
		},
		{
			label: t("Admission"),
			path: "/hospital/ipd/admission",
			icon: IconBuildingHospital,
			color: "#1D3557",
		},
		{
			label: t("Billing"),
			path: "/hospital/billing",
			icon: IconBuildingHospital,
			color: "#6D597A",
		},
		{
			label: t("Lab"),
			path: "/hospital/lab-test",
			icon: IconMicroscopeOff,
			color: "#457B9D",
		},
		{
			label: t("Medicine"),
			path: "/hospital/medicine",
			icon: IconMedicineSyrup,
			color: "#2A9D8F",
		},
		{
			label: t("MasterData"),
			path: "/hospital/core/particular",
			icon: IconDashboard,
			color: "#4CAF50",
		},
		{
			label: t("Configuration"),
			path: "/configuration",
			icon: IconDashboard,
			color: "#4CAF50",
		},
	],
	baseSubmenu: [
		{
			label: t("Investigation"),
			path: "/hospital/investigation",
			icon: IconDashboard,
			color: "#4CAF50",
		},
		{
			label: t("Category"),
			path: "/hospital/ategory",
			icon: IconDashboard,
			color: "#6f1225",
		},
		{
			label: t("Doctor"),
			path: "/hospital/doctor",
			icon: IconDashboard,
			color: "#6f1225",
		},

		{
			label: t("Nurse"),
			path: "/hospital/nurse",
			icon: IconDashboard,
			color: "#6f1225",
		},

		{
			label: t("labUser"),
			path: "/hospital/doctor",
			icon: IconDashboard,
			color: "#6f1225",
		},

		{
			label: t("Particular"),
			path: "/core/user",
			icon: IconCategory,
			color: "#E53935",
		},
		{
			label: t("Cabin"),
			path: "/core/warehouse",
			icon: IconIcons,
			color: "#3F51B5",
		},
		{
			label: t("Ward&Bed"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.BED.INDEX,
			icon: IconIcons,
			color: "#3F51B5",
		},
		{
			label: t("MarketingExecutive"),
			path: "/core/marketing-executive",
			icon: IconShoppingBag,
			color: "#F59E0B",
		},
		{
			label: t("Particular"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.PARTICULAR.INDEX,
			icon: IconShoppingBag,
			color: "#F59E0B",
		},
		{
			label: t("ParticularMode"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.PARTICULAR_MODE.INDEX,
			icon: IconShoppingBag,
			color: "#F59E0B",
		},
		{
			label: t("ParticularType"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.PARTICULAR_TYPE.INDEX,
			icon: IconShoppingBag,
			color: "#F59E0B",
		},
	],
	configSubmenu: [
		{
			label: t("Investigation"),
			path: "/hospital/investigation",
			icon: IconDashboard,
			color: "#4CAF50",
		},
		{
			label: t("Category"),
			path: "/hospital/ategory",
			icon: IconDashboard,
			color: "#6f1225",
		},
		{
			label: t("Doctor"),
			path: "/hospital/doctor",
			icon: IconDashboard,
			color: "#6f1225",
		},

		{
			label: t("Nurse"),
			path: "/hospital/nurse",
			icon: IconDashboard,
			color: "#6f1225",
		},

		{
			label: t("labUser"),
			path: "/hospital/doctor",
			icon: IconDashboard,
			color: "#6f1225",
		},

		{
			label: t("Particular"),
			path: "/core/user",
			icon: IconCategory,
			color: "#E53935",
		},
		{
			label: t("Cabin"),
			path: "/core/warehouse",
			icon: IconIcons,
			color: "#3F51B5",
		},
		{
			label: t("WARD&Romm"),
			path: "/core/warehouse",
			icon: IconIcons,
			color: "#3F51B5",
		},
		{
			label: t("MarketingExecutive"),
			path: "/core/marketing-executive",
			icon: IconShoppingBag,
			color: "#F59E0B",
		},
	],
};
