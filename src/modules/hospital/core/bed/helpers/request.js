import { hasLength } from "@mantine/form";

const initialValues = {
	particular_type_id: 5,
	category_id: "",
	employee_id: "",
	name: "",
	instruction: "",
};

export const getInitialValues = (t) => {
	return {
		initialValues,

		validate: {
			name: hasLength({ min: 2}),
			particular_type_id: (value) => {
				if (!value) return t("ParticularTypeValidationRequired");
				return null;
			}

		},
	};
};
