import { showNotificationComponent } from "@/common/components/core-component/showNotificationComponent";
import { ActionIcon, Box, Flex, Grid, Input, NumberInput, Select, Stack, Text } from "@mantine/core";
import { IconCheck, IconMedicineSyrup, IconPencil, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
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
	medicine,
	setMedicines,
	handleDelete,
	update,
}) {
	const { t } = useTranslation();
	const [mode] = useState("view");
	const [editingInstructionIndex, setEditingInstructionIndex] = useState(null);
	const [viewAction, setViewAction] = useState(true);

	const handleChange = (field, value) => {
		if (field === "opd_quantity") {
			console.log("Value: ", value, "Restrict Opd Quantity: ", medicine.opd_limit);
			if (value > medicine.opd_limit) {
				showNotificationComponent(t("OpdQuantityCannotBeGreaterThanOpdQuantity"), "error");
				return;
			}
		}
		setMedicines((prev) => prev.map((m, i) => (i === index - 1 ? { ...m, [field]: value } : m)));
	};

	const getByMeal = (id) => {
		return by_meal_options?.find((item) => item.id?.toString() == id)?.name;
	};

	const getDosage = (id) => {
		return dosage_options?.find((item) => item.id?.toString() == id)?.name;
	};

	const handleAddInstruction = (instructionIndex) => {
		setMedicines((prev) => {
			const medicineIndex = index - 1;
			const current = prev[medicineIndex];
			const baseInstruction = {
				medicine_dosage_id: current?.medicine_dosage_id || "",
				medicine_bymeal_id: current?.medicine_bymeal_id || "",
				dose_details: getDosage(current?.medicine_dosage_id) || "",
				by_meal: getByMeal(current?.medicine_bymeal_id) || "",
				quantity: current.quantity || 1,
				duration: current.duration || "Day",
			};
			const existingDosages = current.dosages && current.dosages.length > 0 ? current.dosages : [baseInstruction];
			const toDuplicate =
				typeof instructionIndex === "number" &&
				instructionIndex >= 0 &&
				instructionIndex < existingDosages.length
					? existingDosages[instructionIndex]
					: existingDosages[existingDosages.length - 1];
			const updatedDosages = [...existingDosages, { ...toDuplicate }];
			const updatedMedicine = { ...current, dosages: updatedDosages };
			const newList = prev.map((m, i) => (i === medicineIndex ? updatedMedicine : m));
			if (typeof update === "function") update(newList);
			return newList;
		});
	};

	const handleDeleteInstruction = (instructionIndex) => {
		setMedicines((prev) => {
			const medicineIndex = index - 1;
			const current = prev[medicineIndex];
			const existingDosages = current.dosages || [];
			let updatedMedicine = { ...current };
			if (existingDosages.length > 1) {
				const updatedDosages = existingDosages.filter((_, i) => i !== instructionIndex);
				updatedMedicine = { ...current, dosages: updatedDosages };
			} else {
				const rest = { ...current };
				delete rest.dosages;
				updatedMedicine = rest;
			}
			const newList = prev.map((m, i) => (i === medicineIndex ? updatedMedicine : m));
			if (typeof update === "function") update(newList);
			return newList;
		});
	};

	const openInstructionEdit = (insIndex) => {
		// ensure dosages array exists before editing
		if (!medicine.dosages || medicine.dosages.length === 0) {
			setMedicines((prev) => {
				const medicineIndex = index - 1;
				const current = prev[medicineIndex];
				const seeded = [
					{
						medicine_dosage_id: current?.medicine_dosage_id || "",
						medicine_bymeal_id: current?.medicine_bymeal_id || "",
						dose_details: getDosage(current?.medicine_dosage_id) || "",
						by_meal: getByMeal(current?.medicine_bymeal_id) || "",
						quantity: current.quantity || 1,
						duration: current.duration || "Day",
					},
				];
				const updated = prev.map((m, i) => (i === medicineIndex ? { ...current, dosages: seeded } : m));
				if (typeof update === "function") update(updated);
				return updated;
			});
		}
		setEditingInstructionIndex(insIndex);
	};

	const closeInstructionEdit = () => {
		setEditingInstructionIndex(null);
		if (update) update();
	};

	const handleInstructionFieldChange = (insIndex, field, value) => {
		setMedicines((prev) => {
			const medicineIndex = index - 1;
			const current = prev[medicineIndex];
			const dosages = current.dosages ? [...current.dosages] : [];

			if (field === "medicine_bymeal_id") {
				const by_meal = getByMeal(value);
				dosages[insIndex] = { ...dosages[insIndex], [field]: value, by_meal };
			} else if (field === "medicine_dosage_id") {
				const dose_details = getDosage(value);
				dosages[insIndex] = { ...dosages[insIndex], [field]: value, dose_details };
			} else {
				dosages[insIndex] = { ...dosages[insIndex], [field]: value };
			}

			const updatedMedicine = { ...current, dosages };
			const newList = prev.map((medicine, index) => (index === medicineIndex ? updatedMedicine : medicine));
			return newList;
		});
	};

	return (
		<Box>
			<Flex justify="space-between" align="center" gap="0">
				<Flex align="center" gap="es">
					<IconMedicineSyrup stroke={1.5} size={20} />
					<Text fz="14px" className="cursor-pointer capitalize">
						{medicine.medicine_name || medicine.generic}
					</Text>
				</Flex>
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
					{(medicine.dosages && medicine.dosages.length > 0
						? medicine.dosages
						: [
								{
									medicine_dosage_id: medicine?.medicine_dosage_id || "",
									medicine_bymeal_id: medicine?.medicine_bymeal_id || "",
									dose_details: getDosage(medicine?.medicine_dosage_id) || "",
									by_meal: getByMeal(medicine?.medicine_bymeal_id) || "",
									quantity: medicine.quantity || 1,
									duration: medicine.duration || "Day",
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
									<Grid gutter="les" columns={24}>
										<Grid.Col span={5}>
											<Select
												size="xs"
												label=""
												data={dosage_options?.map((dosage) => ({
													value: dosage.id?.toString(),
													label: dosage.name,
												}))}
												value={instruction?.medicine_dosage_id?.toString()}
												placeholder={t("Dosage")}
												onChange={(v) =>
													handleInstructionFieldChange(insIndex, "medicine_dosage_id", v)
												}
											/>
										</Grid.Col>
										<Grid.Col span={5}>
											<Select
												label=""
												size="xs"
												data={by_meal_options?.map((byMeal) => ({
													value: byMeal.id?.toString(),
													label: byMeal.name,
												}))}
												value={instruction.medicine_bymeal_id?.toString()}
												placeholder={t("Timing")}
												onChange={(v) =>
													handleInstructionFieldChange(insIndex, "medicine_bymeal_id", v)
												}
											/>
										</Grid.Col>
										<Grid.Col span={3}>
											<NumberInput
												size="xs"
												label=""
												value={instruction.quantity}
												placeholder={t("Quantity")}
												onChange={(v) => handleInstructionFieldChange(insIndex, "quantity", v)}
											/>
										</Grid.Col>
										<Grid.Col span={3}>
											<Select
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
														value={medicine.opd_quantity}
														onChange={(event) =>
															handleChange("opd_quantity", event.target.value)
														}
													/>
												</Grid.Col>
												<Grid.Col span={4}>
													<Input
														size="xs"
														label=""
														placeholder={t("DoctorComment")}
														value={medicine.doctor_comment}
														onChange={(event) =>
															handleChange("doctor_comment", event.target.value)
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
										<Box
											onMouseEnter={() => setViewAction(true)}
											onMouseLeave={() => setViewAction(true)}
											className="capitalize"
											fz="xs"
											c="var(--theme-tertiary-color-8)"
										>
											{instruction?.dose_details || instruction.dosage} ---- {instruction.by_meal}{" "}
											---- {instruction.quantity} ---- {instruction.duration}{" "}
											{isFirstItem &&
												`---- ${medicine.opd_quantity || t("NoOutdoorMedicineNumber")} ---- ${
													medicine.doctor_comment || t("NoDoctorComment")
												}`}
										</Box>

										<Flex align="center" display={viewAction ? "flex" : "none"}>
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
						<Select
							size="xs"
							label=""
							data={dosage_options?.map((dosage) => ({
								value: dosage.id?.toString(),
								label: dosage.name,
							}))}
							value={medicine?.medicine_dosage_id?.toString()}
							placeholder={t("Dosage")}
							disabled={mode === "view"}
							onChange={(v) => handleChange("medicine_dosage_id", v)}
						/>
					</Grid.Col>
					<Grid.Col span={7}>
						<Select
							size="xs"
							label=""
							data={by_meal_options?.map((byMeal) => ({
								value: byMeal.id?.toString(),
								label: byMeal.name,
							}))}
							value={medicine.medicine_bymeal_id?.toString()}
							placeholder={t("Timing")}
							disabled={mode === "view"}
							onChange={(v) => handleChange("medicine_bymeal_id", v)}
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
						<Select
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
