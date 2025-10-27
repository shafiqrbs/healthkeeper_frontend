import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import Navigation from "@components/layout/Navigation";
import { ActionIcon, Box, Flex, Grid, Input, LoadingOverlay, Stack, Text } from "@mantine/core";
import { getDataWithoutStore } from "@/services/apiService";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { IconSearch, IconBarcode } from "@tabler/icons-react";
import { useForm } from "@mantine/form";


import Table from "./_Table";

export default function Index() {
	const { t } = useTranslation();
	const progress = useGetLoadingProgress();
	const { id } = useParams();
	const { mainAreaHeight } = useOutletContext();
	const [diagnosticReport, setDiagnosticReport] = useState([]);
	const navigate = useNavigate();
	const [fetching, setFetching] = useState(false);
	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
			) : (
				<Box p="md">
					<Flex w="100%" gap="sm">
						<Navigation module="home" mainAreaHeight={mainAreaHeight} />
						<Box w="100%" >
							<Table />
						</Box>
					</Flex>
				</Box>
			)}
		</>
	);
}
