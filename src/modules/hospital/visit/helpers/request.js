import { hasLength } from "@mantine/form";

const initialValues = {
	patient_type: "general",
	room_id: "",
	doctor_id: "",
	appointment: new Date(),
	name: "",
	mobile: "",
	gender: "male",
	height: "",
	weight: "",
	bp: "",
	dob: "",
	day: "",
	month: "",
	year: "",
	age: "",
	identity: "",
	district: "Dhaka",
	address: "",
	roomNo: "",
	specialization: "",
	doctorName: "",
	diseaseProfile: "",
	referredName: "",
	amount: 10,
	marketingEx: "",
	paymentMethod: "bkash",
	isConfirm: false,
	smsAlert: false,
	freeFor: "",
	comment: "",
	guardian_name: "",
	guardian_mobile: "",
	email: "",
	payment_mode: "",
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
			district: hasLength({ min: 2, max: 20 }),
			amount: (value) => {
				if (!value) return t("AmountValidationRequired");
				return null;
			},
			guardian_name: (value, values) => {
				if (!value && values.patient_type === "admission") return t("NameValidationRequired");
				return null;
			},
			guardian_mobile: (value, values) => {
				if (!value && values.patient_type === "admission") return t("MobileValidationRequired");
				return null;
			},
		},
	};
};
