import { Box } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDisclosure } from "@mantine/hooks";

import { useOutletContext } from "react-router-dom";
import _Table from "./_Table";
import { MODULES_CORE } from "@/constants";
import { useEffect } from "react";

const module = MODULES_CORE.ADVICE;

export default function Index({ mode = "create" }) {
	const { t } = useTranslation();

	const [opened, { open, close }] = useDisclosure(false);

	const { setPageTitle } = useOutletContext();
	useEffect(() => {
		setPageTitle(t("ManageAdvice"));
	}, [t, setPageTitle]);

	return (
		<Box bg="var(--mantine-color-white)" p="xs" className="borderRadiusAll">
			<_Table module={module} open={open} close={close} />
		</Box>
	);
}
