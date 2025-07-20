import SelectForm from "@components/form-builders/SelectForm";
import { Box, Button, Group, ActionIcon, Text, Stack, Flex, Grid, ScrollArea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPencil, IconRestore, IconTrash, IconX } from "@tabler/icons-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { getMedicineFormInitialValues } from "../helpers/request";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import DatePickerForm from "@components/form-builders/DatePicker";
import InputForm from "@components/form-builders/InputForm";
import { useOutletContext } from "react-router-dom";
import InputAutoComplete from "@components/form-builders/InputAutoComplete";

const GENERIC_OPTIONS = ["Napa", "Paracetamol", "Paracetamol (Doxylamin)", "Paracetamol (Acetaminophen)"];
const BRAND_OPTIONS = [
	{ value: "napa", label: "Napa" },
	{ value: "ace", label: "Ace" },
];
const DOSAGE_OPTIONS = [
	{ value: "1 tab", label: "1 Tablet" },
	{ value: "2 tab", label: "2 Tablets" },
	{ value: "1 spoon", label: "1 Spoon" },
	{ value: "2 spoons", label: "2 Spoons" },
	{ value: "1 syringe", label: "1 Syringe" },
];
const FREQUENCY_OPTIONS = [
	{ value: "1", label: "1 time" },
	{ value: "2", label: "2 times" },
	{ value: "3", label: "3 times" },
];
const MEDITATION_DURATION = [
	{ value: "day", label: "Day" },
	{ value: "month", label: "Month" },
	{ value: "year", label: "Year" },
];
const TIMING_OPTIONS = [
	{ value: "before", label: "30 min B" },
	{ value: "after", label: "30 min A" },
];
const DURATION_UNIT_OPTIONS = [
	{ value: "day", label: "Day" },
	{ value: "week", label: "Week" },
	{ value: "month", label: "Month" },
	{ value: "year", label: "Year" },
];

function MedicineListItem({ index, form, handleAdd, handleChange }) {
	const [editMode, setEditMode] = useState(false);

	const handleEdit = () => {
		setEditMode(true);
	};

	const handleCancelEdit = () => {
		setEditMode(false);
	};

	const handleSave = () => {
		setEditMode(false);
	};

	return (
		<Box>
			<Text mb="es">{index}. Napa</Text>
			<Group grow gap="les">
				<SelectForm
					form={form}
					label=""
					dropdownValue={FREQUENCY_OPTIONS}
					value={form.values.frequency}
					changeValue={(v) => handleChange("frequency", v)}
					placeholder="Times"
					disabled={!editMode}
				/>
				<SelectForm
					form={form}
					label=""
					dropdownValue={TIMING_OPTIONS}
					value={form.values.timing}
					changeValue={(v) => handleChange("timing", v)}
					placeholder="Timing"
					disabled={!editMode}
				/>
				<SelectForm
					form={form}
					label=""
					dropdownValue={MEDITATION_DURATION}
					value={form.values.meditationDuration}
					changeValue={(v) => handleChange("meditationDuration", v)}
					placeholder="Meditation Duration"
					disabled={!editMode}
				/>
				<SelectForm
					form={form}
					label=""
					dropdownValue={DURATION_UNIT_OPTIONS}
					value={form.values.durationUnit}
					changeValue={(v) => handleChange("durationUnit", v)}
					placeholder="Unit"
					disabled={!editMode}
				/>
				<Flex gap="les" justify="flex-end">
					<ActionIcon variant="outline" color="var(--theme-tertiary-color-6)" onClick={handleCancelEdit}>
						<IconX size={18} stroke={1.5} />
					</ActionIcon>
					<ActionIcon variant="outline" color="var(--theme-primary-color-6)" onClick={handleEdit}>
						<IconPencil size={18} stroke={1.5} />
					</ActionIcon>
					<ActionIcon variant="outline" color="var(--theme-error-color)">
						<IconTrash size={18} stroke={1.5} />
					</ActionIcon>
				</Flex>
			</Group>
		</Box>
	);
}

export default function AddMedicineForm() {
	const { t } = useTranslation();
	const form = useForm(getMedicineFormInitialValues(t));
	const [medicines, setMedicines] = useState([]);
	const [editIndex, setEditIndex] = useState(null);
	const { mainAreaHeight } = useOutletContext();
	const handleChange = (field, value) => {
		form.setFieldValue(field, value);
	};

	const handleAdd = () => {
		if (
			!form.generic ||
			!form.brand ||
			!form.dosage ||
			!form.frequency ||
			!form.timing ||
			!form.duration ||
			!form.durationUnit
		)
			return;
		if (editIndex !== null) {
			// Edit mode
			const updated = [...medicines];
			updated[editIndex] = { ...form };
			setMedicines(updated);
			setEditIndex(null);
		} else {
			setMedicines([...medicines, { ...form }]);
		}
		form.reset();
	};

	const handleEdit = (idx) => {
		form.setValues(medicines[idx]);
		setEditIndex(idx);
	};

	const handleDelete = (idx) => {
		setMedicines(medicines.filter((_, i) => i !== idx));
		if (editIndex === idx) {
			form.reset();
			setEditIndex(null);
		}
	};

	return (
		<Box bg="white" className="borderRadiusAll">
			<Box bg="var(--theme-primary-color-0)" p="sm">
				<Group align="end" gap="les">
					<Group grow w="100%" gap="les">
						<SelectForm
							form={form}
							name="brand"
							dropdownValue={BRAND_OPTIONS}
							value={form.values.brand}
							changeValue={(v) => handleChange("brand", v)}
							placeholder="Brand name"
						/>
						<InputAutoComplete
							tooltip="Enter generic name"
							form={form}
							name="generic"
							data={GENERIC_OPTIONS}
							value={form.values.generic}
							changeValue={(v) => handleChange("generic", v)}
							placeholder="Generic name"
						/>
					</Group>
					<Group grow gap="les" w="100%">
						<SelectForm
							form={form}
							dropdownValue={DOSAGE_OPTIONS}
							value={form.values.dosage}
							changeValue={(v) => handleChange("dosage", v)}
							placeholder="Dosage"
						/>
						<SelectForm
							form={form}
							dropdownValue={FREQUENCY_OPTIONS}
							value={form.values.frequency}
							changeValue={(v) => handleChange("frequency", v)}
							placeholder="Times"
						/>
						<SelectForm
							form={form}
							dropdownValue={TIMING_OPTIONS}
							value={form.values.timing}
							changeValue={(v) => handleChange("timing", v)}
							placeholder="Timing"
						/>
						<SelectForm
							form={form}
							label=""
							dropdownValue={MEDITATION_DURATION}
							value={form.values.meditationDuration}
							changeValue={(v) => handleChange("meditationDuration", v)}
							placeholder="Meditation Duration"
						/>
						<SelectForm
							form={form}
							dropdownValue={DURATION_UNIT_OPTIONS}
							value={form.values.durationUnit}
							changeValue={(v) => handleChange("durationUnit", v)}
							placeholder="Unit"
						/>
						<Button onClick={handleAdd} variant="filled" bg="var(--theme-primary-color-6)">
							{editIndex !== null ? "Update" : "Add"}
						</Button>
					</Group>
				</Group>
			</Box>
			<Text fw={500} mb={8} px="sm" py="les" bg="var(--theme-primary-color-0)" mt="md">
				List of Medicines
			</Text>
			<ScrollArea h={mainAreaHeight - 382}>
				<Stack gap="xs" p="sm">
					{/* {medicines.map((medicine, index) => ( */}
					<MedicineListItem index={1} form={form} handleChange={handleChange} handleAdd={handleAdd} />
					<MedicineListItem index={2} form={form} handleChange={handleChange} handleAdd={handleAdd} />
					{/* ))} */}
				</Stack>
			</ScrollArea>

			{/* =================== Advise form =================== */}
			<Grid columns={12} gutter="sm" mt="xxs">
				<Grid.Col span={7}>
					<Box bg="var(--theme-primary-color-0)" fz="md" c="white">
						<Text bg="var(--theme-secondary-color-9)" fz="md" c="white" px="sm" py="les">
							Advise
						</Text>
						<Box p="sm">
							<TextAreaForm
								form={form}
								label=""
								value={form.values.advise}
								name="advise"
								handleChange={(v) => handleChange("advise", v)}
								placeholder="Write a advice..."
								showRightSection={false}
								style={{ input: { height: "92px" } }}
							/>
						</Box>
					</Box>
				</Grid.Col>
				<Grid.Col span={5}>
					<Box bg="var(--theme-primary-color-0)" p="sm">
						<DatePickerForm
							form={form}
							label={t("followUpDate")}
							tooltip="Enter follow up date"
							name="followUpDate"
							value={form.values.followUpDate}
							handleChange={(v) => handleChange("followUpDate", v)}
							placeholder="Follow up date"
						/>
						<Text mt="xs" fz="sm">
							{t("specialDiscount")}
						</Text>
						<Group grow gap="sm">
							<InputForm
								form={form}
								label=""
								tooltip="Discount on visit (%)"
								name="visitPercent"
								value={form.values.visitPercent}
								changeValue={(v) => handleChange("visitPercent", v)}
								placeholder="Visit (%)"
							/>
							<InputForm
								form={form}
								label=""
								tooltip="Discount on test (%)"
								name="testPercent"
								value={form.values.testPercent}
								changeValue={(v) => handleChange("testPercent", v)}
								placeholder="Test (%)"
							/>
						</Group>
					</Box>
				</Grid.Col>
			</Grid>

			{/* =================== button group =================== */}
			<Button.Group bg="var(--theme-primary-color-0)">
				<Button w="100%" bg="var(--theme-reset-btn-color)" leftSection={<IconRestore size={16} />}>
					{t("reset")}
				</Button>
				<Button w="100%" bg="var(--theme-hold-btn-color)">
					{t("Hold")}
				</Button>
				<Button w="100%" bg="var(--theme-prescription-btn-color)">
					{t("prescription")}
				</Button>
				<Button w="100%" bg="var(--theme-print-btn-color)">
					{t("a4Print")}
				</Button>
				<Button w="100%" bg="var(--theme-pos-btn-color)">
					{t("Pos")}
				</Button>
				<Button w="100%" bg="var(--theme-save-btn-color)">
					{t("Save")}
				</Button>
			</Button.Group>
		</Box>
	);
}
