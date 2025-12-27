export const medicineInitialValues = {
	medicine_id: "",
	medicine_name: "",
	generic: "",
	generic_id: "",
	company: "",
	dose_details: "",
	by_meal: "",
	medicine_dosage_id: "",
	medicine_bymeal_id: "",
	times: "",
	duration: "",
	quantity: "",
	opd_quantity: 0,
};

export const getMedicineFormInitialValues = (type) => {
	if (type === "discharge") {
		return {
			initialValues: medicineInitialValues,

			validate: {
				medicine_dosage_id: (value) => (value ? null : "Dosage is required"),
			},
		};
	}

	return {
		initialValues: medicineInitialValues,

		validate: {
			medicine_dosage_id: (value) => (value ? null : "Dosage is required"),
			medicine_bymeal_id: (value) => (value ? null : "By Meal is required"),
			quantity: (value) => (value > 0 ? null : "Quantity must be greater than 0"),
		},
	};
};
