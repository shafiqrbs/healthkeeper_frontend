import { Box, Grid, Skeleton, Stack } from "@mantine/core";

export default function HomeSkeleton({ height }) {
	return (
		<Grid columns={34} gutter="md" p="md">
			<Grid.Col span={2}>
				<Skeleton height={height} />
			</Grid.Col>
			<Grid.Col span={32}>
				<Stack h={height}>
					<Grid columns={24} gutter="md">
						<Grid.Col span={6}>
							<Skeleton height={120} />
						</Grid.Col>
						<Grid.Col span={6}>
							<Skeleton height={120} />
						</Grid.Col>
						<Grid.Col span={6}>
							<Skeleton height={120} />
						</Grid.Col>
						<Grid.Col span={6}>
							<Skeleton height={120} />
						</Grid.Col>
					</Grid>
					<Grid columns={12} gutter="md">
						<Grid.Col span={6} h={height}>
							<Skeleton height="100%" />
						</Grid.Col>
						<Grid.Col span={6} h={height}>
							<Skeleton height="100%" />
						</Grid.Col>
					</Grid>
				</Stack>
			</Grid.Col>
		</Grid>
	);
}
