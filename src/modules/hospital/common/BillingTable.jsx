import { Box, Flex, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { getDataWithoutStore } from "@/services/apiService";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import GlobalDrawer from "@components/drawers/GlobalDrawer";
import { ScrollArea } from "@mantine/core";
import { Table } from "@mantine/core";
import { useTranslation } from "react-i18next";
import {useOutletContext} from "react-router-dom";

export default function BillingTable({ entity }) {
	const { t } = useTranslation();
	const [selectedInvoice, setSelectedInvoice] = useState(null);
	const [invoiceDetailsOpened, { open: openInvoiceDetails, close: closeInvoiceDetails }] = useDisclosure(false);
	const { mainAreaHeight } = useOutletContext();
	//const transactions = entity?.invoice_transaction;
	const transactions = entity?.invoice_particular;

	const handleDetailsView = async (transactionId) => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.BILLING.PRINT}/${transactionId}`,
		});
		setSelectedInvoice(res.data);
		requestAnimationFrame(openInvoiceDetails);
	};

	return (

		<Stack justify="space-between" h="calc(100% - 50px)" gap="0">
			<Box>
				<ScrollArea h={mainAreaHeight-100}>
				<Table
					style={{
						borderCollapse: "collapse",
						width: "100%",
					}}
					className="customTable"
				>
					<Table.Thead>
						<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-2)" }}>
							<Table.Th>S/N</Table.Th>
							<Table.Th>Name</Table.Th>
							<Table.Th ta={'center'}>Unit</Table.Th>
							<Table.Th ta={'right'}>Refund</Table.Th>
							<Table.Th ta={'right'}>Amount</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{transactions?.length > 0 &&
						transactions.map((item, index) => (
						<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-2)" }}>
							<Table.Td>{index + 1}.</Table.Td>
							<Table.Td>{item?.name}</Table.Td>
							<Table.Td ta={'center'}>{item?.quantity}</Table.Td>
							<Table.Td ta={'right'}>{item?.refund_amount}</Table.Td>
							<Table.Td ta={'right'}>{item?.sub_total-item?.refund_amount}</Table.Td>
						</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
				</ScrollArea>
			</Box>
			<Box p="xs">
				<Flex justify="space-between" bg="var(--theme-primary-color-8)" py="les" px="3xs">
					<Text c="white" fw={600}>Total Charge</Text>
					<Text c="white" fw={600}>
						<Box fw={600} component="span" c="white">
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
