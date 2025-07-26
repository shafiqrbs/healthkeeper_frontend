import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Grid, Box, ScrollArea, LoadingOverlay, Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useHotkeys } from "@mantine/hooks";

import InputForm from "@components/form-builders/InputForm";
import PhoneNumber from "@components/form-builders/PhoneNumberInput";

import DrawerStickyFooter from "@components/drawers/DrawerStickyFooter";
import RequiredAsterisk from "@components/form-builders/RequiredAsterisk";

export default function ___Form({
	form,
	type = "create",
	data,
	handleSubmit,
	setCustomerData,
	isLoading,
	setIsLoading,
}) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 180; //TabList height 104

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
		<form onSubmit={form.onSubmit(handleSubmit)}>
			<Grid columns={12} gutter={{ base: 8 }}>
				<Grid.Col span={12}>
					<Box bg="white" pos="relative" h={height}>
						<LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 1 }} />
						<Stack justify="space-between" className="drawer-form-stack-vertical">
							<ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="hover">
								<Stack>
									<Grid align="center" columns={20}>
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
												mt="xxxs"
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
										<Grid.Col span={6}>
											<Text fz="sm">
												{t("Designation")} <RequiredAsterisk />
											</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<InputForm
												form={form}
												tooltip={t("VendorNameValidateMessage")}
												placeholder={t("Designation")}
												required={true}
												name="name"
												id="name"
												nextField="mobile"
												mt="xxxs"
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20}>
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
												nextField="email"
												mt="xxxs"
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
												mt="xxxs"
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
