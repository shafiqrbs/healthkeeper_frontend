const initialValues = {
	basicInfo: { bp: "120/80", weight: "", bloodGroup: "O+" },
	dynamicFormData: {},
	advise: "",
	follow_up_date: new Date(),
};

export const getPrescriptionFormInitialValues = () => {
	return {
		initialValues,
	};
};

export const medicineInitialValues = {
	medicine_id: "",
	medicine_name: "",
	generic: "",
	generic_id: "",
	company: "",
	dose_details: "",
	times: "",
	by_meal: "",
	duration: "",
	amount: 1,
};

export const getMedicineFormInitialValues = () => {
	return {
		initialValues: medicineInitialValues,

		validate: {
			dose_details: (value) => (value ? null : "Dose details is required"),
			by_meal: (value) => (value ? null : "By meal is required"),
			duration: (value) => (value ? null : "Duration is required"),
			amount: (value) => (value > 0 ? null : "Amount must be greater than 0"),
		},
	};
};
