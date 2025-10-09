import { parseDateValue } from "@/common/utils";

const generateInitialValues = (account_config) => ({
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

export const getAccountingFormInitialValues = (account_config) => {
	return {
		initialValues: generateInitialValues(account_config),
	};
};

export const generateHospitalFormValues = () => ({
	consultant_by_id: '',
	opd_store_id: '',
	ipd_store_id: '',
	ot_store_id: '',
	emergency_room_id: '',
	opd_select_doctor: 0,
	special_discount_doctor: 0,
	special_discount_investigation: 0,
});

export const getHospitalFormInitialValues = (hospital_config) => {
	return {
		initialValues: generateHospitalFormValues(hospital_config),
	};
};
