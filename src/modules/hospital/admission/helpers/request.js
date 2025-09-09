const admissionInitialValues = {
	patient_type: "general",
	appointment: "",
	roomNo: "",
	specialization: "",
	doctorName: "",
	diseaseProfile: "",
	guardian_name: "",
	guardian_mobile: "",
	name: "",
	gender: "male",
	fmhName: "",
	presentAddress: "",
	permanentAddress: "",
	dateOfBirth: "",
	ageYear: "",
	ageMonth: "",
	ageDay: "",
	religion: "",
};

export const getAdmissionFormInitialValues = () => {
	return {
		initialValues: admissionInitialValues,
	};
};

const admissionConfirmInitialValues = {
	room_id: "",
	admit_unit_id: "",
	hms_invoice_id: "",
	admit_doctor_id: "",
	admit_department_id: "",
	comment: "",
	patient_mode: "ipd",
};

export const getAdmissionConfirmFormInitialValues = () => {
	return {
		initialValues: admissionConfirmInitialValues,
	};
};
