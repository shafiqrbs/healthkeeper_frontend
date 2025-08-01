import { hasLength } from "@mantine/form";

const initialValues = {
	patient_type: "general",
	appointment: new Date(),
	name: "",
	mobile: "",
	gender: "male",
	height: "",
	weight: "",
	bp: "",
	dateOfBirth: "",
	age: "",
	ageType: "year",
	ageYear: "",
	ageMonth: "",
	ageDay: "",
	identity: "",
	district: "Dhaka",
	address: "",
	roomNo: "",
	specialization: "",
	doctorName: "",
	diseaseProfile: "Diabetic",
	referredName: "",
	amount: 10,
	marketingEx: "",
	paymentMethod: "bkash",
	isConfirm: false,
	smsAlert: false,
	freeFor: "",
	comment: "",
};

export const getVendorFormInitialValues = (t) => {
	return {
		initialValues,

		validate: {
			name: hasLength({ min: 2, max: 20 }),
			mobile: (value) => {
				if (!value) return t("MobileValidationRequired");
				return null;
			},
			identity: hasLength({ min: 2, max: 20 }),
			district: hasLength({ min: 2, max: 20 }),
			// specialization: hasLength({ min: 2, max: 20 }),
			// doctorName: hasLength({ min: 2, max: 20 }),
			// diseaseProfile: hasLength({ min: 2, max: 20 }),
			// referredName: hasLength({ min: 2, max: 20 }),
			// marketingEx: hasLength({ min: 2, max: 20 }),
			amount: hasLength({ min: 2, max: 20 }),
		},
	};
};
