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

const medicineInitialValues = {
	brand: "",
	generic: "",
	dosage: "",
	times: "",
	timing: "",
	meditationDuration: "",
	unit: "",
};

export const getMedicineFormInitialValues = () => {
	return {
		initialValues: medicineInitialValues,

		validate: {
			brand: (value) => (value ? null : "Brand name is required"),
			dosage: (value) => (value ? null : "Dosage is required"),
			times: (value) => (value ? null : "Times is required"),
			timing: (value) => (value ? null : "Timing is required"),
			meditationDuration: (value) => (value ? null : "Meditation duration is required"),
			unit: (value) => (value ? null : "Unit is required"),
		},
	};
};
