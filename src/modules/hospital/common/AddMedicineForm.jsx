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
	rem,
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
	IconBookmark,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { getMedicineFormInitialValues } from "../prescription/helpers/request";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import PrescriptionFullBN from "@hospital-components/print-formats/prescription/PrescriptionFullBN";
import { useDebouncedState, useDisclosure, useHotkeys } from "@mantine/hooks";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import useAppLocalStore from "@hooks/useAppLocalStore";
import { HOSPITAL_DATA_ROUTES, MASTER_DATA_ROUTES } from "@/constants/routes";
import { getIndexEntityData, storeEntityData, updateEntityData } from "@/app/store/core/crudThunk";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { useDispatch, useSelector } from "react-redux";
import { modals } from "@mantine/modals";
import MedicineListItem from "./MedicineListItem";
import { SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import inputCss from "@assets/css/InputField.module.css";
import ReferredPrescriptionDetailsDrawer from "@modules/hospital/visit/__RefrerredPrescriptionDetailsDrawer";
import InputForm from "@components/form-builders/InputForm";
import GlobalDrawer from "@components/drawers/GlobalDrawer";
import CreateDosageDrawer from "./drawer/CreateDosageDrawer";
import {
	appendDosageValueToForm,
	appendDurationModeValueToForm,
	appendGeneralValuesToForm,
	appendMealValueToForm,
	generateMedicinePayload,
	medicineOptionsFilter,
	isGenericIdDuplicate,
} from "@utils/prescription";
import FormValidatorWrapper from "@components/form-builders/FormValidatorWrapper";
import BookmarkDrawer from "./BookmarkDrawer";
import { notifications } from "@mantine/notifications";
import { useAuthStore } from "@/store/useAuthStore";
import OpdBookmarkDrawer from "./OpdBookmarkDrawer";

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
	ignoreOpdQuantityLimit = false,
	redirectUrl = null,
	updatedResponse = {},
	updating = false,
}) {
	const {
		user,
		meals,
		dosages,
		advices,
		features,
		medicines: medicineData,
		localMedicines: medicineGenericData,
	} = useAppLocalStore();

	const medicineIdRef = useRef(null);
	const genericRef = useRef(null);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const prescription2A4Ref = useRef(null);
	const prescriptionPrintA4Ref = useRef(null);
	const [ updateKey, setUpdateKey ] = useState(0);
	const { prescriptionId } = useParams();
	const [ isSubmitting, setIsSubmitting ] = useState(false);
	const { t } = useTranslation();
	const [ medicineTerm, setMedicineTerm ] = useDebouncedState("", 300);
	const medicineForm = useForm(getMedicineFormInitialValues());
	const [ editIndex, setEditIndex ] = useState(null);
	const { mainAreaHeight } = useOutletContext();
	const [ printData, setPrintData ] = useState(null);
	const [ printData2A4, setPrintData2A4 ] = useState(null);
	const emergencyData = useSelector((state) => state.crud.exemergency.data);
	const treatmentData = useSelector((state) => state.crud.treatment.data);
	const [ opened, { open, close } ] = useDisclosure(false);
	const [ openedDosageForm, { open: openDosageForm, close: closeDosageForm } ] = useDisclosure(false);
	const [ openedExPrescription, { open: openExPrescription, close: closeExPrescription } ] = useDisclosure(false);
	const [ openedPrescriptionPreview, { open: openPrescriptionPreview, close: closePrescriptionPreview } ] =
		useDisclosure(false);
	const [ openedBookmark, { open: openBookmark, close: closeBookmark } ] = useDisclosure(false);
	// =============== autocomplete state for emergency prescription ================
	const [ autocompleteValue, setAutocompleteValue ] = useState("");
	const [ tempEmergencyItems, setTempEmergencyItems ] = useState([]);
	const treatmentRefetching = useSelector((state) => state.crud.treatment?.refetching);
	const emergencyRefetching = useSelector((state) => state.crud.exemergency.refetching);
	const [ showPrint, setShowPrint ] = useState(false);
	const [ medicineDosageSearchValue, setMedicineDosageSearchValue ] = useState("");
	const [ medicineByMealSearchValue, setMedicineByMealSearchValue ] = useState("");
	const [ durationModeKey, setDurationModeKey ] = useState(0);

	const printPrescription2A4 = useReactToPrint({
		documentTitle: `prescription-${Date.now().toLocaleString()}`,
		content: () => prescription2A4Ref.current,
	});

	const prescriptionPrintA4 = useReactToPrint({
		documentTitle: `prescription-${Date.now().toLocaleString()}`,
		content: () => prescriptionPrintA4Ref.current,
	});

	const durationModeDropdown = features?.medicineDuration?.modes
		? features?.medicineDuration?.modes.map((mode) => ({
			value: mode.id?.toString(),
			label: mode.name,
			name_bn: mode.name_bn,
		}))
		: [];

	useEffect(() => {
		dispatch(
			getIndexEntityData({
				url: MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR.INDEX_RXEMERGENCY,
				module: "exemergency",
			})
		);
	}, [ emergencyRefetching ]);

	useEffect(() => {
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
	}, [ treatmentRefetching ]);

	useEffect(() => {
		if (medicineTerm.length === 0) {
			medicineForm.setFieldValue("medicine_id", "");
		}

		if (medicineDosageSearchValue.length === 0) {
			medicineForm.setFieldValue("medicine_dosage_id", "");
		}

		if (medicineByMealSearchValue.length === 0) {
			medicineForm.setFieldValue("medicine_bymeal_id", "");
		}
	}, [ medicineDosageSearchValue, medicineByMealSearchValue, medicineTerm ]);

	useEffect(() => {
		if (!printData) return;
		printPrescription2A4();
	}, [ printData ]);

	const handleFieldBlur = () => {
		// Only update if update function exists and form has data
		if (update && form && form.values) {
			update();
		}
	};

	// =============== handler for adding autocomplete option to temporary list ================
	const handleAutocompleteOptionAdd = async (value, data, type, custom = false) => {
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
				setTempEmergencyItems((prev) => [ ...prev, newItem ]);
			}
		} else {
			if (!value?.trim())
				return showNotificationComponent(t("Please enter a valid value"), "red", "lightgray", true, 700, true);
			const newItem = {
				// id: Date.now(),
				name: value,
				value,
				type,
				// isEditable: true,
			};
			const resultAction = await dispatch(
				storeEntityData({
					url: MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR.CREATE,
					data: {
						name: value,
						particular_type: "rx-emergency",
						particular_type_master_id: 25,
					},
					module: "exemergency",
				})
			);
			dispatch(setRefetchData({ module: "exemergency", refetching: true }));

			if (storeEntityData.rejected.match(resultAction)) {
				showNotificationComponent(resultAction.payload.message, "red", "lightgray", true, 700, true);
			} else {
				showNotificationComponent(t("InsertSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
				dispatch(setRefetchData({ module: "exemergency", refetching: true }));
				setTempEmergencyItems((prev) => [ ...prev, newItem ]);
			}
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
		const newExEmergency = [ ...currentExEmergency, ...tempEmergencyItems ];

		form.setFieldValue("exEmergency", newExEmergency);

		// clear temporary items and autocomplete
		setTempEmergencyItems([]);
		setAutocompleteValue("");

		// close drawer
		closeExPrescription();
		showNotificationComponent(t("Extra Emergency added to the prescription"), SUCCESS_NOTIFICATION_COLOR);
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
			"alt+4",
			() => {
				printPrescription2A4();
				showNotificationComponent(t("PrescriptionPrintedSuccessfully"), "blue", "lightgray", true, 700, true);
			},
		],
		[
			"alt+n",
			() => {
				medicineIdRef.current?.focus();
			},
		],
	]);

	const handleResetToInitialState = () => {
		medicineForm.reset();
		setMedicineDosageSearchValue("");
		setMedicineByMealSearchValue("");
		setMedicineTerm("");
		setDurationModeKey((prev) => prev + 100);
		showNotificationComponent(t("GenericAlreadyExists"), "red", "lightgray", true, 700, true);
		requestAnimationFrame(() => document.getElementById("medicine_id").focus());
	};

	const handleChange = (field, value) => {
		medicineForm.setFieldValue(field, value);

		// If medicine field is being changed, auto-populate other fields from medicine data
		if ((field === "medicine_id" || field === "generic") && value) {
			const selectedMedicine =
				field === "medicine_id"
					? medicineData?.find((item) => item.product_id?.toString() === value)
					: medicineGenericData?.find((item) => item.generic === value);

			console.log(selectedMedicine)

			if (selectedMedicine) {
				appendGeneralValuesToForm(medicineForm, selectedMedicine);

				if (selectedMedicine.duration) {
					medicineForm.setFieldValue("quantity", selectedMedicine.duration);
				}

				if (selectedMedicine.duration_mode) {
					appendDurationModeValueToForm(medicineForm, durationModeDropdown, selectedMedicine.duration_mode);
				}

				// Auto-populate by_meal if available
				if (selectedMedicine.medicine_bymeal_id) {
					appendMealValueToForm(medicineForm, meals, selectedMedicine.medicine_bymeal_id);
				}
				// Auto-populate dose_details if available (for times field)
				if (selectedMedicine.medicine_dosage_id) {
					appendDosageValueToForm(medicineForm, dosages, selectedMedicine.medicine_dosage_id);
				}
			}

			if (field === "medicine_id" && selectedMedicine.generic && selectedMedicine.medicine_dosage_id) {
				const medicinePayload = generateMedicinePayload(medicineForm, selectedMedicine, {
					dosage_options: dosages,
					by_meal_options: meals,
				});

				// =============== check if generic_id already exists in medicines array ================
				if (isGenericIdDuplicate(medicines, medicinePayload.generic_id)) {
					handleResetToInitialState();
					return;
				}

				handleAdd(medicinePayload);
				medicineForm.reset();
				setMedicineDosageSearchValue("");
				setMedicineByMealSearchValue("");
				setMedicineTerm("");
				setDurationModeKey((prev) => prev + 100);
				notifications.show({
					title: "Automatically Added",
					message: <span style={{ color: "white" }}><strong>{selectedMedicine.product_name}</strong> added successfully</span>,
					color: "white",
					position: "top-center",
					autoClose: 4000,
					styles: {
						root: {
							backgroundColor: "var(--theme-secondary-color-7)",
							height: 76,
						},
						title: {
							color: "white",
							fontSize: rem(18),
						},
						description: {
							color: "white",
							fontSize: rem(16),
						},
						closeButton: {
							color: "white",
							background: "#ffffff36"
						}

					},
				});
				requestAnimationFrame(() => document.getElementById("medicine_id").focus());
			}
		}

		if (value && (field === "medicine_id" || field === "generic")) {
			medicineForm.clearFieldError(field === "medicine_id" ? "generic" : "medicine_id");
		}

		if (field === "medicine_bymeal_id" && value) {
			appendMealValueToForm(medicineForm, meals, value);
		}

		if (field === "medicine_dosage_id" && value) {
			appendDosageValueToForm(medicineForm, dosages, value);
		}

		if (field === "duration" && value) {
			appendDurationModeValueToForm(medicineForm, durationModeDropdown, value);
		}
	};

	const handleAdd = (values) => {
		if (editIndex !== null) {
			// =============== when editing, check if generic_id exists in other medicines (excluding current one) ================
			const otherMedicines = medicines.filter((_, index) => index !== editIndex);
			if (isGenericIdDuplicate(otherMedicines, values.generic_id)) {
				handleResetToInitialState();
				return;
			}

			const updated = [ ...medicines ];
			updated[ editIndex ] = values;
			setMedicines(updated);
			setEditIndex(null);
		} else {
			// =============== check if generic_id already exists in medicines array ================
			if (isGenericIdDuplicate(medicines, values.generic_id)) {
				handleResetToInitialState();
				return;
			}

			setMedicines([ ...medicines, values ]);
			setUpdateKey((prev) => prev + 1);

			if (update) update([ ...medicines, values ]);

			medicineForm.reset();
			setMedicineDosageSearchValue("");
			setMedicineByMealSearchValue("");
			setDurationModeKey((prev) => prev + 100);
			requestAnimationFrame(() => document.getElementById("medicine_id").focus());
		}
		setEditIndex(null);
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
			onConfirm: () => handlePrescriptionSubmit({ skipLoading: false, redirect: true }),
		});
	};

	const handlePrescriptionSubmit = async ({ skipLoading = false, redirect = false }) => {
		!skipLoading && setIsSubmitting(true);

		try {
			const createdBy = user;

			const formValue = {
				is_completed: true,
				medicines,
				advise: form.values.advise || "",
				weight: form.values.weight || "",
				follow_up_date: form.values.follow_up_date || null,
				prescription_date: new Date().toISOString().split("T")[ 0 ],
				created_by_id: createdBy?.id,
				exEmergency: form.values.exEmergency || [],
				instruction: form.values.instruction || "",
				pharmacyInstruction: form.values.pharmacyInstruction || "",
				patient_report: {
					basic_info: form.values.basic_info || {},
					patient_examination: form.values.dynamicFormData,
					order: tabParticulars.map((item) => ({
						[ item?.particular_type?.slug || item?.slug ]: item?.ordering,
					})),
				},
			};

			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.UPDATE}/${prescriptionId}`,
				data: formValue,
				module,
			};

			const resultAction = await dispatch(updateEntityData(value));

			if (updateEntityData.rejected.match(resultAction)) {
				showNotificationComponent(resultAction.payload.message, "red", "lightgray", true, 700, true);
			} else {
				setRefetchData({ module, refetching: true });
				const updateNestedState = useAuthStore.getState()?.updateNestedState;
				updateNestedState("hospitalConfig.localMedicines", resultAction.payload?.data?.data?.localMedicines);
				if (redirect) navigate(redirectUrl || HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.PRESCRIPTION.INDEX);
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

	const handlePrescriptionPreview = async () => {
		const result = await handlePrescriptionSubmit({ skipLoading: false, redirect: false });
		if (result.status === 200) {
			setPrintData(result.data);
			requestAnimationFrame(openPrescriptionPreview);
		}
	};

	const handlePreviewPrint = () => {
		setShowPrint(true);
		requestAnimationFrame(printPrescription2A4);
	};

	const handlePrescriptionPrint2A4 = async () => {
		if (updatedResponse && Object.keys(updatedResponse).length > 0) {
			let transformedData = { ...updatedResponse };
			try {
				const jsonContent =
					typeof transformedData.json_content === "string"
						? JSON.parse(transformedData.json_content)
						: transformedData.json_content || {};

				if (!jsonContent.patient_report) {
					jsonContent.patient_report = {};
				}

				if (tabParticulars && tabParticulars.length > 0) {
					jsonContent.patient_report.order = tabParticulars
						.sort((a, b) => (a?.ordering ?? 0) - (b?.ordering ?? 0))
						.map((item, index) => {
							const slug = item?.particular_type?.slug || item?.slug;
							if (slug) {
								return { [ slug ]: index + 1 };
							}
							return null;
						})
						.filter(Boolean);
				}

				if (!jsonContent.patient_report.patient_examination) {
					jsonContent.patient_report.patient_examination = form.values.dynamicFormData || {};
				}

				transformedData.json_content = JSON.stringify(jsonContent);
				setPrintData2A4(transformedData);
				// background prescription saving
				// handlePrescriptionSubmit({ skipLoading: false, redirect: false });
			} catch (error) {
				console.error("Error transforming updatedResponse:", error);
				setPrintData2A4(updatedResponse);
			}
		} else {
			const result = await handlePrescriptionSubmit({ skipLoading: false, redirect: false });
			if (result.status === 200) {
				setPrintData2A4(result.data);
			}
		}

		requestAnimationFrame(prescriptionPrintA4);
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

	useEffect(() => {
		if (!form.values.advise) return;

		const id = setTimeout(() => {
			handleFieldBlur();
		}, 800);

		return () => clearTimeout(id);
	}, [ form.values.advise ]);

	const populateMedicineData = (v) => {
		const selectedTreatment = treatmentData?.data?.find((item) => item.id?.toString() === v);

		const medicinesFormat = selectedTreatment?.treatment_medicine_format.map((item) => ({
			...item,
			admin_status: item.admin_status ?? 0,
			dose_details: item.medicine_dosage?.name,
			dose_details_bn: item.medicine_dosage?.name_bn,
			by_meal: item.medicine_bymeal?.name,
			by_meal_bn: item.medicine_bymeal?.name_bn,
			duration_mode_bn: item.duration_mode?.name_bn,
			duration: item.duration_mode?.name || item.duration,
			quantity: item.quantity,
			medicine_bymeal_id: item.medicine_bymeal?.id?.toString(),
			medicine_dosage_id: item.medicine_dosage?.id?.toString(),
			medicine_duration_id: item.medicine_duration?.id?.toString(),
			opd_quantity: item.opd_quantity,
			opd_limit: item.opd_limit,
		}));

		if (medicinesFormat) {
			setMedicines(medicinesFormat);
			if (update) update(medicinesFormat);
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

	const handleMedicineSearch = (value) => {
		setMedicineTerm(value);
	};

	return (
		<Box className="borderRadiusAll" bg="var(--mantine-color-white)">
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
									<FormValidatorWrapper opened={medicineForm.errors.medicine_id}>
										<Select
											ref={medicineIdRef}
											disabled={medicineForm.values.generic}
											searchable
											filter={medicineOptionsFilter}
											onSearchChange={handleMedicineSearch}
											id="medicine_id"
											name="medicine_id"
											data={medicineData?.map((item) => ({
												label: item.product_name,
												value: item.product_id?.toString(),
												generic: item.generic || "",
											}))}
											value={medicineForm.values.medicine_id}
											onChange={(v) => handleChange("medicine_id", v)}
											placeholder={t("MedicinePlaceholder")}
											tooltip="Select medicine"
											nothingFoundMessage="Type to find medicine..."
											classNames={inputCss}
											error={!!medicineForm.errors.medicine_id}
										/>
									</FormValidatorWrapper>
								</Grid.Col>
								<Grid.Col span={6}>
									<FormValidatorWrapper opened={medicineForm.errors.generic}>
										<Autocomplete
											disabled={medicineForm.values.medicine_id}
											ref={genericRef}
											tooltip={t("EnterSelfMedicine")}
											id="generic"
											name="generic"
											data={medicineGenericData?.map((item, index) => ({
												label: item?.name || item?.product_name || item?.generic,
												value: `${item.name} ${index}`,
												generic: item?.generic || "",
											}))}
											limit={20}
											filter={medicineOptionsFilter}
											value={medicineForm.values.generic}
											onChange={(v) => {
												handleChange("generic", v);
											}}
											placeholder={t("SelfMedicine")}
											// onBlur={() => setMedicineGenericTerm("")}
											classNames={inputCss}
											error={!!medicineForm.errors.generic}
										/>
									</FormValidatorWrapper>
								</Grid.Col>
							</Grid>
							<Grid w="100%" columns={12} gutter="3xs">
								<Grid.Col span={6}>
									<Group grow gap="les">
										<FormValidatorWrapper
											position="bottom-end"
											opened={medicineForm.errors.medicine_dosage_id}
										>
											<Select
												searchable
												clearable
												searchValue={medicineDosageSearchValue}
												onSearchChange={setMedicineDosageSearchValue}
												classNames={inputCss}
												id="medicine_dosage_id"
												name="medicine_dosage_id"
												data={dosages?.map((dosage) => ({
													value: dosage.id?.toString(),
													label: dosage.name,
												}))}
												value={medicineForm.values?.medicine_dosage_id}
												placeholder={t("Dosage")}
												tooltip={t("EnterDosage")}
												onChange={(v) => handleChange("medicine_dosage_id", v)}
												error={!!medicineForm.errors.medicine_dosage_id}
											/>
										</FormValidatorWrapper>

										<FormValidatorWrapper
											position="bottom-end"
											opened={medicineForm.errors.medicine_bymeal_id}
										>
											<Select
												searchable
												clearable
												searchValue={medicineByMealSearchValue}
												onSearchChange={setMedicineByMealSearchValue}
												classNames={inputCss}
												id="medicine_bymeal_id"
												name="medicine_bymeal_id"
												data={meals?.map((byMeal) => ({
													value: byMeal.id?.toString(),
													label: byMeal.name,
												}))}
												value={medicineForm.values?.medicine_bymeal_id}
												placeholder={t("ByMeal")}
												tooltip={t("EnterWhenToTakeMedicine")}
												onChange={(v) => handleChange("medicine_bymeal_id", v)}
												error={!!medicineForm.errors.medicine_bymeal_id}
											/>
										</FormValidatorWrapper>
									</Group>
								</Grid.Col>

								<Grid.Col span={6}>
									<Group grow gap="les">
										<InputNumberForm
											form={medicineForm}
											id="quantity"
											name="quantity"
											value={medicineForm.values.quantity}
											placeholder={t("Duration")}
											tooltip={t("EnterDuration")}
										/>

										<FormValidatorWrapper
											position="bottom-end"
											opened={medicineForm.errors.duration}
										>
											<Select
												key={durationModeKey}
												clearable
												classNames={inputCss}
												id="duration"
												name="duration"
												data={durationModeDropdown.map((item) => ({
													value: item.label,
													label: item.label,
												}))}
												value={medicineForm.values?.duration}
												placeholder={t("DurationMode")}
												tooltip={t("EnterMeditationDurationMode")}
												onChange={(v) => handleChange("duration", v)}
												error={!!medicineForm.errors.duration}
												withCheckIcon={false}
											/>
										</FormValidatorWrapper>
										<Button
											disabled={
												(!medicineForm.values?.medicine_id && !medicineForm.values?.generic) ||
												!medicineForm.values?.medicine_dosage_id
											}
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
						<Grid w="100%" columns={12} gutter="3xs">
							<Grid.Col span={10}>
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
										tooltip={t("TreatmentTemplate")}
										withCheckIcon={false}
										changeValue={populateMedicineData}
									/>
								</Group>
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
					{prescriptionData?.data?.patient_referred_id && (
						<Tooltip label="Referred">
							<ActionIcon size="lg" bg="red" onClick={() => handleReferredViewPrescription()}>
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
							update={update}
							by_meal_options={meals}
							dosage_options={dosages}
							ignoreOpdQuantityLimit={ignoreOpdQuantityLimit}
							durationModeDropdown={durationModeDropdown}
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
									{advices?.map((advise) => (
										<Flex
											align="center"
											gap="les"
											bg="var(--theme-primary-color-0)"
											c="dark"
											key={advise.id}
											onClick={() => {
												handleAdviseTemplate(advise?.content);
											}}
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
										onBlur={handleFieldBlur}
									/>
								</Box>
							</Box>
						</Grid.Col>
						<Grid.Col span={3}>
							<Box bg="var(--theme-primary-color-0)" h="100%">
								<Text bg="var(--theme-primary-color-6)" fz="md" c="white" px="sm" py="les">
									{t("Follow Up")}
								</Text>
								<Box p="sm">
									<InputForm
										form={form}
										label=""
										id="follow_up_date"
										tooltip="Follow up instruction"
										name="follow_up_date"
										onBlur={handleFieldBlur}
										value={form.values.follow_up_date}
										placeholder="Follow up instruction"
									/>
								</Box>
								<Box pl="sm" pr="sm">
									<InputForm
										form={form}
										label=""
										id="pharmacyInstruction"
										tooltip="Pharmacy Instruction"
										name="pharmacyInstruction"
										onBlur={handleFieldBlur}
										value={form.values.pharmacyInstruction}
										placeholder="PharmacyInstruction"
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

						<Button w="100%" bg="var(--theme-prescription-btn-color)" onClick={handlePrescriptionPreview}>
							<Stack gap={0} align="center" justify="center">
								<Text>{t("Preview")}</Text>
								<Text mt="-les" fz="xs" c="var(--theme-secondary-color)">
									(alt + 4)
								</Text>
							</Stack>
						</Button>
						<Button loading={updating} w="100%" bg="var(--theme-secondary-color-6)" onClick={handlePrescriptionPrint2A4}>
							<Stack gap={0} align="center" justify="center">
								<Text>{t("Print")}</Text>
								<Text mt="-les" fz="xs" c="var(--theme-secondary-color)">
									(alt + p)
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

			{/* ======== individual print data only print when click print button ======= */}
			{printData2A4 && <PrescriptionFullBN ref={prescriptionPrintA4Ref} data={printData2A4} />}

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
								onBlur={handleFieldBlur}
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

			<GlobalDrawer
				opened={openedPrescriptionPreview}
				close={() => {
					closePrescriptionPreview();
					setShowPrint(false);
				}}
				title={t("PrescriptionPreview")}
				size="50%"
			>
				<Box>
					<ScrollArea h={mainAreaHeight - 120}>
						<PrescriptionFullBN data={printData} preview />
					</ScrollArea>

					<Flex justify="flex-end" gap="xs" bottom="0" right="0" p="sm">
						<Button
							leftSection={<IconX size={16} />}
							bg="gray.6"
							onClick={() => {
								closePrescriptionPreview();
								setShowPrint(false);
							}}
							w="120px"
						>
							{t("Cancel")}
						</Button>
						<Button
							leftSection={<IconDeviceFloppy size={22} />}
							bg="var(--theme-primary-color-6)"
							onClick={handlePreviewPrint}
							w="120px"
						>
							{t("Print")}
						</Button>
					</Flex>
					{/* prescription preview */}
					{printData && showPrint && <PrescriptionFullBN ref={prescription2A4Ref} data={printData} />}
				</Box>
			</GlobalDrawer>

			<ReferredPrescriptionDetailsDrawer opened={opened} close={close} prescriptionData={prescriptionData} />
			<CreateDosageDrawer opened={openedDosageForm} close={closeDosageForm} />

			<OpdBookmarkDrawer opened={openedBookmark} close={closeBookmark} />
		</Box>
	);
}
