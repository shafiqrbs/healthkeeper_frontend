import { useRef, useState } from "react";
import { CSVLink } from "react-csv";

import DataTableFooter from "@components/tables/DataTableFooter";
import { Box, Flex, FloatingIndicator, Tabs, Text } from "@mantine/core";
import { IconChevronUp, IconSelector } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useTranslation } from "react-i18next";
import tableCss from "@assets/css/Table.module.css";
import filterTabsCss from "@assets/css/FilterTabs.module.css";

import KeywordSearch from "@hospital-components/KeywordSearch";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useSelector } from "react-redux";
import { formatDate, getLoggedInUser, getUserRole } from "@/common/utils";
import { useForm } from "@mantine/form";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll";
import { MODULES } from "@/constants";
import { useOutletContext } from "react-router-dom";

const tabs = [
	{ label: "All", value: "all" },
	{ label: "Prescription", value: "prescription" },
	{ label: "Non-prescription", value: "non-prescription" },
];

const PER_PAGE = 200;

const CSV_HEADERS = [
	{ label: "S/N", key: "sn" },
	{ label: "Created", key: "created" },
	{ label: "RoomNo", key: "visiting_room" },
	{ label: "InvoiceID", key: "invoice" },
	{ label: "PatientID", key: "patient_id" },
	{ label: "Name", key: "name" },
	{ label: "Mobile", key: "mobile" },
	{ label: "Patient", key: "patient_payment_mode_name" },
	{ label: "Total", key: "total" },
	{ label: "CreatedBy", key: "created_by" },
];

const module = MODULES.VISIT;

export default function PatientTicket() {
	const { mainAreaHeight } = useOutletContext();
	const csvLinkRef = useRef(null);
	const { t } = useTranslation();
	const listData = useSelector((state) => state.crud[module].data);

	const form = useForm({
		initialValues: {
			keywordSearch: "",
			created: formatDate(new Date()),
			room_id: "",
		},
	});

	const [processTab, setProcessTab] = useState("all");
	const [rootRef, setRootRef] = useState(null);
	const [controlsRefs, setControlsRefs] = useState({});

	const userRoles = getUserRole();

	const setControlRef = (val) => (node) => {
		controlsRefs[val] = node;
		setControlsRefs(controlsRefs);
	};

	const user = getLoggedInUser();

	const { scrollRef, records, fetching, sortStatus, setSortStatus, handleScrollToBottom } = useInfiniteTableScroll({
		module,
		fetchUrl: HOSPITAL_DATA_ROUTES.API_ROUTES.REPORT.PATIENT_TICKET,
		filterParams: {
			patient_mode: "opd",
			term: form.values.keywordSearch,
			room_id: form.values.room_id,
			prescription_mode: processTab,
			created: form.values.created,
			created_by_id:
				userRoles.includes("operator_manager") || userRoles.includes("admin_administrator")
					? undefined
					: user?.id,
		},
		perPage: PER_PAGE,
		sortByKey: "created_at",
		direction: "desc",
	});

	const csvData =
		records?.map((item, index) => ({
			sn: index + 1,
			created: formatDate(item?.created_at),
			visiting_room: item?.visiting_room ?? "",
			invoice: item?.invoice ?? "",
			patient_id: item?.patient_id ?? "",
			name: item?.name ?? "",
			mobile: item?.mobile ?? "",
			patient_payment_mode_name: item?.patient_payment_mode_name ?? "",
			total: item?.amount ?? "",
			created_by: item?.created_by ?? "",
		})) || [];
	const handleCSVDownload = () => {
		if (csvLinkRef?.current?.link) {
			csvLinkRef.current.link.click();
		}
	};

	return (
		<Box w="100%" bg="var(--mantine-color-white)">
			<Flex justify="space-between" align="center" px="sm">
				<Text fw={600} fz="sm" py="xs">
					{t("VisitInformation")}
				</Text>
				<Flex gap="xs" align="center">
					<Tabs mt="xs" variant="none" value={processTab} onChange={setProcessTab}>
						<Tabs.List ref={setRootRef} className={filterTabsCss.list}>
							{tabs.map((tab) => (
								<Tabs.Tab
									value={tab.value}
									ref={setControlRef(tab)}
									className={filterTabsCss.tab}
									key={tab.value}
								>
									{t(tab.label)}
								</Tabs.Tab>
							))}
							<FloatingIndicator
								target={processTab ? controlsRefs[processTab] : null}
								parent={rootRef}
								className={filterTabsCss.indicator}
							/>
						</Tabs.List>
					</Tabs>
				</Flex>
			</Flex>
			<Box px="sm" mb="sm">
				<KeywordSearch module={module} form={form} handleCSVDownload={handleCSVDownload} />
			</Box>
			<Box className="border-top-none" px="sm">
				<DataTable
					striped
					highlightOnHover
					pinFirstColumn
					pinLastColumn
					stripedColor="var(--theme-tertiary-color-1)"
					classNames={{
						root: tableCss.root,
						table: tableCss.table,
						header: tableCss.header,
						footer: tableCss.footer,
						pagination: tableCss.pagination,
					}}
					records={records}
					columns={[
						{
							accessor: "index",
							title: t("S/N"),
							textAlignment: "right",
							render: (_, index) => index + 1,
						},
						{
							accessor: "created_at",
							title: t("Created"),
							textAlignment: "right",
							sortable: true,
							render: (item) => <Text fz="xs">{formatDate(item?.created_at)}</Text>,
						},
						{ accessor: "visiting_room", sortable: true, title: t("RoomNo") },
						{ accessor: "invoice", sortable: true, title: t("InvoiceID") },
						{ accessor: "patient_id", sortable: true, title: t("PatientID") },
						{ accessor: "name", sortable: true, title: t("Name") },
						{ accessor: "mobile", title: t("Mobile") },
						{ accessor: "patient_payment_mode_name", sortable: true, title: t("Patient") },
						{
							accessor: 'amount',
							title: t("Total"),
							width: 120,
							textAlign: 'right',
							align: 'right',
							render: ({ amount }) => amount,
							footer: `SUM: ${records.reduce(
								(total, r) => total + Number(r.amount || 0),0
							)}`,
						},
						{
							accessor: "created_by",
							title: t("CreatedBy"),
							render: (item) => item?.created_by || "N/A",
						},
					]}
					textSelectionDisabled
					fetching={fetching}
					loaderSize="xs"
					loaderColor="grape"
					height={mainAreaHeight - 100}
					onScrollToBottom={handleScrollToBottom}
					scrollViewportRef={scrollRef}
					sortStatus={sortStatus}
					onSortStatusChange={setSortStatus}
					sortIcons={{
						sorted: <IconChevronUp color="var(--theme-tertiary-color-7)" size={14} />,
						unsorted: <IconSelector color="var(--theme-tertiary-color-7)" size={14} />,
					}}
				/>
			</Box>
			<DataTableFooter indexData={listData} module="visit" />
			{/* Hidden CSV link for exporting current table rows */}
			<CSVLink
				data={csvData}
				headers={CSV_HEADERS}
				filename={`visits-${formatDate(new Date())}.csv`}
				style={{ display: "none" }}
				ref={csvLinkRef}
			/>
		</Box>
	);
}
