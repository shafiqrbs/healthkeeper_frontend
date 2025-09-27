import {
	ActionIcon,
	Autocomplete,
	Box,
	Button,
	Flex,
	Grid,
	Group,
	NumberInput,
	ScrollArea,
	Select,
	Stack,
	Text,
} from "@mantine/core";
import { useOutletContext, useParams } from "react-router-dom";
import SelectForm from "@/common/components/form-builders/SelectForm";
import InputNumberForm from "@/common/components/form-builders/InputNumberForm";
import { IconCheck, IconPencil, IconPlus, IconX } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import useGlobalDropdownData from "@/common/hooks/dropdown/useGlobalDropdownData";
import { HOSPITAL_DROPDOWNS } from "@/app/store/core/utilitySlice";
import { useDebouncedState } from "@mantine/hooks";
import useMedicineData from "@/common/hooks/useMedicineData";
import useMedicineGenericData from "@/common/hooks/useMedicineGenericData";
import { getMedicineFormInitialValues } from "../../helpers/request";
import { useForm } from "@mantine/form";
import TabsActionButtons from "@/modules/hospital/common/TabsActionButtons";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { updateEntityData } from "@/app/store/core/crudThunk";
import { successNotification } from "@/common/components/notification/successNotification";
import { errorNotification } from "@/common/components/notification/errorNotification";
import { useDispatch } from "react-redux";

const DURATION_OPTIONS = [
	// { value: "", label: "--Select Duration--" },
	{ value: "day", label: "Day" },
	{ value: "month", label: "Month" },
];

const DURATION_UNIT_OPTIONS = [
	{ value: "day", label: "Day" },
	{ value: "week", label: "Week" },
	{ value: "month", label: "Month" },
	{ value: "year", label: "Year" },
];

function MedicineListItem({ index, medicine, setMedicines, handleDelete }) {
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
		setMedicines((prev) =>
			prev.map((medicine, i) => (i === index - 1 ? { ...medicine, [field]: value } : medicine))
		);
	};

	const handleEdit = () => {
		setMedicines((prev) => prev.map((medicine, i) => (i === index - 1 ? { ...medicine, ...medicine } : medicine)));
		closeEditMode();
	};

	return (
		<Box>
			<Text mb="es" style={{ cursor: "pointer" }}>
				{index}. {medicine.medicine_name || medicine.generic}
			</Text>
			<Flex justify="space-between" align="center" gap="0">
				{mode === "view" ? (
					<Box ml="md" fz="xs" c="var(--theme-tertiary-color-8)">
						{medicine.dose_details} ---- {medicine.by_meal} ---- {medicine.duration} ----{" "}
						{medicine.quantity}
					</Box>
				) : (
					<Grid columns={24} gutter="xs">
						<Grid.Col span={7}>
							<Autocomplete
								clearable
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
								label=""
								data={by_meal_options}
								value={medicine.by_meal}
								placeholder={t("Timing")}
								disabled={mode === "view"}
								onChange={(v) => handleChange("by_meal", v)}
							/>
						</Grid.Col>

						<Grid.Col span={3}>
							<Select
								label=""
								data={DURATION_UNIT_OPTIONS}
								value={medicine.duration}
								placeholder={t("Duration")}
								disabled={mode === "view"}
								onChange={(v) => handleChange("duration", v)}
							/>
						</Grid.Col>
						<Grid.Col span={3}>
							<NumberInput
								label=""
								value={medicine.quantity}
								placeholder={t("Quantity")}
								disabled={mode === "view"}
								onChange={(v) => handleChange("quantity", v)}
							/>
						</Grid.Col>
					</Grid>
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

export default function Medicine() {
	const [medicines, setMedicines] = useState([]);
	const [updateKey, setUpdateKey] = useState(0);
	const { id } = useParams();
	const { t } = useTranslation();
	const [medicineTerm, setMedicineTerm] = useDebouncedState("", 300);
	const [medicineGenericTerm, setMedicineGenericTerm] = useDebouncedState("", 300);
	const { medicineData } = useMedicineData({ term: medicineTerm });
	const { medicineGenericData } = useMedicineGenericData({ term: medicineGenericTerm });
	const medicineForm = useForm(getMedicineFormInitialValues());
	const [editIndex, setEditIndex] = useState(null);
	const { mainAreaHeight } = useOutletContext();
	const dispatch = useDispatch();
	const { data: by_meal_options } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.BY_MEAL.PATH,
		utility: HOSPITAL_DROPDOWNS.BY_MEAL.UTILITY,
	});

	const { data: dosage_options } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.DOSAGE.PATH,
		utility: HOSPITAL_DROPDOWNS.DOSAGE.UTILITY,
	});

	// Add hotkey for save functionality
	const handleChange = (field, value) => {
		medicineForm.setFieldValue(field, value);

		// If medicine field is being changed, auto-populate other fields from medicine data
		if (field === "medicine_id" && value) {
			const selectedMedicine = medicineData?.find((item) => item.product_id?.toString() === value);

			if (selectedMedicine) {
				medicineForm.setFieldValue("medicine_name", selectedMedicine.product_name);
				medicineForm.setFieldValue("generic", selectedMedicine.generic);
				medicineForm.setFieldValue("generic_id", selectedMedicine.generic_id);
				medicineForm.setFieldValue("company", selectedMedicine.company);

				// Auto-populate by_meal if available
				if (selectedMedicine.by_meal) {
					medicineForm.setFieldValue("by_meal", selectedMedicine.by_meal);
				}

				// Auto-populate duration and count based on duration_day or duration_month
				if (selectedMedicine.duration_day) {
					medicineForm.setFieldValue("quantity", parseInt(selectedMedicine.duration_day) || 1);
					medicineForm.setFieldValue("duration", "day");
				} else if (selectedMedicine.duration_month) {
					medicineForm.setFieldValue("quantity", parseInt(selectedMedicine.duration_month) || 1);
					medicineForm.setFieldValue("duration", "month");
				}

				// Auto-populate dose_details if available (for times field)
				if (selectedMedicine.dose_details) {
					medicineForm.setFieldValue("dose_details", selectedMedicine.dose_details);
				}
			}
		}
	};

	const handleAdd = (values) => {
		if (values.medicine_id) {
			const selectedMedicine = medicineData?.find((item) => item.product_id?.toString() == values.medicine_id);

			if (selectedMedicine) {
				values.medicine_name = selectedMedicine.product_name || values.medicine_name;
				values.generic = selectedMedicine.generic || values.generic;
				values.generic_id = selectedMedicine.generic_id || values.generic_id;
				values.company = selectedMedicine.company || values.company;
				values.by_meal = selectedMedicine.by_meal || values.by_meal;

				if (selectedMedicine.duration_day) {
					values.quantity = parseInt(selectedMedicine.duration_day) || values.quantity;
					values.duration = "day";
				} else if (selectedMedicine.duration_month) {
					values.quantity = parseInt(selectedMedicine.duration_month) || values.quantity;
					values.duration = "month";
				}

				if (selectedMedicine.dose_details) {
					values.times = selectedMedicine.dose_details;
				}
			}
		}

		if (editIndex !== null) {
			const updated = [...medicines];
			updated[editIndex] = values;
			setMedicines(updated);
			setEditIndex(null);
		} else {
			setMedicines([...medicines, values]);
		}

		setUpdateKey((prev) => prev + 1);
		medicineForm.reset();
	};

	const handleDelete = (idx) => {
		setMedicines(medicines.filter((_, i) => i !== idx));
		if (editIndex === idx) {
			medicineForm.reset();
			setEditIndex(null);
		}
	};

	const handleSubmit = async () => {
		try {
			const formValue = {
				json_content: medicines,
				module: "medicine",
			};

			console.log(formValue);

			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.UPDATE}/${id}`,
				data: formValue,
				module: "admission",
			};
			const resultAction = await dispatch(updateEntityData(value));
			if (resultAction.payload.success) {
				console.log(resultAction.payload.data);
				successNotification(resultAction.payload.message);
			} else {
				errorNotification(resultAction.payload.message);
			}
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Box className="borderRadiusAll" bg="white">
			<Box
				onSubmit={medicineForm.onSubmit(handleAdd)}
				key={updateKey}
				component="form"
				bg="var(--theme-primary-color-0)"
				p="sm"
			>
				<Group align="end" gap="les">
					<Group grow w="100%" gap="les">
						<Select
							searchable
							onSearchChange={(v) => {
								setMedicineTerm(v);
							}}
							id="medicine_id"
							name="medicine_id"
							data={medicineData?.map((item) => ({
								label: item.product_name,
								value: item.product_id?.toString(),
							}))}
							value={medicineForm.values.medicine_id}
							onChange={(v) => handleChange("medicine_id", v)}
							placeholder={t("Medicine")}
							tooltip="Select medicine"
							nothingFoundMessage="Type to find medicine..."
							onBlur={() => setMedicineTerm("")}
						/>
						<Autocomplete
							tooltip={t("EnterGenericName")}
							id="generic"
							name="generic"
							data={medicineGenericData?.map((item, index) => ({
								label: item.name,
								value: `${item.name} ${index}`,
							}))}
							value={medicineForm.values.generic}
							onChange={(v) => {
								handleChange("generic", v);
								setMedicineGenericTerm(v);
							}}
							placeholder={t("GenericName")}
							onBlur={() => setMedicineGenericTerm("")}
						/>
					</Group>
					<Grid w="100%" columns={12} gutter="xxxs">
						<Grid.Col span={6}>
							<Group grow gap="les">
								<SelectForm
									form={medicineForm}
									id="dose_details"
									name="dose_details"
									dropdownValue={dosage_options}
									value={medicineForm.values.dose_details}
									placeholder={t("Dosage")}
									required
									tooltip={t("EnterDosage")}
									withCheckIcon={false}
								/>
								<SelectForm
									form={medicineForm}
									id="by_meal"
									name="by_meal"
									dropdownValue={by_meal_options}
									value={medicineForm.values.by_meal}
									placeholder={t("By Meal")}
									required
									tooltip={t("EnterWhenToTakeMedicine")}
									withCheckIcon={false}
								/>
							</Group>
						</Grid.Col>
						<Grid.Col span={6}>
							<Group grow gap="les">
								<SelectForm
									form={medicineForm}
									label=""
									id="duration"
									name="duration"
									dropdownValue={DURATION_OPTIONS}
									value={medicineForm.values.duration}
									placeholder={t("Duration")}
									required
									tooltip={t("EnterMeditationDuration")}
									withCheckIcon={false}
								/>
								<InputNumberForm
									form={medicineForm}
									id="quantity"
									name="quantity"
									value={medicineForm.values.quantity}
									placeholder={t("Quantity")}
									required
									tooltip={t("EnterQuantity")}
								/>
								<Button
									leftSection={<IconPlus size={16} />}
									type="submit"
									variant="filled"
									bg="var(--theme-primary-color-6)"
								>
									{t("Add")}
								</Button>
							</Group>
						</Grid.Col>
					</Grid>
				</Group>
			</Box>
			<Text fw={500} mb="les" px="sm" py="les" bg="var(--theme-primary-color-0)" mt="sm">
				{t("List of Medicines")}
			</Text>
			<ScrollArea h={mainAreaHeight - 220}>
				<Box gap="xs" p="sm" h={mainAreaHeight - 280}>
					{medicines?.length === 0 && (
						<Stack justify="center" align="center" h={mainAreaHeight - 320}>
							<Box>
								<Text mb="md" w="100%" fz="sm" align={"center"} c="var(--theme-secondary-color)">
									{t("NoMedicineAddedYet")}
								</Text>
								<Button
									leftSection={<IconPlus size={16} />}
									type="submit"
									variant="filled"
									bg="var(--theme-primary-color-6)"
									onClick={() => document.getElementById("medicine_id").focus()}
								>
									{t("SelectMedicine")}
								</Button>
							</Box>
						</Stack>
					)}
					{medicines?.map((medicine, index) => (
						<MedicineListItem
							key={index}
							index={index + 1}
							medicine={medicine}
							setMedicines={setMedicines}
							handleDelete={handleDelete}
						/>
					))}
				</Box>
				<Box px="xs">
					<Box ml="auto" w={300}>
						<TabsActionButtons handleReset={() => {}} handleSave={handleSubmit} />
					</Box>
				</Box>
			</ScrollArea>
		</Box>
	);
}
