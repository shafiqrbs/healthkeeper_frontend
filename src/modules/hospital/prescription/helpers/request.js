import { isEmpty } from "@utils/index";

export const getPrescriptionFormInitialValues = (t, initialFormValues) => {
	const parseDate = (dateValue) => {
		if (dateValue instanceof Date) return dateValue;
		if (typeof dateValue === "string") {
			const parsed = new Date(dateValue);
			return isNaN(parsed.getTime()) ? "" : parsed;
		}
		return "";
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
	generic_id: "",
	company: "",
	dose_details: "",
	dose_details_bn: "",
	by_meal: "",
	by_meal_bn: "",
	medicine_dosage_id: "",
	medicine_bymeal_id: "",
	times: "",
	duration: "Day",
	quantity: "",
	opd_quantity: 0,
};

export const getMedicineFormInitialValues = () => {
	return {
		initialValues: medicineInitialValues,

		validate: {
			medicine_id: (_, values) => {
				return isEmpty(values?.medicine_id) && isEmpty(values?.generic)
					? "Medicine or Generic name is required"
					: null;
			},
			generic: (_, values) => {
				return isEmpty(values?.medicine_id) && isEmpty(values?.generic)
					? "Medicine or Generic name is required"
					: null;
			},
			medicine_dosage_id: (value) => (value ? null : "Dosage is required"),
		},
	};
};
