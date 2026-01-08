import {useEffect, useState} from "react";
import { useOutletContext } from "react-router-dom";
import {Grid, Box, ScrollArea, LoadingOverlay, Stack, Text, Center} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useHotkeys } from "@mantine/hooks";
import DrawerStickyFooter from "@components/drawers/DrawerStickyFooter";
import RequiredAsterisk from "@components/form-builders/RequiredAsterisk";
import SelectForm from "@components/form-builders/SelectForm";
import {Dropzone, MIME_TYPES} from "@mantine/dropzone";

export default function ___Form({ form, type = "create", data, handleSubmit, setIndexData, isLoading, setIsLoading }) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 180; //TabList height 104
	const [excelFile, setExcelFile] = useState(null);

	useEffect(() => {
		if (data && type === "update") {
			setIsLoading(true);
			form.setValues({
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
					<Box bg="var(--mantine-color-white)" pos="relative" h={height}>
						<LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 1 }} />
						<Stack justify="space-between" className="drawer-form-stack-vertical">
							<ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="hover">
								<Stack>
									<Grid align="center" columns={20} mt="3xs">
										<Grid.Col span={6}>
											<Text fz="sm">
												{t("ChooseExcelType")} <RequiredAsterisk />
											</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<SelectForm
												tooltip={t("ChooseExcelType")}
												placeholder={t("ChooseExcelType")}
												required={true}
												nextField={""}
												name={"file_type"}
												form={form}
												dropdownValue={[
													"Opening-Stock",
												]}
												mt={8}
												id={"file_type"}
												searchable={true}
											/>
										</Grid.Col>
									</Grid>


									<Grid align="center" columns={20} mt="3xs">
										<Grid.Col span={6}>
											<Text fz="sm">
												{t("File")} <RequiredAsterisk />
											</Text>
										</Grid.Col>
										<Grid.Col span={14}>
											<Dropzone
												onDrop={(e) => {
													setExcelFile(e[0]);
													form.setFieldValue("file", e[0]);
												}}
												accept={[MIME_TYPES.csv, MIME_TYPES.xlsx]}
												h={100}
												p={0}
												name="file"
											>
												<Center h={100}>
													<Text>{excelFile ? excelFile.path : t("SelectCsvFile")}</Text>
												</Center>
											</Dropzone>
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
