import React, { useEffect, useState } from "react";
import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import VendorTable from "./VendorTable";
import VendorForm from "./VendorForm";
import { setFilterData, setSearchKeyword } from "@/app/store/core/crudSlice.js";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import CoreHeaderNavbar from "@modules/core/CoreHeaderNavbar";
import { useNavigate, useParams } from "react-router-dom";
import useCustomerDropdownData from "@hooks/dropdown/useCustomerDropdownData.js";
import Navigation from "@components/layout/Navigation";
import { editEntityData } from "@/app/store/core/crudThunk";

function VendorIndex() {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { id } = useParams();
	const navigate = useNavigate();
	const [insertType, setInsertType] = useState("create");

	const vendorFilterData = useSelector((state) => state.crud.vendor.filterData);
	const customerDropDownData = useCustomerDropdownData();

	const progress = useGetLoadingProgress();

	useEffect(() => {
		if (id) {
			setInsertType("update");
			dispatch(
				editEntityData({
					url: `core/vendor/${id}`,
					module: "vendor",
				})
			);
		} else {
			setInsertType("create");
			dispatch(setSearchKeyword(""));
			dispatch(
				setFilterData({
					module: "vendor",
					data: {
						...vendorFilterData,
						name: "",
						mobile: "",
						company: "",
					},
				})
			);
			navigate("/core/vendor", { replace: true });
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
				<>
					<CoreHeaderNavbar
						module="core"
						pageTitle={t("ManageVendor")}
						roles={t("Roles")}
						allowZeroPercentage=""
						currencySymbol=""
					/>
					<Box p="8">
						<Grid columns={36} gutter={{ base: 8 }}>
							<Grid.Col span={2}>
								<Navigation module="base" />
							</Grid.Col>
							<Grid.Col span={20}>
								<Box bg="white" p="xs" className="borderRadiusAll">
									<VendorTable />
								</Box>
							</Grid.Col>
							<Grid.Col span={14}>
								<VendorForm
									type={insertType}
									customerDropDownData={customerDropDownData}
								/>
							</Grid.Col>
						</Grid>
					</Box>
				</>
			)}
		</>
	);
}

export default VendorIndex;
