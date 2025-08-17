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
import { HOSPITAL_DROPDOWNS,CORE_DROPDOWNS } from "@/app/store/core/utilitySlice.js";

export default function ___Form({ form, type = "create", data, handleSubmit, setIndexData, isLoading, setIsLoading }) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 180; //TabList height 104

	const { data: employeeDropdown } = useGlobalDropdownData({
		path: CORE_DROPDOWNS.EMPLOYEE.PATH,
		utility: CORE_DROPDOWNS.EMPLOYEE.UTILITY,
	});

	const { data: categoryDropdown } = useGlobalDropdownData({
		path: CORE_DROPDOWNS.CATEGORY.PATH,
		utility: CORE_DROPDOWNS.CATEGORY.UTILITY,
	});

	const { data: particularTypeDropdown } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.PARTICULAR_TYPE.PATH,
		utility: HOSPITAL_DROPDOWNS.PARTICULAR_TYPE.UTILITY,
	});

	const { data: particularModes } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.PARTICULAR_MODE.PATH,
		params: { "dropdown-type": HOSPITAL_DROPDOWNS.PARTICULAR_MODE.TYPE },
		utility: HOSPITAL_DROPDOWNS.PARTICULAR_MODE.UTILITY,
	});

	const { data: getParticularReportModes } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.PARTICULAR_REPORT_MODE.PATH,
		params: { "dropdown-type": HOSPITAL_DROPDOWNS.PARTICULAR_REPORT_MODE.TYPE },
		utility: HOSPITAL_DROPDOWNS.PARTICULAR_REPORT_MODE.UTILITY,
	});

	console.log(getParticularReportModes)

	useEffect(() => {
		if (data && type === "update") {
			setIsLoading(true);
			form.setValues({
				particular_type_id: data.particular_type_id,
				name: data.name,
				category_id: data.category_id,
				employee_id: data.employee_id,
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
			["alt+n", () => document.getElementById("particular_type_id").focus()],
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
											<Text fz="sm">{t("BedMode")} <RequiredAsterisk /></Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												tooltip={t("ParticularTypeValidateMessage")}
												placeholder={t("ParticularType")}
												name="particular_type_id"
												id="particular_type_id"
												nextField="category_id"
												required={true}
												value={form.values.particular_type_id}
												dropdownValue={getParticularReportModes}
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="xxxs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("WARD")} <RequiredAsterisk /></Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												tooltip={t("ParticularTypeValidateMessage")}
												placeholder={t("ParticularType")}
												name="particular_type_id"
												id="particular_type_id"
												nextField="category_id"
												required={true}
												value={form.values.particular_type_id}
												dropdownValue={particularTypeDropdown}
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="xxxs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("Unit")}</Text>
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
									<Grid align="center" columns={20} mt="xxxs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("AssignEmployee")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												tooltip={t("AssignEmployeeValidateMessage")}
												placeholder={t("AssignEmployee")}
												name="employee_id"
												id="employee_id"
												nextField="name"
												value={form.values.employee_id}
												dropdownValue={employeeDropdown}
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="xxxs">
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
												required={false}
												name="name"
												id="name"
												nextField="instruction"
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="xxxs">
										<Grid.Col span={6}>
											<Text fz="sm">
												{t("Instruction")}
											</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<InputForm
												form={form}
												tooltip={t("PriceValidateMessage")}
												placeholder={t("Instruction")}
												required={false}
												name="instruction"
												id="instruction"
												nextField=""
											/>
										</Grid.Col>
									</Grid>
									<input type={"hidden"} value={'bed'} />
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
