const initialValues = {
	stock_item_id: "",
	quantity: "",
};

export const getInitialValues = (t) => {
	return {
		initialValues,
		validate: {
			stock_item_id: (value) => {
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

export const getRequisitionInitialValues = () => {
	return {
		initialValues: {
            notes: "",
		},
		validate: {

		},
	};
};
