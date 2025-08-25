import { hasLength } from "@mantine/form";

const initialValues = {
	name: "",
};

export const getPrescriptionFormInitialValues = () => {
	return {
		initialValues,

		validate: {
			name: hasLength({ min: 2, max: 20 }),
		},
	};
};

export const medicineInitialValues = {
	medicine: "",
	medicineName: "",
	generic: "",
	dosage: "",
	times: "",
	by_meal: "",
	duration: "",
	count: 1,
	advise: "",
	followUpDate: null,
};

export const getMedicineFormInitialValues = () => {
	return {
		initialValues: medicineInitialValues,

		validate: {
			dosage: (value) => (value ? null : "Dosage is required"),
			times: (value) => (value ? null : "Times is required"),
			by_meal: (value) => (value ? null : "By meal is required"),
			duration: (value) => (value ? null : "Duration is required"),
			count: (value) => (value > 0 ? null : "Count must be greater than 0"),
		},
	};
};
