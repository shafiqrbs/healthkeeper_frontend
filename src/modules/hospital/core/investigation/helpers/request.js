import { hasLength } from "@mantine/form";

const initialValues = {
	particular_type_master_id: 9,
	category_id: "",
	name: "",
	price: "",
};

export const getInitialValues = (t) => {
	return {
		initialValues,
		validate: {
			category_id: (value) => {
				if (!value) return t("CategoryValidationRequired");
				return null;
			},
			name: hasLength({ min: 1}),
		},
	};
};

