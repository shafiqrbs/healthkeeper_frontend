import React, { useEffect } from "react";
import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { setFileUploadFilterData, setSearchKeyword } from "../../../../store/core/crudSlice.js";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import CoreHeaderNavbar from "../CoreHeaderNavbar";
import { useNavigate, useParams } from "react-router-dom";
import FileUploadForm from "./FileUploadForm.jsx";
import FileUploadTable from "./FileUploadTable.jsx";

function FileUploadIndex() {
	const { t, i18n } = useTranslation();
	const dispatch = useDispatch();
	const { id } = useParams();
	const navigate = useNavigate();
	const progress = getLoadingProgress();

	const fileUploadFilterData = useSelector((state) => state.crudSlice.fileUploadFilterData);

	useEffect(() => {
		dispatch(setSearchKeyword(""));
		dispatch(
			setFileUploadFilterData({
				...fileUploadFilterData,
				["file_type"]: "",
				["original_name"]: "",
				["created"]: "",
			})
		);
		navigate("/core/file-upload", { replace: true });
	}, [id, dispatch, navigate]);

	return (
		<>
			{progress !== 100 && (
				<Progress
					color="var(--theme-primary-color-7)"
					size={"sm"}
					striped
					animated
					value={progress}
					transitionDuration={200}
				/>
			)}
			{progress === 100 && (
				<>
					<CoreHeaderNavbar
						pageTitle={t("ManageFile")}
						roles={t("Roles")}
						allowZeroPercentage=""
						currencySymbol=""
					/>
					<Box p={"8"}>
						<Grid columns={24} gutter={{ base: 8 }}>
							<Grid.Col span={15}>
								<Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
									<FileUploadTable />
								</Box>
							</Grid.Col>
							<Grid.Col span={9}>
								<FileUploadForm />
							</Grid.Col>
						</Grid>
					</Box>
				</>
			)}
		</>
	);
}

export default FileUploadIndex;
