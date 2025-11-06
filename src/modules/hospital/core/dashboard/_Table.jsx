import {Group, Box, ActionIcon, Text, rem, Flex, Button} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
	IconTrashX,
	IconAlertCircle,
	IconEdit,
	IconEye,
	IconChevronUp,
	IconSelector,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useOs, useHotkeys } from "@mantine/hooks";
import { MASTER_DATA_ROUTES } from "@/constants/routes";
import {
	deleteEntityData,
	editEntityData,
} from "@/app/store/core/crudThunk";

const PER_PAGE = 50;

export default function _Table({ module, open }) {
	const { t } = useTranslation();
	const os = useOs();
	const dispatch = useDispatch();
	const { mainAreaHeight } = useOutletContext();
	const navigate = useNavigate();
	const { id } = useParams();
	const height = mainAreaHeight - 78;


	const handleLink = () => {
		dispatch(
			editEntityData({
				url: `${MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR.VIEW}/${id}`,
				module,
			})
		);
		setViewDrawer(true);
		navigate(MASTER_DATA_ROUTES.NAVIGATION_LINKS.ADVICE.INDEX);
	};


	return (
		<>
			<Box p="xs" className="boxBackground borderRadiusAll border-bottom-none ">
				<Flex align="center" justify="space-between" gap={4}>
				Dashboard
				</Flex>
			</Box>
			<Box className="borderRadiusAll border-top-none">
				<Box p={'xs'}>Dashboard</Box>
			</Box>

		</>
	);
}

