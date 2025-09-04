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
import Prescription2 from "@components/print-formats/prescription/Prescription2";
import { useDebouncedState, useHotkeys } from "@mantine/hooks";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import useMedicineData from "@hooks/useMedicineData";
import useMedicineGenericData from "@hooks/useMedicineGenericData";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import { HOSPITAL_DROPDOWNS } from "@/app/store/core/utilitySlice";
import { getLoggedInUser } from "@/common/utils";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { updateEntityData } from "@/app/store/core/crudThunk";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { useDispatch } from "react-redux";
import { modals } from "@mantine/modals";

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

function MedicineListItem({ index, medicines, medicine, setMedicines, handleDelete, update }) {
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

export default function AddMedicineForm({ module, form, update, medicines, setMedicines }) {
	const dispatch = useDispatch();

	// Handle onBlur update for form fields
	const handleFieldBlur = () => {
		// Only update if update function exists and form has data
		if (update && form && form.values) {
			update();
		}
	};
	const prescription2A4Ref = useRef(null);
	const [updateKey, setUpdateKey] = useState(0);
	const { prescriptionId } = useParams();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { t } = useTranslation();
	const [medicineTerm, setMedicineTerm] = useDebouncedState("", 300);
	const [medicineGenericTerm, setMedicineGenericTerm] = useDebouncedState("", 300);
	const { medicineData } = useMedicineData({ term: medicineTerm });
	const { medicineGenericData } = useMedicineGenericData({ term: medicineGenericTerm });
	const medicineForm = useForm(getMedicineFormInitialValues());
	const [editIndex, setEditIndex] = useState(null);
	const { mainAreaHeight } = useOutletContext();

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
			"alt+4",
			() => {
				handlePrintPrescription2A4();
			},
		],
	]);

	// =============== create print functions using useReactToPrint hook ================
	const printPrescription2A4 = useReactToPrint({
		documentTitle: `prescription-${Date.now().toLocaleString()}`,
		content: () => prescription2A4Ref.current,
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
		update([...medicines, values]);
		medicineForm.reset();
	};

	const handleDelete = (idx) => {
		setMedicines(medicines.filter((_, i) => i !== idx));
		if (editIndex === idx) {
			medicineForm.reset();
			setEditIndex(null);
		}
		update(medicines.filter((_, i) => i !== idx));
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

	const handlePrintPrescription2A4 = () => {
		printPrescription2A4();
	};

	const openConfirmationModal = () => {
		modals.openConfirmModal({
			title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
			labels: { confirm: t("Confirm"), cancel: t("Cancel") },
			confirmProps: { color: "red" },
			onCancel: () => console.log("Cancel"),
			onConfirm: () => handlePrescriptionSubmit(),
		});
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
				is_completed: true,
				medicines,
				advise: form.values.advise || "",
				follow_up_date: form.values.follow_up_date || null,
				prescription_date: new Date().toISOString().split("T")[0],
				created_by_id: createdBy?.id,
				patient_report: {
					basic_info: form.values.basic_info || {},
					patient_examination: form.values.dynamicFormData,
				},
			};

			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.UPDATE}/${prescriptionId}`,
				data: formValue,
				module,
			};

			// return console.log(formValue);
			const resultAction = await dispatch(updateEntityData(value));

			if (updateEntityData.rejected.match(resultAction)) {
				showNotificationComponent(resultAction.payload.message, "red", "lightgray", true, 1000, true);
			} else {
				showNotificationComponent(t("Prescription saved successfully"), "green", "lightgray", true, 1000, true);
				setRefetchData({ module, refetching: true });
				// Reset forms and data
				// form.reset();
				return true; // Indicate successful submission
			}
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
							placeholder={t("Medicine")}
							tooltip="Select medicine"
							nothingFoundMessage="Type to find medicine..."
							onBlur={() => setMedicineTerm("")}
						/>
						<Autocomplete
							tooltip={t("EnterGenericName")}
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
					<Group grow gap="les" w="100%">
						<SelectForm
							form={medicineForm}
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
							name="by_meal"
							dropdownValue={by_meal_options}
							value={medicineForm.values.by_meal}
							placeholder={t("By Meal")}
							required
							tooltip={t("EnterWhenToTakeMedicine")}
							withCheckIcon={false}
						/>
						<SelectForm
							form={medicineForm}
							label=""
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
				</Group>
			</Box>
			<Text fw={500} mb="les" px="sm" py="les" bg="var(--theme-primary-color-0)" mt="sm">
				List of Medicines
			</Text>
			<ScrollArea h={mainAreaHeight - 450} bg="white">
				<Stack gap="xs" p="sm">
					{medicines?.length === 0 && (
						<Text fz="sm" c="var(--theme-secondary-color)">
							No medicine added yet
						</Text>
					)}
					{medicines?.map((medicine, index) => (
						<MedicineListItem
							key={index}
							index={index + 1}
							medicines={medicines}
							medicine={medicine}
							setMedicines={setMedicines}
							handleDelete={handleDelete}
							update={update}
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
									onBlur={handleFieldBlur}
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
								onBlur={handleFieldBlur}
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
							<Text>{t("Reset")}</Text>
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
					<Button w="100%" bg="var(--theme-prescription-btn-color)" onClick={handlePrintPrescription2A4}>
						<Stack gap={0} align="center" justify="center">
							<Text>{t("Prescription")}</Text>
							<Text mt="-les" fz="xs" c="var(--theme-secondary-color)">
								(alt + 3)
							</Text>
						</Stack>
					</Button>
					<Button
						w="100%"
						bg="var(--theme-save-btn-color)"
						onClick={openConfirmationModal}
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
			<Prescription2 ref={prescription2A4Ref} />
		</Box>
	);
}
