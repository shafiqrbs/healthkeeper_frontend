const initialValues = {
    expired_date: "",
    production_date: "",
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
			vendor_id: "",
		},
		validate: {
			comment: (value) => {
				if (!value) return t("CommentValidationRequired");
				return null;
			},
            vendor_id: (value) => {
				if (!value) return t("ChooseVendor");
				return null;
			},
		},
	};
};
