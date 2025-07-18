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
			patientName: hasLength({ min: 2, max: 20 }),
			mobile: (value) => {
				if (!value) return t("MobileValidationRequired");
				return null;
			},
			BP: hasLength({ min: 2, max: 20 }),
			identity: hasLength({ min: 2, max: 20 }),
			district: hasLength({ min: 2, max: 20 }),
			specialization: hasLength({ min: 2, max: 20 }),
			doctorName: hasLength({ min: 2, max: 20 }),
			diseaseProfile: hasLength({ min: 2, max: 20 }),
			referredName: hasLength({ min: 2, max: 20 }),
			marketingEx: hasLength({ min: 2, max: 20 }),
		},
	};
};
