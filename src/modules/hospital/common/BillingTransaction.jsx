import {Box, Divider, Flex, ScrollArea, Table, Text} from "@mantine/core";

export default function BillingTransaction({ entity, data }) {
	const transactions = entity?.invoice_transaction;
	return (
		<ScrollArea h={200}>
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
					<Table.Th>Created</Table.Th>
					<Table.Th ta={'right'}>Amount</Table.Th>
				</Table.Tr>
			</Table.Thead>
			<Table.Tbody>
				{transactions?.length > 0 &&
				transactions.map((item, index) => (
					<Table.Tr style={{ border: "1px solid var(--theme-tertiary-color-2)" }}>
						<Table.Td>{index + 1}.</Table.Td>
						<Table.Td>{item?.created}</Table.Td>
						<Table.Td ta={'right'}>{item?.sub_total}</Table.Td>
					</Table.Tr>
				))}
			</Table.Tbody>
		</Table>
		</ScrollArea>
	);
}
