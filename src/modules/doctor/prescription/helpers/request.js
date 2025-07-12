import { hasLength } from "@mantine/form";

const initialValues = {
	name: "",
};

export const getPrescriptionFormInitialValues = (t) => {
	return {
		initialValues,

		validate: {
			name: hasLength({ min: 2, max: 20 }),
		},
	};
};
