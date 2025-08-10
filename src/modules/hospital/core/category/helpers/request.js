import { hasLength } from "@mantine/form";

const initialValues = {
	name: "",
	parent_id: "",
	category_nature_id: "",
};

export const getInitialValues = (t) => {
	return {
		initialValues,
		validate: {
			name: hasLength({ min: 2}),
		},
	};
};
