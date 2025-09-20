import { Box, Flex, Grid } from "@mantine/core";
import Navigation from "@components/layout/Navigation";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MODULES } from "@/constants";
import Table from "./Table";

const module = MODULES.VISIT;

export default function Index() {
	const { t } = useTranslation();
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();

	return (
		<>
			<Table module={module} height={mainAreaHeight - 156} />
		</>
	);
}
