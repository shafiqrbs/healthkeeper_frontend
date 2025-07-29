import { Box, Divider, Flex, Text } from "@mantine/core";

export default function BillingSummary({ data }) {
	return (
		<Box p="xs" bg="var(--theme-primary-color-0)">
			<Box bg="white" p="xs">
				<Flex justify="space-between">
					<Text>Total Amount: </Text>
					<Text>৳ {data.totalAmount}</Text>
				</Flex>{" "}
				<Flex justify="space-between">
					<Text>Discount: </Text>
					<Text>৳ {data.discount}</Text>
				</Flex>
				<Divider my="xs" />
				<Flex justify="space-between">
					<Text>Grand Total: </Text>
					<Text>৳ {data.grandTotal}</Text>
				</Flex>
				<Flex justify="space-between">
					<Text>Received: </Text>
					<Text>৳ {data.receivedAmount}</Text>
				</Flex>
				<Divider my="xs" />
				<Flex justify="space-between">
					<Text>Receivable: </Text>
					<Text>৳ {data.receivable}</Text>
				</Flex>
			</Box>
		</Box>
	);
}
