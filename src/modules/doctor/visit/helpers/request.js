import { hasLength } from "@mantine/form";

const initialValues = {
	appointment: "",
	patientName: "",
	mobile: "",
	gender: "",
	height: "",
	weight: "",
	BP: "",
	dateOfBirth: "",
	age: "",
	years: "",
	identity: "",
	district: "",
	address: "",
	roomNo: "",
	specialization: "",
	doctorName: "",
	diseaseProfile: "",
	referredName: "",
	marketingEx: "",
};

export const getVendorFormInitialValues = (t) => {
	return {
		initialValues,

		validate: {
			appointment: hasLength({ min: 2, max: 20 }),
			patientName: hasLength({ min: 2, max: 20 }),
			mobile: (value) => {
				if (!value) return t("MobileValidationRequired");
				return null;
			},
			BP: hasLength({ min: 2, max: 20 }),
			dateOfBirth: hasLength({ min: 2, max: 20 }),
			age: hasLength({ min: 2, max: 20 }),
			years: hasLength({ min: 2, max: 20 }),
			identity: hasLength({ min: 2, max: 20 }),
			district: hasLength({ min: 2, max: 20 }),
		},
	};
};
