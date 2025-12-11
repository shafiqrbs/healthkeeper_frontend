import { hasLength } from "@mantine/form";
import { isEmpty } from "@utils/index";

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

export const getInitialReportValues = () => {
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
	// medicine_dosage_id: "",
	// medicine_bymeal_id: "",
	times: "",
	duration: "",
	quantity: "",
	opd_quantity: "",
};

export const getMedicineFormInitialValues = () => {
	return {
		initialValues: medicineInitialValues,

		validate: {
			medicine_id: (_, values) => {
				return isEmpty(values?.medicine_id) && isEmpty(values?.generic)
					? "Medicine or Generic name is required"
					: null;
			},
			generic: (_, values) => {
				return isEmpty(values?.medicine_id) && isEmpty(values?.generic)
					? "Medicine or Generic name is required"
					: null;
			},
			// medicine_dosage_id: (value) => (value ? null : "Dosage is required"),
			// medicine_bymeal_id: (value) => (value ? null : "By Meal is required"),
			// quantity: (value) => (value > 0 ? null : "Amount must be greater than 0"),
		},
	};
};
