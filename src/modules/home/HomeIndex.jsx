import React from "react";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import { Box, Flex, Grid, Progress, ScrollArea, Stack } from "@mantine/core";
import Navigation from "@/common/components/layout/Navigation";
import HeaderCarousel from "./common/HeaderCarousel";
import Overview from "./common/Overview";
import QuickBrowse from "./common/QuickBrowse";
import GrandTotalOverview from "./common/GrandTotalOverview";
import SparkLineOverview from "./common/SparkLineOverview";

export default function HomeIndex({ height }) {
	const progress = useGetLoadingProgress();
	const cardHeight = height - 416;

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
					<Flex w="100%" gap="sm">
						<Navigation module="home" mainAreaHeight={height} />
						{/* ================= carousel part ================== */}
						<Box>
							<HeaderCarousel />
							<ScrollArea
								mt="md"
								scrollbarSize={8}
								scrollbars="y"
								type="never"
								h={height - 146}
							>
								{/* ================= overviews part ================== */}
								<Grid columns={40} gutter={{ base: "md" }}>
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
							</ScrollArea>
						</Box>
					</Flex>
				</Box>
			)}
		</>
	);
}
