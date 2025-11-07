import { Box, Grid } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress.js";
import Navigation from "@components/layout/Navigation";
import Form from "./form/_Form.jsx";
import _SalesPurchaseHeaderNavbar from "../domain/configuration/_SalesPurchaseHeaderNavbar.jsx";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton.jsx";
import useDomainConfig from "@hooks/config-data/useDomainConfig.js";
import { MODULES } from "@/constants/index.js";
import CoreHeaderNavbar from "@modules/core/CoreHeaderNavbar";
import { useOutletContext } from "react-router-dom";

const module = MODULES.DOMAIN;

export default function Index() {
	const { t } = useTranslation();
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();
	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
			) : (
				<>
					<CoreHeaderNavbar
						module="core"
						pageTitle={t("ManageConfiguration")}
						roles={t("Roles")}
						allowZeroPercentage=""
						currencySymbol=""
					/>
					<Box p="3xs">
						<Grid columns={24} gutter={{ base: 2 }}>
							<Grid.Col span={1}>
								<Navigation mainAreaHeight={mainAreaHeight} module="base" subModule={""} />
							</Grid.Col>
							<Grid.Col span={23}>
								<Form module={module} />
							</Grid.Col>
						</Grid>
					</Box>
				</>
			)}
		</>
	);
}
