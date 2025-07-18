import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Button, Flex, Grid, Group, Box, ScrollArea, Text, Title, Stack, LoadingOverlay, rem } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconCheck, IconDeviceFloppy, IconRestore } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch } from "react-redux";
import Shortcut from "@modules/shortcut/Shortcut";
import InputForm from "@components/form-builders/InputForm.jsx";
import SelectForm from "@components/form-builders/SelectForm.jsx";
import TextAreaForm from "@components/form-builders/TextAreaForm.jsx";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData.js";
import SwitchForm from "@components/form-builders/SwitchForm.jsx";
import ImageUploadDropzone from "@components/form-builders/ImageUploadDropzone.jsx";
import InputNumberForm from "@components/form-builders/InputNumberForm.jsx";
import { showEntityData } from "@/app/store/core/crudThunk.js";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent.jsx";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

// Reusable Components
const SectionHeader = ({ title, classNames = "pt-4", isTopBar = false }) => (
	<Box mt={isTopBar ? 0 : 8} className="config-form-header-box boxBackground borderRadiusAll">
		<Title order={6} className={classNames}>
			{title}
		</Title>
	</Box>
);

const SwitchWithLabel = ({
	tooltip,
	label,
	nextField,
	name,
	form,
	id,
	configData,
	classNames = "pt-4",
	mt = "xs",
	mb,
	gridGutter = { base: 1 },
	gridColumns = 6,
}) => (
	<Box mt={mt} mb={mb}>
		<Grid gutter={gridGutter}>
			<Grid.Col span={2}>
				<SwitchForm
					tooltip={tooltip}
					label=""
					nextField={nextField}
					name={name}
					form={form}
					color="var(--theme-error-color)"
					id={id}
					position="left"
					defaultChecked={configData?.[name]}
				/>
			</Grid.Col>
			<Grid.Col span={gridColumns} fz="sm" className={classNames}>
				{label}
			</Grid.Col>
		</Grid>
	</Box>
);

const InputWithSwitch = ({ inputProps, switchProps, configData, mt = "md", mb = "md" }) => (
	<Box mt={mt} mb={mb}>
		<Grid gutter={{ base: 6 }}>
			<Grid.Col span={6}>
				<InputForm {...inputProps} form={inputProps.form} mt={0} />
			</Grid.Col>
			<Grid.Col span={6} mt="lg">
				<Box mt="xs">
					<Grid columns={6} gutter={{ base: 1 }}>
						<Grid.Col span={2}>
							<SwitchForm
								{...switchProps}
								form={switchProps.form}
								showLabel={false}
								color="var(--theme-error-color)"
								position="left"
								defaultChecked={configData?.[switchProps.name]}
							/>
						</Grid.Col>
						<Grid.Col span={4} fz="sm" className="pt-4">
							{switchProps.label}
						</Grid.Col>
					</Grid>
				</Box>
			</Grid.Col>
		</Grid>
	</Box>
);

const FormSection = ({ title, children, height }) => (
	<Box bg="white" p="xs" className="borderRadiusAll">
		<Box bg="white">
			<SectionHeader title={title} isTopBar />
			<Box px="xs" className="borderRadiusAll">
				<ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
					<Box>{children}</Box>
				</ScrollArea>
			</Box>
		</Box>
	</Box>
);

function ConfigurationForm({
	form,
	handleSubmit,
	saveCreateLoading,
	configData,
	setConfigData,
	setConfigFetching,
	setFormDataForUpdate,
	posInvoiceModeId,
	setPosInvoiceModeId,
	files,
	setFiles,
}) {
	const { id } = useParams();
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [formLoad, setFormLoad] = useState(true);
	const [countryId, setCountryId] = useState(configData?.country_id?.toString() || "");
	const [businessModelId, setBusinessModelId] = useState(configData?.business_model_id?.toString() || "");
	const [currencyId, setCurrencyId] = useState(configData?.currency_id?.toString() || "");

	const { data: posInvoiceModeDropdown } = useGlobalDropdownData({
		path: "utility/select/setting",
		params: { "dropdown-type": "pos-invoice-mode" },
		utility: "posInvoiceMode",
	});

	const { isOnline, mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 100; //TabList height 104

	const { data: businessModelDropdown } = useGlobalDropdownData({
		path: "utility/select/setting",
		utility: "businessModel",
		params: { "dropdown-type": "business-model" },
	});

	const { data: countryDropdown } = useGlobalDropdownData({
		path: "core/select/countries",
		utility: "country",
	});

	const { data: currencyDropdown } = useGlobalDropdownData({
		path: "utility/select/currencies",
		utility: "currency",
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				setFormLoad(true);
				const result = await dispatch(
					showEntityData({ url: `inventory/config/${id}`, module: "config" })
				).unwrap();
				if (result?.data?.status === 200) {
					setConfigData(result?.data?.data);
					form.setValues(result?.data?.data);

					setCountryId(result?.data?.data?.country_id?.toString() || "");
					setBusinessModelId(result?.data?.data?.business_model_id?.toString() || "");
					setPosInvoiceModeId(result?.data?.data?.pos_invoice_mode_id?.toString() || "");
					setCurrencyId(result?.data?.data?.currency_id?.toString() || "");
				}
			} catch (error) {
				showNotificationComponent(t("FailedToFetchData"), "red", null, false, 1000);
			} finally {
				setFormLoad(false);
			}
		};

		fetchData();
	}, [dispatch, id]);

	useEffect(() => {
		setFormLoad(true);
		setFormDataForUpdate(true);
	}, [dispatch]);

	useHotkeys(
		[
			[
				"alt+n",
				() => {
					document.getElementById("BusinessModel").click();
				},
			],
			[
				"alt+r",
				() => {
					form.reset();
				},
			],
			[
				"alt+s",
				() => {
					document.getElementById("EntityFormSubmit").click();
				},
			],
		],
		[]
	);

	const handleRestore = () => {
		modals.openConfirmModal({
			title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
			labels: {
				confirm: "Confirm",
				cancel: "Cancel",
			},
			confirmProps: {
				color: "var(--theme-error-color)",
			},
			onCancel: () => console.log("Cancel"),
			onConfirm: () => {
				dispatch(
					showEntityData({
						url: `domain/restore/${configData.domain_id}`,
						module: "config",
					})
				);
				setConfigFetching(true);
				notifications.show({
					color: "var(--theme-success-color)",
					title: t("Restore"),
					icon: (
						<IconCheck
							style={{
								width: rem(18),
								height: rem(18),
							}}
						/>
					),
					loading: false,
					autoClose: 700,
					style: {
						backgroundColor: "var(--theme-tertiary-color-1)",
					},
				});
			},
		});
	};

	// Configuration data for switches
	const switchConfigs = {
		core: [
			{ name: "sku_warehouse", label: t("Warehouse"), nextField: "sku_category" },
			{ name: "sku_category", label: t("Category"), nextField: "vat_percent" },
		],
		pos: [
			{ name: "pos_print", label: t("PosPrint"), nextField: "is_print_header" },
			{ name: "is_pay_first", label: t("PosPayFirst"), nextField: "is_pos" },
			{ name: "is_pos", label: t("PosEnable"), nextField: "is_kitchen" },
			{ name: "is_kitchen", label: t("KitchenEnable"), nextField: "custom_invoice" },
		],
		print: [
			{
				name: "custom_invoice_print",
				label: t("CustomInvoicePrint"),
				nextField: "is_stock_history",
			},
			{ name: "invoice_print_logo", label: t("PrintLogo"), nextField: "print_outstanding" },
			{ name: "print_outstanding", label: t("PrintWithOutstanding"), nextField: "pos_print" },
			{ name: "is_print_header", label: t("PrintHeader"), nextField: "is_invoice_title" },
			{
				name: "is_invoice_title",
				label: t("PrintInvoiceTitle"),
				nextField: "is_print_footer",
			},
			{ name: "is_print_footer", label: t("PrintFooter"), nextField: "is_powered" },
			{ name: "is_powered", label: t("PrintPowered"), nextField: "pos_invoice_mode_id" },
		],
		config: [
			{ name: "custom_invoice", label: t("CustomInvoice"), nextField: "bonus_from_stock" },
			{
				name: "is_sales_auto_approved",
				label: t("SalesAutoApproved"),
				nextField: "is_purchase_auto_approved",
			},
			{
				name: "due_sales_without_customer",
				label: t("DueSalesWithoutCustomer"),
				nextField: "is_zero_receive_allow",
			},
			{ name: "sales_return", label: t("SalesReturn"), nextField: "sr_commission" },
			{
				name: "is_purchase_auto_approved",
				label: t("PurchaseAutoApproved"),
				nextField: "is_pay_first",
			},
			{ name: "is_unit_price", label: t("IsUnitPrice"), nextField: "is_description" },
			{
				name: "is_zero_receive_allow",
				label: t("ZeroReceiveAllow"),
				nextField: "is_purchase_by_purchase_price",
			},
			{
				name: "is_purchase_by_purchase_price",
				label: t("PurchaseByPurchasePrice"),
				nextField: "is_active_sms",
			},
		],
		product: [
			{ name: "is_description", label: t("IsDescription"), nextField: "zero_stock" },
			{ name: "zero_stock", label: t("ZeroStockAllowed"), nextField: "stock_item" },
			{ name: "stock_item", label: t("StockItem"), nextField: "custom_invoice_print" },
			{ name: "bonus_from_stock", label: t("BonusFromStock"), nextField: "is_unit_price" },
			{ name: "is_stock_history", label: t("StockHistory"), nextField: "condition_sales" },
		],
		others: [
			{ name: "condition_sales", label: t("ConditionSales"), nextField: "store_ledger" },
			{ name: "store_ledger", label: t("StoreLedger"), nextField: "is_marketing_executive" },
			{
				name: "is_marketing_executive",
				label: t("MarketingExecutive"),
				nextField: "fuel_station",
			},
			{ name: "tlo_commission", label: t("TloCommision"), nextField: "sales_return" },
			{
				name: "sr_commission",
				label: t("SRCommision"),
				nextField: "due_sales_without_customer",
			},
			{ name: "is_active_sms", label: t("isActiveSms"), nextField: "EntityFormSubmit" },
		],
	};

	// Tax input configurations
	const taxInputs = [
		{
			input: {
				tooltip: t("VatPercent"),
				label: t("VatPercent"),
				placeholder: t("VatPercent"),
				name: "vat_percent",
				nextField: "vat_enable",
			},
			switch: {
				tooltip: t("VatEnabled"),
				label: t("VatEnabled"),
				nextField: "sd_percent",
				name: "vat_enable",
			},
		},
		{
			input: {
				tooltip: t("SdPercent"),
				label: t("SdPercent"),
				placeholder: t("SdPercent"),
				name: "sd_percent",
				nextField: "sd_enable",
			},
			switch: {
				tooltip: t("SdEnabled"),
				label: t("SDEnabled"),
				nextField: "ait_percent",
				name: "sd_enable",
			},
		},
		{
			input: {
				tooltip: t("AitPercent"),
				label: t("AitPercent"),
				placeholder: t("AitPercent"),
				name: "ait_percent",
				nextField: "ait_enable",
			},
			switch: {
				tooltip: t("AitEnabled"),
				label: t("AITEnabled"),
				nextField: "zakat_percent",
				name: "ait_enable",
			},
		},
		{
			input: {
				tooltip: t("ZakatPercent"),
				label: t("ZakatPercent"),
				placeholder: t("ZakatPercent"),
				name: "zakat_percent",
				nextField: "zakat_enable",
			},
			switch: {
				tooltip: t("ZakatEnabled"),
				label: t("ZakatEnabled"),
				nextField: "invoice_comment",
				name: "zakat_enable",
			},
		},
	];

	return (
		<Box style={{ position: "relative" }}>
			<LoadingOverlay
				visible={formLoad}
				overlayProps={{ radius: "sm", blur: 2 }}
				zIndex={1000}
				loaderProps={{ color: "var(--theme-error-color)" }}
			/>
			{configData && (
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Grid columns={24} gutter={{ base: 8 }}>
						<Grid.Col span={7}>
							<FormSection title={t("Core")} height={height}>
								<Box mt="xs">
									<SelectForm
										tooltip={t("BusinessModel")}
										label={t("BusinessModel")}
										placeholder={t("ChooseBusinessModel")}
										required={true}
										nextField="country_id"
										name="business_model_id"
										form={form}
										dropdownValue={businessModelDropdown}
										mt={8}
										id="business_model_id"
										searchable={false}
										value={businessModelId}
										changeValue={setBusinessModelId}
										clearable={false}
										allowDeselect={false}
									/>
								</Box>
								<Box mt="xs">
									<SelectForm
										tooltip={t("ChooseCountry")}
										label={t("Country")}
										placeholder={t("ChooseCountry")}
										required={true}
										nextField="currency_id"
										name="country_id"
										form={form}
										dropdownValue={countryDropdown}
										mt="xxxs"
										id="country_id"
										searchable={true}
										value={countryId}
										changeValue={setCountryId}
										clearable={false}
										allowDeselect={false}
									/>
								</Box>
								<Box mt="xs">
									<SelectForm
										tooltip={t("ChooseCurrency")}
										label={t("Currency")}
										placeholder={t("ChooseCurrency")}
										required={true}
										nextField="address"
										name="currency_id"
										form={form}
										dropdownValue={currencyDropdown}
										mt="xxxs"
										id="currency_id"
										searchable={true}
										value={currencyId}
										changeValue={setCurrencyId}
										clearable={false}
										allowDeselect={false}
									/>
								</Box>
								<Box mt="xs">
									<TextAreaForm
										tooltip={t("Address")}
										label={t("Address")}
										placeholder={t("Address")}
										required={false}
										nextField="sku_warehouse"
										name="address"
										form={form}
										mt="xxxs"
										id="address"
									/>
								</Box>

								<SectionHeader title={t("StockFormat")} />
								{switchConfigs.core.map((config) => (
									<SwitchWithLabel
										key={config.name}
										tooltip={t(config.label)}
										label={t(config.label)}
										nextField={config.nextField}
										name={config.name}
										form={form}
										id={config.name}
										configData={configData}
									/>
								))}

								<SectionHeader title={t("VatManagement")} />
								<Box my="md">
									<Grid gutter={{ base: 6 }}>
										<Grid.Col span={6}>&nbsp;</Grid.Col>
										<Grid.Col span={2}>
											<SwitchForm
												tooltip={t("VatEnabled")}
												label=""
												nextField="vat_percent"
												name="hs_code_enable"
												form={form}
												color="var(--theme-error-color)"
												id="hs_code_enable"
												position="left"
												defaultChecked={configData?.hs_code_enable}
											/>
										</Grid.Col>
										<Grid.Col span={4} fz="sm" className="pt-4">
											{t("HSCodeEnabled")}
										</Grid.Col>
									</Grid>
								</Box>

								{taxInputs.map((taxConfig, index) => (
									<InputWithSwitch
										key={taxConfig.input.name}
										inputProps={{ ...taxConfig.input, form }}
										switchProps={{ ...taxConfig.switch, form }}
										configData={configData}
									/>
								))}

								<SectionHeader title={t("CompanyLogo")} />
								<Box mt="xs">
									<ImageUploadDropzone
										label={t("Logo")}
										id="logo"
										name="logo"
										form={form}
										required={false}
										placeholder={t("DropLogoHere")}
										nextField="remove_image"
										files={files}
										setFiles={setFiles}
										existsFile={
											import.meta.env.VITE_IMAGE_GATEWAY_URL +
											"uploads/inventory/logo/" +
											configData?.path
										}
									/>
								</Box>
								<SwitchWithLabel
									tooltip={t("RemoveImage")}
									label={t("RemoveImage")}
									nextField="invoice_print_logo"
									name="remove_image"
									form={form}
									id="remove_image"
									configData={configData}
									my="xs"
								/>
							</FormSection>
						</Grid.Col>

						<Grid.Col span={8}>
							<FormSection title={t("ManagePos&Print")} height={height}>
								<Box mt="xs">
									<SelectForm
										tooltip={t("PosInvoiceMode")}
										label={t("PosInvoiceMode")}
										placeholder={t("ChoosePosInvoiceMode")}
										required={false}
										nextField="print_footer_text"
										name="pos_invoice_mode_id"
										form={form}
										dropdownValue={posInvoiceModeDropdown}
										mt="xxxs"
										id="pos_invoice_mode_id"
										searchable={false}
										value={posInvoiceModeId}
										changeValue={setPosInvoiceModeId}
										clearable={true}
										allowDeselect={true}
									/>
								</Box>
								<Box mt="xs">
									<TextAreaForm
										tooltip={t("InvoiceComment")}
										label={t("InvoiceComment")}
										placeholder={t("InvoiceComment")}
										required={false}
										nextField="logo"
										name="invoice_comment"
										form={form}
										mt="xxxs"
										id="invoice_comment"
									/>
								</Box>

								{switchConfigs.pos.map((config) => (
									<SwitchWithLabel
										key={config.name}
										tooltip={t(config.label)}
										label={t(config.label)}
										nextField={config.nextField}
										name={config.name}
										form={form}
										id={config.name}
										configData={configData}
									/>
								))}

								<SectionHeader title={t("PrintSetup")} />
								{switchConfigs.print.map((config) => (
									<SwitchWithLabel
										key={config.name}
										tooltip={t(config.label)}
										label={t(config.label)}
										nextField={config.nextField}
										name={config.name}
										form={form}
										id={config.name}
										configData={configData}
									/>
								))}

								<Box mt="xs">
									<TextAreaForm
										tooltip={t("PrintFooterText")}
										label={t("PrintFooterText")}
										placeholder={t("EnterPrintFooterText")}
										required={false}
										nextField="body_font_size"
										name="print_footer_text"
										form={form}
										mt="xxxs"
										id="print_footer_text"
									/>
								</Box>

								<Grid columns={12} gutter={{ base: 8 }}>
									<Grid.Col span={6}>
										<Box mt="xs">
											<InputNumberForm
												tooltip={t("BodyFontSize")}
												label={t("BodyFontSize")}
												placeholder={t("BodyFontSize")}
												required={false}
												nextField="invoice_height"
												name="body_font_size"
												form={form}
												mt={0}
												id="body_font_size"
											/>
										</Box>
									</Grid.Col>
									<Grid.Col span={6}>
										<Box mt="xs">
											<InputNumberForm
												tooltip={t("InvoiceHeight")}
												label={t("InvoiceHeight")}
												placeholder={t("InvoiceHeight")}
												required={false}
												nextField="invoice_width"
												name="invoice_height"
												form={form}
												mt={0}
												id="invoice_height"
											/>
										</Box>
									</Grid.Col>
								</Grid>
								<Grid columns={12} gutter={{ base: 8 }}>
									<Grid.Col span={6}>
										<Box mt="xs">
											<InputNumberForm
												tooltip={t("InvoiceWidth")}
												label={t("InvoiceWidth")}
												placeholder={t("InvoiceWidth")}
												required={false}
												nextField="border_color"
												name="invoice_width"
												form={form}
												mt={0}
												id="invoice_width"
											/>
										</Box>
									</Grid.Col>
									<Grid.Col span={6}>
										<Box mt="xs">
											<InputForm
												tooltip={t("BodyBorderColor")}
												label={t("BodyBorderColor")}
												placeholder={t("BodyBorderColor")}
												required={false}
												nextField="border_width"
												name="border_color"
												form={form}
												mt={0}
												id="border_color"
											/>
										</Box>
									</Grid.Col>
								</Grid>
								<Grid columns={12} gutter={{ base: 8 }}>
									<Grid.Col span={6}>
										<Box mt="xs">
											<InputNumberForm
												tooltip={t("BodyBorderWidth")}
												label={t("BodyBorderWidth")}
												placeholder={t("BodyBorderWidth")}
												required={false}
												nextField="print_left_margin"
												name="border_width"
												form={form}
												mt={0}
												id="border_width"
											/>
										</Box>
									</Grid.Col>
									<Grid.Col span={6}>
										<Box mt="xs">
											<InputNumberForm
												tooltip={t("MarginLeft")}
												label={t("MarginLeft")}
												placeholder={t("MarginLeft")}
												required={false}
												nextField="print_top_margin"
												name="print_left_margin"
												form={form}
												mt={0}
												id="print_left_margin"
											/>
										</Box>
									</Grid.Col>
								</Grid>
								<Grid columns={12} gutter={{ base: 8 }} mb="xs">
									<Grid.Col span={6}>
										<Box mt="xs">
											<InputNumberForm
												tooltip={t("MarginTop")}
												label={t("MarginTop")}
												placeholder={t("MarginTop")}
												required={false}
												nextField="custom_invoice"
												name="print_top_margin"
												form={form}
												mt={0}
												id="print_top_margin"
											/>
										</Box>
									</Grid.Col>
								</Grid>
							</FormSection>
						</Grid.Col>

						<Grid.Col span={8}>
							<Box bg="white" className="borderRadiusAll">
								<Box bg="white">
									<Box
										m="xs"
										className="config-form-header-box boxBackground borderRadiusAll"
										mb="es"
										pb="es"
									>
										<Grid>
											<Grid.Col span={6}>
												<Title order={6} className="pt-4">
													{t("ManageConfiguration")}
												</Title>
											</Grid.Col>
											<Grid.Col span={6}>
												{isOnline && (
													<Flex gap={8} justify="flex-end" mb="les">
														<Button
															size="xs"
															className="btnPrimaryBg"
															type="submit"
															id="EntityFormSubmit"
															loading={saveCreateLoading}
															leftSection={<IconDeviceFloppy size={16} />}
														>
															<Flex direction="column" gap={0}>
																<Text fz="sm" fw={400}>
																	{t("Save")}
																</Text>
															</Flex>
														</Button>
														<Button
															size="xs"
															className={"btnPrimaryBgOutline"}
															onClick={handleRestore}
															id="EntityFormSubmit"
															disabled={saveCreateLoading}
															leftSection={<IconRestore size={16} />}
														>
															<Flex direction="column" gap={0}>
																<Text fz="sm" fw={400}>
																	{t("Restore")}
																</Text>
															</Flex>
														</Button>
													</Flex>
												)}
											</Grid.Col>
										</Grid>
									</Box>
									<Box px="xs" className="borderRadiusAll mx-10">
										<ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
											<Box pt="xs">
												{switchConfigs.config.map((config) => (
													<SwitchWithLabel
														key={config.name}
														tooltip={t(config.label)}
														label={t(config.label)}
														nextField={config.nextField}
														name={config.name}
														form={form}
														id={config.name}
														configData={configData}
														pt="es"
													/>
												))}

												<SectionHeader title={t("ManageProduct")} pt="es" />
												{switchConfigs.product.map((config) => (
													<SwitchWithLabel
														key={config.name}
														tooltip={t(config.label)}
														label={t(config.label)}
														nextField={config.nextField}
														name={config.name}
														form={form}
														id={config.name}
														configData={configData}
													/>
												))}

												<SectionHeader title={t("ManageOthers")} pt="es" />
												{switchConfigs.others.map((config) => (
													<SwitchWithLabel
														key={config.name}
														tooltip={t(config.label)}
														label={t(config.label)}
														nextField={config.nextField}
														name={config.name}
														form={form}
														id={config.name}
														configData={configData}
														mb={config.name === "is_active_sms" ? "xs" : undefined}
													/>
												))}
											</Box>
										</ScrollArea>
									</Box>
								</Box>
							</Box>
						</Grid.Col>

						<Grid.Col span={1}>
							<Box bg="white" className="borderRadiusAll" pt="md">
								<Shortcut form={form} FormSubmit="EntityFormSubmit" Name="name" inputType="select" />
							</Box>
						</Grid.Col>
					</Grid>
				</form>
			)}
		</Box>
	);
}

export default ConfigurationForm;
