import { useOutletContext } from "react-router-dom";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import Navigation from "@components/layout/Navigation";
import { Box, Flex } from "@mantine/core";

import Table from "./_Table";

export default function Index() {
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();
	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
			) : (
				<Box p="md">
					<Flex w="100%" gap="sm">
						<Navigation module="home" mainAreaHeight={mainAreaHeight} />
						<Box w="100%">
							<Table height={mainAreaHeight} />
						</Box>
					</Flex>
				</Box>
			)}
		</>
	);
}
