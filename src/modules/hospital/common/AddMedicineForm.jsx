import { useRef, useState, useEffect } from "react";
import SelectForm from "@components/form-builders/SelectForm";
import { Box, Button, Group, ActionIcon, Text, Stack, Flex, Grid, ScrollArea, Select, Menu } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheck, IconPencil, IconPlus, IconRestore, IconX } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { getMedicineFormInitialValues } from "../prescription/helpers/request";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import DatePickerForm from "@components/form-builders/DatePicker";
import { useOutletContext } from "react-router-dom";
import InputAutoComplete from "@components/form-builders/InputAutoComplete";
import { useReactToPrint } from "react-to-print";
import Prescription from "@components/print-formats/a4/Prescription";
import PrescriptionPos from "@components/print-formats/pos/Prescription";
import Prescription2 from "@components/print-formats/a4/Prescription2";
import Prescription3 from "@components/print-formats/a4/Prescription3";
import PrescriptionPreview from "./PrescriptionPreview";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import useMedicineData from "@/common/hooks/useMedicineData";
import useMedicineGenericData from "@/common/hooks/useMedicineGenericData";
import useGlobalDropdownData from "@/common/hooks/dropdown/useGlobalDropdownData";
import { HOSPITAL_DROPDOWNS } from "@/app/store/core/utilitySlice";

const DURATION_OPTIONS = [
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
				{index}. {medicine.generic || medicine.medicineName || medicine.medicine}
			</Text>
			<Flex justify="space-between" align="center" gap="sm">
				{mode === "view" ? (
					<Box ml="md" fz="sm" c="var(--theme-tertiary-color-8)">
						{medicine.dosage} ---- {medicine.times} time/s ---- {medicine.by_meal} meal
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

export default function AddMedicineForm({
	hideAdviseForm = false,
	hideActionButtons = false,
	onSubmit,
	isSubmitting = false,
	patientData = {},
	prescriptionForm = null,
	patientReportData = null,
	setPatientReportData = null,
}) {
	const [medicineTerm, setMedicineTerm] = useState("");
	const [medicineGenericTerm, setMedicineGenericTerm] = useState("");
	const { medicineData } = useMedicineData({ term: medicineTerm });
	const { medicineGenericData } = useMedicineGenericData({ term: medicineGenericTerm });

	const { t } = useTranslation();
	const form = useForm(getMedicineFormInitialValues());
	const [medicines, setMedicines] = useState([]);
	const [editIndex, setEditIndex] = useState(null);
	const { mainAreaHeight } = useOutletContext();
	const prescriptionA4Ref = useRef(null);
	const prescription2A4Ref = useRef(null);
	const prescription3A4Ref = useRef(null);
	const prescriptionPosRef = useRef(null);
	const [forceUpdate, setForceUpdate] = useState(0);
	const [opened, { open, close }] = useDisclosure(false);

	const { data: by_meal_options } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.BY_MEAL.PATH,
		utility: HOSPITAL_DROPDOWNS.BY_MEAL.UTILITY,
	});

	const { data: dosage_options } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.DOSAGE.PATH,
		utility: HOSPITAL_DROPDOWNS.DOSAGE.UTILITY,
	});

	// Load held prescription data on component mount
	useEffect(() => {
		const heldData = localStorage.getItem("prescription-hold-data");
		if (heldData) {
			try {
				const parsedData = JSON.parse(heldData);
				// Check if the held data is not too old (24 hours)
				const heldTime = new Date(parsedData.timestamp);
				const now = new Date();
				const hoursDiff = (now - heldTime) / (1000 * 60 * 60);

				if (hoursDiff < 24) {
					setMedicines(parsedData.medicines || []);
					if (parsedData.adviseForm) {
						form.setValues(parsedData.adviseForm);
					}
					// Restore PatientReport data if available
					if (parsedData.patientReportData && setPatientReportData) {
						setPatientReportData(parsedData.patientReportData);
					}
					showNotificationComponent(t("Held prescription loaded"), "blue", "lightgray", true, 1000, true);
				} else {
					// Remove old held data
					localStorage.removeItem("prescription-hold-data");
				}
			} catch (error) {
				console.error("Error loading held prescription:", error);
				localStorage.removeItem("prescription-hold-data");
			}
		}
	}, []);

	// Add hotkey for save functionality
	useHotkeys([
		[
			"alt+s",
			() => {
				if (onSubmit) {
					handlePrescriptionSubmit();
				}
			},
		],
		[
			"alt+1",
			() => {
				setMedicines([]);
				form.reset();

				setEditIndex(null);
				// Clear PatientReport data when resetting
				if (setPatientReportData) {
					setPatientReportData({
						basicInfo: {},
						dynamicFormData: {},
						investigationList: [],
					});
				}
				// Clear held data when resetting
				localStorage.removeItem("prescription-hold-data");
			},
		],
		[
			"alt+2",
			() => {
				// Save current state to localStorage for later retrieval
				const holdData = {
					medicines,
					adviseForm: form.values,
					patientData,
					patientReportData: patientReportData || {
						basicInfo: {},
						dynamicFormData: {},
						investigationList: [],
					},
					timestamp: new Date().toISOString(),
				};
				localStorage.setItem("prescription-hold-data", JSON.stringify(holdData));
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
		form.setFieldValue(field, value);

		// If medicine field is being changed, auto-populate other fields from medicine data
		if (field === "medicine" && value) {
			const selectedMedicine = medicineData?.find((item) => item.id?.toString() === value);
			if (selectedMedicine) {
				console.log("Selected medicine data:", selectedMedicine);

				form.setFieldValue("medicineName", selectedMedicine.name);

				// Auto-populate by_meal if available
				if (selectedMedicine.by_meal) {
					form.setFieldValue("by_meal", selectedMedicine.by_meal);
				}

				// Auto-populate duration and count based on duration_day or duration_month
				if (selectedMedicine.duration_day) {
					form.setFieldValue("count", parseInt(selectedMedicine.duration_day) || 1);
					form.setFieldValue("duration", "day");
				} else if (selectedMedicine.duration_month) {
					form.setFieldValue("count", parseInt(selectedMedicine.duration_month) || 1);
					form.setFieldValue("duration", "month");
				}

				// Auto-populate dose_details if available (for times field)
				if (selectedMedicine.dose_details) {
					form.setFieldValue("dosage", selectedMedicine.dose_details);
				}

				console.log("Form values after auto-population:", form.values);
			}
		}
	};

	const handleAdd = () => {
		// Ensure all medicine data is properly set before adding
		let formData = { ...form.values };
		if (formData.medicine) {
			const selectedMedicine = medicineData?.find((item) => item.id?.toString() === formData.medicine);
			if (selectedMedicine) {
				// Ensure all fields are populated with medicine data
				formData.medicineName = selectedMedicine.name || formData.medicineName;
				formData.generic = selectedMedicine.generic || formData.generic;
				formData.by_meal = selectedMedicine.by_meal || formData.by_meal;

				// Set duration and count based on available data
				if (selectedMedicine.duration_day) {
					formData.count = parseInt(selectedMedicine.duration_day) || formData.count;
					formData.duration = "day";
				} else if (selectedMedicine.duration_month) {
					formData.count = parseInt(selectedMedicine.duration_month) || formData.count;
					formData.duration = "month";
				}

				// Set times if dose_details is available
				if (selectedMedicine.dose_details) {
					formData.times = selectedMedicine.dose_details;
				}
			}
		}

		if (editIndex !== null) {
			const updated = [...medicines];
			updated[editIndex] = formData;
			setMedicines(updated);
			setEditIndex(null);
		} else {
			setMedicines([...medicines, formData]);
		}

		// =============== reset form with initial values to clear all fields ================
		form.reset();

		setForceUpdate((prev) => prev + 1);
	};

	const handleDelete = (idx) => {
		setMedicines(medicines.filter((_, i) => i !== idx));
		if (editIndex === idx) {
			form.reset();
			setEditIndex(null);
		}
	};

	const handleEdit = (idx) => {
		const medicineToEdit = medicines[idx];

		// If editing a medicine that has a medicine ID, fetch the latest data
		if (medicineToEdit.medicine) {
			const selectedMedicine = medicineData?.find((item) => item.id?.toString() === medicineToEdit.medicine);
			if (selectedMedicine) {
				// Merge the existing medicine data with the latest medicine data
				const updatedMedicineData = {
					...medicineToEdit,
					medicineName: selectedMedicine.name || medicineToEdit.medicineName,
					generic: selectedMedicine.generic || medicineToEdit.generic,
					by_meal: selectedMedicine.by_meal || medicineToEdit.by_meal,
					dose_details: selectedMedicine.dose_details || medicineToEdit.dose_details,
				};

				// Update duration and count based on available data
				if (selectedMedicine.duration_day) {
					updatedMedicineData.count = parseInt(selectedMedicine.duration_day) || medicineToEdit.count;
					updatedMedicineData.duration = "day";
				} else if (selectedMedicine.duration_month) {
					updatedMedicineData.count = parseInt(selectedMedicine.duration_month) || medicineToEdit.count;
					updatedMedicineData.duration = "month";
				}

				form.setValues(updatedMedicineData);
			} else {
				form.setValues(medicineToEdit);
			}
		} else {
			form.setValues(medicineToEdit);
		}

		setEditIndex(idx);
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

	// Handle prescription submission
	const handlePrescriptionSubmit = async () => {
		if (onSubmit) {
			const prescriptionData = {
				patientData,
				medicines,
				prescriptionForm: prescriptionForm?.values || {},
				adviseForm: form.values,
				patientReportData: patientReportData || {
					basicInfo: {},
					dynamicFormData: {},
					investigationList: [],
				},
			};
			const result = await onSubmit(prescriptionData);

			// If submission was successful, clear held data
			if (result !== false) {
				localStorage.removeItem("prescription-hold-data");
			}
		}
	};

	return (
		<Box component="form" onSubmit={form.onSubmit(handleAdd)} className="borderRadiusAll" bg="white">
			<Box bg="var(--theme-primary-color-0)" p="sm">
				<Group key={forceUpdate} align="end" gap="les">
					<Group grow w="100%" gap="les">
						<Select
							searchable
							onSearchChange={(v) => {
								setMedicineTerm(v);
							}}
							name="medicine"
							data={medicineData?.map((item) => ({
								label: item.name,
								value: item.id?.toString(),
							}))}
							value={form.values.medicine}
							onChange={(v) => handleChange("medicine", v)}
							placeholder="Medicine"
							tooltip="Select medicine"
						/>

						<Select
							searchable
							onSearchChange={(v) => setMedicineGenericTerm(v)}
							tooltip="Enter generic name"
							name="generic"
							data={medicineGenericData?.map((item, index) => ({
								label: `${item.name}`,
								value: `${item.name} - ${index + 1}`,
							}))}
							value={form.values.generic}
							onChange={(v) => handleChange("generic", v)}
							placeholder="Generic name"
						/>
					</Group>
					<Group grow gap="les" w="100%">
						<SelectForm
							form={form}
							name="dosage"
							dropdownValue={dosage_options}
							value={form.values.dosage}
							changeValue={(v) => handleChange("dosage", v)}
							placeholder="Dosage"
							required
							tooltip="Enter dosage"
						/>
						<SelectForm
							form={form}
							name="by_meal"
							dropdownValue={by_meal_options}
							value={form.values.by_meal}
							changeValue={(v) => handleChange("by_meal", v)}
							placeholder="By Meal"
							required
							tooltip="Enter when to take medicine"
						/>
						<SelectForm
							form={form}
							label=""
							name="duration"
							dropdownValue={DURATION_OPTIONS}
							value={form.values.duration}
							changeValue={(v) => handleChange("duration", v)}
							placeholder="Duration"
							required
							tooltip="Enter meditation duration"
						/>
						<InputNumberForm
							form={form}
							name="count"
							value={form.values.count}
							changeValue={(v) => handleChange("count", v)}
							placeholder="Count"
							required
							tooltip="Enter count"
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
			{/* <Box bg="white" px="sm" mt="xxs">
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
			</Box> */}
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
			{!hideAdviseForm && (
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
						<Box bg="var(--theme-primary-color-0)" h="100%" p="sm">
							<DatePickerForm
								form={form}
								label={t("followUpDate")}
								tooltip="Enter follow up date"
								name="followUpDate"
								value={form.values.followUpDate}
								handleChange={(v) => handleChange("followUpDate", v)}
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
			)}
			{!hideActionButtons && (
				// =================== button group ===================
				<Button.Group bg="var(--theme-primary-color-0)" p="les">
					<Button
						w="100%"
						bg="var(--theme-reset-btn-color)"
						leftSection={<IconRestore size={16} />}
						onClick={() => {
							setMedicines([]);
							form.reset();
							// =============== force reset all form fields to ensure they are cleared ================
							form.setValues({
								medicine: "",
								medicineName: "",
								generic: "",
								dosage: "",
								times: "",
								by_meal: "",
								duration: "",
								count: 1,
								advise: "",
								followUpDate: null,
							});
							setEditIndex(null);
							// Clear PatientReport data when resetting
							if (setPatientReportData) {
								setPatientReportData({
									basicInfo: {},
									dynamicFormData: {},
									investigationList: [],
								});
							}
							// Clear held data when resetting
							localStorage.removeItem("prescription-hold-data");
						}}
					>
						<Stack gap={0} align="center" justify="center">
							<Text>{t("reset")}</Text>
							<Text mt="-les" fz="xs" c="var(--theme-secondary-color)">
								(alt + 1)
							</Text>
						</Stack>
					</Button>
					<Button
						w="100%"
						bg="var(--theme-hold-btn-color)"
						onClick={() => {
							// Save current state to localStorage for later retrieval
							const holdData = {
								medicines,
								adviseForm: form.values,
								patientData,
								patientReportData: patientReportData || {
									basicInfo: {},
									dynamicFormData: {},
									investigationList: [],
								},
								timestamp: new Date().toISOString(),
							};
							localStorage.setItem("prescription-hold-data", JSON.stringify(holdData));
							showNotificationComponent(
								t("Prescription held successfully"),
								"blue",
								"lightgray",
								true,
								1000,
								true
							);
						}}
					>
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
					<Menu shadow="md" width={200}>
						<Menu.Target>
							<Button w="100%" bg="var(--theme-print-btn-color)" type="button">
								<Stack gap={0} align="center" justify="center">
									<Text>{t("a4Print")}</Text>
									<Text mt="-les" fz="xs" c="var(--theme-secondary-color)">
										(alt + 4)
									</Text>
								</Stack>
							</Button>
						</Menu.Target>

						<Menu.Dropdown>
							<Menu.Item onClick={() => handlePrintPrescriptionA4(1)}>Template 1</Menu.Item>
							<Menu.Item onClick={() => handlePrintPrescriptionA4(2)}>Template 2</Menu.Item>
							<Menu.Item onClick={() => handlePrintPrescriptionA4(3)}>Template 3</Menu.Item>
						</Menu.Dropdown>
					</Menu>
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
			)}
			<Prescription ref={prescriptionA4Ref} />
			<Prescription2 ref={prescription2A4Ref} />
			<Prescription3 ref={prescription3A4Ref} />
			<PrescriptionPos ref={prescriptionPosRef} />

			<PrescriptionPreview opened={opened} close={close} />
		</Box>
	);
}
