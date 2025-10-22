import { Box, Flex, Button } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconChevronUp, IconSelector, IconEye } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useNavigate, useOutletContext } from "react-router-dom";
import KeywordSearch from "@modules/filter/KeywordSearch";
import DataTableFooter from "@components/tables/DataTableFooter";
import tableCss from "@assets/css/TableAdmin.module.css";
import { MASTER_DATA_ROUTES } from "@/constants/routes";

const templateData = [
	{ name: "OPDA4EN", module: "opd", id: 1 },
	{ name: "OPDA4BN", module: "opd", id: 2 },
	{ name: "OPDPosEN", module: "opd", id: 3 },
	{ name: "OPDPosBN", module: "opd", id: 4 },
	{ name: "EmergencyA4EN", module: "emergency", id: 5 },
	{ name: "EmergencyA4BN", module: "emergency", id: 6 },
	{ name: "EmergencyPosEN", module: "emergency", id: 7 },
	{ name: "EmergencyPosBN", module: "emergency", id: 8 },
	{ name: "PrescriptionFullEN", module: "prescription", id: 9 },
	{ name: "PrescriptionFullBN", module: "prescription", id: 10 },
	{ name: "LabTest", module: "lab-test", id: 11 },
	{ name: "Discharge", module: "discharge", id: 12 },
	{ name: "IPDDetailsBN", module: "ipd", id: 13 },
	{ name: "IPDDetailsEN", module: "ipd", id: 14 },
	{ name: "IPDPrescriptionFullBN", module: "ipd", id: 15 },
	{ name: "IPDPrescriptionFullEN", module: "ipd", id: 16 },
	{ name: "LabReportA4BN", module: "lab-reports", id: 18 },
	{ name: "LabReportA4EN", module: "lab-reports", id: 17 },
	{ name: "DischargeA4BN", module: "discharge", id: 19 },
	{ name: "DischargeA4EN", module: "discharge", id: 20 },
	{ name: "DetailsInvoiceBN", module: "billing", id: 21 },
	{ name: "DetailsInvoiceEN", module: "billing", id: 22 },
	{ name: "DetailsInvoicePosBN", module: "billing", id: 24 },
	{ name: "DetailsInvoicePosEN", module: "billing", id: 23 },
];

export default function _Table({ module }) {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 78;

	const handleDataShow = (name) => {
		navigate(`${MASTER_DATA_ROUTES.NAVIGATION_LINKS.TEMPLATE.INDEX}/${name}`);
	};

	return (
		<>
			<Box p="xs" className="boxBackground borderRadiusAll border-bottom-none">
				<Flex align="center" justify="space-between" gap={4}>
					<KeywordSearch module={module} />
				</Flex>
			</Box>

			<Box className="borderRadiusAll border-top-none">
				<DataTable
					classNames={{
						root: tableCss.root,
						table: tableCss.table,
						body: tableCss.body,
						header: tableCss.header,
						footer: tableCss.footer,
						pagination: tableCss.pagination,
					}}
					records={templateData}
					columns={[
						{
							accessor: "index",
							title: t("S/N"),
							render: (_item, index) => index + 1,
						},
						{
							accessor: "name",
							title: t("TemplateName"),
							render: (values) => values.name,
						},
						{
							accessor: "module",
							title: t("TemplateModule"),
							render: (values) => values.module,
						},
						{
							accessor: "action",
							title: "",
							textAlign: "right",
							render: (values) => (
								<Button
									onClick={() => {
										handleDataShow(values.name);
									}}
									variant="filled"
									c="white"
									fw={400}
									size="compact-xs"
									radius="es"
									leftSection={<IconEye size={16} />}
									className="border-right-radius-none"
									bg="var(--theme-primary-color-6)"
								>
									{t("Template")}
								</Button>
							),
						},
					]}
					fetching={false}
					loaderSize="xs"
					loaderColor="grape"
					height={height - 72}
					onScrollToBottom={() => {}}
					scrollViewportRef={null}
					sortIcons={{
						sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
						unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
					}}
				/>
			</Box>

			<DataTableFooter indexData={templateData} module={module} />
		</>
	);
}
