import {
	IconDashboard,
	IconIcons,
	IconShoppingBag,
	IconHome,
	IconBuildingHospital,
	IconPrescription,
	IconSettings,
	IconEmergencyBed,
	IconMicroscopeOff,
	IconMedicineSyrup,
	IconStethoscope,
	IconBrandVlc,
	IconReportMedical,
} from "@tabler/icons-react";
import { t } from "i18next";
import { HOSPITAL_DATA_ROUTES, PHARMACY_DATA_ROUTES, MASTER_DATA_ROUTES,DOCTOR_DATA_ROUTES } from "@/constants/routes.js";

export const sideNavigationLinks = {
	base: [
		{
			label: t("Dashboard"),
			path: "/",
			icon: IconHome,
			color: "#4CAF50", // Green
			allowedRoles: ["role_domain", "admin_administrator", "doctor_opd", "doctor_ipd"],
		},
		{
			label: t("OPD"),
			path: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.VISIT.INDEX,
			icon: IconBuildingHospital,
			color: "#E91E63", // Pink
			allowedRoles: ["role_domain", "admin_administrator","operator_opd","operator_manager"],
		},
		{
			label: t("Prescription"),
			path: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.PRESCRIPTION.INDEX,
			icon: IconBuildingHospital,
			color: "#9C27B0", // Purple
			allowedRoles: ["role_domain", "admin_administrator", "doctor_opd"],
		},
		{
			label: t("Doctor"),
			path: DOCTOR_DATA_ROUTES.NAVIGATION_LINKS.DOCTOR.DASHBOARD,
			icon: IconBuildingHospital,
			color: "#9C27B0", // Purple
			allowedRoles: ["role_domain", "admin_administrator", "doctor_admin"],
		},
		{
			label: t("Emergency"),
			path: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.EMERGENCY.INDEX,
			icon: IconEmergencyBed,
			color: "#F44336", // Red
			allowedRoles: ["role_domain", "admin_administrator", "doctor_emergency"],
		},
		{
			label: t("IPD"),
			path: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.IPD_ADMISSION.INDEX,
			icon: IconBuildingHospital,
			color: "#3F51B5", // Indigo
			allowedRoles: ["role_domain", "admin_administrator","doctor_ipd"],
		},
		{
			label: t("IPDConfirm"),
			path: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.IPD_ADMISSION.CONFIRM,
			icon: IconBuildingHospital,
			color: "#00BCD4", // Cyan
			allowedRoles: ["role_domain", "admin_administrator", "doctor_ipd_confirm"],
		},
		{
			label: t("Admitted"),
			path: "/hospital/ipd-admitted",
			icon: IconBuildingHospital,
			color: "#00BCD4", // Cyan
			allowedRoles: ["role_domain", "admin_administrator"],
		},
		{
			label: t("Billing"),
			path: "/hospital/billing",
			icon: IconBuildingHospital,
			color: "#FF9800", // Orange
			allowedRoles: ["role_domain", "admin_administrator"],
		},
		{
			label: t("Discharge"),
			path: "/hospital/discharge",
			icon: IconBuildingHospital,
			color: "#795548", // Brown
			allowedRoles: ["role_domain", "admin_administrator"],
		},
		{
			label: t("Refund"),
			path: "/hospital/refund",
			icon: IconBuildingHospital,
			color: "#009688", // Brown
			allowedRoles: ["role_domain", "admin_administrator"],
		},
		{
			label: t("Lab"),
			path: "/hospital/lab-test",
			icon: IconMicroscopeOff,
			color: "#9E9D24", // Olive
			allowedRoles: ["role_domain", "admin_administrator"],
		},
		{
			label: t("Pharmacy"),
			path: PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.PHARMACY.INDEX,
			icon: IconMedicineSyrup,
			color: "#009688", // Teal
			allowedRoles: ["role_domain", "admin_administrator"],
		},
		{
			label: t("Reports"),
			path: "/hospital/reports",
			icon: IconMedicineSyrup,
			color: "#673AB7", // Deep Purple
			allowedRoles: ["role_domain", "admin_administrator"],
		},
		{
			label: t("Admin"),
			path: "/hospital/core/particular",
			icon: IconDashboard,
			color: "#607D8B", // Blue Grey
			allowedRoles: ["role_domain", "admin_administrator", "nurse_basic"],
		},
		{
			label: t("Config"),
			path: "/configuration",
			icon: IconSettings,
			color: "#FF5722", // Deep Orange
			allowedRoles: ["role_domain", "admin_administrator"],
		},
	],
	baseSubmenuIpd: [
		{
			label: t("IPD"),
			path: "/hospital/ipd",
			icon: IconDashboard,
			color: "#4CAF50",
			allowedRoles: ["role_domain", "admin_administrator"],
		},
		{
			label: t("Admission"),
			path: "/hospital/doctor",
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "admin_administrator"],
		},
		{
			label: t("Discharge"),
			path: "/hospital/nurse",
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "admin_administrator"],
		},
		{
			label: t("Billing"),
			path: "/hospital/doctor",
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "admin_administrator"],
		},
	],
	baseSubmenu: [
		{
			label: t("Investigation"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.INVESTIGATION.INDEX,
			icon: IconDashboard,
			color: "#4CAF50",
			allowedRoles: ["role_domain", "admin_administrator", "nurse_basic"],
		},

		{
			label: t("ManageDoctor"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.DOCTOR.INDEX,
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "admin_administrator", "doctor_basic"],
		},

		{
			label: t("ManageNurse"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.NURSE.INDEX,
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "admin_administrator", "nurse_basic"],
		},

		{
			label: t("ManageLabUser"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.LAB_USER.INDEX,
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "admin_administrator"],
		},
		{
			label: t("ManageCabin"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.CABIN.INDEX,
			icon: IconIcons,
			color: "#3F51B5",
			allowedRoles: ["role_domain", "admin_administrator"],
		},
		{
			label: t("ManageBed"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.BED.INDEX,
			icon: IconIcons,
			color: "#3F51B5",
			allowedRoles: ["role_domain", "admin_administrator"],
		},
		{
			label: t("OPDRoom"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.OPD_ROOM.INDEX,
			icon: IconIcons,
			color: "#3F51B5",
			allowedRoles: ["role_domain", "admin_administrator"],
		},
		{
			label: t("ManageAdvice"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.ADVICE.INDEX,
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "admin_administrator"],
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
			allowedRoles: ["role_domain", "admin_administrator", "doctor_basic", "nurse_basic"],
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
			allowedRoles: ["role_domain", "admin_administrator"],
		},
		{
			label: t("ParticularMatrix"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.PARTICULAR_MATRIX.INDEX,
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "admin_administrator"],
		},
		{
			label: t("ManageTemplates"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.TEMPLATE.INDEX,
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "admin_administrator"],
		},

		{
			label: t("Users"),
			path: "/core/user",
			icon: IconDashboard,
			color: "#4CAF50",
			allowedRoles: ["role_domain", "admin_administrator"],
		},
		{
			label: t("Category"),
			path: "/hospital/core/category",
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "admin_administrator"],
		},
		{
			label: t("TreatmentTemplates"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.TREATMENT_TEMPLATES.INDEX,
			icon: IconDashboard,
			color: "#4CAF50",
			allowedRoles: ["role_domain", "admin_administrator"],
		},
		{
			label: t("Setting"),
			path: "/core/setting",
			icon: IconDashboard,
			color: "#4CAF50",
			allowedRoles: ["role_domain", "admin_administrator"],
		},
	],
	basePharmacySubmenu: [
		{
			label: t("Pharmacy"),
			path: PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.PHARMACY.INDEX,
			icon: IconDashboard,
			color: "#4CAF50",
			allowedRoles: ["role_domain", "admin_administrator"],
		},
		{
			label: t("Stock"),
			path: PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.STOCK.INDEX,
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "admin_administrator"],
		},
		{
			label: t("Requisition"),
			path: PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.REQUISITION.INDEX,
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "admin_administrator"],
		},
		{
			label: t("Workorder"),
			path: PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.REQUISITION.INDEX,
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "admin_administrator"],
		},
	],
	baseDoctorSubmenu: [
		{
			label: t("Dashboard"),
			path: DOCTOR_DATA_ROUTES.NAVIGATION_LINKS.DOCTOR.DASHBOARD,
			icon: IconDashboard,
			color: "#4CAF50",
			allowedRoles: ["role_domain", "admin_administrator","doctor_admin"],
		},
		{
			label: t("OPD"),
			path: DOCTOR_DATA_ROUTES.NAVIGATION_LINKS.DOCTOR.OPD,
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "admin_administrator","doctor_admin"],
		},
		{
			label: t("Emergency"),
			path: DOCTOR_DATA_ROUTES.NAVIGATION_LINKS.DOCTOR.EMERGENCY,
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "admin_administrator","doctor_admin"],
		},
		{
			label: t("IPD"),
			path: DOCTOR_DATA_ROUTES.NAVIGATION_LINKS.DOCTOR.IPD,
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "admin_administrator","doctor_admin"],
		},

	],
	baseSubmenuReport: [
		{
			label: t("Overview"),
			path: "/hospital/report/overview",
			icon: IconDashboard,
			color: "#4CAF50",
			allowedRoles: ["role_domain", "admin_administrator"],
		},
	],
};
