import { Box, Flex } from "@mantine/core";
import Table from "../_Table";
import { MODULES } from "@/constants";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import { useOutletContext } from "react-router-dom";
import Navigation from "@components/layout/Navigation";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";

const module = MODULES.VISIT;

export default function ListIndex() {
	const { mainAreaHeight } = useOutletContext();
	const progress = useGetLoadingProgress();
	const height = mainAreaHeight - 160;

	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
			) : (
				<Box p="md">
					<Flex w="100%" gap="sm">
						<Navigation module="home" mainAreaHeight={mainAreaHeight} />
						<Box w="100%">
							<Table module={module} height={height} />
						</Box>
					</Flex>
				</Box>
			)}
		</>
	);
}
