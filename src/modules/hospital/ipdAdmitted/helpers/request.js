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
		instruction: initialFormValues?.instruction || "",
		exEmergency: initialFormValues?.exEmergency || [],
		pharmacyInstruction: initialFormValues?.pharmacyInstruction || "",
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
	by_meal: "",
	medicine_dosage_id: "",
	medicine_bymeal_id: "",
	times: "",
	duration: "Day",
	quantity: 1,
	opd_quantity: 0,
};

export const getMedicineFormInitialValues = () => {
	return {
		initialValues: medicineInitialValues,

		validate: {
			medicine_dosage_id: (value) => (value ? null : "Dosage is required"),
			quantity: (value) => (value > 0 ? null : "Amount must be greater than 0"),
		},
	};
};
