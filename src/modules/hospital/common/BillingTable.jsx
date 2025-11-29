import { Box, Flex, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { getDataWithoutStore } from "@/services/apiService";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import GlobalDrawer from "@components/drawers/GlobalDrawer";
import { ScrollArea } from "@mantine/core";
import { Table } from "@mantine/core";
import { useTranslation } from "react-i18next";

export default function BillingTable({ entity }) {
	const { t } = useTranslation();
	const [selectedInvoice, setSelectedInvoice] = useState(null);
	const [invoiceDetailsOpened, { open: openInvoiceDetails, close: closeInvoiceDetails }] = useDisclosure(false);
	const transactions = entity?.invoice_transaction;

	const handleDetailsView = async (transactionId) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.BILLING.PRINT}/${transactionId}`,
		});
		setSelectedInvoice(res.data);
		requestAnimationFrame(openInvoiceDetails);
	};

	return (
		<Stack justify="space-between" h="calc(100% - 50px)" gap="0">
			<Box p="les">
				<Flex justify="space-between" bg="var(--theme-primary-color-0)" py="les" px="3xs" mb="3xs">
					<Text>Created</Text>
					<Text>Particular</Text>
					<Text>Amount</Text>
				</Flex>
				{transactions?.length > 0 &&
					transactions.map((item, index) => (
						<Flex key={index} justify="space-between" py="les" px="3xs">
							<Text>
								{index + 1}. {item.created}
							</Text>

							<Text
								className="cursor-pointer"
								onClick={() => handleDetailsView(item.hms_invoice_transaction_id)}
								ta="left"
							>
								{item.mode} Charge
							</Text>

							<Text>
								<Box component="span" c="var(--theme-primary-color-7)">
									৳
								</Box>{" "}
								{item.sub_total}
							</Text>
						</Flex>
					))}
			</Box>
			<Box p="xs">
				<Flex justify="space-between" bg="var(--theme-primary-color-0)" py="les" px="3xs">
					<Text>Total Charge</Text>
					<Text>
						<Box component="span" c="var(--theme-primary-color-7)">
							৳
						</Box>{" "}
						{entity?.total}
					</Text>
				</Flex>
			</Box>
			<GlobalDrawer opened={invoiceDetailsOpened} close={closeInvoiceDetails} title={t("InvoiceDetails")}>
				<ScrollArea>
					<Stack gap="md" mt="sm">
						<Box p="md" bg="var(--theme-primary-color-0)" style={{ borderRadius: "4px" }}>
							<Stack gap="xs">
								<Flex justify="space-between">
									<Text fw={500}>{t("Amount")}:</Text>
									<Text>
										{selectedInvoice?.amount ? (
											<>
												<Box component="span" c="var(--theme-primary-color-7)">
													৳
												</Box>{" "}
												{selectedInvoice.amount}
											</>
										) : (
											"N/A"
										)}
									</Text>
								</Flex>
								<Flex justify="space-between">
									<Text fw={500}>{t("SubTotal")}:</Text>
									<Text>
										{selectedInvoice?.sub_total ? (
											<>
												<Box component="span" c="var(--theme-primary-color-7)">
													৳
												</Box>{" "}
												{selectedInvoice.sub_total}
											</>
										) : (
											"N/A"
										)}
									</Text>
								</Flex>
								<Flex justify="space-between">
									<Text fw={500}>{t("Total")}:</Text>
									<Text>
										{selectedInvoice?.total ? (
											<>
												<Box component="span" c="var(--theme-primary-color-7)">
													৳
												</Box>{" "}
												{selectedInvoice.total}
											</>
										) : (
											"N/A"
										)}
									</Text>
								</Flex>
								<Flex justify="space-between">
									<Text fw={500}>{t("Discount")}:</Text>
									<Text>
										{selectedInvoice?.discount ? (
											<>
												<Box component="span" c="var(--theme-primary-color-7)">
													৳
												</Box>{" "}
												{selectedInvoice.discount}
											</>
										) : (
											"0"
										)}
									</Text>
								</Flex>
								<Flex justify="space-between">
									<Text fw={500}>{t("VAT")}:</Text>
									<Text>
										{selectedInvoice?.vat ? (
											<>
												<Box component="span" c="var(--theme-primary-color-7)">
													৳
												</Box>{" "}
												{selectedInvoice.vat}
											</>
										) : (
											"0"
										)}
									</Text>
								</Flex>
								<Flex justify="space-between">
									<Text fw={500}>{t("RoomName")}:</Text>
									<Text>{selectedInvoice?.room_name || "N/A"}</Text>
								</Flex>
							</Stack>
						</Box>

						<Table striped highlightOnHover withTableBorder withColumnBorders>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>{t("ItemName")}</Table.Th>
									<Table.Th>{t("Quantity")}</Table.Th>
									<Table.Th>{t("Process")}</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{selectedInvoice?.items.length ? (
									selectedInvoice?.items?.map((item, index) => (
										<Table.Tr key={index}>
											<Table.Td>{item.item_name}</Table.Td>
											<Table.Td>{item.quantity}</Table.Td>
											<Table.Td>{item.process}</Table.Td>
										</Table.Tr>
									))
								) : (
									<Table.Tr>
										<Table.Td colSpan={3}>{t("NoDataFound")}</Table.Td>
									</Table.Tr>
								)}
							</Table.Tbody>
						</Table>
					</Stack>
				</ScrollArea>
			</GlobalDrawer>
		</Stack>
	);
}
