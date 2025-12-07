import { Box } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDisclosure } from "@mantine/hooks";

import { getInitialValues } from "./helpers/request";
import { useForm } from "@mantine/form";
import IndexForm from "./form/__IndexForm";
import GlobalDrawer from "@components/drawers/GlobalDrawer";
import { useOutletContext, useParams } from "react-router-dom";
import _Table from "./_Table";
import _ReportFormatTable from "./_ReportFormatTable";
import { MODULES_CORE } from "@/constants";
import { useEffect } from "react";

const module = MODULES_CORE.INVESTIGATION;

export default function Index({ mode = "create" }) {
	const { t } = useTranslation();
	const { reportFormat } = useParams();
	const form = useForm(getInitialValues(t));
	const [opened, { open, close }] = useDisclosure(false);

	const { setPageTitle } = useOutletContext();

	useEffect(() => {
		setPageTitle(t("ManageInvestigation"));
	}, [t, setPageTitle]);

	return (
		<Box bg="var(--mantine-color-white)" p="xs" className="borderRadiusAll">
			{reportFormat === "report-format" ? (
				<_ReportFormatTable module={module} open={open} close={close} />
			) : (
				<_Table module={module} open={open} close={close} />
			)}
			<GlobalDrawer opened={opened} close={close} title={mode === "create" ? t("CreateInvestigation") : t("UpdateInvestigation")}>
				<IndexForm module={module} form={form} mode={mode} close={close} />
			</GlobalDrawer>
		</Box>
	);
}
