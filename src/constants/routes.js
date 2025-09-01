export const MASTER_DATA_ROUTES = {
	API_ROUTES: {
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
		LAB_USER: {
			INDEX: "hospital/core/lab-user",
			CREATE: "hospital/core/lab-user/create",
			UPDATE: "hospital/core/lab-user/update",
			VIEW: "hospital/core/lab-user/view",
			DELETE: "/hospital/core/lab-user/delete",
		},

		PARTICULAR: {
			INDEX: "hospital/core/particular",
			CREATE: "hospital/core/particular",
			UPDATE: "hospital/core/particular/update",
			VIEW: "hospital/core/particular",
			DELETE: "hospital/core/particular",
		},

		BED: {
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
			INDEX: "/hospital/core/lab-user",
			CREATE: "/hospital/core/lab-user/create",
			UPDATE: "/hospital/core/lab-user",
			VIEW: "/hospital/core/lab-user/view",
			DELETE: "/hospital/core/lab-user/delete",
		},

		INVESTIGATION: {
			INDEX: "/hospital/core/investigation",
			CREATE: "/hospital/core/investigation/create",
			UPDATE: "/hospital/core/investigation/update",
			VIEW: "/hospital/core/investigation/view",
		},

		PARTICULAR: {
			INDEX: "/hospital/core/particular",
			CREATE: "/hospital/core/particular/create",
			UPDATE: "/hospital/core/particular/update",
			VIEW: "/hospital/core/particular/view",
		},

		BED: {
			INDEX: "/hospital/core/bed",
			CREATE: "/hospital/core/bed/create",
			UPDATE: "/hospital/core/bed/update",
			VIEW: "/hospital/core/bed/view",
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

		ADMISSION: {
			INDEX: "hospital/admission",
			CREATE: "hospital/admission/create",
			UPDATE: "hospital/admission",
			VIEW: "hospital/admission/view",
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
		ADMISSION_LIST: {
			INDEX: "/hospital/admission-list",
			CREATE: "/hospital/admission-list/create",
			UPDATE: "/hospital/admission-list",
			VIEW: "/hospital/admission-list/view",
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
