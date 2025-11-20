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
	Text, Divider, Paper, Table,
} from "@mantine/core";
import inputCss from "@assets/css/InputField.module.css";
import { useOutletContext, useParams } from "react-router-dom";
import SelectForm from "@components/form-builders/SelectForm";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import { IconCheck, IconPencil, IconPlus, IconX } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {CORE_DROPDOWNS, PHARMACY_DROPDOWNS} from "@/app/store/core/utilitySlice";
import { useDispatch, useSelector } from "react-redux";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import useMedicineData from "@hooks/useMedicineData";
import useMedicineGenericData from "@hooks/useMedicineGenericData";
import { getMedicineFormInitialValues } from "../../helpers/request";
import { useForm } from "@mantine/form";
import TabsActionButtons from "@hospital-components/TabsActionButtons";
import {HOSPITAL_DATA_ROUTES, MASTER_DATA_ROUTES} from "@/constants/routes";
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
import {t} from "i18next";
import inlineInputCss from "@assets/css/InlineInputField.module.css";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";




export default function Medicine(data) {
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
	const [submitFormData, setSubmitFormData] = useState({});
	const handleDataTypeChange = (rowId, field, value, submitNow = false) => {
		const updatedRow = {
			...submitFormData[rowId],
			[field]: value,
		};

		setSubmitFormData((prev) => ({
			...prev,
			[rowId]: updatedRow,
		}));

		// optional immediate submit (for Select)
		if (submitNow) {
			handleRowSubmit(rowId, updatedRow);
		}
	};
	const handleRowSubmit = async (rowId) => {
		const formData = submitFormData[rowId];
		if (!formData) return false;

		// 🔎 find original row data
		const originalRow = records.find((r) => r.id === rowId);
		if (!originalRow) return false;

		// ✅ check if there is any change
		const isChanged = Object.keys(formData).some((key) => formData[key] !== originalRow[key]);

		if (!isChanged) {
			// nothing changed → do not submit
			return false;
		}

		const value = {
			url: `${MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR.INLINE_UPDATE}/${rowId}`,
			data: formData,
			module,
		};

		try {
			const resultAction = await dispatch(storeEntityData(value));
			console.log(resultAction);
		} catch (error) {
			console.error(error);
			errorNotification(error.message);
		}
	};
	const createdBy = JSON.parse(localStorage.getItem("user"));
	const { data: medicineHistoryData, refetch: refetchMedicineData } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.TRANSACTION}/${id}`,
		params: {
			mode: "medicine",
		},
	});
	const {data: warehouseDropdown} = useGlobalDropdownData({
		path: CORE_DROPDOWNS.USER_WAREHOUSE.PATH,
		utility: CORE_DROPDOWNS.USER_WAREHOUSE.UTILITY,
		params: {id: createdBy?.id}
	});

	const form = useForm({
		initialValues: {
			investigation: [],
		},
	});

	console.log(medicineHistoryData);
	return (
		<Box bg="var(--mantine-color-white)">

			<ScrollArea h={mainAreaHeight - 120}>
				<Paper withBorder p="lg" radius="sm" bg="white" h="100%">
					<Stack gap="lg" h="100%">
						<Box>
							<Divider
								label={
									<Text size="md" mb={'md'} c="var(--theme-tertiary-color-7)" fw={500}>
										Medicine History
									</Text>
								}
								labelPosition="left"
							/>
							<Table
								withColumnBorders
								verticalSpacing={0}
								horizontalSpacing={0}
								striped={false}
								highlightOnHover={false}
								style={{ margin: 0, padding: 0,borderCollapse: "collapse",
									width: "100%",
									border: "1px solid var(--theme-tertiary-color-8)"}}
							>
								<Table.Thead>
									<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
										<Table.Th colspan={'6'} style={{ verticalAlign: "middle" }}>
											<SelectForm
												form={form}
												tooltip={t("ChooseWarehouse")}
												placeholder={t("ChooseWarehouse")}
												name="warehouse_id"
												id="warehouse_id"
												nextField="grn"
												required={true}
												value={form.values.warehouse_id}
												dropdownValue={warehouseDropdown}
											/>
										</Table.Th>
									</Table.Tr>
									<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-8)" }}>
										<Table.Th pl={4} style={{ verticalAlign: "middle" }}>
											{t("S/N")}
										</Table.Th>
										<Table.Th pl={4}>
											{t("Medicine")}
										</Table.Th>
										<Table.Th  pl={4}>
											{t("Generic")}
										</Table.Th>
										<Table.Th  pl={4}>
											{t("Dosage")}
										</Table.Th>
										<Table.Th  pl={4}>
											{t("Stock")}
										</Table.Th>
										<Table.Th  pl={4}>
											{t("DayQuantity")}
										</Table.Th>
									</Table.Tr>
								</Table.Thead>

								<Table.Tbody>
									{medicineHistoryData?.data?.length > 0 && (
										medicineHistoryData?.data?.map((item, index) => (
											<Table.Tr key={index}>
												<Table.Td>
													<Text fz={"xs"} pl={4}>
														{index + 1}.
													</Text>
												</Table.Td>
												<Table.Td>
													<Text fz={"xs"} pl={4}>
														{item?.medicine_name}
													</Text>
												</Table.Td>
												<Table.Td>
													<Text fz={"xs"} pl={4}>
														{item?.generic}
													</Text>
												</Table.Td>
												<Table.Td>
													<Text fz={"xs"} pl={4}>
														{item?.dose_details}
													</Text>
												</Table.Td>
												<Table.Td>
													<Text fz={"xs"} pl={4}>1000</Text>
												</Table.Td>
												<Table.Td>
													<Text fz={"xs"} pl={4}>
														<NumberInput
															size="xs"
															className={inlineInputCss.inputNumber}
															placeholder={t("Quantity")}
															value={submitFormData[item.id]?.daily_quantity || ""}
															onChange={(val) => handleDataTypeChange(item.id, "quantity", val)}
															onBlur={() => handleRowSubmit(item.id)}
														/>
													</Text>
												</Table.Td>
											</Table.Tr>
										)))}
									<Table.Tr  verticalAlign="right">
										<Table.Td style={{ verticalAlign: "right" }} verticalAlign="right" colspan={'6'}>
											<Flex justify="flex-end" mt={'xs'} mb={'xs'} pr={'xs'}>
												<Button>process</Button>
											</Flex>
										</Table.Td>
									</Table.Tr>
								</Table.Tbody>
							</Table>
						</Box>
					</Stack>
				</Paper>
			</ScrollArea>

		</Box>
	);
}
