import { Box, Flex, Stack, Text } from "@mantine/core";

export default function BillingTable({ data }) {
	return (
		<Stack justify="space-between" h="calc(100% - 50px)" gap="0">
			<Box p="les">
				<Flex justify="space-between" bg="var(--theme-primary-color-0)" py="les" px="xxxs" mb="xxxs">
					<Text>Charge</Text>
					<Text>Amount</Text>
				</Flex>
				<Flex justify="space-between" py="les" px="xxxs">
					<Text>Cabin Charge</Text>
					<Text>
						<Box component="span" c="var(--theme-primary-color-7)">
							৳
						</Box>{" "}
						{data.cabinCharge}
					</Text>
				</Flex>
				<Flex justify="space-between" py="les" px="xxxs">
					<Text>Other Charge</Text>
					<Text>
						<Box component="span" c="var(--theme-primary-color-7)">
							৳
						</Box>{" "}
						{data.otherCharge}
					</Text>
				</Flex>
				<Flex justify="space-between" py="les" px="xxxs">
					<Text>Test Charge</Text>
					<Text>
						<Box component="span" c="var(--theme-primary-color-7)">
							৳
						</Box>{" "}
						{data.testCharge}
					</Text>
				</Flex>
				<Flex justify="space-between" py="les" px="xxxs">
					<Text>Medicine Charge</Text>
					<Text>
						<Box component="span" c="var(--theme-primary-color-7)">
							৳
						</Box>{" "}
						{data.medicineCharge}
					</Text>
				</Flex>
				<Flex justify="space-between" py="les" px="xxxs">
					<Text>Total Charge</Text>
					<Text>
						<Box component="span" c="var(--theme-primary-color-7)">
							৳
						</Box>{" "}
						{data.totalCharge}
					</Text>
				</Flex>
			</Box>
			<Box p="xs">
				<Flex justify="space-between" bg="var(--theme-primary-color-0)" py="les" px="xxxs">
					<Text>Total Charge</Text>
					<Text>
						<Box component="span" c="var(--theme-primary-color-7)">
							৳
						</Box>{" "}
						{data.totalCharge}
					</Text>
				</Flex>
			</Box>
		</Stack>
	);
}
