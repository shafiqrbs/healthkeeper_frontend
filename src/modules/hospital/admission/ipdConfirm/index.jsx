import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import Navigation from "@components/layout/Navigation";
import { Box, Flex } from "@mantine/core";
import { MODULES } from "@/constants";
import Table from "./_Table";
import useMainAreaHeight from "@hooks/useMainAreaHeight";

const module = MODULES.ADMISSION;

export default function Index() {
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useMainAreaHeight();

	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
			) : (
				<Box p="md">
					<Flex w="100%" gap="sm">
						<Navigation module="home" />
						<Table module={module} height={mainAreaHeight - 158} />
					</Flex>
				</Box>
			)}
		</>
	);
}
