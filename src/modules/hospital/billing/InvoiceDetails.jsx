import { getDataWithoutStore } from "@/services/apiService";
import { Box, Text, Stack, Grid, Flex, Button, Select, Tabs, Autocomplete } from "@mantine/core";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { DataTable } from "mantine-datatable";
import tableCss from "@assets/css/TableAdmin.module.css";
import { IconCaretUpDownFilled, IconChevronUp, IconSelector } from "@tabler/icons-react";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import { useForm } from "@mantine/form";
import { getFormValues } from "@modules/hospital/lab/helpers/request";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import { modals } from "@mantine/modals";
import { updateEntityData } from "@/app/store/core/crudThunk";
import { setRefetchData } from "@/app/store/core/crudSlice";
import { successNotification } from "@components/notification/successNotification";
import { ERROR_NOTIFICATION_COLOR, MODULES_CORE, SUCCESS_NOTIFICATION_COLOR } from "@/constants";
import { errorNotification } from "@components/notification/errorNotification";
import { useDispatch, useSelector } from "react-redux";
import { useHotkeys } from "@mantine/hooks";
import useParticularsData from "@hooks/useParticularsData";
import inputCss from "@assets/css/InputField.module.css";

const module = MODULES_CORE.BILLING;

export default function InvoiceDetails({investigations}) {
	const cabinListData = useSelector((state) => state.crud.cabin?.data?.data);
	const { particularsData } = useParticularsData({ modeName: "Admission" });
	const investigationParticulars = particularsData?.find((item) => item.particular_type.name === "Investigation");
	const [autocompleteValue, setAutocompleteValue] = useState("");
	const bedListData = useSelector((state) => state.crud.bed?.data?.data);
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { mainAreaHeight } = useOutletContext();
	const form = useForm(getFormValues(t));
	const [invoiceDetails, setInvoiceDetails] = useState([]);
	const { id, transactionId } = useParams();
	const [fetching, setFetching] = useState(false);
	const [selectedRecords, setSelectedRecords] = useState([]);

//	console.log(investigationParticulars);

	useEffect(() => {
		if (id) {
			setFetching(true);
			(async () => {
				const res = await getDataWithoutStore({
					url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.BILLING.INDEX}/${id}`,
				});
				form.reset();
				setInvoiceDetails(res?.data);
				setFetching(false);
			})();
		}
	}, [id]);
	console.log(investigations);
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

	const getRoomData = () => {
		if (form.values.roomType === "cabin") {
			return (
				cabinListData?.map((cabin) => ({
					value: cabin.id?.toString(),
					label: cabin.display_name || cabin.cabin_name,
				})) || []
			);
		} else if (form.values.roomType === "bed") {
			return (
				bedListData?.map((bed) => ({
					value: bed.id?.toString(),
					label: bed.display_name || bed.bed_name,
				})) || []
			);
		}
		return [];
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
				setInvoiceDetails(resultAction.payload.data?.data);
				successNotification(t("UpdateSuccessfully"), SUCCESS_NOTIFICATION_COLOR);
			}
		} catch (error) {
			console.error(error);
			errorNotification(error.message, ERROR_NOTIFICATION_COLOR);
		}
	}
	useHotkeys([["alt+s", () => document.getElementById("EntityFormSubmit").click()]], []);

	return (
		<Box pos="relative" className="borderRadiusAll" bg="var(--mantine-color-white)">
			<Box bg="var(--theme-primary-color-0)" p="sm">
				<Text fw={600} fz="sm" py="es">
					{t("InvoiceDetails")}
				</Text>
			</Box>

				<>
					<Tabs id="invoice-details-tabs" defaultValue="investigation">
						<Tabs.List>
							<Tabs.Tab value="investigation">{t("Investigation")}</Tabs.Tab>
							<Tabs.Tab value="bed-cabin">{t("Bed/Cabin")}</Tabs.Tab>
						</Tabs.List>
						<Tabs.Panel value="investigation" bg="var(--mantine-color-white)">
							<Grid align="center" columns={20} mt="xs" mx="xs">
								<Grid.Col span={20}>
									<Autocomplete
										label=""
										placeholder={`Pick value or enter Investigation`}
										data={investigationParticulars?.particular_type?.particulars?.map(
											(particular) => ({
												value: particular.name,
												label: particular.name,
											})
										)}
										value={autocompleteValue}
										onChange={setAutocompleteValue}
										onOptionSubmit={(value) => {
											// handleAutocompleteOptionAdd(value);
											setTimeout(() => {
												setAutocompleteValue("");
											}, 0);
										}}
										classNames={inputCss}
										rightSection={<IconCaretUpDownFilled size={16} />}
									/>
								</Grid.Col>
							</Grid>
							<Box className="border-top-none" px="sm" mt="xs">
								<DataTable
									striped
									highlightOnHover
									pinFirstColumn
									stripedColor="var(--theme-tertiary-color-1)"
									selectedRecords={selectedRecords}
									onSelectedRecordsChange={setSelectedRecords}
									selectionColumnStyle={{ minWidth: 80 }}
									classNames={{
										root: tableCss.root,
										table: tableCss.table,
										header: tableCss.header,
										footer: tableCss.footer,
										pagination: tableCss.pagination,
									}}
									records={investigations || []}
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
											accessor: "price",
											title: t("Price"),
										},
									]}
									fetching={fetching}
									loaderSize="xs"
									loaderColor="grape"
									height={mainAreaHeight - 206}
									sortIcons={{
										sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
										unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
									}}
								/>
							</Box>
						</Tabs.Panel>
						<Tabs.Panel value="bed-cabin" bg="var(--mantine-color-white)">
							<Flex mx="sm" mt="xs" align="center" gap="xs" justify="space-between">
								<Flex gap="sm">
									<Text>{invoiceDetails?.room_info?.room_type || "General"}</Text>
									<Text>{invoiceDetails?.room_info?.room_name || "Paying Non A/C - 329"}</Text>
								</Flex>
								<Flex gap="sm">
									<InputNumberForm
										form={form}
										label=""
										tooltip={t("EnterBillingDays")}
										placeholder="days"
										name="days"
										id="days"
										size="xs"
									/>
									<Button
										size="xs"
										bg="var(--theme-save-btn-color)"
										// onClick={handleRoomSubmit}
									>
										<Stack gap={0} align="center" justify="center">
											<Text fz="xs">{t("Add")}</Text>
										</Stack>
									</Button>
								</Flex>
							</Flex>
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
											accessor: "type",
											title: t("Type"),
											render: (record) => record.particular_type?.name || "N/A",
										},
										{
											accessor: "days",
											title: t("Days"),
										},
										{
											accessor: "price",
											title: t("Price"),
										},
										{
											accessor: "subtotal",
											title: t("Subtotal"),
										},
									]}
									fetching={fetching}
									loaderSize="xs"
									loaderColor="grape"
									height={mainAreaHeight - 200}
									sortIcons={{
										sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
										unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
									}}
								/>
							</Box>
						</Tabs.Panel>
					</Tabs>

					{invoiceDetails?.process !== "Done" && (
						<Box gap={0} justify="space-between" mt="xs">
							<form onSubmit={form.onSubmit(handleSubmit)}>
								<Box bg="var(--mantine-color-white)" px="xs" pb="xs">
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
