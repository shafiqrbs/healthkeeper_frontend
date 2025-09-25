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
	country_id: "",
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
};

export const getAdmissionFormInitialValues = () => {
	return {
		initialValues: admissionInitialValues,
		validate: {
			amount: (value) => {
				if (!Number(value)) return "Amount is required";
				return null;
			},
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
