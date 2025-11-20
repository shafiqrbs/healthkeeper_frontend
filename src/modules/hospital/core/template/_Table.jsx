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
	{ name: "OPDA4EN", module: "opd", id: crypto.randomUUID() },
	{ name: "OPDA4BN", module: "opd", id: crypto.randomUUID() },
	{ name: "OPDPosEN", module: "opd", id: crypto.randomUUID() },
	{ name: "OPDPosBN", module: "opd", id: crypto.randomUUID() },
	{ name: "EmergencyA4EN", module: "emergency", id: crypto.randomUUID() },
	{ name: "EmergencyA4BN", module: "emergency", id: crypto.randomUUID() },
	{ name: "EmergencyPosEN", module: "emergency", id: crypto.randomUUID() },
	{ name: "EmergencyPosBN", module: "emergency", id: crypto.randomUUID() },
	{ name: "PrescriptionFullEN", module: "prescription", id: crypto.randomUUID() },
	{ name: "PrescriptionFullBN", module: "prescription", id: crypto.randomUUID() },
	{ name: "LabTest", module: "lab-test", id: crypto.randomUUID() },
	{ name: "Discharge", module: "discharge", id: crypto.randomUUID() },
	{ name: "IPDInvoicePosEN", module: "ipd", id: crypto.randomUUID() },
	{ name: "IPDInvoicePosBN", module: "ipd", id: crypto.randomUUID() },
	{ name: "IPDDetailsBN", module: "ipd", id: crypto.randomUUID() },
	{ name: "IPDDetailsEN", module: "ipd", id: crypto.randomUUID() },
	{ name: "InvestigationPosBN", module: "ipd", id: crypto.randomUUID() },
	{ name: "InvestigationPosEN", module: "ipd", id: crypto.randomUUID() },
	{ name: "AdmissionInvoiceBN", module: "ipd", id: crypto.randomUUID() },
	{ name: "AdmissionInvoiceEN", module: "ipd", id: crypto.randomUUID() },
	{ name: "IPDPrescriptionFullBN", module: "ipd", id: crypto.randomUUID() },
	{ name: "IPDPrescriptionFullEN", module: "ipd", id: crypto.randomUUID() },
	{ name: "AdmissionFormBN", module: "ipd", id: crypto.randomUUID() },
	{ name: "AdmissionFormEN", module: "ipd", id: crypto.randomUUID() },
	{ name: "LabReportA4BN", module: "lab-reports", id: crypto.randomUUID() },
	{ name: "LabReportA4EN", module: "lab-reports", id: crypto.randomUUID() },
	{ name: "DischargeA4BN", module: "discharge", id: crypto.randomUUID() },
	{ name: "DischargeA4EN", module: "discharge", id: crypto.randomUUID() },
	{ name: "DetailsInvoiceBN", module: "billing", id: crypto.randomUUID() },
	{ name: "DetailsInvoiceEN", module: "billing", id: crypto.randomUUID() },
	{ name: "DetailsInvoicePosEN", module: "billing", id: crypto.randomUUID() },
	{ name: "DetailsInvoicePosBN", module: "billing", id: crypto.randomUUID() },
	{ name: "InvoicePosBN", module: "billing", id: crypto.randomUUID() },
	{ name: "InvoicePosEN", module: "billing", id: crypto.randomUUID() },
	{ name: "FreeServiceFormBN", module: "billing", id: crypto.randomUUID() },
	{ name: "FreeServiceFormEN", module: "billing", id: crypto.randomUUID() },
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
					striped
					highlightOnHover
					classNames={{
						root: tableCss.root,
						table: tableCss.table,
						body: tableCss.body,
						header: tableCss.header,
						footer: tableCss.footer,
						pagination: tableCss.pagination,
					}}
					onRowClick={({ record }) => {
						handleDataShow(record.name);
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
