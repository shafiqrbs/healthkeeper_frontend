import { useEffect, useMemo, useRef, useState } from "react";
import {
	Box,
	Button,
	Group,
	Select,
	rem,
	ActionIcon,
	Grid,
	Flex,
	Switch,
	Stack,
	Autocomplete,
	Text,
	Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
	IconAlertCircle,
	IconCaretUpDownFilled,
	IconDeviceFloppy,
	IconPlus,
	IconTrashX,
	IconX,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { getTreatmentMedicineInitialValues } from "../core/treatmentTemplates/helpers/request";
import { useOutletContext, useParams } from "react-router-dom";
import { useDebouncedState, useDisclosure, useHotkeys } from "@mantine/hooks";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import useMedicineGenericData from "@hooks/useMedicineGenericData";
import { ERROR_NOTIFICATION_COLOR, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import inputCss from "@/assets/css/InputField.module.css";
import { MASTER_DATA_ROUTES } from "@/constants/routes";
import { deleteEntityData, getIndexEntityData, storeEntityData } from "@/app/store/core/crudThunk";
import { successNotification } from "@components/notification/successNotification";
import { errorNotification } from "@components/notification/errorNotification";
import { useDispatch, useSelector } from "react-redux";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import { deleteNotification } from "@components/notification/deleteNotification";
import { notifications } from "@mantine/notifications";
import { DataTable } from "mantine-datatable";
import tableCss from "@assets/css/Table.module.css";
import {
	appendDosageValueToForm,
	appendGeneralValuesToForm,
	appendMealValueToForm,
	medicineOptionsFilter,
} from "@utils/prescription";
import FormValidatorWrapper from "@components/form-builders/FormValidatorWrapper";
import useAppLocalStore from "@hooks/useAppLocalStore";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";
import AddDosagePopover from "@components/drawers/AddDosagePopover";
// import AddGenericPopover from "@components/drawers/AddGenericPopover";
import GlobalDrawer from "@components/drawers/GlobalDrawer";
import { setRefetchData } from "@/app/store/core/crudSlice";

export default function TreatmentAddMedicineForm({ medicines, module, setMedicines }) {
	const { features, meals, dosages, medicines: medicineData } = useAppLocalStore();
	const emergencyData = useSelector((state) => state.crud.exemergency.data);
	const [autocompleteValue, setAutocompleteValue] = useState("");
	const [updateKey, setUpdateKey] = useState(0);
	const { t } = useTranslation();
	const [medicineTerm, setMedicineTerm] = useDebouncedState("", 300);
	// const { medicineData } = useMedicineData({ term: medicineTerm });
	// const { medicineGenericData } = useMedicineGenericData({ term: medicineGenericTerm });
	const medicineForm = useForm(getTreatmentMedicineInitialValues());
	const [editIndex, setEditIndex] = useState(null);
	const { mainAreaHeight } = useOutletContext();
	const { treatmentId } = useParams();
	const dispatch = useDispatch();
	const [medicineGenericDebounce, setMedicineGenericDebounce] = useDebouncedState("", 300);
	const [medicineGenericSearchValue, setMedicineGenericSearchValue] = useState("");
	const [openedExPrescription, { open: openExPrescription, close: closeExPrescription }] = useDisclosure(false);
	const [durationModeKey, setDurationModeKey] = useState(0);
	const genericRef = useRef(null);
	const [tempEmergencyItems, setTempEmergencyItems] = useState([]);
	const emergencyRefetching = useSelector((state) => state.crud.exemergency.refetching);
	const [medicineMode, setMedicineMode] = useState("generic");
	const { medicineGenericData: genericData } = useMedicineGenericData({
		term: medicineGenericDebounce,
		mode: medicineMode,
	});
	const {
		data: entity,
		refetch: refetchEntity,
		isLoading: isLoadingEntity,
	} = useDataWithoutStore({
		url: `${MASTER_DATA_ROUTES.API_ROUTES.TREATMENT_TEMPLATES.VIEW}/${treatmentId}`,
	});
	const entityData = entity?.data?.treatment_medicine_format;

	useEffect(() => {
		if (medicineTerm.length === 0) {
			medicineForm.setFieldValue("medicine_id", "");
		}
	}, [medicineTerm]);

	useEffect(() => {
		dispatch(
			getIndexEntityData({
				url: MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR.INDEX_RXEMERGENCY,
				module: "exemergency",
			})
		);
	}, [emergencyRefetching]);

	const durationModeDropdown = features?.medicineDuration?.modes
		? features?.medicineDuration?.modes.map((mode) => ({
				value: mode.id?.toString(),
				label: mode.name,
				name_bn: mode.name_bn,
		  }))
		: [];

	// Add hotkey for save functionality
	useHotkeys([
		[
			"alt+1",
			() => {
				setMedicines([]);
				medicineForm.reset();

				setEditIndex(null);
			},
		],
	]);

	useEffect(() => {
		setMedicineGenericDebounce(medicineGenericSearchValue);
	}, [medicineGenericSearchValue]);

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
				setTempEmergencyItems((prev) => [...prev, newItem]);
			}
		} else {
			if (!value?.trim())
				return showNotificationComponent(t("Please enter a valid value"), "red", "lightgray", true, 700, true);
			const newItem = {
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
				setTempEmergencyItems((prev) => [...prev, newItem]);
			}
		}
	};

	const handleTempItemChange = (index, newValue) => {
		setTempEmergencyItems((prev) => prev.map((item, idx) => (idx === index ? { ...item, value: newValue } : item)));
	};

	const handleTempItemRemove = (index) => {
		setTempEmergencyItems((prev) => prev.filter((_, idx) => idx !== index));
	};

	const handleChange = (field, value) => {
		medicineForm.setFieldValue(field, value);

		// If medicine field is being changed, auto-populate other fields from medicine data
		if ((field === "medicine_id" || field === "generic_id") && value) {
			const selectedMedicine =
				field === "medicine_id"
					? medicineData?.find((item) => item.product_id?.toString() === value?.toString())
					: genericData?.find((item) => item.generic_id?.toString() === value);
			console.log("selectedMedicine", selectedMedicine);
			if (selectedMedicine) {
				appendGeneralValuesToForm(medicineForm, selectedMedicine);
				medicineForm.setFieldValue("stock_id", selectedMedicine?.stock_id?.toString());

				if (selectedMedicine.medicine_bymeal_id) {
					appendMealValueToForm(medicineForm, meals, selectedMedicine.medicine_bymeal_id);
				}

				if (selectedMedicine.medicine_dosage_id) {
					appendDosageValueToForm(medicineForm, dosages, selectedMedicine.medicine_dosage_id);
				}
			}
		}

		if (value && (field === "medicine_id" || field === "generic_id")) {
			medicineForm.clearFieldError(field === "medicine_id" ? "generic_id" : "medicine_id");
		}
	};

	const handleAdd = (values) => {
		// =============== check if generic_id already exists in medicines array ================
		// if (isGenericIdDuplicate(medicines, values.generic_id?.toString())) {
		// 	handleResetToInitialState();
		// 	setUpdateKey((prev) => prev + 1);
		// 	medicineForm.reset();
		// 	return;
		// }

		submitTreatmentValue(values);

		setMedicines([...medicines, values]);

		setUpdateKey((prev) => prev + 1);
		medicineForm.reset();
	};

	async function submitTreatmentValue(values) {
		try {
			const value = {
				url: `${MASTER_DATA_ROUTES.API_ROUTES.TREATMENT_MEDICINE_FORMAT.CREATE}`,
				data: { ...values, treatment_template_id: treatmentId },
				module,
			};

			const resultAction = await dispatch(storeEntityData(value));
			if (storeEntityData.rejected.match(resultAction)) {
				const fieldErrors = resultAction.payload.errors;
				if (fieldErrors) {
					const errorObject = {};
					Object.keys(fieldErrors).forEach((key) => {
						errorObject[key] = fieldErrors[key][0];
					});
					medicineForm.setErrors(errorObject);
				}
			} else if (storeEntityData.fulfilled.match(resultAction)) {
				medicineForm.reset();
				successNotification(t("InsertSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
				setMedicineGenericSearchValue("");
				await refetchEntity();
			}
		} catch (error) {
			console.error(error);
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		}
	}

	const genericOptions = useMemo(
		() =>
			genericData?.map((item) => ({
				value: item.generic_id?.toString(),
				label: item.name,
				generic: item.generic,
			})) ?? [],
		[genericData]
	);

	const handleDeleteSuccess = async (report, id) => {
		const res = await dispatch(
			deleteEntityData({
				url: `${MASTER_DATA_ROUTES.API_ROUTES.TREATMENT_MEDICINE_FORMAT.DELETE}/${id}`,
				module,
				id,
			})
		);

		if (deleteEntityData.fulfilled.match(res)) {
			deleteNotification(t("DeletedSuccessfully"), ERROR_NOTIFICATION_COLOR);
			await refetchEntity();
		} else {
			notifications.show({
				color: ERROR_NOTIFICATION_COLOR,
				title: t("DeleteFailed"),
				icon: <IconAlertCircle style={{ width: rem(18), height: rem(18) }} />,
			});
		}
	};

	const handleEmergencyPrescriptionSave = async () => {
		if (tempEmergencyItems.length === 0) {
			showNotificationComponent(t("Please add at least one emergency item"), "red", "lightgray", true, 700, true);
			return;
		}

		// clear temporary items and autocomplete
		setTempEmergencyItems([]);
		setAutocompleteValue("");

		console.log(tempEmergencyItems);

		tempEmergencyItems.forEach(async (item) => {
			submitTreatmentValue({
				...item,
				generic: item.value,
				medicine_name: item.name,
				treatment_template_id: treatmentId,
			});
		});

		// close drawer
		closeExPrescription();
	};

	return (
		<Box className="borderRadiusAll" bg="var(--mantine-color-white)">
			<Box
				onSubmit={medicineForm.onSubmit(handleAdd)}
				key={updateKey}
				component="form"
				bg="var(--theme-primary-color-0)"
				p="xs"
			>
				<Group grow preventGrowOverflow={false} w="100%" gap="les">
					<Grid columns={24} gutter="3xs" mt="2xs" p="les">
						<Grid.Col span={12}>
							<FormValidatorWrapper opened={medicineForm.errors.medicine_id}>
								<Select
									disabled={medicineForm.values.generic}
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
										generic: item.generic || "",
									}))}
									filter={medicineOptionsFilter}
									value={medicineForm.values.medicine_id}
									onChange={(v) => handleChange("medicine_id", v)}
									placeholder={t("Medicine")}
									tooltip="Select medicine"
									nothingFoundMessage="Type to find medicine..."
									classNames={inputCss}
									error={!!medicineForm.errors.medicine_id}
								/>
							</FormValidatorWrapper>
						</Grid.Col>
						<Grid.Col span={12}>
							<Flex gap="les" align="center">
								<Switch
									size="lg"
									radius="sm"
									onLabel="GEN"
									offLabel="Brand"
									checked={medicineMode === "generic"}
									onChange={(event) =>
										setMedicineMode(event.currentTarget.checked ? "generic" : "brand")
									}
								/>
								<FormValidatorWrapper opened={medicineForm.errors.generic_id}>
									<Select
										searchable
										searchValue={medicineGenericSearchValue}
										onSearchChange={setMedicineGenericSearchValue}
										clearable
										disabled={medicineForm.values.medicine_id}
										ref={genericRef}
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
										onBlur={() => setMedicineGenericSearchValue(medicineGenericSearchValue)}
										placeholder={t("GenericName")}
										classNames={inputCss}
										error={!!medicineForm.errors.generic_id}
										// rightSection={
										// 	<AddGenericPopover
										// 		dbMedicines={dbMedicines}
										// 		setDbMedicines={setDbMedicines}
										// 		prescription_id={prescriptionData?.data?.prescription_uid}
										// 	/>
										// }
										comboboxProps={{ withinPortal: false }}
										w="100%"
									/>
								</FormValidatorWrapper>
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
						<Grid.Col span={12}>
							<Group grow gap="les">
								<FormValidatorWrapper
									position="bottom-end"
									opened={medicineForm.errors.medicine_dosage_id}
								>
									<Select
										searchable
										clearable
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
										rightSection={<AddDosagePopover form={medicineForm} />}
									/>
								</FormValidatorWrapper>

								<FormValidatorWrapper
									position="bottom-end"
									opened={medicineForm.errors.medicine_bymeal_id}
								>
									<Select
										searchable
										clearable
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
						<Grid.Col span={3}>
							<InputNumberForm
								form={medicineForm}
								id="quantity"
								name="quantity"
								value={medicineForm.values.quantity}
								placeholder={t("Quantity")}
								required
								tooltip={t("EnterQuantity")}
							/>
						</Grid.Col>
						<Grid.Col span={3}>
							<InputNumberForm
								form={medicineForm}
								id="duration"
								name="duration"
								value={medicineForm.values.duration}
								placeholder={t("Duration")}
								required
								tooltip={t("EnterQuantity")}
							/>
						</Grid.Col>
						<Grid.Col span={3}>
							<FormValidatorWrapper position="bottom-end" opened={medicineForm.errors.duration_mode_id}>
								<Select
									key={durationModeKey}
									clearable
									classNames={inputCss}
									id="duration_mode_id"
									name="duration_mode_id"
									data={durationModeDropdown.map((item) => ({
										value: item.value,
										label: item.label,
									}))}
									value={medicineForm.values?.duration_mode_id}
									placeholder={t("DurationMode")}
									tooltip={t("EnterMeditationDurationMode")}
									onChange={(v) => handleChange("duration_mode_id", v)}
									error={!!medicineForm.errors.duration}
									withCheckIcon={false}
								/>
							</FormValidatorWrapper>
						</Grid.Col>
						<Grid.Col span={3}>
							<Button
								w="100%"
								leftSection={<IconPlus size={16} />}
								type="submit"
								variant="filled"
								bg="var(--theme-secondary-color-6)"
							>
								{t("Add")}
							</Button>
						</Grid.Col>
					</Grid>
				</Group>
			</Box>
			<Box>
				<DataTable
					classNames={{
						root: tableCss.root,
						table: tableCss.table,
						body: tableCss.body,
						header: tableCss.header,
						footer: tableCss.footer,
					}}
					records={entityData}
					columns={[
						{
							accessor: "index",
							title: t("S/N"),
							textAlignment: "right",
							render: (item) => entityData?.indexOf(item) + 1,
						},
						{
							accessor: "medicine_name",
							title: t("MedicineName"),
						},
						{
							accessor: "generic",
							title: t("GenericName"),
						},
						{
							accessor: "medicine_dosage_name",
							title: t("Dosage"),
							render: (item) => item?.medicine_dosage?.name,
						},

						{
							accessor: "medicine_dosage_name_bn",
							title: t("DosageBn"),
							render: (item) => item?.medicine_dosage?.name_bn,
						},

						{
							accessor: "quantity",
							title: t("DosageQty"),
							render: (item) => item?.quantity,
						},

						{
							accessor: "medicine_bymeal",
							title: t("ByMeal"),
							render: (item) => item?.medicine_bymeal?.name,
						},

						{
							accessor: "duration",
							title: t("Duration"),
							render: (item) => `${item?.duration || ""} ${item?.duration_mode?.name || ""}`,
						},
						{
							accessor: "",
							title: "",
							width: "100px",
							render: (item) => (
								<Group justify="center">
									<ActionIcon
										variant="transparent"
										size="lg"
										color="var(--theme-delete-color)"
										onClick={() => handleDeleteSuccess(treatmentId, item.id)}
									>
										<IconTrashX height={16} width={16} stroke={1.5} />
									</ActionIcon>
								</Group>
							),
						},
					]}
					fetching={isLoadingEntity}
					loaderSize="xs"
					loaderColor="grape"
					height={mainAreaHeight - 200}
				/>
			</Box>

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
		</Box>
	);
}
