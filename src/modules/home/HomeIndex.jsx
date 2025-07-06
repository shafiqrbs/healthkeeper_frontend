import React from "react";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import { Box, Grid, Progress } from "@mantine/core";
import Navigation from "@/common/components/layout/Navigation";
import HeaderCarousel from "./common/HeaderCarousel";

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
							<Navigation module="home" mainAreaHeight={height} />
						</Grid.Col>
						<Grid.Col span={34}>
							<HeaderCarousel />
						</Grid.Col>
					</Grid>
				</Box>
			)}
		</>
	);
}
