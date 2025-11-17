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

export const getRequisitionInitialValues = (t) => {
    return {
        initialValues: {
            notes: "",
            to_warehouse_id: "",
        },
        validate: {
            to_warehouse_id: (value) => {
                if (!value) return t("ChooseWarehouse");
                return null;
            },
        },
    };
};
