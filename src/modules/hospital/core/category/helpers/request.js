import { hasLength } from "@mantine/form";

const initialValues = {
	category_nature_id: "",
	name: "",
};

export const getInitialValues = (t) => {
	return {
		initialValues,
		validate: {
			category_nature_id: (value) => {
				if (!Number(value)) return t("CategoryNatureIsRequired");
				return null;
			},
			name: (value) => {
				if (!value) return t("NameIsRequired");
				return null;
			},
		},
	};
};

