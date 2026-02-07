import useMainAreaHeight from "@hooks/useMainAreaHeight";
import { Box, Grid, Skeleton } from "@mantine/core";

export default function ConfigSkeleton() {
	const { mainAreaHeight } = useMainAreaHeight();

	return (
		<Box p="md">
			<Grid columns={30} gutter="md">
				<Grid.Col span={10}>
					<Skeleton height={mainAreaHeight} />
				</Grid.Col>
				<Grid.Col span={10}>
					<Skeleton height={mainAreaHeight} />
				</Grid.Col>
				<Grid.Col span={10}>
					<Skeleton height={mainAreaHeight} />
				</Grid.Col>
			</Grid>
		</Box>
	);
}
