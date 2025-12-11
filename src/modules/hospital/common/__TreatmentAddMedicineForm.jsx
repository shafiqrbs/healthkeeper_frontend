import { useEffect, useRef, useState } from "react";
import { Box, Button, Group, Select, Autocomplete, rem, ActionIcon, Grid } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertCircle, IconPlus, IconTrashX } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { getMedicineFormInitialValues } from "../core/treatmentTemplates/helpers/request";
import { useOutletContext, useParams } from "react-router-dom";
import { useDebouncedState, useHotkeys } from "@mantine/hooks";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import useMedicineData from "@hooks/useMedicineData";
import useMedicineGenericData from "@hooks/useMedicineGenericData";
import { ERROR_NOTIFICATION_COLOR, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import inputCss from "@/assets/css/InputField.module.css";
import { MASTER_DATA_ROUTES } from "@/constants/routes";
import { deleteEntityData, storeEntityData } from "@/app/store/core/crudThunk";
import { successNotification } from "@components/notification/successNotification";
import { errorNotification } from "@components/notification/errorNotification";
import { useDispatch, useSelector } from "react-redux";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import { deleteNotification } from "@components/notification/deleteNotification";
import { notifications } from "@mantine/notifications";
import SelectForm from "@components/form-builders/SelectForm";
import { DataTable } from "mantine-datatable";
import tableCss from "@assets/css/Table.module.css";
import {
	appendDosageValueToForm,
	appendDurationModeValueToForm,
	appendGeneralValuesToForm,
	appendMealValueToForm,
	isGenericIdDuplicate,
	medicineOptionsFilter,
} from "@utils/prescription";
import FormValidatorWrapper from "@components/form-builders/FormValidatorWrapper";
import useAppLocalStore from "@hooks/useAppLocalStore";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";

export default function TreatmentAddMedicineForm({ medicines, module, setMedicines }) {
	const {
		features,
		meals,
		dosages,
		medicines: medicineData,
		localMedicines: medicineGenericData,
	} = useAppLocalStore();

	const [updateKey, setUpdateKey] = useState(0);
	const { t } = useTranslation();
	const [medicineTerm, setMedicineTerm] = useDebouncedState("", 300);
	const [medicineGenericTerm, setMedicineGenericTerm] = useDebouncedState("", 300);
	// const { medicineData } = useMedicineData({ term: medicineTerm });
	// const { medicineGenericData } = useMedicineGenericData({ term: medicineGenericTerm });
	const medicineForm = useForm(getMedicineFormInitialValues());
	const [editIndex, setEditIndex] = useState(null);
	const { mainAreaHeight } = useOutletContext();
	const { treatmentId } = useParams();
	const dispatch = useDispatch();
	const [medicineByMealSearchValue, setMedicineByMealSearchValue] = useState("");
	const [medicineDosageSearchValue, setMedicineDosageSearchValue] = useState("");
	const [durationModeKey, setDurationModeKey] = useState(0);
	const genericRef = useRef(null);
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

	const handleChange = (field, value) => {
		medicineForm.setFieldValue(field, value);

		// If medicine field is being changed, auto-populate other fields from medicine data
		if ((field === "medicine_id" || field === "generic") && value) {
			const selectedMedicine =
				field === "medicine_id"
					? medicineData?.find((item) => item.product_id?.toString() === value?.toString())
					: medicineGenericData?.find((item) => item.generic === value?.toString());
			console.log("selectedMedicine", selectedMedicine);
			if (selectedMedicine) {
				appendGeneralValuesToForm(medicineForm, selectedMedicine);
				medicineForm.setFieldValue("stock_id", selectedMedicine?.stock_id?.toString());
				// Auto-populate duration and count based on duration_day or duration_month

				// if (selectedMedicine.quantity) {
				// 	medicineForm.setFieldValue("quantity", selectedMedicine.quantity);
				// }

				// if (selectedMedicine.duration_mode_id) {
				// 	appendDurationModeValueToForm(
				// 		medicineForm,
				// 		durationModeDropdown,
				// 		selectedMedicine.duration_mode_id
				// 	);
				// }

				if (selectedMedicine.medicine_bymeal_id) {
					appendMealValueToForm(medicineForm, meals, selectedMedicine.medicine_bymeal_id);
				}

				if (selectedMedicine.medicine_dosage_id) {
					appendDosageValueToForm(medicineForm, dosages, selectedMedicine.medicine_dosage_id);
				}
			}
		}

		if (value && (field === "medicine_id" || field === "generic")) {
			medicineForm.clearFieldError(field === "medicine_id" ? "generic" : "medicine_id");
		}
	};

	const handleAdd = (values) => {
		// =============== check if generic_id already exists in medicines array ================
		if (isGenericIdDuplicate(medicines, values.generic_id)) {
			handleResetToInitialState();
			return;
		}

		handleConfirmModal(values);

		setMedicines([...medicines, values]);

		setUpdateKey((prev) => prev + 1);
		medicineForm.reset();
	};

	async function handleConfirmModal(values) {
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
				await refetchEntity();
			}
		} catch (error) {
			console.error(error);
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		}
	}

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

	const handleResetToInitialState = () => {
		medicineForm.reset();
		setMedicineDosageSearchValue("");
		setMedicineByMealSearchValue("");
		setMedicineTerm("");
		setMedicineGenericTerm("");
		setDurationModeKey((prev) => prev + 100);
		showNotificationComponent(t("GenericAlreadyExists"), "red", "lightgray", true, 700, true);
		requestAnimationFrame(() => document.getElementById("medicine_id").focus());
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
							<FormValidatorWrapper opened={medicineForm.errors.generic}>
								<Autocomplete
									ref={genericRef}
									disabled={medicineForm.values.medicine_id}
									tooltip={t("EnterSelfMedicine")}
									id="generic"
									name="generic"
									data={medicineGenericData?.map((item, index) => ({
										label: item.name || item.product_name || item.generic,
										value: `${item.name} ${index}`,
										generic: item?.generic || "",
									}))}
									limit={20}
									filter={medicineOptionsFilter}
									value={medicineForm.values.generic}
									onChange={(v) => {
										handleChange("generic", v);
										setMedicineGenericTerm(v);
									}}
									placeholder={t("SelfMedicine")}
									classNames={inputCss}
									error={!!medicineForm.errors.generic}
								/>
							</FormValidatorWrapper>
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
							render: (item) => `${item?.duration} ${item?.duration_mode?.name}`,
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
					height={mainAreaHeight - 150}
				/>
			</Box>
		</Box>
	);
}
