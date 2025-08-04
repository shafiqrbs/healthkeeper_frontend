const admissionInitialValues = {
	patient_type: "general",
	patient_name: "",
	patient_mobile: "",
	patient_gender: "",
	patient_age: "",
	patient_address: "",
	patient_guardian_name: "",
	patient_guardian_mobile: "",
};

export const getAdmissionFormInitialValues = () => {
	return {
		initialValues: admissionInitialValues,
	};
};
