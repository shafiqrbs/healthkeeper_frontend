import { Box, Divider, Flex, Text } from "@mantine/core";

export default function BillingSummary({ entity, data }) {
	const receive = entity?.remaining_day * entity?.room_price;
	return (
		<Box p="xs" bg="var(--theme-primary-color-0)">
			<Box bg="var(--mantine-color-white)" p="xs">
				<Flex justify="space-between">
					<Text>Admission- ({entity.room_admission_day || 0})Days: </Text>
					<Text>৳ {entity.room_admission_day * entity?.room_price || 0}</Text>
				</Flex>
				<Flex justify="space-between">
					<Text>Payment - ({entity.room_consume_day || 0})Days: </Text>
					<Text>৳ {entity.room_consume_day * entity?.room_price || 0}</Text>
				</Flex>
				<Flex justify="space-between">
					<Text>Payable -({entity.remaining_day || 0})Days: </Text>
					<Text>৳ {entity.remaining_day * entity?.room_price || 0}</Text>
				</Flex>
				<Divider my="xs" />
				<Flex justify="space-between">
					<Text>{receive >= 0 ? "Receivable" : "Refund"} </Text>
					<Text>৳ {receive}</Text>
				</Flex>
			</Box>
		</Box>
	);
}
