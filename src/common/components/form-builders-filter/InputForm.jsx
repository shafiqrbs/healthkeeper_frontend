import React from "react";
import { Tooltip, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconInfoCircle, IconSearch, IconX } from "@tabler/icons-react";
import { getHotkeyHandler } from "@mantine/hooks";
import {
	setCategoryGroupFilterData,
	setCustomerFilterData,
	setFileUploadFilterData,
	setUserFilterData,
	setVendorFilterData,
	setWarehouseFilterData,
} from "@/app/store/core/crudSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { setCategoryFilterData, setProductFilterData } from "@/app/store/core/crudSlice.js";
import {
	setProductionBatchFilterData,
	setProductionSettingFilterData,
	setRecipeItemFilterData,
} from "@/app/store/core/crudSlice.js";

function InputForm({ label, placeholder, nextField, id, name, module }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const customerFilterData = useSelector((state) => state.crudSlice.customerFilterData);
	const vendorFilterData = useSelector((state) => state.crudSlice.vendorFilterData);
	const userFilterData = useSelector((state) => state.crudSlice.userFilterData);
	const warehouseFilterData = useSelector((state) => state.crudSlice.warehouseFilterData);
	const categoryGroupFilterData = useSelector((state) => state.crudSlice.categoryGroupFilterData);
	const productFilterData = useSelector((state) => state.inventoryCrudSlice.productFilterData);
	const categoryFilterData = useSelector((state) => state.inventoryCrudSlice.categoryFilterData);
	const productionSettingFilterData = useSelector(
		(state) => state.productionCrudSlice.productionSettingFilterData
	);
	const productionBatchFilterData = useSelector(
		(state) => state.productionCrudSlice.productionBatchFilterData
	);
	const recipeItemFilterData = useSelector(
		(state) => state.productionCrudSlice.recipeItemFilterData
	);
	const fileUploadFilterData = useSelector(
		(state) => state.productionCrudSlice.recipeItemFilterData
	);

	return (
		<>
			{
				<TextInput
					label={label}
					leftSection={<IconSearch size={16} opacity={0.5} />}
					size="sm"
					placeholder={placeholder}
					autoComplete="off"
					onKeyDown={getHotkeyHandler([
						nextField === "submit"
							? [
									"Enter",
									(e) => {
										document.getElementById(nextField).click();
									},
							  ]
							: [
									"Enter",
									(e) => {
										document.getElementById(nextField).focus();
									},
							  ],
					])}
					onChange={(e) => {
						if (module === "category-group") {
							dispatch(
								setCategoryGroupFilterData({
									...categoryGroupFilterData,
									[name]: e.currentTarget.value,
								})
							);
						}
						if (module === "customer") {
							dispatch(
								setCustomerFilterData({
									...customerFilterData,
									[name]: e.currentTarget.value,
								})
							);
						}
						if (module === "vendor") {
							dispatch(
								setVendorFilterData({
									...vendorFilterData,
									[name]: e.currentTarget.value,
								})
							);
						}
						if (module === "user") {
							dispatch(
								setUserFilterData({
									...userFilterData,
									[name]: e.currentTarget.value,
								})
							);
						}
						if (module === "product") {
							dispatch(
								setProductFilterData({
									...productFilterData,
									[name]: e.currentTarget.value,
								})
							);
						}
						if (module === "category") {
							dispatch(
								setCategoryFilterData({
									...categoryFilterData,
									[name]: e.currentTarget.value,
								})
							);
						}
						if (module === "production-setting") {
							dispatch(
								setProductionSettingFilterData({
									...productionSettingFilterData,
									[name]: e.currentTarget.value,
								})
							);
						}
						if (module === "production-batch") {
							dispatch(
								setProductionBatchFilterData({
									...productionBatchFilterData,
									[name]: e.currentTarget.value,
								})
							);
						}
						if (module === "recipe-item") {
							dispatch(
								setRecipeItemFilterData({
									...recipeItemFilterData,
									[name]: e.currentTarget.value,
								})
							);
						}
						if (module === "warehouse") {
							dispatch(
								setWarehouseFilterData({
									...warehouseFilterData,
									[name]: e.currentTarget.value,
								})
							);
						}
						if (module === "file-upload") {
							dispatch(
								setFileUploadFilterData({
									...fileUploadFilterData,
									[name]: e.currentTarget.value,
								})
							);
						}
					}}
					value={
						module === "category-group"
							? categoryGroupFilterData[name]
							: module === "customer"
							? customerFilterData[name]
							: module === "vendor"
							? vendorFilterData[name]
							: module === "user"
							? userFilterData[name]
							: module === "product"
							? productFilterData[name]
							: module === "category"
							? categoryFilterData[name]
							: module === "production-setting"
							? productionSettingFilterData[name]
							: module === "production-batch"
							? productionBatchFilterData[name]
							: module === "recipe-item"
							? recipeItemFilterData[name]
							: module === "warehouse"
							? warehouseFilterData[name]
							: module === "file-upload"
							? fileUploadFilterData[name]
							: ""
					}
					id={id}
					rightSection={
						(module === "category-group" && categoryGroupFilterData[name]) ||
						(module === "customer" && customerFilterData[name]) ||
						(module === "user" && userFilterData[name]) ||
						(module === "product" && productFilterData[name]) ||
						(module === "production-setting" && productionSettingFilterData[name]) ||
						(module === "production-batch" && productionBatchFilterData[name]) ||
						(module === "recipe-item" && recipeItemFilterData[name]) ||
						(module === "warehouse" && warehouseFilterData[name]) ||
						(module === "vendor" && vendorFilterData[name]) ||
						(module === "file-upload" && fileUploadFilterData[name]) ? (
							<Tooltip label={t("Close")} withArrow bg={`red.5`}>
								<IconX
									color={`red`}
									size={16}
									opacity={0.5}
									onClick={() => {
										if (module === "customer") {
											dispatch(
												setCustomerFilterData({
													...customerFilterData,
													[name]: "",
												})
											);
										} else if (module === "vendor") {
											dispatch(
												setVendorFilterData({
													...vendorFilterData,
													[name]: "",
												})
											);
										} else if (module === "user") {
											dispatch(
												setUserFilterData({
													...userFilterData,
													[name]: "",
												})
											);
										} else if (module === "product") {
											dispatch(
												setProductFilterData({
													...productFilterData,
													[name]: "",
												})
											);
										} else if (module === "category-group") {
											dispatch(
												setCategoryGroupFilterData({
													...categoryGroupFilterData,
													[name]: "",
												})
											);
										} else if (module === "production-setting") {
											dispatch(
												setProductionSettingFilterData({
													...productionSettingFilterData,
													[name]: "",
												})
											);
										} else if (module === "production-batch") {
											dispatch(
												setProductionBatchFilterData({
													...productionBatchFilterData,
													[name]: "",
												})
											);
										} else if (module === "recipe-item") {
											dispatch(
												setRecipeItemFilterData({
													...recipeItemFilterData,
													[name]: "",
												})
											);
										} else if (module === "warehouse") {
											dispatch(
												setWarehouseFilterData({
													...warehouseFilterData,
													[name]: "",
												})
											);
										} else if (module === "file-upload") {
											dispatch(
												setFileUploadFilterData({
													...fileUploadFilterData,
													[name]: "",
												})
											);
										}
									}}
								/>
							</Tooltip>
						) : (
							<Tooltip label={placeholder} withArrow position={"bottom"} bg={`red.4`}>
								<IconInfoCircle size={16} opacity={0.5} />
							</Tooltip>
						)
					}
				/>
			}
		</>
	);
}

export default InputForm;
