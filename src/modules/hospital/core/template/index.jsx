import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@mantine/hooks";

import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import CoreHeaderNavbar from "@modules/core/CoreHeaderNavbar";
import Navigation from "@components/layout/Navigation";
import { useOutletContext } from "react-router-dom";
import _Table from "./_Table";
import { MODULES_CORE } from "@/constants";
import Details from "./Details";

const module = MODULES_CORE.PARTICULAR;

export default function Index({ mode }) {
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
						pageTitle={t("ManageTemplate")}
						roles={t("Roles")}
						allowZeroPercentage=""
						currencySymbol=""
					/>
					<Box p="8">
						<Grid columns={36} gutter={{ base: 8 }}>
							{!matches && (
								<Grid.Col span={6}>
									<Navigation menu="base" subMenu={"baseSubmenu"} mainAreaHeight={mainAreaHeight} />
								</Grid.Col>
							)}
							<Grid.Col span={matches ? 30 : 30}>
								<Box bg="white" p="xs" className="borderRadiusAll">
									{mode === "details" ? <Details /> : <_Table module={module} />}
								</Box>
							</Grid.Col>
						</Grid>
					</Box>
				</>
			)}
		</>
	);
}
