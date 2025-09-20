import { Box } from "@mantine/core";
import _Table from "./_Table";
import { MODULES_CORE } from "@/constants";
import Details from "./Details";
import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const module = MODULES_CORE.PARTICULAR;

export default function Index({ mode }) {
	const { setPageTitle } = useOutletContext();
	const { t } = useTranslation();

	useEffect(() => {
		setPageTitle(t("ManageTemplate"));
	}, [t, setPageTitle]);

	return (
		<Box bg="white" p="xs" className="borderRadiusAll">
			{mode === "details" ? <Details /> : <_Table module={module} />}
		</Box>
	);
}
