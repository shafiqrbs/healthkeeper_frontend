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
	Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
	IconFirstAidKit,
	IconHistory,
	IconPlus,
	IconReportMedical,
	IconRestore,
	IconArrowRight,
	IconDeviceFloppy,
	IconX,
	IconTrash,
	IconCaretUpDownFilled,
	IconMedicineSyrup,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { getMedicineFormInitialValues } from "../helpers/request";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import { useLocation, useOutletContext, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import PrescriptionFull from "@components/print-formats/prescription/PrescriptionFull";
import { useDebouncedState, useDisclosure, useHotkeys } from "@mantine/hooks";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import useMedicineData from "@hooks/useMedicineData";
import useMedicineGenericData from "@hooks/useMedicineGenericData";
import { getLoggedInUser } from "@/common/utils";
import { HOSPITAL_DATA_ROUTES, MASTER_DATA_ROUTES } from "@/constants/routes";
import { getIndexEntityData, updateEntityData } from "@/app/store/core/crudThunk";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { useDispatch, useSelector } from "react-redux";
import { modals } from "@mantine/modals";
import MedicineListItem from "@hospital-components/MedicineListItem";
import { DURATION_TYPES } from "@/constants";
import inputCss from "@/assets/css/InputField.module.css";
import ReferredPrescriptionDetailsDrawer from "@modules/hospital/visit/__RefrerredPrescriptionDetailsDrawer";
import GlobalDrawer from "@components/drawers/GlobalDrawer";
import PrescriptionPreview from "@hospital-components/PrescriptionPreview";
import CreateDosageDrawer from "@hospital-components/drawer/CreateDosageDrawer";
import { PHARMACY_DROPDOWNS } from "@/app/store/core/utilitySlice";
import { useNavigate } from "react-router-dom";

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
	tabParticulars,
	ipdId,
}) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const prescription2A4Ref = useRef(null);
	const [updateKey, setUpdateKey] = useState(0);
	const { id } = useParams();
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
	const emergencyData = useSelector((state) => state.crud.exemergency.data);
	const treatmentData = useSelector((state) => state.crud.treatment.data);
	const [opened, { open, close }] = useDisclosure(false);
	const [openedDosageForm, { open: openDosageForm, close: closeDosageForm }] = useDisclosure(false);
	const [openedExPrescription, { open: openExPrescription, close: closeExPrescription }] = useDisclosure(false);
	const [openedPrescriptionPreview, { open: openPrescriptionPreview, close: closePrescriptionPreview }] =
		useDisclosure(false);
	// =============== autocomplete state for emergency prescription ================
	const [autocompleteValue, setAutocompleteValue] = useState("");
	const [tempEmergencyItems, setTempEmergencyItems] = useState([]);

	const dosage_options = useSelector((state) => state.crud.dosage?.data?.data);
	const refetching = useSelector((state) => state.crud.dosage?.refetching);
	const by_meal_options = useSelector((state) => state.crud.byMeal?.data?.data);
	const bymealRefetching = useSelector((state) => state.crud.byMeal?.refetching);

	const printPrescription2A4 = useReactToPrint({
		documentTitle: `prescription-${Date.now().toLocaleString()}`,
		content: () => prescription2A4Ref.current,
	});

	const getByMeal = (id) => {
		return by_meal_options?.find((item) => item.id?.toString() == id)?.name;
	};

	const getDosage = (id) => {
		return dosage_options?.find((item) => item.id?.toString() == id)?.name;
	};

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
				url: MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR.INDEX,
				params: {
					particular_type: "rx-emergency",
					page: 1,
					offset: 500,
				},
				module: "exemergency",
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
		dispatch(
			getIndexEntityData({
				url: PHARMACY_DROPDOWNS.DOSAGE.PATH,
				module: "dosage",
				params: {
					page: 1,
					offset: 500,
				},
			})
		);
	}, [refetching]);

	useEffect(() => {
		dispatch(
			getIndexEntityData({
				url: PHARMACY_DROPDOWNS.BY_MEAL.PATH,
				module: "byMeal",
				params: {
					page: 1,
					offset: 500,
				},
			})
		);
	}, [bymealRefetching]);

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
	// =============== handler for adding autocomplete option to temporary list ================
	const handleAutocompleteOptionAdd = (value, data, type) => {
		const selectedItem = data?.find((item) => item.name === value);
		if (selectedItem) {
			const newItem = {
				id: selectedItem.id || Date.now(),
				name: selectedItem.name,
				value: selectedItem.name,
				type: type,
				isEditable: true,
			};
			setTempEmergencyItems((prev) => [...prev, newItem]);
		}
	};

	// =============== handler for updating temporary item value ================
	const handleTempItemChange = (index, newValue) => {
		setTempEmergencyItems((prev) => prev.map((item, idx) => (idx === index ? { ...item, value: newValue } : item)));
	};

	// =============== handler for removing temporary item ================
	const handleTempItemRemove = (index) => {
		setTempEmergencyItems((prev) => prev.filter((_, idx) => idx !== index));
	};

	// =============== handler for saving emergency prescription ================
	const handleEmergencyPrescriptionSave = () => {
		if (tempEmergencyItems.length === 0) {
			showNotificationComponent(t("Please add at least one emergency item"), "red", "lightgray", true, 700, true);
			return;
		}

		// add temporary items to form.values.exEmergency
		const currentExEmergency = form.values.exEmergency || [];
		const newExEmergency = [...currentExEmergency, ...tempEmergencyItems];

		form.setFieldValue("exEmergency", newExEmergency);

		// clear temporary items and autocomplete
		setTempEmergencyItems([]);
		setAutocompleteValue("");

		// close drawer
		closeExPrescription();
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
				showNotificationComponent(t("Prescription held successfully"), "blue", "lightgray", true, 700, true);
			},
		],
		[
			"alt+4",
			() => {
				printPrescription2A4();
				showNotificationComponent(t("Prescription printed successfully"), "blue", "lightgray", true, 700, true);
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
				medicineForm.setFieldValue("opd_quantity", selectedMedicine?.opd_quantity || 0);
				medicineForm.setFieldValue("opd_limit", selectedMedicine?.opd_quantity || 0);

				// Auto-populate by_meal if available
				if (selectedMedicine.medicine_bymeal_id) {
					medicineForm.setFieldValue("medicine_bymeal_id", selectedMedicine.medicine_bymeal_id?.toString());
					medicineForm.setFieldValue("by_meal", getByMeal(selectedMedicine.medicine_bymeal_id));
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
				if (selectedMedicine.medicine_dosage_id) {
					medicineForm.setFieldValue("medicine_dosage_id", selectedMedicine.medicine_dosage_id?.toString());
					medicineForm.setFieldValue("dose_details", getDosage(selectedMedicine.medicine_dosage_id));
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
				values.opd_quantity = selectedMedicine?.opd_quantity || 0;

				if (selectedMedicine.duration_day) {
					values.quantity = parseInt(selectedMedicine.duration_day) || values.quantity;
					values.duration = "day";
				} else if (selectedMedicine.duration_month) {
					values.quantity = parseInt(selectedMedicine.duration_month) || values.quantity;
					values.duration = "month";
				}

				if (selectedMedicine.medicine_dosage_id) {
					values.medicine_dosage_id = selectedMedicine.medicine_dosage_id?.toString();
					values.dose_details = getDosage(selectedMedicine.medicine_dosage_id);
				}

				if (selectedMedicine.medicine_bymeal_id) {
					values.medicine_bymeal_id = selectedMedicine.medicine_bymeal_id?.toString();
					values.by_meal = getByMeal(selectedMedicine.medicine_bymeal_id);
				}
			}
			if (editIndex !== null) {
				const updated = [...medicines];
				updated[editIndex] = values;
				setMedicines(updated);
				setEditIndex(null);
			} else {
				setMedicines([...medicines, values]);

				if (selectedMedicine?.medicine_bymeal_id) {
					values.medicine_bymeal_id = selectedMedicine.medicine_bymeal_id?.toString();
					values.by_meal = getByMeal(selectedMedicine.medicine_bymeal_id);
				}

				setMedicines([...medicines, values]);
				setUpdateKey((prev) => prev + 1);
				if (update) update([...medicines, values]);

				medicineForm.reset();
				setTimeout(() => document.getElementById("medicine_id").focus(), [100]);
			}
			setEditIndex(null);
		}
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

	const handlePrescriptionSubmit = async (skipLoading) => {
		!skipLoading && setIsSubmitting(true);

		try {
			const createdBy = getLoggedInUser();

			const formValue = {
				is_completed: true,
				medicines,
				advise: form.values.advise || "",
				follow_up_date: form.values.follow_up_date || null,
				prescription_date: new Date().toISOString().split("T")[0],
				created_by_id: createdBy?.id,
				exEmergency: form.values.exEmergency || [],
				instruction: form.values.instruction || "",
				pharmacyInstruction: form.values.pharmacyInstruction || "",
				patient_report: {
					basic_info: form.values.basic_info || {},
					patient_examination: form.values.dynamicFormData,
					order: tabParticulars.map((item, index) => ({
						[item.slug]: index,
					})),
				},
			};

			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.UPDATE}/${id}`,
				data: formValue,
				module,
			};

			// return console.log(formValue);
			const resultAction = await dispatch(updateEntityData(value));

			if (updateEntityData.rejected.match(resultAction)) {
				showNotificationComponent(resultAction.payload.message, "red", "lightgray", true, 700, true);
			} else {
				showNotificationComponent(t("Prescription saved successfully"), "green", "lightgray", true, 700, true);
				setRefetchData({ module, refetching: true });
				// Reset forms and data
				// form.reset();
				navigate(
					`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.IPD_ADMITTED.INDEX}/${ipdId}?tabs=true&mode=prescription`,
					{
						replace: true,
					}
				);

				return resultAction.payload?.data || {}; // Indicate successful submission
			}
		} catch (error) {
			console.error("Error submitting prescription:", error);
			showNotificationComponent(t("Something went wrong"), "red", "lightgray", true, 700, true);
			return {}; // Indicate failed submission
		} finally {
			!skipLoading && setIsSubmitting(false);
		}
	};

	const handleHoldData = () => {
		console.log("Hold your data");
	};

	const handleAdviseTemplate = (content) => {
		if (!content) {
			showNotificationComponent(t("AdviseContentNotAvailable"), "red", "lightgray", true, 700, true);
			return;
		}

		const existingAdvise = form.values.advise;

		if (existingAdvise?.includes(content)) {
			showNotificationComponent(t("AdviseAlreadyExists"), "red", "lightgray", true, 700, true);
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

	const handleDeleteExEmergency = (idx) => {
		form.setFieldValue(
			"exEmergency",
			form.values?.exEmergency?.filter((_, index) => index !== idx)
		);
		if (update) update();
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
				bg="var(--theme-secondary-color-0)"
				p="sm"
			>
				<Grid w="100%" columns={24} gutter="xxxs">
					<Grid.Col span={18}>
						<Group align="end" gap="les">
							<Grid w="100%" columns={12} gutter="xxxs">
								<Grid.Col span={6}>
									<Select
										clearable
										searchable
										onSearchChange={setMedicineTerm}
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
								</Grid.Col>
								<Grid.Col span={6}>
									<Autocomplete
										tooltip={t("EnterGenericName")}
										id="generic"
										name="generic"
										data={medicineGenericData?.map((item, index) => ({
											label: item.generic,
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
								</Grid.Col>
							</Grid>
							<Grid w="100%" columns={12} gutter="xxxs">
								<Grid.Col span={6}>
									<Group grow gap="les">
										<SelectForm
											form={medicineForm}
											id="medicine_dosage_id"
											name="medicine_dosage_id"
											dropdownValue={dosage_options?.map((dosage) => ({
												value: dosage.id?.toString(),
												label: dosage.name,
											}))}
											value={medicineForm.values.medicine_dosage_id}
											placeholder={t("Dosage")}
											required
											tooltip={t("EnterDosage")}
											withCheckIcon={false}
										/>
										<SelectForm
											form={medicineForm}
											id="medicine_bymeal_id"
											name="medicine_bymeal_id"
											dropdownValue={by_meal_options?.map((byMeal) => ({
												value: byMeal.id?.toString(),
												label: byMeal.name,
											}))}
											value={medicineForm.values.medicine_bymeal_id}
											placeholder={t("By Meal")}
											tooltip={t("EnterWhenToTakeMedicine")}
											withCheckIcon={false}
										/>
									</Group>
								</Grid.Col>
								<Grid.Col span={6}>
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
											size="compact-md"
										>
											{t("Add")}
										</Button>
									</Group>
								</Grid.Col>
							</Grid>
						</Group>
					</Grid.Col>
					<Grid.Col span={6} bg={"white"}>
						<Grid w="100%" columns={12} gutter="xxxs">
							<Grid.Col span={12}>
								<Group grow gap="les">
									<SelectForm
										form={medicineForm}
										label=""
										id="treatments"
										name="treatments"
										dropdownValue={treatmentData?.data?.map((item) => ({
											label: item.name,
											value: item.id?.toString(),
										}))}
										value={medicineForm.values.treatments}
										placeholder={t("TreatmentTemplate")}
										required
										tooltip={t("TreatmentTemplate")}
										withCheckIcon={false}
										changeValue={populateMedicineData}
									/>
								</Group>
							</Grid.Col>
						</Grid>
						<Grid w="100%" columns={12} gutter="xxxs">
							<Grid.Col span={6}>
								<Button
									leftSection={<IconPlus size={16} />}
									w="100%"
									size="xs"
									type="button"
									variant="outline"
									color="green"
									onClick={openDosageForm}
								>
									{t("Dosage")}
								</Button>
							</Grid.Col>
							<Grid.Col span={6}>
								<Button
									w="100%"
									size="xs"
									type="button"
									variant="outline"
									color="red"
									onClick={openExPrescription}
								>
									{t("RxEmergency")}
								</Button>
							</Grid.Col>
						</Grid>
					</Grid.Col>
				</Grid>
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
			<ScrollArea
				h={baseHeight ? baseHeight : form.values.instruction ? mainAreaHeight - 420 - 50 : mainAreaHeight - 420}
				bg="white"
			>
				<Stack gap="2px" p="sm">
					{medicines?.length === 0 && form.values.exEmergency?.length === 0 && (
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
					{form.values?.exEmergency?.length > 0 && (
						<>
							{form.values?.exEmergency?.map((item, idx) => (
								<Flex justify="space-between" key={idx} align="center" gap="les">
									<Flex align="center">
										<IconMedicineSyrup stroke={1.5} size={20} />
										<Text className="capitalize" fz="14px">
											{item.value}
										</Text>
									</Flex>
									<ActionIcon
										variant="outline"
										color="var(--theme-error-color)"
										onClick={() => handleDeleteExEmergency(idx)}
									>
										<IconTrash size={16} />
									</ActionIcon>
								</Flex>
							))}
						</>
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

			{form.values.instruction && (
				<Flex bg="var(--theme-primary-color-0)" p="sm" justify="space-between" align="center">
					<Text w="100%">
						<strong>{t("Instruction")}:</strong> {form.values.instruction}
					</Text>
					<ActionIcon
						variant="outline"
						color="var(--theme-error-color)"
						onClick={() => form.setFieldValue("instruction", "")}
					>
						<IconTrash size={16} />
					</ActionIcon>
				</Flex>
			)}

			{/* =================== Advise form =================== */}
			{form && (
				<>
					<Grid columns={12} gutter="xxxs" mt="xxs" p="les">
						<Grid.Col span={5}>
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
						<Grid.Col span={7}>
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
						<Button w="100%" bg="var(--theme-error-color)" onClick={openPrescriptionPreview}>
							<Stack gap={0} align="center" justify="center">
								<Text>{t("Preview")}</Text>
								<Text mt="-les" fz="xs" c="var(--theme-secondary-color)">
									(alt + 4)
								</Text>
							</Stack>
						</Button>
						{/* <Button
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
						</Button> */}
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
					{printData && <PrescriptionFull ref={prescription2A4Ref} data={printData} />}
					{/* ----------- prescription preview ------------  */}
					{/* <PrescriptionFull ref={prescriptionPrintRef} data={printPreviewPrescriptionData} /> */}
				</>
			)}
			<GlobalDrawer
				opened={openedExPrescription}
				close={closeExPrescription}
				title={t("EmergencyPrescription")}
				size="28%"
			>
				<Stack pt="sm" justify="space-between" h={mainAreaHeight - 60}>
					<Box>
						<Autocomplete
							label="Enter Patient ID"
							placeholder={t("EmergencyPrescription")}
							data={emergencyData?.data?.map((p) => ({ value: p.name, label: p.name })) || []}
							value={autocompleteValue}
							onChange={setAutocompleteValue}
							onOptionSubmit={(value) => {
								handleAutocompleteOptionAdd(value, emergencyData?.data, "exEmergency");
								setTimeout(() => {
									setAutocompleteValue("");
								}, 0);
							}}
							classNames={inputCss}
							onBlur={handleFieldBlur}
							rightSection={<IconCaretUpDownFilled size={16} />}
						/>
						{/* =============== temporary items list with editable text inputs ================ */}
						{tempEmergencyItems?.length > 0 && (
							<Stack gap={0} bg="white" px="sm" className="borderRadiusAll" mt="xxs">
								<Text fw={600} fz="sm" mt="xs" c="var(--theme-primary-color)">
									{t("PendingItems")} ({tempEmergencyItems?.length})
								</Text>
								{tempEmergencyItems?.map((item, idx) => (
									<Flex
										key={idx}
										align="center"
										justify="space-between"
										px="es"
										py="xs"
										style={{
											borderBottom:
												idx !== tempEmergencyItems?.length - 1
													? "1px solid var(--theme-tertiary-color-4)"
													: "none",
										}}
									>
										<Textarea
											value={item.value}
											onChange={(event) => handleTempItemChange(idx, event.currentTarget.value)}
											placeholder="Edit value..."
											w="90%"
											styles={{ input: { height: "80px" } }}
										/>
										<ActionIcon
											color="red"
											size="xs"
											variant="subtle"
											onClick={() => handleTempItemRemove(idx)}
										>
											<IconX size={16} />
										</ActionIcon>
									</Flex>
								))}
							</Stack>
						)}
					</Box>
					<Flex justify="flex-end" gap="xs">
						<Button leftSection={<IconX size={16} />} bg="gray.6" onClick={closeExPrescription} w="120px">
							{t("Cancel")}
						</Button>
						<Button
							leftSection={<IconDeviceFloppy size={22} />}
							bg="var(--theme-primary-color-6)"
							onClick={handleEmergencyPrescriptionSave}
							w="120px"
						>
							{t("Save")}
						</Button>
					</Flex>
				</Stack>
			</GlobalDrawer>
			{/* prescription preview */}
			{id && (
				<GlobalDrawer
					opened={openedPrescriptionPreview}
					close={closePrescriptionPreview}
					title={t("PrescriptionPreview")}
					size="50%"
				>
					<Box my="sm">
						<PrescriptionPreview prescriptionId={id} />
					</Box>
				</GlobalDrawer>
			)}
			<ReferredPrescriptionDetailsDrawer opened={opened} close={close} prescriptionData={prescriptionData} />

			<CreateDosageDrawer opened={openedDosageForm} close={closeDosageForm} />
		</Box>
	);
}
