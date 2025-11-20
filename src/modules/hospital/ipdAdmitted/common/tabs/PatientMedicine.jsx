import {
	ActionIcon,
	Autocomplete,
	Box,
	Button,
	Badge,
	Flex,
	Grid,
	Group,
	NumberInput,
	ScrollArea,
	Select,
	Stack,
	Text,
} from "@mantine/core";
import inputCss from "@assets/css/InputField.module.css";
import { useOutletContext, useParams } from "react-router-dom";
import SelectForm from "@components/form-builders/SelectForm";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import { IconCheck, IconPencil, IconPlus, IconX } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { PHARMACY_DROPDOWNS } from "@/app/store/core/utilitySlice";
import { useDispatch, useSelector } from "react-redux";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import useMedicineData from "@hooks/useMedicineData";
import useMedicineGenericData from "@hooks/useMedicineGenericData";
import { getMedicineFormInitialValues } from "../../helpers/request";
import { useForm } from "@mantine/form";
import TabsActionButtons from "@hospital-components/TabsActionButtons";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { getIndexEntityData, storeEntityData } from "@/app/store/core/crudThunk";
import { successNotification } from "@components/notification/successNotification";
import { errorNotification } from "@components/notification/errorNotification";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import {
	appendDosageValueToForm,
	appendGeneralValuesToForm,
	appendMealValueToForm,
	getByMeal,
	getDosage,
} from "@utils/prescription";
import CreateDosageDrawer from "@hospital-components/drawer/CreateDosageDrawer";

const DURATION_OPTIONS = [
	{ value: "day", label: "Day" },
	{ value: "week", label: "Week" },
	{ value: "month", label: "Month" },
	{ value: "year", label: "Year" },
];

function MedicineListItem({ index, medicine, setMedicines, handleDelete, dosage_options, by_meal_options }) {
	const { t } = useTranslation();
	const [mode, setMode] = useState("view");

	const openEditMode = () => {
		setMode("edit");
	};

	const closeEditMode = () => {
		setMode("view");
	};

	const handleChange = (field, value) => {
		setMedicines((prev) =>
			prev.map((med, i) => {
				if (i === index - 1) {
					const updatedMedicine = { ...med, [field]: value };

					// =============== add by_meal field when medicine_bymeal_id changes ================
					if (field === "medicine_bymeal_id") {
						const by_meal = getByMeal(by_meal_options, value);
						updatedMedicine.by_meal = by_meal?.name;
						updatedMedicine.by_meal_bn = by_meal?.name_bn;
					}

					// =============== add dose_details field when medicine_dosage_id changes ================
					if (field === "medicine_dosage_id") {
						const dose_details = getDosage(dosage_options, value);
						updatedMedicine.dose_details = dose_details?.name;
						updatedMedicine.dose_details_bn = dose_details?.name_bn;
					}

					return updatedMedicine;
				}
				return med;
			})
		);
	};

	const handleEdit = () => {
		setMedicines((prev) => prev.map((medicine, i) => (i === index - 1 ? { ...medicine, ...medicine } : medicine)));
		closeEditMode();
	};

	return (
		<Box>
			<Text mb="es" fz="sm" className="cursor-pointer">
				{index}. {medicine.medicine_name || medicine.generic}
			</Text>
			<Flex justify="space-between" align="center" gap="10px">
				{mode === "view" ? (
					<Box ml="md" fz="xs" c="var(--theme-tertiary-color-8)">
						{medicine.dose_details} ---- {medicine.by_meal} ---- {medicine.quantity} ----{" "}
						{medicine.duration}
					</Box>
				) : (
					<Grid columns={24} gutter="xs">
						<Grid.Col span={7}>
							<Select
								size="xs"
								label=""
								data={dosage_options?.map((dosage) => ({
									value: dosage.id?.toString(),
									label: dosage.name,
								}))}
								value={medicine.medicine_dosage_id}
								placeholder={t("Dosage")}
								disabled={mode === "view"}
								onChange={(v) => handleChange("medicine_dosage_id", v)}
							/>
						</Grid.Col>
						<Grid.Col span={7}>
							<Select
								size="xs"
								label=""
								data={by_meal_options?.map((byMeal) => ({
									value: byMeal.id?.toString(),
									label: byMeal.name,
								}))}
								value={medicine.medicine_bymeal_id}
								placeholder={t("ByMeal")}
								disabled={mode === "view"}
								onChange={(v) => handleChange("medicine_bymeal_id", v)}
							/>
						</Grid.Col>
						<Grid.Col span={3}>
							<NumberInput
								size="xs"
								label=""
								value={medicine.quantity}
								placeholder={t("Quantity")}
								disabled={mode === "view"}
								onChange={(v) => handleChange("quantity", v)}
							/>
						</Grid.Col>
						<Grid.Col span={3}>
							<Select
								size="xs"
								label=""
								data={DURATION_OPTIONS}
								value={medicine.duration}
								placeholder={t("Duration")}
								disabled={mode === "view"}
								onChange={(v) => handleChange("duration", v)}
							/>
						</Grid.Col>
					</Grid>
				)}
				<Flex gap="les" justify="flex-end">
					{mode === "view" ? (
						<ActionIcon variant="outline" color="var(--theme-secondary-color-6)" onClick={openEditMode}>
							<IconPencil size={18} stroke={1.5} />
						</ActionIcon>
					) : (
						<ActionIcon variant="outline" color="var(--theme-primary-color-6)" onClick={handleEdit}>
							<IconCheck size={18} stroke={1.5} />
						</ActionIcon>
					)}

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

export default function PatientMedicine() {
	const [medicines, setMedicines] = useState([]);
	const [updateKey, setUpdateKey] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
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
	const bymealRefetching = useSelector((state) => state.crud.byMeal?.refetching);
	const refetching = useSelector((state) => state.crud.dosage?.refetching);
	const dosage_options = useSelector((state) => state.crud.dosage?.data?.data);
	const by_meal_options = useSelector((state) => state.crud.byMeal?.data?.data);
	const [openedDosageForm, { open: openDosageForm, close: closeDosageForm }] = useDisclosure(false);

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

	const { data: medicineHistoryData, refetch: refetchMedicineData } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.TRANSACTION}/${id}`,
		params: {
			mode: "medicine",
		},
	});

	// Add hotkey for save functionality
	const handleChange = (field, value) => {
		medicineForm.setFieldValue(field, value);

		// If medicine field is being changed, auto-populate other fields from medicine data
		if (field === "medicine_id" && value) {
			const selectedMedicine = medicineData?.find((item) => item.product_id?.toString() === value);

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

				if (selectedMedicine.medicine_dosage_id) {
					appendDosageValueToForm(medicineForm, dosage_options, selectedMedicine.medicine_dosage_id);
				}
			}
		}

		if (field === "medicine_bymeal_id" && value) {
			appendMealValueToForm(medicineForm, by_meal_options, value);
		}

		if (field === "medicine_dosage_id" && value) {
			appendDosageValueToForm(medicineForm, dosage_options, value);
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
		}

		setUpdateKey((prev) => prev + 1);
		medicineForm.reset();
	};

	const handleDelete = (idx) => {
		setMedicines(medicines.filter((_, index) => index !== idx));
		if (editIndex === idx) {
			medicineForm.reset();
			setEditIndex(null);
		}
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			const formValue = {
				json_content: medicines,
				ipd_module: "medicine",
			};

			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.PROCESS}/${id}`,
				data: formValue,
				module: "medicine",
			};
			const resultAction = await dispatch(storeEntityData(value)).unwrap();
			if (resultAction.status === 200) {
				successNotification(t("MedicineAddedSuccessfully"));
				await refetchMedicineData();
				setMedicines([]);
			} else {
				errorNotification(t("MedicineAddedFailed"));
			}
		} catch (err) {
			console.error(err);
		} finally {
			setIsSubmitting(false);
		}
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
				<Group align="end" gap="les">
					<Group grow w="100%" gap="les">
						<Select
							classNames={inputCss}
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
							classNames={inputCss}
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
					<Grid w="100%" columns={12} gutter="3xs">
						<Grid.Col span={6}>
							<Group grow gap="les">
								<Select
									classNames={inputCss}
									id="medicine_dosage_id"
									name="medicine_dosage_id"
									data={dosage_options?.map((dosage) => ({
										value: dosage.id?.toString(),
										label: dosage.name,
									}))}
									value={medicineForm.values.medicine_dosage_id}
									placeholder={t("Dosage")}
									required
									tooltip={t("EnterDosage")}
									onChange={(v) => handleChange("medicine_dosage_id", v)}
								/>
								<Select
									classNames={inputCss}
									id="medicine_bymeal_id"
									name="medicine_bymeal_id"
									data={by_meal_options?.map((byMeal) => ({
										value: byMeal.id?.toString(),
										label: byMeal.name,
									}))}
									value={medicineForm.values.medicine_bymeal_id}
									placeholder={t("ByMeal")}
									required
									tooltip={t("EnterWhenToTakeMedicine")}
									onChange={(v) => handleChange("medicine_bymeal_id", v)}
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
									dropdownValue={DURATION_OPTIONS}
									value={medicineForm.values.duration}
									placeholder={t("Duration")}
									required
									tooltip={t("EnterMeditationDuration")}
									withCheckIcon={false}
								/>

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
			<ScrollArea h={mainAreaHeight - 120}>
				<Grid columns={24} gutter="sm" p="sm" h={mainAreaHeight - 140}>
					<Grid.Col span={16}>
						<Stack h={mainAreaHeight - 160} justify="space-between">
							<Box bd="1px solid var(--theme-tertiary-color-3)" className="borderRadiusAll" p="sm">
								{medicines?.length === 0 && (
									<Stack justify="center" align="center" h={mainAreaHeight - 260}>
										<Box>
											<Text
												mb="md"
												w="100%"
												fz="sm"
												align={"center"}
												c="var(--theme-secondary-color)"
											>
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
										dosage_options={dosage_options}
										by_meal_options={by_meal_options}
									/>
								))}
							</Box>
							<Box py="xs" bg="var(--theme-tertiary-color-1)">
								<Box ml="auto" w={300}>
									<TabsActionButtons
										handleReset={() => {}}
										handleSave={handleSubmit}
										isSubmitting={isSubmitting}
									/>
								</Box>
							</Box>
						</Stack>
					</Grid.Col>
					<Grid.Col span={8}>
						<ScrollArea
							h={mainAreaHeight - 160}
							bd="1px solid var(--theme-tertiary-color-3)"
							className="borderRadiusAll"
							p="sm"
						>
							{medicineHistoryData?.data?.length === 0 && (
								<Flex h="100%" justify="center" align="center">
									<Text fz="sm">{t("NoDataAvailable")}</Text>
								</Flex>
							)}
							{medicineHistoryData?.data?.map((item, index) => (
								<Flex key={index} gap="xs" mb="3xs">
									<Text>{index + 1}.</Text>
									<Box w="100%">
										<Badge variant="light" size="md" color="var(--theme-secondary-color-7)">
											{item.created}
										</Badge>
										<Box mt="es" fz="sm">
											{JSON.parse(item?.json_content || "[]")?.map((particular, idx) => (
												<Box key={idx}>
													<Text fz="xs">
														{idx + 1}. {particular.medicine_name}
													</Text>
													<Box ml="md" fz="xs" c="var(--theme-tertiary-color-8)">
														{particular.dose_details} ---- {particular.by_meal} ----{" "}
														{particular.quantity} ---- {particular.duration}
													</Box>
												</Box>
											))}
										</Box>
									</Box>
								</Flex>
							))}
						</ScrollArea>
					</Grid.Col>
				</Grid>
			</ScrollArea>
			<CreateDosageDrawer opened={openedDosageForm} close={closeDosageForm} />
		</Box>
	);
}
