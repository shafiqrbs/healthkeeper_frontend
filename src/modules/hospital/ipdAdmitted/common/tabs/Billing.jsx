import { ActionIcon, Badge, Box, Button, Flex, Grid, Group, ScrollArea, Text } from "@mantine/core";
import TabSubHeading from "@hospital-components/TabSubHeading";
import BillingTable from "@hospital-components/BillingTable";
import { useOutletContext } from "react-router-dom";
import { IconX } from "@tabler/icons-react";
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

const billingDetails = [
	{
		id: 1,
		date: "2025-01-01",
		method: "Cash",
		amount: 1000,
	},
	{
		id: 2,
		date: "2025-01-02",
		method: "Cash",
		amount: 3000,
	},

	{
		id: 3,
		date: "2025-01-03",
		method: "Cash",
		amount: 2000,
	},
];

export default function Billing() {
	const { mainAreaHeight } = useOutletContext();

	return (
		<Box h={mainAreaHeight - 63} p="xs">
			<Grid columns={24} gutter="xs" h="100%" styles={{ inner: { height: "100%" } }}>
				<Grid.Col span={8}>
					<Box className="borderRadiusAll" h="100%">
						<TabSubHeading title="Billing" />
						<BillingTable data={billing} />
					</Box>
				</Grid.Col>
				<Grid.Col span={16}>
					<Box className="borderRadiusAll" h="100%">
						<TabSubHeading title="Billing Details" />
						<Box p="xs">
							<ScrollArea h={mainAreaHeight - 520}>
								{billingDetails.map((item) => (
									<Flex key={item.id} gap="xs" mb="xxxs">
										<Text>{item.id}.</Text>
										<Box w="100%">
											<Badge variant="light" size="md" color="var(--theme-secondary-color-7)">
												{item.date}
											</Badge>
											<Flex align="center" justify="space-between">
												<Text mt="es" fz="sm">
													Method: {item.method}
												</Text>
												<Group gap="xxxs">
													<Text variant="light" size="sm">
														৳ {item.amount}
													</Text>
													<Button
														variant="filled"
														size="compact-sm"
														color="var(--theme-primary-color-6)"
													>
														Approve
													</Button>
													<ActionIcon
														variant="light"
														size="md"
														color="var(--theme-error-color)"
													>
														<IconX size={16} stroke={1.5} />
													</ActionIcon>
												</Group>
											</Flex>
										</Box>
									</Flex>
								))}
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
