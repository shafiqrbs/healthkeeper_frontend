import React from "react";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import { Box, Flex, Grid, ScrollArea } from "@mantine/core";
import Navigation from "@/common/components/layout/Navigation";
import HeaderCarousel from "./common/HeaderCarousel";
import Overview from "./common/Overview";
import QuickBrowse from "./common/QuickBrowse";
import GrandTotalOverview from "./common/GrandTotalOverview";
import SparkLineOverview from "./common/SparkLineOverview";
import HomeSkeleton from "@components/skeletons/HomeSkeleton";

export default function Index({ height }) {
	const progress = useGetLoadingProgress();

	return (
		<>
			{progress !== 100 ? (
				<HomeSkeleton height={height} />
			) : (
				<Box p="md">
					<Flex w="100%" gap="sm">
						<Navigation module="home" mainAreaHeight={height} />
						{/* ================= carousel part ================== */}
						<Box>
							<HeaderCarousel />
							<ScrollArea mt="md" scrollbars="y" type="never" h={height - 146}>
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
