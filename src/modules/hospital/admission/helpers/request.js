const admissionInitialValues = {
	patient_type: "general",
	appointment: "",
	father_name: "",
	mother_name: "",
	profession: "",
	specialization: "",
	doctorName: "",
	diseaseProfile: "",
	guardian_name: "",
	guardian_mobile: "",
	name: "",
	gender: "male",
	address: "",
	permanentAddress: "",
	dob: "",
	year: "",
	month: "",
	day: "",
	country_id: "19",
	admit_doctor_id: "",
	admit_unit_id: "",
	admit_department_id: "",
	comment: "",
	patient_relation: "",
	upazilla_id: "",
	bp: "",
	weight: "",
	height: "",
	amount: "",
	admit_consultant_id: "",
	religion_id: "",
};

export const getAdmissionFormInitialValues = () => {
	return {
		initialValues: admissionInitialValues,
		validate: {
			admit_unit_id: (value) => {
				if (!value) return "Unit is required";
				return null;
			},
			admit_department_id: (value) => {
				if (!value) return "Department is required";
				return null;
			},
			// religion_id: (value) => {
			// 	if (!value) return "Religion is required";
			// 	return null;
			// },
		},
	};
};

const admissionConfirmInitialValues = {
	room_id: "",
	patient_mode: "ipd",
};

export const getAdmissionConfirmFormInitialValues = () => {
	return {
		initialValues: admissionConfirmInitialValues,
	};
};
