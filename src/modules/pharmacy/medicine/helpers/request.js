import { hasLength } from "@mantine/form";

const initialValues = {
	company: "",
	product_name: "",
	generic:"",
	opd_quantity:"",
	medicine_dosage_id:"",
	medicine_bymeal_id:"",
};

export const getInitialValues = (t) => {
	return {
		initialValues,
		validate: {
			name: hasLength({ min: 1, max: 200 }),
		},
	};
};
