export const MASTER_DATA_ROUTES = {
	API_ROUTES: {
		TREATMENT_TEMPLATES: {
			INDEX: "hospital/core/treatment",
			CREATE: "hospital/core/particular",
			UPDATE: "hospital/core/particular",
			VIEW: "hospital/core/treatment",
			DELETE: "hospital/core/particular",
			INLINE_UPDATE: "hospital/core/particular",
		},

		OPERATIONAL_API: {
			REFERRED: "hospital/opd/referred",
			PATIENT_SEARCH: "hospital/patient-search",
			ROOM_CABIN: "hospital/room-cabin",
		},

		INVESTIGATION: {
			INDEX: "hospital/core/particular",
			CREATE: "hospital/core/particular",
			UPDATE: "hospital/core/particular",
			VIEW: "hospital/core/particular",
			DELETE: "hospital/core/particular",
		},

		DOSAGE: {
			INDEX: "hospital/core/dosage",
			CREATE: "hospital/core/dosage",
			UPDATE: "hospital/core/dosage",
			VIEW: "hospital/core/dosage",
			DELETE: "hospital/core/dosage",
		},
		REQUISITION: {
			INDEX: "pharmacy/requisition",
			CREATE: "pharmacy/requisition",
			UPDATE: "pharmacy/requisition",
			VIEW: "pharmacy/requisition",
			DELETE: "pharmacy/requisition",
		},

		MEDICINEDOSAGE: {
			INDEX: "hospital/core/medicinedosage",
			CREATE: "hospital/core/medicinedosage",
			UPDATE: "hospital/core/medicinedosage",
			VIEW: "hospital/core/medicinedosage",
			DELETE: "hospital/core/medicinedosage",
		},

		USER: {
			INDEX: "core/user",
			CREATE: "core/user",
			UPDATE: "core/user",
			VIEW: "core/user/view",
			DELETE: "core/user",
		},

		SETTING: {
			INDEX: "core/setting",
			CREATE: "core/setting",
			UPDATE: "core/setting",
			VIEW: "core/setting",
			DELETE: "core/setting",
		},

		STORE: {
			INDEX: "core/warehouse",
			CREATE: "core/warehouse",
			UPDATE: "core/warehouse",
			VIEW: "core/warehouse",
			DELETE: "core/warehouse",
		},

		SELECT_DROPDOWN: {
			PRODUCT_NATURE: "/inventory/select/setting",
			CATEGORY_GROUP: "/inventory/select/group-category",
			CATEGORY: "/inventory/select/category",
		},

		OPD_ROOM: {
			INDEX: "hospital/core/particular",
			CREATE: "hospital/core/particular/create",
			UPDATE: "hospital/core/particular/update",
			VIEW: "hospital/core/particular/view",
			DELETE: "/hospital/core/particular/delete",
		},

		LAB_USER: {
			INDEX: "hospital/core/particular",
			CREATE: "hospital/core/particular",
			UPDATE: "hospital/core/particular",
			VIEW: "hospital/core/particular",
			DELETE: "hospital/core/particular",
		},

		PARTICULAR: {
			INDEX: "hospital/core/particular",
			CREATE: "hospital/core/particular",
			UPDATE: "hospital/core/particular",
			VIEW: "hospital/core/particular",
			DELETE: "hospital/core/particular",
			INLINE_UPDATE: "hospital/core/particular/inline-update",
			ORDERING: "hospital/core/particular/ordering",
		},

		BED: {
			INDEX: "hospital/core/particular",
			CREATE: "hospital/core/particular",
			UPDATE: "hospital/core/particular",
			VIEW: "hospital/core/particular",
			DELETE: "hospital/core/particular",
		},

		DOCTOR: {
			INDEX: "hospital/core/particular",
			CREATE: "hospital/core/particular",
			UPDATE: "hospital/core/particular",
			VIEW: "hospital/core/particular",
			DELETE: "hospital/core/particular",
		},

		NURSE: {
			INDEX: "hospital/core/particular",
			CREATE: "hospital/core/particular",
			UPDATE: "hospital/core/particular",
			VIEW: "hospital/core/particular",
			DELETE: "hospital/core/particular",
		},

		STAFF: {
			INDEX: "hospital/core/particular",
			CREATE: "hospital/core/particular",
			UPDATE: "hospital/core/particular",
			VIEW: "hospital/core/particular",
			DELETE: "hospital/core/particular",
		},

		CABIN: {
			INDEX: "hospital/core/particular",
			CREATE: "hospital/core/particular",
			UPDATE: "hospital/core/particular",
			VIEW: "hospital/core/particular",
			DELETE: "hospital/core/particular",
		},

		PARTICULAR_TYPE: {
			INDEX: "hospital/core/particular-type",
			CREATE: "hospital/core/particular-type",
		},

		PARTICULAR_MATRIX: {
			INDEX: "hospital/mode/matrix",
			ORDERING: "hospital/mode/matrix-ordering",
			INLINE_UPDATE: "hospital/mode/matrix-inline-update",
		},

		PARTICULAR_MODE: {
			INDEX: "hospital/core/particular-mode",
			CREATE: "hospital/core/particular-mode/create",
			UPDATE: "hospital/core/particular-mode/update",
			VIEW: "hospital/core/particular-mode/view",
			DELETE: "hospital/core/particular-mode/delete",
		},

		CATEGORY: {
			INDEX: "hospital/core/category",
			CREATE: "hospital/core/category",
			UPDATE: "hospital/core/category",
			VIEW: "hospital/core/category",
			DELETE: "hospital/core/category",
		},

		INVESTIGATION_REPORT_FORMAT: {
			CREATE: "hospital/core/investigation",
			UPDATE: "hospital/core/investigation",
			DELETE: "hospital/core/investigation",
		},
		TREATMENT_MEDICINE_FORMAT: {
			CREATE: "hospital/core/treatment",
			UPDATE: "hospital/core/treatment",
			DELETE: "hospital/core/treatment",
		},
	},
	NAVIGATION_LINKS: {
		USER: {
			INDEX: "/core/user",
			CREATE: "/core/user",
			UPDATE: "/core/user",
			VIEW: "/core/user",
		},

		STORE: {
			INDEX: "/core/store",
			CREATE: "/core/store",
			UPDATE: "/core/store",
			VIEW: "/core/store",
		},

		SETTING: {
			INDEX: "/core/setting",
			CREATE: "/core/setting",
			UPDATE: "/core/setting",
			VIEW: "/core/setting",
		},

		LAB_USER: {
			INDEX: "/hospital/core/lab",
			CREATE: "/hospital/core/lab/create",
			UPDATE: "/hospital/core/lab",
			VIEW: "/hospital/core/lab/view",
			DELETE: "/hospital/core/lab/delete",
		},

		DOSAGE: {
			INDEX: "/hospital/core/dosage",
			CREATE: "/hospital/core/dosage",
			UPDATE: "/hospital/core/dosage",
			VIEW: "/hospital/core/dosage",
			DELETE: "/hospital/core/dosage",
		},

		PARTICULAR_MATRIX: {
			INDEX: "/hospital/core/particular-matrix",
		},

		TEMPLATE: {
			INDEX: "/hospital/core/template",
			CREATE: "/hospital/core/template/create",
			UPDATE: "/hospital/core/template/update",
			VIEW: "/hospital/core/template/view",
		},

		INVESTIGATION: {
			INDEX: "/hospital/core/investigation",
			CREATE: "/hospital/core/investigation/create",
			UPDATE: "/hospital/core/investigation/update",
			VIEW: "/hospital/core/investigation/view",
			REPORT_FORMAT: "/hospital/core/investigation/report-format",
		},

		PARTICULAR: {
			INDEX: "/hospital/core/particular",
			CREATE: "/hospital/core/particular/create",
			UPDATE: "/hospital/core/particular/update",
			VIEW: "/hospital/core/particular/view",
		},

		ADVICE: {
			INDEX: "/hospital/core/advice",
			CREATE: "/hospital/core/advice/create",
			UPDATE: "/hospital/core/advice/update",
			VIEW: "/hospital/core/advice/view",
		},

		OPD_ROOM: {
			INDEX: "/hospital/core/opd-room",
			CREATE: "/hospital/core/opd-room/create",
			UPDATE: "/hospital/core/opd-room/update",
			VIEW: "/hospital/core/opd-room/view",
		},

		BED: {
			INDEX: "/hospital/core/bed",
			CREATE: "/hospital/core/bed/create",
			UPDATE: "/hospital/core/bed/update",
			VIEW: "/hospital/core/bed/view",
		},

		DOCTOR: {
			INDEX: "/hospital/core/doctor",
			CREATE: "/hospital/core/doctor/create",
			UPDATE: "/hospital/core/doctor/update",
			VIEW: "/hospital/core/doctor/view",
		},

		TREATMENT_TEMPLATES: {
			INDEX: "/hospital/core/treatment-templates",
			CREATE: "/hospital/core/treatment-templates/create",
			UPDATE: "/hospital/core/treatment-templates/update",
			VIEW: "/hospital/core/treatment-templates/view",
			TREATMENT_MEDICINE: "/hospital/core/treatment-templates/treatment-format",
		},

		NURSE: {
			INDEX: "/hospital/core/nurse",
			CREATE: "/hospital/core/nurse/create",
			UPDATE: "/hospital/core/nurse/update",
			VIEW: "/hospital/core/nurse/view",
		},

		STAFF: {
			INDEX: "/hospital/core/staff",
			CREATE: "/hospital/core/staff/create",
			UPDATE: "/hospital/core/staff/update",
			VIEW: "/hospital/core/staff/view",
		},

		CABIN: {
			INDEX: "/hospital/core/cabin",
			CREATE: "/hospital/core/cabin/create",
			UPDATE: "/hospital/core/cabin/update",
			VIEW: "/hospital/core/cabin/view",
		},

		PARTICULAR_MODE: {
			INDEX: "/hospital/core/particular-mode",
			CREATE: "/hospital/core/particular/create",
			UPDATE: "/hospital/core/core/particular",
			VIEW: "/hospital/core/core/particular/view",
			DELETE: "/hospital/core/core/particular/delete",
		},
		PARTICULAR_TYPE: {
			INDEX: "/hospital/core/particular-type",
			CREATE: "/hospital/core/particular/create",
			UPDATE: "/hospital/core/core/particular",
			VIEW: "/hospital/core/core/particular/view",
			DELETE: "/hospital/core/core/particular/delete",
		},
		CATEGORY: {
			INDEX: "/hospital/core/category",
			CREATE: "/hospital/core/category/create",
			UPDATE: "/hospital/core/core/category",
			VIEW: "/hospital/core/core/category/view",
			DELETE: "/hospital/core/core/category/delete",
		},
	},
};

export const PHARMACY_DATA_ROUTES = {
	API_ROUTES: {
		MEDICINE: {
			INDEX: "pharmacy/medicine",
			CREATE: "pharmacy/medicine",
			UPDATE: "pharmacy/medicine",
			VIEW: "pharmacy/medicine",
			DELETE: "pharmacy/medicine",
			INLINE_UPDATE: "pharmacy/medicine/inline-update",
		},
		REQUISITION: {
			INDEX: "pharmacy/requisition",
			CREATE: "pharmacy/requisition/manage",
			UPDATE: "pharmacy/requisition/manage",
			VIEW: "pharmacy/requisition/manage",
			DELETE: "pharmacy/requisition",
		},
		WORKORDER: {
			INDEX: "pharmacy/workorder",
			CREATE: "pharmacy/workorder/manage",
			UPDATE: "pharmacy/workorder/manage",
			VIEW: "pharmacy/workorder/manage",
			DELETE: "pharmacy/workorder",
		},
	},
	NAVIGATION_LINKS: {
		PHARMACY: {
			INDEX: "/pharmacy",
		},
		MEDICINE: {
			INDEX: "/pharmacy/core/medicine",
			CREATE: "/pharmacy/core/medicine",
			UPDATE: "/pharmacy/core/medicine",
			VIEW: "/pharmacy/core/medicine",
			DELETE: "/pharmacy/core/medicine",
		},

		STOCK: {
			INDEX: "/pharmacy/core/stock",
			CREATE: "/pharmacy/core/stock",
			UPDATE: "/pharmacy/core/stock",
			VIEW: "/pharmacy/core/stock",
			DELETE: "/pharmacy/core/stock",
		},

		REQUISITION: {
			INDEX: "/pharmacy/requisition",
			CREATE: "/pharmacy/requisition/manage",
			UPDATE: "/pharmacy/requisition/manage",
			VIEW: "/pharmacy/requisition/manage",
			DELETE: "/pharmacy/requisition",
		},

		WORKORDER: {
			INDEX: "/pharmacy/core/workorder",
			CREATE: "/pharmacy/core/workorder/manage",
			UPDATE: "/pharmacy/core/workorder/manage",
			VIEW: "/pharmacy/core/workorder",
			DELETE: "/pharmacy/core/workorder",
		},
	},
};
export const DOCTOR_DATA_ROUTES = {
	NAVIGATION_LINKS: {
		DOCTOR: {
			DASHBOARD: "/hospital/doctor",
			OPD: "/hospital/doctor/opd",
			OPD_PRESCRIPTION: "/hospital/doctor/ipd-prescription",
			EMERGENCY: "/hospital/doctor/emergency",
			IPD: "/hospital/doctor/ipd",
		},
	},
};
export const CORE_DATA_ROUTES = {
	API_ROUTES: {
		VENDOR: {
			INDEX: "core/vendor",
			CREATE: "core/vendor/create",
			UPDATE: "core/vendor",
			VIEW: "core/vendor/view",
		},
	},
	NAVIGATION_LINKS: {
		VENDOR: {
			INDEX: "/core/vendor",
			CREATE: "/core/vendor/create",
			UPDATE: "/core/vendor",
			VIEW: "/core/vendor/view",
		},
	},
};
export const HOSPITAL_DATA_ROUTES = {
	API_ROUTES: {
		OPD: {
			INDEX: "hospital/opd",
			CREATE: "hospital/opd",
			UPDATE: "hospital/opd",
			VITAL_UPDATE: "hospital/opd/vital-update",
			VIEW: "hospital/opd",
			DELETE: "hospital/opd",
			VISITING_ROOM: "hospital/visiting-room",
		},
		DOCTOR_OPD: {
			INDEX: "hospital/doctor/opd",
			CREATE: "hospital/doctor/opd",
			UPDATE: "hospital/doctor/opd",
			VIEW: "hospital/doctor/opd",
			DELETE: "hospital/doctor/opd",
		},
		DISCHARGE: {
			INDEX: "hospital/discharge",
			CREATE: "hospital/discharge",
			UPDATE: "hospital/discharge",
			VIEW: "hospital/discharge",
			DELETE: "hospital/discharge",
		},
		LOCATIONS: {
			INDEX: "hospital/select/location",
			CREATE: "hospital/select/location",
			UPDATE: "hospital/select/location",
			VIEW: "hospital/select/location",
			DELETE: "hospital/select/location",
		},

		VISIT: {
			INDEX: "core/customer",
			CREATE: "core/customer",
			UPDATE: "core/customer",
			VIEW: "core/customer",
			DELETE: "core/customer",
		},

		BILLING: {
			INDEX: "hospital/billing",
			CREATE: "hospital/billing",
			UPDATE: "hospital/billing",
			VIEW: "hospital/billing",
			DELETE: "hospital/billing",
		},
		FINAL_BILLING: {
			INDEX: "hospital/final-billing",
			CREATE: "hospital/final-billing",
			UPDATE: "hospital/final-billing",
			VIEW: "hospital/final-billing",
			DELETE: "hospital/final-billing",
		},

		PRESCRIPTION: {
			INDEX: "hospital/prescription",
			SEND_TO_PRESCRIPTION: "hospital/send-to-prescription",
			PATIENT_PRESCRIPTION: "hospital/prescription/patient",
			PATIENT_VITAL: "hospital/prescription/vital",
			EDIT: "hospital/prescription",
			CREATE: "hospital/prescription",
			UPDATE: "hospital/prescription",
			VIEW: "hospital/prescription/view",
		},
		ADMISSION: {
			INDEX: "hospital/admission",
			EDIT: "hospital/admission",
			CREATE: "hospital/admission",
			UPDATE: "hospital/admission",
			VIEW: "hospital/admission/view",
		},

		IPD: {
			INDEX: "hospital/ipd",
			CREATE: "hospital/ipd",
			UPDATE: "hospital/ipd",
			VIEW: "hospital/ipd",
			TRANSACTION: "hospital/ipd/transaction",
			PROCESS: "hospital/ipd/data-process",
		},

		EMERGENCY: {
			INDEX: "hospital/opd",
			CREATE: "hospital/opd",
			UPDATE: "hospital/opd",
			VIEW: "hospital/opd",
		},
		PATIENT_VITAL: {
			INDEX: "hospital/opd",
			UPDATE: "hospital/opd/vital",
		},
		CUSTOMER: {
			INDEX: "core/customer",
			CREATE: "core/customer",
			UPDATE: "core/customer",
			DELETE: "core/customer",
		},
		LAB_TEST: {
			INDEX: "hospital/lab-investigation",
			INDEX_REPORTS: "hospital/lab-investigation/test-reports",
			CREATE: "hospital/lab-investigation",
			UPDATE: "hospital/lab-investigation",
			VIEW: "hospital/lab-investigation",
			DELETE: "hospital/lab-investigation",
			PRINT: "hospital/lab-investigation/print",
			INLINE_UPDATE: "hospital/lab-investigation/report/inline-update",
		},
		EPHARMA: {
			INDEX: "hospital/epharma",
			CREATE: "hospital/epharma",
			UPDATE: "hospital/epharma",
			VIEW: "hospital/epharma",
			DELETE: "hospital/epharma",
			INLINE_UPDATE: "hospital/lab-investigation/report/inline-update",
		},
	},
	NAVIGATION_LINKS: {
		VISIT: {
			INDEX: "/hospital/visit",
			CREATE: "/hospital/visit/create",
			UPDATE: "/hospital/visit",
			VIEW: "/hospital/visit/view",
		},
		DOCTOR_OPD: {
			INDEX: "/hospital/doctor/opd",
			CREATE: "/hospital/doctor/opd",
			UPDATE: "/hospital/doctor/opd",
			VIEW: "/hospital/doctor/opd",
			DELETE: "/hospital/doctor/opd",
		},
		DISCHARGE: {
			INDEX: "/hospital/discharge",
			CREATE: "/hospital/discharge",
			UPDATE: "/hospital/discharge",
			VIEW: "/hospital/discharge/view",
		},
		PRESCRIPTION: {
			INDEX: "/hospital/prescription",
			CREATE: "/hospital/prescription/create",
			UPDATE: "/hospital/prescription",
			VIEW: "/hospital/prescription/view",
		},
		ADMISSION: {
			INDEX: "/hospital/admission",
			CREATE: "/hospital/admission/create",
			UPDATE: "/hospital/admission",
			VIEW: "/hospital/admission/view",
			CONFIRM: "/hospital/admission/confirm",
		},
		IPD: {
			INDEX: "/hospital/ipd",
			CREATE: "/hospital/ipd",
			UPDATE: "/hospital/ipd",
			VIEW: "/hospital/ipd",
		},

		IPD_ADMISSION: {
			INDEX: "/hospital/ipd-admission",
			CONFIRM: "/hospital/ipd",
			CREATE: "/hospital/ipd-admission",
			UPDATE: "/hospital/ipd-admission",
			VIEW: "/hospital/ipd-admission",
		},
		IPD_ADMITTED: {
			INDEX: "/hospital/ipd-admitted",
			CREATE: "/hospital/ipd-admitted",
			UPDATE: "/hospital/ipd-admitted",
			VIEW: "/hospital/ipd-admitted",
			IPD_PRESCRIPTION: "/hospital/ipd-admitted/prescription",
		},
		EMERGENCY: {
			INDEX: "/hospital/emergency",
			CREATE: "/hospital/emergency/create",
			UPDATE: "/hospital/emergency",
			VIEW: "/hospital/emergency/view",
		},
		PATIENT_VITAL: {
			INDEX: "/hospital/patient-vital",
			CREATE: "/hospital/emergency/create",
		},
		CUSTOMER: {
			INDEX: "/hospital/customer",
			CREATE: "/hospital/customer",
			UPDATE: "/hospital/customer/edit",
			VIEW: "/hospital/customer/view",
		},

		FREE_PATIENT: {
			INDEX: "/hospital/free-patient",
			UPDATE: "/hospital/free-patient",
			VIEW: "/hospital/free-patient",
		},

		POLICE_CASE: {
			INDEX: "/hospital/police-case",
			UPDATE: "/hospital/police-case",
			VIEW: "/hospital/police-case",
		},

		LAB_TEST: {
			INDEX: "/hospital/lab-test",
			INDEX_REPORTS: "/hospital/lab-test/report",
			CREATE: "/hospital/lab-test",
			UPDATE: "/hospital/lab-test",
			VIEW: "/hospital/lab-test",
		},
		BILLING: {
			INDEX: "/hospital/billing",
			CREATE: "/hospital/billing",
			UPDATE: "/hospital/billing",
			VIEW: "/hospital/billing",
		},
		FINAL_BILLING: {
			INDEX: "/hospital/final-billing",
			CREATE: "/hospital/final-billing",
			UPDATE: "/hospital/final-billing",
			VIEW: "/hospital/final-billing",
		},
		EPHARMA: {
			INDEX: "/hospital/epharma",
			CREATE: "/hospital/epharma",
			UPDATE: "/hospital/epharma",
			VIEW: "/hospital/epharma",
		},
	},
};
export const DOMAIN_DATA_ROUTES = {
	API_ROUTES: {
		DOMAIN: {
			INDEX: "hospital/config",
			CREATE: "domain/config/accounting",
		},
	},
	NAVIGATION_LINKS: {
		DOMAIN: {
			INDEX: "/domain",
		},
	},
};

export const CONFIGURATION_ROUTES = {
	API_ROUTES: {
		HOSPITAL_CONFIG: {
			INDEX: "domain/config/hospital",
			CREATE: "domain/config/hospital",
			UPDATE: "domain/config/hospital",
			DELETE: "domain/config/hospital",
			USER_INFO: "hospital/core/userinfo",
			HEALTH_SHARE: "hospital/core/health-share",
			OPD_DASHBOARD: "hospital/reports/dashboard-daily-summary",
		},
	},
};
