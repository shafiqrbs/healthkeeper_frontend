import React from "react";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import { Box, Grid, Progress } from "@mantine/core";
import Navigation from "@/common/components/layout/Navigation";
import HeaderCarousel from "./common/HeaderCarousel";
import Overview from "./common/Overview";
import QuickBrowse from "./common/QuickBrowse";
import GrandTotalOverview from "./common/GrandTotalOverview";
import SparkLineOverview from "./common/SparkLineOverview";

export default function HomeIndex({ height }) {
	const progress = useGetLoadingProgress();

	return (
		<>
			{progress !== 100 ? (
				<Progress
					color="var(--theme-primary-color-7)"
					size="sm"
					striped
					animated
					value={progress}
					transitionDuration={200}
				/>
			) : (
				<Box p="md">
					<Grid columns={36} gutter={{ base: "md" }}>
						<Grid.Col span={2}>
							<Navigation module="home" mainAreaHeight={height - 12} />
						</Grid.Col>
						<Grid.Col span={34}>
							{/* ================= carousel part ================== */}
							<HeaderCarousel />
							{/* ================= overviews part ================== */}
							<Grid columns={40} mt="md" gutter={{ base: "md" }}>
								<Grid.Col span={20}>
									<Overview />
								</Grid.Col>
								<Grid.Col span={20}>
									<QuickBrowse />
								</Grid.Col>
								<Grid.Col span={20}>
									<GrandTotalOverview />
								</Grid.Col>
								<Grid.Col span={20}>
									<SparkLineOverview />
								</Grid.Col>
							</Grid>
						</Grid.Col>
					</Grid>
				</Box>
			)}
		</>
	);
}
