import { Box, Text, ScrollArea, Stack, Button, Flex, Grid, ActionIcon, LoadingOverlay, Table } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { HOSPITAL_DATA_ROUTES, MASTER_DATA_ROUTES } from "@/constants/routes";
import { formatDate } from "@utils/index";
import useAppLocalStore from "@hooks/useAppLocalStore";
import { getIndexEntityData } from "@/app/store/core/crudThunk";
import { useDispatch } from "react-redux";
import { IconArrowNarrowRight, IconCalendarWeek, IconUser, IconBuildingHospital } from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import InvoicePosBN from "@hospital-components/print-formats/billing/InvoicePosBN";
import { getDataWithoutStore } from "@/services/apiService";
import GlobalDrawer from "@components/drawers/GlobalDrawer";
import { useDisclosure } from "@mantine/hooks";

const ALLOWED_BILLING_ROLES = [
	"billing_manager",
	"billing_cash",
	"admin_hospital",
	"admin_administrator",
	"operator_opd",
];
const PER_PAGE = 500;

export default function Invoice({ entity }) {
	const { userRoles } = useAppLocalStore();
	const invoicePrintRef = useRef(null);
	const [invoicePrintData, setInvoicePrintData] = useState(null);
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { mainAreaHeight } = useOutletContext();
	const { id, transactionId: selectedTransactionId } = useParams();
	const navigate = useNavigate();
	const ipdAllPrintRef = useRef(null);
	const [invoiceDetailsOpened, { open: openInvoiceDetails, close: closeInvoiceDetails }] = useDisclosure(false);
	const [selectedInvoice, setSelectedInvoice] = useState({});

	const item = entity;
	const transactions = entity?.invoice_transaction || [];
	const printIPDAll = useReactToPrint({ content: () => ipdAllPrintRef.current });

	const invoicePrint = useReactToPrint({ content: () => invoicePrintRef.current });

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

	const handleTest = (transactionId) => {
		navigate(`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.BILLING.VIEW}/${id}/payment/${transactionId}`);
	};

	const handleDetailsView = async (transaction) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.BILLING.PRINT}/${transaction.hms_invoice_transaction_id}`,
		});
		setSelectedInvoice(res.data);
		requestAnimationFrame(openInvoiceDetails);
	};

	const handlePrint = async (id) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.BILLING.PRINT}/${id}`,
		});
		setInvoicePrintData(res.data);
		requestAnimationFrame(invoicePrint);
	};

	//console.log(selectedInvoice);

	return (
		<Box className="borderRadiusAll" bg="var(--mantine-color-white)">
			<Flex bg="var(--theme-primary-color-0)" p="sm" justify="space-between">
				<Text fw={600} fz="sm" py="es" px="xs">
					{t("InvoiceHistory")}
				</Text>
			</Flex>

			{id && (
				<Grid columns={12} key={item.id} my="xs" bg={"var(--theme-secondary-color-2)"} px="xs" gutter="xs">
					<Grid.Col span={12}><Text fz="sm">{item.name}</Text></Grid.Col>
					<Grid.Col span={6}>
						<Flex align="center" gap="3xs">
							<IconCalendarWeek size={16} stroke={1.5} />
							<Text fz="sm" className="activate-link text-nowrap">
								{formatDate(item?.created_at)}
							</Text>
						</Flex>
						<Flex align="center" gap="3xs">
							<IconUser size={16} stroke={1.5} />
							<Text fz="sm">{item.patient_id}</Text>
						</Flex>
						<Flex align="center" gap="3xs">
							<IconBuildingHospital size={16} stroke={1.5} />
							<Text fz="sm">{item.mode_name}</Text>
						</Flex>
					</Grid.Col>
					<Grid.Col span={6}>
						<Flex justify="space-between" align="center" gap="3xs">
							<Box>
								<Text fz="sm">{item.mobile}</Text>
								<Text fz="sm">{item.payment_mode_name}</Text>
							</Box>
						</Flex>
						<Flex align="center" gap="3xs">
							<Text fz="sm">Year: {item.year}</Text>
						</Flex>
					</Grid.Col>
				</Grid>
			)}
			{id && transactions.length ? (
				<>
					<ScrollArea scrollbars="y" type="never" h={mainAreaHeight - 138}>
						<LoadingOverlay visible={false} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
						<Stack className="form-stack-vertical" p="xs" pos="relative">
							{transactions?.map((item, index) => (
								<Box
									key={index}
									className="borderRadiusAll"
									bg={
										selectedTransactionId == item.hms_invoice_transaction_id
											? "var(--theme-primary-color-1)"
											: "white"
									}
									p="sm"
								>
									<Grid columns={16} gap={0} gutter="xs">
										<Grid.Col span={4} py={0}>
											<Text size="xs" fw={600}>
												Created:
											</Text>
										</Grid.Col>
										<Grid.Col span={4} py={0}>
											<Text size="xs">{item?.created}</Text>
										</Grid.Col>
										<Grid.Col span={4} py={0}>
											<Text size="xs" fw={600}>
												Mode:
											</Text>
										</Grid.Col>
										<Grid.Col span={4} py={0}>
											<Text size="xs">{item?.mode}</Text>
										</Grid.Col>
										<Grid.Col span={4} py={0}>
											<Text size="xs" fw={600}>
												Amount:
											</Text>
										</Grid.Col>
										<Grid.Col span={4} py={0}>
											<Text size="xs">{Number(item?.total, 2)}</Text>
										</Grid.Col>
										<Grid.Col span={4} py={0}>
											<Text size="xs" fw={600}>
												Status:
											</Text>
										</Grid.Col>
										<Grid.Col span={4} py={0}>
											<Text size="xs">{item?.process}</Text>
										</Grid.Col>
									</Grid>
									<Flex align="center" gap="sm" mt={"md"} justify="flex-end">
										{userRoles.some((role) => ALLOWED_BILLING_ROLES.includes(role)) && (
											<>
												{item?.process === "New" &&
													userRoles.some((role) => ALLOWED_BILLING_ROLES.includes(role)) && (
														<Button
															onClick={() => handleTest(item.hms_invoice_transaction_id)}
															size="xs"
															bg="var(--theme-primary-color-6)"
															color="white"
														>
															{t("Process")}
														</Button>
													)}
												{item?.process === "Done" && (
													<>
														<Button
															onClick={() => handleDetailsView(item)}
															size="xs"
															bg="var(--theme-primary-color-6)"
															color="white"
														>
															{t("Show")}
														</Button>
														 <Button
															onClick={() =>
																handlePrint(
																	item.hms_invoice_transaction_id
																)
															}
															size="xs"
															bg="var(--theme-secondary-color-6)"
															color="white"
														>
															{t("Print")}
														</Button>
													</>
												)}
											</>
										)}
									</Flex>
								</Box>
							))}
						</Stack>
					</ScrollArea>
				</>
			) : (
				<Stack h={mainAreaHeight - 52} bg="var(--mantine-color-body)" align="center" justify="center" gap="md">
					<Box>{t("NoPatientSelected")}</Box>
				</Stack>
			)}
			<InvoicePosBN data={invoicePrintData} ref={invoicePrintRef} />
			{/*<IPDAllPrint data={test} ref={ipdAllPrintRef} />*/}

			<GlobalDrawer
				size="75%"
				opened={invoiceDetailsOpened}
				close={closeInvoiceDetails}
				title={t("InvoiceDetails")}
			>
				<ScrollArea>
					<Table mt="sm" striped highlightOnHover withTableBorder withColumnBorders>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>{t("S/N")}</Table.Th>
								<Table.Th>{t("ItemName")}</Table.Th>
								<Table.Th>{t("Quantity")}</Table.Th>
								<Table.Th>{t("Price")}</Table.Th>
								<Table.Th>{t("SubTotal")}</Table.Th>
								<Table.Th>{t("Process")}</Table.Th>
								<Table.Th>{t("Room")}</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{selectedInvoice?.items?.map((item, index) => (
								<Table.Tr key={index}>
									<Table.Td>{index + 1}</Table.Td>
									<Table.Td>{item.item_name}</Table.Td>
									<Table.Td>{item.quantity}</Table.Td>
									<Table.Td>{item.price}</Table.Td>
									<Table.Td>{item.sub_total}</Table.Td>
									<Table.Td>{item.process}</Table.Td>
									<Table.Td>{item.diagnostic_room_name || "-"}</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				</ScrollArea>
			</GlobalDrawer>
		</Box>
	);
}
