import React, { useEffect } from "react";
import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setSearchKeyword, setInsertType } from "@/app/store/core/crudSlice";
import { editEntityData } from "@/app/store/core/crudThunk.js";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DomainTable from "./_DomainTable";
import DomainHeaderNavbar from "../DomainHeaderNavbar";
import { useNavigate, useParams } from "react-router-dom";
import useConfigData from "@hooks/config-data/useConfigData";
import GlobalDrawer from "@/common/components/drawers/GlobalDrawer";
import _Navigation from "../common/_Navigation";
import { useDisclosure } from "@mantine/hooks";
import Form from "./form/__Form";

function DomainIndex() {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [opened, { open, close }] = useDisclosure(false);
	const progress = useGetLoadingProgress();
	const { configData } = useConfigData();

	const { id } = useParams();
	const navigate = useNavigate();

	localStorage.setItem("config-data", JSON.stringify(configData));

	return (
		<>
			{progress !== 100 ? (
				<Progress
					color="red"
					size={"sm"}
					striped
					animated
					value={progress}
					transitionDuration={200}
				/>
			) : (
				<Box>
					<DomainHeaderNavbar
						pageTitle={t("ManageDomain")}
						roles={t("Roles")}
						allowZeroPercentage=""
						currencySymbol=""
					/>
					<Box p="8">
						<Grid columns={24} gutter={{ base: 8 }}>
							<Grid.Col span={1}>
								<_Navigation id={id} module="b2b_dashboard" />
							</Grid.Col>
							<Grid.Col span={23}>
								<Box bg="white" p="xs" className="borderRadiusAll">
									<DomainTable open={open} close={close} />
								</Box>
							</Grid.Col>
							<GlobalDrawer opened={opened} close={close} title="Domain Form">
								<Form close={close} />
							</GlobalDrawer>
						</Grid>
					</Box>
				</Box>
			)}
		</>
	);
}

export default DomainIndex;
