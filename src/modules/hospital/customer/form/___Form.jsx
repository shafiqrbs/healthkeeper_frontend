import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Grid, Box, ScrollArea, LoadingOverlay, Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useHotkeys } from "@mantine/hooks";

import InputForm from "@components/form-builders/InputForm";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import PhoneNumber from "@components/form-builders/PhoneNumberInput";

import DrawerStickyFooter from "@components/drawers/DrawerStickyFooter";
import RequiredAsterisk from "@components/form-builders/RequiredAsterisk";
import SelectForm from "@components/form-builders/SelectForm";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import { CORE_DROPDOWNS } from "@/app/store/core/utilitySlice.js";

export default function ___Form({ form, type = "create", data, handleSubmit, setIndexData, isLoading, setIsLoading }) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 180; //TabList height 104

	const { data: customerGroupDropdown } = useGlobalDropdownData({
		path: CORE_DROPDOWNS.CUSTOMER_GROUP.PATH,
		params: { "dropdown-type": CORE_DROPDOWNS.CUSTOMER_GROUP.TYPE },
		utility: CORE_DROPDOWNS.CUSTOMER_GROUP.UTILITY,
	});

	const { data: locationDropdown } = useGlobalDropdownData({
		path: CORE_DROPDOWNS.LOCATION.PATH,
		params: { "dropdown-type": CORE_DROPDOWNS.LOCATION.TYPE },
		utility: CORE_DROPDOWNS.LOCATION.UTILITY,
	});

	const { data: executiveDropdown } = useGlobalDropdownData({
		path: CORE_DROPDOWNS.MARKETING_EXECUTIVE.PATH,
		params: { "dropdown-type": CORE_DROPDOWNS.MARKETING_EXECUTIVE.TYPE },
		utility: CORE_DROPDOWNS.MARKETING_EXECUTIVE.UTILITY,
	});

	useEffect(() => {
		if (data && type === "update") {
			setIsLoading(true);
			form.setValues({
				customer_group_id: data.customer_group_id,
				name: data.name,
				mobile: data.mobile,
				email: data.email,
				customer_id: data.customer_id,
				address: data.address,
				credit_limit: data.credit_limit,
				alternative_mobile: data.alternative_mobile,
				location_id: data.location_id,
				marketing_id: data.marketing_id,
				discount_percent: data.discount_percent,
			});
			setIndexData(data.customer_id);

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
		<form onSubmit={form.onSubmit(handleSubmit)}>
			<Grid columns={12} gutter={{ base: 8 }}>
				<Grid.Col span={12}>
					<Box bg="white" pos="relative" h={height}>
						<LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 1 }} />
						<Stack justify="space-between" className="drawer-form-stack-vertical">
							<ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="hover">
								<Stack>
									<Grid align="center" columns={20} mt="xxxs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("CustomerGroup")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												tooltip={t("CustomerGroupValidateMessage")}
												placeholder={t("CustomerGroup")}
												name="customer_group"
												id="customer_group"
												nextField="name"
												value={form.values.customer_group}
												dropdownValue={customerGroupDropdown}
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="xxxs">
										<Grid.Col span={6}>
											<Text fz="sm">
												{t("UserName")} <RequiredAsterisk />
											</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<InputForm
												form={form}
												tooltip={t("VendorNameValidateMessage")}
												placeholder={t("UserName")}
												required={true}
												name="name"
												id="name"
												nextField="mobile"
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="xxxs">
										<Grid.Col span={6}>
											<Text fz="sm">
												{t("Mobile")} <RequiredAsterisk />
											</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<PhoneNumber
												form={form}
												tooltip={
													form.errors.mobile ? form.errors.mobile : t("MobileValidateMessage")
												}
												placeholder={t("VendorMobile")}
												required={true}
												name="mobile"
												id="mobile"
												nextField="alternative_mobile"
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="xxxs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("AlternativeMobile")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<PhoneNumber
												form={form}
												tooltip={
													form.errors.mobile ? form.errors.mobile : t("MobileValidateMessage")
												}
												placeholder={t("VendorMobile")}
												name="alternative_mobile"
												id="alternative_mobile"
												nextField="email"
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="xxxs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("Email")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<InputForm
												form={form}
												tooltip={t("InvalidEmail")}
												placeholder={t("Email")}
												required={false}
												name="email"
												id="email"
												nextField="customer_id"
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="xxxs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("CreditLimit")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<InputForm
												tooltip={t("CreditLimit")}
												placeholder={t("CreditLimit")}
												required={false}
												nextField={"OLDReferenceNo"}
												name={"credit_limit"}
												form={form}
												mt={8}
												id={"CreditLimit"}
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="xxxs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("OLDReferenceNo")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<InputForm
												tooltip={t("OLDReferenceNo")}
												placeholder={t("OLDReferenceNo")}
												required={false}
												nextField={"Mobile"}
												name={"reference_id"}
												form={form}
												mt={8}
												id={"OLDReferenceNo"}
											/>
										</Grid.Col>
									</Grid>

									<Grid align="center" columns={20} mt="xxxs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("AlternativeMobile")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<InputForm
												tooltip={t("AlternativeMobile")}
												placeholder={t("AlternativeMobile")}
												required={false}
												nextField={"Email"}
												name={"alternative_mobile"}
												form={form}
												mt={8}
												id={"AlternativeMobile"}
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="xxxs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("Location")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												tooltip={t("Location")}
												placeholder={t("ChooseLocation")}
												required={false}
												nextField={"MarketingExecutive"}
												name={"location_id"}
												form={form}
												dropdownValue={locationDropdown}
												mt={8}
												id={"Location"}
												searchable={false}
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="xxxs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("MarketingExecutive")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												tooltip={t("MarketingExecutive")}
												placeholder={t("ChooseMarketingExecutive")}
												required={false}
												nextField={"Address"}
												name={"marketing_id"}
												form={form}
												dropdownValue={executiveDropdown}
												mt={8}
												id={"MarketingExecutive"}
												searchable={true}
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="xxxs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("Address")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<TextAreaForm
												tooltip={t("Address")}
												placeholder={t("Address")}
												required={false}
												nextField={"Status"}
												name={"address"}
												form={form}
												mt={8}
												id={"Address"}
											/>
										</Grid.Col>
									</Grid>
								</Stack>
							</ScrollArea>
							<DrawerStickyFooter type={type} />
						</Stack>
					</Box>
				</Grid.Col>
			</Grid>
		</form>
	);
}
