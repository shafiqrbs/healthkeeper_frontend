import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {Box, ScrollArea, Button, Text, Flex, Stack, Grid, Title, Select} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDispatch } from "react-redux";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCalendar, IconCheck, IconX } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { showEntityData, updateEntityData, storeEntityData } from "@/app/store/core/crudThunk.js";
import SelectForm from "@components/form-builders/SelectForm";
import InputForm from "@components/form-builders/InputForm";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import InputCheckboxForm from "@components/form-builders/InputCheckboxForm";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import DatePickerForm from "@components/form-builders/DatePicker";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import { MODULES } from "@/constants";
import { getHospitalFormInitialValues } from "../helpers/request";
import { CONFIGURATION_ROUTES } from "@/constants/routes";
import useDomainConfig from "@hooks/config-data/useDomainConfig";
import { parseDateValue } from "@utils/index";
import { successNotification } from "@components/notification/successNotification";
import { errorNotification } from "@components/notification/errorNotification";
import {CORE_DROPDOWNS,HOSPITAL_DROPDOWNS} from "@/app/store/core/utilitySlice";
import inlineInputCss from "@assets/css/InlineInputField.module.css";

const module = MODULES.HOSPITAL_CONFIG;

export default function __HospitalForm({ height, id }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [saveCreateLoading, setSaveCreateLoading] = useState(false);
	const { domainConfig } = useDomainConfig();
	const hospital_config = domainConfig?.hospital_config;
	const inventory_config = domainConfig?.inventory_config;

	const form = useForm(getHospitalFormInitialValues());

	const handleFormSubmit = (values) => {
		modals.openConfirmModal({
			title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
			labels: { confirm: t("Submit"), cancel: t("Cancel") },
			confirmProps: { color: "red" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleConfirmFormSubmit(values),
		});
	};

	const { data: warehouseDropdown } = useGlobalDropdownData({
		path: CORE_DROPDOWNS.WAREHOUSE.PATH,
		utility: CORE_DROPDOWNS.WAREHOUSE.UTILITY,
	});
	const { data: employeeDropdown } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.PARTICULAR_DOCTOR.PATH,
		utility: HOSPITAL_DROPDOWNS.PARTICULAR_DOCTOR.UTILITY,
		params: { "dropdown-type": HOSPITAL_DROPDOWNS.PARTICULAR_DOCTOR.TYPE },

	});
	console.log(employeeDropdown)

	useEffect(() => {
		if (hospital_config) {
			form.setValues({
				message_admission: hospital_config?.message_admission || "",
				message_diagnostic: hospital_config?.message_diagnostic || "",
				message_visit: hospital_config?.message_visit || "",
				special_discount_doctor: hospital_config?.special_discount_doctor || 0,
				special_discount_investigation: hospital_config?.special_discount_investigation || 0,
				prescription_show_referred: hospital_config?.prescription_show_referred || 0,
				opd_select_doctor: hospital_config?.opd_select_doctor || 0,
				is_marketing_executive: hospital_config?.is_marketing_executive || 0,
				is_print_header: hospital_config?.is_print_header || 0,
				is_invoice_title: hospital_config?.is_invoice_title || 0,
				is_print_footer: hospital_config?.is_print_footer || 0,
				opd_store_id: hospital_config?.opd_store_id || 0,
				ot_store_id: hospital_config?.ot_store_id || 0,
				ipd_store_id: hospital_config?.ipd_store_id || 0,
				consultant_by_id: hospital_config?.consultant_by_id || 0,
			});
		}
	}, [dispatch, hospital_config]);

	const handleConfirmFormSubmit = async (values) => {
		const properties = [
			"opd_select_doctor",
			"special_discount_doctor",
			"special_discount_investigation",
			"prescription_temlate",
		];
		properties.forEach((property) => {
			values[property] = values[property] === true || values[property] == 1 ? 1 : 0;
		});

		try {
			setSaveCreateLoading(true);

			const value = {
				url: `${CONFIGURATION_ROUTES.API_ROUTES.HOSPITAL_CONFIG.CREATE}/${id}`,
				data: values,
				module,
			};

			const resultAction = await dispatch(storeEntityData(value));
			if (showEntityData.fulfilled.match(resultAction)) {
				if (resultAction.payload.data.status === 200) {
					localStorage.setItem("domain-config-data", JSON.stringify(resultAction));
				}
			}
			successNotification(t("UpdateSuccessfully"));
			setTimeout(() => {
				setSaveCreateLoading(false);
			}, 500);
		} catch (error) {
			errorNotification("Error updating purchase config:" + error.message);
			setSaveCreateLoading(false);
		}
	};

	useHotkeys(
		[
			[
				"alt+p",
				() => {
					document.getElementById("PurchaseFormSubmit").click();
				},
			],
		],
		[]
	);

	return (
		<ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
			<form onSubmit={form.onSubmit(handleFormSubmit)}>
				<Box p="md">
					<Stack gap="les" mt="xs">
						<InputCheckboxForm
							label={t("PrescriptionShowReferred")}
							field="prescription_show_referred"
							name="prescription_show_referred"
							form={form}
						/>
						<InputCheckboxForm
							label={t("OpdSelectDoctor")}
							field="opd_select_doctor"
							name="opd_select_doctor"
							form={form}
						/>
						<InputCheckboxForm
							label={t("MarketingExecutive")}
							field="is_marketing_executive"
							name="is_marketing_executive"
							form={form}
						/>
						<InputCheckboxForm
							label={t("SpecialDiscountDoctor")}
							field="special_discount_doctor"
							name="special_discount_doctor"
							form={form}
						/>
						<InputCheckboxForm
							label={t("SpecialDiscountInvestigation")}
							field="special_discount_investigation"
							name="special_discount_investigation"
							form={form}
						/>
					</Stack>
					<Box className={"inner-title-box"}>
						<Title order={6}>{t("Operation Fee")}</Title>
					</Box>
					{/* ======================= some demo components for reusing purposes ======================= */}
					<Grid columns={24} mt="sm" gutter={{ base: 1 }}>
						<Grid.Col span={12} fz="sm" mt="xxxs">
							{hospital_config?.admission_fee?.admission_fee_name}
						</Grid.Col>
						<Grid.Col span={12}>
							{inventory_config?.currency?.symbol} {hospital_config?.admission_fee?.admission_fee_price}{" "}
							{inventory_config?.currency?.code}
						</Grid.Col>
					</Grid>
					<Grid columns={24} mt="sm" gutter={{ base: 1 }}>
						<Grid.Col span={12} fz="sm" mt="xxxs">
							{hospital_config?.opd_ticket_fee?.opd_ticket_fee_name}
						</Grid.Col>
						<Grid.Col span={12}>
							{inventory_config?.currency?.symbol} {hospital_config?.opd_ticket_fee?.opd_ticket_fee_price}{" "}
							{inventory_config?.currency?.code}
						</Grid.Col>
					</Grid>
					<Grid columns={24} mt="sm" gutter={{ base: 1 }}>
						<Grid.Col span={12} fz="sm" mt="xxxs">
							{hospital_config?.emergency_fee?.emergency_fee_name}
						</Grid.Col>
						<Grid.Col span={12}>
							{inventory_config?.currency?.symbol} {hospital_config?.emergency_fee?.emergency_fee_price}{" "}
							{inventory_config?.currency?.code}
						</Grid.Col>
					</Grid>
					<Grid columns={24} mt="sm" gutter={{ base: 1 }}>
						<Grid.Col span={12} fz="sm" mt="xxxs">
							{hospital_config?.ot_fee?.ot_fee_name}
						</Grid.Col>
						<Grid.Col span={12}>
							{inventory_config?.currency?.symbol} {hospital_config?.ot_fee?.ot_fee_price}{" "}
							{inventory_config?.currency?.code}
						</Grid.Col>
					</Grid>
					<Grid columns={24} mt="sm" gutter={{ base: 1 }}>
						<Grid.Col span={12} fz="sm" mt="xxxs">
							{t("Consultant")}
						</Grid.Col>
						<Grid.Col span={12}>
							<SelectForm
								form={form}
								tooltip={t("ConsultantByValidateMessage")}
								placeholder={t("ConsultantBy")}
								name="consultant_by_id"
								id="consultant_by_id"
								nextField="opd_store_id"
								required={true}
								value={form.values.consultant_by_id}
								dropdownValue={employeeDropdown}
							/>
						</Grid.Col>
					</Grid>
					<Box className={"inner-title-box"}>
						<Title order={6}>{t("StoreSetup")}</Title>
					</Box>
					{/* ======================= some demo components for reusing purposes ======================= */}
					<Grid columns={24} mt="sm" gutter={{ base: 1 }}>
						<Grid.Col span={12} fz="sm" mt="xxxs">
							{t("OPDStore")}
						</Grid.Col>
						<Grid.Col span={12}>
							<SelectForm
								form={form}
								tooltip={t("OPDStoreValidateMessage")}
								placeholder={t("OPDStore")}
								name="opd_store_id"
								id="opd_store_id"
								nextField="ipd_store_id"
								required={true}
								value={form.values.opd_store_id}
								dropdownValue={warehouseDropdown}
							/>
						</Grid.Col>
					</Grid>
					<Grid columns={24} mt="sm" gutter={{ base: 1 }}>
						<Grid.Col span={12} fz="sm" mt="xxxs">
							{t("IPDStore")}
						</Grid.Col>
						<Grid.Col span={12}>
							<SelectForm
								form={form}
								tooltip={t("OPDStoreValidateMessage")}
								placeholder={t("OPDStore")}
								name="ipd_store_id"
								id="ipd_store_id"
								nextField="ot_store_id"
								required={true}
								value={form.values.ipd_store_id}
								dropdownValue={warehouseDropdown}
							/>
						</Grid.Col>
					</Grid>
					<Grid columns={24} mt="sm" gutter={{ base: 1 }}>
						<Grid.Col span={12} fz="sm" mt="xxxs">
							{t("OTStore")}
						</Grid.Col>
						<Grid.Col span={12}>
							<SelectForm
								form={form}
								tooltip={t("OPDStoreValidateMessage")}
								placeholder={t("OPDStore")}
								name="ot_store_id"
								id="ot_store_id"
								required={false}
								value={form.values.ot_store_id}
								dropdownValue={warehouseDropdown}
							/>
						</Grid.Col>
					</Grid>

					<Box className={"inner-title-box"}>
						<Title order={6}>{t("Messageing")}</Title>
					</Box>
					{/* ======================= some demo components for reusing purposes ======================= */}
					<Grid columns={24} mt="sm" gutter={{ base: 1 }}>
						<Grid.Col span={12} fz="sm" mt="xxxs">
							{t("Message Admission")}
						</Grid.Col>
						<Grid.Col span={12}>
							<InputForm
								tooltip=""
								label=""
								placeholder="Text"
								name="message_admission"
								form={form}
								id="message_admission"
							/>
						</Grid.Col>
					</Grid>
					<Grid columns={24} mt="sm" gutter={{ base: 1 }}>
						<Grid.Col span={12} fz="sm" mt="xxxs">
							{t("Message Visit")}
						</Grid.Col>
						<Grid.Col span={12}>
							<InputForm
								tooltip=""
								label=""
								placeholder="Text"
								name="message_visit"
								form={form}
								id="message_visit"
							/>
						</Grid.Col>
					</Grid>
					<Grid columns={24} mt="sm" gutter={{ base: 1 }}>
						<Grid.Col span={12} fz="sm" mt="xxxs">
							{t("Message Diagnostic")}
						</Grid.Col>
						<Grid.Col span={12}>
							<InputForm
								tooltip=""
								label=""
								placeholder="Text"
								name="message_diagnostic"
								form={form}
								id="message_diagnostic"
							/>
						</Grid.Col>
					</Grid>
					{/*<Grid columns={24} mt="sm" gutter={{ base: 1 }}>
					<Grid.Col span={12} fz="sm" mt="xxxs">
						{t("MessageAdmission")}
					</Grid.Col>
					<Grid.Col span={12}>
						<SelectForm
							tooltip={t("MessageAdmission")}
							label=""
							placeholder={t("MessageAdmission")}
							name="message_admission"
							form={form}
							dropdownValue={voucherDropdownData}
							id="message_admission"
							searchable={true}
							value={voucherSalesReturnData}
							changeValue={setVoucherSalesReturnData}
						/>
					</Grid.Col>
				</Grid>

				<Grid columns={24} mt="sm" gutter={{ base: 1 }}>
					<Grid.Col span={12} fz="sm" mt="xxxs">
						{t("Text")}
					</Grid.Col>
					<Grid.Col span={12}>
						<InputForm tooltip="" label="" placeholder="Text" name="text" form={form} id="text" />
					</Grid.Col>
				</Grid>
				<Grid columns={24} mt="sm" gutter={{ base: 1 }}>
					<Grid.Col span={12} fz="sm" mt="xxxs">
						{t("Number")}
					</Grid.Col>
					<Grid.Col span={12}>
						<InputNumberForm
							tooltip=""
							label=""
							placeholder="Number"
							name="number"
							form={form}
							id="number"
						/>
					</Grid.Col>
				</Grid>

				<Grid columns={24} mt="sm" gutter={{ base: 1 }}>
					<Grid.Col span={12} fz="sm" mt="xxxs">
						{t("DatePicker")}
					</Grid.Col>
					<Grid.Col span={12}>
						<DatePickerForm
							tooltip={t("FinancialEndDateTooltip")}
							label=""
							placeholder={t("FinancialEndDate")}
							required={false}
							nextField="capital_investment_id"
							form={form}
							name="financial_end_date"
							id="financial_end_date"
							leftSection={<IconCalendar size={16} opacity={0.5} />}
							rightSectionWidth={30}
							closeIcon={true}
						/>
					</Grid.Col>
				</Grid>*/}
					<Button id="HospitalFormSubmit" type="submit" style={{ display: "none" }}>
						{t("Submit")}
					</Button>
				</Box>
			</form>
		</ScrollArea>
	);
}
