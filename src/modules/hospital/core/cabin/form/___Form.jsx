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
import { HOSPITAL_DROPDOWNS, CORE_DROPDOWNS } from "@/app/store/core/utilitySlice.js";
import InputNumberForm from "@components/form-builders/InputNumberForm";

export default function ___Form({ form, type = "create", data, handleSubmit, setIndexData, isLoading, setIsLoading }) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 180; //TabList height 104

	const { data: getParticularPatientTypes } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.PARTICULAR_PATIENT_TYPE.PATH,
		params: { "dropdown-type": HOSPITAL_DROPDOWNS.PARTICULAR_PATIENT_TYPE.TYPE },
		utility: HOSPITAL_DROPDOWNS.PARTICULAR_PATIENT_TYPE.UTILITY,
	});

	const { data: getParticularPaymentModes } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.PARTICULAR_PAYMENT_MODE.PATH,
		params: { "dropdown-type": HOSPITAL_DROPDOWNS.PARTICULAR_PAYMENT_MODE.TYPE },
		utility: HOSPITAL_DROPDOWNS.PARTICULAR_PAYMENT_MODE.UTILITY,
	});

	const { data: getParticularCabinModes } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.PARTICULAR_CABIN_MODE.PATH,
		params: { "dropdown-type": HOSPITAL_DROPDOWNS.PARTICULAR_CABIN_MODE.TYPE },
		utility: HOSPITAL_DROPDOWNS.PARTICULAR_CABIN_MODE.UTILITY,
	});

	useEffect(() => {
		if (data && type === "update") {
			setIsLoading(true);
			form.setValues({
				patient_type_id: data?.particular_details?.patient_type_id,
				payment_mode_id: data?.particular_details?.payment_mode_id,
				cabin_mode_id: data?.particular_details?.cabin_mode_id,
				name: data.name,
				price: data.price,
			});
			setIndexData(data.id);
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
			["alt+n", () => document.getElementById("patient_mode_id").focus()],
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
									<Grid align="center" columns={20} mt="3xs">
										<Grid.Col span={6}>
											<Text fz="sm">
												{t("PatientType")} <RequiredAsterisk />
											</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												tooltip={t("PatientTypeValidateMessage")}
												placeholder={t("PatientType")}
												name="patient_type_id"
												id="patient_type_id"
												nextField="payment_mode_id"
												required={true}
												value={form.values.patient_type_id}
												dropdownValue={getParticularPatientTypes}
											/>
										</Grid.Col>
									</Grid>

									<Grid align="center" columns={20} mt="3xs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("PaymentMode")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												tooltip={t("PaymentModeValidateMessage")}
												placeholder={t("PaymentMode")}
												name="payment_mode_id"
												id="payment_mode_id"
												nextField="cabin_mode_id"
												value={form.values.payment_mode_id}
												dropdownValue={getParticularPaymentModes}
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="3xs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("CabinMode")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												tooltip={t("CabinModeValidateMessage")}
												placeholder={t("CabinMode")}
												name="cabin_mode_id"
												id="cabin_mode_id"
												nextField="name"
												value={form.values.cabin_mode_id}
												dropdownValue={getParticularCabinModes}
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="3xs">
										<Grid.Col span={6}>
											<Text fz="sm">
												{t("Name")} <RequiredAsterisk />
											</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<InputForm
												form={form}
												tooltip={t("NameValidateMessage")}
												placeholder={t("Name")}
												required={true}
												name="name"
												id="name"
												nextField="price"
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="3xs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("Price")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<InputNumberForm
												form={form}
												tooltip={t("PriceValidateMessage")}
												placeholder={t("Price")}
												required={false}
												name="price"
												id="price"
												nextField=""
											/>
										</Grid.Col>
									</Grid>
									<input type={"hidden"} value={"bed"} />
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
