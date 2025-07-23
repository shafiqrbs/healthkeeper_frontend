import { useState } from "react";
import SelectForm from "@components/form-builders/SelectForm";
import { Box, Button, Group, ActionIcon, Text, Stack, Flex, Grid, ScrollArea, Divider, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheck, IconPencil, IconPlus, IconRestore, IconTrash } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { getMedicineFormInitialValues } from "../prescription/helpers/request";
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

function MedicineListItem({ index, medicine, setMedicines, handleDelete }) {
	const [mode, setMode] = useState("view");

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
	};

	return (
		<Box>
			<Text mb="es">
				{index}. {medicine.generic}
			</Text>
			<Group grow gap="les">
				<Select
					label=""
					data={FREQUENCY_OPTIONS}
					value={medicine.times}
					placeholder="Times"
					disabled={mode === "view"}
					onChange={(v) => handleChange("times", v)}
				/>
				<Select
					label=""
					data={TIMING_OPTIONS}
					value={medicine.timing}
					placeholder="Timing"
					disabled={mode === "view"}
					onChange={(v) => handleChange("timing", v)}
				/>
				<Select
					label=""
					data={DOSAGE_OPTIONS}
					value={medicine.dosage}
					placeholder="Dosage"
					disabled={mode === "view"}
					onChange={(v) => handleChange("dosage", v)}
				/>
				<Select
					label=""
					data={DURATION_UNIT_OPTIONS}
					value={medicine.unit}
					placeholder="Unit"
					disabled={mode === "view"}
					onChange={(v) => handleChange("unit", v)}
				/>
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
						<IconTrash size={18} stroke={1.5} />
					</ActionIcon>
				</Flex>
			</Group>
		</Box>
	);
}

export default function AddMedicineForm() {
	const { t } = useTranslation();
	const form = useForm(getMedicineFormInitialValues());
	const [medicines, setMedicines] = useState([]);
	const [editIndex, setEditIndex] = useState(null);
	const { mainAreaHeight } = useOutletContext();

	const handleChange = (field, value) => {
		form.setFieldValue(field, value);
	};

	const handleAdd = () => {
		if (editIndex !== null) {
			const updated = [...medicines];
			updated[editIndex] = { ...form.values };
			setMedicines(updated);
			setEditIndex(null);
		} else {
			setMedicines([...medicines, { ...form.values }]);
		}
		form.reset();
	};

	const handleDelete = (idx) => {
		setMedicines(medicines.filter((_, i) => i !== idx));
		if (editIndex === idx) {
			form.reset();
			setEditIndex(null);
		}
	};

	return (
		<Box component="form" onSubmit={form.onSubmit(handleAdd)} className="borderRadiusAll" bg="white">
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
							required
							tooltip="Enter brand name"
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
							name="dosage"
							dropdownValue={DOSAGE_OPTIONS}
							value={form.values.dosage}
							changeValue={(v) => handleChange("dosage", v)}
							placeholder="Dosage"
							required
							tooltip="Enter dosage"
						/>
						<SelectForm
							form={form}
							name="times"
							dropdownValue={FREQUENCY_OPTIONS}
							value={form.values.times}
							changeValue={(v) => handleChange("times", v)}
							placeholder="Times"
							required
							tooltip="Enter frequency"
						/>
						<SelectForm
							form={form}
							name="timing"
							dropdownValue={TIMING_OPTIONS}
							value={form.values.timing}
							changeValue={(v) => handleChange("timing", v)}
							placeholder="Timing"
							required
							tooltip="Enter meditation duration"
						/>
						<SelectForm
							form={form}
							label=""
							name="meditationDuration"
							dropdownValue={MEDITATION_DURATION}
							value={form.values.meditationDuration}
							changeValue={(v) => handleChange("meditationDuration", v)}
							placeholder="Meditation Duration"
							required
							tooltip="Enter meditation duration"
						/>
						<SelectForm
							form={form}
							name="unit"
							dropdownValue={DURATION_UNIT_OPTIONS}
							value={form.values.unit}
							changeValue={(v) => handleChange("unit", v)}
							placeholder="Unit"
							required
							tooltip="Enter duration unit"
						/>
						<Button
							leftSection={<IconPlus size={16} />}
							type="submit"
							variant="filled"
							bg="var(--theme-primary-color-6)"
						>
							Add
						</Button>
					</Group>
				</Group>
			</Box>

			<Box bg="white" px="sm" mt="xxs">
				<Grid columns={19}>
					<Grid.Col span={6}>
						<Text fz="xs">1. Napa</Text>
						<Text fz="xs">2. Paracetamol</Text>
					</Grid.Col>
					<Divider orientation="vertical" />
					<Grid.Col span={6}>
						<Text fz="xs">Brand name: </Text>
						<Text fz="xs">Strength: </Text>
						<Text fz="xs">Form: </Text>
					</Grid.Col>
					<Divider orientation="vertical" />
					<Grid.Col span={6}>
						<Text fz="xs" className="truncate-lines">
							It is a long established fact that a reader will be distracted by the readable content of a
							page when looking.
						</Text>
					</Grid.Col>
				</Grid>
			</Box>

			<Text fw={500} mb="les" px="sm" py="les" bg="var(--theme-primary-color-0)" mt="sm">
				List of Medicines
			</Text>
			<ScrollArea h={mainAreaHeight - 462} bg="white">
				<Stack gap="xs" p="sm">
					{medicines.map((medicine, index) => (
						<MedicineListItem
							key={index}
							index={index + 1}
							medicine={medicine}
							setMedicines={setMedicines}
							handleDelete={handleDelete}
						/>
					))}
				</Stack>
			</ScrollArea>

			{/* =================== Advise form =================== */}
			<Grid columns={12} gutter="xxxs" mt="xxs" p="les">
				<Grid.Col span={6}>
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
				<Grid.Col span={6}>
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
								disabled
							/>
							<InputForm
								form={form}
								label=""
								tooltip="Discount on test (%)"
								name="testPercent"
								value={form.values.testPercent}
								changeValue={(v) => handleChange("testPercent", v)}
								placeholder="Test (%)"
								disabled
							/>
						</Group>
					</Box>
				</Grid.Col>
			</Grid>

			{/* =================== button group =================== */}
			<Button.Group bg="var(--theme-primary-color-0)" p="les">
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
