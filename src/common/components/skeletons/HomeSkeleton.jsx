import useMainAreaHeight from "@hooks/useMainAreaHeight";
import { Grid, Skeleton, Stack } from "@mantine/core";

export default function HomeSkeleton() {
	const { mainAreaHeight } = useMainAreaHeight();

	return (
		<Grid columns={34} gutter="md" p="md">
			<Grid.Col span={2}>
				<Skeleton height={mainAreaHeight} />
			</Grid.Col>
			<Grid.Col span={32}>
				<Stack h={mainAreaHeight}>
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
						<Grid.Col span={6} h={mainAreaHeight}>
							<Skeleton height="100%" />
						</Grid.Col>
						<Grid.Col span={6} h={mainAreaHeight}>
							<Skeleton height="100%" />
						</Grid.Col>
					</Grid>
				</Stack>
			</Grid.Col>
		</Grid>
	);
}
