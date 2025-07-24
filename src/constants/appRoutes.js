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
			INDEX: "hospital/visit",
			CREATE: "hospital/visit/create",
			UPDATE: "hospital/visit",
			VIEW: "hospital/visit/view",
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
			CREATE: "core/customer/create",
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
			UPDATE: "/hospital/prescription",
			VIEW: "/hospital/prescription/view",
		},
		ADMISSION: {
			INDEX: "/hospital/admission",
			CREATE: "/hospital/admission/create",
			UPDATE: "/hospital/admission",
			VIEW: "/hospital/admission/view",
		},
		EMERGENCY: {
			INDEX: "/hospital/emergency",
			CREATE: "/hospital/emergency/create",
			UPDATE: "/hospital/emergency",
			VIEW: "/hospital/emergency/view",
		},
		CUSTOMER: {
			INDEX: "/hospital/customer",
			CREATE: "/hospital/customer/create",
			UPDATE: "/hospital/customer",
			VIEW: "/hospital/customer/view",
		},
	},
};
