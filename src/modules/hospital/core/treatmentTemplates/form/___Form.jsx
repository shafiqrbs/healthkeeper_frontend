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
import InputNumberForm from "@components/form-builders/InputNumberForm";

export default function ___Form({ form, type = "create", data, handleSubmit, setIndexData, isLoading, setIsLoading }) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 180; //TabList height 104


	const { data: categoryDropdown } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.CATEGORY.PATH,
		utility: HOSPITAL_DROPDOWNS.CATEGORY.UTILITY,
	});


	useEffect(() => {
		if (data && type === "update") {
			setIsLoading(true);
			form.setValues({
				name: data.name,
				category_id: data.category_id,
				instruction: data.instruction,
				sepcimen: data.sepcimen,
				report_machine: data.report_machine,
				investigation_room: data.investigation_room,
				is_report_content: data.is_report_content,
				is_machine_format: data.is_machine_format,
				is_attachment: data.is_attachment,
				additional_field: data.additional_field,
				test_duration: data.test_duration,
				report_format: data.report_format,
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
	const selectReportFormat = [
		{ value: '1', label: '1' },
		{ value: '2', label: '2' }
	];

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
											<Text fz="sm">{t("Category")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												tooltip={t("CategoryValidateMessage")}
												placeholder={t("Category")}
												name="category_id"
												id="category_id"
												searchable='true'
												nextField="employee_id"
												value={form.values.category_id}
												dropdownValue={categoryDropdown}
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
												nextField="price"
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="xxxs">
										<Grid.Col span={6}>
											<Text fz="sm">
												{t("Price")}
											</Text>
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
									<Grid align="center" columns={20} mt="xxxs">
										<Grid.Col span={6}>
											<Text fz="sm">
												{t("ReportFormat")}
											</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												tooltip={t("PriceValidateMessage")}
												placeholder={t("ReportFormat")}
												dropdownValue={selectReportFormat}
												required={false}
												name="report_format"
												id="report_format"
												value={form.values.report_format||1}
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
