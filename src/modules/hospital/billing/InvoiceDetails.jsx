import { getDataWithoutStore } from "@/services/apiService";
import { Box, Text, Stack, Grid, Flex, Button } from "@mantine/core";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { DataTable } from "mantine-datatable";
import tableCss from "@assets/css/TableAdmin.module.css";
import { IconChevronUp, IconSelector } from "@tabler/icons-react";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import { useForm } from "@mantine/form";
import { getFormValues } from "@modules/hospital/lab/helpers/request";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import { modals } from "@mantine/modals";
import { storeEntityData, updateEntityData } from "@/app/store/core/crudThunk";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { successNotification } from "@components/notification/successNotification";
import { ERROR_NOTIFICATION_COLOR, MODULES_CORE, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import { errorNotification } from "@components/notification/errorNotification";
import { useDispatch } from "react-redux";
import { useHotkeys } from "@mantine/hooks";

const module = MODULES_CORE.BILLING;

export default function InvoiceDetails() {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const inputsRef = useRef([]);
	const { mainAreaHeight } = useOutletContext();
	const form = useForm(getFormValues(t));
	const [invoiceDetails, setInvoiceDetails] = useState([]);
	const [updatingRows, setUpdatingRows] = useState({});
	const { id, transactionId } = useParams();
	const [fetching, setFetching] = useState(false);

	useEffect(() => {
		if (id && transactionId) {
			setFetching(true);
			(async () => {
				const res = await getDataWithoutStore({
					url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.BILLING.INDEX}/${id}/payment/${transactionId}`,
				});
				form.reset();
				setInvoiceDetails(res?.data);
				setFetching(false);
			})();
		}
	}, [id, transactionId]);

	const handleSubmit = (values) => {
		modals.openConfirmModal({
			title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
			children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
			labels: { confirm: t("Submit"), cancel: t("Cancel") },
			confirmProps: { color: "red" },
			onCancel: () => console.info("Cancel"),
			onConfirm: () => handleConfirmModal(values),
		});
	};

	async function handleConfirmModal(values) {
		try {
			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.BILLING.UPDATE}/${transactionId}`,
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
				dispatch(setRefetchData({ module, refetching: true }));
				setInvoiceDetails(resultAction.payload.data);
				successNotification(t("UpdateSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
				setInvoiceDetails(resultAction.payload.data);
			}
		} catch (error) {
			console.error(error);
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		}
	}
	useHotkeys([["alt+s", () => document.getElementById("EntityFormSubmit").click()]], []);

	return (
		<Box className="borderRadiusAll" bg="white">
			<Box bg="var(--theme-primary-color-0)" p="sm">
				<Text fw={600} fz="sm" py="es">
					{t("InvoiceDetails")}
				</Text>
			</Box>
			{transactionId ? (
				<>
					<Box className="border-top-none" px="sm" mt={"xs"}>
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
							records={invoiceDetails?.items || []}
							columns={[
								{
									accessor: "index",
									title: t("S/N"),
									textAlignment: "right",
									render: (_, index) => index + 1,
								},
								{
									accessor: "name",
									title: t("Name"),
								},
								{
									accessor: "quantity",
									title: t("Quantity"),
								},
								{
									accessor: "price",
									title: t("Price"),
								},
								{
									accessor: "sub_total",
									title: t("SubTotal"),
								},
							]}
							fetching={fetching}
							loaderSize="xs"
							loaderColor="grape"
							height={mainAreaHeight - 162}
							sortIcons={{
								sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
								unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
							}}
						/>
					</Box>
					{invoiceDetails?.process !== "Done" && (
						<Box gap={0} justify="space-between" mt="xs">
							<form onSubmit={form.onSubmit(handleSubmit)}>
								<Box bg="white" px="xs" pb="xs">
									<Box w="100%">
										<Grid columns={18} gutter="xs">
											<Grid.Col
												span={6}
												className="animate-ease-out"
												bg="var(--theme-primary-color-0)"
												px="xs"
											>
												<Box mt="md">
													<TextAreaForm
														id="comment"
														form={form}
														tooltip={t("EnterComment")}
														placeholder={t("EnterComment")}
														name="comment"
														disabled={invoiceDetails?.process === "Done"}
													/>
												</Box>
											</Grid.Col>
											<Grid.Col
												span={6}
												bg="var(--theme-tertiary-color-1)"
												className="animate-ease-out"
											>
												<Box mt="xs">
													<Grid align="center" columns={20}>
														<Grid.Col span={8}>
															<Flex justify="flex-end" align="center" gap="es">
																<Text fz="xs">{t("CreatedBy")}</Text>
															</Flex>
														</Grid.Col>
														<Grid.Col span={12}>
															<Flex align="right" gap="es">
																<Text fz="xs">
																	{invoiceDetails?.created_doctor_info?.name}
																</Text>
															</Flex>
														</Grid.Col>
													</Grid>
													<Grid align="center" columns={20}>
														<Grid.Col span={8}>
															<Flex justify="flex-end" align="center" gap="es">
																<Text fz="sm">{t("Total")}</Text>
															</Flex>
														</Grid.Col>
														<Grid.Col span={12}>
															<Flex align="right" gap="es">
																<Text fz="sm">{invoiceDetails?.total || 0}</Text>
															</Flex>
														</Grid.Col>
													</Grid>
												</Box>
											</Grid.Col>
											<Grid.Col
												span={6}
												className="animate-ease-out"
												bg="var(--theme-secondary-color-0)"
												px="xs"
											>
												<Grid align="center" columns={20}>
													<Grid.Col span={10}>
														<Flex justify="flex-end" align="center" gap="es">
															<Text fz="sm" fw={"800"}>
																{t("Receive")}
															</Text>
														</Flex>
													</Grid.Col>
													<Grid.Col span={10}>
														<InputNumberForm
															form={form}
															label=""
															tooltip={t("EnterAmount")}
															placeholder={t("Amount")}
															name="amount"
															id="amount"
															value={invoiceDetails?.total || 0}
															disabled={invoiceDetails?.process === "Done"}
														/>
													</Grid.Col>
												</Grid>
												<Box mt="xs">
													<Button.Group>
														<Button
															id="EntityFormSubmit"
															w="100%"
															size="compact-sm"
															bg="var(--theme-pos-btn-color)"
															type="button"
															disabled={invoiceDetails?.process === "Done"}
														>
															<Stack gap={0} align="center" justify="center">
																<Text fz="xs">{t("Print")}</Text>
															</Stack>
														</Button>
														<Button
															type="submit"
															w="100%"
															size="compact-sm"
															bg="var(--theme-save-btn-color)"
															disabled={invoiceDetails?.process === "Done"}
														>
															<Stack gap={0} align="center" justify="center">
																<Text fz="xs">{t("Save")}</Text>
															</Stack>
														</Button>
													</Button.Group>
												</Box>
											</Grid.Col>
										</Grid>
									</Box>
								</Box>
							</form>
						</Box>
					)}
				</>
			) : (
				<Box bg="white">
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
