import { Flex, Pagination, Text } from "@mantine/core";

export default function PaginationBottomSection({ perPage, page, totalPages, handlePageChange, total }) {
	const message = `${perPage * (page - 1) + 1} – ${Math.min(total, perPage * page)} of ${total}`;

	return (
		<Flex align="center" justify="space-between" gap="sm">
			<Text size="sm">{message}</Text>
			<Pagination total={totalPages} value={page} onChange={handlePageChange} withPages={false} />
		</Flex>
	);
}
