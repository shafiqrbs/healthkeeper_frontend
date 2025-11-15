import { hasLength } from "@mantine/form";

const initialValues = {
	particular_module_id: "",
	name: "",
	short_code: "",
};

export const getInitialValues = (t) => {
	return {
		initialValues,
		validate: {
			particular_module_id: (value) => {
				if (!value) return t("ParticularModeValidationRequired");
				return null;
			},
			name: hasLength({ min: 2, max: 20 }),
		},
	};
};
