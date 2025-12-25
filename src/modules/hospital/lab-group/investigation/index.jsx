import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import Navigation from "@components/layout/Navigation";
import { Box, Flex, Grid, SegmentedControl, Stack, Text } from "@mantine/core";
import TabsWithSearch from "@components/advance-search/TabsWithSearch";
import Table from "./_Table";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import useGetDataWithoutStore from "@/common/hooks/useDataWithoutStore";
import {useForm} from "@mantine/form";
import {getVendorFormInitialValues} from "@modules/hospital/visit/helpers/request";

export default function Index() {
	const { t } = useTranslation();
	const progress = useGetLoadingProgress();
	const { id } = useParams();
	const { mainAreaHeight } = useOutletContext();
	const [isOpenPatientInfo, setIsOpenPatientInfo] = useState(true);
	const [processTab, setProcessTab] = useState("Current");


	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
			) : (
				<Box p="md">
					<Flex w="100%" gap="sm">
						<Navigation module="home" mainAreaHeight={mainAreaHeight} />
						<Table height={mainAreaHeight} />
					</Flex>
				</Box>
			)}
		</>
	);
}
