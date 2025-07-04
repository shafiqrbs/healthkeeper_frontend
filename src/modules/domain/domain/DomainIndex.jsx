import React, { useEffect } from "react";
import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setSearchKeyword, setInsertType } from "@/app/store/core/crudSlice";
import { editEntityData } from "@/app/store/core/crudThunk.js";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import DomainTable from "./DomainTable";
import DomainHeaderNavbar from "../DomainHeaderNavbar";
import DomainUpdateForm from "./DomainUpdateFrom";
import { useNavigate, useParams } from "react-router-dom";
import DomainForm from "./DomainFrom.jsx";
import useConfigData from "@hooks/config-data/useConfigData";
import GlobalDrawer from "@/common/components/drawers/GlobalDrawer";
import _Navigation from "../common/_Navigation";
import { useDisclosure } from "@mantine/hooks";

function DomainIndex() {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const insertType = useSelector((state) => state.crud.domain.insertType);
	const [opened, { open, close }] = useDisclosure(false);
	const progress = useGetLoadingProgress();
	const { configData } = useConfigData();

	const { id } = useParams();
	const navigate = useNavigate();

	localStorage.setItem("config-data", JSON.stringify(configData));

	useEffect(() => {
		if (id) {
			dispatch(setInsertType({ insertType: "update", module: "domain" }));
			dispatch(editEntityData({ url: `domain/global/${id}`, module: "domain" }));
		} else if (!id) {
			dispatch(setInsertType({ insertType: "create", module: "domain" }));
			dispatch(setSearchKeyword({ searchKeyword: "", module: "domain" }));
			navigate("/domain");
		}
	}, [id, dispatch, navigate]);

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
								{insertType === "create" ? <DomainForm /> : <DomainUpdateForm />}
							</GlobalDrawer>
						</Grid>
					</Box>
				</Box>
			)}
		</>
	);
}

export default DomainIndex;
