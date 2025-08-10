import {useEffect, useState} from "react";
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
import { DROPDOWNS } from "@/app/store/core/utilitySlice.js";

export default function ___Form({ form, type = "create", data, handleSubmit, setIndexData, isLoading, setIsLoading }) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 180; //TabList height 104

	const { data: categoryNatureDropdown } = useGlobalDropdownData({
		path: DROPDOWNS.CATEGORY_NATURE.PATH,
		params: { "dropdown-type": DROPDOWNS.CATEGORY_NATURE.TYPE },
		utility: DROPDOWNS.CATEGORY_NATURE.UTILITY,
	});

	const { data: categoryGroupDropdown } = useGlobalDropdownData({
		path: DROPDOWNS.CATEGORY_GROUP.PATH,
		utility: DROPDOWNS.CATEGORY_GROUP.UTILITY,
	});


	useEffect(() => {
		if (data && type === "update") {
			setIsLoading(true);
			form.setValues({
				category_nature_id: data.category_nature_id,
				parent_id: data.parent_id,
				name: data.name,
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
									<Grid align="center" columns={20} mt="xxxs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("CategoryNature")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												tooltip={t("CategoryNatureValidateMessage")}
												placeholder={t("CategoryNature")}
												name="category_nature_id"
												id="category_nature_id"
												nextField="parent_id"
											//	changeValue={setCategoryNature}
												value={form.values.category_nature_id}
												dropdownValue={categoryNatureDropdown}
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="xxxs">
										<Grid.Col span={6}>
											<Text fz="sm">{t("CategoryGroup")}</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												form={form}
												tooltip={t("CategoryGroupValidateMessage")}
												placeholder={t("CategoryGroup")}
												name="parent_id"
												id="parent_id"
												nextField="name"
												value={form.values.parent_id}
												//changeValue={setParent}
												dropdownValue={categoryGroupDropdown}
											/>
										</Grid.Col>
									</Grid>
									<Grid align="center" columns={20} mt="xxxs">
										<Grid.Col span={6}>
											<Text fz="sm">
												{t("CategoryName")} <RequiredAsterisk />
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
												nextField="EntityFormSubmit"
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
