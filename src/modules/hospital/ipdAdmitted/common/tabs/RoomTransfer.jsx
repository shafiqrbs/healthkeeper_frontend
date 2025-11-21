import { getIndexEntityData, storeEntityData } from "@/app/store/core/crudThunk";
import { ERROR_NOTIFICATION_COLOR } from "@/constants";
import { HOSPITAL_DATA_ROUTES, MASTER_DATA_ROUTES } from "@/constants/routes";
import InputNumberForm from "@components/form-builders/InputNumberForm";
import { errorNotification } from "@components/notification/errorNotification";
import { successNotification } from "@components/notification/successNotification";
import TabSubHeading from "@hospital-components/TabSubHeading";
import { Badge, Box, Button, Divider, Flex, Grid, Select, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext, useParams } from "react-router-dom";

const PER_PAGE = 500;

function RoomTransfer({ data }) {
	const cabinListData = useSelector((state) => state.crud.cabin?.data?.data);
	const bedListData = useSelector((state) => state.crud.bed?.data?.data);
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const dispatch = useDispatch();
	const form = useForm({
		initialValues: { roomType: "", room: "", days: "" },
		validate: {
			days: (value) => {
				if (!value) return "Days is required";
			},
		},
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { id } = useParams();
	const [refetchBillingKey, setRefetchBillingKey] = useState(0);
	const formatDateTime = (dateValue) => {
		if (!dateValue) {
			return "-";
		}

		const safeDateString = typeof dateValue === "string" ? dateValue.replace(" ", "T") : dateValue;
		const parsedDate = new Date(safeDateString);

		if (Number.isNaN(parsedDate.getTime())) {
			return dateValue;
		}

		return Intl.DateTimeFormat("en-GB", {
			dateStyle: "medium",
			timeStyle: "short",
		}).format(parsedDate);
	};

	const currentRoomDetails = useMemo(
		() => [
			{ label: t("RoomName"), value: data?.room_name },
			{ label: t("RoomId"), value: data?.room_id },
			{ label: t("ModeName"), value: data?.mode_name },
			{ label: t("ParentMode"), value: data?.parent_patient_mode_name },
			{ label: t("AdmissionDate"), value: formatDateTime(data?.admission_date) },
			{ label: t("AdmissionDays"), value: data?.admission_day },
			{ label: t("ConsumedDay"), value: data?.consume_day },
			{ label: t("RemainingDay"), value: data?.remaining_day },
			{ label: t("AdmitDepartment"), value: data?.admit_department_name },
			{ label: t("AdmitUnit"), value: data?.admit_unit_name },
			{ label: t("AdmitConsultant"), value: data?.admit_consultant_name },
		],
		[data, t]
	);

	const roomInvoiceParticularList = useMemo(() => {
		if (!Array.isArray(data?.invoice_particular) || !data?.room_name) {
			return [];
		}

		return data.invoice_particular.filter((invoiceItem) => {
			if (!invoiceItem.item_name) {
				return false;
			}

			return invoiceItem.item_name.toLowerCase() === data.room_name.toLowerCase();
		});
	}, [data]);

	const roomAdmissionTransactionList = useMemo(() => {
		if (!Array.isArray(data?.invoice_transaction)) {
			return [];
		}

		return data.invoice_transaction.filter(
			(invoiceTransaction) => invoiceTransaction?.mode?.toLowerCase() === "admission"
		);
	}, [data]);

	const renderDetailItems = (detailList) =>
		detailList.map((detailItem) => (
			<Grid.Col span={12} key={detailItem.label}>
				<Text size="xs" c="dimmed">
					{detailItem.label}
				</Text>
				<Text fw={600}>{detailItem.value ?? "-"}</Text>
			</Grid.Col>
		));

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

	const fetchData = useCallback(
		(roomType = "cabin") => {
			if (roomType === "cabin") {
				dispatch(
					getIndexEntityData({
						url: MASTER_DATA_ROUTES.API_ROUTES.CABIN.INDEX,
						module: "cabin",
						params: { particular_type: "cabin", term: "", page: 1, offset: PER_PAGE },
					})
				);
			} else if (roomType === "bed") {
				dispatch(
					getIndexEntityData({
						url: MASTER_DATA_ROUTES.API_ROUTES.BED.INDEX,
						module: "bed",
						params: { particular_type: "bed", term: "", page: 1, offset: PER_PAGE },
					})
				);
			}
		},
		[dispatch]
	);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	console.log(data);

	const handleRoomSubmit = async () => {
		try {
			setIsSubmitting(true);
			if (!form.values?.room || !form.values?.days) {
				errorNotification(t("PleaseFillAllFieldsToSubmit"), ERROR_NOTIFICATION_COLOR);
				setIsSubmitting(false);
				return;
			}
			const formValue = {
				invoiceId: id,
				patientId: data?.patient_id,
				roomId: form.values?.room,
				quantity: form.values?.days,
				room_type: form.values?.roomType,
			};

			const value = {
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.PROCESS}/${id}`,
				data: formValue,
				module: "admission",
			};

			const resultAction = await dispatch(storeEntityData(value)).unwrap();

			if (resultAction.status === 200) {
				successNotification(t("RoomAddedSuccessfully"));
				// await refetchInvestigationData();
				setRefetchBillingKey(refetchBillingKey + 1);
				form.reset();
			} else {
				errorNotification(t("RoomAddedFailed"));
			}
		} catch (err) {
			console.error(err);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Box bg="var(--mantine-color-white)" h={mainAreaHeight - 16} p="xs">
			<Grid columns={24} gutter="xs" h="100%">
				<Grid.Col span={12}>
					<TabSubHeading bg="var(--theme-primary-color-0)" title={t("CurrentRoom")} />
					<Box bg="var(--mantine-color-white)" className="borderRadiusAll" p="md" mt="xs">
						<Grid columns={24} gutter="xs">
							{renderDetailItems(currentRoomDetails)}
						</Grid>

						{roomInvoiceParticularList.length > 0 && (
							<>
								<Divider my="sm" />
								<Stack gap="xs">
									<Text fw={600} size="sm">
										{t("RoomBillingSummary")}
									</Text>
									{roomInvoiceParticularList.map((invoiceItem) => (
										<Box
											key={invoiceItem.id}
											className="borderRadiusAll"
											bg="var(--mantine-color-white)"
											p="xs"
										>
											<Text fw={500}>{invoiceItem.item_name}</Text>
											<Text size="xs" c="dimmed">
												{t("Quantity")}: {invoiceItem.quantity} • {t("Price")}:{" "}
												{invoiceItem.price} • {t("Subtotal")}: {invoiceItem.sub_total}
											</Text>
											<Badge
												size="sm"
												color="var(--theme-primary-color-6)"
												variant="light"
												mt="xs"
											>
												{invoiceItem.process}
											</Badge>
										</Box>
									))}
								</Stack>
							</>
						)}

						{roomAdmissionTransactionList.length > 0 && (
							<>
								<Divider my="sm" />
								<Stack gap="xs">
									<Text fw={600} size="sm">
										{t("AdmissionTransactions")}
									</Text>
									{roomAdmissionTransactionList.map((transactionItem) => (
										<Box
											key={transactionItem.id}
											className="borderRadiusAll"
											bg="var(--mantine-color-white)"
											p="xs"
										>
											<Text fw={500}>
												{t("Process")}: {transactionItem.process}
											</Text>
											<Text size="xs" c="dimmed">
												{t("Amount")}: {transactionItem.sub_total} • {t("CreatedOn")}:{" "}
												{transactionItem.created}
											</Text>
										</Box>
									))}
								</Stack>
							</>
						)}
					</Box>
				</Grid.Col>
				<Grid.Col span={12}>
					<TabSubHeading bg="var(--theme-primary-color-0)" title={t("RoomToBeTransferred")} />
					<Box className="borderRadiusAll" p="lg" mt="xs" h={mainAreaHeight - 72}>
						<Stack justify="space-between" h={mainAreaHeight - 110}>
							<Grid mt="xs" mx="xs" gutter="xs" align="center" columns={20}>
								<Grid.Col span={20}>
									<Select
										label=""
										name="roomType"
										id="roomType"
										nextField="room"
										placeholder={t("Bed/Cabin")}
										value={form.values.roomType}
										data={[
											{ value: "cabin", label: t("Cabin") },
											{ value: "bed", label: t("Bed") },
										]}
										onChange={(value) => {
											form.setFieldValue("roomType", value);
											form.setFieldValue("room", ""); // Clear room selection when roomType changes
											fetchData(value); // Fetch appropriate data
										}}
										mb="xs"
									/>
									<Select
										name="room"
										label=""
										placeholder="Pick value"
										value={form.values.room}
										data={getRoomData()}
										onChange={(value) => form.setFieldValue("room", value)}
										disabled={!form.values.roomType}
									/>
									<InputNumberForm
										form={form}
										label=""
										tooltip={t("EnterBillingQuantity")}
										placeholder="Days"
										name="days"
										id="days"
										size="xs"
										mt="sm"
									/>
								</Grid.Col>
							</Grid>
							<Box w="100%" bg="var(--mantine-color-white)">
								<Grid columns={18} gutter="xs">
									<Grid.Col span={18} className="animate-ease-out" px="xs" pb={"xs"}>
										<Flex justify="flex-end" gap="sm">
											<Button
												w={140}
												size="compact-sm"
												onClick={() => form.reset()}
												variant="outline"
											>
												<Stack gap={0} align="center" justify="center">
													<Text fz="xs">{t("Reset")}</Text>
												</Stack>
											</Button>
											<Button
												w={140}
												size="compact-sm"
												bg="var(--theme-save-btn-color)"
												onClick={handleRoomSubmit}
											>
												<Stack gap={0} align="center" justify="center">
													<Text fz="xs">{t("Save")}</Text>
												</Stack>
											</Button>
										</Flex>
									</Grid.Col>
								</Grid>
							</Box>
						</Stack>
					</Box>
				</Grid.Col>
			</Grid>
		</Box>
	);
}

export default RoomTransfer;
