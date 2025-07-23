import React from "react";
import { Box, Flex, Grid } from "@mantine/core";
import Navigation from "@components/layout/Navigation";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import { useOutletContext } from "react-router-dom";
import Form from "./form/_Form";
import VisitTable from "./_Table";
import ActionButtons from "./_ActionButtons";
import { useForm } from "@mantine/form";
import { getVendorFormInitialValues } from "./helpers/request";
import { useTranslation } from "react-i18next";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";

export default function Index() {
	const { t } = useTranslation();
	const form = useForm(getVendorFormInitialValues(t));
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
								<Form form={form} />
							</Grid.Col>
							<Grid.Col span={16}>
								<VisitTable />
								<ActionButtons form={form} />
							</Grid.Col>
						</Grid>
					</Flex>
				</Box>
			)}
		</>
	);
}
