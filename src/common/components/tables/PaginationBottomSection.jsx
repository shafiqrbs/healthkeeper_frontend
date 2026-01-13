import { Flex, Pagination, Text } from "@mantine/core";

export default function PaginationBottomSection({
	isCompact = false,
	perPage,
	page,
	totalPages,
	handlePageChange,
	total,
}) {
	const message = `${total > 0 ? perPage * (page - 1) + 1 : 0} – ${Math.min(
		total,
		perPage * page
	)} of ${total}`;

	return (
		<Flex mih={32} align="center" justify="space-between" p={isCompact ? undefined : "sm"} gap="sm">
			{!isCompact && <Text size="sm">{message}</Text>}
			<Pagination total={totalPages} value={page} onChange={handlePageChange} withPages={false} />
		</Flex>
	);
}
