export const MASTER_DATA_ROUTES = {
	API_ROUTES: {
		LAB_USER: {
			INDEX: "master-data/lab-user",
			CREATE: "master-data/lab-user/create",
			UPDATE: "master-data/lab-user/update",
			VIEW: "master-data/lab-user/view",
			DELETE: "master-data/lab-user/delete",
		},
	},
	NAVIGATION_LINKS: {
		LAB_USER: {
			INDEX: "/master-data/lab-user",
			CREATE: "/master-data/lab-user/create",
			UPDATE: "/master-data/lab-user",
			VIEW: "/master-data/lab-user/view",
			DELETE: "/master-data/lab-user/delete",
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
