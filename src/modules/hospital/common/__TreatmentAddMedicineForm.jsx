import { useEffect, useState } from "react";
import { Box, Button, Group, Select, Autocomplete, rem, ActionIcon } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertCircle, IconPlus, IconTrashX } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { getMedicineFormInitialValues } from "../core/treatmentTemplates/helpers/request";
import { useOutletContext, useParams } from "react-router-dom";
import { useDebouncedState, useHotkeys } from "@mantine/hooks";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import useMedicineData from "@hooks/useMedicineData";
import useMedicineGenericData from "@hooks/useMedicineGenericData";
import { PHARMACY_DROPDOWNS } from "@/app/store/core/utilitySlice";
import { DURATION_TYPES, ERROR_NOTIFICATION_COLOR, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import inputCss from "@/assets/css/InputField.module.css";
import { MASTER_DATA_ROUTES } from "@/constants/routes";
import { deleteEntityData, getIndexEntityData, storeEntityData } from "@/app/store/core/crudThunk";
import { successNotification } from "@components/notification/successNotification";
import { errorNotification } from "@components/notification/errorNotification";
import { useDispatch, useSelector } from "react-redux";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import { deleteNotification } from "@components/notification/deleteNotification";
import { notifications } from "@mantine/notifications";
import SelectForm from "@components/form-builders/SelectForm";
import { DataTable } from "mantine-datatable";
import tableCss from "@assets/css/Table.module.css";
import { appendGeneralValuesToForm, medicineOptionsFilter } from "@utils/prescription";
import FormValidatorWrapper from "@components/form-builders/FormValidatorWrapper";

export default function TreatmentAddMedicineForm({ medicines, module, setMedicines }) {
	const [updateKey, setUpdateKey] = useState(0);
	const { t } = useTranslation();
	const [medicineTerm, setMedicineTerm] = useDebouncedState("", 300);
	const [medicineGenericTerm, setMedicineGenericTerm] = useDebouncedState("", 300);
	const { medicineData } = useMedicineData({ term: medicineTerm });
	const { medicineGenericData } = useMedicineGenericData({ term: medicineGenericTerm });
	const medicineForm = useForm(getMedicineFormInitialValues());
	const [editIndex, setEditIndex] = useState(null);
	const { mainAreaHeight } = useOutletContext();
	const { treatmentId } = useParams();
	const dispatch = useDispatch();
	const refetching = useSelector((state) => state.crud.dosage?.refetching);
	const bymealRefetching = useSelector((state) => state.crud.byMeal?.refetching);

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
	]);

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

	const handleChange = (field, value) => {
		medicineForm.setFieldValue(field, value);

		// If medicine field is being changed, auto-populate other fields from medicine data
		if (field === "medicine_id" && value) {
			medicineForm.clearFieldError("generic");
			const selectedMedicine = medicineData?.find((item) => item.product_id?.toString() === value);

			if (selectedMedicine) {
				appendGeneralValuesToForm(medicineForm, selectedMedicine);
				medicineForm.setFieldValue("stock_id", selectedMedicine?.stock_id?.toString());
				// Auto-populate duration and count based on duration_day or duration_month
				if (selectedMedicine.duration_day) {
					medicineForm.setFieldValue("quantity", parseInt(selectedMedicine.duration_day) || 1);
					medicineForm.setFieldValue("duration", "day");
				} else if (selectedMedicine.duration_month) {
					medicineForm.setFieldValue("quantity", parseInt(selectedMedicine.duration_month) || 1);
					medicineForm.setFieldValue("duration", "month");
				}
			}
		}

		if (field === "generic" && value) {
			medicineForm.clearFieldError("medicine_id");
		}
	};

	const handleAdd = (values) => {
		handleConfirmModal(values);

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
				title: t("Delete Failed"),
				icon: <IconAlertCircle style={{ width: rem(18), height: rem(18) }} />,
			});
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
				<Group grow preventGrowOverflow={false} w="100%" gap="les">
					<FormValidatorWrapper opened={medicineForm.errors.medicine_id}>
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

					<FormValidatorWrapper opened={medicineForm.errors.generic}>
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
							classNames={inputCss}
							error={!!medicineForm.errors.generic}
						/>
					</FormValidatorWrapper>
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
							accessor: "medicine_dosage",
							title: t("Dosage"),
							render: (item) => item?.medicine_dosage?.name,
						},

						// {
						// 	accessor: "medicine_dosage",
						// 	title: t("DosageBn"),
						// 	render: (item) => item?.medicine_dosage?.name_bn,
						// },

						// {
						// 	accessor: "medicine_dosage",
						// 	title: t("DosageQuantity"),
						// 	render: (item) => item?.medicine_dosage?.quantity,
						// },

						{
							accessor: "medicine_bymeal",
							title: t("ByMeal"),
							render: (item) => item?.medicine_bymeal?.name,
						},

						// {
						// 	accessor: "medicine_bymeal",
						// 	title: t("ByMealBn"),
						// 	render: (item) => item?.medicine_bymeal?.name_bn,
						// },

						{
							accessor: "quantity",
							title: t("Quantity"),
						},
						{
							accessor: "duration",
							title: t("Duration"),
							render: (item) => item?.duration,
						},
						{
							accessor: "action",
							title: "",
							width: "100px",
							render: (item) => (
								<Group justify="center">
									<ActionIcon
										size="compact-xs"
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
