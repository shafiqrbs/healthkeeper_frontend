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
	by_meal: "",
	duration: "",
	count: 0,
	advise: "",
	followUpDate: null,
};

export const getMedicineFormInitialValues = () => {
	return {
		initialValues: medicineInitialValues,

		validate: {
			brand: (value) => (value ? null : "Brand name is required"),
			dosage: (value) => (value ? null : "Dosage is required"),
			times: (value) => (value ? null : "Times is required"),
			by_meal: (value) => (value ? null : "By meal is required"),
			duration: (value) => (value ? null : "Meditation duration is required"),
			count: (value) => (value ? null : "Count is required"),
		},
	};
};
