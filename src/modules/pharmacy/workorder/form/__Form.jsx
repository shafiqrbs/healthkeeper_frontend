import {
	Group,
	Box,
	ActionIcon,
	Text,
	Flex,
	Button,
	Grid,
	NumberInput,
	Tooltip,
	TextInput,
	Input,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
	IconChevronUp,
	IconX,
	IconSelector,
	IconDeviceFloppy,
	IconHistory,
	IconRefresh,
	IconSearch,
	IconInfoCircle,
	IconShoppingBag,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useNavigate, useOutletContext } from "react-router-dom";
import { modals } from "@mantine/modals";
import { useDebouncedCallback, useDebouncedState } from "@mantine/hooks";
import { PHARMACY_DATA_ROUTES } from "@/constants/routes";
import tableCss from "@assets/css/Table.module.css";
import { useEffect, useState, useMemo } from "react";
import useMedicineData from "@hooks/useMedicineStockData";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import InputForm from "@components/form-builders/InputForm";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import { CORE_DROPDOWNS } from "@/app/store/core/utilitySlice";
import SelectForm from "@components/form-builders/SelectForm";
import DateSelector from "@components/form-builders/DateSelector";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll";
import genericClass from "@assets/css/Generic.module.css";
import { MODULES_PHARMACY } from "@/constants";

const module = MODULES_PHARMACY.STOCK;

export default function __Form({ form, workOrderForm, items, setItems, onSave }) {
	const [products, setProducts] = useState([]);
	const { t } = useTranslation();
	const [medicineTerm, setMedicineTerm] = useDebouncedState("", 300);
	const { medicineData } = useMedicineData({ term: medicineTerm });
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 78;
	const itemFromHeight = mainAreaHeight - 196;
	const [searchValue, setSearchValue] = useState("");
	const [draftProducts, setDraftProducts] = useState([]);

	const { data: vendorDropdown } = useGlobalDropdownData({
		path: CORE_DROPDOWNS.VENDOR.PATH,
		utility: CORE_DROPDOWNS.VENDOR.UTILITY,
	});

	const { data: categoryDropdown } = useGlobalDropdownData({
		path: CORE_DROPDOWNS.CATEGORY.PATH,
		utility: CORE_DROPDOWNS.CATEGORY.UTILITY,
		params: { type: "stockable" },
	});

	useEffect(() => {
		form.setFieldValue("category_id", categoryDropdown[3]?.value?.toString());
	}, [categoryDropdown]);

	async function handleWorkOrderAdd(values) {
		setItems([...items, values]);
		setDraftProducts((previousRecords) => delete previousRecords[values?.stock_item_id]);
		setMedicineTerm("");
	}

	const handleWorkOrderDelete = (id) => {
		modals.openConfirmModal({
			title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
			labels: { confirm: "Confirm", cancel: "Cancel" },
			confirmProps: { color: "var(--theme-delete-color)" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleWorkOrderDeleteSuccess(id),
		});
	};

	const handleWorkOrderDeleteSuccess = async (id) => {
		setItems(items.filter((_, index) => index !== id));
	};

	const handleResetWorkOrder = () => {
		setItems([]);
		setMedicineTerm("");
		form.reset();
		workOrderForm.reset();
	};

	const productQuantities = () => {};

	const handleRecordFieldChange = (stockItemId, fieldName, fieldValue) => {
		setItems((previousRecords) =>
			previousRecords.map((recordItem) =>
				recordItem?.stock_item_id?.toString() === stockItemId?.toString()
					? { ...recordItem, [fieldName]: fieldValue }
					: recordItem
			)
		);
		// =============== end ===============
	};

	const handleDraftProducts = (data, quantity) => {
		setDraftProducts((previousRecords) => ({
			...previousRecords,
			[data?.stock_item_id]: { ...data, quantity: quantity },
		}));
	};

	const memoizedFilterParameters = useMemo(
		() => ({ category_id: form.values.category_id }),
		[form.values.category_id]
	);

	const { records } = useInfiniteTableScroll({
		module,
		fetchUrl: PHARMACY_DATA_ROUTES.API_ROUTES.STOCK.INDEX_CATEGORY,
		sortByKey: "created_at",
		filterParams: memoizedFilterParameters,
		direction: "desc",
	});

	console.log(form.values.category_id, records);
	// 1st time undefined, []
	// 2nd time 368, []
	// 3rd time 368, (50)[{}...]
	// 4th time 368, []

	useEffect(() => {
		setProducts(records);
	}, [records]);

	const handleProductSearch = useDebouncedCallback((value) => {
		setProducts(records?.filter((product) => product?.name?.toLowerCase()?.includes(value?.toLowerCase())));
	}, 300);

	return (
		<Grid columns={24} gutter={{ base: 8 }}>
			<Grid.Col span={8}>
				<>
					<Grid align="center" columns={20} mt="xxxs">
						<Grid.Col span={20}>
							<SelectForm
								form={form}
								tooltip={t("CategoryValidateMessage")}
								placeholder={t("Category")}
								name="category_id"
								id="category_id"
								nextField="employee_id"
								value={form.values.category_id}
								dropdownValue={categoryDropdown}
							/>
						</Grid.Col>
					</Grid>
					<Box className={"borderRadiusAll"}>
						<DataTable
							classNames={{
								root: tableCss.root,
								table: tableCss.table,
								header: tableCss.header,
								footer: tableCss.footer,
								pagination: tableCss.pagination,
							}}
							records={products}
							columns={[
								{
									accessor: "name",
									title: t("Product"),
									render: (data, index) => (
										<Text fz={11} fw={400}>
											{index + 1}. {data.name}
										</Text>
									),
								},
								{
									accessor: "quantity",
									width: 200,
									title: (
										<Group justify={"flex-end"} spacing="xs" noWrap pl={"sm"} ml={"sm"}>
											<Box pl={"4"}>{t("")}</Box>
											<ActionIcon
												mr={"sm"}
												radius="xl"
												variant="transparent"
												color="grey"
												size="xs"
												onClick={() => {}}
											>
												<IconRefresh style={{ width: "100%", height: "100%" }} stroke={1.5} />
											</ActionIcon>
										</Group>
									),
									textAlign: "right",
									render: (data) => (
										<Group
											wrap="nowrap"
											w="100%"
											gap={0}
											justify="flex-end"
											align="center"
											mx="auto"
										>
											<Input
												styles={{
													input: {
														fontSize: "var(--mantine-font-size-xs)",
														fontWeight: 300,
														lineHeight: 2,
														textAlign: "center",
														borderRadius: 0,
														borderColor: "#905923",
														borderTopLeftRadius: "var(--mantine-radius-sm)",
														borderBottomLeftRadius: "var(--mantine-radius-sm)",
													},
													placeholder: {
														fontSize: "var(--mantine-font-size-xs)",
														fontWeight: 300,
													},
												}}
												size="xxs"
												w="50"
												type={"number"}
												tooltip={""}
												label={""}
												value={draftProducts[data?.stock_item_id]?.quantity}
												onChange={(e) => {
													const value = e.currentTarget.value;
													handleDraftProducts(data, String(value ?? ""));
												}}
												required={false}
												name={"quantity"}
												id={"quantity"}
											/>

											<Button
												size="compact-xs"
												className={genericClass.invoiceAdd}
												radius={0}
												w="30"
												styles={{
													root: {
														height: "26px",
														borderRadius: 0,
														borderTopRightRadius: "var(--mantine-radius-sm)",
														borderBottomRightRadius: "var(--mantine-radius-sm)",
													},
												}}
												onClick={() => handleWorkOrderAdd(draftProducts[data?.stock_item_id])}
											>
												<Flex direction={`column`} gap={0}>
													<IconShoppingBag size={12} />
												</Flex>
											</Button>
										</Group>
									),
								},
							]}
							textSelectionDisabled
							loaderSize="xs"
							loaderColor="grape"
							height={itemFromHeight}
						/>
					</Box>
					<Box mt="2" className="" pl={"xs"} pt={"4"} pb={"6"}>
						<Grid
							className={genericClass.genericBackground}
							columns={12}
							justify="space-between"
							align="center"
						>
							<Grid.Col span={8}>
								<Box>
									<Tooltip
										label={t("EnterSearchAnyKeyword")}
										px={16}
										py={2}
										position="top-end"
										color="var(--theme-primary-color-6)"
										withArrow
										offset={2}
										zIndex={100}
										transitionProps={{
											transition: "pop-bottom-left",
											duration: 1000,
										}}
									>
										<TextInput
											leftSection={<IconSearch size={16} opacity={0.5} />}
											size="sm"
											placeholder={t("ChooseProduct")}
											onChange={(e) => {
												handleProductSearch(e.target.value);
											}}
											id={"SearchKeyword"}
											rightSection={
												searchValue ? (
													<Tooltip label={t("Close")} withArrow bg={`red.5`}>
														<IconX
															color="var( --theme-remove-color)"
															size={16}
															opacity={0.5}
															onClick={() => {
																setSearchValue("");
															}}
														/>
													</Tooltip>
												) : (
													<Tooltip
														label={t("FieldIsRequired")}
														withArrow
														position={"bottom"}
														c={"red"}
														bg={`red.1`}
													>
														<IconInfoCircle size={16} opacity={0.5} />
													</Tooltip>
												)
											}
										/>
									</Tooltip>
								</Box>
							</Grid.Col>
							<Grid.Col span={4}>
								<Box pr={"xs"}>
									<Button
										onClick={() => {
											const tempProducts = localStorage.getItem("temp-sales-products");
											const storedProducts = tempProducts ? JSON.parse(tempProducts) : [];
											const currentWarehouseId = form.values.warehouse_id
												? Number(form.values.warehouse_id)
												: null;

											let updatedProductQuantities = { ...productQuantities };
											let updatedProducts = [...storedProducts];
											let addedCount = 0;

											products.forEach((product) => {
												const quantityStr = productQuantities[product.id];
												const quantityToAdd = Number(quantityStr);

												if (quantityStr && !isNaN(quantityToAdd) && quantityToAdd > 0) {
													const existingIndex = updatedProducts.findIndex(
														(item) => item.product_id === product.id
													);

													if (existingIndex >= 0) {
														// ✅ Update quantity & subtotal
														const existingProduct = updatedProducts[existingIndex];
														const newQuantity = existingProduct.quantity + quantityToAdd;
														const newSubTotal = newQuantity * Number(product.sales_price);

														updatedProducts[existingIndex] = {
															...existingProduct,
															quantity: newQuantity,
															sub_total: newSubTotal,
														};
													} else {
														// ✅ Add new
														const newProduct = {
															product_id: product.id,
															display_name: product.display_name,
															sales_price: product.sales_price,
															price: product.sales_price,
															percent: "",
															stock: product.quantity,
															quantity: quantityToAdd,
															unit_name: product.unit_name,
															purchase_price: product.purchase_price,
															sub_total: quantityToAdd * Number(product.sales_price),
															unit_id: product.unit_id,
															warehouse_id: currentWarehouseId,
															warehouse_name: currentWarehouseId
																? warehouseDropdownData.find(
																		(w) => w.value === currentWarehouseId
																  )?.label || null
																: null,
															bonus_quantity: 0,
														};
														updatedProducts.push(newProduct);
													}

													// ✅ Clear input field for this product
													updatedProductQuantities[product.id] = "";
													addedCount++;
												}
											});

											if (addedCount > 0) {
												localStorage.setItem(
													"temp-sales-products",
													JSON.stringify(updatedProducts)
												);
												setProductQuantities(updatedProductQuantities);
												setLoadCardProducts(true);
											} else {
												notifications.show({
													color: "red",
													title: t("InvalidQuantity"),
													message: t("PleaseEnterValidQuantity"),
													autoClose: 1500,
													withCloseButton: true,
												});
											}
										}}
										size="sm"
										className={genericClass.invoiceAdd}
										type="submit"
										mt={0}
										mr={"xs"}
										w={"100%"}
										leftSection={<IconDeviceFloppy size={16} />}
									>
										<Flex direction={`column`} gap={0}>
											<Text fz={12} fw={400}>
												{t("AddAll")}
											</Text>
										</Flex>
									</Button>
								</Box>
							</Grid.Col>
						</Grid>
					</Box>
				</>
			</Grid.Col>
			<Grid.Col span={16}>
				<Box className="borderRadiusAll border-top-none">
					<DataTable
						classNames={{
							root: tableCss.root,
							table: tableCss.table,
							body: tableCss.body,
							header: tableCss.header,
							footer: tableCss.footer,
							pagination: tableCss.pagination,
						}}
						records={items}
						columns={[
							{
								accessor: "index",
								title: t("S/N"),
								textAlignment: "right",
								sortable: false,
								render: (_item, index) => index + 1,
							},

							{
								accessor: "name",
								title: t("MedicineName"),
								sortable: true,
							},
							{
								accessor: "quantity",
								title: t("Quantity"),
								sortable: false,
								render: (item) => (
									<NumberInput
										min={1}
										size="xs"
										value={item?.quantity}
										onChange={(value) =>
											handleRecordFieldChange(
												item?.stock_item_id,
												"quantity",
												String(value ?? "")
											)
										}
									/>
								),
							},
							{
								accessor: "production_date",
								title: t("ExpiryStartDate"),
								sortable: false,
								render: (item) => (
									<Box>
										<DateSelector
											className="date-selector-input"
											value={item?.production_date}
											onChange={(value) =>
												handleRecordFieldChange(
													item?.stock_item_id,
													"production_date",
													value ? value.toISOString() : ""
												)
											}
										/>
									</Box>
								),
							},
							{
								accessor: "expired_date",
								title: t("ExpiryEndDate"),
								sortable: false,
								render: (item) => (
									<>
										<DateSelector
											value={item?.expired_date}
											onChange={(value) =>
												handleRecordFieldChange(
													item?.stock_item_id,
													"expired_date",
													value ? value.toISOString() : ""
												)
											}
										/>
									</>
								),
							},
							{
								accessor: "action",
								title: "",
								textAlign: "right",
								titleClassName: "title-right",
								render: (_, index) => (
									<Group gap={4} justify="right" wrap="nowrap">
										<Button.Group>
											<ActionIcon
												size="md"
												onClick={() => handleWorkOrderDelete(index)}
												className="border-left-radius-none"
												variant="transparent"
												color="var(--theme-delete-color)"
												radius="es"
												aria-label="delete"
											>
												<IconX height={18} width={18} stroke={1.5} />
											</ActionIcon>
										</Button.Group>
									</Group>
								),
							},
						]}
						textSelectionDisabled
						loaderSize="xs"
						loaderColor="grape"
						height={height - 160}
						sortIcons={{
							sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
							unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
						}}
					/>
					<Box
						w={"100%"}
						component="form"
						onSubmit={workOrderForm.onSubmit(onSave)}
						bg="var(--theme-tertiary-color-0)"
						justify="space-between"
						align="left"
						pt={"xs"}
					>
						<Grid align="center" gatter={"2"} columns={20} mt="0">
							<Grid.Col span={12}>
								<Box bg="var(--theme-primary-color-0)" fz="sm" c="white">
									<Text bg="var(--theme-secondary-color-6)" fz="sm" c="white" px="sm" py="les">
										{t("Remark")}
									</Text>
									<Box p="sm">
										<TextAreaForm
											form={workOrderForm}
											label=""
											value={workOrderForm.values.remark}
											name="remark"
											placeholder="Write a remark..."
											showRightSection={false}
											style={{ input: { height: "60px" } }}
											tooltip={t("EnterRemark")}
										/>
									</Box>
								</Box>
							</Grid.Col>
							<Grid.Col span={8}>
								<Box gap="1" bg="var(--theme-tertiary-color-0)" px="sm">
									<Box>
										<Grid align="center" gatter={"2"} columns={20} mt="0">
											<Grid.Col span={6}>
												<Text fz="sm">{t("Vendor")}</Text>
											</Grid.Col>
											<Grid.Col span={14}>
												<SelectForm
													form={workOrderForm}
													tooltip={t("ChooseVendor")}
													placeholder={t("ChooseVendor")}
													name="vendor_id"
													id="vendor_id"
													nextField="grn"
													required={true}
													value={workOrderForm.values.vendor_id}
													dropdownValue={vendorDropdown}
												/>
											</Grid.Col>
										</Grid>
										<Grid align="center" columns={20} mt="0">
											<Grid.Col span={6}>
												<Text fz="sm">{t("WorkorderNo")}</Text>
											</Grid.Col>
											<Grid.Col span={14}>
												<InputForm
													form={workOrderForm}
													tooltip={t("WorkorderNo")}
													placeholder={t("WorkorderNo")}
													name="grn"
													id="grn"
													nextField="EntityFormSubmit"
													value={workOrderForm.values.grn}
													required={true}
												/>
											</Grid.Col>
										</Grid>
										<Flex gap="les" mt={"xs"}>
											<Button
												onClick={handleResetWorkOrder}
												size="xs"
												leftSection={<IconHistory size={20} />}
												type="button"
												bg="var(--theme-reset-btn-color)"
												color="white"
												w="200px"
											>
												{t("Reset")}
											</Button>
											<Button
												onClick={onSave}
												size="xs"
												leftSection={<IconDeviceFloppy size={20} />}
												type="submit"
												bg="var(--theme-primary-color-6)"
												color="white"
												w="200px"
											>
												{t("Save")}
											</Button>
										</Flex>
									</Box>
								</Box>
							</Grid.Col>
						</Grid>
					</Box>
				</Box>
			</Grid.Col>
		</Grid>
	);
}
