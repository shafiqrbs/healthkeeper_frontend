import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import ConfigurationForm from "./ConfigurationForm.jsx";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress.js";
import DomainHeaderNavbar from "../DomainHeaderNavbar.jsx";
import useConfigData from "@hooks/config-data/useConfigData.js";

function ConfigurationIndex() {
	const { t } = useTranslation();

	const progress = useGetLoadingProgress();
	const { configData } = useConfigData();
	localStorage.setItem("config-data", JSON.stringify(configData));

	return (
		<>
			{progress !== 100 && (
				<Progress color="var(--theme-primary-color-6)" size={"sm"} striped animated value={progress} />
			)}
			{progress === 100 && (
				<>
					<DomainHeaderNavbar
						pageTitle={t("ConfigurationInformationFormDetails")}
						roles={t("Roles")}
						allowZeroPercentage=""
						currencySymbol=""
					/>
					<Box p={"8"}>
						<Grid columns={24} gutter={{ base: 8 }}>
							<Grid.Col span={24}>
								<ConfigurationForm />
							</Grid.Col>
						</Grid>
					</Box>
				</>
			)}
		</>
	);
}

export default ConfigurationIndex;
