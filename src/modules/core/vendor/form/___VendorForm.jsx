import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {Grid, Box, ScrollArea, LoadingOverlay, Stack, Text} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useHotkeys, useMediaQuery } from "@mantine/hooks";

import InputForm from "@components/form-builders/InputForm";
import SelectForm from "@components/form-builders/SelectForm";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import PhoneNumber from "@components/form-builders/PhoneNumberInput";

import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import DrawerStickyFooter from "@components/drawers/DrawerStickyFooter";
import DatePickerForm from "@components/form-builders/DatePicker";

function ___VendorForm({
	form,
	type = "create",
	data,
	handleSubmit,
	customerData,
	setCustomerData,
	isLoading,
	setIsLoading,
}) {
	const { data: customerDropDownData } = useGlobalDropdownData({
		path: "core/select/customer",
		utility: "customer",
	});
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 180; //TabList height 104
	const matches = useMediaQuery("(max-width: 64em)");
	useEffect(() => {
		if (data && type === "update") {
			setIsLoading(true);
			form.setValues({
				company_name: data.company_name,
				name: data.name,
				mobile: data.mobile,
				email: data.email,
				customer_id: data.customer_id,
				address: data.address,
			});
			setCustomerData(data.customer_id);

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
						<Box bg="white" pos="relative" h={height}>
							<LoadingOverlay
								visible={isLoading}
								zIndex={1000}
								overlayProps={{ radius: "sm", blur: 1 }}
							/>
							<Stack justify="space-between" className="drawer-form-stack-vertical">
								<ScrollArea
									h={height}
									scrollbarSize={2}
									scrollbars="y"
									type="hover"
								>
									<Box >
										<Stack >
											<Grid align="center" columns={20}>
												<Grid.Col span={6}>
													<Text fz="sm">{t("CompanyName")}</Text>
												</Grid.Col>
												<Grid.Col span={14}>
													<InputForm
														tooltip={t("CompanyNameValidateMessage")}
														label=''
														placeholder={t("CompanyName")}
														required={true}
														nextField="name"
														form={form}
														name="company_name"
														mt={0}
														id="company_name"
													/>
												</Grid.Col>
											</Grid>
											<Grid align="center" columns={20}>
												<Grid.Col span={6}>
													<Text fz="sm">{t("VendorName")}</Text>
												</Grid.Col>
												<Grid.Col span={14}>
													<InputForm
														form={form}
														tooltip={t("VendorNameValidateMessage")}
														placeholder={t("VendorName")}
														required={true}
														name="name"
														id="name"
														nextField="mobile"
														mt={8}
													/>
												</Grid.Col>
											</Grid>
											<Grid align="center" columns={20}>
												<Grid.Col span={6}>
													<Text fz="sm">{t("VendorMobile")}</Text>
												</Grid.Col>
												<Grid.Col span={14}>
													<PhoneNumber
														form={form}
														tooltip={
															form.errors.mobile
																? form.errors.mobile
																: t("MobileValidateMessage")
														}
														placeholder={t("VendorMobile")}
														required={true}
														name="mobile"
														id="mobile"
														nextField="email"
														mt={8}
													/>
												</Grid.Col>
											</Grid>
											<Grid align="center" columns={20}>
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
														mt={8}
													/>
												</Grid.Col>
											</Grid>
											<Grid align="center" columns={20}>
												<Grid.Col span={20}>
													<TextAreaForm
														tooltip={t("AddressValidateMessage")}
														label={t("Address")}
														placeholder={t("Address")}
														required={false}
														nextField="EntityFormSubmit"
														name="address"
														form={form}
														mt={8}
														id="address"
													/>
												</Grid.Col>
											</Grid>

										</Stack>
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
export default ___VendorForm;
