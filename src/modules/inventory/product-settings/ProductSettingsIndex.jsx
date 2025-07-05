import React, { useEffect, useState } from "react";
import { Box, Grid, Progress, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import {
	setCustomerFilterData,
	setEntityNewData,
	setInsertType,
	setSearchKeyword,
	editEntityData,
	setFormLoading,
} from "../../../../store/core/crudSlice.js";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import { useNavigate, useParams } from "react-router-dom";
import ProductSettingsTable from "./ProductSettingsTable.jsx";
import ProductSettingsForm from "./ProductSettingsForm.jsx";
import ProductSettingsUpdateForm from "./ProductSettingsUpdateForm.jsx";
import InventoryHeaderNavbar from "../../domain/configuration/InventoryHeaderNavbar.jsx";
import getSettingTypeDropdownData from "../../../global-hook/dropdown/inventroy/getParticularTypeDropdownData.js";

function ProductSettingsIndex() {
	const { t, i18n } = useTranslation();
	const dispatch = useDispatch();
	const adjustment = 0;

	const insertType = useSelector((state) => state.inventoryCrudSlice.insertType);

	const progress = getLoadingProgress();
	const { configData } = getConfigData();
	const navigate = useNavigate();

	const { id } = useParams();

	useEffect(() => {
		if (id) {
			dispatch(setInsertType("update"));
			dispatch(editEntityData(`/inventory/product-settings/${id}`));
			dispatch(setFormLoading(true));
		} else if (!id) {
			dispatch(setInsertType("create"));
			dispatch(setSearchKeyword(""));
			dispatch(setEntityNewData([]));
			navigate("/inventory/product-settings");
		}
	}, [id, dispatch, navigate]);

	return (
		<>
			{progress !== 100 && (
				<Progress
					color="red"
					size={"sm"}
					striped
					animated
					value={progress}
					transitionDuration={200}
				/>
			)}
			{progress === 100 && (
				<Box>
					{configData && (
						<>
							<InventoryHeaderNavbar
								pageTitle={t("inventorySetting")}
								roles={t("Roles")}
								allowZeroPercentage=""
								currencySymbol=""
							/>
							<Box p={"8"}>
								<Grid columns={24} gutter={{ base: 8 }}>
									<Grid.Col span={15}>
										<Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
											<ProductSettingsTable />
										</Box>
									</Grid.Col>
									<Grid.Col span={9}>
										{insertType === "create" ? (
											<ProductSettingsForm saveId={"EntityFormSubmit"} />
										) : (
											<ProductSettingsUpdateForm
												saveId={"EntityFormSubmit"}
											/>
										)}
									</Grid.Col>
								</Grid>
							</Box>
						</>
					)}
				</Box>
			)}
		</>
	);
}

export default ProductSettingsIndex;
