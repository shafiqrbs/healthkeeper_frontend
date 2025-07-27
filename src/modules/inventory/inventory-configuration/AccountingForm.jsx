import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Grid, ScrollArea, Button, Group, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDispatch } from "react-redux";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconCalendar } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { setValidationData } from "@/app/store/core/crudSlice.js";
import { storeEntityData } from "@/app/store/core/crudThunk.js";
import SelectForm from "@components/form-builders/SelectForm";
import DatePickerForm from "@components/form-builders/DatePicker.jsx";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";
import useDomainConfig from "@hooks/config-data/useDomainConfig";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import axios from "axios";

export default function AccountingForm({ height }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [saveCreateLoading, setSaveCreateLoading] = useState(false);
	const { domainConfig, fetchDomainConfig } = useDomainConfig();
	const id = domainConfig?.id;
	const account_config = domainConfig?.account_config;

	let accountDropdownData = useGlobalDropdownData("accounting_sub_head");
	let accountingLedgerDropdownData = useGlobalDropdownData("accounting_ledger");
	let voucherDropdownData = useGlobalDropdownData("voucher");

	// State variables for each dropdown
	const [accountCapitalData, setAccountCapitalData] = useState(null);
	const [accountBankData, setAccountBankData] = useState(null);
	const [accountCashData, setAccountCashData] = useState(null);
	const [accountMobileData, setAccountMobileData] = useState(null);
	const [accountOpeningStockData, setAccountOpeningStockData] = useState(null);
	const [accountProductGroupData, setAccountProductGroupData] = useState(null);
	const [accountUserData, setAccountUserData] = useState(null);
	const [accountCustomerData, setAccountCustomerData] = useState(null);
	const [accountSalesData, setAccountSalesData] = useState(null);
	const [accountSalesDiscountData, setAccountSalesDiscountData] = useState(null);
	const [accountVendorData, setAccountVendorData] = useState(null);
	const [accountPurchaseData, setAccountPurchaseData] = useState(null);
	const [accountPurchaseDiscountData, setAccountPurchaseDiscountData] = useState(null);
	const [accountVatData, setAccountVatData] = useState(null);
	const [accountAitData, setAccountAitData] = useState(null);
	const [accountTdsData, setAccountTdsData] = useState(null);
	const [accountSdData, setAccountSdData] = useState(null);
	const [accountZakatData, setAccountZakatData] = useState(null);

	const [voucherStockOpeningData, setVoucherStockOpeningData] = useState(null);
	const [voucherPurchaseData, setVoucherPurchaseData] = useState(null);
	const [voucherPurchaseReturnData, setVoucherPurchaseReturnData] = useState(null);
	const [voucherSalesData, setVoucherSalesData] = useState(null);
	const [voucherSalesReturnData, setVoucherSalesReturnData] = useState(null);
	const [voucherStockReconciliationData, setVoucherStockReconciliationData] = useState(null);

	useEffect(() => {
		setAccountCapitalData(account_config?.capital_investment_id?.toString());
		setAccountBankData(account_config?.account_bank_id?.toString());
		setAccountCashData(account_config?.account_cash_id?.toString());
		setAccountMobileData(account_config?.account_mobile_id?.toString());
		setAccountOpeningStockData(account_config?.account_stock_opening_id?.toString());
		setAccountProductGroupData(account_config?.account_product_group_id?.toString());
		setAccountUserData(account_config?.account_user_id?.toString());
		setAccountSalesData(account_config?.account_sales_id?.toString());
		setAccountSalesDiscountData(account_config?.account_sales_discount_id?.toString());
		setAccountCustomerData(account_config?.account_customer_id?.toString());
		setAccountPurchaseData(account_config?.account_purchase_id?.toString());
		setAccountPurchaseDiscountData(account_config?.account_purchase_discount_id?.toString());
		setAccountVendorData(account_config?.account_vendor_id?.toString());
		setAccountVatData(account_config?.account_vat_id?.toString());
		setAccountAitData(account_config?.account_ait_id?.toString());
		setAccountSdData(account_config?.account_sd_id?.toString());
		setAccountTdsData(account_config?.account_tds_id?.toString());
		setAccountZakatData(account_config?.account_zakat_id?.toString());

		setVoucherStockOpeningData(account_config?.voucher_stock_opening_id?.toString());
		setVoucherPurchaseData(account_config?.voucher_purchase_id?.toString());
		setVoucherPurchaseReturnData(account_config?.voucher_purchase_return_id?.toString());
		setVoucherSalesData(account_config?.voucher_sales_id?.toString());
		setVoucherSalesReturnData(account_config?.voucher_sales_return_id?.toString());
		setVoucherStockReconciliationData(account_config?.voucher_stock_reconciliation_id?.toString());
	}, [account_config]);

	// Helper function to parse dates properly
	const parseDateValue = (dateString) => {
		if (!dateString) return "";

		// If the value is already a Date object, return it
		if (dateString instanceof Date && !isNaN(dateString)) {
			return dateString;
		}

		try {
			// Try to parse the date string into a Date object
			const date = new Date(dateString);
			return isNaN(date.getTime()) ? "" : date;
		} catch (e) {
			return "";
		}
	};

	// Helper function to format dates for MySQL
	const formatDateForMySQL = (date) => {
		if (!date) return null;
		try {
			const dateObj = new Date(date);
			if (isNaN(dateObj.getTime())) return null;

			const year = dateObj.getFullYear();
			const month = String(dateObj.getMonth() + 1).padStart(2, "0");
			const day = String(dateObj.getDate()).padStart(2, "0");
			const hours = String(dateObj.getHours()).padStart(2, "0");
			const minutes = String(dateObj.getMinutes()).padStart(2, "0");
			const seconds = String(dateObj.getSeconds()).padStart(2, "0");

			return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
		} catch (e) {
			console.error("Error formatting date:", e);
			return null;
		}
	};

	const form = useForm({
		initialValues: {
			financial_start_date: parseDateValue(account_config?.financial_start_date) || "",
			financial_end_date: parseDateValue(account_config?.financial_end_date) || "",
			capital_investment_id: account_config?.capital_investment_id || "",
			account_bank_id: account_config?.account_bank_id || "",
			account_cash_id: account_config?.account_cash_id || "",
			account_mobile_id: account_config?.account_mobile_id || "",
			account_user_id: account_config?.account_user_id || "",
			account_stock_opening_id: account_config?.account_stock_opening_id || "",
			account_product_group_id: account_config?.account_product_group_id || "",
			account_sales_id: account_config?.account_sales_id || "",
			account_sales_discount_id: account_config?.account_sales_discount_id || "",
			account_customer_id: account_config?.account_customer_id || "",

			account_purchase_id: account_config?.account_purchase_id || "",
			account_purchase_discount_id: account_config?.account_purchase_discount_id || "",
			account_vendor_id: account_config?.account_vendor_id || "",
			account_vat_id: account_config?.account_vat_id || "",
			account_ait_id: account_config?.account_ait_id || "",
			account_sd_id: account_config?.account_sd_id || "",
			account_gst_id: account_config?.account_gst_id || "",
			account_zakat_id: account_config?.account_zakat_id || "",

			voucher_purchase_id: account_config?.voucher_purchase_id || "",
			voucher_purchase_return_id: account_config?.voucher_purchase_return_id || "",
			voucher_sales_id: account_config?.voucher_sales_id || "",
			voucher_sales_return_id: account_config?.voucher_sales_return_id || "",
			voucher_stock_opening_id: account_config?.voucher_stock_opening_id || "",
			voucher_stock_reconciliation_id: account_config?.voucher_stock_reconciliation_id || "",
		},
	});

	useEffect(() => {
		if (account_config) {
			form.setValues({
				financial_start_date: parseDateValue(account_config?.financial_start_date) || "",
				financial_end_date: parseDateValue(account_config?.financial_end_date) || "",
				capital_investment_id: account_config?.capital_investment_id || "",
				account_bank_id: account_config?.account_bank_id || "",
				account_cash_id: account_config?.account_cash_id || "",
				account_mobile_id: account_config?.account_mobile_id || "",
				account_user_id: account_config?.account_user_id || "",
				account_stock_opening_id: account_config?.account_stock_opening_id || "",
				account_product_group_id: account_config?.account_product_group_id || "",
				account_sales_id: account_config?.account_sales_id || "",
				account_sales_discount_id: account_config?.account_sales_discount_id || "",
				account_customer_id: account_config?.account_customer_id || "",
				account_purchase_id: account_config?.account_purchase_id || "",
				account_purchase_discount_id: account_config?.account_purchase_discount_id || "",
				account_vendor_id: account_config?.account_vendor_id || "",
				account_vat_id: account_config?.account_vat_id || "",
				account_ait_id: account_config?.account_ait_id || "",
				account_sd_id: account_config?.account_sd_id || "",
				account_gst_id: account_config?.account_gst_id || "",
				account_zakat_id: account_config?.account_zakat_id || "",

				voucher_purchase_id: account_config?.voucher_purchase_id || "",
				voucher_purchase_return_id: account_config?.voucher_purchase_return_id || "",
				voucher_sales_id: account_config?.voucher_sales_id || "",
				voucher_sales_return_id: account_config?.voucher_sales_return_id || "",
				voucher_stock_opening_id: account_config?.voucher_stock_opening_id || "",
				voucher_stock_reconciliation_id: account_config?.voucher_stock_reconciliation_id || "",
			});
		}
	}, [dispatch, account_config]);

	const handleAccountingFormSubmit = (values) => {
		dispatch(setValidationData(false));
		modals.openConfirmModal({
			title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
			labels: { confirm: t("Submit"), cancel: t("Cancel") },
			confirmProps: { color: "red" },
			onCancel: () => console.log("Cancel"),
			onConfirm: () => handleAccountingConfirmSubmit(values),
		});
	};

	const handleAccountingConfirmSubmit = async (values) => {
		// Format dates properly for MySQL
		const formattedValues = {
			...values,
			financial_start_date: formatDateForMySQL(values.financial_start_date),
			financial_end_date: formatDateForMySQL(values.financial_end_date),
		};

		const payload = {
			url: `domain/config/accounting/${id}`,
			data: formattedValues,
		};

		try {
			setSaveCreateLoading(true);
			const result = await dispatch(storeEntityData(payload));
			if (storeEntityData.fulfilled.match(result) && result.payload?.data?.status === 200) {
				fetchDomainConfig();
				showNotificationComponent(t("UpdateSuccessfully"), "teal");
			} else {
				showNotificationComponent(t("UpdateFailed"), "red");
			}
		} catch (err) {
			console.error(err);
			showNotificationComponent(t("UpdateFailed"), "red");
		} finally {
			setSaveCreateLoading(false);
		}
	};

	function AccountingDataProcess(url) {
		modals.openConfirmModal({
			title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
			labels: { confirm: "Confirm", cancel: "Cancel" },
			confirmProps: { color: "red" },
			onCancel: () => console.log("Cancel"),
			onConfirm: async () => {
				const response = await axios.get(`${import.meta.env.VITE_API_GATEWAY_URL}${url}`, {
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						"X-Api-Key": import.meta.env.VITE_API_KEY,
						"X-Api-User": JSON.parse(localStorage.getItem("user")).id,
					},
				});
				if (response.data.message === "success") {
					notifications.show({
						color: "teal",
						title: t("CreateSuccessfully"),
						icon: <IconCheck style={{ width: "18px", height: "18px" }} />,
						loading: false,
						autoClose: 700,
						style: { backgroundColor: "lightgray" },
					});
				}
			},
		});
	}

	useHotkeys(
		[
			[
				"alt+s",
				() => {
					document.getElementById("AccountingFormSubmit").click();
				},
			],
		],
		[]
	);

	return (
		<ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
			<form onSubmit={form.onSubmit(handleAccountingFormSubmit)}>
				<Box pt={"xs"}>
					<Box pl="sm">
						<Box>
							<Grid columns={24} gutter={{ base: 1 }}>
								<Grid.Col span={12} fz={"sm"} mt={8}>
									{t("FinancialStartDate")}
								</Grid.Col>
								<Grid.Col span={12}>
									<DatePickerForm
										tooltip={t("FinancialStartDateTooltip")}
										label=""
										placeholder={t("FinancialStartDate")}
										required={false}
										nextField={"financial_end_date"}
										form={form}
										name={"financial_start_date"}
										id={"financial_start_date"}
										leftSection={<IconCalendar size={16} opacity={0.5} />}
										rightSectionWidth={30}
										closeIcon={true}
									/>
								</Grid.Col>
							</Grid>
						</Box>
						<Box mt={"xs"}>
							<Grid columns={24} gutter={{ base: 1 }}>
								<Grid.Col span={12} fz={"sm"} mt={8}>
									{t("FinancialEndDate")}
								</Grid.Col>
								<Grid.Col span={12}>
									<DatePickerForm
										tooltip={t("FinancialEndDateTooltip")}
										label=""
										placeholder={t("FinancialEndDate")}
										required={false}
										nextField={"capital_investment_id"}
										form={form}
										name={"financial_end_date"}
										id={"financial_end_date"}
										leftSection={<IconCalendar size={16} opacity={0.5} />}
										rightSectionWidth={30}
										closeIcon={true}
									/>
								</Grid.Col>
							</Grid>
						</Box>
					</Box>
					<Box bg="gray.1" px="sm" py="xs" mt="xs">
						<Text fz={14} fw={600}>
							{" "}
							{t("AccountTransactionHead")}
						</Text>
					</Box>
					<Box pl="sm">
						<Box mt={"xs"}>
							<Grid columns={24} gutter={{ base: 1 }}>
								<Grid.Col span={12} fz={"sm"} mt={8}>
									{t("AccountCash")}
								</Grid.Col>
								<Grid.Col span={12}>
									<SelectForm
										tooltip={t("ChooseAccountCash")}
										label={""}
										placeholder={t("ChooseAccountCash")}
										required={false}
										nextField={"account_bank_id"}
										name={"account_cash_id"}
										form={form}
										dropdownValue={accountDropdownData}
										id={"account_cash_id"}
										searchable={true}
										value={accountCashData}
										changeValue={setAccountCashData}
									/>
								</Grid.Col>
							</Grid>
						</Box>
						<Box mt={"xs"}>
							<Grid columns={24} gutter={{ base: 1 }}>
								<Grid.Col span={12} fz={"sm"} mt={8}>
									{t("AccountBank")}
								</Grid.Col>
								<Grid.Col span={12}>
									<SelectForm
										tooltip={t("ChooseAccountBank")}
										label={""}
										placeholder={t("ChooseAccountBank")}
										required={false}
										nextField={"account_mobile_id"}
										name={"account_bank_id"}
										form={form}
										dropdownValue={accountDropdownData}
										id={"account_bank_id"}
										searchable={true}
										value={accountBankData}
										changeValue={setAccountBankData}
									/>
								</Grid.Col>
							</Grid>
						</Box>
						<Box mt={"xs"}>
							<Grid columns={24} gutter={{ base: 1 }}>
								<Grid.Col span={12} fz={"sm"} mt={8}>
									{t("AccountMobile")}
								</Grid.Col>
								<Grid.Col span={12}>
									<SelectForm
										tooltip={t("ChooseAccountMobile")}
										label={""}
										placeholder={t("ChooseAccountMobile")}
										required={false}
										nextField={"capital_investment_id"}
										name={"account_mobile_id"}
										form={form}
										dropdownValue={accountDropdownData}
										id={"account_mobile_id"}
										searchable={true}
										value={accountMobileData}
										changeValue={setAccountMobileData}
									/>
								</Grid.Col>
							</Grid>
						</Box>
					</Box>

					<Box bg="gray.1" px="sm" py="xs" mt="xs">
						<Text fz={14} fw={600}>
							{" "}
							{t("ReceivablePayableHead")}
						</Text>
					</Box>
					<Box pl="sm">
						<Box mt={"xs"}>
							<Grid columns={24} gutter={{ base: 1 }}>
								<Grid.Col span={12} fz={"sm"} mt={8}>
									{t("CapitalInvestment")}
								</Grid.Col>
								<Grid.Col span={12}>
									<SelectForm
										tooltip={t("ChooseCapitalInvestment")}
										label={""}
										placeholder={t("ChooseCapitalInvestment")}
										required={false}
										nextField={"account_user_id"}
										name={"capital_investment_id"}
										form={form}
										dropdownValue={accountDropdownData}
										id={"capital_investment_id"}
										searchable={true}
										value={accountCapitalData}
										changeValue={setAccountCapitalData}
									/>
								</Grid.Col>
							</Grid>
						</Box>
						<Box mt={"xs"}>
							<Grid columns={24} gutter={{ base: 1 }}>
								<Grid.Col span={12} fz={"sm"} mt={8}>
									{t("AccountUser")}
								</Grid.Col>
								<Grid.Col span={12}>
									<SelectForm
										tooltip={t("ChooseAccountUser")}
										label={""}
										placeholder={t("ChooseAccountUser")}
										required={false}
										nextField={"account_customer_id"}
										name={"account_user_id"}
										form={form}
										dropdownValue={accountDropdownData}
										id={"account_user_id"}
										searchable={true}
										value={accountUserData}
										changeValue={setAccountUserData}
									/>
								</Grid.Col>
							</Grid>
						</Box>
						<Box mt={"xs"}>
							<Grid columns={24} gutter={{ base: 1 }}>
								<Grid.Col span={12} fz={"sm"} mt={8}>
									{t("AccountCustomer")}
								</Grid.Col>
								<Grid.Col span={12}>
									<SelectForm
										tooltip={t("ChooseAccountCustomer")}
										label={""}
										placeholder={t("ChooseAccountCustomer")}
										required={false}
										nextField={"account_vendor_id"}
										name={"account_customer_id"}
										form={form}
										dropdownValue={accountDropdownData}
										id={"account_customer_id"}
										searchable={true}
										value={accountCustomerData}
										changeValue={setAccountCustomerData}
									/>
								</Grid.Col>
							</Grid>
						</Box>
						<Box mt={"xs"}>
							<Grid columns={24} gutter={{ base: 1 }}>
								<Grid.Col span={12} fz={"sm"} mt={8}>
									{t("AccountVendor")}
								</Grid.Col>
								<Grid.Col span={12}>
									<SelectForm
										tooltip={t("ChooseAccountVendor")}
										label={""}
										placeholder={t("ChooseAccountVendor")}
										required={false}
										nextField={"account_stock_opening_id"}
										name={"account_vendor_id"}
										form={form}
										dropdownValue={accountDropdownData}
										id={"account_vendor_id"}
										searchable={true}
										value={accountVendorData}
										changeValue={setAccountVendorData}
									/>
								</Grid.Col>
							</Grid>
						</Box>
					</Box>
					<Box bg="gray.1" px="sm" py="xs" mt="xs">
						<Text fz={14} fw={600}>
							{" "}
							{t("Inventory")}
						</Text>
					</Box>
					<Box pl="sm">
						<Box mt={"xs"}>
							<Grid columns={24} gutter={{ base: 1 }}>
								<Grid.Col span={12} fz={"sm"} mt={8}>
									{t("AccountOpeningStockLedger")}
								</Grid.Col>
								<Grid.Col span={12}>
									<SelectForm
										tooltip={t("ChooseAccountOpeningStockData")}
										label={""}
										placeholder={t("ChooseAccountOpeningStockData")}
										required={false}
										nextField={"account_product_group_id"}
										name={"account_stock_opening_id"}
										form={form}
										dropdownValue={accountingLedgerDropdownData}
										id={"account_stock_opening_id"}
										searchable={true}
										value={accountOpeningStockData}
										changeValue={setAccountOpeningStockData}
									/>
								</Grid.Col>
							</Grid>
						</Box>

						<Box mt={"xs"}>
							<Grid columns={24} gutter={{ base: 1 }}>
								<Grid.Col span={12} fz={"sm"} mt={8}>
									{t("AccountProductGroup")}
								</Grid.Col>
								<Grid.Col span={12}>
									<SelectForm
										tooltip={t("ChooseAccountProductGroup")}
										label={""}
										placeholder={t("ChooseAccountProductGroup")}
										required={false}
										nextField={"account_purchase_id"}
										name={"account_product_group_id"}
										form={form}
										dropdownValue={accountDropdownData}
										id={"account_product_group_id"}
										searchable={true}
										value={accountProductGroupData}
										changeValue={setAccountProductGroupData}
									/>
								</Grid.Col>
							</Grid>
						</Box>
					</Box>
					<Box bg="gray.1" px="sm" py="xs" mt="xs">
						<Text fz={14} fw={600}>
							{" "}
							{t("PurchaseAndSalesLedger")}
						</Text>
					</Box>
					<Box pl="sm">
						<Box mt={"xs"}>
							<Grid columns={24} gutter={{ base: 1 }}>
								<Grid.Col span={12} fz={"sm"} mt={8}>
									{t("PurchaseAccount")}
								</Grid.Col>
								<Grid.Col span={12}>
									<SelectForm
										tooltip={t("ChooseAccountVendor")}
										label={""}
										placeholder={t("ChooseAccountVendor")}
										required={false}
										nextField={"account_purchase_discount_id"}
										name={"account_purchase_id"}
										form={form}
										dropdownValue={accountingLedgerDropdownData}
										id={"account_purchase_id"}
										searchable={true}
										value={accountPurchaseData}
										changeValue={setAccountPurchaseData}
									/>
								</Grid.Col>
							</Grid>
						</Box>

						<Box mt={"xs"}>
							<Grid columns={24} gutter={{ base: 1 }}>
								<Grid.Col span={12} fz={"sm"} mt={8}>
									{t("PurchaseAccountDiscount")}
								</Grid.Col>
								<Grid.Col span={12}>
									<SelectForm
										tooltip={t("ChooseAccountVendor")}
										label={""}
										placeholder={t("ChooseAccountVendor")}
										required={false}
										nextField={"account_sales_id"}
										name={"account_purchase_discount_id"}
										form={form}
										dropdownValue={accountingLedgerDropdownData}
										id={"account_purchase_discount_id"}
										searchable={true}
										value={accountPurchaseDiscountData}
										changeValue={setAccountPurchaseDiscountData}
									/>
								</Grid.Col>
							</Grid>
						</Box>

						<Box mt={"xs"}>
							<Grid columns={24} gutter={{ base: 1 }}>
								<Grid.Col span={12} fz={"sm"} mt={8}>
									{t("AccountSales")}
								</Grid.Col>
								<Grid.Col span={12}>
									<SelectForm
										tooltip={t("ChooseAccountCustomer")}
										label={""}
										placeholder={t("ChooseAccountCustomer")}
										required={false}
										nextField={"account_sales_discount_id"}
										name={"account_sales_id"}
										form={form}
										dropdownValue={accountingLedgerDropdownData}
										id={"account_sales_id"}
										searchable={true}
										value={accountSalesData}
										changeValue={setAccountSalesData}
									/>
								</Grid.Col>
							</Grid>
						</Box>
						<Box mt={"xs"}>
							<Grid columns={24} gutter={{ base: 1 }}>
								<Grid.Col span={12} fz={"sm"} mt={8}>
									{t("AccountSalesDiscount")}
								</Grid.Col>
								<Grid.Col span={12}>
									<SelectForm
										tooltip={t("ChooseAccountCustomer")}
										label={""}
										placeholder={t("ChooseAccountCustomer")}
										required={false}
										nextField={"account_vat_id"}
										name={"account_sales_discount_id"}
										form={form}
										dropdownValue={accountingLedgerDropdownData}
										id={"account_sales_discount_id"}
										searchable={true}
										value={accountSalesDiscountData}
										changeValue={setAccountSalesDiscountData}
									/>
								</Grid.Col>
							</Grid>
						</Box>
					</Box>
					<Box bg="gray.1" px="sm" py="xs" mt="xs">
						<Text fz={14} fw={600}>
							{" "}
							{t("DutiesAndTaxesLedger")}
						</Text>
					</Box>
					<Box pl="sm">
						<Box mt={"xs"}>
							<Grid columns={24} gutter={{ base: 1 }}>
								<Grid.Col span={12} fz={"sm"} mt={8}>
									{t("AccountVAT")}
								</Grid.Col>
								<Grid.Col span={12}>
									<SelectForm
										tooltip={t("ChooseAccountVat")}
										label={""}
										placeholder={t("ChooseAccountVat")}
										required={false}
										nextField={"account_tds_id"}
										name={"account_vat_id"}
										form={form}
										dropdownValue={accountingLedgerDropdownData}
										id={"account_vat_id"}
										searchable={true}
										value={accountVatData}
										changeValue={setAccountVatData}
									/>
								</Grid.Col>
							</Grid>
						</Box>
						<Box mt={"xs"}>
							<Grid columns={24} gutter={{ base: 1 }}>
								<Grid.Col span={12} fz={"sm"} mt={8}>
									{t("AccountTDS")}
								</Grid.Col>
								<Grid.Col span={12}>
									<SelectForm
										tooltip={t("ChooseAccountVendor")}
										label={""}
										placeholder={t("ChooseAccountVendor")}
										required={false}
										nextField={"account_ait_id"}
										name={"account_tds_id"}
										form={form}
										dropdownValue={accountingLedgerDropdownData}
										id={"account_tds_id"}
										searchable={true}
										value={accountTdsData}
										changeValue={setAccountTdsData}
									/>
								</Grid.Col>
							</Grid>
						</Box>
						<Box mt={"xs"}>
							<Grid columns={24} gutter={{ base: 1 }}>
								<Grid.Col span={12} fz={"sm"} mt={8}>
									{t("AccountAIT")}
								</Grid.Col>
								<Grid.Col span={12}>
									<SelectForm
										tooltip={t("ChooseAccountAIT")}
										label={""}
										placeholder={t("ChooseAccountAIT")}
										required={false}
										nextField={"account_sd_id"}
										name={"account_ait_id"}
										form={form}
										dropdownValue={accountingLedgerDropdownData}
										id={"account_ait_id"}
										searchable={true}
										value={accountAitData}
										changeValue={setAccountAitData}
									/>
								</Grid.Col>
							</Grid>
						</Box>
						<Box mt={"xs"}>
							<Grid columns={24} gutter={{ base: 1 }}>
								<Grid.Col span={12} fz={"sm"} mt={8}>
									{t("AccountSD")}
								</Grid.Col>
								<Grid.Col span={12}>
									<SelectForm
										tooltip={t("ChooseAccountSD")}
										label={""}
										placeholder={t("ChooseAccountSD")}
										required={false}
										nextField={"account_zakat_id"}
										name={"account_sd_id"}
										form={form}
										dropdownValue={accountingLedgerDropdownData}
										id={"account_sd_id"}
										searchable={true}
										value={accountSdData}
										changeValue={setAccountSdData}
									/>
								</Grid.Col>
							</Grid>
						</Box>
						<Box mt={"xs"}>
							<Grid columns={24} gutter={{ base: 1 }}>
								<Grid.Col span={12} fz={"sm"} mt={8}>
									{t("AccountZakat")}
								</Grid.Col>
								<Grid.Col span={12}>
									<SelectForm
										tooltip={t("ChooseAccountCustomer")}
										label={""}
										placeholder={t("ChooseAccountCustomer")}
										required={false}
										nextField={"voucher_stock_opening_id"}
										name={"account_zakat_id"}
										form={form}
										dropdownValue={accountingLedgerDropdownData}
										id={"account_zakat_id"}
										searchable={true}
										value={accountZakatData}
										changeValue={setAccountZakatData}
									/>
								</Grid.Col>
							</Grid>
						</Box>
					</Box>
					<Box bg="gray.1" px="sm" py="xs" mt="xs">
						<Group justify="space-between">
							<Text fz={14} fw={600}>
								{" "}
								{t("VoucherSetup")}
							</Text>
							<Button
								variant="filled"
								color="var(--theme-secondary-color-8)"
								size="xs"
								onClick={() => {
									AccountingDataProcess("accounting/account-voucher-reset");
								}}
							>
								{t("Reset")}
							</Button>
						</Group>
					</Box>
					<Box pl="sm">
						<Box mt={"xs"}>
							<Grid columns={24} gutter={{ base: 1 }}>
								<Grid.Col span={12} fz={"sm"} mt={8}>
									{t("VoucherStockOpening")}
								</Grid.Col>
								<Grid.Col span={12}>
									<SelectForm
										tooltip={t("ChooseVoucherStockOpening")}
										label={""}
										placeholder={t("ChooseVoucherStockOpening")}
										required={false}
										nextField={"voucher_purchase_id"}
										name={"voucher_stock_opening_id"}
										form={form}
										dropdownValue={voucherDropdownData}
										id={"voucher_stock_opening_id"}
										searchable={true}
										value={voucherStockOpeningData}
										changeValue={setVoucherStockOpeningData}
									/>
								</Grid.Col>
							</Grid>
						</Box>
						<Box mt={"xs"}>
							<Grid columns={24} gutter={{ base: 1 }}>
								<Grid.Col span={12} fz={"sm"} mt={8}>
									{t("VoucherPurchase")}
								</Grid.Col>
								<Grid.Col span={12}>
									<SelectForm
										tooltip={t("ChooseVoucherPurchase")}
										label={""}
										placeholder={t("ChooseVoucherPurchase")}
										required={false}
										nextField={"voucher_purchase_return_id"}
										name={"voucher_purchase_id"}
										form={form}
										dropdownValue={voucherDropdownData}
										id={"voucher_purchase_id"}
										searchable={true}
										value={voucherPurchaseData}
										changeValue={setVoucherPurchaseData}
									/>
								</Grid.Col>
							</Grid>
						</Box>
						<Box mt={"xs"}>
							<Grid columns={24} gutter={{ base: 1 }}>
								<Grid.Col span={12} fz={"sm"} mt={8}>
									{t("VoucherPurchaseReturn")}
								</Grid.Col>
								<Grid.Col span={12}>
									<SelectForm
										tooltip={t("ChooseVoucherPurchaseReturn")}
										label={""}
										placeholder={t("ChooseVoucherPurchaseReturn")}
										required={false}
										nextField={"voucher_sales_id"}
										name={"voucher_purchase_return_id"}
										form={form}
										dropdownValue={voucherDropdownData}
										id={"voucher_purchase_return_id"}
										searchable={true}
										value={voucherPurchaseReturnData}
										changeValue={setVoucherPurchaseReturnData}
									/>
								</Grid.Col>
							</Grid>
						</Box>
						<Box mt={"xs"}>
							<Grid columns={24} gutter={{ base: 1 }}>
								<Grid.Col span={12} fz={"sm"} mt={8}>
									{t("VoucherSales")}
								</Grid.Col>
								<Grid.Col span={12}>
									<SelectForm
										tooltip={t("ChooseVoucherSales")}
										label={""}
										placeholder={t("ChooseVoucherSales")}
										required={false}
										nextField={"voucher_sales_return_id"}
										name={"voucher_sales_id"}
										form={form}
										dropdownValue={voucherDropdownData}
										id={"voucher_sales_id"}
										searchable={true}
										value={voucherSalesData}
										changeValue={setVoucherSalesData}
									/>
								</Grid.Col>
							</Grid>
						</Box>
						<Box mt={"xs"}>
							<Grid columns={24} gutter={{ base: 1 }}>
								<Grid.Col span={12} fz={"sm"} mt={8}>
									{t("VoucherSalesReturn")}
								</Grid.Col>
								<Grid.Col span={12}>
									<SelectForm
										tooltip={t("ChooseVoucherSalesReturn")}
										label={""}
										placeholder={t("ChooseVoucherSalesReturn")}
										required={false}
										nextField={"voucher_stock_reconciliation_id"}
										name={"voucher_sales_return_id"}
										form={form}
										dropdownValue={voucherDropdownData}
										id={"voucher_sales_return_id"}
										searchable={true}
										value={voucherSalesReturnData}
										changeValue={setVoucherSalesReturnData}
									/>
								</Grid.Col>
							</Grid>
						</Box>
						<Box mt={"xs"}>
							<Grid columns={24} gutter={{ base: 1 }}>
								<Grid.Col span={12} fz={"sm"} mt={8}>
									{t("VoucherStockReconciliation")}
								</Grid.Col>
								<Grid.Col span={12}>
									<SelectForm
										tooltip={t("ChooseVoucherStockReconciliation")}
										label={""}
										placeholder={t("ChooseVoucherStockReconciliation")}
										required={false}
										nextField={"AccountingFormSubmit"}
										name={"voucher_stock_reconciliation_id"}
										form={form}
										dropdownValue={voucherDropdownData}
										id={"voucher_stock_reconciliation_id"}
										searchable={true}
										value={voucherStockReconciliationData}
										changeValue={setVoucherStockReconciliationData}
									/>
								</Grid.Col>
							</Grid>
						</Box>
					</Box>
				</Box>
				<Button id="AccountingFormSubmit" type="submit" style={{ display: "none" }}>
					{t("Submit")}
				</Button>
			</form>
		</ScrollArea>
	);
}
