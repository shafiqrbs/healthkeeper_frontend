import React, { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { editEntityData } from "@/app/store/core/crudThunk";
import { setFilterData, setSearchKeyword, setInsertType } from "@/app/store/core/crudSlice";
import __Update from "./__Update";
import __Create from "./__Create";
import { CORE_DATA_ROUTES } from "@/constants/appRoutes";

export default function _Form({ form, close, mode }) {
	const { id } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	// =============== selectors ================
	const insertType = useSelector((state) => state.crud.vendor.insertType);
	const vendorFilterData = useSelector((state) => state.crud.vendor.filterData);

	// =============== memoized values ================
	const isEditMode = mode === "edit";
	const defaultFilterData = useMemo(
		() => ({
			name: "",
			mobile: "",
			company: "",
		}),
		[]
	);

	// =============== handle edit mode initialization ================
	const handleEditMode = () => {
		dispatch(setInsertType({ insertType: "update", module: "vendor" }));
		dispatch(
			editEntityData({
				url: `${CORE_DATA_ROUTES.API_ROUTES.VENDOR.UPDATE}/${id}`,
				module: "vendor",
			})
		);
	};

	// =============== handle create mode initialization ================
	const handleCreateMode = () => {
		dispatch(setInsertType({ insertType: "create", module: "vendor" }));
		dispatch(setSearchKeyword(""));
		dispatch(
			setFilterData({
				module: "vendor",
				data: {
					...vendorFilterData,
					...defaultFilterData,
				},
			})
		);
		navigate(CORE_DATA_ROUTES.NAVIGATION_LINKS.VENDOR.INDEX, { replace: true });
	};

	// =============== effect to handle mode switching ================
	useEffect(() => {
		if (isEditMode) {
			handleEditMode();
		} else {
			handleCreateMode();
		}
	}, [isEditMode]);

	// =============== render form based on mode ================
	if (insertType === "create") {
		return <__Create form={form} close={close} />;
	}

	return <__Update form={form} close={close} />;
}
