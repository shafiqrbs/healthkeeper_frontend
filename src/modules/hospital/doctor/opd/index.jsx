import Prescription from "./_Prescription";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";

export default function Index() {
	const progress = useGetLoadingProgress();

	return <>{progress !== 100 ? <DefaultSkeleton /> : <Prescription />}</>;
}
