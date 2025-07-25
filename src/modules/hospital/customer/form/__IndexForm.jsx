import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { editEntityData } from "@/app/store/core/crudThunk";
import { setFilterData, setSearchKeyword, setInsertType } from "@/app/store/core/crudSlice";
import __Update from "./__Update";
import __Create from "./__Create";
import { HOSPITAL_DATA_ROUTES } from "@/constants/appRoutes";

export default function _IndexForm({ module, form, close, mode }) {
	const { id } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	// =============== selectors ================
	const insertType = useSelector((state) => state.crud[module].insertType);
	const vendorFilterData = useSelector((state) => state.crud[module].filterData);

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
		dispatch(setInsertType({ insertType: "update", module }));
		dispatch(
			editEntityData({
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.CUSTOMER.UPDATE}/${id}`,
				module,
			})
		);
	};

	// =============== handle create mode initialization ================
	const handleCreateMode = () => {
		dispatch(setInsertType({ insertType: "create", module }));
		dispatch(setSearchKeyword(""));
		dispatch(
			setFilterData({
				module,
				data: {
					...vendorFilterData,
					...defaultFilterData,
				},
			})
		);
		navigate(HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.CUSTOMER.INDEX, { replace: true });
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
		return <__Create module={module} form={form} close={close} />;
	}

	return <__Update module={module} form={form} close={close} />;
}
