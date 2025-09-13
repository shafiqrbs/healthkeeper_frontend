import { hasLength } from "@mantine/form";

const initialValues = {
	particular_type_master_id: 24,
	name: "",
	treatment_mode_id: "",
};

export const getInitialValues = (t) => {
	return {
		initialValues,
		validate: {
			name: hasLength({ min: 1}),
		},
	};
};

const initialInsertValues = {
	particular_id:"",
	parent_id: "",
	name: "",
	sample_value: "",
	reference_value: "",
	unit_name: "",
};

const initialReportValues = {
	parent_id: "",
	name: "",
	sample_value: "",
	reference_value: "",
	unit_name: "",
};

export const getInitialReportValues = (t) => {
	return {
		initialReportValues,
		validate: {
			name: hasLength({ min: 1}),
		},
	};
};


