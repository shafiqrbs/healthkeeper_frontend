import React from "react";
import { Box, Grid } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress.js";
import DomainHeaderNavbar from "./DomainHeaderNavbar.jsx";
import useConfigData from "@hooks/config-data/useConfigData.js";
import Form from "./form/_Form.jsx";
import ConfigSkeleton from "@components/skeletons/ConfigSkeleton.jsx";

function HospitalConfigIndex() {
	const { t } = useTranslation();

	const progress = useGetLoadingProgress();
	const { configData } = useConfigData();
	localStorage.setItem("config-data", JSON.stringify(configData));

	return (
		<>
			{progress !== 100 ? (
				<ConfigSkeleton />
			) : (
				<>
					<DomainHeaderNavbar
						pageTitle={t("ConfigurationInformationFormDetails")}
						roles={t("Roles")}
						allowZeroPercentage=""
						currencySymbol=""
					/>
					<Box p="3xs">
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

export default HospitalConfigIndex;
