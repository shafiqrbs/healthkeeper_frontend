import { hasLength, isNotEmpty } from "@mantine/form";

const initialValues = {
	business_model_id: "",
	company_name: "",
	mobile: "",
	alternative_mobile: "",
	name: "",
	username: "",
	address: "",
	email: "",
};

export const getDomainFormInitialValues = ({ type = "create" }) => {
	return {
		initialValues,

		validate: {
			business_model_id: isNotEmpty(),
			email: isNotEmpty(),
			company_name: hasLength({ min: 2 }),
			name: hasLength({ min: 2 }),
			username: type === "create" ? hasLength({ min: 2, max: 20 }) : undefined,
			mobile: (value) => {
				const isNotEmpty = !!value.trim().length;
				const isDigitsOnly = /^\d+$/.test(value.trim());
				if (isNotEmpty && isDigitsOnly) {
					return false;
				} else {
					return true;
				}
			},
			alternative_mobile: (value) => {
				if (value) {
					const isNotEmpty = !!value.trim().length;
					const isDigitsOnly = /^\d+$/.test(value.trim());
					if (isNotEmpty && isDigitsOnly) {
						return false;
					} else {
						return true;
					}
				} else {
					return false;
				}
			},
		},
	};
};
