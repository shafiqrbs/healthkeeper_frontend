import { useEffect } from "react";
import { Box } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setInsertType, setSearchKeyword } from "@/app/store/core/crudSlice";
import { editEntityData } from "@/app/store/core/crudThunk";
import Create from "./Create.jsx";
import Update from "./Update.jsx";
import { MASTER_DATA_ROUTES } from "@/constants/routes.js";

export default function Form({ module, mode }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { id } = useParams();
	const insertType = useSelector((state) => state.crud[module].insertType);
	const isEditMode = mode === "edit";

	useEffect(() => {
		if (isEditMode) {
			dispatch(setInsertType({ insertType: "update", module }));
			dispatch(
				editEntityData({
					url: `${MASTER_DATA_ROUTES.API_ROUTES.USER.UPDATE}/${id}`,
					module,
				})
			);
		} else {
			dispatch(setInsertType({ insertType: "create", module }));
			dispatch(setSearchKeyword(""));
			navigate(MASTER_DATA_ROUTES.NAVIGATION_LINKS.USER.INDEX, { replace: true });
		}
	}, [isEditMode, id, dispatch, module, navigate]);

	return <Box>{insertType === "create" ? <Create module={module} /> : <Update module={module} />}</Box>;
}
