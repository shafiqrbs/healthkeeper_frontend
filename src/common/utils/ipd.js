export const getRoomOptions = (form, cabinData, bedData, t) => {
	if (!form.values.accommodationType) return [{ value: "", label: t("Select") }];

	const payingCabinOptions =
		cabinData
			?.filter((cabinItem) => cabinItem?.payment_mode_name === "Paying")
			?.map((cabinItem) => ({
				value: String(cabinItem?.id || cabinItem?.name || ""),
				label: cabinItem?.display_name || cabinItem?.name || "",
			})) || [];

	const freeCabinOptions =
		cabinData
			?.filter((cabinItem) => cabinItem?.payment_mode_name === "Non-Paying")
			?.map((cabinItem) => ({
				value: String(cabinItem?.id || cabinItem?.name || ""),
				label: cabinItem?.display_name || cabinItem?.name || "",
			})) || [];

	const payingBedOptions =
		bedData
			?.filter((bedItem) => bedItem?.payment_mode_name === "Paying")
			?.map((bedItem) => ({
				value: String(bedItem?.id || bedItem?.name || ""),
				label: bedItem?.display_name || bedItem?.name || "",
			})) || [];

	const freeBedOptions =
		bedData
			?.filter((bedItem) => bedItem?.payment_mode_name === "Non-Paying")
			?.map((bedItem) => ({
				value: String(bedItem?.id || bedItem?.name || ""),
				label: bedItem?.display_name || bedItem?.name || "",
			})) || [];

	if (form.values.accommodationType === "cabin") return payingCabinOptions;
	if (form.values.accommodationType === "freeCabin") return freeCabinOptions;
	if (form.values.accommodationType === "bed") return payingBedOptions;
	if (form.values.accommodationType === "freeBed") return freeBedOptions;
	return [{ value: "", label: t("Select") }];
};
