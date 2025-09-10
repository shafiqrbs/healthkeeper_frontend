import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Grid, Checkbox, ScrollArea, Button, Text, Center } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDispatch } from "react-redux";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { setValidationData } from "@/app/store/core/crudSlice.js";
import { showEntityData, updateEntityData } from "@/app/store/core/crudThunk.js";
import SelectForm from "@components/form-builders/SelectForm";
import InputForm from "@components/form-builders/InputForm";
import TextAreaForm from "@components/form-builders/TextAreaForm";

export default function __FormGeneric(props) {
	const { height, config_sales, id } = props;
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [value, setValue] = useState(null);

	const [saveCreateLoading, setSaveCreateLoading] = useState(false);

	const form = useForm({
		initialValues: {
			search_by_vendor: config_sales?.search_by_vendor || "",
			search_by_product_nature: config_sales?.search_by_product_nature || "",
			search_by_category: config_sales?.search_by_category || "",
			show_product: config_sales?.show_product || "",
			is_measurement_enable: config_sales?.is_measurement_enable || "",
			is_purchase_auto_approved: config_sales?.is_purchase_auto_approved || "",
			default_vendor_group_id: config_sales?.default_vendor_group_id || "",
			search_by_warehouse: config_sales?.search_by_warehouse || "",
		},
	});

	const handlePurchaseFormSubmit = (values) => {
		dispatch(setValidationData(false));

		modals.openConfirmModal({
			title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
			labels: { confirm: t("Submit"), cancel: t("Cancel") },
			confirmProps: { color: "red" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handlePurchaseConfirmSubmit(values),
		});
	};

	const handlePurchaseConfirmSubmit = async (values) => {
		const properties = [
			"search_by_vendor",
			"search_by_product_nature",
			"search_by_category",
			"show_product",
			"is_measurement_enable",
			"is_purchase_auto_approved",
			"default_vendor_group_id",
			"search_by_warehouse",
		];

		properties.forEach((property) => {
			values[property] = values[property] === true || values[property] == 1 ? 1 : 0;
		});

		try {
			setSaveCreateLoading(true);

			const value = {
				url: `inventory/config-purchase-update/${id}`,
				data: values,
			};
			await dispatch(updateEntityData(value));

			const resultAction = await dispatch(showEntityData("inventory/config"));
			if (showEntityData.fulfilled.match(resultAction)) {
				if (resultAction.payload.data.status === 200) {
					localStorage.setItem("config-data", JSON.stringify(resultAction.payload.data.data));
				}
			}

			notifications.show({
				color: "teal",
				title: t("UpdateSuccessfully"),
				icon: <IconCheck style={{ width: "18px", height: "18px" }} />,
				loading: false,
				autoClose: 700,
				style: { backgroundColor: "lightgray" },
			});

			setTimeout(() => {
				setSaveCreateLoading(false);
			}, 700);
		} catch (error) {
			console.error("Error updating purchase config:", error);

			notifications.show({
				color: "red",
				title: t("UpdateFailed"),
				icon: <IconX style={{ width: "18px", height: "18px" }} />,
				loading: false,
				autoClose: 700,
				style: { backgroundColor: "lightgray" },
			});

			setSaveCreateLoading(false);
		}
	};

	useHotkeys(
		[
			[
				"alt+p",
				() => {
					document.getElementById("PurchaseFormSubmit").click();
				},
			],
		],
		[]
	);

	return (
		<ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
			<form onSubmit={form.onSubmit(handlePurchaseFormSubmit)}>
				<Box pt="xs" pl="xs">
					<Box mt="xs">
						<Grid gutter={{ base: 1 }} style={{ cursor: "pointer" }}>
							<Grid.Col span={6} fz="sm" pt="1px">
								{t("SearchByVendor")}
							</Grid.Col>
							<Grid.Col span={6}>
								<SelectForm
									tooltip={t("ChooseMethod")}
									label={""}
									placeholder={t("ChooseMethod")}
									required={true}
									nextField={"name"}
									name={"method_id"}
									form={form}
									dropdownValue={["1", "2"]}
									id={"method_id"}
									searchable={false}
									value={value}
									changeValue={setValue}
								/>
							</Grid.Col>
						</Grid>
					</Box>
					<Box mt="xs">
						<Grid gutter={{ base: 1 }} style={{ cursor: "pointer" }}>
							<Grid.Col span={6} fz="sm" pt="1px">
								{t("SearchByProductNature")}
							</Grid.Col>
							<Grid.Col span={6}>
								<InputForm
									tooltip={t("SubGroupNameValidateMessage")}
									label={""}
									placeholder={t("Name")}
									required={true}
									nextField={"code"}
									name={"name"}
									form={form}
									id={"name"}
								/>
							</Grid.Col>
						</Grid>
					</Box>
					<Box mt={"xs"}>
						<Grid gutter={{ base: 1 }} style={{ cursor: "pointer" }}>
							<Grid.Col span={6} fz="sm" pt="1px">
								{t("SearchByCategory")}
							</Grid.Col>
							<Grid.Col span={6}>
								<TextAreaForm
									autosize={true}
									minRows={4}
									maxRows={4}
									tooltip={t("Narration")}
									label={""}
									placeholder={t("Narration")}
									required={false}
									nextField={"EntityFormSubmits"}
									name={"narration"}
									form={form}
									id={"narration"}
								/>
							</Grid.Col>
						</Grid>
					</Box>
					<Box mt="xs">
						<Grid
							gutter={{ base: 1 }}
							style={{ cursor: "pointer" }}
							onClick={() => form.setFieldValue("show_product", form.values.show_product === 1 ? 0 : 1)}
						>
							<Grid.Col span={6} fz="sm" pt="1px">
								{t("ShowProduct")}
							</Grid.Col>
							<Grid.Col span={6} align={"center"} justify={"center"}>
								<Center>
									<Checkbox
										pr="xs"
										checked={form.values.show_product === 1}
										color="var(--theme-primary-color-6)"
										{...form.getInputProps("show_product", {
											type: "checkbox",
										})}
										onChange={(event) =>
											form.setFieldValue("show_product", event.currentTarget.checked ? 1 : 0)
										}
										styles={() => ({
											input: {
												borderColor: "red",
											},
										})}
									/>
								</Center>
							</Grid.Col>
						</Grid>
					</Box>
					<Box mt="xs">
						<Grid
							gutter={{ base: 1 }}
							style={{ cursor: "pointer" }}
							onClick={() =>
								form.setFieldValue(
									"is_measurement_enable",
									form.values.is_measurement_enable === 1 ? 0 : 1
								)
							}
						>
							<Grid.Col span={6} fz="sm" pt="1px">
								{t("MeasurementEnabled")}
							</Grid.Col>
							<Grid.Col span={6}>
								<Center>
									<Checkbox
										pr="xs"
										checked={form.values.is_measurement_enable === 1}
										color="var(--theme-primary-color-6)"
										{...form.getInputProps("is_measurement_enable", {
											type: "checkbox",
										})}
										onChange={(event) =>
											form.setFieldValue(
												"is_measurement_enable",
												event.currentTarget.checked ? 1 : 0
											)
										}
										styles={() => ({
											input: {
												borderColor: "red",
											},
										})}
									/>
								</Center>
							</Grid.Col>
						</Grid>
					</Box>
					<Box mt="xs">
						<Grid
							gutter={{ base: 1 }}
							style={{ cursor: "pointer" }}
							onClick={() =>
								form.setFieldValue(
									"is_purchase_auto_approved",
									form.values.is_purchase_auto_approved === 1 ? 0 : 1
								)
							}
						>
							<Grid.Col span={6} fz="sm" pt="1px">
								{t("PurchaseAutoApproved")}
							</Grid.Col>
							<Grid.Col span={6}>
								<Center>
									<Checkbox
										pr="xs"
										checked={form.values.is_purchase_auto_approved === 1}
										color="var(--theme-primary-color-6)"
										{...form.getInputProps("is_purchase_auto_approved", {
											type: "checkbox",
										})}
										onChange={(event) =>
											form.setFieldValue(
												"is_purchase_auto_approved",
												event.currentTarget.checked ? 1 : 0
											)
										}
										styles={() => ({
											input: {
												borderColor: "red",
											},
										})}
									/>
								</Center>
							</Grid.Col>
						</Grid>
					</Box>
					<Box mt="xs">
						<Grid
							gutter={{ base: 1 }}
							style={{ cursor: "pointer" }}
							onClick={() =>
								form.setFieldValue(
									"default_vendor_group_id",
									form.values.default_vendor_group_id === 1 ? 0 : 1
								)
							}
						>
							<Grid.Col span={6} fz="sm" pt="1px">
								{t("DefaultVendorGroup")}
							</Grid.Col>
							<Grid.Col span={6}>
								<Center>
									<Checkbox
										pr="xs"
										checked={form.values.default_vendor_group_id === 1}
										color="var(--theme-primary-color-6)"
										{...form.getInputProps("default_vendor_group_id", {
											type: "checkbox",
										})}
										onChange={(event) =>
											form.setFieldValue(
												"default_vendor_group_id",
												event.currentTarget.checked ? 1 : 0
											)
										}
										styles={() => ({
											input: {
												borderColor: "red",
											},
										})}
									/>
								</Center>
							</Grid.Col>
						</Grid>
					</Box>
				</Box>

				<Button id="PurchaseFormSubmit" type="submit" style={{ display: "none" }}>
					{t("Submit")}
				</Button>
			</form>
		</ScrollArea>
	);
}
