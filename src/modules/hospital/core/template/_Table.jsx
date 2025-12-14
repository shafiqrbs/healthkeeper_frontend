import { Box, Flex, Button } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconChevronUp, IconSelector, IconEye } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useNavigate, useOutletContext } from "react-router-dom";
import KeywordSearch from "@modules/filter/KeywordSearch";
import DataTableFooter from "@components/tables/DataTableFooter";
import tableCss from "@assets/css/TableAdmin.module.css";
import { MASTER_DATA_ROUTES } from "@/constants/routes";
import { getUUID } from "@utils/index";

const templateData = [
	{ name: "OPDA4EN", module: "opd", id: getUUID() },
	{ name: "OPDA4BN", module: "opd", id: getUUID() },
	{ name: "OPDPosEN", module: "opd", id: getUUID() },
	{ name: "OPDPosBN", module: "opd", id: getUUID() },
	{ name: "EmergencyA4EN", module: "emergency", id: getUUID() },
	{ name: "EmergencyA4BN", module: "emergency", id: getUUID() },
	{ name: "EmergencyPosEN", module: "emergency", id: getUUID() },
	{ name: "EmergencyPosBN", module: "emergency", id: getUUID() },
	{ name: "PrescriptionFullEN", module: "prescription", id: getUUID() },
	{ name: "PrescriptionFullBN", module: "prescription", id: getUUID() },
	{ name: "LabTest", module: "lab-test", id: getUUID() },
	{ name: "Discharge", module: "discharge", id: getUUID() },
	{ name: "IPDInvoicePosEN", module: "ipd", id: getUUID() },
	{ name: "IPDInvoicePosBN", module: "ipd", id: getUUID() },
	{ name: "IPDDetailsBN", module: "ipd", id: getUUID() },
	{ name: "IPDDetailsEN", module: "ipd", id: getUUID() },
	{ name: "InvestigationPosBN", module: "ipd", id: getUUID() },
	{ name: "InvestigationPosEN", module: "ipd", id: getUUID() },
	{ name: "IPDPrescriptionFullBN", module: "ipd", id: getUUID() },
	{ name: "IPDPrescriptionFullEN", module: "ipd", id: getUUID() },
	{ name: "AdmissionFormBN", module: "ipd", id: getUUID() },
	{ name: "AdmissionFormEN", module: "ipd", id: getUUID() },
	{ name: "AdmissionInvoiceBN", module: "ipd", id: getUUID() },
	{ name: "AdmissionInvoiceEN", module: "ipd", id: getUUID() },
	{ name: "LabReportA4BN", module: "lab-reports", id: getUUID() },
	{ name: "LabReportA4EN", module: "lab-reports", id: getUUID() },
	{ name: "DischargeA4BN", module: "discharge", id: getUUID() },
	{ name: "DischargeA4EN", module: "discharge", id: getUUID() },
	{ name: "DetailsInvoiceBN", module: "billing", id: getUUID() },
	{ name: "DetailsInvoiceEN", module: "billing", id: getUUID() },
	{ name: "DetailsInvoicePosEN", module: "billing", id: getUUID() },
	{ name: "DetailsInvoicePosBN", module: "billing", id: getUUID() },
	{ name: "InvoicePosBN", module: "billing", id: getUUID() },
	{ name: "InvoicePosEN", module: "billing", id: getUUID() },
	{ name: "RefundPosEN", module: "refund", id: getUUID() },
	{ name: "FreeServiceFormBN", module: "billing", id: getUUID() },
	{ name: "FreeServiceFormEN", module: "billing", id: getUUID() },
	{ name: "Workorder", module: "wrkorder", id: getUUID() },
	{ name: "Indent", module: "indent", id: getUUID() },
	{ name: "DeathCertificateBN", module: "ipd", id: getUUID() },
	{ name: "DeathCertificateEN", module: "ipd", id: getUUID() },
	{ name: "SummaryReports", module: "reports", id: getUUID() },
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
							accessor: "",
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
