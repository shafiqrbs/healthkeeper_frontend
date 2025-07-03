import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
	Button,
	Flex,
	Grid,
	Box,
	ScrollArea,
	Text,
	Title,
	Stack,
	LoadingOverlay,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useHotkeys, useMediaQuery } from "@mantine/hooks";

import InputForm from "@components/form-builders/InputForm";
import SelectForm from "@components/form-builders/SelectForm";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import PhoneNumber from "@components/form-builders/PhoneNumberInput";

import useGlobalDropdownData from "@/common/hooks/dropdown/useGlobalDropdownData";

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
	const { isOnline, mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 100; //TabList height 104
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
						<Box bg="white" p={matches ? "0px" : "sm"} className="borderRadiusAll">
							<Box bg="white" pos="relative">
								<LoadingOverlay
									visible={isLoading}
									zIndex={1000}
									overlayProps={{ radius: "sm", blur: 1 }}
								/>
								<Box
									pl="xs"
									pr={8}
									py={6}
									mb={4}
									className="boxBackground borderRadiusAll"
								>
									<Grid>
										<Grid.Col span={6}>
											<Title order={6} pt={6}>
												{t(
													type === "create"
														? "CreateVendor"
														: "UpdateVendor"
												)}
											</Title>
										</Grid.Col>
										<Grid.Col span={6}>
											<Stack right align="flex-end">
												<>
													{isOnline && (
														<Button
															size="xs"
															className="btnPrimaryBg"
															type="submit"
															id="EntityFormSubmit"
															leftSection={
																<IconDeviceFloppy size={16} />
															}
														>
															<Flex direction="column" gap={0}>
																<Text fz={14} fw={400}>
																	{t(
																		type === "create"
																			? "CreateAndSave"
																			: "UpdateAndSave"
																	)}
																</Text>
															</Flex>
														</Button>
													)}
												</>
											</Stack>
										</Grid.Col>
									</Grid>
								</Box>
								<Box pl="xs" pr="xs" className="borderRadiusAll">
									<ScrollArea
										h={height}
										scrollbarSize={2}
										scrollbars="y"
										type="never"
									>
										<Box>
											<Box mt={8}>
												<InputForm
													tooltip={t("CompanyNameValidateMessage")}
													label={t("CompanyName")}
													placeholder={t("CompanyName")}
													required={true}
													nextField="name"
													form={form}
													name="company_name"
													mt={0}
													id="company_name"
												/>
											</Box>
											<Box mt="xs">
												<InputForm
													form={form}
													tooltip={t("VendorNameValidateMessage")}
													label={t("VendorName")}
													placeholder={t("VendorName")}
													required={true}
													name="name"
													id="name"
													nextField="mobile"
													mt={8}
												/>
											</Box>
											<Box mt="xs">
												<PhoneNumber
													form={form}
													tooltip={
														form.errors.mobile
															? form.errors.mobile
															: t("MobileValidateMessage")
													}
													label={t("VendorMobile")}
													placeholder={t("VendorMobile")}
													required={true}
													name="mobile"
													id="mobile"
													nextField="email"
													mt={8}
												/>
											</Box>
											<Box mt="xs">
												<InputForm
													form={form}
													tooltip={t("InvalidEmail")}
													label={t("Email")}
													placeholder={t("Email")}
													required={false}
													name="email"
													id="email"
													nextField="customer_id"
													mt={8}
												/>
											</Box>
											<Box mt="xs">
												<SelectForm
													tooltip={
														form.errors.customer_id
															? form.errors.customer_id
															: t("ChooseCustomer")
													}
													label={t("ChooseCustomer")}
													placeholder={t("ChooseCustomer")}
													required={false}
													nextField="address"
													name="customer_id"
													form={form}
													dropdownValue={customerDropDownData}
													mt={8}
													id="customer_id"
													searchable={true}
													value={customerData}
													changeValue={setCustomerData}
												/>
											</Box>
											<Box mt="xs">
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
											</Box>
										</Box>
									</ScrollArea>
								</Box>
							</Box>
						</Box>
					</Grid.Col>
				</Grid>
			</form>
		</Box>
	);
}
export default ___VendorForm;
