import { getAdmissionFormInitialValues } from "../helpers/request";
import { useOutletContext, useParams } from "react-router-dom";
import { useForm } from "@mantine/form";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import Navigation from "@components/layout/Navigation";
import { Box, Flex } from "@mantine/core";
import Table from "./_Table";
import EntityForm from "../form/EntityForm";
import { MODULES } from "@/constants";

const module = MODULES.ADMISSION;

export default function Index() {
	const { id } = useParams();
	const form = useForm(getAdmissionFormInitialValues());
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();
	const module = MODULES.ADMISSION;
	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
			) : (
				<Box p="md">
					<Flex w="100%" gap="sm">
						<Navigation module="home" mainAreaHeight={mainAreaHeight} />
						{id ? (
							<Box w="100%">
								<EntityForm form={form} module={module} />
							</Box>
						) : (
							<Table module={module} />
						)}
					</Flex>
				</Box>
			)}
		</>
	);
}
