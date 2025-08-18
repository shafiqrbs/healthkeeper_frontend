import { useEffect } from "react";
import { Box, Grid } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import _Table from "./_Table.jsx";
import Create from "./form/Create.jsx";
import Update from "./form/Update.jsx";
import { useTranslation } from "react-i18next";
import { setInsertType, setSearchKeyword } from "@/app/store/core/crudSlice";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress.js";
import CoreHeaderNavbar from "../CoreHeaderNavbar.jsx";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "../shared/Navigation.jsx";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton.jsx";
import { editEntityData, storeEntityData } from "@/app/store/core/crudThunk.js";
import { MODULES } from "@/constants";

const module = MODULES.USER;

export default function Index() {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const insertType = useSelector((state) => state.crud.user.insertType);
	const userFilterData = useSelector((state) => state.crud.user.filterData);

	const { id } = useParams();
	const navigate = useNavigate();
	const progress = useGetLoadingProgress();

	useEffect(() => {
		id
			? (dispatch(
					setInsertType({
						insertType: "update",
						module,
					})
			  ),
			  dispatch(
					editEntityData({
						url: `core/user/${id}`,
						module,
					})
			  ))
			: (dispatch(
					setInsertType({
						insertType: "create",
						module,
					})
			  ),
			  dispatch(setSearchKeyword("")),
			  dispatch(
					storeEntityData({
						...userFilterData,
						name: "",
						mobile: "",
						email: "",
						module,
					})
			  ),
			  navigate("/core/user", { replace: true }));
	}, [id, dispatch, navigate]);

	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
			) : (
				<Box>
					<CoreHeaderNavbar
						pageTitle={t("ManageUser")}
						roles={t("Roles")}
						allowZeroPercentage=""
						currencySymbol=""
						module="core"
					/>
					<Box p={"8"}>
						<Grid columns={24} gutter={{ base: 8 }}>
							<Grid.Col span={1}>
								<Navigation module={module} />
							</Grid.Col>
							{insertType === "create" && (
								<Grid.Col span={14}>
									<Box bg="white" p="xs" className="borderRadiusAll">
										<_Table module={module} />
									</Box>
								</Grid.Col>
							)}
							<Grid.Col span={insertType === "create" ? 9 : 24}>
								{insertType === "create" ? <Create /> : <Update />}
							</Grid.Col>
						</Grid>
					</Box>
				</Box>
			)}
		</>
	);
}
