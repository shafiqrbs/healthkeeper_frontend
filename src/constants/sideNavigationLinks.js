import {
	IconDashboard,
	IconIcons,
	IconShoppingBag,
	IconHome,
	IconBuildingHospital,
	IconSettings,
	IconEmergencyBed,
	IconMicroscopeOff,
	IconMedicineSyrup,
} from "@tabler/icons-react";
import { t } from "i18next";
import {
	HOSPITAL_DATA_ROUTES,
	PHARMACY_DATA_ROUTES,
	MASTER_DATA_ROUTES,
	DOCTOR_DATA_ROUTES,
} from "@/constants/routes.js";

export const sideNavigationLinks = {
	base: [
		{
			label: t("Dashboard"),
			path: "/",
			icon: IconHome,
			color: "#4CAF50", // Green
			allowedRoles: [
				"role_domain",
				"admin_administrator",
				"doctor_opd",
				"doctor_opd",
				"doctor_ipd",
				"operator_opd",
				"operator_manager",
				"operator_emergency",
				"doctor_emergency",
				"doctor_ipd_confirm",
			],
		},
		{
			label: t("OPD"),
			path: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.VISIT.INDEX,
			icon: IconBuildingHospital,
			color: "#E91E63", // Pink
			allowedRoles: ["role_domain", "admin_administrator", "operator_opd", "operator_manager"],
		},

		{
			label: t("Emergency"),
			path: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.EMERGENCY.INDEX,
			icon: IconEmergencyBed,
			color: "#F44336", // Red
			allowedRoles: ["role_domain", "admin_administrator", "doctor_emergency", "operator_emergency"],
			subMenu: [
				{
					label: t("Emergency"),
					path: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.EMERGENCY.INDEX,
					icon: IconEmergencyBed,
					color: "#F44336", // Red
					allowedRoles: ["role_domain", "admin_administrator", "doctor_emergency", "operator_emergency"],
				},
				{
					label: t("Vital"),
					path: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.PATIENT_VITAL.INDEX,
					icon: IconEmergencyBed,
					color: "#F44336", // Red
					allowedRoles: ["role_domain", "admin_administrator", "doctor_emergency", "operator_emergency"],
				},
			],
		},
		{
			label: t("Prescription"),
			path: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.PRESCRIPTION.INDEX,
			icon: IconBuildingHospital,
			color: "#9C27B0", // Purple
			allowedRoles: ["role_domain", "admin_administrator", "doctor_opd"],
		},

		{
			label: t("IPD"),
			path: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.BILLING.INDEX,
			icon: IconBuildingHospital,
			color: "#9C27B0", // Purple
			allowedRoles: ["role_domain", "admin_administrator", "admin_doctor"],
			subMenu: [
				{
					label: t("Admission"),
					path: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.IPD_ADMISSION.INDEX,
					icon: IconBuildingHospital,
					color: "#3F51B5", // Indigo
					allowedRoles: ["role_domain", "admin_administrator", "doctor_ipd", "ipd_admission"],
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
					allowedRoles: ["role_domain", "admin_administrator", "doctor_ipd", "nurse_basic", "nurse_incharge"],
				},
			],
		},

		{
			label: t("Billing"),
			path: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.BILLING.INDEX,
			icon: IconBuildingHospital,
			color: "#9C27B0", // Purple
			allowedRoles: ["role_domain", "admin_administrator", "admin_doctor"],
			subMenu: [
				{
					label: t("IPDBilling"),
					path: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.BILLING.INDEX,
					icon: IconDashboard,
					allowedRoles: ["role_domain", "admin_administrator", "admin_doctor"],
				},
				{
					label: t("Refund"),
					path: "/hospital/refund",
					icon: IconBuildingHospital,
					allowedRoles: ["role_domain", "admin_administrator", "admin_doctor"],
				},
				{
					label: t("FinalBilling"),
					path: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.FINAL_BILLING.INDEX,
					icon: IconBuildingHospital,
					allowedRoles: ["role_domain", "admin_administrator", "admin_doctor"],
				},
			],
		},

		{
			label: t("Discharge"),
			path: "/hospital/discharge",
			icon: IconBuildingHospital,
			color: "#795548", // Brown
			allowedRoles: ["role_domain", "admin_administrator", "doctor_ipd"],
		},

		{
			label: t("FreeService"),
			path: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.FREE_PATIENT.INDEX,
			icon: IconBuildingHospital,
			color: "#795548", // Brown
			allowedRoles: ["role_domain", "admin_administrator", "doctor_ipd", "doctor_emergency", "doctor_opd"],
		},

		{
			label: t("PoliceCase"),
			path: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.POLICE_CASE.INDEX,
			icon: IconBuildingHospital,
			color: "#795548", // Brown
			allowedRoles: ["role_domain", "admin_administrator", "doctor_ipd", "doctor_emergency", "doctor_opd"],
		},

		{
			label: t("Lab"),
			path: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.LAB_TEST.INDEX,
			icon: IconMicroscopeOff,
			color: "#9E9D24", // Olive
			allowedRoles: ["doctor_lab", "lab_assistant", "admin_administrator"],
			subMenu: [
				{
					label: t("Lab"),
					path: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.LAB_TEST.INDEX,
					icon: IconMicroscopeOff,
					allowedRoles: ["doctor_lab", "lab_assistant", "admin_administrator"],
				},
				{
					label: t("TestReports"),
					path: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.LAB_TEST.INDEX_REPORTS,
					icon: IconEmergencyBed,
					allowedRoles: ["doctor_lab", "lab_assistant", "admin_administrator"],
				},
			],
		},

		{
			label: t("ePharma"),
			path: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.EPHARMA.INDEX,
			icon: IconEmergencyBed,
			color: "#F44336", // Red
			allowedRoles: ["pharmacy_operator", "pharmacy_pharmacist", "pharmacy_manager", "admin_administrator"],
			subMenu: [
				{
					label: t("Issue"),
					path: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.EPHARMA.ISSUE,
					icon: IconEmergencyBed,
					color: "#F44336", // Red
					allowedRoles: [
						"pharmacy_operator",
						"pharmacy_pharmacist",
						"pharmacy_manager",
						"admin_administrator",
					],
				},
				{
					label: t("ePharma"),
					path: HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.EPHARMA.INDEX,
					icon: IconEmergencyBed,
					color: "#F44336", // Red
					allowedRoles: [
						"pharmacy_operator",
						"pharmacy_pharmacist",
						"pharmacy_manager",
						"admin_administrator",
					],
				},
			],
		},

		{
			label: t("Pharmacy"),
			path: PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.PHARMACY.INDEX,
			icon: IconMedicineSyrup,
			color: "#009688", // Teal
			allowedRoles: ["pharmacy_pharmacist", "pharmacy_manager", "pharmacy_operator", "admin_administrator"],
			subMenu: [
				{
					label: t("Pharmacy"),
					path: PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.PHARMACY.INDEX,
					icon: IconMedicineSyrup,
					color: "#009688", // Teal
				},
				{
					label: t("Stock"),
					path: PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.STOCK.INDEX,
					icon: IconMedicineSyrup,
					color: "#009688", // Teal
				},
				{
					label: t("Requisition"),
					path: PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.REQUISITION.INDEX,
					icon: IconMedicineSyrup,
					color: "#009688", // Teal
				},
				{
					label: t("Workorder"),
					path: PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.WORKORDER.INDEX,
					icon: IconMedicineSyrup,
					color: "#009688", // Teal
				},
				{
					label: t("Medicine"),
					path: PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.MEDICINE.INDEX,
					icon: IconMedicineSyrup,
					color: "#009688", // Teal
				},
				{
					label: t("Generic"),
					path: PHARMACY_DATA_ROUTES.NAVIGATION_LINKS.GENERIC.INDEX,
					icon: IconMedicineSyrup,
					color: "#009688", // Teal
				},
			],
		},
		{
			label: t("Doctor"),
			path: DOCTOR_DATA_ROUTES.NAVIGATION_LINKS.DOCTOR.DASHBOARD,
			icon: IconBuildingHospital,
			color: "#9C27B0", // Purple
			allowedRoles: ["role_domain", "admin_administrator", "admin_doctor"],
			subMenu: [
				{
					label: t("Dashboard"),
					path: DOCTOR_DATA_ROUTES.NAVIGATION_LINKS.DOCTOR.DASHBOARD,
					icon: IconBuildingHospital,
					color: "#9C27B0", // Purple
					allowedRoles: ["role_domain", "admin_administrator", "admin_doctor"],
				},
				{
					label: t("OPD"),
					path: DOCTOR_DATA_ROUTES.NAVIGATION_LINKS.DOCTOR.OPD,
					icon: IconBuildingHospital,
				},
				{
					label: t("Emergency"),
					path: DOCTOR_DATA_ROUTES.NAVIGATION_LINKS.DOCTOR.EMERGENCY,
					icon: IconEmergencyBed,
				},
			],
		},

		{
			label: t("Reports"),
			path: "/hospital/reports",
			icon: IconMedicineSyrup,
			color: "#673AB7", // Deep Purple
			allowedRoles: ["role_domain", "admin_administrator"],
			subMenu: [
				{
					label: t("ReportsSubmenu1"),
					path: "/hospital/reports/overview1",
					icon: IconDashboard,
				},
				{
					label: t("ReportsSubmenu2"),
					path: "/hospital/reports/patients2",
					icon: IconMedicineSyrup,
				},
				{
					label: t("ReportsSubmenu3"),
					path: "/hospital/reports/patients3",
					icon: IconSettings,
				},
			],
		},
		{
			label: t("Admin"),
			path: "/hospital/core/dashboard",
			icon: IconDashboard,
			color: "#607D8B", // Blue Grey
			allowedRoles: ["role_domain", "admin_administrator", "admin_hospital"],
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
			label: t("Dashboard"),
			path: '/hospital/core/dashboard',
			icon: IconDashboard,
			color: "#4CAF50",
			allowedRoles: ["role_domain", "admin_administrator", "admin_hospital"],
		},

		{
			label: t("Investigation"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.INVESTIGATION.INDEX,
			icon: IconDashboard,
			color: "#4CAF50",
			allowedRoles: ["role_domain", "admin_administrator", "admin_hospital"],
		},

		{
			label: t("ManageDoctor"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.DOCTOR.INDEX,
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "admin_administrator", "admin_hospital"],
		},

		{
			label: t("ManageNurse"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.NURSE.INDEX,
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "admin_administrator", "admin_hospital"],
		},

		{
			label: t("ManageLabUser"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.LAB_USER.INDEX,
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "admin_administrator", "admin_hospital"],
		},
		{
			label: t("ManageCabin"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.CABIN.INDEX,
			icon: IconIcons,
			color: "#3F51B5",
			allowedRoles: ["role_domain", "admin_administrator", "admin_hospital"],
		},
		{
			label: t("ManageBed"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.BED.INDEX,
			icon: IconIcons,
			color: "#3F51B5",
			allowedRoles: ["role_domain", "admin_administrator", "admin_hospital"],
		},
		{
			label: t("OPDRoom"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.OPD_ROOM.INDEX,
			icon: IconIcons,
			color: "#3F51B5",
			allowedRoles: ["role_domain", "admin_administrator", "admin_hospital"],
		},
		{
			label: t("ManageAdvice"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.ADVICE.INDEX,
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "admin_administrator", "admin_hospital"],
		},
		{
			label: t("StoreUser"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.STORE_USER.INDEX,
			icon: IconShoppingBag,
			color: "#F59E0B",
			allowedRoles: ["role_domain", "admin_administrator", "admin_hospital"],
		},
		{
			label: t("ManageParticular"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.PARTICULAR.INDEX,
			icon: IconShoppingBag,
			color: "#F59E0B",
			allowedRoles: ["role_domain", "admin_administrator", "admin_hospital"],
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
			allowedRoles: ["role_domain", "admin_administrator", "admin_hospital"],
		},
		{
			label: t("ParticularMatrix"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.PARTICULAR_MATRIX.INDEX,
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "admin_administrator", "admin_hospital"],
		},
		{
			label: t("ManageTemplates"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.TEMPLATE.INDEX,
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "admin_administrator", "admin_hospital"],
		},

		{
			label: t("Dosage"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.DOSAGE.INDEX,
			icon: IconIcons,
			color: "#3F51B5",
			allowedRoles: ["role_domain", "admin_administrator", "admin_hospital"],
		},

		{
			label: t("Users"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.USER.INDEX,
			icon: IconDashboard,
			color: "#4CAF50",
			allowedRoles: ["role_domain", "admin_administrator", "admin_hospital"],
		},
		{
			label: t("Category"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.CATEGORY.INDEX,
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "admin_administrator", "admin_hospital"],
		},
		{
			label: t("Store"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.STORE.INDEX,
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "admin_administrator", "admin_hospital"],
		},
		{
			label: t("TreatmentTemplates"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.TREATMENT_TEMPLATES.INDEX,
			icon: IconDashboard,
			color: "#4CAF50",
			allowedRoles: ["role_domain", "admin_administrator", "admin_hospital"],
		},
		{
			label: t("Setting"),
			path: MASTER_DATA_ROUTES.NAVIGATION_LINKS.SETTING.INDEX,
			icon: IconDashboard,
			color: "#4CAF50",
			allowedRoles: ["role_domain", "admin_administrator", "admin_hospital"],
		},
	],
	baseDoctorSubmenu: [
		{
			label: t("Dashboard"),
			path: DOCTOR_DATA_ROUTES.NAVIGATION_LINKS.DOCTOR.DASHBOARD,
			icon: IconDashboard,
			color: "#4CAF50",
			allowedRoles: ["role_domain", "admin_administrator", "admin_doctor", "admin_hospital"],
		},
		{
			label: t("OPD"),
			path: DOCTOR_DATA_ROUTES.NAVIGATION_LINKS.DOCTOR.OPD,
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "admin_administrator", "admin_doctor", "admin_hospital"],
		},
		{
			label: t("Emergency"),
			path: DOCTOR_DATA_ROUTES.NAVIGATION_LINKS.DOCTOR.EMERGENCY,
			icon: IconDashboard,
			color: "#6f1225",
			allowedRoles: ["role_domain", "admin_administrator", "admin_doctor", "admin_hospital"],
		},
		// {
		// 	label: t("IPD"),
		// 	path: DOCTOR_DATA_ROUTES.NAVIGATION_LINKS.DOCTOR.IPD,
		// 	icon: IconDashboard,
		// 	color: "#6f1225",
		// 	allowedRoles: ["role_domain", "admin_administrator", "admin_doctor", "admin_hospital"],
		// },
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
