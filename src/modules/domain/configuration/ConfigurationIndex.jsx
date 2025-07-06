import React from "react";
import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress.js";
import DomainHeaderNavbar from "../DomainHeaderNavbar.jsx";
import useConfigData from "@hooks/config-data/useConfigData.js";
import Form from "./form/_Form.jsx";

function ConfigurationIndex() {
	const { t } = useTranslation();

	const progress = useGetLoadingProgress();
	const { configData } = useConfigData();
	localStorage.setItem("config-data", JSON.stringify(configData));

	return (
		<>
			{progress !== 100 ? (
				<Progress
					color="var(--theme-primary-color-7)"
					size="sm"
					striped
					animated
					value={progress}
				/>
			) : (
				<>
					<DomainHeaderNavbar
						pageTitle={t("ConfigurationInformationFormDetails")}
						roles={t("Roles")}
						allowZeroPercentage=""
						currencySymbol=""
					/>
					<Box p="8px">
						<Grid columns={24} gutter={{ base: 8 }}>
							<Grid.Col span={24}>
								<Form />
							</Grid.Col>
						</Grid>
					</Box>
				</>
			)}
		</>
	);
}

export default ConfigurationIndex;
