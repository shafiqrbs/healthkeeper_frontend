import { hasLength } from "@mantine/form";

const initialValues = {
	particular_type_master_id: 23,
	name: "",
	content: "",
};

export const getInitialValues = (t) => {
	return {
		initialValues,
		validate: {
			name: hasLength({ min: 1}),
		},
	};
};

