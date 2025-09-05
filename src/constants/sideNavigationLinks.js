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

	],
	base: [
		{
			label: t("Dashboard"),
			path: "/",
			icon: IconHome,
			color: "#4CAF50", // Green
		},
		{
			label: t("OPD"),
			path: "/hospital/visit",
			icon: IconBuildingHospital,
			color: "#E91E63", // Pink
		},
		{
			label: t("Prescription"),
			path: "/hospital/visit/list",
			icon: IconBuildingHospital,
			color: "#9C27B0", // Purple
		},
		{
			label: t("Emergency"),
			path: "/hospital/emergency",
			icon: IconEmergencyBed,
			color: "#F44336", // Red
		},
		{
			label: t("IPD"),
			path: "/hospital/ipd",
			icon: IconBuildingHospital,
			color: "#3F51B5", // Indigo
		},
		{
			label: t("Admission"),
			path: "/hospital/ipd/admission",
			icon: IconBuildingHospital,
			color: "#00BCD4", // Cyan
		},
		{
			label: t("Billing"),
			path: "/hospital/billing",
			icon: IconBuildingHospital,
			color: "#FF9800", // Orange
		},
		{
			label: t("Discharge"),
			path: "/hospital/discharge",
			icon: IconBuildingHospital,
			color: "#795548", // Brown
		},
		{
			label: t("Refund"),
			path: "/hospital/refund",
			icon: IconBuildingHospital,
			color: "#009688", // Brown
		},
		{
			label: t("Lab"),
			path: "/hospital/lab-test",
			icon: IconMicroscopeOff,
			color: "#9E9D24", // Olive
		},
		{
			label: t("Medicine"),
			path: "/hospital/medicine",
			icon: IconMedicineSyrup,
			color: "#009688", // Teal
		},
		{
			label: t("Reports"),
			path: "/hospital/reports",
			icon: IconMedicineSyrup,
			color: "#673AB7", // Deep Purple
		},
		{
			label: t("Admin"),
			path: "/hospital/core/particular",
			icon: IconDashboard,
			color: "#607D8B", // Blue Grey
		},
		{
			label: t("Config"),
			path: "/configuration",
			icon: IconSettings,
			color: "#FF5722", // Deep Orange
		},
	],
	baseSubmenuIpd: [
		{
			label: t("IPD"),
			path: "/hospital/ipd",
			icon: IconDashboard,
			color: "#4CAF50",
		},
		{
			label: t("Admission"),
			path: "/hospital/doctor",
			icon: IconDashboard,
			color: "#6f1225",
		},
		{
			label: t("Discharge"),
			path: "/hospital/nurse",
			icon: IconDashboard,
			color: "#6f1225",
		},

		{
			label: t("Billing"),
			path: "/hospital/doctor",
			icon: IconDashboard,
			color: "#6f1225",
		},
	],
	baseSubmenu: [
		{
			label: t("Investigation"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.INVESTIGATION.INDEX,
			icon: IconDashboard,
			color: "#4CAF50",
		},


		{
			label: t("ManageDoctor"),
			path: "/hospital/doctor",
			icon: IconDashboard,
			color: "#6f1225",
		},

		{
			label: t("ManageNurse"),
			path: "/hospital/nurse",
			icon: IconDashboard,
			color: "#6f1225",
		},

		{
			label: t("ManageLabUser"),
			path: "/hospital/doctor",
			icon: IconDashboard,
			color: "#6f1225",
		},
		{

			label: t('ManageCabin'),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.CABIN.INDEX,
			icon: IconIcons,
			color: "#3F51B5",
		},
		{

			label: t('ManageBed'),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.BED.INDEX,
			icon: IconIcons,
			color: "#3F51B5",
		},
		{

			label: t('OPDRoom'),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.OPD_ROOM.INDEX,
			icon: IconIcons,
			color: "#3F51B5",
		},
		/*{
			label: t("MarketingExecutive"),
			path: "/core/marketing-executive",
			icon: IconShoppingBag,
			color: "#F59E0B",
		},*/
		{
			label: t("ManageParticular"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.PARTICULAR.INDEX,
			icon: IconShoppingBag,
			color: "#F59E0B",
		},
		/*{
			label: t("ParticularMode"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.PARTICULAR_MODE.INDEX,
			icon: IconShoppingBag,
			color: "#F59E0B",
		},*/
		{
			label: t("ParticularType"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.PARTICULAR_TYPE.INDEX,
			icon: IconShoppingBag,
			color: "#F59E0B",
		},
		{
			label: t("Users"),
			path: "/core/user",
			icon: IconDashboard,
			color: "#4CAF50",
		},
		{
			label: t("Category"),
			path: "/hospital/core/category",
			icon: IconDashboard,
			color: "#6f1225",
		},
		{
			label: t("Setting"),
			path: "/core/setting",
			icon: IconDashboard,
			color: "#4CAF50",
		},
	],
	basePharmacySubmenu: [
		{
			label: t("Pharmacy"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.INVESTIGATION.INDEX,
			icon: IconDashboard,
			color: "#4CAF50",
		},
		{
			label: t("Stock"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.INVESTIGATION.INDEX,
			icon: IconDashboard,
			color: "#4CAF50",
		},
		{
			label: t("Medicine"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.INVESTIGATION.INDEX,
			icon: IconDashboard,
			color: "#4CAF50",
		},
		{
			label: t("Requisition"),
			path: "/hospital/doctor",
			icon: IconDashboard,
			color: "#6f1225",
		},
		{
			label: t("Workorder"),
			path: "/hospital/nurse",
			icon: IconDashboard,
			color: "#6f1225",
		},

	],
	baseSubmenuReport: [
		{
			label: t("Overview"),
			path: "/hospital/report/overview",
			icon: IconDashboard,
			color: "#4CAF50",
		},
	],
};
