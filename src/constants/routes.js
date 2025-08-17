export const MASTER_DATA_ROUTES = {
	API_ROUTES: {
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
			INDEX: 		"hospital/core/particular",
			CREATE: 	"hospital/core/particular",
			UPDATE: 	"hospital/core/particular/update",
			VIEW: 		"hospital/core/particular",
			DELETE: 	"hospital/core/particular",
		},

		BED: {
			INDEX: 		"hospital/core/particular",
			CREATE: 	"hospital/core/particular",
			UPDATE: 	"hospital/core/particular/update",
			VIEW: 		"hospital/core/particular",
			DELETE: 	"hospital/core/particular",
		},

		PARTICULAR_TYPE: {
			INDEX: "hospital/core/particular-type",
			CREATE: "hospital/core/particular-type/create",
			UPDATE: "hospital/core/particular-type/update",
			VIEW: "hospital/core/particular-type/view",
			DELETE: "hospital/core/particular-type/delete",
		},

		PARTICULAR_MODE: {
			INDEX: "hospital/core/particular-mode",
			CREATE: "hospital/core/particular-mode/create",
			UPDATE: "hospital/core/particular-mode/update",
			VIEW: "hospital/core/particular-mode/view",
			DELETE: "hospital/core/particular-mode/delete",
		},

		CATEGORY: {
			INDEX: "inventory/category-group",
			CREATE: "inventory/category-group",
			UPDATE: "inventory/category-group",
			VIEW: "inventory/category-group",
			DELETE: "inventory/category-group",
		},
	},
	NAVIGATION_LINKS: {
		LAB_USER: {
			INDEX: "/hospital/core/lab-user",
			CREATE: "/hospital/core/lab-user/create",
			UPDATE: "/hospital/core/lab-user",
			VIEW: "/hospital/core/lab-user/view",
			DELETE: "/hospital/core/lab-user/delete",
		},

		PARTICULAR: {
			INDEX: "/hospital/core/particular",
			CREATE: "/hospital/core/particular/create",
			UPDATE: "/hospital/core/particular/update",
			VIEW: "/hospital/core/particular/view"
		},

		BED: {
			INDEX: "/hospital/core/bed",
			CREATE: "/hospital/core/bed/create",
			UPDATE: "/hospital/core/bed/update",
			VIEW: "/hospital/core/bed/view"
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
		VISIT: {
			INDEX: "core/customer",
			CREATE: "core/customer",
			UPDATE: "core/customer",
			VIEW: "core/customer",
			DELETE: "core/customer",
		},
		PRESCRIPTION: {
			INDEX: "hospital/prescription",
			CREATE: "hospital/prescription/create",
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
			INDEX: "hospital/emergency",
			CREATE: "hospital/emergency/create",
			UPDATE: "hospital/emergency",
			VIEW: "hospital/emergency/view",
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
