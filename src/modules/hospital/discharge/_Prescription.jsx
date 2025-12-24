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
	IconBookmark,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { getMedicineFormInitialValues } from "./helpers/request";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import DatePickerForm from "@components/form-builders/DatePicker";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useDebouncedState, useDisclosure, useHotkeys } from "@mantine/hooks";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import useAppLocalStore from "@hooks/useAppLocalStore";
import { HOSPITAL_DATA_ROUTES, MASTER_DATA_ROUTES } from "@/constants/routes";
import { getIndexEntityData, updateEntityData } from "@/app/store/core/crudThunk";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { useDispatch, useSelector } from "react-redux";
import { modals } from "@mantine/modals";
import MedicineListItem from "@hospital-components/MedicineListItem";
import { MODULES } from "@/constants";
import inputCss from "@assets/css/InputField.module.css";
import GlobalDrawer from "@components/drawers/GlobalDrawer";
import CreateDosageDrawer from "@hospital-components/drawer/CreateDosageDrawer";
import HistoryPrescription from "./HistoryPrescription";
import DischargeA4BN from "@hospital-components/print-formats/discharge/DischargeA4BN";
import {
	appendDosageValueToForm,
	appendGeneralValuesToForm,
	appendMealValueToForm,
	medicineOptionsFilter,
} from "@utils/prescription";
import DetailsDrawer from "@hospital-components/drawer/__DetailsDrawer";
import BookmarkDrawer from "@hospital-components/BookmarkDrawer";
import useDataWithoutStore from "@hooks/useDataWithoutStore";

const module = MODULES.DISCHARGE;

export default function Prescription({
	medicines,
	setMedicines,
	setShowHistory = () => {},
	hasRecords = false,
	baseHeight = 0,
	prescriptionId,
}) {
	const {
		diseasesProfile,
		features: { medicineDuration },
		advices: adviceData,
		user,
		dosages: dosage_options,
		meals: by_meal_options,
		medicines: medicineData,
		localMedicines: medicineGenericData,
	} = useAppLocalStore();
	const form = useForm({
		initialValues: {
			exEmergency: [],
			disease: "",
		},
	});
	const { id } = useParams();
	const createdBy = user;
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const dischargeA4Ref = useRef(null);
	const [updateKey, setUpdateKey] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { t } = useTranslation();
	const [medicineTerm, setMedicineTerm] = useDebouncedState("", 300);
	const [medicineGenericTerm, setMedicineGenericTerm] = useDebouncedState("", 300);
	// const { medicineData } = useMedicineData({ term: medicineTerm });
	// const { medicineGenericData } = useMedicineGenericData({ term: medicineGenericTerm });
	const medicineForm = useForm(getMedicineFormInitialValues());
	const [editIndex, setEditIndex] = useState(null);
	const { mainAreaHeight } = useOutletContext();
	const [openedBookmark, { open: openBookmark, close: closeBookmark }] = useDisclosure(false);
	const [printData, setPrintData] = useState(null);
	const emergencyData = useSelector((state) => state.crud.exemergency.data);
	const treatmentData = useSelector((state) => state.crud.treatment.data);
	const [openedDosageForm, { open: openDosageForm, close: closeDosageForm }] = useDisclosure(false);
	const [openedExPrescription, { open: openExPrescription, close: closeExPrescription }] = useDisclosure(false);
	const [openedPrescriptionPreview, { open: openPrescriptionPreview, close: closePrescriptionPreview }] =
		useDisclosure(false);
	// =============== autocomplete state for emergency prescription ================
	const [autocompleteValue, setAutocompleteValue] = useState("");
	const [tempEmergencyItems, setTempEmergencyItems] = useState([]);
	// const dosage_options = useSelector((state) => state.crud.dosage?.data?.data);
	// const by_meal_options = useSelector((state) => state.crud.byMeal?.data?.data);
	const [openedHistoryMedicine, { open: openHistoryMedicine, close: closeHistoryMedicine }] = useDisclosure(false);
	const { data: prescriptionData } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.INDEX}/${prescriptionId}`,
	});

	useEffect(() => {
		if (prescriptionData?.data) {
			const initialFormValues = JSON.parse(prescriptionData?.data?.json_content || "{}");
			form.setValues({
				disease: initialFormValues?.disease || "",
			});
		}
	}, [prescriptionData]);

	const printDischargeA4 = useReactToPrint({
		documentTitle: `discharge-${Date.now().toLocaleString()}`,
		content: () => dischargeA4Ref.current,
	});

	useEffect(() => {
		dispatch(
			getIndexEntityData({
				url: MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR.INDEX_RXEMERGENCY,
				module: "exemergency",
			})
		);

		dispatch(
			getIndexEntityData({
				url: MASTER_DATA_ROUTES.API_ROUTES.TREATMENT_TEMPLATES.INDEX,
				params: {
					particular_type: "treatment-template",
					treatment_mode: "ipd-treatment",
				},
				module: "treatment",
			})
		);
	}, []);

	useEffect(() => {
		if (!printData) return;
		printDischargeA4();
	}, [printData]);

	const durationModeDropdown = medicineDuration?.modes
		? medicineDuration?.modes.map((mode) => ({
				value: mode.id?.toString(),
				label: mode.name,
				name_bn: mode.name_bn,
		  }))
		: [];

	console.log(
		diseasesProfile?.map((disease) => ({
			value: disease.name,
			label: disease.name,
		}))
	);

	// =============== handler for adding autocomplete option to temporary list ================
	const handleAutocompleteOptionAdd = (value, data, type, custom = false) => {
		if (!custom) {
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
		} else {
			if (!value?.trim())
				return showNotificationComponent(t("Please enter a valid value"), "red", "lightgray", true, 700, true);
			const newItem = {
				id: Date.now(),
				name: value,
				value: value,
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
				printDischargeA4();
				showNotificationComponent(t("Prescription printed successfully"), "blue", "lightgray", true, 700, true);
			},
		],
	]);

	const handleChange = (field, value) => {
		medicineForm.setFieldValue(field, value);

		// If medicine field is being changed, auto-populate other fields from medicine data
		if ((field === "medicine_id" || field === "generic") && value) {
			const selectedMedicine =
				field === "medicine_id"
					? medicineData?.find((item) => item.product_id?.toString() === value)
					: medicineGenericData?.find((item) => item.generic === value);

			if (selectedMedicine) {
				appendGeneralValuesToForm(medicineForm, selectedMedicine);

				// Auto-populate by_meal if available
				if (selectedMedicine.medicine_bymeal_id) {
					appendMealValueToForm(medicineForm, by_meal_options, selectedMedicine.medicine_bymeal_id);
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
					appendDosageValueToForm(medicineForm, dosage_options, selectedMedicine.medicine_dosage_id);
				}
			}
		}

		if (field === "generic" && value) {
			medicineForm.clearFieldError("medicine_id");
		}

		if (field === "medicine_id" && value) {
			medicineForm.clearFieldError("generic");
		}
	};

	const handleAdd = (values) => {
		if (editIndex !== null) {
			const updated = [...medicines];
			updated[editIndex] = values;
			setMedicines(updated);
			setEditIndex(null);
		} else {
			setMedicines([...medicines, values]);
			setUpdateKey((prev) => prev + 1);

			medicineForm.reset();
			setTimeout(() => document.getElementById("medicine_id").focus(), [100]);
		}
		setEditIndex(null);
	};

	const handleDelete = (idx) => {
		setMedicines(medicines.filter((_, index) => index !== idx));
		if (editIndex === idx) {
			medicineForm.reset();
			setEditIndex(null);
		}
	};

	const handleReset = () => {
		setMedicines([]);
		medicineForm.reset();
		setEditIndex(null);

		if (medicineForm) {
			medicineForm.reset();
		}
	};

	const openConfirmationModal = () => {
		modals.openConfirmModal({
			title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
			labels: { confirm: t("Confirm"), cancel: t("Cancel") },
			confirmProps: { color: "red" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleDischargeSubmit({ skipLoading: false, redirect: true }),
		});
	};

	const handleDischargeSubmit = async ({ skipLoading = false, redirect = false }) => {
		!skipLoading && setIsSubmitting(true);

		try {
			const formValue = {
				is_discharged: true,
				is_completed: true,
				medicines,
				advise: form.values.advise || "",
				follow_up_date: form.values.follow_up_date || null,
				prescription_date: new Date().toISOString().split("T")[0],
				created_by_id: createdBy?.id,
				exEmergency: form.values.exEmergency || [],
				instruction: form.values.instruction || "",
				disease: form.values.disease || "",
			};

			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.UPDATE}/${prescriptionId}`,
				data: formValue,
				module,
			};

			// return console.log(formValue);
			const resultAction = await dispatch(updateEntityData(value));

			if (updateEntityData.rejected.match(resultAction)) {
				showNotificationComponent(resultAction.payload.message, "red", "lightgray", true, 700, true);
			} else {
				showNotificationComponent(t("PrescriptionSavedSuccessfully"), "green", "lightgray", true, 700, true);
				dispatch(setRefetchData({ module, refetching: true }));
				if (redirect)
					navigate(`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.IPD_ADMITTED.MANAGE}/${id}?tab=dashboard`);
				return resultAction.payload?.data || {}; // Indicate successful submission
			}
		} catch (error) {
			console.error("Error submitting discharge:", error);
			showNotificationComponent(t("SomethingWentWrong"), "red", "lightgray", true, 700, true);
			return {}; // Indicate failed submission
		} finally {
			!skipLoading && setIsSubmitting(false);
		}
	};

	const handleDischargePrintSubmit = async () => {
		const result = await handleDischargeSubmit({ skipLoading: false, redirect: false });

		if (result.status === 200) {
			setPrintData(result.data);
		}
	};

	const handleHoldData = () => {
		console.log("HoldYourData");
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
		}
	};

	const handleDeleteExEmergency = (idx) => {
		form.setFieldValue(
			"exEmergency",
			form.values?.exEmergency?.filter((_, index) => index !== idx)
		);
	};

	return (
		<Box className="borderRadiusAll" bg="var(--mantine-color-white)" pos="relative">
			<Box
				onSubmit={medicineForm.onSubmit(handleAdd)}
				key={updateKey}
				component="form"
				bg="var(--theme-primary-color-0)"
				p="sm"
			>
				<Grid w="100%" columns={24} gutter="3xs">
					<Grid.Col span={18}>
						<Group align="end" gap="les">
							<Grid w="100%" columns={12} gutter="3xs">
								<Grid.Col span={6}>
									<Select
										disabled={medicineForm.values.generic}
										limit={20}
										clearable
										searchable
										filter={medicineOptionsFilter}
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
										clearable
										disabled={medicineForm.values.medicine_id}
										limit={20}
										filter={medicineOptionsFilter}
										tooltip={t("EnterSelfMedicine")}
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
										placeholder={t("SelfMedicine")}
										onBlur={() => setMedicineGenericTerm("")}
										classNames={inputCss}
									/>
								</Grid.Col>
							</Grid>
							<Grid w="100%" columns={12} gutter="3xs">
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
											dropdownValue={durationModeDropdown}
											value={medicineForm.values.duration}
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
							</Grid>
						</Group>
					</Grid.Col>
					<Grid.Col span={6} bg="var(--mantine-color-white)">
						{/* <Grid w="100%" columns={12} gutter="3xs">
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
						</Grid> */}

						<Grid w="100%" columns={12} gutter="les">
							<Grid.Col span={10}>
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
									tooltip={t("TreatmentTemplate")}
									withCheckIcon={false}
									changeValue={populateMedicineData}
								/>
							</Grid.Col>
							<Grid.Col span={2}>
								<Tooltip label={t("CreateTreatmentTemplate")}>
									<ActionIcon
										fw={"400"}
										type="button"
										size="lg"
										color="var(--theme-primary-color-5)"
										onClick={openBookmark}
									>
										<IconBookmark size={16} />
									</ActionIcon>
								</Tooltip>
							</Grid.Col>
						</Grid>
						{/* <Grid w="100%" columns={12} gutter="les" mt="4px">
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
									{t("AddDosage")}
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
						</Grid> */}
						<Grid w="100%" columns={12} gutter="les" mt="4px">
							<Grid.Col span={10}>
								<Button
									leftSection={<IconPlus size={16} />}
									w="100%"
									fw={"400"}
									type="button"
									color="var(--theme-primary-color-5)"
									onClick={openDosageForm}
								>
									{t("Dose")}
								</Button>
							</Grid.Col>
							<Grid.Col span={2}>
								<ActionIcon
									fw={"400"}
									type="button"
									size="lg"
									color="var(--theme-secondary-color-5)"
									onClick={openExPrescription}
								>
									{t("Rx")}
								</ActionIcon>
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
					<Tooltip label={t("HistoryMedicine")}>
						<ActionIcon size="lg" bg="var(--theme-primary-color-6)" onClick={openHistoryMedicine}>
							<IconHistory size={16} />
						</ActionIcon>
					</Tooltip>
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
				h={baseHeight ? baseHeight : form.values.comment ? mainAreaHeight - 420 - 50 : mainAreaHeight - 420}
				bg="var(--mantine-color-white)"
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
							by_meal_options={by_meal_options}
							dosage_options={dosage_options}
							durationModeDropdown={durationModeDropdown}
							type="discharge"
						/>
					))}
				</Stack>
			</ScrollArea>

			{form.values.comment && (
				<Flex bg="var(--theme-primary-color-0)" p="sm" justify="space-between" align="center">
					<Text w="100%">
						<strong>{t("Referred")}:</strong> {form.values.comment}
					</Text>
				</Flex>
			)}

			{/* =================== Advise form =================== */}
			{form && (
				<>
					<Grid columns={12} gutter="3xs" mt="2xs" p="les">
						<Grid.Col span={3}>
							<Box fz="md" c="white">
								<Text bg="var(--theme-save-btn-color)" fz="md" c="white" px="sm" py="les">
									{t("AdviseTemplate")}
								</Text>
								<ScrollArea h={96} p="les" className="borderRadiusAll">
									{adviceData?.map((advise) => (
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
										placeholder="Write an advice..."
										showRightSection={false}
										style={{ input: { height: "72px" } }}
									/>
								</Box>
							</Box>
						</Grid.Col>
						<Grid.Col span={3}>
							<Box bg="var(--theme-primary-color-0)" h="100%">
								<Text bg="var(--theme-primary-color-6)" fz="md" c="white" px="sm" py="les">
									{t("DiseaseProfile")}
								</Text>
								<Box p="sm">
									<DatePickerForm
										defaultValue={null}
										form={form}
										label=""
										tooltip="Enter follow up date"
										name="follow_up_date"
										value={form.values.follow_up_date}
										placeholder="Follow up date"
									/>
								</Box>
								<Box pl="sm" pr="sm">
									<SelectForm
										dropdownValue={diseasesProfile?.map((disease) => ({
											value: disease.name,
											label: disease.name,
										}))}
										form={form}
										label=""
										id="disease"
										tooltip={t("Disease")}
										name="disease"
										value={form.values.disease}
										placeholder={t("Disease")}
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

						{/* <Button w="100%" bg="var(--theme-hold-btn-color)" onClick={handleHoldData}>
							<Stack gap={0} align="center" justify="center">
								<Text>{t("Hold")}</Text>
								<Text mt="-les" fz="xs" c="var(--theme-secondary-color)">
									(alt + 2)
								</Text>
							</Stack>
						</Button> */}
						<Button w="100%" bg="var(--theme-save-btn-color)" onClick={openPrescriptionPreview}>
							<Stack gap={0} align="center" justify="center">
								<Text>{t("Preview")}</Text>
								<Text mt="-les" fz="xs" c="var(--theme-secondary-color)">
									(alt + 4)
								</Text>
							</Stack>
						</Button>
						<Button w="100%" bg="var(--theme-secondary-color-6)" onClick={handleDischargePrintSubmit}>
							<Stack gap={0} align="center" justify="center">
								<Text>{t("Print")}</Text>
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
				</>
			)}
			{printData && <DischargeA4BN ref={dischargeA4Ref} data={printData} />}

			<GlobalDrawer
				opened={openedExPrescription}
				close={closeExPrescription}
				title={t("EmergencyPrescription")}
				size="28%"
			>
				<Stack pt="sm" justify="space-between" h={mainAreaHeight - 60}>
					<Box>
						<Flex gap="sm" w="100%" align="center">
							<Autocomplete
								label="Enter Ex Emergency"
								placeholder={t("EmergencyPrescription")}
								data={
									emergencyData?.data?.map((p) => ({
										value: p.name,
										label: p.name,
									})) || []
								}
								value={autocompleteValue}
								onChange={setAutocompleteValue}
								onOptionSubmit={(value) => {
									handleAutocompleteOptionAdd(value, emergencyData?.data, "exEmergency");
									setTimeout(() => {
										setAutocompleteValue("");
									}, 0);
								}}
								w="100%"
								classNames={inputCss}
								rightSection={<IconCaretUpDownFilled size={16} />}
							/>
							<ActionIcon
								onClick={() => {
									handleAutocompleteOptionAdd(
										autocompleteValue,
										emergencyData?.data,
										"exEmergency",
										true
									);
									setTimeout(() => {
										setAutocompleteValue("");
									}, 0);
								}}
								mt="24px"
								size="lg"
							>
								<IconPlus size={16} />
							</ActionIcon>
						</Flex>
						{/* =============== temporary items list with editable text inputs ================ */}
						{tempEmergencyItems?.length > 0 && (
							<Stack gap={0} bg="var(--mantine-color-white)" px="sm" className="borderRadiusAll" mt="2xs">
								<Text fw={600} fz="sm" mt="xs" c="var(--theme-primary-color)">
									{t("Particulars")} ({tempEmergencyItems?.length})
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
			{prescriptionId && (
				<DetailsDrawer
					opened={openedPrescriptionPreview}
					close={closePrescriptionPreview}
					prescriptionId={prescriptionId}
				/>
			)}

			{prescriptionId && (
				<GlobalDrawer
					opened={openedHistoryMedicine}
					close={closeHistoryMedicine}
					title={t("PreviousPrescription")}
					size="25%"
				>
					<HistoryPrescription setMedicines={setMedicines} closeHistoryMedicine={closeHistoryMedicine} />
				</GlobalDrawer>
			)}

			{/* <ReferredPrescriptionDetailsDrawer opened={opened} close={close} prescriptionData={prescriptionData} /> */}

			<CreateDosageDrawer opened={openedDosageForm} close={closeDosageForm} />

			<BookmarkDrawer opened={openedBookmark} isDischarged close={closeBookmark} type="ipd-treatment" />
		</Box>
	);
}
