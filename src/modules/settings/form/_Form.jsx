import { getConfigurationFormInitialValues } from "../helpers/request";
import ConfigurationForm from "./__ConfigurationForm";
import { showEntityData, storeEntityData } from "@/app/store/core/crudThunk.js";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent.jsx";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useForm } from "@mantine/form";

export default function Form() {
	const { id } = useParams();
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [configData, setConfigData] = useState(null);

	const form = useForm(getConfigurationFormInitialValues());
	const [saveCreateLoading, setSaveCreateLoading] = useState(false);
	const [posInvoiceModeId, setPosInvoiceModeId] = useState(configData?.pos_invoice_mode_id?.toString() || "");
	const [configFetching, setConfigFetching] = useState(true);
	const [setFormData, setFormDataForUpdate] = useState(false);
	const [files, setFiles] = useState([]);

	const handleSubmit = async (values) => {
		try {
			setSaveCreateLoading(true);

			!posInvoiceModeId && (form.values["pos_invoice_mode_id"] = null);

			if (files) {
				form.values["logo"] = files[0];
			}

			const booleanFields = [
				"sku_warehouse",
				"sku_category",
				"vat_enable",
				"zakat_enable",
				"remove_image",
				"invoice_print_logo",
				"print_outstanding",
				"pos_print",
				"is_print_header",
				"is_invoice_title",
				"is_print_footer",
				"is_powered",
				"custom_invoice",
				"bonus_from_stock",
				"is_unit_price",
				"is_description",
				"zero_stock",
				"stock_item",
				"custom_invoice_print",
				"is_stock_history",
				"condition_sales",
				"store_ledger",
				"is_marketing_executive",
				"tlo_commission",
				"sales_return",
				"sr_commission",
				"due_sales_without_customer",
				"is_zero_receive_allow",
				"is_purchase_by_purchase_price",
				"is_pos",
				"hs_code_enable",
				"sd_enable",
				"ait_enable",
				"is_pay_first",
				"is_sales_auto_approved",
				"is_purchase_auto_approved",
				"is_active_sms",
				"is_kitchen",
			];

			// Convert Boolean values to 1 or 0 dynamically
			booleanFields.forEach((field) => {
				form.values[field] = values[field] === true || values[field] == 1 ? 1 : 0;
			});

			const value = {
				url: `inventory/config-update/${id}`,
				data: values,
				module: "config",
			};
			const result = await dispatch(storeEntityData(value)).unwrap();
			if (result?.data?.message === "success") {
				showNotificationComponent(t("UpdateSuccessfully"), "var(--theme-success-color)", null, false, 1000);
				const resultAction = await dispatch(showEntityData({ url: "inventory/config", module: "config" }));
				if (showEntityData.fulfilled.match(resultAction)) {
					if (resultAction.payload?.data?.status === 200) {
						localStorage.setItem("config-data", JSON.stringify(resultAction.payload.data.data));
					}
				}
			}
		} catch (error) {
			console.error(error);
			showNotificationComponent(t("FailedToUpdateData"), "var(--theme-error-color)", null, false, 1000);
		} finally {
			setSaveCreateLoading(false);
		}
	};

	return (
		<ConfigurationForm
			form={form}
			handleSubmit={handleSubmit}
			saveCreateLoading={saveCreateLoading}
			configData={configData}
			setConfigData={setConfigData}
			configFetching={configFetching}
			setConfigFetching={setConfigFetching}
			setFormDataForUpdate={setFormDataForUpdate}
			posInvoiceModeId={posInvoiceModeId}
			setPosInvoiceModeId={setPosInvoiceModeId}
			files={files}
			setFiles={setFiles}
		/>
	);
}
