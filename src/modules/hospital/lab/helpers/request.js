const initialValues = {
	comment: "",
	lab_no: "",
};

export const getFormValues = (t) => {
	return {
		initialValues,
		// validate: () => {
		// 	return {
		// 		quantity: (value) => {
		// 			if (!Number(value)) return t("QuantityIsRequired");
		// 			return null;
		// 		},
		// 	};
		// },
	};
};
