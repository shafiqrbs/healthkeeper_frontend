import { Box, Text, Grid, Flex, Button, Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { DataTable } from "mantine-datatable";
import tableCss from "@assets/css/TableAdmin.module.css";
import { IconChevronUp, IconSelector } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { getFormValues } from "@modules/hospital/lab/helpers/request";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import { modals } from "@mantine/modals";
import { updateEntityData } from "@/app/store/core/crudThunk";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { successNotification } from "@components/notification/successNotification";
import { ERROR_NOTIFICATION_COLOR, MODULES_CORE, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import { errorNotification } from "@components/notification/errorNotification";
import { useDispatch } from "react-redux";
import { useHotkeys } from "@mantine/hooks";
import { useEffect } from "react";

const module = MODULES_CORE.LAB_USER;

export default function Medicine({ entity, setEntity, barcodeForm, setResetKey }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { mainAreaHeight } = useOutletContext();
	const form = useForm(getFormValues(t));
	const { id } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		document.getElementById("barcode").focus();
	}, []);

	const handleSubmit = (values) => {
		handleConfirmModal(values);
	};
	async function handleConfirmModal(values) {
		try {
			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.EPHARMA.UPDATE}/${id}`,
				data: values,
				module,
			};
			const resultAction = await dispatch(updateEntityData(value));
			if (updateEntityData.rejected.match(resultAction)) {
				const fieldErrors = resultAction.payload.errors;
				if (fieldErrors) {
					const errorObject = {};
					Object.keys(fieldErrors).forEach((key) => {
						errorObject[key] = fieldErrors[key][0];
					});
					form.setErrors(errorObject);
				}
			} else if (updateEntityData.fulfilled.match(resultAction)) {
				barcodeForm.reset();
				setResetKey((prev) => prev + 1);
				dispatch(setRefetchData({ module, refetching: true }));
				setEntity([]);
				successNotification(t("UpdateSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
				navigate(HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.EPHARMA.ISSUE);
			}
		} catch (error) {
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		}
	}

	useHotkeys([["alt+s", () => document.getElementById("EntityFormSubmit")?.click()]]);

	return (
		<Box className="borderRadiusAll" bg="var(--mantine-color-white)">
			<Box bg="var(--theme-primary-color-0)" p="sm">
				<Text fw={600} fz="sm" py="es">
					{t("Medicines")}
				</Text>
			</Box>

			{entity?.sales_items ? (
				<>
					<Box>
						<Box className="border-top-none" px="sm" mt="xs">
							<DataTable
								striped
								highlightOnHover
								pinFirstColumn
								stripedColor="var(--theme-tertiary-color-1)"
								classNames={{
									root: tableCss.root,
									table: tableCss.table,
									header: tableCss.header,
									footer: tableCss.footer,
									pagination: tableCss.pagination,
								}}
								records={entity?.sales_items || []}
								columns={[
									{
										accessor: "index",
										title: t("S/N"),
										textAlignment: "right",
										render: (_, index) => index + 1,
									},
									{ accessor: "name", title: t("Name") },
									{
										accessor: "current_warehouse_stock.quantity",
										title: t("Stock"),
									},
									{
										accessor: "quantity",
										width: "200px",
										title: t("Quantity"),
									},
									{ accessor: "uom", title: t("Unit") },
								]}
								loaderSize="xs"
								loaderColor="grape"
								height={mainAreaHeight - 184}
								sortIcons={{
									sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
									unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
								}}
							/>
						</Box>

						{/* 🔥 Form */}
						<form onSubmit={form.onSubmit(handleSubmit)}>
							<Box bg="var(--theme-tertiary-color-0)" mt="xl" p="sm">
								<Grid columns={24}>
									<Grid.Col span={18}>
										<TextAreaForm
											id="comment"
											form={form}
											tooltip={t("EnterComment")}
											placeholder={t("EnterComment")}
											name="comment"
											required
										/>
									</Grid.Col>

									<Grid.Col span={6}>
										<Flex gap="xs" justify="flex-end" align="flex-end" h={54}>
											{/* No double submit */}
											<Button
												id="EntityFormSubmit"
												type="submit"
												bg="var(--theme-primary-color-6)"
												color="white"
											>
												{t("Confirm")}
											</Button>

											<Button
												type="button"
												bg="var(--theme-tertiary-color-6)"
												color="white"
												onClick={() => modals.closeAll()} // Cancel Button
											>
												{t("Cancel")}
											</Button>
										</Flex>
									</Grid.Col>
								</Grid>
							</Box>
						</form>
					</Box>
				</>
			) : (
				<Box bg="var(--mantine-color-white)">
					<Stack
						h={mainAreaHeight - 62}
						bg="var(--mantine-color-body)"
						align="center"
						justify="center"
						gap="md"
					>
						{t("NoTestSelected")}
					</Stack>
				</Box>
			)}
		</Box>
	);
}
