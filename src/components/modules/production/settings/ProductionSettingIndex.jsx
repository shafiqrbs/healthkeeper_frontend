import React, { useEffect } from "react";
import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import {
  setEntityNewData,
  setInsertType,
  setSearchKeyword,
  editEntityData,
  setFormLoading,
} from "../../../../store/production/crudSlice.js";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import { useNavigate, useParams } from "react-router-dom";
import _ProductionSettingTable from "./_ProductionSettingTable.jsx";
import _ProductionSettingForm from "./_ProductionSettingForm.jsx";
import _ProductionSettingUpdateForm from "./_ProductionSettingUpdateForm.jsx";
import ProductionHeaderNavbar from "../common/ProductionHeaderNavbar.jsx";
import getProSettingTypeDropdownData from "../../../global-hook/dropdown/getProSettingTypeDropdownData.js";
import ProductionNavigation from "../common/ProductionNavigation.jsx";

function ProductionSettingIndex() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const progress = getLoadingProgress();
  const navigate = useNavigate();
  const { id } = useParams();

  const insertType = useSelector(
    (state) => state.productionCrudSlice.insertType
  );
  const settingTypeDropdown = getProSettingTypeDropdownData();
  const configData = localStorage.getItem("config-data")
    ? JSON.parse(localStorage.getItem("config-data"))
    : [];

  useEffect(() => {
    if (id) {
      dispatch(setInsertType("update"));
      dispatch(editEntityData(`production/setting/${id}`));
      dispatch(setFormLoading(true));
    } else if (!id) {
      dispatch(setInsertType("create"));
      dispatch(setSearchKeyword(""));
      dispatch(setEntityNewData([]));
      navigate("/production/setting", { replace: true });
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
              <ProductionHeaderNavbar
                pageTitle={t("productionSetting")}
                roles={t("Roles")}
                allowZeroPercentage=""
                currencySymbol=""
              />
              <Box p={"8"}>
                <Grid columns={24} gutter={{ base: 8 }}>
                  <Grid.Col span={1}>
                    <ProductionNavigation module={"setting"} />
                  </Grid.Col>
                  <Grid.Col span={14}>
                    <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                      <_ProductionSettingTable />
                    </Box>
                  </Grid.Col>
                  <Grid.Col span={9}>
                    {insertType === "create" ? (
                      <_ProductionSettingForm
                        settingTypeDropdown={settingTypeDropdown}
                        formSubmitId={"EntityFormSubmit"}
                      />
                    ) : (
                      <_ProductionSettingUpdateForm
                        settingTypeDropdown={settingTypeDropdown}
                        formSubmitId={"EntityFormSubmit"}
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

export default ProductionSettingIndex;
