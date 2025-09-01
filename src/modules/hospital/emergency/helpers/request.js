import { hasLength } from "@mantine/form";

const initialValues = {
	identity_mode: "NID",
	health_id: "",
	patient_mode: "emergency",
	room_id: "927",
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
	specialization: "",
	disease_profile: "",
	referred_id: "",
	amount: 10,
	marketing_id: "",
	comment: "",
	guardian_name: "",
	guardian_mobile: "",
	email: "",
	payment_mode: "",
	free_identification: "",
	patient_payment_mode_id: "30",
	api_patient_content: "",
	invoice_particulars: [{ id: 1, name: "Consultation", quantity: 30, price: 100 }],
};

export const getVendorFormInitialValues = () => {
	return {
		initialValues,

		validate: {
			name: hasLength({ min: 2, max: 20 }),
			// mobile: (value) => {
			// 	if (!value) return t("MobileValidationRequired");
			// 	return null;
			// },
		},
	};
};
