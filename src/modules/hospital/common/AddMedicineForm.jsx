import { useRef, useState } from "react";
import SelectForm from "@components/form-builders/SelectForm";
import {
	Box,
	Button,
	Group,
	ActionIcon,
	Text,
	Stack,
	Flex,
	Grid,
	ScrollArea,
	Select,
	Autocomplete,
	NumberInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheck, IconPencil, IconPlus, IconRestore, IconX } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { getMedicineFormInitialValues } from "../prescription/helpers/request";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import DatePickerForm from "@components/form-builders/DatePicker";
import { useOutletContext, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Prescription from "@components/print-formats/prescription/PrescriptionA4";
import PrescriptionPos from "@components/print-formats/prescription/Prescription";
import Prescription2 from "@components/print-formats/prescription/Prescription2";
import Prescription3 from "@components/print-formats/prescription/Prescription3";
import PrescriptionPreview from "./PrescriptionPreview";
import { useDebouncedState, useDisclosure, useHotkeys } from "@mantine/hooks";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import useMedicineData from "@hooks/useMedicineData";
import useMedicineGenericData from "@hooks/useMedicineGenericData";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import { HOSPITAL_DROPDOWNS } from "@/app/store/core/utilitySlice";
import { getLoggedInUser } from "@/common/utils";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";

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

function MedicineListItem({ index, medicine, setMedicines, handleDelete, onEdit }) {
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
	};

	return (
		<Box>
			<Text mb="es" style={{ cursor: "pointer" }} onClick={onEdit}>
				{index}. {medicine.medicine_name || medicine.generic}
			</Text>
			<Flex justify="space-between" align="center" gap="sm">
				{mode === "view" ? (
					<Box ml="md" fz="sm" c="var(--theme-tertiary-color-8)">
						{medicine.dose_details} ---- {medicine.times} time/s ---- {medicine.by_meal}
					</Box>
				) : (
					<Group grow gap="les">
						<Select
							label=""
							data={by_meal_options}
							value={medicine.by_meal}
							placeholder="Timing"
							disabled={mode === "view"}
							onChange={(v) => handleChange("by_meal", v)}
						/>
						<Select
							label=""
							data={dosage_options}
							value={medicine.dose_details}
							placeholder="Dosage"
							disabled={mode === "view"}
							onChange={(v) => handleChange("dose_details", v)}
						/>
						<Select
							label=""
							data={DURATION_UNIT_OPTIONS}
							value={medicine.duration}
							placeholder="Duration"
							disabled={mode === "view"}
							onChange={(v) => handleChange("duration", v)}
						/>
						<NumberInput
							label=""
							value={medicine.amount}
							placeholder="Amount"
							disabled={mode === "view"}
							onChange={(v) => handleChange("amount", v)}
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

export default function AddMedicineForm({ module, form }) {
	const [updateKey, setUpdateKey] = useState(0);
	const { prescriptionId } = useParams();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { t } = useTranslation();
	const prescriptionA4Ref = useRef(null);
	const prescription2A4Ref = useRef(null);
	const prescription3A4Ref = useRef(null);
	const prescriptionPosRef = useRef(null);
	const [medicineTerm, setMedicineTerm] = useDebouncedState("", 300);
	const [medicineGenericTerm, setMedicineGenericTerm] = useDebouncedState("", 300);
	const { medicineData } = useMedicineData({ term: medicineTerm });
	const { medicineGenericData } = useMedicineGenericData({ term: medicineGenericTerm });
	const medicineForm = useForm(getMedicineFormInitialValues());
	const [medicines, setMedicines] = useState([]);
	const [editIndex, setEditIndex] = useState(null);
	const { mainAreaHeight } = useOutletContext();
	const [opened, { open, close }] = useDisclosure(false);

	const { data: by_meal_options } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.BY_MEAL.PATH,
		utility: HOSPITAL_DROPDOWNS.BY_MEAL.UTILITY,
	});

	const { data: dosage_options } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.DOSAGE.PATH,
		utility: HOSPITAL_DROPDOWNS.DOSAGE.UTILITY,
	});

	// Add hotkey for save functionality
	useHotkeys([
		[
			"alt+1",
			() => {
				setMedicines([]);
				medicineForm.reset();

				setEditIndex(null);
				// Clear PatientReport data when resetting
				medicineForm.reset();
			},
		],
		[
			"alt+2",
			() => {
				handleHoldData();
				showNotificationComponent(t("Prescription held successfully"), "blue", "lightgray", true, 1000, true);
			},
		],
		[
			"alt+3",
			() => {
				open();
			},
		],
		[
			"alt+4",
			() => {
				handlePrintPrescriptionA4(1);
			},
		],
	]);

	// =============== create print functions using useReactToPrint hook ================
	const printPrescriptionA4 = useReactToPrint({
		documentTitle: `prescription-${Date.now().toLocaleString()}`,
		content: () => prescriptionA4Ref.current,
	});

	const printPrescription2A4 = useReactToPrint({
		documentTitle: `prescription-${Date.now().toLocaleString()}`,
		content: () => prescription2A4Ref.current,
	});

	const printPrescription3A4 = useReactToPrint({
		documentTitle: `prescription-${Date.now().toLocaleString()}`,
		content: () => prescription3A4Ref.current,
	});

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
					medicineForm.setFieldValue("amount", parseInt(selectedMedicine.duration_day) || 1);
					medicineForm.setFieldValue("duration", "day");
				} else if (selectedMedicine.duration_month) {
					medicineForm.setFieldValue("amount", parseInt(selectedMedicine.duration_month) || 1);
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
					values.amount = parseInt(selectedMedicine.duration_day) || values.amount;
					values.duration = "day";
				} else if (selectedMedicine.duration_month) {
					values.amount = parseInt(selectedMedicine.duration_month) || values.amount;
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

	const handleEdit = (idx) => {
		const medicineToEdit = medicines[idx];

		// If editing a medicine that has a medicine ID, fetch the latest data
		if (medicineToEdit.medicine_id) {
			const selectedMedicine = medicineData?.find(
				(item) => item.product_id?.toString() == medicineToEdit.medicine_id
			);
			if (selectedMedicine) {
				// Merge the existing medicine data with the latest medicine data
				const updatedMedicineData = {
					...medicineToEdit,
					medicine_name: selectedMedicine.product_name || medicineToEdit.medicine_name,
					generic: selectedMedicine.generic || medicineToEdit.generic,
					generic_id: selectedMedicine.generic_id || medicineToEdit.generic_id,
					by_meal: selectedMedicine.by_meal || medicineToEdit.by_meal,
					dose_details: selectedMedicine.dose_details || medicineToEdit.dose_details,
				};

				// Update duration and count based on available data
				if (selectedMedicine.duration_day) {
					updatedMedicineData.amount = parseInt(selectedMedicine.duration_day) || medicineToEdit.amount;
					updatedMedicineData.duration = "day";
				} else if (selectedMedicine.duration_month) {
					updatedMedicineData.amount = parseInt(selectedMedicine.duration_month) || medicineToEdit.amount;
					updatedMedicineData.duration = "month";
				}

				medicineForm.setValues(updatedMedicineData);
			} else {
				medicineForm.setValues(medicineToEdit);
			}
		} else {
			medicineForm.setValues(medicineToEdit);
		}

		setEditIndex(idx);
	};

	const handleReset = () => {
		setMedicines([]);
		medicineForm.reset();
		setEditIndex(null);
		// Clear PatientReport data when resetting
		if (medicineForm) {
			medicineForm.reset();
		}
		// Clear held data when resetting
	};

	const handlePrintPrescriptionA4 = (type) => {
		if (type === 1) {
			printPrescriptionA4();
		} else if (type === 2) {
			printPrescription2A4();
		} else {
			printPrescription3A4();
		}
	};

	const handlePrescriptionSubmit = async () => {
		if (!medicines || medicines.length === 0) {
			showNotificationComponent(t("Please add at least one medicine"), "red", "lightgray", true, 1000, true);
			return;
		}

		setIsSubmitting(true);

		try {
			const createdBy = getLoggedInUser();

			const formValue = {
				medicines,
				advise: form.values.advise || "",
				follow_up_date: form.values.follow_up_date || null,
				prescription_date: new Date().toISOString().split("T")[0],
				created_by_id: createdBy?.id,
				patient_report: {
					basic_info: form.values.basicInfo || {},
					patient_examination: form.values.dynamicFormData,
				},
			};

			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.UPDATE}/${prescriptionId}`,
				data: formValue,
				module,
			};

			return console.log(formValue);
			// const resultAction = await dispatch(updateEntityData(value));

			// if (updateEntityData.rejected.match(resultAction)) {
			// 	showNotificationComponent(resultAction.payload.message, "red", "lightgray", true, 1000, true);
			// } else {
			// 	showNotificationComponent(t("Prescription saved successfully"), "green", "lightgray", true, 1000, true);
			// 	setRefetchData({ module, refetching: true });
			// 	// Reset forms and data
			// 	form.reset();
			// 	setPatientReportData({
			// 		basicInfo: {},
			// 		dynamicFormData: {},
			// 		investigationList: [],
			// 	});
			// 	return true; // Indicate successful submission
			// }
		} catch (error) {
			console.error("Error submitting prescription:", error);
			showNotificationComponent(t("Something went wrong"), "red", "lightgray", true, 1000, true);
			return false; // Indicate failed submission
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleHoldData = () => {
		console.log("Hold your data");
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
							name="medicine_id"
							data={medicineData?.map((item) => ({
								label: item.product_name,
								value: item.product_id?.toString(),
							}))}
							value={medicineForm.values.medicine_id}
							onChange={(v) => handleChange("medicine_id", v)}
							placeholder="Medicine"
							tooltip="Select medicine"
							nothingFoundMessage="Type to find medicine..."
							onBlur={() => setMedicineTerm("")}
						/>
						<Autocomplete
							tooltip="Enter generic name"
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
							placeholder="Generic name"
							onBlur={() => setMedicineGenericTerm("")}
						/>
					</Group>
					<Group grow gap="les" w="100%">
						<SelectForm
							form={medicineForm}
							name="dose_details"
							dropdownValue={dosage_options}
							value={medicineForm.values.dose_details}
							placeholder="Dosage"
							required
							tooltip="Enter dosage"
							withCheckIcon={false}
						/>
						<SelectForm
							form={medicineForm}
							name="by_meal"
							dropdownValue={by_meal_options}
							value={medicineForm.values.by_meal}
							placeholder="By Meal"
							required
							tooltip="Enter when to take medicine"
							withCheckIcon={false}
						/>
						<SelectForm
							form={medicineForm}
							label=""
							name="duration"
							dropdownValue={DURATION_OPTIONS}
							value={medicineForm.values.duration}
							placeholder="Duration"
							required
							tooltip="Enter meditation duration"
							withCheckIcon={false}
						/>
						<InputNumberForm
							form={medicineForm}
							name="amount"
							value={medicineForm.values.amount}
							placeholder="Amount"
							required
							tooltip="Enter amount"
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
				</Group>
			</Box>
			<Text fw={500} mb="les" px="sm" py="les" bg="var(--theme-primary-color-0)" mt="sm">
				List of Medicines
			</Text>
			<ScrollArea h={mainAreaHeight - 450} bg="white">
				<Stack gap="xs" p="sm">
					{medicines.length === 0 && (
						<Text fz="sm" c="var(--theme-secondary-color)">
							No medicine added yet
						</Text>
					)}
					{medicines.map((medicine, index) => (
						<MedicineListItem
							key={index}
							index={index + 1}
							medicine={medicine}
							setMedicines={setMedicines}
							handleDelete={handleDelete}
							onEdit={() => handleEdit(index)}
							by_meal_options={by_meal_options}
						/>
					))}
				</Stack>
			</ScrollArea>
			{/* =================== Advise form =================== */}
			{
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
									placeholder="Write a advice..."
									showRightSection={false}
									style={{ input: { height: "92px" } }}
								/>
							</Box>
						</Box>
					</Grid.Col>
					<Grid.Col span={6}>
						<Box bg="var(--theme-primary-color-0)" h="100%" p="sm">
							<DatePickerForm
								form={form}
								label={t("FollowUpDate")}
								tooltip="Enter follow up date"
								name="follow_up_date"
								value={form.values.follow_up_date}
								placeholder="Follow up date"
							/>
							{/* <Text mt="xs" fz="sm">
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
						</Group> */}
						</Box>
					</Grid.Col>
				</Grid>
			}
			{
				// =================== button group ===================
				<Button.Group bg="var(--theme-primary-color-0)" p="les">
					<Button
						w="100%"
						bg="var(--theme-reset-btn-color)"
						leftSection={<IconRestore size={16} />}
						onClick={handleReset}
					>
						<Stack gap={0} align="center" justify="center">
							<Text>{t("reset")}</Text>
							<Text mt="-les" fz="xs" c="var(--theme-secondary-color)">
								(alt + 1)
							</Text>
						</Stack>
					</Button>
					<Button w="100%" bg="var(--theme-hold-btn-color)" onClick={handleHoldData}>
						<Stack gap={0} align="center" justify="center">
							<Text>{t("Hold")}</Text>
							<Text mt="-les" fz="xs" c="var(--theme-secondary-color)">
								(alt + 2)
							</Text>
						</Stack>
					</Button>
					<Button w="100%" bg="var(--theme-prescription-btn-color)" onClick={open}>
						<Stack gap={0} align="center" justify="center">
							<Text>{t("prescription")}</Text>
							<Text mt="-les" fz="xs" c="var(--theme-secondary-color)">
								(alt + 3)
							</Text>
						</Stack>
					</Button>
					<Button
						w="100%"
						bg="var(--theme-save-btn-color)"
						onClick={handlePrescriptionSubmit}
						loading={isSubmitting}
						disabled={isSubmitting}
					>
						<Stack gap={0} align="center" justify="center">
							<Text>{t("Save")}</Text>
							<Text mt="-les" fz="xs" c="var(--theme-secondary-color)">
								(alt + s)
							</Text>
						</Stack>
					</Button>
				</Button.Group>
			}
			<Prescription ref={prescriptionA4Ref} />
			<Prescription2 ref={prescription2A4Ref} />
			<Prescription3 ref={prescription3A4Ref} />
			<PrescriptionPos ref={prescriptionPosRef} />

			<PrescriptionPreview opened={opened} close={close} />
		</Box>
	);
}
