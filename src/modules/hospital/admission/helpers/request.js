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
	patient_type: "general",
	roomNo: "",
	roomType: "opd",
	unitName: "",
	department: "",
	assignConsultant: "",
	assignDoctor: "",
	comment: "",
	referredDoctor: "",
	designation: "",
	comment2: "",
};

export const getAdmissionConfirmFormInitialValues = () => {
	return {
		initialValues: admissionConfirmInitialValues,
	};
};
