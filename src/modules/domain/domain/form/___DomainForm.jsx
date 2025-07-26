import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Grid, Box, ScrollArea, Group, Stack, Checkbox, Tooltip, LoadingOverlay } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useHotkeys } from "@mantine/hooks";

import InputForm from "@components/form-builders/InputForm";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import SelectForm from "@components/form-builders/SelectForm";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import DrawerStickyFooter from "@components/drawers/DrawerStickyFooter";
import { DROPDOWNS } from "@/app/store/core/utilitySlice.js";

function ___DomainForm({
	form,
	type = "create",
	data,
	handleSubmit,
	businessModelId,
	setBusinessModelId,
	moduleChecked,
	setModuleChecked,
	productTypeChecked,
	setProductTypeChecked,
	productTypeCheckbox,
	isLoading,
	setIsLoading,
}) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 100; //TabList height 104

	const { data: businessModelDropdown } = useGlobalDropdownData({
		path: DROPDOWNS.BUSINESS_MODEL.PATH,
		utility: DROPDOWNS.BUSINESS_MODEL.UTILITY,
		params: {
			"dropdown-type": DROPDOWNS.BUSINESS_MODEL.TYPE,
		},
	});

	const { data: modulesData } = useGlobalDropdownData({
		path: DROPDOWNS.MODULE.PATH,
		utility: DROPDOWNS.MODULE.UTILITY,
		params: {
			"dropdown-type": DROPDOWNS.MODULE.TYPE,
		},
	});

	// =============== effect to handle form data population for update mode ================
	useEffect(() => {
		if (data && type === "update") {
			setIsLoading(true);
			form.setValues({
				business_model_id: data.business_model_id || "",
				company_name: data.company_name || "",
				mobile: data.mobile || "",
				alternative_mobile: data.alternative_mobile || "",
				name: data.name || "",
				address: data.address || "",
				email: data.email || "",
				username: data.username || "",
			});
			setBusinessModelId(data.business_model_id);

			const timeoutId = setTimeout(() => {
				setIsLoading(false);
			}, 500);
			return () => clearTimeout(timeoutId);
		} else {
			form.reset();
		}
	}, [data, type]);

	useHotkeys(
		[
			["alt+n", () => document.getElementById("company_name").focus()],
			["alt+r", () => form.reset()],
			["alt+s", () => document.getElementById("EntityFormSubmit").click()],
		],
		[]
	);

	return (
		<Box>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Grid columns={12} gutter={{ base: 8 }}>
					<Grid.Col span={12}>
						<Box bg="white" pos="relative">
							<LoadingOverlay
								visible={isLoading}
								zIndex={1000}
								overlayProps={{ radius: "sm", blur: 1 }}
							/>
							<Stack justify="space-between" px="xs" className="borderRadiusAll">
								<ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="hover" mb={16}>
									<Box>
										<Box mt={8}>
											<SelectForm
												tooltip={t("BusinessModel")}
												label={t("BusinessModel")}
												placeholder={t("ChooseBusinessModel")}
												required={true}
												nextField="company_name"
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
											<InputForm
												tooltip={t("CompanyStoreNameValidateMessage")}
												label={t("CompanyStoreName")}
												placeholder={t("CompanyStoreName")}
												required={true}
												nextField="mobile"
												name="company_name"
												form={form}
												mt={0}
												id="company_name"
											/>
										</Box>
										<Box mt="xs">
											<InputNumberForm
												tooltip={t("MobileValidateMessage")}
												label={t("Mobile")}
												placeholder={t("Mobile")}
												required={true}
												nextField="alternative_mobile"
												name="mobile"
												form={form}
												id="mobile"
											/>
										</Box>
										<Box mt="xs">
											<InputNumberForm
												tooltip={t("AlternativeMobileValidateMessage")}
												label={t("AlternativeMobile")}
												placeholder={t("AlternativeMobile")}
												required={false}
												nextField="email"
												name="alternative_mobile"
												form={form}
												mt={8}
												id="alternative_mobile"
											/>
										</Box>
										<Box mt="xs">
											<InputForm
												tooltip={t("InvalidEmail")}
												label={t("Email")}
												placeholder={t("Email")}
												required={true}
												nextField="name"
												name="email"
												form={form}
												mt={8}
												id="email"
											/>
										</Box>
										<Box mt="xs">
											<InputForm
												tooltip={t("ClientNameValidateMessage")}
												label={t("ClientName")}
												placeholder={t("ClientName")}
												required={true}
												nextField="username"
												name="name"
												form={form}
												id="name"
												mt={8}
											/>
										</Box>
										{type === "create" && (
											<Box mt="xs">
												<InputForm
													tooltip={t("DomainUserValidateMessage")}
													label={t("DomainUser")}
													placeholder={t("DomainUser")}
													required={true}
													nextField="address"
													name="username"
													form={form}
													mt={8}
													id="username"
												/>
											</Box>
										)}
										<Box mt="xs">
											<TextAreaForm
												tooltip={t("Address")}
												label={t("Address")}
												placeholder={t("Address")}
												required={false}
												nextField="isNotEmpty"
												name="address"
												form={form}
												mt={8}
												id="address"
											/>
										</Box>

										<Box mt="xs">
											<Checkbox.Group
												label={t("Modules")}
												description={t("selectModulesForAccess")}
												value={moduleChecked}
												onChange={setModuleChecked}
											>
												<Group mt="xs">
													<Stack>
														{modulesData.map((module, index) => (
															<Tooltip key={index} mt="8" label={t(module.label)}>
																<Checkbox value={module.slug} label={t(module.label)} />
															</Tooltip>
														))}
													</Stack>
												</Group>
											</Checkbox.Group>
										</Box>

										{/* =============== product type checkbox group for update mode ================ */}
										{type === "update" && productTypeCheckbox && (
											<Box mt="xs">
												<Checkbox.Group
													label={t("ProductType")}
													description={t("selectProductType")}
													value={productTypeChecked || []}
													onChange={setProductTypeChecked}
												>
													<Group mt="xs">
														<Stack>
															{productTypeCheckbox.map((type, index) => (
																<Tooltip key={index} mt="8" label={t(type.name)}>
																	<Checkbox
																		value={String(type.id)}
																		label={t(type.name)}
																	/>
																</Tooltip>
															))}
														</Stack>
													</Group>
												</Checkbox.Group>
											</Box>
										)}
									</Box>
								</ScrollArea>
								<DrawerStickyFooter type={type} />
							</Stack>
						</Box>
					</Grid.Col>
				</Grid>
			</form>
		</Box>
	);
}

export default ___DomainForm;
