import { ActionIcon, Autocomplete, Box, Flex, Grid, Input, NumberInput, Stack, Text } from "@mantine/core";
import { IconCheck, IconPencil, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const DURATION_UNIT_OPTIONS = [
	{ value: "day", label: "Day" },
	{ value: "week", label: "Week" },
	{ value: "month", label: "Month" },
	{ value: "year", label: "Year" },
];

export default function MedicineListItem({
	by_meal_options,
	dosage_options,
	index,
	medicines,
	medicine,
	setMedicines,
	handleDelete,
	update,
}) {
	const { t } = useTranslation();
	const [mode, setMode] = useState("view");
	const [editingInstructionIndex, setEditingInstructionIndex] = useState(null);

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

	const handleAddInstruction = (instructionIndex) => {
		setMedicines((prev) => {
			const medicineIndex = index - 1;
			const current = prev[medicineIndex];
			const baseInstruction = {
				dose_details: current.dose_details || current.dosage || "",
				by_meal: current.by_meal || "",
				quantity: current.quantity || 1,
				duration: current.duration || "Day",
				outdoor_medicine_number: current.outdoor_medicine_number || "",
				doctor_comment: current.doctor_comment || "",
			};
			const existingInstructions =
				current.instructions && current.instructions.length > 0 ? current.instructions : [baseInstruction];
			const toDuplicate =
				typeof instructionIndex === "number" &&
				instructionIndex >= 0 &&
				instructionIndex < existingInstructions.length
					? existingInstructions[instructionIndex]
					: existingInstructions[existingInstructions.length - 1];
			const updatedInstructions = [...existingInstructions, { ...toDuplicate }];
			const updatedMedicine = { ...current, instructions: updatedInstructions };
			const newList = prev.map((m, i) => (i === medicineIndex ? updatedMedicine : m));
			if (typeof update === "function") update(newList);
			return newList;
		});
	};

	const handleDeleteInstruction = (instructionIndex) => {
		setMedicines((prev) => {
			const medicineIndex = index - 1;
			const current = prev[medicineIndex];
			const existingInstructions = current.instructions || [];
			let updatedMedicine = { ...current };
			if (existingInstructions.length > 1) {
				const updatedInstructions = existingInstructions.filter((_, i) => i !== instructionIndex);
				updatedMedicine = { ...current, instructions: updatedInstructions };
			} else {
				const rest = { ...current };
				delete rest.instructions;
				updatedMedicine = rest;
			}
			const newList = prev.map((m, i) => (i === medicineIndex ? updatedMedicine : m));
			if (typeof update === "function") update(newList);
			return newList;
		});
	};

	const openInstructionEdit = (insIndex) => {
		// ensure instructions array exists before editing
		if (!medicine.instructions || medicine.instructions.length === 0) {
			setMedicines((prev) => {
				const medicineIndex = index - 1;
				const current = prev[medicineIndex];
				const seeded = [
					{
						dose_details: current.dose_details || current.dosage || "",
						by_meal: current.by_meal || "",
						quantity: current.quantity || 1,
						duration: current.duration || "Day",
						outdoor_medicine_number: current.outdoor_medicine_number || "",
						doctor_comment: current.doctor_comment || "",
					},
				];
				const updated = prev.map((m, i) => (i === medicineIndex ? { ...current, instructions: seeded } : m));
				if (typeof update === "function") update(updated);
				return updated;
			});
		}
		setEditingInstructionIndex(insIndex);
	};

	const closeInstructionEdit = () => setEditingInstructionIndex(null);

	const handleInstructionFieldChange = (insIndex, field, value) => {
		setMedicines((prev) => {
			const medicineIndex = index - 1;
			const current = prev[medicineIndex];
			const instructions = current.instructions ? [...current.instructions] : [];
			instructions[insIndex] = { ...instructions[insIndex], [field]: value };
			const updatedMedicine = { ...current, instructions };
			const newList = prev.map((medicine, index) => (index === medicineIndex ? updatedMedicine : medicine));
			if (typeof update === "function") update(newList);
			return newList;
		});
	};

	return (
		<Box>
			<Flex justify="space-between" align="center" gap="0">
				<Text fz="14px" mb="es" className="cursor-pointer capitalize">
					{index}. {medicine.medicine_name || medicine.generic}
				</Text>
				<Flex gap="les" justify="flex-end">
					<ActionIcon
						variant="outline"
						color="var(--theme-error-color)"
						onClick={() => handleDelete(index - 1)}
					>
						<IconTrash size={18} stroke={1.5} />
					</ActionIcon>
				</Flex>
			</Flex>
			{mode === "view" ? (
				<Stack gap="es">
					{(medicine.instructions && medicine.instructions.length > 0
						? medicine.instructions
						: [
								{
									dose_details: medicine.dose_details || medicine.dosage || "",
									by_meal: medicine.by_meal || "",
									quantity: medicine.quantity || 1,
									duration: medicine.duration || "Day",
									outdoor_medicine_number: medicine.outdoor_medicine_number || "",
									doctor_comment: medicine.doctor_comment || "",
								},
						  ]
					).map((instruction, insIndex) => {
						const isFirstItem = insIndex === 0;

						return (
							<Flex key={insIndex} ml={isFirstItem ? "md" : "44px"} gap="xs" align="center">
								{isFirstItem && (
									<ActionIcon
										size="xs"
										variant="outline"
										color="var(--theme-primary-color-6)"
										onClick={() => handleAddInstruction(insIndex)}
									>
										<IconPlus size={16} />
									</ActionIcon>
								)}
								{editingInstructionIndex === insIndex ? (
									<Grid spacing="0px" columns={24}>
										<Grid.Col span={4}>
											<Autocomplete
												size="xs"
												label=""
												data={dosage_options}
												value={instruction.dose_details}
												placeholder={t("Dosage")}
												onChange={(v) =>
													handleInstructionFieldChange(insIndex, "dose_details", v)
												}
											/>
										</Grid.Col>
										<Grid.Col span={5}>
											<Autocomplete
												label=""
												size="xs"
												data={by_meal_options}
												value={instruction.by_meal}
												placeholder={t("Timing")}
												onChange={(v) => handleInstructionFieldChange(insIndex, "by_meal", v)}
											/>
										</Grid.Col>
										<Grid.Col span={2}>
											<NumberInput
												size="xs"
												label=""
												value={instruction.quantity}
												placeholder={t("Quantity")}
												onChange={(v) => handleInstructionFieldChange(insIndex, "quantity", v)}
											/>
										</Grid.Col>
										<Grid.Col span={2}>
											<Autocomplete
												size="xs"
												label=""
												data={DURATION_UNIT_OPTIONS}
												value={instruction.duration}
												placeholder={t("Duration")}
												onChange={(v) => handleInstructionFieldChange(insIndex, "duration", v)}
											/>
										</Grid.Col>
										{isFirstItem && (
											<>
												<Grid.Col span={2}>
													<Input
														size="xs"
														label=""
														placeholder={t("OutdoorMedicineNumber")}
														value={instruction.outdoor_medicine_number}
														onChange={(event) =>
															handleInstructionFieldChange(
																insIndex,
																"outdoor_medicine_number",
																event.target.value
															)
														}
													/>
												</Grid.Col>
												<Grid.Col span={4}>
													<Input
														size="xs"
														label=""
														placeholder={t("DoctorComment")}
														value={instruction.doctor_comment}
														onChange={(event) =>
															handleInstructionFieldChange(
																insIndex,
																"doctor_comment",
																event.target.value
															)
														}
													/>
												</Grid.Col>
											</>
										)}
										<Grid.Col span={1}>
											<ActionIcon
												variant="outline"
												color="var(--theme-primary-color-6)"
												onClick={closeInstructionEdit}
											>
												<IconCheck size={16} />
											</ActionIcon>
										</Grid.Col>
									</Grid>
								) : (
									<>
										<Box className="capitalize" fz="xs" c="var(--theme-tertiary-color-8)">
											{instruction.dose_details || instruction.dosage} ---- {instruction.by_meal}{" "}
											---- {instruction.quantity} ---- {instruction.duration}{" "}
											{isFirstItem &&
												`---- ${
													instruction.outdoor_medicine_number || t("NoOutdoorMedicineNumber")
												} ---- ${instruction.doctor_comment || t("NoDoctorComment")}`}
										</Box>

										<Flex align="center">
											<ActionIcon
												variant="transparent"
												color="var(--theme-secondary-color-6)"
												onClick={() => openInstructionEdit(insIndex)}
												ml="md"
											>
												<IconPencil size={18} />
											</ActionIcon>
											{!isFirstItem && (
												<ActionIcon
													variant="transparent"
													color="var(--theme-error-color)"
													onClick={() => handleDeleteInstruction(insIndex)}
												>
													<IconX size={18} stroke={1.5} />
												</ActionIcon>
											)}
										</Flex>
									</>
								)}
							</Flex>
						);
					})}
				</Stack>
			) : (
				<Grid gap="es" columns={20}>
					<Grid.Col span={7}>
						<Autocomplete
							clearable
							size="xs"
							label=""
							data={dosage_options}
							value={medicine.dose_details}
							placeholder={t("Dosage")}
							disabled={mode === "view"}
							onChange={(v) => handleChange("dose_details", v)}
						/>
					</Grid.Col>
					<Grid.Col span={7}>
						<Autocomplete
							clearable
							size="xs"
							label=""
							data={by_meal_options}
							value={medicine.by_meal}
							placeholder={t("Timing")}
							disabled={mode === "view"}
							onChange={(v) => handleChange("by_meal", v)}
						/>
					</Grid.Col>
					<Grid.Col span={3}>
						<NumberInput
							size="xs"
							label=""
							value={medicine.quantity}
							placeholder={t("Quantity")}
							disabled={mode === "view"}
							onChange={(v) => handleChange("quantity", v)}
						/>
					</Grid.Col>
					<Grid.Col span={3}>
						<Autocomplete
							clearable
							size="xs"
							label=""
							data={DURATION_UNIT_OPTIONS}
							value={medicine.duration}
							placeholder={t("Duration")}
							disabled={mode === "view"}
							onChange={(v) => handleChange("duration", v)}
						/>
					</Grid.Col>
				</Grid>
			)}
		</Box>
	);
}
