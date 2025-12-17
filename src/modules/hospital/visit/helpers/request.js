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
			name: hasLength({ min: 2}),
			mobile: (value) => {
				const isEmpty = (v) => v === "" || v === null || v === undefined;
				const isValid = /^01[0-9]{9}$/.test(value);
				return isValid ? null : "Invalid mobile number";
			},
			day: (_, values) => {
				const isEmpty = (v) => v === "" || v === null || v === undefined;
				return isEmpty(values?.day) && isEmpty(values?.month) && isEmpty(values?.year)
					? t("Age is required")
					: null;
			},
			month: (_, values) => {
				const isEmpty = (v) => v === "" || v === null || v === undefined;
				return isEmpty(values?.day) && isEmpty(values?.month) && isEmpty(values?.year)
					? t("Age is required")
					: null;
			},
			year: (_, values) => {
				const isEmpty = (v) => v === "" || v === null || v === undefined;
				return isEmpty(values?.day) && isEmpty(values?.month) && isEmpty(values?.year)
					? t("Age is required")
					: null;
			},
			//upazilla_id: hasLength({ min: 2, max: 20 }),
			amount: (value, values) => {
				if (!Number(value) && values.patient_payment_mode_id === "30") return t("AmountIsRequired");
				return null;
			},
		},
	};
};
