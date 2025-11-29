import { Box, Flex, Grid, Stack, Text } from "@mantine/core";

export default function BillingTable({ entity, data }) {
	const transactions = entity?.invoice_transaction;
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

							<Text ta="left">{item.mode} Charge</Text>

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
		</Stack>
	);
}
