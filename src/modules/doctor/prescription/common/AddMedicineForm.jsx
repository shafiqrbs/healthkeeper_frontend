import { Box, Button, Group, Select, NumberInput, Table, ActionIcon, Text, Divider } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import React, { useState } from "react";

const GENERIC_OPTIONS = [
	{ value: "napa", label: "Napa" },
	{ value: "paracetamol", label: "Paracetamol (Acetaminophen)" },
];
const BRAND_OPTIONS = [
	{ value: "napa", label: "Napa" },
	{ value: "ace", label: "Ace" },
];
const DOSAGE_OPTIONS = [
	{ value: "1 tab", label: "1 Tab" },
	{ value: "2 tab", label: "2 Tab" },
];
const FREQUENCY_OPTIONS = [
	{ value: "1", label: "1 time" },
	{ value: "2", label: "2 times" },
	{ value: "3", label: "3 times" },
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

export default function AddMedicineForm() {
	const [form, setForm] = useState({
		generic: "",
		brand: "",
		dosage: "",
		frequency: "",
		timing: "",
		duration: "",
		durationUnit: "",
	});
	const [medicines, setMedicines] = useState([]);
	const [editIndex, setEditIndex] = useState(null);

	const handleChange = (field, value) => {
		setForm((prev) => ({ ...prev, [field]: value }));
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
		setForm({ generic: "", brand: "", dosage: "", frequency: "", timing: "", duration: "", durationUnit: "" });
	};

	const handleEdit = (idx) => {
		setForm(medicines[idx]);
		setEditIndex(idx);
	};

	const handleDelete = (idx) => {
		setMedicines(medicines.filter((_, i) => i !== idx));
		if (editIndex === idx) {
			setForm({ generic: "", brand: "", dosage: "", frequency: "", timing: "", duration: "", durationUnit: "" });
			setEditIndex(null);
		}
	};

	return (
		<Box bg="white" p="sm" className="borderRadiusAll">
			<Group align="end" mb="md">
				<Select
					label="Generic name"
					data={GENERIC_OPTIONS}
					value={form.generic}
					onChange={(v) => handleChange("generic", v)}
					placeholder="Generic name"
					w={150}
				/>
				<Select
					label="Brand name"
					data={BRAND_OPTIONS}
					value={form.brand}
					onChange={(v) => handleChange("brand", v)}
					placeholder="Brand name"
					w={150}
				/>
				<Select
					label="Dosage"
					data={DOSAGE_OPTIONS}
					value={form.dosage}
					onChange={(v) => handleChange("dosage", v)}
					placeholder="Dosage"
					w={100}
				/>
				<Select
					label="Frequency"
					data={FREQUENCY_OPTIONS}
					value={form.frequency}
					onChange={(v) => handleChange("frequency", v)}
					placeholder="Times"
					w={100}
				/>
				<Select
					label="Timing"
					data={TIMING_OPTIONS}
					value={form.timing}
					onChange={(v) => handleChange("timing", v)}
					placeholder="Timing"
					w={120}
				/>
				<NumberInput
					label="Duration"
					value={form.duration}
					onChange={(v) => handleChange("duration", v)}
					min={1}
					w={80}
				/>
				<Select
					label="Unit"
					data={DURATION_UNIT_OPTIONS}
					value={form.durationUnit}
					onChange={(v) => handleChange("durationUnit", v)}
					placeholder="Unit"
					w={100}
				/>
				<Button onClick={handleAdd} variant="filled" color="blue">
					{editIndex !== null ? "Update" : "Add"}
				</Button>
			</Group>
			<Divider my="sm" />
			<Text fw={500} mb={8}>
				List of Medicines
			</Text>
			<Table striped>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>S/N</Table.Th>
						<Table.Th>Generic</Table.Th>
						<Table.Th>Brand</Table.Th>
						<Table.Th>Dosage</Table.Th>
						<Table.Th>Frequency</Table.Th>
						<Table.Th>Timing</Table.Th>
						<Table.Th>Duration</Table.Th>
						<Table.Th>Actions</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{medicines.length === 0 && (
						<Table.Tr>
							<Table.Td colSpan={8}>
								<Text c="dimmed" align="center">
									No medicines added
								</Text>
							</Table.Td>
						</Table.Tr>
					)}
					{medicines.map((med, idx) => (
						<Table.Tr key={idx}>
							<Table.Td>{idx + 1}</Table.Td>
							<Table.Td>
								{GENERIC_OPTIONS.find((o) => o.value === med.generic)?.label || med.generic}
							</Table.Td>
							<Table.Td>{BRAND_OPTIONS.find((o) => o.value === med.brand)?.label || med.brand}</Table.Td>
							<Table.Td>{med.dosage}</Table.Td>
							<Table.Td>
								{FREQUENCY_OPTIONS.find((o) => o.value === med.frequency)?.label || med.frequency}
							</Table.Td>
							<Table.Td>
								{TIMING_OPTIONS.find((o) => o.value === med.timing)?.label || med.timing}
							</Table.Td>
							<Table.Td>
								{med.duration}{" "}
								{DURATION_UNIT_OPTIONS.find((o) => o.value === med.durationUnit)?.label ||
									med.durationUnit}
							</Table.Td>
							<Table.Td>
								<Group gap={4}>
									<ActionIcon color="blue" variant="light" onClick={() => handleEdit(idx)}>
										<IconPencil size={16} />
									</ActionIcon>
									<ActionIcon color="red" variant="light" onClick={() => handleDelete(idx)}>
										<IconTrash size={16} />
									</ActionIcon>
								</Group>
							</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
		</Box>
	);
}
