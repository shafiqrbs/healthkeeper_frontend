import { hasLength } from "@mantine/form";

const initialValues = {
	name: "",
	mobile: "",
	email: "",
	customer_id: "",
	address: "",
	customer_group_id: "",
	reference_id: "",
	credit_limit: "",
	alternative_mobile: "",
	location_id: "",
	marketing_id: "",
	discount_percent: "",
};

export const getInitialValues = (t) => {
	return {
		initialValues,

		validate: {
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
