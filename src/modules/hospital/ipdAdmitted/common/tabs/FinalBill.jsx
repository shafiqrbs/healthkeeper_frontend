import { Box, Grid, ScrollArea, Table } from "@mantine/core";
import TabSubHeading from "@hospital-components/TabSubHeading";
import BillingTable from "@hospital-components/BillingTable";
import { useOutletContext, useParams } from "react-router-dom";
import BillingSummary from "@hospital-components/BillingSummary";
import BillingActions from "@hospital-components/BillingActions";

const billing = {
	cabinCharge: 1000,
	otherCharge: 2000,
	testCharge: 3000,
	medicineCharge: 4000,
	totalCharge: 10000,
};

const billingSummary = {
	totalAmount: 10000,
	discount: 10000,
	grandTotal: 0,
	receivedAmount: 0,
	receivable: 3220,
};

const finalBillDetails = [
	{ particular: "Cabin - 1", unitPrice: 1000, qty: 5, subtotal: "৳ 10000" },
	{ particular: "ICU - 202", unitPrice: 5000, qty: 5, subtotal: "৳ 10000" },
	{ particular: "CBC", unitPrice: 400, qty: 5, subtotal: "৳ 1200" },
];

export default function FinalBill() {
	const { mainAreaHeight } = useOutletContext();
	const { id } = useParams();
	console.log("id", id);

	const rows = finalBillDetails.map((item, index) => (
		<Table.Tr key={index}>
			<Table.Td>{item.particular}</Table.Td>
			<Table.Td>৳ {item.unitPrice}</Table.Td>
			<Table.Td>{item.qty}</Table.Td>
			<Table.Td>{item.subtotal}</Table.Td>
		</Table.Tr>
	));

	return (
		<Box h={mainAreaHeight - 63} p="xs">
			<Grid columns={24} gutter="xs" h="100%" styles={{ inner: { height: "100%" } }}>
				<Grid.Col span={8}>
					<Box className="borderRadiusAll" h="100%">
						<TabSubHeading title="Final Bill" />
						{id && <BillingTable data={billing} />}
					</Box>
				</Grid.Col>
				<Grid.Col span={16}>
					<Box className="borderRadiusAll" h="100%">
						<TabSubHeading title="Final Bill Details" />
						<Box p="xs">
							<ScrollArea h={mainAreaHeight - 520}>
								{id && (
									<Table>
										<Table.Thead bg="var(--theme-primary-color-0)">
											<Table.Tr>
												<Table.Th>Particular</Table.Th>
												<Table.Th>Unit Price</Table.Th>
												<Table.Th>Quantity</Table.Th>
												<Table.Th>Subtotal</Table.Th>
											</Table.Tr>
										</Table.Thead>
										<Table.Tbody>{rows}</Table.Tbody>
									</Table>
								)}
							</ScrollArea>
							<Box>
								<BillingSummary data={billingSummary} />
								<BillingActions />
							</Box>
						</Box>
					</Box>
				</Grid.Col>
			</Grid>
		</Box>
	);
}
