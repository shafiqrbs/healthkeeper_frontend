import { hasLength } from "@mantine/form";

const initialValues = {
	name: "",
};

const medicineInitialValues = {
	generic: "",
	brand: "",
	dosage: "",
	followUpDate: "",
	visitPercent: "",
	testPercent: "",
	advise: "",
};

export const getPrescriptionFormInitialValues = (t) => {
	return {
		initialValues,

		validate: {
			name: hasLength({ min: 2, max: 20 }),
		},
	};
};

export const getMedicineFormInitialValues = (t) => {
	return {
		initialValues: medicineInitialValues,

		validate: {
			generic: (value) => (value ? null : "Generic name is required"),
			brand: (value) => (value ? null : "Brand name is required"),
			dosage: (value) => (value ? null : "Dosage is required"),
		},
	};
};
