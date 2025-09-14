export const getPrescriptionFormInitialValues = (t, initialFormValues) => {
	const parseDate = (dateValue) => {
		if (!dateValue) return new Date();
		if (dateValue instanceof Date) return dateValue;
		if (typeof dateValue === "string") {
			const parsed = new Date(dateValue);
			return isNaN(parsed.getTime()) ? new Date() : parsed;
		}
		return new Date();
	};

	const formattedInitialFormValues = {
		basic_info: initialFormValues?.patient_report?.basic_info || { bp: "", weight: "", bloodGroup: "" },
		dynamicFormData: initialFormValues?.patient_report?.patient_examination || {},
		advise: initialFormValues?.advise || "",
		follow_up_date: parseDate(initialFormValues?.follow_up_date),
	};

	return {
		initialValues: formattedInitialFormValues,
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
	quantity: 1,
};

export const getMedicineFormInitialValues = () => {
	return {
		initialValues: medicineInitialValues,

		validate: {
			dose_details: (value) => (value ? null : "Dose details is required"),
			duration: (value) => (value ? null : "Duration is required"),
			quantity: (value) => (value > 0 ? null : "Amount must be greater than 0"),
		},
	};
};
