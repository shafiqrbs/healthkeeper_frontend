import React, { useEffect, useState } from "react";
import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import VendorTable from "./_VendorTable";
import VendorForm from "./_VendorForm";
import { setFilterData, setSearchKeyword } from "@/app/store/core/crudSlice.js";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import CoreHeaderNavbar from "@modules/core/CoreHeaderNavbar";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "@components/layout/Navigation";
import { editEntityData } from "@/app/store/core/crudThunk";
import { getVendorFormInitialValues } from "./helpers/request";
import { useForm } from "@mantine/form";
import Shortcut from "@/modules/shortcut/Shortcut";
import useGlobalDropdownData from "@/common/hooks/dropdown/useGlobalDropdownData";

function VendorIndex() {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { id } = useParams();
	const navigate = useNavigate();
	const [insertType, setInsertType] = useState("create");
	const [isRotated, setIsRotated] = useState(false);
	const form = useForm(getVendorFormInitialValues(t));
	const vendorFilterData = useSelector((state) => state.crud.vendor.filterData);
	const customerDropDownData = useGlobalDropdownData({ path: "core/select/customer", utility: "customer" });
	const progress = useGetLoadingProgress();

	const gridComponents = [
		{
			span: 20,
			component: (
				<Box bg="white" p="xs" className="borderRadiusAll">
					<VendorTable setInsertType={setInsertType} />
				</Box>
			),
		},
		{
			span: 12,
			component: (
				<VendorForm
					form={form}
					type={insertType}
					setInsertType={setInsertType}
					customerDropDownData={customerDropDownData}
				/>
			),
		},
	];

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
							{(isRotated ? [...gridComponents].reverse() : gridComponents).map(
								({ span, component }, index) => (
									<Grid.Col key={index} span={span}>
										{component}
									</Grid.Col>
								)
							)}
							<Grid.Col span={2}>
								<Box bg="white" className="borderRadiusAll" pt="sm">
									<Shortcut
										form={form}
										FormSubmit="EntityFormSubmit"
										Name="name"
										inputType="select"
									/>
								</Box>
							</Grid.Col>
						</Grid>
					</Box>
				</>
			)}
		</>
	);
}

export default VendorIndex;
