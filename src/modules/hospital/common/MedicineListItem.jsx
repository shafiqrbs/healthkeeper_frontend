import { showNotificationComponent } from "@components/core-component/showNotificationComponent";
import { ActionIcon, Box, Flex, Grid, Input, NumberInput, Select, Stack, Switch, Text } from "@mantine/core";
import { IconCheck, IconMedicineSyrup, IconPencil, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import { getByMeal, getDosage } from "@utils/prescription";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const DURATION_UNIT_OPTIONS = [
	{ value: "day", label: "Day" },
	{ value: "week", label: "Week" },
	{ value: "month", label: "Month" },
	{ value: "year", label: "Year" },
];

export default function MedicineListItem({
	ignoreOpdQuantityLimit = false,
	by_meal_options,
	dosage_options,
	index,
	medicine,
	setMedicines,
	handleDelete,
	update,
	type = "opd",
}) {
	const { t } = useTranslation();
	const [mode] = useState("view");
	const [editingInstructionIndex, setEditingInstructionIndex] = useState(null);
	const [viewAction, setViewAction] = useState(true);
	const isOpdType = type === "opd";

	const handleChange = (field, value) => {
		if (field === "opd_quantity" && !ignoreOpdQuantityLimit && isOpdType) {
			if (value > medicine.opd_limit) {
				showNotificationComponent(t("QuantityCannotBeGreaterThanOpdQuantity"), "error", "", "", "", 3000);
				return;
			}
		}

		setMedicines((prev) =>
			prev.map((medicine, idx) => (idx === index - 1 ? { ...medicine, [field]: value } : medicine))
		);
	};

	const handleAddInstruction = (instructionIndex) => {
		setMedicines((prev) => {
			const medicineIndex = index - 1;
			const current = prev[medicineIndex];

			const byMeal = getByMeal(by_meal_options, current?.medicine_bymeal_id);
			const dosage = getDosage(dosage_options, current?.medicine_dosage_id);

			const baseInstruction = {
				medicine_dosage_id: current?.medicine_dosage_id || "",
				medicine_bymeal_id: current?.medicine_bymeal_id || "",
				dose_details: dosage?.name || "",
				dose_details_bn: dosage?.name_bn || "",
				by_meal: byMeal?.name || "",
				by_meal_bn: byMeal?.name_bn || "",
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

			const newList = prev.map((medicine, index) => (index === medicineIndex ? updatedMedicine : medicine));

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
				const byMeal = getByMeal(by_meal_options, current?.medicine_bymeal_id);
				const dosage = getDosage(dosage_options, current?.medicine_dosage_id);

				const seeded = [
					{
						medicine_dosage_id: current?.medicine_dosage_id || "",
						medicine_bymeal_id: current?.medicine_bymeal_id || "",
						dose_details: dosage?.name || "",
						dose_details_bn: dosage?.name_bn || "",
						by_meal: byMeal?.name || "",
						by_meal_bn: byMeal?.name_bn || "",
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
				const byMeal = getByMeal(by_meal_options, value);

				dosages[insIndex] = {
					...dosages[insIndex],
					[field]: value,
					by_meal: byMeal?.name || "",
					by_meal_bn: byMeal?.name_bn || "",
				};
			} else if (field === "medicine_dosage_id") {
				const dosage = getDosage(dosage_options, value);

				dosages[insIndex] = {
					...dosages[insIndex],
					[field]: value,
					dose_details: dosage?.name || "",
					dose_details_bn: dosage?.name_bn || "",
				};
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
				{type === "ipd" && medicine.id ? (
					<Switch
						size="md"
						onLabel="ON"
						color="teal"
						offLabel="OFF"
						checked={medicine.is_active}
						onChange={(e) => handleChange("is_active", e.currentTarget.checked)}
						radius="sm"
						thumbIcon={
							medicine.is_active ? (
								<IconCheck size={12} color="var(--mantine-color-teal-6)" stroke={3} />
							) : (
								<IconX size={12} color="var(--mantine-color-red-6)" stroke={3} />
							)
						}
					/>
				) : (
					<Flex gap="les" justify="flex-end">
						<ActionIcon
							variant="outline"
							color="var(--theme-error-color)"
							onClick={() => handleDelete(index - 1)}
						>
							<IconTrash size={18} stroke={1.5} />
						</ActionIcon>
					</Flex>
				)}
			</Flex>
			{mode === "view" ? (
				<Stack gap="es">
					{(medicine.dosages && medicine.dosages.length > 0
						? medicine.dosages
						: [
								{
									medicine_dosage_id: medicine?.medicine_dosage_id || "",
									medicine_bymeal_id: medicine?.medicine_bymeal_id || "",
									dose_details: getDosage(dosage_options, medicine?.medicine_dosage_id)?.name || "",
									dose_details_bn:
										getDosage(dosage_options, medicine?.medicine_dosage_id)?.name_bn || "",
									by_meal: getByMeal(by_meal_options, medicine?.medicine_bymeal_id)?.name || "",
									by_meal_bn: getByMeal(by_meal_options, medicine?.medicine_bymeal_id)?.name_bn || "",
									quantity: medicine.quantity || 1,
									duration: medicine.duration || "Day",
								},
						  ]
					).map((instruction, insIndex) => {
						const isFirstItem = insIndex === 0;
						const isMedicine = !!medicine.medicine_id;

						return (
							<Flex key={insIndex} ml={isFirstItem ? "md" : "44px"} gap="xs" align="center">
								{isFirstItem && isOpdType && (
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
										<Grid.Col span={isOpdType ? 5 : 8}>
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
										<Grid.Col span={isOpdType ? 5 : 8}>
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
										{isOpdType && (
											<>
												<Grid.Col span={3}>
													<NumberInput
														size="xs"
														label=""
														value={instruction.quantity}
														placeholder={t("Quantity")}
														onChange={(v) =>
															handleInstructionFieldChange(insIndex, "quantity", v)
														}
													/>
												</Grid.Col>
												<Grid.Col span={3}>
													<Select
														size="xs"
														label=""
														data={DURATION_UNIT_OPTIONS}
														value={instruction.duration?.toLowerCase()}
														placeholder={t("Duration")}
														onChange={(v) =>
															handleInstructionFieldChange(insIndex, "duration", v)
														}
													/>
												</Grid.Col>
											</>
										)}
										{isFirstItem && isOpdType && isMedicine && (
											<>
												<Grid.Col span={2}>
													<Input
														size="xs"
														label=""
														type="number"
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
											{isOpdType && `---- ${instruction.quantity} ---- ${instruction.duration}`}
											{isFirstItem && isMedicine && isOpdType && (
												<>
													{medicine.opd_quantity ?? `---- ${medicine.opd_quantity}`}
													{medicine.doctor_comment && `---- ${medicine.doctor_comment}`}
												</>
											)}
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
