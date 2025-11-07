import { Box, Flex, Table, Text } from "@mantine/core";
import { IconCoinTaka } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

export default function CollectionTable({ data, columns, title, stripedColor = "var(--theme-primary-color-0)" }) {
	const { t } = useTranslation();

	const rows = data?.map((item, index) => (
		<Table.Tr key={item.id || index}>
			{columns.map((column, colIndex) => {
				const isLastColumn = columns.length - 1 === colIndex;
				return (
					<Table.Td align={isLastColumn ? "right" : "left"} key={colIndex}>
						{isLastColumn ? (
							<Flex align="center" gap="3xs" justify="flex-end">
								<IconCoinTaka size={16} color="var(--theme-primary-color-6)" />
								<Text fz="sm">{item[column.key] || "0"}</Text>
							</Flex>
						) : (
							<>{item[column.key] || "-"}</>
						)}
					</Table.Td>
				);
			})}
		</Table.Tr>
	));

	return (
		<Box my="lg">
			{title && (
				<Box mb="3xs">
					<Text fz="sm" fw={600}>
						{t(title)}
					</Text>
				</Box>
			)}
			<Box className="borderRadiusAll">
				<Table stickyHeader striped stripedColor={stripedColor}>
					<Table.Thead>
						<Table.Tr>
							{columns.map((column, index) => {
								const isLastColumn = columns.length - 1 === index;
								return (
									<Table.Th
										key={index}
										tt="capitalize"
										width="350px"
										ta={isLastColumn ? "right" : "left"}
										align={isLastColumn ? "right" : "left"}
									>
										{t(column.label)}
									</Table.Th>
								);
							})}
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>{rows}</Table.Tbody>
				</Table>
			</Box>
		</Box>
	);
}
