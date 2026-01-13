import { Box, Divider, Flex, Text } from "@mantine/core";

export default function BillingSummary({ entity, data }) {

	const total = Number(entity.total ?? 0);
	const amount = Number(entity.amount ?? 0);
	const refund = Number(entity.refund_amount ?? 0);
	const due = total - (amount - refund);

	return (
		<Box p="xs" bg="var(--theme-primary-color-0)">
			<Text bg={'green'} c={'white'} fz={'md'} p={'xs'}>Room/Bed Summary</Text>
			<Box bg="var(--mantine-color-white)" p="xs">
				<Flex justify="space-between" align={'center'}>
					<Text>Admission</Text>
					<Text>{entity.admission_day} Days</Text>
					<Text>৳ {entity.admission_day * entity?.room_price}</Text>
				</Flex>
				{entity?.is_free_bed !== 1 && (
				<Flex justify="space-between" align={'center'}>
					<Text>Payment</Text>
					<Text>{entity.consume_day} Days </Text>
					<Text>৳ {entity.consume_day  * entity?.room_price}</Text>
				</Flex>
				)}
				{entity.remaining_day > 0 && (
					<>
						<Divider my="xs" />
						<Flex justify="space-between" align={'center'}>
							<Text>Payable</Text>
							<Text>{entity.remaining_day} Days </Text>
							<Text>৳ {entity.remaining_day  * entity?.room_price}</Text>
						</Flex>
					</>
					)}
				{entity.remaining_day < 0 && due < 0   && (
					<>
						<Divider my="xs" />
						<Flex justify="space-between"  align={'center'}>
							<Text>Refund</Text>
							<Text>{entity.remaining_day} Days </Text>
							<Text>৳ {entity.remaining_day  * entity?.room_price}</Text>
						</Flex>
					</>
				)}
				<Divider my="xs" />
				{due > 0 && (
					<Flex  c="white" justify="space-between" bg="var(--theme-secondary-color-8)" py="les" px="3xs">
						<Text>Receive</Text>
						<Text>৳ {due}</Text>
					</Flex>
				)}
				{due < 0 && (
					<Flex  c="white" justify="space-between" bg="red" py="les" px="3xs">
						<Text>Refund</Text>
						<Text>৳ {due}</Text>
					</Flex>
				)}

			</Box>
		</Box>
	);
}
