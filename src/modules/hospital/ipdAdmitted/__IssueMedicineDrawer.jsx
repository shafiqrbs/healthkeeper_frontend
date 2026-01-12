import { Box, Drawer, Text, Flex, Button, ScrollArea, Paper, Stack, Divider, Table, NumberInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconArrowLeft } from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { storeEntityData } from "@/app/store/core/crudThunk";
import SelectForm from "@components/form-builders/SelectForm.jsx";
import inlineInputCss from "@assets/css/InlineInputField.module.css";
import { useOutletContext } from "react-router-dom";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData.js";
import { CORE_DROPDOWNS } from "@/app/store/core/utilitySlice.js";
import { useForm } from "@mantine/form";
import useDataWithoutStore from "@hooks/useDataWithoutStore.js";
import { useState, useEffect, useMemo } from "react";
import { errorNotification } from "@components/notification/errorNotification";
import { successNotification } from "@components/notification/successNotification";
import { modals } from "@mantine/modals";
import { ERROR_NOTIFICATION_COLOR, SUCCESS_NOTIFICATION_COLOR } from "@/constants/index.js";

export default function __IssueMedicineDrawer({
	issueMedicineDrawer,
	setIssueMedicineDrawer,
	setIssueMedicinePrescriptionId,
	issueMedicinePrescriptionUUId,
	setIssueMedicinePrescriptionUUId,
	module,
}) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { mainAreaHeight } = useOutletContext();
	const createdBy = JSON.parse(localStorage.getItem("user"));

	const closeDrawer = () => {
		setIssueMedicinePrescriptionUUId(null);
		setIssueMedicinePrescriptionId(null);
		setIssueMedicineDrawer(false);
	};

	const warehouseParams = useMemo(() => ({ id: createdBy?.id }), [createdBy?.id]);

	// warehouse dropdown
	const { data: warehouseDropdown } = useGlobalDropdownData({
		path: CORE_DROPDOWNS.USER_WAREHOUSE.PATH,
		utility: CORE_DROPDOWNS.USER_WAREHOUSE.UTILITY,
		params: warehouseParams,
	});

	// Form for warehouse
	const form = useForm({
		initialValues: {
			warehouse_id: null,
		},
		validate: {
			warehouse_id: (val) => (!val ? t("Warehouse required") : null),
		},
	});

	useEffect(() => {
		const firstWarehouse = Object.values(warehouseDropdown ?? {})[0];

		if (firstWarehouse?.value) {
			form.setFieldValue("warehouse_id", Number(firstWarehouse.value));
		}
	}, [warehouseDropdown]);

	// medicine history from API
	const { data: medicineHistoryData } = useDataWithoutStore({
		url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.TRANSACTION}/${issueMedicinePrescriptionUUId}`,
		params: { mode: "medicine" },
	});

	// Store user-edited quantities
	const [submitFormData, setSubmitFormData] = useState({});

	// Initialize submitFormData with daily_quantity as default
	useEffect(() => {
		if (medicineHistoryData?.data) {
			const initialData = {};
			medicineHistoryData.data.forEach((row) => {
				initialData[row.id] = { quantity: Number(row.daily_quantity) };
			});
			setSubmitFormData(initialData);
		}
	}, [medicineHistoryData]);

	const handleDataTypeChange = (id, value = 0) => {
		// Get the original daily_quantity
		const originalDaily = Number(medicineHistoryData.data.find((r) => r.id === id)?.daily_quantity || 0);

		// Clamp value between 0 and daily_quantity
		if (value > originalDaily) value = originalDaily;
		if (value < 0 || isNaN(value)) value = 0;

		setSubmitFormData((prev) => ({
			...prev,
			[id]: { quantity: value },
		}));
	};

	const handleProcess = async () => {
		const errors = form.validate();
		if (errors.hasErrors) return;

		if (!medicineHistoryData?.data?.length) {
			errorNotification(t("No medicine found"));
			return;
		}

		const json_content = [];
		let validationError = false;

		medicineHistoryData.data.forEach((row) => {
			const quantity = Number(submitFormData[row.id]?.quantity ?? row.daily_quantity);
			const dailyQty = Number(row.daily_quantity);

			if (quantity > dailyQty) {
				errorNotification(
					`${row.medicine_name}: quantity (${quantity}) cannot exceed daily quantity (${dailyQty})`
				);
				validationError = true;
			}

			if (quantity > 0 && row.stock_quantity > 0 && row.stock_item_id !== null && row.stock_item_id !== "") {
				json_content.push({
					id: row.id,
					stock_id: row.stock_item_id,
					quantity,
				});
			}
		});

		if (validationError) return;
		if (json_content.length === 0) {
			errorNotification(t("Please enter at least one quantity"));
			return;
		}

		const payload = {
			url: HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.PROCESS + "/" + issueMedicinePrescriptionUUId,
			data: {
				json_content,
				ipd_module: "issue-medicine",
				warehouse_id: form.values.warehouse_id,
			},
			module,
		};

		modals.openConfirmModal({
			title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
			labels: { confirm: t("Submit"), cancel: t("Cancel") },
			confirmProps: { color: "red" },
			onCancel: () => console.info("Cancelled"),
			onConfirm: () => handleIssueMedicine(payload),
		});
	};

	async function handleIssueMedicine(payload) {
		try {
			const resultAction = await dispatch(storeEntityData(payload));
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
				setIssueMedicineDrawer(false);
				setIssueMedicinePrescriptionUUId(null);
				setIssueMedicinePrescriptionId(null);
				successNotification("Medicine issue successfully", SUCCESS_NOTIFICATION_COLOR);
			}
		} catch (error) {
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		}
	}

	return (
		<Drawer.Root opened={issueMedicineDrawer} size="50%" position="right" onClose={closeDrawer} offset={16}>
			<Drawer.Overlay />
			<Drawer.Content>
				<Drawer.Header className={"drawer-sticky-header"}>
					<Drawer.Title>
						<Flex align="center" gap={8}>
							<IconArrowLeft size={16} />
							<Text mt="es" fz={16} fw={500}>
								{t("Patient Medicine Issue")}
							</Text>
						</Flex>
					</Drawer.Title>
					<Drawer.CloseButton />
				</Drawer.Header>

				<Box w={"100%"}>
					<ScrollArea h={mainAreaHeight - 120}>
						<Paper withBorder p="lg" radius="sm" bg="white" h="100%">
							<Stack gap="lg" h="100%">
								<Box>
									<Divider
										label={
											<Text size="md" mb={"md"} c="var(--theme-tertiary-color-7)" fw={500}>
												{t("Medicine History")}
											</Text>
										}
										labelPosition="left"
									/>

									<Table
										withColumnBorders
										striped={false}
										highlightOnHover={false}
										style={{
											borderCollapse: "collapse",
											border: "1px solid var(--theme-tertiary-color-8)",
										}}
									>
										<Table.Thead>
											<Table.Tr>
												<Table.Th colSpan={6}>
													<SelectForm
														form={form}
														disabled={true}
														tooltip={t("Choose Warehouse")}
														placeholder={t("Choose Warehouse")}
														name="warehouse_id"
														id="warehouse_id"
														required
														dropdownValue={warehouseDropdown}
														value={String(form.values.warehouse_id)}
													/>
												</Table.Th>
											</Table.Tr>

											<Table.Tr>
												<Table.Th>S/N</Table.Th>
												<Table.Th>Medicine</Table.Th>
												<Table.Th>Generic</Table.Th>
												<Table.Th>Dosage</Table.Th>
												<Table.Th>Stock</Table.Th>
												<Table.Th>Quantity</Table.Th>
											</Table.Tr>
										</Table.Thead>

										<Table.Tbody>
											{medicineHistoryData?.data?.map((item, index) => (
												<Table.Tr key={item.id}>
													<Table.Td>{index + 1}</Table.Td>
													<Table.Td>{item.medicine_name}</Table.Td>
													<Table.Td>{item.generic}</Table.Td>
													<Table.Td>{item.dose_details}</Table.Td>
													<Table.Td>{item.stock_quantity}</Table.Td>
													<Table.Td>
														{item.stock_quantity > 0 ? (
															<NumberInput
																size="xs"
																className={inlineInputCss.inputNumber}
																value={
																	submitFormData[item.id]?.quantity ??
																	Number(item.daily_quantity)
																}
																clampBehavior="strict"
																max={Number(item.daily_quantity)}
																onChange={(val) => handleDataTypeChange(item.id, val)}
															/>
														) : (
															item.daily_quantity
														)}
													</Table.Td>
												</Table.Tr>
											))}

											<Table.Tr>
												<Table.Td colSpan={6}>
													<Flex justify="flex-end" mt="xs" mb="xs" pr="xs">
														{medicineHistoryData?.data?.length > 0 && (
															<Button onClick={handleProcess}>{t("Process")}</Button>
														)}
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
			</Drawer.Content>
		</Drawer.Root>
	);
}
