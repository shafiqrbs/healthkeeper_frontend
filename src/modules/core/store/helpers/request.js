import { hasLength } from "@mantine/form";

const initialValues = {
	name: "",
};

export const getInitialValues = (t) => {
	return {
		initialValues,
		validate: {
			name: hasLength({ min: 1}),
		},
	};
};

