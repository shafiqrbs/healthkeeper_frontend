import { hasLength } from "@mantine/form";

const initialValues = {
	company: "",
	name: "",
	medicine_stock_id:"",
};

export const getInitialValues = (t) => {
	return {
		initialValues,
		validate: {
			name: hasLength({ min: 1, max: 200 }),
		},
	};
};
