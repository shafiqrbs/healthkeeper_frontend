import {useEffect, useState} from "react";
import { useOutletContext } from "react-router-dom";
import {Grid, Box, ScrollArea, LoadingOverlay, Stack, Text, Switch} from "@mantine/core";
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
import InputCheckboxForm from "@components/form-builders/InputCheckboxForm";

export default function ___Form({ form, type = "create", data, handleSubmit, setIndexData, isLoading, setIsLoading }) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 180; //TabList height 104
	const [checked, setChecked] = useState(false);
	const { data: categoryDropdown } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.CATEGORY.PATH,
		utility: HOSPITAL_DROPDOWNS.CATEGORY.UTILITY,
		params: { "type": 'service' },
	});

	const { data: roomDropdown } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.PARTICULAR_MODE_DIAGNOSTIC_ROOM.PATH,
		utility: HOSPITAL_DROPDOWNS.PARTICULAR_MODE_DIAGNOSTIC_ROOM.UTILITY,
		params: { "dropdown-type": HOSPITAL_DROPDOWNS.PARTICULAR_MODE_DIAGNOSTIC_ROOM.TYPE },
	});

	const { data: departmentDropdown } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.PARTICULAR_MODE_DIAGNOSTIC_DEPARTMENT.PATH,
		utility: HOSPITAL_DROPDOWNS.PARTICULAR_MODE_DIAGNOSTIC_DEPARTMENT.UTILITY,
		params: { "dropdown-type": HOSPITAL_DROPDOWNS.PARTICULAR_MODE_DIAGNOSTIC_DEPARTMENT.TYPE },
	});

	const { data: financialServiceDropdown } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.PARTICULAR_MODE_FINANCIAL_SERVICE.PATH,
		utility: HOSPITAL_DROPDOWNS.PARTICULAR_MODE_FINANCIAL_SERVICE.UTILITY,
		params: { "dropdown-type": HOSPITAL_DROPDOWNS.PARTICULAR_MODE_FINANCIAL_SERVICE.TYPE },
	});

	useEffect(() => {
		if (data && type === "update") {
			setIsLoading(true);
			form.setValues({
				name: data.name,
				category_id: data.category_id,
				diagnostic_department_id: data.diagnostic_department_id,
				diagnostic_room_id: data.diagnostic_room_id,
				financial_service_id: data.financial_service_id,
				instruction: data.instruction,
				specimen: data.specimen,
				slug: data.slug,
				report_machine: data.report_machine,
				investigation_room: data.investigation_room,
				is_report_content: data.is_report_content,
				is_machine_format: data.is_machine_format,
				is_attachment: data.is_attachment,
				additional_field: data.additional_field,
				test_duration: data.test_duration,
				report_format: data.report_format,
				is_available: data.is_available,
				is_custom_report: data.is_custom_report,
				is_free: data.is_free,
				is_report_format: data.is_report_format,
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
		{ value: "1", label: "1" },
		{ value: "2", label: "2" },
	];
	console.log(data?.is_custom_report);

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
											<Text fz="sm">{t("Department")}<RequiredAsterisk /></Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												tooltip={t("CategoryValidateMessage")}
												placeholder={t("Department")}
												name="diagnostic_department_id"
												id="diagnostic_department_id"
												searchable="true"
												nextField="category_id"
												value={form.values.diagnostic_department_id}
												dropdownValue={departmentDropdown}
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="3xs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("Category")}<RequiredAsterisk /></Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												tooltip={t("CategoryValidateMessage")}
												placeholder={t("Category")}
												name="category_id"
												id="category_id"
												searchable="true"
												nextField="name"
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
												tooltip={t("NameValidateMessage")}
												placeholder={t("Name")}
												required={false}
												name="name"
												id="name"
												nextField="diagnostic_room_id"
											/>
										</Grid.Col>
									</Grid>

									<Grid align="center" columns={20} mt="3xs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("Room")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												tooltip={t("RoomValidateMessage")}
												placeholder={t("Room")}
												name="diagnostic_room_id"
												id="diagnostic_room_id"
												searchable="true"
												nextField="price"
												value={form.values.diagnostic_room_id}
												dropdownValue={roomDropdown}
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="3xs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("FinancialService")}<RequiredAsterisk /></Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												tooltip={t("FinancialServiceValidateMessage")}
												placeholder={t("FinancialService")}
												name="financial_service_id"
												id="financial_service_id"
												searchable="true"
												nextField="price"
												value={form.values.financial_service_id}
												dropdownValue={financialServiceDropdown}
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
									<Grid align="center" columns={20} mt="3xs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("specimen")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<InputForm
												form={form}
												tooltip={t("specimenValidateMessage")}
												placeholder={t("specimen")}
												required={false}
												name="specimen"
												id="specimen"
												nextField=""
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="3xs">
										<Grid.Col span={6}>
											<Text fz="sm">
												{t("CustomReportType")}
											</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												tooltip={t("CustomReportType")}
												placeholder={t("CustomReportType")}
												name="slug"
												id="slug"
												required={false}
												value={form.values.slug}
												dropdownValue={[
													{ value: 'system', label: 'System' },
													{ value: 'gene-xpert', label: 'Gene-Xpert' },
													{ value: 'sputum-afb', label: 'Sputum for AFB' },
													{ value: 'ct-scan', label: 'CT scan' },
													{ value: 'mt-test', label: 'MT Test' },
													{ value: 'dst', label: 'DST' },
													{ value: 'afb-culture', label: 'AFB Culture' },
												]}
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="3xs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("Available")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<Switch
												name="is_available"
												id="is_available"
												checked={form?.values?.is_available}
												onChange={(event) => form.setFieldValue("is_available", event.currentTarget.checked)}
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="3xs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("ReportFormat")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<Switch
												name="is_report_format"
												id="is_report_format"
												checked={form?.values?.is_report_format}
												onChange={(event) => form.setFieldValue("is_report_format", event.currentTarget.checked)}
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="3xs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("Is Custom Report")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<Switch
												name="is_custom_report"
												id="is_custom_report"
												checked={form?.values?.is_custom_report}
												onChange={(event) => form.setFieldValue("is_custom_report", event.currentTarget.checked)}
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="3xs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("Is Free")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<Switch
												name="is_free"
												id="is_free"
												checked={form?.values?.is_free}
												onChange={(event) => form.setFieldValue("is_free", event.currentTarget.checked)}
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
