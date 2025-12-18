import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Grid, Box, ScrollArea, LoadingOverlay, Stack, Text, Select } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDebouncedState, useHotkeys } from "@mantine/hooks";

import InputForm from "@components/form-builders/InputForm";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import PhoneNumber from "@components/form-builders/PhoneNumberInput";

import DrawerStickyFooter from "@components/drawers/DrawerStickyFooter";
import RequiredAsterisk from "@components/form-builders/RequiredAsterisk";
import SelectForm from "@components/form-builders/SelectForm";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import { HOSPITAL_DROPDOWNS, CORE_DROPDOWNS } from "@/app/store/core/utilitySlice.js";
import inputCss from "@assets/css/InputField.module.css";
import { medicineOptionsFilter } from "@utils/prescription";
import useMedicineStockData from "@hooks/useMedicineStockData";

export default function ___Form({ form, type = "create", data, handleSubmit, setIndexData, isLoading, setIsLoading }) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 180; //TabList height 104
	const [medicineTerm, setMedicineTerm] = useDebouncedState("", 300);
	const { medicineData } = useMedicineStockData({ term: medicineTerm });
	console.log(medicineData);

	useEffect(() => {
		if (data && type === "update") {
			setIsLoading(true);
			form.setValues({
				medicine_stock_id: data.medicine_stock_id,
				name: data.name,
				company: data.company,
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
										<Grid.Col span={6} mt="3xs">
											Generic Medicine
										</Grid.Col>
										<Grid.Col align="center" span={14} mt="3xs">
											<Select
												searchable
												onSearchChange={setMedicineTerm}
												searchValue={medicineTerm}
												tooltip={t("EnterGenericMedicine")}
												id="generic"
												name="medicine_stock_id"
												data={medicineData?.map((item, index) => ({
													label: item?.product_name || item?.product_name || item?.product_name,
													value: item.product_id?.toString() || index.toString(),
													generic: item?.generic || "",
												}))}
												filter={medicineOptionsFilter}
												value={form.values.medicine_stock_id?.toString()}
												onChange={(v, option) => {
													form.setFieldValue("generic", option.generic);
													form.setFieldValue("medicine_stock_id", v);
													setMedicineTerm(option.generic);
												}}
												onBlur={() => setMedicineTerm(medicineTerm)}
												placeholder={t("GenericMedicine")}
												classNames={inputCss}
												error={!!form.errors.medicine_stock_id}
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
