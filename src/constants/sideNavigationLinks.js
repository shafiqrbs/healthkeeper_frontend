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
import { HOSPITAL_DATA_ROUTES, MASTER_DATA_ROUTES } from "@/constants/routes.js";

export const sideNavigationLinks = {
	home: [
		{
			label: "Dashboard",
			path: "/",
			icon: IconHome,
			color: "#4CAF50",
			allowedRoles: ["role_domain", "accounting_admin", "nurse_basic", "doctor_basic"],
		},
		{
			label: "hospitalAndDiagnostic",
			path: "/",
			icon: IconBuildingHospital,
			color: "#6F1126",
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: "VisitList",
			path: "/hospital/visit/list",
			icon: IconBuildingHospital,
			color: "#1D3557",
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: "doctorPrescription",
			path: "/hospital/prescription",
			icon: IconPrescription,
			color: "#B5838D",
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: "Emergency",
			path: "/hospital/emergency",
			icon: IconEmergencyBed,
			color: "#E63946",
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: "Billing",
			path: "/hospital/billing",
			icon: IconBuildingHospital,
			color: "#6D597A",
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: "Lab Test",
			path: "/hospital/lab-test",
			icon: IconMicroscopeOff,
			color: "#457B9D",
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: "Lab Group Test",
			path: "/hospital/lab-group-test",
			icon: IconMicroscopeOff,
			color: "#4b9d45",
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: "Medicine",
			path: "/hospital/medicine",
			icon: IconMedicineSyrup,
			color: "#2A9D8F",
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: "Requisition",
			path: "/hospital/medicine-requisition",
			icon: IconReportMedical,
			color: "#F4A261",
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: "Manage Investigation",
			path: "/hospital/investigation",
			icon: IconBrandVlc,
			color: "#A8DADC",
			allowedRoles: ["role_domain", "accounting_admin"],
		},

		{
			label: "Doctor",
			path: "/hospital/doctor",
			icon: IconStethoscope,
			color: "#1D3557",
			allowedRoles: ["role_domain", "accounting_admin"],
		},
	],
	base: [
		{
			label: t("Dashboard"),
			path: "/",
			icon: IconHome,
			color: "#4CAF50", // Green
			allowedRoles: ["role_domain", "accounting_admin", "nurse_basic", "doctor_basic"],
		},
		{
			label: t("OPD"),
			path: "/hospital/visit",
			icon: IconBuildingHospital,
			color: "#E91E63", // Pink
			allowedRoles: ["role_domain", "accounting_admin", "nurse_basic", "doctor_basic"],
		},
		{
			label: t("Prescription"),
			path: "/hospital/visit/list",
			icon: IconBuildingHospital,
			color: "#9C27B0", // Purple
			allowedRoles: ["role_domain", "accounting_admin", "nurse_basic", "doctor_basic"],
		},
		{
			label: t("Emergency"),
			path: "/hospital/emergency",
			icon: IconEmergencyBed,
			color: "#F44336", // Red
			allowedRoles: ["role_domain", "accounting_admin", "nurse_basic", "doctor_basic"],
		},
		{
			label: t("IPD"),
			path: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.IPD_ADMISSION.INDEX,
			icon: IconBuildingHospital,
			color: "#3F51B5", // Indigo
			allowedRoles: ["role_domain", "accounting_admin", "nurse_basic", "doctor_basic"],
		},
		{
			label: t("IPDConfirm"),
			path: "/hospital/ipd",
			icon: IconBuildingHospital,
			color: "#00BCD4", // Cyan
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: t("Admitted"),
			path: "/hospital/ipd-admitted",
			icon: IconBuildingHospital,
			color: "#00BCD4", // Cyan
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: t("Billing"),
			path: "/hospital/billing",
			icon: IconBuildingHospital,
			color: "#FF9800", // Orange
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: t("Discharge"),
			path: "/hospital/discharge",
			icon: IconBuildingHospital,
			color: "#795548", // Brown
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: t("Refund"),
			path: "/hospital/refund",
			icon: IconBuildingHospital,
			color: "#009688", // Brown
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: t("Lab"),
			path: "/hospital/lab-test",
			icon: IconMicroscopeOff,
			color: "#9E9D24", // Olive
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: t("Medicine"),
			path: "/hospital/medicine",
			icon: IconMedicineSyrup,
			color: "#009688", // Teal
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: t("Reports"),
			path: "/hospital/reports",
			icon: IconMedicineSyrup,
			color: "#673AB7", // Deep Purple
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: t("Admin"),
			path: "/hospital/core/particular",
			icon: IconDashboard,
			color: "#607D8B", // Blue Grey
			allowedRoles: ["role_domain", "accounting_admin", "nurse_basic"],
		},
		{
			label: t("Config"),
			path: "/configuration",
			icon: IconSettings,
			color: "#FF5722", // Deep Orange
			allowedRoles: ["role_domain", "accounting_admin"],
		},
	],
	baseSubmenuIpd: [
		{
			label: t("IPD"),
			path: "/hospital/ipd",
			icon: IconDashboard,
			color: "#4CAF50",
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: t("Admission"),
			path: "/hospital/doctor",
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: t("Discharge"),
			path: "/hospital/nurse",
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: t("Billing"),
			path: "/hospital/doctor",
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "accounting_admin"],
		},
	],
	baseSubmenu: [
		{
			label: t("Investigation"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.INVESTIGATION.INDEX,
			icon: IconDashboard,
			color: "#4CAF50",
			allowedRoles: ["role_domain", "accounting_admin", "nurse_basic"],
		},
		{
			label: t("TreatmentTemplates"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.TREATMENT_TEMPLATES.INDEX,
			icon: IconDashboard,
			color: "#4CAF50",
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: t("ManageDoctor"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.DOCTOR.INDEX,
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "accounting_admin", "doctor_basic"],
		},

		{
			label: t("ManageNurse"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.NURSE.INDEX,
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "accounting_admin", "nurse_basic"],
		},

		{
			label: t("ManageLabUser"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.LAB_USER.INDEX,
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: t("ManageCabin"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.CABIN.INDEX,
			icon: IconIcons,
			color: "#3F51B5",
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: t("ManageBed"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.BED.INDEX,
			icon: IconIcons,
			color: "#3F51B5",
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: t("OPDRoom"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.OPD_ROOM.INDEX,
			icon: IconIcons,
			color: "#3F51B5",
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: t("ManageAdvice"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.ADVICE.INDEX,
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "accounting_admin"],
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
			allowedRoles: ["role_domain", "accounting_admin", "doctor_basic", "nurse_basic"],
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
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: t("Users"),
			path: "/core/user",
			icon: IconDashboard,
			color: "#4CAF50",
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: t("Category"),
			path: "/hospital/core/category",
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: t("Setting"),
			path: "/core/setting",
			icon: IconDashboard,
			color: "#4CAF50",
			allowedRoles: ["role_domain", "accounting_admin"],
		},
	],
	basePharmacySubmenu: [
		{
			label: t("Pharmacy"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.INVESTIGATION.INDEX,
			icon: IconDashboard,
			color: "#4CAF50",
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: t("Stock"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.INVESTIGATION.INDEX,
			icon: IconDashboard,
			color: "#4CAF50",
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: t("Medicine"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.INVESTIGATION.INDEX,
			icon: IconDashboard,
			color: "#4CAF50",
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: t("Requisition"),
			path: "/hospital/doctor",
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "accounting_admin"],
		},
		{
			label: t("Workorder"),
			path: "/hospital/nurse",
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "accounting_admin"],
		},
	],
	baseSubmenuReport: [
		{
			label: t("Overview"),
			path: "/hospital/report/overview",
			icon: IconDashboard,
			color: "#4CAF50",
			allowedRoles: ["role_domain", "accounting_admin"],
		},
	],
};
