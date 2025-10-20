import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@mantine/hooks";

import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import CoreHeaderNavbar from "@modules/core/CoreHeaderNavbar";
import Navigation from "@components/layout/Navigation";
import { useOutletContext } from "react-router-dom";
import { MODULES_PHARMACY } from "@/constants";

import Table from "./_Table";

const module = MODULES_PHARMACY.WORKORDER;

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
						pageTitle={t("ManageWorkorder")}
						roles={t("Roles")}
						allowZeroPercentage=""
						currencySymbol=""
					/>
					<Box p="8">
						<Grid columns={36} gutter={{ base: 8 }}>
							{!matches && (
								<Grid.Col span={6}>
									<Navigation
										menu="base"
										subMenu={"basePharmacySubmenu"}
										mainAreaHeight={mainAreaHeight}
									/>
								</Grid.Col>
							)}
							<Grid.Col span={30}>
								<Box bg="white" p="xs" className="borderRadiusAll">
									<Table module={module} />
								</Box>
							</Grid.Col>
						</Grid>
					</Box>
				</>
			)}
		</>
	);
}
