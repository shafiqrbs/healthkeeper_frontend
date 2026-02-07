import { Box, Flex, Grid } from "@mantine/core";
import Navigation from "@components/layout/Navigation";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import { MODULES } from "@/constants";
import Table from "./Table";
import useMainAreaHeight from "@hooks/useMainAreaHeight";

const module = MODULES.VISIT;

export default function Index() {
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useMainAreaHeight();
	const height = mainAreaHeight - 156

	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
			) : (
				<Box p="md">
					<Flex w="100%" gap="sm">
						<Navigation module="home" />
						<Grid w="100%" columns={24}>
							<Grid.Col span={24}>
								<Table module={module} height={height} />
							</Grid.Col>
						</Grid>
					</Flex>
				</Box>
			)}
		</>
	);
}
