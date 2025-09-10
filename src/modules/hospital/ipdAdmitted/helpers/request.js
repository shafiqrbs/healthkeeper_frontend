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
			generic: (value) => (value ? null : "Generic name is required"),
		},
	};
};
