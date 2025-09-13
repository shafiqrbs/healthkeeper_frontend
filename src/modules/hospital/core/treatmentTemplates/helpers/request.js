import { hasLength } from "@mantine/form";

const initialValues = {
	particular_type_master_id: 24,
	name: "",
	treatment_mode_id: "",
};

export const getInitialValues = () => {
	return {
		initialValues,
		validate: {
			name: hasLength({ min: 1 }),
		},
	};
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
			name: hasLength({ min: 1 }),
		},
	};
};

export const medicineInitialValues = {
	medicine_id: "",
	medicine_name: "",
	generic: "",
	generic_id: "",
	company: "",
	dose_details: "",
	times: "",
	by_meal: "",
	duration: "",
	quantity: 1,
};

export const getMedicineFormInitialValues = () => {
	return {
		initialValues: medicineInitialValues,

		validate: {
			dose_details: (value) => (value ? null : "Dose details is required"),
			duration: (value) => (value ? null : "Duration is required"),
			quantity: (value) => (value > 0 ? null : "Amount must be greater than 0"),
		},
	};
};
