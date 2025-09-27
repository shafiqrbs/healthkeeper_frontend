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
const dosages =['Cap',"Tab",'Injc'];

export default function ___Form({ form, type = "create", data, handleSubmit, setIndexData, isLoading, setIsLoading }) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 180; //TabList height 104


	useEffect(() => {
		if (data && type === "update") {
			setIsLoading(true);
			form.setValues({
				name: data.name,
				name_bn: data.name_bn,
				dosage_form: data.dosage_form,
				quantity: data.quantity,
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

									<Grid align="center" columns={20} mt="xxxs">
										<Grid.Col span={6}>
											<Text fz="sm">
												{t("DosageForm")} <RequiredAsterisk />
											</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												tooltip={t("DosageFormValidateMessage")}
												placeholder={t("DosageForm")}
												required={false}
												dropdownValue={dosages}
												name="dosage_form"
												id="dosage_form"
												value={form.values.dosage_form}
												nextField="name"
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
												nextField="name_bn"
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="xxxs">
										<Grid.Col span={6}>
											<Text fz="sm">
												{t("Name BN")} <RequiredAsterisk />
											</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<InputForm
												form={form}
												tooltip={t("NameValidateMessage")}
												placeholder={t("Name")}
												required={false}
												name="name_bn"
												id="name_bn"
												nextField="instruction"
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="xxxs">
										<Grid.Col span={6}>
											<Text fz="sm">
												{t("Quantity")} <RequiredAsterisk />
											</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<InputForm
												form={form}
												tooltip={t("NameValidateMessage")}
												placeholder={t("Name")}
												required={false}
												name="quantity"
												id="quantity"
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
