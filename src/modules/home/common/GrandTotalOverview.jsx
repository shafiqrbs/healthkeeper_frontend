import React from "react";
import { Card, Flex, NumberFormatter, Table, Text } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

const elements = [
	{ value: 12000, name: "totalSales" },
	{ value: 0, name: "salesReceived" },
	{ value: 0, name: "commission" },
	{ value: 0, name: "return" },
	{ value: 0, name: "dueReceived" },
];

export default function GrandTotalOverview() {
	const { t } = useTranslation();

	const rows = elements.map((element) => (
		<Table.Tr key={element.name}>
			<Table.Td fw={500} pl="lg">
				{t(element.name)}
			</Table.Td>
			<Table.Td fw={500} w={100}>
				<Flex justify="center" align="center" gap="xs">
					<NumberFormatter thousandSeparator decimalScale={0} fixedDecimalScale value={element.value} />
				</Flex>
			</Table.Td>
			<Table.Td w={80}>
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
					<IconArrowRight size={14} color="var(--theme-secondary-color-8)" />
				</Flex>
			</Table.Td>
		</Table.Tr>
	));

	return (
		<Card padding={0} radius="sm" h="100%">
			<Card.Section h={32} withBorder component="div" bg="var(--theme-primary-color-7)">
				<Flex align="center" h="100%" px="lg">
					<Text pb={0} fz="sm" c="white" fw={500}>
						{t("overview")}
					</Text>
				</Flex>
			</Card.Section>

			<Table striped my="les">
				<Table.Tbody>{rows}</Table.Tbody>
				<Table.Tfoot>
					<Table.Tr bg="var(--theme-primary-color-9)">
						<Table.Td>
							<Text pl="xs" fz="sm" c="white">
								{t("total")}
							</Text>
						</Table.Td>
						<Table.Td>
							<Flex c="white" justify="center" align="center" gap="xs">
								<NumberFormatter thousandSeparator decimalScale={0} fixedDecimalScale value={12000} />
							</Flex>
						</Table.Td>
						<Table.Td></Table.Td>
					</Table.Tr>
				</Table.Tfoot>
			</Table>
		</Card>
	);
}
