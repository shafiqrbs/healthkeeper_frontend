import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Grid, Checkbox, ScrollArea, Button, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDispatch } from "react-redux";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { setValidationData } from "@/app/store/core/crudSlice.js";
import { storeEntityData } from "@/app/store/core/crudThunk.js";

function RequisitionForm(props) {
	const { height, config_requisition, id } = props;
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [saveCreateLoading, setSaveCreateLoading] = useState(false);

	const form = useForm({
		initialValues: {
			search_by_vendor: config_requisition?.search_by_vendor || "",
			search_by_product_nature: config_requisition?.search_by_product_nature || "",
			search_by_category: config_requisition?.search_by_category || "",
			show_product: config_requisition?.show_product || "",
			is_measurement_enable: config_requisition?.is_measurement_enable || "",
			is_purchase_auto_approved: config_requisition?.is_purchase_auto_approved || "",
			default_vendor_group_id: config_requisition?.default_vendor_group_id || "",
			search_by_warehouse: config_requisition?.search_by_warehouse || "",
		},
	});

	const handleRequisitionFormSubmit = (values) => {
		dispatch(setValidationData(false));

		modals.openConfirmModal({
			title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
			labels: { confirm: t("Submit"), cancel: t("Cancel") },
			confirmProps: { color: "red" },
			onCancel: () => console.log("Cancel"),
			onConfirm: () => handleRequisitionConfirmSubmit(values),
		});
	};

	const handleRequisitionConfirmSubmit = async (values) => {
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
				url: `domain/config/requisition/${id}`,
				data: values,
			};
			console.log("value", values);
			await dispatch(storeEntityData(value));

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
			console.error("Error updating requisition config:", error);

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
				"alt+r",
				() => {
					document.getElementById("RequisitionFormSubmit").click();
				},
			],
		],
		[]
	);

	return (
		<ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
			<form onSubmit={form.onSubmit(handleRequisitionFormSubmit)}>
				<Box pt={"xs"} pl={"xs"}>
					<Box mt={"xs"}>
						<Grid
							gutter={{ base: 1 }}
							style={{ cursor: "pointer" }}
							onClick={() =>
								form.setFieldValue("search_by_vendor", form.values.search_by_vendor === 1 ? 0 : 1)
							}
						>
							<Grid.Col span={11} fz={"sm"} pt={"1"}>
								{t("SearchByVendor")}
							</Grid.Col>
							<Grid.Col span={1}>
								<Checkbox
									pr="xs"
									checked={form.values.search_by_vendor === 1}
									color="var(--theme-primary-color-6)"
									{...form.getInputProps("search_by_vendor", {
										type: "checkbox",
									})}
									onChange={(event) =>
										form.setFieldValue("search_by_vendor", event.currentTarget.checked ? 1 : 0)
									}
									styles={() => ({
										input: {
											borderColor: "red",
										},
									})}
								/>
							</Grid.Col>
						</Grid>
					</Box>
					<Box mt={"xs"}>
						<Grid
							gutter={{ base: 1 }}
							style={{ cursor: "pointer" }}
							onClick={() =>
								form.setFieldValue(
									"search_by_product_nature",
									form.values.search_by_product_nature === 1 ? 0 : 1
								)
							}
						>
							<Grid.Col span={11} fz={"sm"} pt={"1"}>
								{t("SearchByProductNature")}
							</Grid.Col>
							<Grid.Col span={1}>
								<Checkbox
									pr="xs"
									checked={form.values.search_by_product_nature === 1}
									color="var(--theme-primary-color-6)"
									{...form.getInputProps("search_by_product_nature", {
										type: "checkbox",
									})}
									onChange={(event) =>
										form.setFieldValue(
											"search_by_product_nature",
											event.currentTarget.checked ? 1 : 0
										)
									}
									styles={() => ({
										input: {
											borderColor: "red",
										},
									})}
								/>
							</Grid.Col>
						</Grid>
					</Box>
					<Box mt={"xs"}>
						<Grid
							gutter={{ base: 1 }}
							style={{ cursor: "pointer" }}
							onClick={() =>
								form.setFieldValue("search_by_category", form.values.search_by_category === 1 ? 0 : 1)
							}
						>
							<Grid.Col span={11} fz={"sm"} pt={"1"}>
								{t("SearchByCategory")}
							</Grid.Col>
							<Grid.Col span={1}>
								<Checkbox
									pr="xs"
									checked={form.values.search_by_category === 1}
									color="var(--theme-primary-color-6)"
									{...form.getInputProps("search_by_category", {
										type: "checkbox",
									})}
									onChange={(event) =>
										form.setFieldValue("search_by_category", event.currentTarget.checked ? 1 : 0)
									}
									styles={() => ({
										input: {
											borderColor: "red",
										},
									})}
								/>
							</Grid.Col>
						</Grid>
					</Box>
					<Box mt={"xs"}>
						<Grid
							gutter={{ base: 1 }}
							style={{ cursor: "pointer" }}
							onClick={() => form.setFieldValue("show_product", form.values.show_product === 1 ? 0 : 1)}
						>
							<Grid.Col span={11} fz={"sm"} pt={"1"}>
								{t("ShowProduct")}
							</Grid.Col>
							<Grid.Col span={1}>
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
							</Grid.Col>
						</Grid>
					</Box>
					<Box mt={"xs"}>
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
							<Grid.Col span={11} fz={"sm"} pt={"1"}>
								{t("MeasurementEnabled")}
							</Grid.Col>
							<Grid.Col span={1}>
								<Checkbox
									pr="xs"
									checked={form.values.is_measurement_enable === 1}
									color="var(--theme-primary-color-6)"
									{...form.getInputProps("is_measurement_enable", {
										type: "checkbox",
									})}
									onChange={(event) =>
										form.setFieldValue("is_measurement_enable", event.currentTarget.checked ? 1 : 0)
									}
									styles={() => ({
										input: {
											borderColor: "red",
										},
									})}
								/>
							</Grid.Col>
						</Grid>
					</Box>
					<Box mt={"xs"}>
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
							<Grid.Col span={11} fz={"sm"} pt={"1"}>
								{t("PurchaseAutoApproved")}
							</Grid.Col>
							<Grid.Col span={1}>
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
							</Grid.Col>
						</Grid>
					</Box>
					<Box mt={"xs"}>
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
							<Grid.Col span={11} fz={"sm"} pt={"1"}>
								{t("DefaultVendorGroup")}
							</Grid.Col>
							<Grid.Col span={1}>
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
							</Grid.Col>
						</Grid>
					</Box>
					<Box mt={"xs"}>
						<Grid
							gutter={{ base: 1 }}
							style={{ cursor: "pointer" }}
							onClick={() =>
								form.setFieldValue("search_by_warehouse", form.values.search_by_warehouse === 1 ? 0 : 1)
							}
						>
							<Grid.Col span={11} fz={"sm"} pt={"1"}>
								{t("SearchByWarehouse")}
							</Grid.Col>
							<Grid.Col span={1}>
								<Checkbox
									pr="xs"
									checked={form.values.search_by_warehouse === 1}
									color="var(--theme-primary-color-6)"
									{...form.getInputProps("search_by_warehouse", {
										type: "checkbox",
									})}
									onChange={(event) =>
										form.setFieldValue("search_by_warehouse", event.currentTarget.checked ? 1 : 0)
									}
									styles={() => ({
										input: {
											borderColor: "red",
										},
									})}
								/>
							</Grid.Col>
						</Grid>
					</Box>
				</Box>
				{/* Add hidden submit button with ID for external triggering */}
				<Button id="RequisitionFormSubmit" type="submit" style={{ display: "none" }}>
					Submit
				</Button>
			</form>
		</ScrollArea>
	);
}

export default RequisitionForm;
