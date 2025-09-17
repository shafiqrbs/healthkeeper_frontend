import { useEffect, useRef, useState } from "react";
import SelectForm from "@components/form-builders/SelectForm";
import {
	Box,
	Button,
	Group,
	Text,
	Stack,
	Flex,
	Grid,
	ScrollArea,
	Select,
	Autocomplete,
	Tooltip,
	ActionIcon,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
	IconFirstAidKit,
	IconHistory,
	IconPlus,
	IconReportMedical,
	IconRestore,
	IconArrowRight,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { getMedicineFormInitialValues } from "../prescription/helpers/request";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import DatePickerForm from "@components/form-builders/DatePicker";
import { useOutletContext, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import PrescriptionFull from "@components/print-formats/prescription/PrescriptionFull";
import { useDebouncedState, useDisclosure, useHotkeys } from "@mantine/hooks";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import useMedicineData from "@hooks/useMedicineData";
import useMedicineGenericData from "@hooks/useMedicineGenericData";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import { HOSPITAL_DROPDOWNS } from "@/app/store/core/utilitySlice";
import { getLoggedInUser } from "@/common/utils";
import { HOSPITAL_DATA_ROUTES, MASTER_DATA_ROUTES } from "@/constants/routes";
import { getIndexEntityData, updateEntityData } from "@/app/store/core/crudThunk";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { useDispatch, useSelector } from "react-redux";
import { modals } from "@mantine/modals";
import MedicineListItem from "./MedicineListItem";
import { DURATION_TYPES } from "@/constants";
import inputCss from "@/assets/css/InputField.module.css";
import ReferredPrescriptionDetailsDrawer from "@modules/hospital/visit/__RefrerredPrescriptionDetailsDrawer";

export default function AddMedicineForm({
	module,
	form,
	update,
	medicines,
	setMedicines,
	baseHeight,
	setShowHistory,
	prescriptionData,
	hasRecords,
}) {
	const dispatch = useDispatch();
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
	const [printData, setPrintData] = useState(null);
	const adviceData = useSelector((state) => state.crud.advice.data);
	const treatmentData = useSelector((state) => state.crud.treatment.data);
	const [opened, { open, close }] = useDisclosure(false);
	const { data: by_meal_options } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.BY_MEAL.PATH,
		utility: HOSPITAL_DROPDOWNS.BY_MEAL.UTILITY,
	});

	const { data: dosage_options } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.DOSAGE.PATH,
		utility: HOSPITAL_DROPDOWNS.DOSAGE.UTILITY,
	});

	const printPrescription2A4 = useReactToPrint({
		documentTitle: `prescription-${Date.now().toLocaleString()}`,
		content: () => prescription2A4Ref.current,
	});

	useEffect(() => {
		dispatch(
			getIndexEntityData({
				url: MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR.INDEX,
				params: {
					particular_type: "advice",
					page: 1,
					offset: 500,
				},
				module: "advice",
			})
		);
		dispatch(
			getIndexEntityData({
				url: MASTER_DATA_ROUTES.API_ROUTES.TREATMENT_TEMPLATES.INDEX,
				params: {
					particular_type: "treatment-template",
					treatment_mode: "opd-treatment",
				},
				module: "treatment",
			})
		);
	}, []);

	useEffect(() => {
		if (!printData) return;
		printPrescription2A4();
	}, [printData]);

	const handleFieldBlur = () => {
		// Only update if update function exists and form has data
		if (update && form && form.values) {
			update();
		}
	};

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
				printPrescription2A4();
				showNotificationComponent(
					t("Prescription printed successfully"),
					"blue",
					"lightgray",
					true,
					1000,
					true
				);
			},
		],
	]);

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
		if (update) update([...medicines, values]);
		medicineForm.reset();
	};

	const handleDelete = (idx) => {
		setMedicines(medicines.filter((_, i) => i !== idx));
		if (editIndex === idx) {
			medicineForm.reset();
			setEditIndex(null);
		}
		if (update) update(medicines.filter((_, i) => i !== idx));
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

	const openConfirmationModal = () => {
		modals.openConfirmModal({
			title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
			labels: { confirm: t("Confirm"), cancel: t("Cancel") },
			confirmProps: { color: "red" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handlePrescriptionSubmit(),
		});
	};

	const handlePrescriptionSubmit = async () => {
		if (!medicines || medicines.length === 0) {
			showNotificationComponent(t("Please add at least one medicine"), "red", "lightgray", true, 1000, true);
			return {};
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
				return resultAction.payload?.data || {}; // Indicate successful submission
			}
		} catch (error) {
			console.error("Error submitting prescription:", error);
			showNotificationComponent(t("Something went wrong"), "red", "lightgray", true, 1000, true);
			return {}; // Indicate failed submission
		} finally {
			setIsSubmitting(false);
		}
	};

	const handlePrescriptionPrintSubmit = async () => {
		const result = await handlePrescriptionSubmit();

		if (result.status === 200) {
			setPrintData(result.data);
		}
	};

	const handleHoldData = () => {
		console.log("Hold your data");
	};

	const handleAdviseTemplate = (content) => {
		if (!content) {
			showNotificationComponent(t("AdviseContentNotAvailable"), "red", "lightgray", true, 1000, true);
			return;
		}

		const existingAdvise = form.values.advise;

		if (existingAdvise?.includes(content)) {
			showNotificationComponent(t("AdviseAlreadyExists"), "red", "lightgray", true, 1000, true);
			return;
		}

		form.setFieldValue("advise", content);
	};

	const populateMedicineData = (v) => {
		const selectedTreatment = treatmentData?.data?.find((item) => item.id?.toString() === v);
		if (selectedTreatment) {
			setMedicines(selectedTreatment.treatment_medicine_format);
			if (update) update(selectedTreatment.treatment_medicine_format);
		}
	};

	const handleReferredViewPrescription = () => {
		setTimeout(() => open(), 10);
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
							clearable
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
							classNames={inputCss}
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
							classNames={inputCss}
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
									tooltip={t("EnterWhenToTakeMedicine")}
									withCheckIcon={false}
								/>
							</Group>
						</Grid.Col>
						<Grid.Col span={4}>
							<Group grow gap="les">
								<InputNumberForm
									form={medicineForm}
									id="quantity"
									name="quantity"
									value={medicineForm.values.quantity}
									placeholder={t("Quantity")}
									required
									tooltip={t("EnterQuantity")}
								/>
								<SelectForm
									form={medicineForm}
									label=""
									id="duration"
									name="duration"
									dropdownValue={DURATION_TYPES}
									value={medicineForm.values.duration || "Day"}
									placeholder={t("Duration")}
									required
									tooltip={t("EnterMeditationDuration")}
									withCheckIcon={false}
								/>
								<Button
									leftSection={<IconPlus size={16} />}
									type="submit"
									variant="filled"
									bg="var(--theme-secondary-color-6)"
								>
									{t("Add")}
								</Button>
							</Group>
						</Grid.Col>
						<Grid.Col span={2} bg="var(--mantine-color-indigo-6)">
							<SelectForm
								mt={"2"}
								form={medicineForm}
								label=""
								id="treatments"
								name="treatments"
								dropdownValue={treatmentData?.data?.map((item) => ({
									label: item.name,
									value: item.id?.toString(),
								}))}
								value={medicineForm.values.treatments}
								placeholder={t("TreatmentMedicine")}
								required
								tooltip={t("TreatmentMedicine")}
								withCheckIcon={false}
								changeValue={populateMedicineData}
							/>
						</Grid.Col>
					</Grid>
				</Group>
			</Box>
			<Flex bg="var(--theme-primary-color-0)" mb="les" justify="space-between" align="center" py="les" mt="xs">
				<Text fw={500} px="sm">
					{t("ListOfMedicines")}
				</Text>
				<Flex px="les" gap="les">
					{prescriptionData?.data?.patient_referred_id && (
						<Tooltip label="Referred">
							<ActionIcon size="lg" bg={"red"} onClick={() => handleReferredViewPrescription()}>
								<IconFirstAidKit />
							</ActionIcon>
						</Tooltip>
					)}
					{hasRecords && (
						<Tooltip label="History">
							<Button
								variant="filled"
								onClick={() => setShowHistory((prev) => !prev)}
								leftSection={<IconHistory size={14} />}
								rightSection={<IconArrowRight size={14} />}
							>
								{t("History")}
							</Button>
						</Tooltip>
					)}
				</Flex>
			</Flex>
			<ScrollArea h={baseHeight ? baseHeight : mainAreaHeight - 420} bg="white">
				<Stack gap="xs" p="sm">
					{medicines?.length === 0 && (
						<Flex
							mih={baseHeight ? baseHeight - 50 : 220}
							gap="md"
							justify="center"
							align="center"
							direction="column"
							wrap="wrap"
						>
							<Text w="100%" fz="sm" align={"center"} c="var(--theme-secondary-color)">
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
						</Flex>
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
							by_meal_options={by_meal_options}
							dosage_options={dosage_options}
						/>
					))}
				</Stack>
			</ScrollArea>
			{/* =================== Advise form =================== */}
			{form && (
				<>
					<Grid columns={12} gutter="xxxs" mt="xxs" p="les">
						<Grid.Col span={3}>
							<Box fz="md" c="white">
								<Text bg="var(--theme-save-btn-color)" fz="md" c="white" px="sm" py="les">
									{t("AdviseTemplate")}
								</Text>
								<ScrollArea h={96} p="les" className="borderRadiusAll">
									{adviceData?.data?.map((advise) => (
										<Flex
											align="center"
											gap="les"
											bg="var(--theme-primary-color-0)"
											c="dark"
											key={advise.id}
											onClick={() => handleAdviseTemplate(advise?.content)}
											px="les"
											bd="1px solid var(--theme-primary-color-0)"
											mb="2"
											className="cursor-pointer"
										>
											<IconReportMedical color="var(--theme-secondary-color-6)" size={13} />{" "}
											<Text mt="es" fz={13}>
												{advise?.name}
											</Text>
										</Flex>
									))}
								</ScrollArea>
							</Box>
						</Grid.Col>
						<Grid.Col span={6}>
							<Box bg="var(--theme-primary-color-0)" fz="md" c="white">
								<Text bg="var(--theme-secondary-color-6)" fz="md" c="white" px="sm" py="les">
									{t("Advise")}
								</Text>
								<Box p="sm">
									<TextAreaForm
										form={form}
										label=""
										value={form.values.advise}
										name="advise"
										placeholder="Write a advice..."
										showRightSection={false}
										style={{ input: { height: "72px" } }}
										onBlur={handleFieldBlur}
									/>
								</Box>
							</Box>
						</Grid.Col>
						<Grid.Col span={3}>
							<Box bg="var(--theme-primary-color-0)" h="100%">
								<Text bg="var(--theme-primary-color-6)" fz="md" c="white" px="sm" py="les">
									{t("FollowUpDate")}
								</Text>
								<Box p="sm">
									<DatePickerForm
										form={form}
										label=""
										tooltip="Enter follow up date"
										name="follow_up_date"
										value={form.values.follow_up_date}
										placeholder="Follow up date"
										onBlur={handleFieldBlur}
									/>
								</Box>
								{/*<Box pl={"md"}>
									<Switch
										defaultChecked
										color="red"
										size="xs"
										label={t("SaveAsPrescriptionTemplate")}
									/>
								</Box>*/}

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

					{/* =================== submission button here =================== */}
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
						<Button
							w="100%"
							bg="var(--theme-prescription-btn-color)"
							onClick={handlePrescriptionPrintSubmit}
						>
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
					<PrescriptionFull ref={prescription2A4Ref} data={printData} />
				</>
			)}
			<ReferredPrescriptionDetailsDrawer opened={opened} close={close} prescriptionData={prescriptionData} />
		</Box>
	);
}
