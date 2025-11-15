import { getDataWithoutStore } from "@/services/apiService";
import { Box, Text, Stack, Grid, Flex, Button, Tabs, Select } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { DataTable } from "mantine-datatable";
import tableCss from "@assets/css/TableAdmin.module.css";
import { IconCaretUpDownFilled, IconChevronUp, IconSelector } from "@tabler/icons-react";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import { useForm } from "@mantine/form";
import { getFormValues } from "@modules/hospital/lab/helpers/request";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import { modals } from "@mantine/modals";
import { updateEntityData } from "@/app/store/core/crudThunk";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { successNotification } from "@components/notification/successNotification";
import { ERROR_NOTIFICATION_COLOR, MODULES_CORE, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import { errorNotification } from "@components/notification/errorNotification";
import { useDispatch } from "react-redux";
import { useHotkeys } from "@mantine/hooks";
import inputCss from "@assets/css/InputField.module.css";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import { CORE_DROPDOWNS } from "@/app/store/core/utilitySlice";

const module = MODULES_CORE.BILLING;

export default function InvoiceDetails({ entity }) {
	const [autocompleteValue, setAutocompleteValue] = useState("");
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { mainAreaHeight } = useOutletContext();
	// =============== separate forms for investigation and room submissions ================
	const investigationForm = useForm({
		...getFormValues(t),
		initialValues: {
			...getFormValues(t).initialValues,
			amount: "",
		},
		validate: {
			amount: (value) => {
				const numericValue = Number(value);
				if (!value || value === "" || isNaN(numericValue)) {
					return t("EnterAmount") || "Amount is required";
				}
				if (numericValue <= 0) {
					return t("AmountMustBeGreaterThanZero") || "Amount must be greater than 0";
				}
				return null;
			},
		},
	});
	const roomForm = useForm({
		...getFormValues(t),
		initialValues: {
			...getFormValues(t).initialValues,
			amount: "",
			days: "",
		},
		validate: {
			amount: (value) => {
				const numericValue = Number(value);
				if (!value || value === "" || isNaN(numericValue)) {
					return t("EnterAmount") || "Amount is required";
				}
				if (numericValue <= 0) {
					return t("AmountMustBeGreaterThanZero") || "Amount must be greater than 0";
				}
				return null;
			},
		},
	});
	const [invoiceDetails, setInvoiceDetails] = useState([]);
	const { id, transactionId } = useParams();
	const [fetching, setFetching] = useState(false);
	const [selectedRecords, setSelectedRecords] = useState([]);
	const [investigationRecords, setInvestigationRecords] = useState([]);
	const [roomItems, setRoomItems] = useState([]);
	const [selectKey, setSelectKey] = useState(0);

	const { data: investigationOptions } = useGlobalDropdownData({
		path: CORE_DROPDOWNS.INVESTIGATION.PATH,
		params: { "dropdown-type": CORE_DROPDOWNS.INVESTIGATION.TYPE },
		utility: CORE_DROPDOWNS.INVESTIGATION.UTILITY,
		identifierName: "investigation",
	});

	useEffect(() => {
		if (id) {
			setFetching(true);
			(async () => {
				const res = await getDataWithoutStore({
					url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.BILLING.INDEX}/${id}`,
				});
				// =============== reset both forms after fetching invoice details ================
				investigationForm.reset();
				roomForm.reset();
				setInvoiceDetails(res?.data);
				setFetching(false);
			})();
		}
		// =============== investigationForm and roomForm are stable references from useForm, safe to include ================
	}, [id]);

	// =============== initialize local investigations from entity to allow local editing ================
	useEffect(() => {
		const initialInvestigations = Array.isArray(entity?.invoice_particular) ? entity.invoice_particular : [];
		setInvestigationRecords(
			initialInvestigations.map((item) => ({
				id: item.id ?? item.value ?? `${item.name ?? ""}-${item.price ?? 0}`,
				name: item.name ?? item.label ?? "",
				quantity: item.quantity ?? 1,
				price: item.price ?? 0,
			}))
		);
	}, [entity]);

	// =============== initialize local room items from fetched invoice details to allow local editing ================
	useEffect(() => {
		const initialItems = Array.isArray(invoiceDetails?.items) ? invoiceDetails.items : [];
		setRoomItems(initialItems);
	}, [invoiceDetails]);

	// =============== create submit handler bound to a specific form ================
	const createSubmitHandler = (targetForm) => (values) => {
		modals.openConfirmModal({
			title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
			labels: { confirm: t("Submit"), cancel: t("Cancel") },
			confirmProps: { color: "red" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleConfirmModal(values, targetForm),
		});
	};

	async function handleConfirmModal(values, targetForm) {
		try {
			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.BILLING.UPDATE}/${transactionId}`,
				data: values,
				module,
			};
			const resultAction = await dispatch(updateEntityData(value));
			if (updateEntityData.rejected.match(resultAction)) {
				const fieldErrors = resultAction.payload.errors;
				if (fieldErrors) {
					const errorObject = {};
					Object.keys(fieldErrors).forEach((key) => {
						errorObject[key] = fieldErrors[key][0];
					});
					targetForm?.setErrors(errorObject);
				}
			} else if (updateEntityData.fulfilled.match(resultAction)) {
				dispatch(setRefetchData({ module, refetching: true }));
				setInvoiceDetails(resultAction.payload.data?.data);
				successNotification(t("UpdateSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
			}
		} catch (error) {
			console.error(error);
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		}
	}
	useHotkeys(
		[
			[
				"alt+s",
				() => {
					// =============== try to click visible submit button for active tab form ================
					const submitButton =
						document.getElementById("EntityFormSubmitInvestigation") ||
						document.getElementById("EntityFormSubmitRoom");
					if (submitButton) {
						submitButton.click();
					}
				},
			],
		],
		[]
	);

	// =============== add room line item to local table using days and current room info ================
	const handleRoomAdd = () => {
		const daysInputValue = Number(roomForm.values?.days ?? 0);
		if (!Number.isFinite(daysInputValue) || daysInputValue <= 0) {
			errorNotification(t("EnterBillingDays"), ERROR_NOTIFICATION_COLOR);
			return;
		}

		const pricePerDay = Number(invoiceDetails?.room_price ?? 0);
		const newRoomItem = {
			id: Date.now(),
			name: invoiceDetails?.room_name || t("Bed/Cabin"),
			particular_type: invoiceDetails?.particular_type || undefined,
			days: daysInputValue,
			price: pricePerDay,
			subtotal: daysInputValue * pricePerDay,
		};

		setRoomItems([newRoomItem]);
		roomForm.setFieldValue("days", "");
	};

	// =============== add investigation to local table; increment quantity if already present ================
	const handleInvestigationAdd = (selectedValue) => {
		const selectedOption = investigationOptions?.find((option) => String(option.value) === String(selectedValue));
		if (!selectedOption) {
			return;
		}

		setInvestigationRecords((previousRecords) => {
			const indexOfExisting = previousRecords.findIndex(
				(record) =>
					String(record.id ?? record.value) === String(selectedOption.value) ||
					String(record.name) === String(selectedOption.label)
			);

			if (indexOfExisting !== -1) {
				const updatedRecords = [...previousRecords];
				const existingRecord = { ...updatedRecords[indexOfExisting] };
				const existingQuantity = Number(existingRecord.quantity ?? 0) || 0;
				existingRecord.quantity = existingQuantity + 1;
				updatedRecords[indexOfExisting] = existingRecord;
				return updatedRecords;
			}

			const newRecord = {
				id: selectedOption.value,
				name: selectedOption.label,
				quantity: 1,
				price: selectedOption.price ?? 0,
			};
			return [...previousRecords, newRecord];
		});
	};

	// =============== compute totals from local state ================
	const investigationSubtotal = useMemo(() => {
		return (investigationRecords || []).reduce((accumulator, record) => {
			const quantity = Number(record?.quantity ?? 0);
			const price = Number(record?.price ?? 0);
			return accumulator + quantity * price;
		}, 0);
	}, [investigationRecords]);

	const roomSubtotal = useMemo(() => {
		return (roomItems || []).reduce((accumulator, item) => {
			const subtotal = Number(item?.subtotal ?? Number(item?.days ?? 0) * Number(item?.price ?? 0));
			return accumulator + subtotal;
		}, 0);
	}, [roomItems]);

	// =============== grand total previously used for shared form; now totals are per-tab ================

	return (
		<Box pos="relative" className="borderRadiusAll" bg="var(--mantine-color-white)">
			<Box bg="var(--theme-primary-color-0)" p="sm">
				<Text fw={600} fz="sm" py="es">
					{t("InvoiceDetails")}
				</Text>
			</Box>
			<>
				<Tabs id="invoice-details-tabs" defaultValue="investigation">
					<Tabs.List>
						<Tabs.Tab value="investigation">{t("Investigation")}</Tabs.Tab>
						{entity.mode_slug === "ipd" && <Tabs.Tab value="bed-cabin">{t("Bed/Cabin")}</Tabs.Tab>}
					</Tabs.List>
					<Tabs.Panel value="investigation" bg="var(--mantine-color-white)">
						<Grid align="center" columns={20} mt="xs" mx="xs">
							<Grid.Col span={20}>
								<Select
									key={selectKey}
									searchable
									label=""
									placeholder={`Pick value or enter Investigation`}
									data={investigationOptions}
									value={autocompleteValue}
									onChange={setAutocompleteValue}
									onOptionSubmit={(value) => {
										handleInvestigationAdd(value);
										setTimeout(() => {
											setSelectKey(selectKey + 1);
											setAutocompleteValue("");
										}, 0);
									}}
									classNames={inputCss}
									rightSection={<IconCaretUpDownFilled size={16} />}
								/>
							</Grid.Col>
						</Grid>
						<Box className="border-top-none" px="sm" mt="xs">
							<DataTable
								striped
								highlightOnHover
								pinFirstColumn
								stripedColor="var(--theme-tertiary-color-1)"
								selectedRecords={selectedRecords}
								onSelectedRecordsChange={setSelectedRecords}
								selectionColumnStyle={{ minWidth: 80 }}
								classNames={{
									root: tableCss.root,
									table: tableCss.table,
									header: tableCss.header,
									footer: tableCss.footer,
									pagination: tableCss.pagination,
								}}
								records={investigationRecords || []}
								columns={[
									{
										accessor: "index",
										title: t("S/N"),
										textAlignment: "right",
										render: (_, index) => index + 1,
									},
									{
										accessor: "name",
										title: t("Name"),
									},
									{
										accessor: "quantity",
										title: t("Quantity"),
										render: (record) => record?.quantity || 1,
									},
									{
										accessor: "price",
										title: t("Price"),
									},
									{
										accessor: "subtotal",
										title: t("SubTotal"),
										render: (record) => record?.price * record?.quantity ?? 0,
									},
								]}
								fetching={fetching}
								loaderSize="xs"
								loaderColor="grape"
								height={mainAreaHeight - 206}
								sortIcons={{
									sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
									unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
								}}
							/>
						</Box>
						{invoiceDetails?.process !== "Done" && (
							// =============== investigation-specific form: comment, display total, receive, submit ================
							<Box
								gap={0}
								justify="space-between"
								mt="xs"
								px="xs"
								pb="xs"
								bg="var(--mantine-color-white)"
							>
								<form onSubmit={investigationForm.onSubmit(createSubmitHandler(investigationForm))}>
									<Box w="100%">
										<Grid columns={18} gutter="xs">
											<Grid.Col
												span={6}
												className="animate-ease-out"
												bg="var(--theme-primary-color-0)"
												px="xs"
											>
												<Box mt="md">
													<TextAreaForm
														id="investigation-comment"
														form={investigationForm}
														tooltip={t("EnterComment")}
														placeholder={t("EnterComment")}
														name="comment"
														disabled={invoiceDetails?.process === "Done"}
													/>
												</Box>
											</Grid.Col>
											<Grid.Col
												span={6}
												bg="var(--theme-tertiary-color-1)"
												className="animate-ease-out"
											>
												<Box mt="xs">
													<Grid align="center" columns={20}>
														<Grid.Col span={8}>
															<Flex justify="flex-end" align="center" gap="es">
																<Text fz="xs">{t("CreatedBy")}</Text>
															</Flex>
														</Grid.Col>
														<Grid.Col span={12}>
															<Flex align="right" gap="es">
																<Text fz="xs">
																	{invoiceDetails?.created_doctor_info?.name}
																</Text>
															</Flex>
														</Grid.Col>
													</Grid>
													<Grid align="center" columns={20}>
														<Grid.Col span={8}>
															<Flex justify="flex-end" align="center" gap="es">
																<Text fz="sm">{t("Total")}</Text>
															</Flex>
														</Grid.Col>
														<Grid.Col span={12}>
															<Flex align="right" gap="es">
																<Text fz="sm">{investigationSubtotal || 0}</Text>
															</Flex>
														</Grid.Col>
													</Grid>
												</Box>
											</Grid.Col>
											<Grid.Col
												span={6}
												className="animate-ease-out"
												bg="var(--theme-secondary-color-0)"
												px="xs"
											>
												<Grid align="center" columns={20}>
													<Grid.Col span={10}>
														<Flex justify="flex-end" align="center" gap="es">
															<Text fz="sm" fw={"800"}>
																{t("Receive")}
															</Text>
														</Flex>
													</Grid.Col>
													<Grid.Col span={10}>
														<InputNumberForm
															form={investigationForm}
															label=""
															tooltip={t("EnterAmount")}
															placeholder={t("Amount")}
															name="amount"
															id="investigation-amount"
															disabled={invoiceDetails?.process === "Done"}
														/>
													</Grid.Col>
												</Grid>
												<Box mt="xs">
													<Button.Group>
														<Button
															id="EntityFormSubmitInvestigation"
															w="100%"
															size="compact-sm"
															bg="var(--theme-pos-btn-color)"
															type="button"
															disabled={invoiceDetails?.process === "Done"}
														>
															<Stack gap={0} align="center" justify="center">
																<Text fz="xs">{t("Print")}</Text>
															</Stack>
														</Button>
														<Button
															type="submit"
															w="100%"
															size="compact-sm"
															bg="var(--theme-save-btn-color)"
															disabled={invoiceDetails?.process === "Done"}
														>
															<Stack gap={0} align="center" justify="center">
																<Text fz="xs">{t("Save")}</Text>
															</Stack>
														</Button>
													</Button.Group>
												</Box>
											</Grid.Col>
										</Grid>
									</Box>
								</form>
							</Box>
						)}
					</Tabs.Panel>
					{entity.mode_slug === "ipd" && (
						<Tabs.Panel value="bed-cabin" bg="var(--mantine-color-white)">
							<Flex mx="sm" mt="xs" align="center" gap="xs" justify="space-between">
								<Flex gap="sm">
									<Text>{invoiceDetails?.payment_mode_name},</Text>
									<Text>{invoiceDetails?.room_name},</Text>
									<Text>{invoiceDetails?.room_price}Tk.,</Text>
									<Text>Consumed: {invoiceDetails?.consume_day || 0},</Text>
									<Text>Remaining: {invoiceDetails?.remaining_day || 0},</Text>
									<Text>Total: {invoiceDetails?.amount || 0}Tk.</Text>
								</Flex>
								<Flex gap="2xs">
									<InputNumberForm
										form={roomForm}
										label=""
										tooltip={t("EnterBillingDays")}
										placeholder="days"
										name="days"
										id="days"
										size="xs"
										w="70px"
									/>
									<Button size="xs" bg="var(--theme-save-btn-color)" onClick={handleRoomAdd}>
										<Stack gap={0} align="center" justify="center">
											<Text fz="xs">{t("Add")}</Text>
										</Stack>
									</Button>
								</Flex>
							</Flex>
							<Box className="border-top-none" px="sm" mt="xs">
								<DataTable
									striped
									highlightOnHover
									pinFirstColumn
									stripedColor="var(--theme-tertiary-color-1)"
									classNames={{
										root: tableCss.root,
										table: tableCss.table,
										header: tableCss.header,
										footer: tableCss.footer,
										pagination: tableCss.pagination,
									}}
									records={roomItems || []}
									columns={[
										{
											accessor: "index",
											title: t("S/N"),
											textAlignment: "right",
											render: (_, index) => index + 1,
										},
										{
											accessor: "name",
											title: t("Name"),
										},
										{
											accessor: "type",
											title: t("Type"),
											render: (record) => record.particular_type?.name || "N/A",
										},
										{
											accessor: "consume_day",
											title: t("ConsumedDay"),
											render: (record) => record.consume_day ?? 0,
										},
										{
											accessor: "remaining_day",
											title: t("RemainingDay"),
											render: (record) => record.remaining_day ?? 0,
										},
										{
											accessor: "days",
											title: t("Days"),
										},
										{
											accessor: "price",
											title: t("Price"),
										},
										{
											accessor: "subtotal",
											title: t("Subtotal"),
										},
									]}
									fetching={fetching}
									loaderSize="xs"
									loaderColor="grape"
									height={mainAreaHeight - 200}
									sortIcons={{
										sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
										unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
									}}
								/>
							</Box>
							{invoiceDetails?.process !== "Done" && (
								// =============== room-specific form: comment, display total, receive, submit ================
								<Box
									gap={0}
									justify="space-between"
									mt="xs"
									px="xs"
									pb="xs"
									bg="var(--mantine-color-white)"
								>
									<form onSubmit={roomForm.onSubmit(createSubmitHandler(roomForm))}>
										<Box w="100%">
											<Grid columns={18} gutter="xs">
												<Grid.Col
													span={6}
													className="animate-ease-out"
													bg="var(--theme-primary-color-0)"
													px="xs"
												>
													<Box mt="md">
														<TextAreaForm
															id="room-comment"
															form={roomForm}
															tooltip={t("EnterComment")}
															placeholder={t("EnterComment")}
															name="comment"
															disabled={invoiceDetails?.process === "Done"}
														/>
													</Box>
												</Grid.Col>
												<Grid.Col
													span={6}
													bg="var(--theme-tertiary-color-1)"
													className="animate-ease-out"
												>
													<Box mt="xs">
														<Grid align="center" columns={20}>
															<Grid.Col span={8}>
																<Flex justify="flex-end" align="center" gap="es">
																	<Text fz="xs">{t("CreatedBy")}</Text>
																</Flex>
															</Grid.Col>
															<Grid.Col span={12}>
																<Flex align="right" gap="es">
																	<Text fz="xs">
																		{invoiceDetails?.created_doctor_info?.name}
																	</Text>
																</Flex>
															</Grid.Col>
														</Grid>
														<Grid align="center" columns={20}>
															<Grid.Col span={8}>
																<Flex justify="flex-end" align="center" gap="es">
																	<Text fz="sm">{t("Total")}</Text>
																</Flex>
															</Grid.Col>
															<Grid.Col span={12}>
																<Flex align="right" gap="es">
																	<Text fz="sm">{roomSubtotal || 0}</Text>
																</Flex>
															</Grid.Col>
														</Grid>
													</Box>
												</Grid.Col>
												<Grid.Col
													span={6}
													className="animate-ease-out"
													bg="var(--theme-secondary-color-0)"
													px="xs"
												>
													<Grid align="center" columns={20}>
														<Grid.Col span={10}>
															<Flex justify="flex-end" align="center" gap="es">
																<Text fz="sm" fw={"800"}>
																	{t("Receive")}
																</Text>
															</Flex>
														</Grid.Col>
														<Grid.Col span={10}>
															<InputNumberForm
																form={roomForm}
																label=""
																tooltip={t("EnterAmount")}
																placeholder={t("Amount")}
																name="amount"
																id="room-amount"
																disabled={invoiceDetails?.process === "Done"}
															/>
														</Grid.Col>
													</Grid>
													<Box mt="xs">
														<Button.Group>
															<Button
																id="EntityFormSubmitRoom"
																w="100%"
																size="compact-sm"
																bg="var(--theme-pos-btn-color)"
																type="button"
																disabled={invoiceDetails?.process === "Done"}
															>
																<Stack gap={0} align="center" justify="center">
																	<Text fz="xs">{t("Print")}</Text>
																</Stack>
															</Button>
															<Button
																type="submit"
																w="100%"
																size="compact-sm"
																bg="var(--theme-save-btn-color)"
																disabled={invoiceDetails?.process === "Done"}
															>
																<Stack gap={0} align="center" justify="center">
																	<Text fz="xs">{t("Save")}</Text>
																</Stack>
															</Button>
														</Button.Group>
													</Box>
												</Grid.Col>
											</Grid>
										</Box>
									</form>
								</Box>
							)}
						</Tabs.Panel>
					)}
				</Tabs>

				{/* =============== removed shared bottom form; forms moved into their respective tabs =============== */}
			</>
			<Box bg="var(--mantine-color-white)">
				<Stack h={mainAreaHeight - 62} bg="var(--mantine-color-body)" align="center" justify="center" gap="md">
					{t("NoTestSelected")}
				</Stack>
			</Box>
		</Box>
	);
}
