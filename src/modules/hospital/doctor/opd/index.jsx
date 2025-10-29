import { Grid } from "@mantine/core";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import { useOutletContext, useParams } from "react-router-dom";
import { MODULES } from "@/constants";
import Table from "./Table";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import Prescription from "./_Prescription";

const module = MODULES.VISIT;

export default function Index() {
	const { prescriptionId } = useParams();
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();

	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
			) : (
				<Grid w="100%" columns={24}>
					<Grid.Col span={24}>
						{prescriptionId ? <Prescription /> : <Table module={module} height={mainAreaHeight - 140} />}
					</Grid.Col>
				</Grid>
			)}
		</>
	);
}
