import React from "react";
import { useTranslation } from "react-i18next";
import { getPrescriptionFormInitialValues } from "./helpers/request";
import { useOutletContext } from "react-router-dom";
import { useForm } from "@mantine/form";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import Navigation from "@components/layout/Navigation";
import { Box, Flex, Grid } from "@mantine/core";
import PatientInformation from "./common/PatientInformation";

export default function PrescriptionIndex() {
	const { t } = useTranslation();
	const form = useForm(getPrescriptionFormInitialValues(t));
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
								<PatientInformation />
							</Grid.Col>
							<Grid.Col span={16}></Grid.Col>
						</Grid>
					</Flex>
				</Box>
			)}
		</>
	);
}
