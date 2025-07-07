import React from "react";
import { Card, Flex, NumberFormatter, Table, Text } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";

const elements = [
	{ value: 12000, name: "Total Sales" },
	{ value: 0, name: "Sales Received" },
	{ value: 0, name: "Commission" },
	{ value: 0, name: "Return" },
	{ value: 0, name: "Due Received" },
];

export default function GrandTotalOverview() {
	const rows = elements.map((element) => (
		<Table.Tr key={element.name}>
			<Table.Td fw={500}>{element.name}</Table.Td>
			<Table.Td fw={500}>
				<Flex justify="center" align="center" gap="xs">
					<NumberFormatter
						thousandSeparator
						decimalScale={0}
						fixedDecimalScale
						value={element.value}
					/>
				</Flex>
			</Table.Td>
			<Table.Td>
				<Flex
					h={22}
					w={22}
					align="center"
					justify="center"
					gap="xs"
					bd="1px solid var(--theme-secondary-color-3)"
					bg="white"
					style={{ cursor: "pointer", borderRadius: "50%" }}
				>
					<IconArrowRight size={14} color="var(--mantine-color-green-8)" />
				</Flex>
			</Table.Td>
		</Table.Tr>
	));

	return (
		<Card px={0} radius="sm">
			<Card.Section
				px="sm"
				h={32}
				withBorder
				component="div"
				bg="var(--theme-primary-color-7)"
			>
				<Flex align="center" h="100%" px="lg">
					<Text pb={0} fz="sm" c="white" fw={500}>
						Overview
					</Text>
				</Flex>
			</Card.Section>

			<Table striped my="les">
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>
		</Card>
	);
}
