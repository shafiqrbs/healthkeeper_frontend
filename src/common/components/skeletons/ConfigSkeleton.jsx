import { Box, Grid, Skeleton } from "@mantine/core";
import { useOutletContext } from "react-router-dom";

export default function ConfigSkeleton() {
	const { mainAreaHeight } = useOutletContext();

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
