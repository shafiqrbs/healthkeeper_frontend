import { Box, Divider, Flex, Text } from "@mantine/core";

export default function BillingSummary({ entity, data }) {
	console.log(entity);
	return (
		<Box p="xs" bg="var(--theme-primary-color-0)">
			<Box bg="var(--mantine-color-white)" p="xs">
				<Flex justify="space-between">
					<Text>Admission- ({entity.room_admission_day})Days: </Text>
					<Text>৳ {entity.room_admission_day * 100}</Text>
				</Flex>
				<Flex justify="space-between">
					<Text>Payment - ({entity.room_consume_day})Days: </Text>
					<Text>৳ {entity.room_consume_day * 100}</Text>
				</Flex>
				<Flex justify="space-between">
					<Text>Payable -({entity.remaining_day})Days: </Text>
					<Text>৳ {entity.remaining_day * 100}</Text>
				</Flex>
				<Divider my="xs" />
				<Flex justify="space-between">
					<Text>Total Amount: </Text>
					<Text>৳ {entity?.total}</Text>
				</Flex>{" "}
				<Flex justify="space-between">
					<Text>Received: </Text>
					<Text>৳ {entity?.amount}</Text>
				</Flex>
				<Divider my="xs" />
				<Flex justify="space-between">
					<Text>Receivable: </Text>
					<Text>৳ {entity?.total - entity?.amount}</Text>
				</Flex>
			</Box>
		</Box>
	);
}
