export const getByMeal = (by_meal_options, id) => {
	if (by_meal_options?.length === 0) return console.error("By meal options are empty");
	if (!id) return;

	const selectedByMeal = by_meal_options?.find((item) => item.id?.toString() == id);
	return selectedByMeal;
};

export const getDosage = (dosage_options, id) => {
	if (dosage_options?.length === 0) return console.error("Dosage options are empty");
	if (!id) return console.error("Id is required for getting dosage");

	const selectedDosage = dosage_options?.find((item) => item.id?.toString() == id);
	return selectedDosage;
};

export const appendMealValueToForm = (form, by_meal_options, id) => {
	if (!form) return console.error("form should be passed in by-meal function");
	const byMeal = getByMeal(by_meal_options, id);

	form.setFieldValue("medicine_bymeal_id", id?.toString());
	form.setFieldValue("by_meal", byMeal?.name);
	form.setFieldValue("by_meal_bn", byMeal?.name_bn);
};

export const appendDosageValueToForm = (form, dosage_options, id) => {
	if (!form) return console.error("form should be passed in dosage function");
	const dosage = getDosage(dosage_options, id);

	form.setFieldValue("medicine_dosage_id", id?.toString());
	form.setFieldValue("dose_details", dosage?.name);
	form.setFieldValue("dose_details_bn", dosage?.name_bn);
};

/**
 * Appends general medicine values into a Mantine form instance.
 *
 * @param {object} form - Mantine form instance.
 * @param {function} form.setFieldValue - Function to set field values in the form.
 *
 * @param {object} selectedMedicine - The selected medicine data.
 * @param {string} selectedMedicine.product_name - Medicine name.
 * @param {string} selectedMedicine.generic - Generic name.
 * @param {number|string} selectedMedicine.generic_id - Generic ID.
 * @param {string} selectedMedicine.company - Company name.
 * @param {number} [selectedMedicine.opd_quantity=0] - OPD quantity (optional).
 * @param {number} [selectedMedicine.opd_limit=0] - OPD limit (optional).
 *
 * @returns {void}
 */
export const appendGeneralValuesToForm = (form, selectedMedicine) => {
	if (!form) return console.error("form should be passed in general values function");
	if (!selectedMedicine) return console.error("selected medicine should be passed in general values function");

	form.setFieldValue("medicine_name", selectedMedicine.product_name);
	form.setFieldValue("generic", selectedMedicine.generic);
	form.setFieldValue("generic_id", selectedMedicine.generic_id);
	form.setFieldValue("company", selectedMedicine.company);
	form.setFieldValue("opd_quantity", selectedMedicine?.opd_quantity || 0);
	form.setFieldValue("opd_limit", selectedMedicine?.opd_quantity || 0);
};

export const medicineOptionsFilter = ({ options, search }) => {
	const splittedSearch = search.toLowerCase().trim().split(" ");
	return options.filter((option) => {
		const labelWords = option.label.toLowerCase().trim().split(" ");
		const genericWords = (option.generic || "").toLowerCase().trim().split(" ");
		const allWords = [...labelWords, ...genericWords];
		return splittedSearch.every((searchWord) => allWords.some((word) => word.includes(searchWord)));
	});
};
