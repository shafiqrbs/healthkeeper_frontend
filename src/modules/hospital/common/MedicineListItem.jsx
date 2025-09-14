import { HOSPITAL_DROPDOWNS } from "@/app/store/core/utilitySlice";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import { ActionIcon, Box, Flex, Group, NumberInput, Select, Text } from "@mantine/core";
import { IconCheck, IconPencil, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const DURATION_UNIT_OPTIONS = [
	{ value: "day", label: "Day" },
	{ value: "week", label: "Week" },
	{ value: "month", label: "Month" },
	{ value: "year", label: "Year" },
];

export default function MedicineListItem({ index, medicines, medicine, setMedicines, handleDelete, update }) {
	const { t } = useTranslation();
	const [mode, setMode] = useState("view");
	const { data: by_meal_options } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.BY_MEAL.PATH,
		utility: HOSPITAL_DROPDOWNS.BY_MEAL.UTILITY,
	});

	const { data: dosage_options } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.DOSAGE.PATH,
		utility: HOSPITAL_DROPDOWNS.DOSAGE.UTILITY,
	});

	const openEditMode = () => {
		setMode("edit");
	};

	const closeEditMode = () => {
		setMode("view");
	};

	const handleChange = (field, value) => {
		setMedicines((prev) => prev.map((m, i) => (i === index - 1 ? { ...m, [field]: value } : m)));
	};

	const handleEdit = () => {
		setMedicines((prev) => prev.map((m, i) => (i === index - 1 ? { ...m, ...medicine } : m)));
		closeEditMode();
		update(medicines.map((m, i) => (i === index - 1 ? { ...m, ...medicine } : m)));
	};

	return (
		<Box>
			<Text mb="es" style={{ cursor: "pointer" }}>
				{index}. {medicine.medicine_name || medicine.generic}
			</Text>
			<Flex justify="space-between" align="center" gap="0">
				{mode === "view" ? (
					<Box ml="md" fz="xs" c="var(--theme-tertiary-color-8)">
						{medicine.dose_details || medicine.dosage} ---- {medicine.times} time/s ---- {medicine.by_meal}
					</Box>
				) : (
					<Group grow gap="les">
						<Select
							label=""
							data={by_meal_options}
							value={medicine.by_meal}
							placeholder={t("Timing")}
							disabled={mode === "view"}
							onChange={(v) => handleChange("by_meal", v)}
						/>
						<Select
							label=""
							data={dosage_options}
							value={medicine.dose_details}
							placeholder={t("Dosage")}
							disabled={mode === "view"}
							onChange={(v) => handleChange("dose_details", v)}
						/>
						<Select
							label=""
							data={DURATION_UNIT_OPTIONS}
							value={medicine.duration}
							placeholder={t("Duration")}
							disabled={mode === "view"}
							onChange={(v) => handleChange("duration", v)}
						/>
						<NumberInput
							label=""
							value={medicine.quantity}
							placeholder={t("Quantity")}
							disabled={mode === "view"}
							onChange={(v) => handleChange("quantity", v)}
						/>
					</Group>
				)}
				<Flex gap="les" justify="flex-end">
					<ActionIcon variant="outline" color="var(--theme-primary-color-6)" onClick={handleEdit}>
						<IconCheck size={18} stroke={1.5} />
					</ActionIcon>
					<ActionIcon variant="outline" color="var(--theme-secondary-color-6)" onClick={openEditMode}>
						<IconPencil size={18} stroke={1.5} />
					</ActionIcon>
					<ActionIcon
						variant="outline"
						color="var(--theme-error-color)"
						onClick={() => handleDelete(index - 1)}
					>
						<IconX size={18} stroke={1.5} />
					</ActionIcon>
				</Flex>
			</Flex>
		</Box>
	);
}
