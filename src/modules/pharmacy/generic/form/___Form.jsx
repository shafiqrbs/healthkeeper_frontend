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
import { PHARMACY_DROPDOWNS } from "@/app/store/core/utilitySlice";

export default function ___Form({ form, type = "create", data, handleSubmit, setIndexData, isLoading, setIsLoading }) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 180; //TabList height 104

	const { data: durationModeDropdown } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.PARTICULAR_MODE_MEDICINE_DURATION.PATH,
		utility: HOSPITAL_DROPDOWNS.PARTICULAR_MODE_MEDICINE_DURATION.UTILITY,
		params: { 'dropdown-type': "medicine-duration-mode" },
	});

	const { data: byMealDropdown } = useGlobalDropdownData({
		path: PHARMACY_DROPDOWNS.BY_MEAL.PATH,
		utility: PHARMACY_DROPDOWNS.BY_MEAL.UTILITY,
	});

	const { data: dosageDropdown } = useGlobalDropdownData({
		path: PHARMACY_DROPDOWNS.DOSAGE.PATH,
		utility: PHARMACY_DROPDOWNS.DOSAGE.UTILITY,
	});

	const { data: categoryDropdown } = useGlobalDropdownData({
		path: CORE_DROPDOWNS.CATEGORY.PATH,
		utility: CORE_DROPDOWNS.CATEGORY.UTILITY,
		params: { type: "stockable" },
	});

	useEffect(() => {
		if (data && type === "update") {
			setIsLoading(true);
			form.setValues({
				particular_type_master_id: data.particular_type_master_id,
				name: data.name,
				category_id: data.category_id,
				duration_mode_id: data.duration_mode_id,
				instruction: data.instruction,
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
			["alt+n", () => document.getElementById("particular_type_master_id").focus()],
			["alt+r", () => form.reset()],
			["alt+s", () => document.getElementById("EntityFormSubmit").click()],
		],
		[]
	);

	return (
		<form onSubmit={form.onSubmit(handleSubmit)}>
			<Grid columns={12} gutter={{ base: 8 }}>
				<Grid.Col span={12}>
					<Box bg="var(--mantine-color-white)" pos="relative" h={height}>
						<LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 1 }} />
						<Stack justify="space-between" className="drawer-form-stack-vertical">
							<ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="hover">
								<Stack>
									<Grid align="center" columns={20} mt="3xs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("Category")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												tooltip={t("CategoryValidateMessage")}
												placeholder={t("Category")}
												name="category_id"
												id="category_id"
												nextField="employee_id"
												value={form.values.category_id}
												dropdownValue={categoryDropdown}
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
												tooltip={form.errors.name}
												placeholder={t("Name")}
												required={false}
												name="name"
												id="name"
												nextField="medicine_dosage_id"
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="3xs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("Dosage")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												tooltip={t("MedicineDosageMessage")}
												placeholder={t("MedicineDosage")}
												name="medicine_dosage_id"
												id="medicine_dosage_id"
												nextField="name"
												value={form.values.medicine_dosage_id}
												dropdownValue={dosageDropdown}
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="3xs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("By-meal")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												tooltip={t("BymealValidateMessage")}
												placeholder={t("By-meal")}
												name="medicine_bymeal_id"
												id="medicine_bymeal_id"
												nextField="formulation"
												value={form.values.medicine_bymeal_id}
												dropdownValue={byMealDropdown}
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="3xs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("Formulation")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<InputForm
												form={form}
												tooltip={t("FormulationValidateMessage")}
												placeholder={t("Formulation")}
												required={false}
												name="formulation"
												id="formulation"
												nextField=""
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="3xs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("Duration")}</Text>
										</Grid.Col>
										<Grid.Col span={7}>
											<InputForm
												form={form}
												tooltip={t("DurationValidateMessage")}
												placeholder={t("Duration")}
												required={false}
												name="duration"
												id="duration"
												nextField="duration_mode_id"
											/>
										</Grid.Col>
										<Grid.Col span={7}>
											<SelectForm
												form={form}
												tooltip={t("DurationModeValidateMessage")}
												placeholder={t("DurationMode")}
												name="duration_mode_id"
												id="duration_mode_id"
												nextField="opd_quantity"
												value={form.values.duration_mode_id}
												dropdownValue={durationModeDropdown}
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="3xs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("OPDQuantity")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<InputForm
												form={form}
												tooltip={t("OPDQuantityValidateMessage")}
												placeholder={t("OPDQuantity")}
												required={false}
												name="opd_quantity"
												id="opd_quantity"
												nextField=""
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
