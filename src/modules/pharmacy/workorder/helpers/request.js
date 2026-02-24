const initialValues = {
	expired_date: "",
	production_date: "",
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

export const getWorkorderFormInitialValues = (t) => {
	return {
		initialValues: {
			remark: "",
			vendor_id: "",
			workorder_date: "",
			received_date: "",
            grn: "",
		},
		validate: {
			vendor_id: (value) => {
				if (!value) return t("ChooseVendor");
				return null;
			},
		},
	};
};
