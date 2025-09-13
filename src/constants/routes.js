export const MASTER_DATA_ROUTES = {
	API_ROUTES: {
		TREATMENT_TEMPLATES: {
			INDEX: "hospital/core/particular",
			CREATE: "hospital/core/particular",
			UPDATE: "hospital/core/particular",
			VIEW: "hospital/core/particular",
			DELETE: "hospital/core/particular",
			INLINE_UPDATE: "hospital/core/particular",
		},
		OPERATIONAL_API: {
			REFERRED: "hospital/opd/referred",
		},

		INVESTIGATION: {
			INDEX: "hospital/core/particular",
			CREATE: "hospital/core/particular",
			UPDATE: "hospital/core/particular",
			VIEW: "hospital/core/particular",
			DELETE: "hospital/core/particular",
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
			UPDATE: "hospital/core/particular/update",
			VIEW: "hospital/core/particular",
			DELETE: "hospital/core/particular",
		},

		PARTICULAR: {
			INDEX: "hospital/core/particular",
			CREATE: "hospital/core/particular",
			UPDATE: "hospital/core/particular/update",
			VIEW: "hospital/core/particular",
			DELETE: "hospital/core/particular",
			INLINE_UPDATE: "hospital/core/particular/inline-update",
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
	},
	NAVIGATION_LINKS: {
		USER: {
			INDEX: "/core/user",
			CREATE: "/core/user",
			UPDATE: "/core/user",
			VIEW: "/core/user",
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
			UPDATE: "/hospital/core/labr",
			VIEW: "/hospital/core/lab=/view",
			DELETE: "/hospital/core/lab/delete",
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
			VIEW: "hospital/opd",
			DELETE: "hospital/opd",
			VISITING_ROOM: "hospital/visiting-room",
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

		PRESCRIPTION: {
			INDEX: "hospital/prescription",
			SEND_TO_PRESCRIPTION: "hospital/send-to-prescription",
			EDIT: "hospital/prescription",
			CREATE: "hospital/prescription",
			UPDATE: "hospital/prescription",
			VIEW: "hospital/prescription/view",
		},

		IPD: {
			INDEX: "hospital/ipd",
			CREATE: "hospital/ipd",
			UPDATE: "hospital/ipd",
			VIEW: "hospital/ipd",
		},

		EMERGENCY: {
			INDEX: "hospital/opd",
			CREATE: "hospital/opd",
			UPDATE: "hospital/opd",
			VIEW: "hospital/opd",
		},
		CUSTOMER: {
			INDEX: "core/customer",
			CREATE: "core/customer",
			UPDATE: "core/customer",
			DELETE: "core/customer",
		},
	},
	NAVIGATION_LINKS: {
		VISIT: {
			INDEX: "/hospital/visit",
			CREATE: "/hospital/visit/create",
			UPDATE: "/hospital/visit",
			VIEW: "/hospital/visit/view",
		},
		PRESCRIPTION: {
			INDEX: "/hospital/prescription",
			CREATE: "/hospital/prescription/create",
			UPDATE: "/hospital/prescription/edit",
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
			CREATE: "/hospital/ipd-admission",
			UPDATE: "/hospital/ipd-admission",
			VIEW: "/hospital/ipd-admission",
		},
		IPD_ADMITTED: {
			INDEX: "/hospital/ipd-admitted",
			CREATE: "/hospital/ipd-admitted",
			UPDATE: "/hospital/ipd-admitted",
			VIEW: "/hospital/ipd-admitted",
		},
		EMERGENCY: {
			INDEX: "/hospital/emergency",
			CREATE: "/hospital/emergency/create",
			UPDATE: "/hospital/emergency",
			VIEW: "/hospital/emergency/view",
		},
		CUSTOMER: {
			INDEX: "/hospital/customer",
			CREATE: "/hospital/customer",
			UPDATE: "/hospital/customer/edit",
			VIEW: "/hospital/customer/view",
		},
	},
};

export const DOMAIN_DATA_ROUTES = {
	API_ROUTES: {
		DOMAIN: {
			INDEX: "domain/config",
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
		},
	},
};
