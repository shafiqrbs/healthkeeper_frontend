export const MASTER_DATA_ROUTES = {
	API_ROUTES: {
		TREATMENT_TEMPLATES: {
			INDEX: "hospital/core/treatment",
			INDEX_USER: "hospital/core/treatment-user",
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
			RESET_PASSWORD: "core/user/reset-password",
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

		STORE_USER: {
			INDEX: "hospital/core/store-user",
			INLINE_UPDATE: "hospital/core/store-user/inline-update",
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
			INDEX_RXEMERGENCY: "hospital/core/particular/rxemergency",
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
			CREATE: "hospital/core/particular-mode",
			UPDATE: "hospital/core/particular-mode",
			VIEW: "hospital/core/particular-mode",
			DELETE: "hospital/core/particular-mode",
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
		MANAGE_FILE: {
			INDEX: "core/file-upload",
			CREATE: "core/file-upload/store",
			UPDATE: "core/file",
			VIEW: "core/file",
			DELETE: "core/file-upload",
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

		STORE_USER: {
			INDEX: "/hospital/core/store-user",
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
		REPORT: {
			MEDICINE_ISSUE_REPORT: "pharmacy/medicine-issue-report",
			STOCK_SUMMERY_REPORT: "pharmacy/medicine-summery-report",
		},
		STOCK: {
			MEDICINE_STOCK_DROPDOWN: "medicine/select/stock",
			GENERIC_STOCK_DROPDOWN: "hospital/select/medicine-stock",
			PHARMACY_STOCK_HISTORY: "pharmacy/stock-item/history",
			INDEX: "pharmacy/stock",
			STOCK_MATRIX: "pharmacy/stock-item/matrix",
			INDEX_CATEGORY: "pharmacy/stock/category",
			INDEX_CATEGORY_SCROLLING: "pharmacy/stock/category/scrolling",
			INDEX_CATEGORY_SCROLLING_WORKORDER: "pharmacy/stock/category/scrolling/workorder",
			GENERIC: "pharmacy/stock/generic",
			CREATE: "pharmacy/stock",
			UPDATE: "pharmacy/stock",
			VIEW: "pharmacy/stock",
			DELETE: "pharmacy/stock",
			INLINE_UPDATE: "pharmacy/stock/inline-update",
		},

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
			CREATE: "pharmacy/requisition",
			UPDATE: "pharmacy/requisition",
			VIEW: "pharmacy/requisition",
			DELETE: "pharmacy/requisition",
		},

		DISPENSE: {
			STOCK_ITEM: "pharmacy/dispense/stock-item",
			APPROVE: "pharmacy/dispense/approve",
			INDEX: "pharmacy/dispense",
			CREATE: "pharmacy/dispense",
			UPDATE: "pharmacy/dispense",
			VIEW: "pharmacy/dispense",
			DELETE: "pharmacy/dispense",
		},

		PURCHASE: {
			CREATE: "pharmacy/purchase",
			INDEX: "pharmacy/purchase",
			UPDATE: "pharmacy/purchase",
			VIEW: "pharmacy/purchase",
			DELETE: "pharmacy/purchase",
			APPROVE: "pharmacy/purchase/approve",
			RECEIVE: "pharmacy/purchase/receive",
		},

		STOCK_TRANSFER: {
			CREATE: "pharmacy/stock-transfer",
			INDEX: "pharmacy/stock-transfer",
			INDEX_CENTRAL: "pharmacy/stock-transfer/central-index",
			UPDATE: "pharmacy/stock-transfer",
			INLINE_UPDATE: "pharmacy/stock-transfer/inline-update",
			VIEW: "pharmacy/stock-transfer",
			DELETE: "pharmacy/stock-transfer",
			APPROVE: "pharmacy/stock-transfer/approve",
			RECEIVE: "pharmacy/stock-transfer/receive",
		},

		STORE_INDENT: {
			INDEX: "pharmacy/stock-transfer",
			UPDATE: "pharmacy/stock-transfer",
			VIEW: "pharmacy/stock-transfer",
			ISSUE: "pharmacy/stock-transfer/issue",
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
		MANAGE_FILE: {
			INDEX: "/core/file",
			CREATE: "core/file",
			UPDATE: "core/file",
			VIEW: "core/file",
			DELETE: "core/file",
		},

		GENERIC: {
			INDEX: "/pharmacy/core/generic",
			CREATE: "/pharmacy/core/generic",
			UPDATE: "/pharmacy/core/generic",
			VIEW: "/pharmacy/core/generic",
			DELETE: "/pharmacy/core/generic",
		},

		STOCK: {
			INDEX: "/pharmacy/core/stock",
			GENERIC: "/pharmacy/core/stock/generic",
			CREATE: "/pharmacy/core/stock",
			UPDATE: "/pharmacy/core/stock",
			VIEW: "/pharmacy/core/stock",
			DELETE: "/pharmacy/core/stock",
		},

		STORE_STOCK: {
			INDEX: "/store/stock",
		},

		REQUISITION: {
			INDEX: "/store/requisition",
			CREATE: "/store/requisition/manage",
			UPDATE: "/store/requisition/manage",
			VIEW: "/store/requisition/manage",
			DELETE: "/store/requisition",
		},

		STORE_INDENT: {
			INDEX: "/pharmacy/core/store-indent",
			UPDATE: "/pharmacy/core/store-indent",
			VIEW: "/pharmacy/core/store-indent",
			ISSUE: "/pharmacy/core/store-indent/issue",
		},

		WORKORDER: {
			INDEX: "/pharmacy/core/workorder",
			CREATE: "/pharmacy/core/workorder/manage",
			UPDATE: "/pharmacy/core/workorder/manage",
			VIEW: "/pharmacy/core/workorder",
			DELETE: "/pharmacy/core/workorder",
		},

		DISPENSE: {
			INDEX: "/pharmacy/core/dispense",
			CREATE: "/pharmacy/core/dispense/manage",
			UPDATE: "/pharmacy/core/dispense/manage",
			VIEW: "/pharmacy/core/dispense",
			DELETE: "/pharmacy/core/dispense",
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
			POLICE_CASE_CREATE: "hospital/opd/police-case",
			VIEW: "hospital/opd",
			DELETE: "hospital/opd",
			VISITING_ROOM: "hospital/visiting-room",
			DOCTOR_ROOM: "hospital/doctor-room",
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
			PRINT: "hospital/billing/print",
			DELETE: "hospital/billing",
		},

		REFUND: {
			INDEX: "hospital/refund",
			CREATE: "hospital/refund",
			UPDATE: "hospital/refund",
			VIEW: "hospital/refund",
			DELETE: "hospital/refund",
			PAYMENT: "hospital/refund",
			PRINT: "hospital/refund/print",
		},

		REFUND_HISTORY: {
			INDEX: "hospital/refund-history",
			CREATE: "hospital/refund-history",
			UPDATE: "hospital/refund-history",
			VIEW: "hospital/refund-history",
			DELETE: "hospital/refund-history",
			APPROVE: "hospital/refund-history/approve",
			PRINT: "hospital/refund-history/print",
			IPD_PRINT: "hospital/refund-history/ipd-print",
		},

		PATIENT_WAIVER: {
			INDEX: "hospital/patient-waiver",
			INVOICE: "hospital/patient-waiver/invoice",
			CREATE: "hospital/patient-waiver",
			UPDATE: "hospital/patient-waiver",
			VIEW: "hospital/patient-waiver/details",
			PROCESS: "hospital/patient-waiver/process",
			APPROVE: "hospital/patient-waiver/approve",
			PRINT: "hospital/patient-waiver/print",
			DELETE: "hospital/patient-waiver",
		},

		FINAL_BILLING: {
			INDEX: "hospital/billing/final-bill",
			VIEW: "hospital/billing",
			PROCESS: "hospital/billing/final-bill-process",
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
			INDEX_CONFIRM: "hospital/ipd/admission/confirm",
			EDIT: "hospital/admission",
			CREATE: "hospital/admission",
			UPDATE: "hospital/admission",
			VIEW: "hospital/admission/view",
		},
		BED_CABIN: {
			INDEX: "hospital/bed-cabin",
		},
		IPD: {
			INDEX: "hospital/ipd",
			CREATE: "hospital/ipd",
			UPDATE: "hospital/ipd",
			VIEW: "hospital/ipd",
			ADMISSION_VIEW: "hospital/ipd/view",
			REVISED: "hospital/ipd/revised",
			CHANGE: "hospital/ipd/change",
			TRANSACTION: "hospital/ipd/transaction",
			PROCESS: "hospital/ipd/data-process",
			EFRESH_ORDER: "hospital/ipd/efresh-order",
			PATIENT_CHART: "hospital/ipd/patient-chart",
			RELEASE: "hospital/ipd/release",
			INTERNAL_TRANSFER: "hospital/ipd/internal-transfer",
			INTERNAL_TRANSFER_PROCESS: "hospital/ipd/internal-transfer-process",
			MEDICINE_UPDATE: "hospital/ipdprescription",
			MEDICINE_TEMPLATE: "hospital/ipdprescription/template",
			INLINE_UPDATE: "hospital/ipdprescription/inline-update",
			MEDICINE_REORDER: "hospital/ipdprescription/ordering",
			TEMPLATE_UPDATE: "hospital/ipdprescription/update-template",
			MEDICINE_DELETE: "hospital/ipdprescription/medicine-delete",
			PRESCRIPTION: "hospital/ipdprescription",
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
			TAG_PRINT: "hospital/lab-investigation/sample-confirm",
			CATEGORY_GROUP: "hospital/lab-investigation/category-group",
			INLINE_UPDATE: "hospital/lab-investigation/report/inline-update",
		},

		LAB_GROUP_TEST: {
			INDEX: "hospital/lab-group-report",
			CREATE: "hospital/lab-group-report",
			UPDATE: "hospital/lab-group-report",
			VIEW: "hospital/lab-group-report",
			DELETE: "hospital/lab-group-report",
			PRINT: "hospital/lab-group-report/print",
			TAG_PRINT: "hospital/lab-group-report/sample-confirm",
			INLINE_UPDATE: "hospital/lab-group-report/report/inline-update",
		},

		EPHARMA: {
			INDEX: "hospital/epharma",
			CREATE: "hospital/epharma",
			UPDATE: "hospital/epharma",
			VIEW: "hospital/epharma",
			DELETE: "hospital/epharma",
			INLINE_UPDATE: "hospital/lab-investigation/report/inline-update",
		},
		REPORT_MASTERDATA: {
			REPORT_USERS: "hospital/reports/master-data-users",
			DASHBOARD_DAILY_SUMMARY: "hospital/reports/dashboard-daily-summary",
		},
		REPORT: {
			PATIENT_TICKET: "hospital/reports/patient-ticket",
			DASHBOARD_DAILY_SUMMARY: "hospital/reports/dashboard-daily-summary",
			DAILY_COLLECTIION_SERVICE: "hospital/reports/daily-collection-service-report",
			DAILY_OPD_EMERGENCY_IPD: "hospital/reports/daily-opd-emergency-ipd-report",
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

		PATIENT_ARCHIVE: {
			INDEX: "/hospital/patient-archive",
			VIEW: "/hospital/patient-archive/view",
		},

		PRESCRIPTION: {
			INDEX: "/hospital/prescription",
			INDEX_BOARD: "/hospital/prescription-board",
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
			BED_CABIN: "/hospital/bed-cabin",
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
			ROOM: "/hospital/ipd-admission/room-cabin",
		},

		IPD_ADMITTED: {
			INDEX: "/hospital/ipd-admitted",
			CREATE: "/hospital/ipd-admitted",
			UPDATE: "/hospital/ipd-admitted",
			VIEW: "/hospital/ipd-admitted",
			IPD_PRESCRIPTION: "/hospital/ipd-admitted/prescription",
			MANAGE: "/hospital/ipd-admitted/manage",
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

		PATIENT_WAIVER: {
			INDEX: "/hospital/patient-waiver",
			LIST: "/hospital/patient-waiver/list",
			UPDATE: "/hospital/patient-waiver",
			PROCESS: "/hospital/patient-waiver",
			VIEW: "/hospital/patient-waiver",
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
			CATEGORY_GROUP: "/hospital/lab-test/category-group",
		},

		LAB_GROUP_TEST: {
			INDEX: "/hospital/lab-group-report",
			CREATE: "/hospital/lab-group-report",
			UPDATE: "/hospital/lab-group-report",
			VIEW: "/hospital/lab-group-report",
		},
		BED_CABIN: {
			INDEX: "/hospital/bed-cabin",
		},
		BILLING: {
			INDEX: "/hospital/billing",
			CREATE: "/hospital/billing",
			UPDATE: "/hospital/billing",
			VIEW: "/hospital/billing",
		},
		IPD_BILLING: {
			INDEX: "/hospital/billing-ipd",
			CREATE: "/hospital/billing-ipd",
			UPDATE: "/hospital/billing-ipd",
			VIEW: "/hospital/billing-ipd",
		},
		ADMISSION_BILLING: {
			INDEX: "/hospital/billing-admission",
			CREATE: "/hospital/billing-admission",
			UPDATE: "/hospital/billing-admission",
			VIEW: "/hospital/billing-admission",
		},
		REFUND: {
			INDEX: "/hospital/refund",
			CREATE: "/hospital/refund",
			UPDATE: "/hospital/refund",
			VIEW: "/hospital/refund",
		},

		REFUND_HISTORY: {
			INDEX: "/hospital/refund-history",
			VIEW: "/hospital/refund-history",
			IPD: "/hospital/refund-ipd-history",
			IPD_VIEW: "/hospital/refund-ipd-history",
			CONFIRM: "/hospital/refund-confirm",
		},

		FINAL_BILLING: {
			INDEX: "/hospital/final-billing",
			CREATE: "/hospital/final-billing",
			UPDATE: "/hospital/final-billing",
			VIEW: "/hospital/final-billing",
		},
		EPHARMA: {
			INDEX: "/hospital/epharma",
			ISSUE: "/hospital/epharma/issue",
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
