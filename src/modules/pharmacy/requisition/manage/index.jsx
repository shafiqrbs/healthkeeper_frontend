import { Box, Grid, Progress, Flex } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@mantine/hooks";

import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import CoreHeaderNavbar from "@modules/core/CoreHeaderNavbar";
import Navigation from "@components/layout/Navigation";
import { useOutletContext } from "react-router-dom";
import { MODULES_PHARMACY } from "@/constants";
import __From from "../form/__Form";

const module = MODULES_PHARMACY.REQUISITION;

export default function Index() {
	const { t } = useTranslation();
	const progress = useGetLoadingProgress();
	const matches = useMediaQuery("(max-width: 64em)");
	const { mainAreaHeight } = useOutletContext();

	return (
		<>
			{progress !== 100 ? (
				<Progress
					color="var(--theme-reset-btn-color)"
					size="sm"
					striped
					animated
					value={progress}
					transitionDuration={200}
				/>
			) : (
				<>
					<CoreHeaderNavbar
						module="core"
						pageTitle={t("ManageRequisition")}
						roles={t("Roles")}
						allowZeroPercentage=""
						currencySymbol=""
					/>
					<Flex p="16px" w="100%" gap="14px">
						{/* <Grid columns={36} gutter={{ base: 8 }}> */}
						{!matches && (
							// <Grid.Col span={6}>
							<Navigation menu="base" subMenu={"basePharmacySubmenu"} mainAreaHeight={mainAreaHeight} />
							// </Grid.Col>
						)}
						{/* <Grid.Col span={30}> */}
						<Box bg="white" w="100%" p="xs" className="borderRadiusAll">
							<__From module={module} />
						</Box>
						{/* </Grid.Col> */}
						{/* </Grid> */}
					</Flex>
				</>
			)}
		</>
	);
}
