
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
			warehouse_id: (value) => {
				if (!value) return t("ChooseWarehouse");
				return null;
			}
		},
	};
};

export const getDispenseFormInitialValues = (t) => {
	return {
		initialValues: {
			remark: "",
			dispense_type : "",
			dispense_no : ""
		},
		validate: {
			dispense_type: (value) => {
				if (!value) return t("ChooseDispenseType");
				return null;
			}

		},
	};
};
