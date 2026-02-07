import { Box, Grid, Skeleton } from "@mantine/core";
import useMainAreaHeight from "@hooks/useMainAreaHeight";

export default function DefaultSkeleton() {
	const { mainAreaHeight } = useMainAreaHeight();

	return (
		<Box p="md">
			<Grid columns={34} gutter="md">
				<Grid.Col span={2}>
					<Skeleton height={mainAreaHeight} />
				</Grid.Col>
				<Grid.Col span={12}>
					<Skeleton height={mainAreaHeight} />
				</Grid.Col>
				<Grid.Col span={20}>
					<Skeleton height={mainAreaHeight} />
				</Grid.Col>
			</Grid>
		</Box>
	);
}
