import { Box, Grid, Skeleton } from "@mantine/core";
import { useOutletContext } from "react-router-dom";

export default function DefaultSkeleton() {
	const { mainAreaHeight } = useOutletContext();

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
