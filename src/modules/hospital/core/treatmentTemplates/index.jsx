import { Box } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDisclosure } from "@mantine/hooks";

import { getInitialValues } from "./helpers/request";
import { useForm } from "@mantine/form";
import IndexForm from "./form/__IndexForm";
import GlobalDrawer from "@components/drawers/GlobalDrawer";
import { useOutletContext, useParams } from "react-router-dom";
import _Table from "./_Table";
import _FormatTable from "./_FormatTable";
import { MODULES_CORE } from "@/constants";
import { useEffect } from "react";

const module = MODULES_CORE.TREATMENT_TEMPLATES;

export default function Index({ mode = "create" }) {
	const { t } = useTranslation();
	const { treatmentFormat } = useParams();
	const form = useForm(getInitialValues(t));
	const [opened, { open, close }] = useDisclosure(false);

	const { setPageTitle } = useOutletContext();

	useEffect(() => {
		setPageTitle(t("ManageTreatmentTemplates"));
	}, [t, setPageTitle]);

	return (
		<Box bg="var(--mantine-color-white)" p="xs" className="borderRadiusAll">
			{treatmentFormat === "treatment-format" ? (
				<_FormatTable module={module} open={open} close={close} />
			) : (
				<_Table module={module} open={open} close={close} />
			)}
			<GlobalDrawer
				opened={opened}
				close={close}
				title={mode === "create" ? t("CreateTreatmentTemplates") : t("UpdateTreatmentTemplates")}
			>
				<IndexForm module={module} form={form} mode={mode} close={close} />
			</GlobalDrawer>
		</Box>
	);
}
