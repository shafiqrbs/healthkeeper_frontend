import { Box, Flex } from "@mantine/core";
import Navigation from "@components/layout/Navigation";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import { useOutletContext } from "react-router-dom";
import Table from "./_Table";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import { MODULES } from "@/constants";

const module = MODULES.ADMISSION;

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

						<Table module={module} />
					</Flex>
				</Box>
			)}
		</>
	);
}
