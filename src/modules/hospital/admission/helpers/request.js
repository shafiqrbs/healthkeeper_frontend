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
	card_no: "",
	month: "",
	day: "",
	country_id: "19",
	admit_doctor_id: "",
	admit_unit_id: "",
	admit_department_id: "",
	comment: "",
	patient_relation: "",
	upazilla_id: "",
	identity: "",
	oxygen: "",
	temperature: "",
	pulse: "",
	bp: "",
	sat_without_O2: "",
	sat_with_O2: "",
	respiration: "",
	weight: "",
	blood_sugar: "",
	blood_group: "",
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
			religion_id: (value) => {
				if (!value) return "Religion is required";
				return null;
			},
			identity: (value) => {
				if (!value) return "NID/BIR no is required";
				return null;
			},
			card_no: (value) => {
				if (!value) return "Card no is required";
				if (isNaN(value)) return "Card no must be a number";
				return null;
			},
			guardian_name: (value) => {
				if (!value) return "Guardian name is required";
				return null;
			},
			guardian_mobile: (value) => {
				if (!value) return "Guardian mobile is required";
				return null;
			},
			address: (value) => {
				if (!value) return "Present address is required";
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
