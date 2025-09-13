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
	TextInput,
	ActionIcon, rem
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {IconAlertCircle, IconDeviceFloppy, IconPlus, IconTrashX} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { getMedicineFormInitialValues } from "./helpers/request";
import {useOutletContext, useParams} from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useDebouncedState, useHotkeys } from "@mantine/hooks";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import useMedicineData from "@hooks/useMedicineData";
import useMedicineGenericData from "@hooks/useMedicineGenericData";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import { HOSPITAL_DROPDOWNS } from "@/app/store/core/utilitySlice";
import {DURATION_TYPES, ERROR_NOTIFICATION_COLOR, SUCCESS_NOTIFICATION_COLOR} from "@/constants";
import MedicineListItem from "../../common/MedicineListItem";
import inputCss from "@/assets/css/InputField.module.css";
import InputAutoComplete from "@/common/components/form-builders/InputAutoComplete";
import {MASTER_DATA_ROUTES} from "@/constants/routes";
import {deleteEntityData, storeEntityData} from "@/app/store/core/crudThunk";
import {setInsertType, setRefetchData} from "@/app/store/core/crudSlice";
import {successNotification} from "@components/notification/successNotification";
import {errorNotification} from "@components/notification/errorNotification";
import {useDispatch} from "react-redux";
import useDataWithoutStore from "@hooks/useDataWithoutStore";
import {DataTable} from "mantine-datatable";
import tableCss from "@assets/css/Table.module.css";
import {deleteNotification} from "@components/notification/deleteNotification";
import {notifications} from "@mantine/notifications";

export default function AddMedicineForm({ medicines,module, setMedicines, baseHeight }) {
	const prescription2A4Ref = useRef(null);
	const [updateKey, setUpdateKey] = useState(0);
	const { t } = useTranslation();
	const [medicineTerm, setMedicineTerm] = useDebouncedState("", 300);
	const [medicineGenericTerm, setMedicineGenericTerm] = useDebouncedState("", 300);
	const { medicineData } = useMedicineData({ term: medicineTerm });
	const { medicineGenericData } = useMedicineGenericData({ term: medicineGenericTerm });
	const medicineForm = useForm(getMedicineFormInitialValues());
	const [editIndex, setEditIndex] = useState(null);
	const { mainAreaHeight } = useOutletContext();
	const [printData, setPrintData] = useState(null);
	const { id } = useParams();
	const [fetching] = useState(false);
	const dispatch = useDispatch();
	const { data: by_meal_options } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.BY_MEAL.PATH,
		utility: HOSPITAL_DROPDOWNS.BY_MEAL.UTILITY,
	});

	const { data: dosage_options } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.DOSAGE.PATH,
		utility: HOSPITAL_DROPDOWNS.DOSAGE.UTILITY,
	});

	const { data: entity } = useDataWithoutStore({ url: `${MASTER_DATA_ROUTES.API_ROUTES.TREATMENT_TEMPLATES.VIEW}/${id}` });
	const entityData = entity?.data?.treatment_medicine_format;
	console.log(entityData)

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
			const selectedMedicine = medicineData?.find((item) => item.stock_id?.toString() === value);

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
					medicineForm.setFieldValue("duration", "Day");
				} else if (selectedMedicine.duration_month) {
					medicineForm.setFieldValue("quantity", parseInt(selectedMedicine.duration_month) || 1);
					medicineForm.setFieldValue("duration", "Month");
				}

				// Auto-populate dosage if available (for times field)
				if (selectedMedicine.dose_details) {
					medicineForm.setFieldValue("dosage", selectedMedicine.dose_details);
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

				if (selectedMedicine.dosage) {
					values.times = selectedMedicine.dosage;
				}
			}

		}

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
				data: { ...values, treatment_template_id: id },
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
					form.setErrors(errorObject);
				}
			} else if (storeEntityData.fulfilled.match(resultAction)) {
				medicineForm.reset();
				close(); // close the drawer
				dispatch(setRefetchData({ module, refetching: true }));
				successNotification(t("InsertSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
			}
		} catch (error) {
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
			dispatch(setRefetchData({ module, refetching: true }));
			deleteNotification(t("DeletedSuccessfully"), ERROR_NOTIFICATION_COLOR);
			navigate(`${MASTER_DATA_ROUTES.NAVIGATION_LINKS.TREATMENT_TEMPLATES.TREATMENT_MEDICINE}/${report}`);
			dispatch(setInsertType({ insertType: "create", module }));
		} else {
			notifications.show({
				color: ERROR_NOTIFICATION_COLOR,
				title: t("Delete Failed"),
				icon: <IconAlertCircle style={{ width: rem(18), height: rem(18) }} />,
			});
		}
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
							searchable
							onSearchChange={(v) => {
								setMedicineTerm(v);
							}}
							id="medicine_id"
							name="medicine_id"
							data={medicineData?.map((item) => ({
								label: item.product_name,
								value: item.stock_id?.toString(),
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
								<InputAutoComplete
									form={medicineForm}
									id="dosage"
									name="dosage"
									data={dosage_options}
									value={medicineForm.values.dosage}
									placeholder={t("Dosage")}
									required
									tooltip={t("EnterDosage")}
									withCheckIcon={false}
								/>
								<InputAutoComplete
									form={medicineForm}
									id="by_meal"
									name="by_meal"
									data={by_meal_options}
									value={medicineForm.values.by_meal}
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
								<InputAutoComplete
									form={medicineForm}
									label=""
									id="duration"
									name="duration"
									data={DURATION_TYPES}
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
							accessor: "generic_name",
							title: t("GenericName"),
						},
						{
							accessor: "dosage",
							title: t("Dosage"),
						},

						{
							accessor: "by_meal",
							title: t("ByMeal"),
						},
						{
							accessor: "duration",
							title: t("Duration"),
						},
						{
							accessor: "quantity",
							title: t("Quantity"),
						},

						{
							accessor: "action",
							title: "",
							width: "100px",
							render: (item) => (
								<Group justify="center">
									<ActionIcon
										color="var(--theme-secondary-color-6)"
										onClick={() => handleRowSubmit(item.id)}
									>
										<IconDeviceFloppy height={18} width={18} stroke={1.5} />
									</ActionIcon>
									<ActionIcon
										color="var(--theme-delete-color)"
										onClick={() => handleDeleteSuccess(id, item.id)}
									>
										<IconTrashX height={18} width={18} stroke={1.5} />
									</ActionIcon>
								</Group>
							),
						},
					]}
					fetching={fetching}
					loaderSize="xs"
					loaderColor="grape"
					height={mainAreaHeight-150}
				/>
			</Box>
		</Box>
	);
}
