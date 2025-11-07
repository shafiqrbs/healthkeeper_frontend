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
		path: HOSPITAL_DROPDOWNS.PARTICULAR_MASTER_TYPE.PATH,
		utility: HOSPITAL_DROPDOWNS.PARTICULAR_MASTER_TYPE.UTILITY,
	});

	useEffect(() => {
		if (data && type === "update") {
			setIsLoading(true);
			form.setValues({
				particular_type_master_id: data.particular_type_master_id,
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
					<Box bg="white" pos="relative" h={height}>
						<LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 1 }} />
						<Stack justify="space-between" className="drawer-form-stack-vertical">
							<ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="hover">
								<Stack>
									<Grid align="center" columns={20} mt="3xs">
										<Grid.Col span={6}>
											<Text fz="sm">
												{t("ParticularType")} <RequiredAsterisk />
											</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												tooltip={t("ParticularTypeValidateMessage")}
												placeholder={t("ParticularType")}
												name="particular_type_master_id"
												id="particular_type_master_id"
												nextField="category_id"
												required={true}
												value={form.values.particular_type_master_id}
												dropdownValue={particularTypeDropdown}
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
												required={false}
												name="name"
												id="name"
												nextField="instruction"
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="3xs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("Instruction")}</Text>
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
