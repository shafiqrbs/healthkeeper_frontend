import { Sparkline } from "@mantine/charts";
import { Card } from "@mantine/core";

export default function SparkLineOverview() {
	return (
		<Card padding="lg" radius="sm">
			<Sparkline
				w="100%"
				h={105}
				data={[10, 20, 40, 20, 40, 10, 50]}
				curveType="linear"
				color="blue"
				fillOpacity={0.6}
				strokeWidth={0.5}
			/>
		</Card>
	);
}
