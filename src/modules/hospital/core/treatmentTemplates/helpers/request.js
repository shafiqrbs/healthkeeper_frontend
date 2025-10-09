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
	by_meal: "",
	medicine_dosage_id: "",
	medicine_bymeal_id: "",
	times: "",
	duration: "Day",
	quantity: 1,
	opd_quantity: 0,
};

export const getMedicineFormInitialValues = () => {
	return {
		initialValues: medicineInitialValues,

		validate: {
			medicine_dosage_id: (value) => (value ? null : "Dosage is required"),
			quantity: (value) => (value > 0 ? null : "Amount must be greater than 0"),
		},
	};
};
