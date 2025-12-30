export const getByMeal = (by_meal_options, id) => {
	if (by_meal_options?.length === 0) return "";
	if (!id) return;

	const selectedByMeal = by_meal_options?.find((item) => item.id?.toString() === id?.toString());
	return selectedByMeal;
};

export const getDosage = (dosage_options, id) => {
	if (dosage_options?.length === 0) return;
	if (!id) return;

	const selectedDosage = dosage_options?.find((item) => item.id?.toString() === id?.toString());
	return selectedDosage;
};

export const getDurationMode = (duration_mode_options, label) => {
	if (duration_mode_options?.length === 0) return;
	if (!label) return;

	const selectedDurationMode = duration_mode_options?.find((item) => item.label == label);
	return selectedDurationMode;
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

export const appendDurationModeValueToForm = (form, duration_mode_options, label) => {
	if (!form) return console.error("form should be passed in duration mode function");
	const durationMode = getDurationMode(duration_mode_options, label);

	form.setFieldValue("duration", label);
	form.setFieldValue("duration_mode_bn", durationMode?.name_bn);
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
	// =============== only set duration_mode_bn if medicine has it, to avoid overwriting value set from duration dropdown ================
	if (selectedMedicine.duration_mode_bn) {
		form.setFieldValue("duration_mode_bn", selectedMedicine.duration_mode_bn);
	}
	// form.setFieldValue("generic", selectedMedicine.generic);
	form.setFieldValue("generic_id", selectedMedicine.generic_id);
	form.setFieldValue("company", selectedMedicine.company);
	form.setFieldValue("opd_quantity", selectedMedicine?.opd_quantity || 0);
	form.setFieldValue("opd_limit", (selectedMedicine?.opd_quantity || 0) * 2);
};

/**
 * Generates a complete medicine payload from form values and selected medicine data.
 *
 * @param {object} form - Mantine form instance with medicine form values.
 * @param {object} selectedMedicine - The selected medicine data.
 * @param {string} selectedMedicine.product_name - Medicine name.
 * @param {string} selectedMedicine.generic - Generic name.
 * @param {number|string} selectedMedicine.generic_id - Generic ID.
 * @param {string} selectedMedicine.company - Company name.
 * @param {number} [selectedMedicine.opd_quantity=0] - OPD quantity (optional).
 * @param {number|string} [selectedMedicine.medicine_dosage_id] - Medicine dosage ID (optional).
 * @param {number|string} [selectedMedicine.medicine_bymeal_id] - Medicine by meal ID (optional).
 * @param {object} [options] - Optional parameters.
 * @param {array} [options.dosage_options] - Dosage options array for getting dosage details.
 * @param {array} [options.by_meal_options] - By meal options array for getting by meal details.
 *
 * @returns {object} Complete medicine payload object.
 */
export const generateMedicinePayload = (form, selectedMedicine, options = {}) => {
	if (!form) return console.error("form should be passed in generateMedicinePayload function");
	if (!selectedMedicine)
		return console.error("selectedMedicine should be passed in generateMedicinePayload function");

	// =============== get dosage details if dosage_options are provided ================
	const { dosage_options, by_meal_options } = options;

	let dosage = null;
	let byMeal = null;

	if (dosage_options && selectedMedicine.medicine_dosage_id) {
		dosage = getDosage(dosage_options, selectedMedicine.medicine_dosage_id);
	}

	if (by_meal_options && selectedMedicine.medicine_bymeal_id) {
		byMeal = getByMeal(by_meal_options, selectedMedicine.medicine_bymeal_id);
	}

	// =============== build the complete payload object ================
	const payload = {
		medicine_id: form.values.medicine_id || selectedMedicine.product_id,
		medicine_name: selectedMedicine.product_name || form.values.medicine_name,
		generic: selectedMedicine.generic || form.values.generic,
		generic_id: selectedMedicine.generic_id || form.values.generic_id,
		company: selectedMedicine.company || form.values.company,
		opd_quantity: selectedMedicine?.opd_quantity || form.values.opd_quantity || 0,
		opd_limit: (selectedMedicine?.opd_quantity || form.values.opd_limit || 0) * 2,
		medicine_dosage_id: form.values.medicine_dosage_id || selectedMedicine.medicine_dosage_id?.toString() || "",
		dose_details: form.values.dose_details || dosage?.name || "",
		dose_details_bn: form.values.dose_details_bn || dosage?.name_bn || "",
		medicine_bymeal_id: form.values.medicine_bymeal_id || selectedMedicine.medicine_bymeal_id?.toString() || "",
		by_meal: form.values.by_meal || byMeal?.name || "",
		by_meal_bn: form.values.by_meal_bn || byMeal?.name_bn || "",
		quantity: form.values.quantity || selectedMedicine.duration || "",
		duration: form.values.duration || selectedMedicine.duration_mode || "",
		duration_mode_bn: form.values.duration_mode_bn || selectedMedicine.duration_mode_bn || "",
	};

	return payload;
};

export const medicineOptionsFilter = ({ options, search, limit = 150 }) => {
	if (!options || options.length === 0) return [];

	const splittedSearch = search.toLowerCase().trim().split(" ");

	let count = 0;
	const result = [];

	for (const option of options) {
		const labelWords = option?.label?.toLowerCase()?.trim()?.split(" ") || [];
		const genericWords = (option?.generic || "").toLowerCase()?.trim()?.split(" ") || [];
		const allWords = [...labelWords, ...genericWords];

		const isMatch = splittedSearch.every((searchWord) => allWords.some((word) => word.includes(searchWord)));

		if (isMatch) {
			result.push(option);
			count++;

			// stop early—return only the first 20
			if (count === limit) break;
		}
	}

	return result;
};

/**
 * Checks if a generic_id already exists in the medicines array.
 *
 * @param {array} medicines - Array of existing medicine objects.
 * @param {number|string} genericId - The generic_id to check for duplicates.
 *
 * @returns {boolean} True if generic_id already exists, false otherwise.
 */
export const isGenericIdDuplicate = (medicines, genericId) => {
	if (!medicines || medicines.length === 0) return false;
	if (!genericId) return false;

	return medicines.some((medicine) => {
		const existingGenericId = medicine.generic_id?.toString();
		const newGenericId = genericId?.toString();
		return existingGenericId && newGenericId && existingGenericId === newGenericId;
	});
};
