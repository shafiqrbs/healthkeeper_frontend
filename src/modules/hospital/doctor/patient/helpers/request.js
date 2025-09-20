import { hasLength } from "@mantine/form";

const initialValues = {
	identity_mode: "NID",
	health_id: "",
	patient_mode: "opd",
	customer_id: "",
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
	upazilla_id: "",
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
	invoice_particulars: [{ id: 1, name: "Consultation", quantity: 10, price: 100 }],
};

export const getVendorFormInitialValues = (t) => {
	return {
		initialValues,

		validate: {
			name: hasLength({ min: 2, max: 20 }),
			mobile: hasLength({ min: 11, max: 14 }),
			// dob: (value) => {
			// 	if (!value) return t("DateOfBirthValidationRequired");
			// 	return null;
			// },
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
