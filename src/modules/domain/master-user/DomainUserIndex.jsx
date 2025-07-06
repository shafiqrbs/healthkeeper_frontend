import React from "react";
import { useParams } from "react-router-dom";
import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DomainHeaderNavbar from "../DomainHeaderNavbar";
import DomainUserTable from "./DomainUserTable";
import _Navigation from "../common/_Navigation";

export default function DomainUserIndex() {
	const { id } = useParams();
	const { t } = useTranslation();
	const progress = useGetLoadingProgress();

	return (
		<>
			{progress !== 100 ? (
				<Progress
					color="var(--theme-primary-color-7)"
					size={"sm"}
					striped
					animated
					value={progress}
				/>
			) : (
				<>
					<DomainHeaderNavbar
						pageTitle={t("ManageDomain")}
						roles={t("Roles")}
						allowZeroPercentage=""
						currencySymbol=""
					/>
					<Box p={"8"}>
						<Grid columns={24} gutter={{ base: 8 }}>
							<Grid.Col span={1}>
								<_Navigation id={id} module={"b2b_dashboard"} />
							</Grid.Col>
							<Grid.Col span={23}>
								<Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
									<DomainUserTable id={id} />
								</Box>
							</Grid.Col>
						</Grid>
					</Box>
				</>
			)}
		</>
	);
}
