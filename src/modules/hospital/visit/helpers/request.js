import { hasLength } from "@mantine/form";

const initialValues = {
	appointment: "",
	patientName: "",
	mobile: "",
	gender: "male",
	height: "",
	weight: "",
	bp: "",
	dateOfBirth: "",
	age: "",
	ageType: "year",
	identity: "",
	district: "Dhaka",
	address: "",
	roomNo: "",
	specialization: "",
	doctorName: "",
	diseaseProfile: "Diabetic",
	referredName: "",
	amount: "",
	marketingEx: "",
	paymentMethod: "bkash",
	isConfirm: false,
	smsAlert: false,
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
			bp: hasLength({ min: 2, max: 20 }),
			identity: hasLength({ min: 2, max: 20 }),
			district: hasLength({ min: 2, max: 20 }),
			specialization: hasLength({ min: 2, max: 20 }),
			doctorName: hasLength({ min: 2, max: 20 }),
			diseaseProfile: hasLength({ min: 2, max: 20 }),
			referredName: hasLength({ min: 2, max: 20 }),
			marketingEx: hasLength({ min: 2, max: 20 }),
			amount: hasLength({ min: 2, max: 20 }),
		},
	};
};
