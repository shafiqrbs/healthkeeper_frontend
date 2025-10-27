const validationInitialValues = {
	case_no: "",
	thana: "",
	duty_officer: "",
	mobile: "",
	case_details: "",
	comment: "",
};

export const getFormInitialValues = () => {
	return {
		initialValues: validationInitialValues,
		validate: {
			case_no: (value) => {
				if (!value) return "Case no is required";
				return null;
			},
			thana: (value) => {
				if (!value) return "Thana is required";
				return null;
			},
			duty_officer: (value) => {
				if (!value) return "Duty officer is required";
				return null;
			},
			mobile: (value) => {
				if (!value) return "Duty officer mobile is required";
				return null;
			},
			case_details: (value) => {
				if (!value) return "Case details is required";
				return null;
			},
			comment: (value) => {
				if (!value) return "Comment is required";
				return null;
			},

		},
	};
};
