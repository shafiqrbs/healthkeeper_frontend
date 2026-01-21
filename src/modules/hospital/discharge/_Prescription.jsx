import { useEffect, useRef, useState, useMemo, useCallback } from "react";
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
	LoadingOverlay,
	Collapse,
	Switch,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
	IconPlus,
	IconRestore,
	IconDeviceFloppy,
	IconX,
	IconCaretUpDownFilled,
	IconBookmark,
	IconChevronRight,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { getMedicineFormInitialValues } from "./helpers/request";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useDebouncedState, useDisclosure, useHotkeys } from "@mantine/hooks";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import useAppLocalStore from "@hooks/useAppLocalStore";
import { HOSPITAL_DATA_ROUTES, MASTER_DATA_ROUTES } from "@/constants/routes";
import { getIndexEntityData, updateEntityData, storeEntityData } from "@/app/store/core/crudThunk";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { useAuthStore } from "@/store/useAuthStore";
import { useDispatch, useSelector } from "react-redux";
import { modals } from "@mantine/modals";
import { MODULES, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
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
import StarterKit from "@tiptap/starter-kit";
import { useEditor } from "@tiptap/react";
import Subscript from "@tiptap/extension-subscript";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import Highlight from "@tiptap/extension-highlight";
import { RichTextEditor } from "@mantine/tiptap";
import Placeholder from "@tiptap/extension-placeholder";
import MedicineListTable from "@hospital-components/MedicineListTable";
import AddDosagePopover from "@components/drawers/AddDosagePopover";
import FormValidatorWrapper from "@components/form-builders/FormValidatorWrapper";
import AddGenericPopover from "@components/drawers/AddGenericPopover";
import useMedicineGenericData from "@hooks/useMedicineGenericData";
import DischargeMedicineListTable from "@hospital-components/DischargeMedicineListTable";

const module = MODULES.DISCHARGE;

export default function Prescription({
	isLoading,
	refetch,
	medicines,
	setMedicines,
	baseHeight = 0,
	prescriptionId,
	forDischarge = false,
}) {
	const {
		diseasesProfile,
		features: { medicineDuration },
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
			disease_details: "",
			examination_investigation: "",
			treatment_medication: "",
			follow_up_date: "",
			extra_medicine: "",
		},
	});
	const editor = useEditor({
		extensions: [
			StarterKit,
			Highlight,
			Superscript,
			Subscript,
			Placeholder.configure({ placeholder: "Enter your text here..." }),
			TextAlign.configure({ types: [ "heading", "paragraph" ] }),
		],
		content: form.values.extra_medicine || "",
		shouldRerenderOnTransaction: true,
		onUpdate: ({ editor }) => {
			// =============== sync editor content to form field when editor changes ================
			const htmlContent = editor.getHTML();
			form.setFieldValue("extra_medicine", htmlContent);
		},
	});

	// =============== sync form field to editor when form field changes (e.g., from loaded data) ================
	useEffect(() => {
		if (editor && form.values.extra_medicine !== undefined) {
			const currentEditorContent = editor.getHTML();
			if (currentEditorContent !== form.values.extra_medicine) {
				editor.commands.setContent(form.values.extra_medicine || "");
			}
		}
	}, [ form.values.extra_medicine, editor ]);

	const { id } = useParams();
	const createdBy = user;
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const dischargeA4Ref = useRef(null);
	const [ updateKey, setUpdateKey ] = useState(0);
	const [ isSubmitting, setIsSubmitting ] = useState(false);
	const { t } = useTranslation();
	const medicineForm = useForm(getMedicineFormInitialValues("discharge"));
	const [ editIndex, setEditIndex ] = useState(null);
	const { mainAreaHeight } = useOutletContext();
	const [ openedBookmark, { open: openBookmark, close: closeBookmark } ] = useDisclosure(false);
	const [ printData, setPrintData ] = useState(null);
	const emergencyData = useSelector((state) => state.crud.exemergency.data);
	const treatmentData = useSelector((state) => state.crud.treatment.data);
	const [ openedDosageForm, { open: openDosageForm, close: closeDosageForm } ] = useDisclosure(false);
	const [ openedExPrescription, { open: openExPrescription, close: closeExPrescription } ] = useDisclosure(false);
	const [ openedPrescriptionPreview, { open: openPrescriptionPreview, close: closePrescriptionPreview } ] =
		useDisclosure(false);
	// =============== autocomplete state for emergency prescription ================
	const [ autocompleteValue, setAutocompleteValue ] = useState("");
	const [ tempEmergencyItems, setTempEmergencyItems ] = useState([]);
	const [ openedHistoryMedicine, { open: openHistoryMedicine, close: closeHistoryMedicine } ] = useDisclosure(false);
	const [ openedDiseaseProfile, { toggle: toggleDiseaseProfile } ] = useDisclosure(true);
	const [ showDiseaseProfile, setShowDiseaseProfile ] = useState(false);
	const [ medicineGenericDebounce, setMedicineGenericDebounce ] = useDebouncedState("", 300);
	const [ medicineGenericSearchValue, setMedicineGenericSearchValue ] = useState("");
	const [ medicineMode, setMedicineMode ] = useState("generic");
	const [ resetDosageKey, setResetDosageKey ] = useState(0);
	const { medicineGenericData: genericData } = useMedicineGenericData({
		term: medicineGenericDebounce,
		mode: medicineMode,
	});
	const {
		data: prescriptionData,
		refetch: refetchPrescriptionData,
		isLoading: isPrescriptionLoading,
	} = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.INDEX}/${prescriptionId}`,
	});

	const [ dbMedicines, setDbMedicines ] = useState([]);

	const sortedMedicines = useMemo(() => {
		return [ ...(medicines || []) ].sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0));
	}, [ medicines ]);

	useEffect(() => {
		if (prescriptionData?.data) {
			const initialFormValues = JSON.parse(prescriptionData?.data?.json_content || "{}");
			form.setValues({
				disease: initialFormValues?.disease || "",
				advise: initialFormValues?.advise || "",
				disease_details: initialFormValues?.disease_details || "",
				examination_investigation: initialFormValues?.examination_investigation || "",
				treatment_medication: initialFormValues?.treatment_medication || "",
				follow_up_date: initialFormValues?.follow_up_date || "",
				doctor_comment: initialFormValues?.doctor_comment || "",
				extra_medicines: initialFormValues?.extra_medicines || [],
				extra_medicine: initialFormValues?.extra_medicine || "",
			});

			// =============== sync medicines from prescription data ================
			const prescriptionMedicines = prescriptionData?.data?.prescription_medicine || [];
			const sortedPrescriptionMedicines = [ ...(prescriptionMedicines || []) ].sort(
				(a, b) => (a?.order ?? 0) - (b?.order ?? 0)
			);
			setDbMedicines(sortedPrescriptionMedicines);
		}
	}, [ prescriptionData ]);

	const printDischargeA4 = useReactToPrint({
		documentTitle: `discharge-${Date.now().toLocaleString()}`,
		content: () => dischargeA4Ref.current,
	});

	useEffect(() => {
		setMedicineGenericDebounce(medicineGenericSearchValue);
	}, [ medicineGenericSearchValue ]);

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
	}, [ printData ]);

	const genericOptions = useMemo(
		() =>
			genericData?.map((item) => ({
				value: item.generic_id?.toString(),
				label: item.name,
				generic: item.generic,
			})) ?? [],
		[ genericData ]
	);

	const durationModeDropdown = medicineDuration?.modes
		? medicineDuration?.modes.map((mode) => ({
			value: mode.id?.toString(),
			label: mode.name,
			name_bn: mode.name_bn,
		}))
		: [];

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
				setTempEmergencyItems((prev) => [ ...prev, newItem ]);
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
			setTempEmergencyItems((prev) => [ ...prev, newItem ]);
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

		tempEmergencyItems.forEach(async (item) => {
			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.MEDICINE_UPDATE}`,
				data: {
					generic: item.value,
					prescription_id: prescriptionData?.data?.prescription_uid,
				},
				module: "prescription",
			};

			const resultAction = await dispatch(storeEntityData(value));

			if (storeEntityData.rejected.match(resultAction)) {
				console.error(resultAction.payload.message);
			} else {
				const data = resultAction?.payload?.data?.data || {};
				const newMedicineData = {
					medicine_name: data?.medicine_name || "",
					generic: data?.generic || "",
					is_active: data?.is_active || 0,
					id: data?.id,
				};
				setDbMedicines((prev) => [ ...prev, newMedicineData ]);
			}
		});
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

	const handleAdd = async (values) => {
		// TODO: legacy code: must be removed later --- start
		if (editIndex !== null) {
			const updated = [ ...sortedMedicines ];
			updated[ editIndex ] = values;
			setMedicines(updated);
			setEditIndex(null);
		} else {
			const maxOrder =
				sortedMedicines.length > 0
					? Math.max(...sortedMedicines.map((med) => med.order ?? 0), sortedMedicines.length)
					: 0;
			const newMedicine = { ...values, order: maxOrder + 1 };
			const updatedMedicines = [ ...sortedMedicines, newMedicine ];
			setMedicines(updatedMedicines);
			setUpdateKey((prev) => prev + 1);

			medicineForm.reset();
			setTimeout(() => document.getElementById("medicine_id").focus(), [ 100 ]);
		}
		setEditIndex(null);
		// TODO: legacy code: must be removed later --- end

		const value = {
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.MEDICINE_UPDATE}`,
			data: {
				medicine_name: values.medicine_name,
				medicine_id: values.medicine_id || undefined,
				generic: values.generic,
				generic_id: values.generic_id,
				medicine_dosage_id: values.medicine_dosage_id,
				medicine_bymeal_id: values.medicine_bymeal_id,
				quantity: values.quantity,
				duration: values.duration,
				prescription_id: prescriptionId,
				mode: values.medicine_id ? "medicine" : "generic",
			},
			module,
		};

		const resultAction = await dispatch(storeEntityData(value));

		if (storeEntityData.rejected.match(resultAction)) {
			showNotificationComponent(resultAction.payload.message, "red", "lightgray", true, 700, true);
		} else {
			const data = resultAction?.payload?.data?.data || {};
			const newMedicineData = {
				company: data?.company || "",
				medicine_name: data?.medicine_name || "",
				generic: data?.generic || "",
				generic_id: data?.generic_id,
				medicine_id: data?.medicine_id,
				stock_item_id: data?.stock_item_id,
				medicine_dosage_id: data?.medicine_dosage_id || null,
				medicine_bymeal_id: data?.medicine_bymeal_id || null,
				dose_details: data?.dose_details || "",
				dose_details_bn: data?.dose_details_bn || "",
				daily_quantity: data?.daily_quantity || 0,
				by_meal: data?.by_meal || "",
				by_meal_bn: data?.by_meal_bn || "",
				is_active: data?.is_active || 0,
				id: data?.id,
				order: data?.order || 0,
			};
			showNotificationComponent(t("InsertSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
			const updateNestedState = useAuthStore.getState()?.updateNestedState;
			updateNestedState("hospitalConfig.localMedicines", resultAction.payload?.data?.data?.localMedicines);
			setDbMedicines([ ...dbMedicines, newMedicineData ]);
			setMedicineGenericSearchValue("");
		}
	};

	// =============== handler for deleting medicine from database ================
	const handleDeleteMedicine = useCallback(
		async (id) => {
			const resultAction = await dispatch(
				getIndexEntityData({
					url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.MEDICINE_DELETE}/${id}`,
					module,
				})
			);

			if (getIndexEntityData.rejected.match(resultAction)) {
				showNotificationComponent("Medicine could not be deleted", "red", "lightgray", true, 700, true);
			} else {
				// Use functional update to avoid stale closure issue
				setDbMedicines((prevMedicines) => {
					const filteredMedicines = prevMedicines.filter(
						(medicine) => medicine?.id?.toString() !== id?.toString()
					);
					return filteredMedicines;
				});
				showNotificationComponent(t("DeletedSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
			}
		},
		[ dispatch, module, t ]
	);
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
				prescription_date: new Date().toISOString().split("T")[ 0 ],
				created_by_id: createdBy?.id,
				exEmergency: form.values.exEmergency || [],
				instruction: form.values.instruction || "",
				disease: form.values.disease || "",
				disease_details: form.values.disease_details || "",
				examination_investigation: form.values.examination_investigation || "",
				treatment_medication: form.values.treatment_medication || "",
				doctor_comment: form.values.doctor_comment || "",
				extra_medicine: form.values.extra_medicine || "",
			};

			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.PRESCRIPTION}/${prescriptionId}`,
				data: formValue,
				module,
			};

			// return console.log(formValue);
			const resultAction = await dispatch(updateEntityData(value));

			if (updateEntityData.rejected.match(resultAction)) {
				showNotificationComponent(resultAction.payload.message, "red", "lightgray", true, 700, true);
			} else {
				dispatch(setRefetchData({ module, refetching: true }));
				refetch();
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

	const handleHoldData = () => {
		console.log("HoldYourData");
	};

	const populateMedicineData = async (v) => {
		const resultAction = await dispatch(
			updateEntityData({
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.TEMPLATE_UPDATE}/${prescriptionId}`,
				data: {
					template_id: v,
				},
				module,
			})
		);

		if (updateEntityData.rejected.match(resultAction)) {
			showNotificationComponent(resultAction.payload.message, "red", "lightgray", true, 700, true);
		} else {
			refetchPrescriptionData();
		}
	};

	const getMedicineFormSpan = () => {
		return showDiseaseProfile ? 19 : 24;
	};

	console.log(medicineForm.values?.medicine_dosage_id);

	return (
		<Box className="borderRadiusAll" bg="var(--mantine-color-white)" pos="relative">
			<LoadingOverlay
				visible={isLoading || isPrescriptionLoading}
				zIndex={1000}
				overlayProps={{ radius: "sm", blur: 2 }}
			/>
			<Tooltip
				label={showDiseaseProfile ? t("hideDiseaseProfile") : t("showDiseaseProfile")}
				position={showDiseaseProfile ? "left" : "right"}
			>
				<ActionIcon
					variant="filled"
					color={showDiseaseProfile ? "red" : "blue"}
					size="xl"
					radius="xl"
					onClick={() => setShowDiseaseProfile(!showDiseaseProfile)}
					style={{
						position: "fixed",
						top: "50%",
						left: showDiseaseProfile ? "calc(5/24 * 100% + 200px)" : "270px",
						transform: "translateY(-50%)",
						zIndex: 99,
						boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
					}}
				>
					{showDiseaseProfile ? <IconX size={18} /> : <IconChevronRight size={18} />}
				</ActionIcon>
			</Tooltip>
			<Grid columns={24} gutter="3xs">
				{showDiseaseProfile && (
					<Grid.Col span={5}>
						<ScrollArea h={mainAreaHeight - 0}>
							<Box bg="var(--theme-primary-color-0)" h="100%">
								<Flex
									bg="var(--theme-primary-color-6)"
									justify="space-between"
									align="center"
									px="sm"
									py="xs"
									style={{ cursor: "pointer" }}
								// onClick={toggleDiseaseProfile}
								>
									<Text fz="md" c="white">
										{t("DiseaseProfile")}
									</Text>
									{/* {openedDiseaseProfile ? (
										<IconChevronUp size={20} color="white" />
									) : (
										<IconChevronDown size={20} color="white" />
									)} */}
								</Flex>
								<Collapse in={openedDiseaseProfile}>
									<Box>
										<Box pl="sm" pr="sm" pt="sm">
											<SelectForm
												dropdownValue={diseasesProfile?.map((disease) => ({
													value: disease.name,
													label: disease.name,
												}))}
												form={form}
												label="Select Disease"
												id="disease"
												tooltip={t("Disease")}
												name="disease"
												value={form.values.disease}
												placeholder={t("Disease")}
											/>
										</Box>
										<Box pl="sm" pr="sm" pt="sm" pb="sm">
											<TextAreaForm
												form={form}
												label="Disease Details"
												name="disease_details"
												value={form.values.disease_details}
												placeholder={t("DiseaseDetails")}
												tooltip={t("EnterDiseaseDetails")}
												showRightSection={false}
												resize="vertical"
											/>
										</Box>
										<Box pl="sm" pr="sm" pb="sm">
											<TextAreaForm
												form={form}
												label="Examination Investigation"
												name="examination_investigation"
												value={form.values.examination_investigation}
												placeholder={t("ExaminationInvestigation")}
												tooltip={t("EnterExaminationInvestigation")}
												showRightSection={false}
												resize="vertical"
											/>
										</Box>
										<Box pl="sm" pr="sm" pb="sm">
											<TextAreaForm
												form={form}
												label="Treatment Medication"
												name="treatment_medication"
												value={form.values.treatment_medication}
												placeholder={t("TreatmentMedication")}
												tooltip={t("EnterTreatmentMedication")}
												showRightSection={false}
												resize="vertical"
											/>
										</Box>
										<Box pl="sm" pr="sm" pb="sm">
											<TextAreaForm
												form={form}
												label="Follow Up Date"
												name="follow_up_date"
												value={form.values.follow_up_date}
												placeholder={t("Follow up date")}
												tooltip={t("Follow up date")}
												showRightSection={false}
												resize="vertical"
											/>
										</Box>
										<Box px="sm" pb="sm">
											<TextAreaForm
												form={form}
												label="Advise"
												value={form.values.advise}
												name="advise"
												placeholder="Write an advice..."
												showRightSection={false}
												style={{ input: { height: "72px" } }}
											/>
										</Box>
										<Box pl="sm" pr="sm" pb="sm">
											<TextAreaForm
												form={form}
												label="Doctor Comment"
												name="doctor_comment"
												value={form.values.doctor_comment}
												placeholder={t("Doctor Comment")}
												tooltip={t("Enter Doctor Comment")}
												showRightSection={false}
												resize="vertical"
											/>
										</Box>
									</Box>
								</Collapse>
							</Box>
						</ScrollArea>
					</Grid.Col>
				)}
				<Grid.Col span={getMedicineFormSpan()}>
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
												classNames={inputCss}
											/>
										</Grid.Col>
										<Grid.Col span={6}>
											<Grid w="100%" columns={24} gutter="3xs">
												<Grid.Col span={3} mt={'3'}>
													<Switch
														size="lg"
														radius="sm"
														onLabel="GEN"
														offLabel="Brand"
														checked={medicineMode === "generic"}
														onChange={(event) =>
															setMedicineMode(
																event.currentTarget.checked ? "generic" : "brand"
															)
														}
													/>
												</Grid.Col>
												<Grid.Col span={21}>
													<FormValidatorWrapper opened={medicineForm.errors.generic_id}>
														<Select
															searchable
															searchValue={medicineGenericSearchValue}
															onSearchChange={setMedicineGenericSearchValue}
															clearable
															disabled={medicineForm.values.medicine_id}
															tooltip={t("EnterGenericName")}
															id="generic_id"
															name="generic_id"
															data={genericOptions}
															filter={medicineOptionsFilter}
															value={medicineForm.values.generic_id}
															onChange={(v, options) => {
																setMedicineGenericSearchValue(options.label);
																handleChange("generic_id", v);
																medicineForm.setFieldValue("medicine_name", options.label);
																medicineForm.setFieldValue("generic", options.generic);
															}}
															onBlur={() =>
																setMedicineGenericSearchValue(medicineGenericSearchValue)
															}
															placeholder={t("GenericName")}
															classNames={inputCss}
															error={!!medicineForm.errors.generic_id}
															w="100%"
															comboboxProps={{ withinPortal: false }}
															rightSection={
																<Flex align="center" gap="les" w="100%" pt="es" pr="3px" justify="flex-end">
																	{medicineForm.values?.generic_id && <IconX color="var(--theme-error-color)" className="cursor-pointer" size={16} onClick={() => {
																		medicineForm.setFieldValue("generic_id", null);
																		medicineForm.setFieldValue("generic", null);
																	}} />}
																	<AddGenericPopover
																		dbMedicines={dbMedicines}
																		setDbMedicines={setDbMedicines}
																		prescription_id={prescriptionData?.data?.prescription_uid}
																	/>
																</Flex>
															}
															rightSectionWidth={60}
														/>
													</FormValidatorWrapper>
												</Grid.Col>
											</Grid>
										</Grid.Col>
									</Grid>
									<Grid w="100%" columns={12} gutter="3xs">
										<Grid.Col span={6}>
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
												rightSection={
													<Flex align="center" gap="les" w="100%" pt="es" pr="3px" justify="flex-end">
														{medicineForm.values?.medicine_dosage_id && <IconX color="var(--theme-error-color)" className="cursor-pointer" size={16} onClick={() => {
															medicineForm.setFieldValue("medicine_dosage_id", null);
															setResetDosageKey((prev) => prev + 1);
														}} />}
														<AddDosagePopover form={medicineForm} />
													</Flex>
												}
												rightSectionWidth={60}
												key={resetDosageKey}
											/>
										</Grid.Col>
										<Grid.Col span={4}>
											<Group grow gap="les">
												<SelectForm
													form={medicineForm}
													id="medicine_bymeal_id"
													name="medicine_bymeal_id"
													dropdownValue={by_meal_options?.map((byMeal) => ({
														value: byMeal.id?.toString(),
														label: byMeal.name,
													}))}
													value={medicineForm.values.medicine_bymeal_id}
													placeholder={t("ByMeal")}
													tooltip={t("EnterWhenToTakeMedicine")}
													withCheckIcon={false}
												/>
											</Group>
										</Grid.Col>
										<Grid.Col span={2}>
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
											</Group>
										</Grid.Col>
									</Grid>
								</Group>
							</Grid.Col>
							<Grid.Col span={6} bg="var(--mantine-color-white)">
								<Flex gap="les" pr="les">
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
										styles={{ root: { width: "100%" } }}
									/>
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
								</Flex>

								<Grid w="100%" columns={12} gutter="les" mt="6px">
									<Grid.Col span={6}>
										{/*<Button
											leftSection={<IconPlus size={16} />}
											w="100%"
											fw={"400"}
											type="button"
											color="var(--theme-primary-color-5)"
											onClick={openDosageForm}
										>
											{t("Dose")}
										</Button>*/}
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
									</Grid.Col>
									<Grid.Col span={6}>
										<Flex gap="les" pr="les">
											<Button
												leftSection={<IconPlus size={16} />}
												type="submit"
												variant="filled"
												w="100%"
												bg="var(--theme-secondary-color-6)"
											>
												{t("Add")}
											</Button>
											<ActionIcon
												fw={"400"}
												type="button"
												size="lg"
												color="var(--theme-secondary-color-5)"
												onClick={openExPrescription}
											>
												{t("Rx")}
											</ActionIcon>
										</Flex>
									</Grid.Col>
								</Grid>
							</Grid.Col>
						</Grid>
					</Box>
					<ScrollArea h={mainAreaHeight - 414} bg="var(--mantine-color-white)">
						<Stack gap="2px">
							{dbMedicines?.length === 0 && form.values.exEmergency?.length === 0 && (
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
							{dbMedicines?.length > 0 &&
								(forDischarge ? (
									<DischargeMedicineListTable
										medicines={dbMedicines}
										showDelete={true}
										onDelete={handleDeleteMedicine}
										prescriptionId={prescriptionId}
										tableHeight={mainAreaHeight - 386}
										setMedicines={setDbMedicines}
										forDischarge
									/>
								) : (
									<MedicineListTable
										medicines={dbMedicines}
										showDelete={true}
										onDelete={handleDeleteMedicine}
										prescriptionId={prescriptionId}
										tableHeight={mainAreaHeight - 386}
										setMedicines={setDbMedicines}
										forDischarge
									/>
								))}
						</Stack>
					</ScrollArea>
					<Box pr="xs" my="xs" h={240}>
						<div className="tiptap-wrapper">
							<RichTextEditor editor={editor} variant="subtle">
								<RichTextEditor.Toolbar sticky stickyOffset="var(--docs-header-height)">
									<RichTextEditor.ControlsGroup>
										<RichTextEditor.Bold />
										<RichTextEditor.Italic />
										<RichTextEditor.Strikethrough />
										<RichTextEditor.ClearFormatting />
									</RichTextEditor.ControlsGroup>
									<RichTextEditor.ControlsGroup>
										<RichTextEditor.H1 />
										<RichTextEditor.H2 />
										<RichTextEditor.H3 />
										<RichTextEditor.H4 />
									</RichTextEditor.ControlsGroup>
									<RichTextEditor.ControlsGroup>
										<RichTextEditor.Blockquote />
										<RichTextEditor.Hr />
										<RichTextEditor.BulletList />
										<RichTextEditor.OrderedList />
									</RichTextEditor.ControlsGroup>
									<RichTextEditor.ControlsGroup>
										<RichTextEditor.AlignLeft />
										<RichTextEditor.AlignCenter />
										<RichTextEditor.AlignJustify />
										<RichTextEditor.AlignRight />
									</RichTextEditor.ControlsGroup>
								</RichTextEditor.Toolbar>
								<RichTextEditor.Content />
							</RichTextEditor>
						</div>
					</Box>

					{/* =================== submission buttons =================== */}
					{form && (
						<>
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
								{/* <Button w="100%" bg="var(--theme-save-btn-color)" onClick={openPrescriptionPreview}>
									<Stack gap={0} align="center" justify="center">
										<Text>{t("Preview")}</Text>
										<Text mt="-les" fz="xs" c="var(--theme-secondary-color)">
											(alt + 4)
										</Text>
									</Stack>
								</Button>
								<Button
									w="100%"
									bg="var(--theme-secondary-color-6)"
									onClick={handleDischargePrintSubmit}
								>
									<Stack gap={0} align="center" justify="center">
										<Text>{t("Print")}</Text>
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
						</>
					)}
				</Grid.Col>
			</Grid>

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
