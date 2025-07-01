import { hasLength } from "@mantine/form";

const initialValues = {
	company_name: "",
	name: "",
	mobile: "",
	email: "",
	customer_id: "",
	address: "",
};

export const getVendorFormInitialValues = (t) => {
	return {
		initialValues,

		validate: {
			company_name: hasLength({ min: 2, max: 20 }),
			name: hasLength({ min: 2, max: 20 }),
			mobile: (value) => {
				if (!value) return t("MobileValidationRequired");
				return null;
			},
			email: (value) => {
				if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
					return true;
				}
				return null;
			},
		},
	};
};
