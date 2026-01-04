import { isEmpty } from "@utils/index";

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
		weight: initialFormValues?.weight || "",
	};

	return {
		initialValues: formattedInitialFormValues,
	};
};

export const medicineInitialValues = {
	medicine_id: "",
	medicine_name: "",
	generic: "",
	generic2: "",
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
			medicine_id: (_, values) => {
				return isEmpty(values?.medicine_id) && isEmpty(values?.generic) && isEmpty(values?.generic2)
					? "Medicine or Generic name is required"
					: null;
			},
			generic: (_, values) => {
				return isEmpty(values?.medicine_id) && isEmpty(values?.generic) && isEmpty(values?.generic2)
					? "Medicine or Generic name is required"
					: null;
			},
			generic2: (_, values) => {
				return isEmpty(values?.medicine_id) && isEmpty(values?.generic) && isEmpty(values?.generic2)
					? "Medicine or Generic name is required"
					: null;
			},
			// medicine_dosage_id: (value) => (value ? null : "Dosage is required"),
			// medicine_bymeal_id: (value) => (value ? null : "By Meal is required"),
			// quantity: (value) => (value > 0 ? null : "Quantity must be greater than 0"),
		},
	};
};
