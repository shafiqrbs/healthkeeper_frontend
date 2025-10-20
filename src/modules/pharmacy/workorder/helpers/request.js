const initialValues = {
	expiry_start_date: "",
	expiry_end_date: "",
	medicine_id: "",
	quantity: "",
};

export const getInitialValues = (t) => {
	return {
		initialValues,
		validate: {
			medicine_id: (value) => {
				if (!value) return t("MedicineValidationRequired");
				return null;
			},
			quantity: (value) => {
				if (!value) return t("QuantityValidationRequired");
				return null;
			},
		},
	};
};

export const getWorkorderFormInitialValues = (t) => {
	return {
		initialValues: {
			comment: "",
			expected_date: "",
		},
		validate: {
			comment: (value) => {
				if (!value) return t("CommentValidationRequired");
				return null;
			},
			expected_date: (value) => {
				if (!value) return t("ExpectedDateValidationRequired");
				return null;
			},
		},
	};
};
