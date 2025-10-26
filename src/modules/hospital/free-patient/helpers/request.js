const validationInitialValues = {
	comment: "",
};

export const getFormInitialValues = () => {
	return {
		initialValues: validationInitialValues,
		validate: {
			comment: (value) => {
				if (!value) return "Comment is required";
				return null;
			},

		},
	};
};
