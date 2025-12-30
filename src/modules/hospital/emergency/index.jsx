import { Box, Flex, Grid } from "@mantine/core";
import Navigation from "@components/layout/Navigation";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import { useOutletContext } from "react-router-dom";
import Form from "./form/_Form";
import VisitTable from "./_Table";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import { MODULES } from "@/constants";
import useAppLocalStore from "@hooks/useAppLocalStore";

const module = MODULES.EMERGENCY;

export default function Index() {
	const { user } = useAppLocalStore();
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
						<Grid w="100%" columns={24}>
							<Grid.Col span={8}>
								<Form module={module} />
							</Grid.Col>
							<Grid.Col span={16}>
								<VisitTable module={module} />
							</Grid.Col>
						</Grid>
					</Flex>
				</Box>
			)}
		</>
	);
}
