import React, { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { editEntityData } from "@/app/store/core/crudThunk";
import { setFilterData, setSearchKeyword, setInsertType } from "@/app/store/core/crudSlice";
import __Update from "./__Update";
import __Create from "./__Create";
import { getDomainFormInitialValues } from "../helpers/request";
import { useForm } from "@mantine/form";

export default function _Form({ close, mode }) {
	const { id } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	// =============== selectors ================
	const insertType = useSelector((state) => state.crud.domain.insertType);
	const domainFilterData = useSelector((state) => state.crud.domain.filterData);

	// =============== form initialization ================
	const form = useForm(getDomainFormInitialValues({ type: insertType }));

	// =============== memoized values ================
	const isEditMode = mode === "edit";
	const defaultFilterData = useMemo(
		() => ({
			company_name: "",
			name: "",
			email: "",
		}),
		[]
	);

	// =============== handle edit mode initialization ================
	const handleEditMode = () => {
		dispatch(setInsertType({ insertType: "update", module: "domain" }));
		dispatch(
			editEntityData({
				url: `domain/global/${id}`,
				module: "domain",
			})
		);
	};

	// =============== handle create mode initialization ================
	const handleCreateMode = () => {
		dispatch(setInsertType({ insertType: "create", module: "domain" }));
		dispatch(setSearchKeyword(""));
		dispatch(
			setFilterData({
				module: "domain",
				data: {
					...domainFilterData,
					...defaultFilterData,
				},
			})
		);
		navigate("/domain", { replace: true });
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
