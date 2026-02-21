import { useRef, useState } from "react";
import { CSVLink } from "react-csv";

import DataTableFooter from "@components/tables/DataTableFooter";
import { Box, Flex, FloatingIndicator, Tabs, Text } from "@mantine/core";
import { IconChevronUp, IconSelector } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useTranslation } from "react-i18next";
import tableCss from "@assets/css/Table.module.css";
import filterTabsCss from "@assets/css/FilterTabs.module.css";

import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useSelector } from "react-redux";
import {capitalizeWords, formatDate} from "@/common/utils";
import useAppLocalStore from "@hooks/useAppLocalStore";
import { useForm } from "@mantine/form";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll";
import { MODULES } from "@/constants";
import { useOutletContext } from "react-router-dom";
import ReportFilterSearch from "@hospital-components/ReportFilterSearch";



const PER_PAGE = 100;

const CSV_HEADERS = [
	{ label: "S/N", key: "sn" },
	{ label: "Created", key: "created" },
	{ label: "InvoiceID", key: "invoice" },
	{ label: "PatientID", key: "patient_id" },
	{ label: "Name", key: "name" },
	{ label: "Age", key: "age" },
	{ label: "Gender", key: "gender" },
	{ label: "Disease Profile", key: "disease_profile" },
];

const module = MODULES.VISIT;

export default function PatientAdmission() {
	const { user, userRoles } = useAppLocalStore();
	const { mainAreaHeight } = useOutletContext();
	const csvLinkRef = useRef(null);
	const { t } = useTranslation();
	const listData = useSelector((state) => state.crud[module].data);

	const form = useForm({
		initialValues: {
			keywordSearch: "",
			created: formatDate(new Date()),
		},
	});

	const [processTab, setProcessTab] = useState("all");
	const [rootRef, setRootRef] = useState(null);
	const [controlsRefs, setControlsRefs] = useState({});

	const setControlRef = (val) => (node) => {
		controlsRefs[val] = node;
		setControlsRefs(controlsRefs);
	};

	const { scrollRef, records, fetching, sortStatus, setSortStatus, handleScrollToBottom } =
		useInfiniteTableScroll({
			module,
			fetchUrl: HOSPITAL_DATA_ROUTES.API_ROUTES.REPORT.PATIENT_DEATH,
			filterParams: {
				term: form.values.keywordSearch,
				start_date: form.values.start_date,
				end_date: form.values.end_date,
				created_by_id:
					userRoles.includes("operator_manager") ||
					userRoles.includes("admin_administrator")
						? undefined
						: user?.id,
			},
			perPage: PER_PAGE,
		});

	const csvData =
		records?.map((item, index) => ({
			sn: index + 1,
			created: formatDate(item?.created_at),
			invoice: item?.invoice ?? "",
			patient_id: item?.patient_id ?? "",
			name: item?.name ?? "",
			age: item?.age ?? "",
			gender: item?.gender ?? "",
			disease_profile: item?.disease_profile ?? "",
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
					{t("Discharged Patient")}
				</Text>
			</Flex>
			<Box px="sm" mb="sm">
				<ReportFilterSearch
					module={module}
					showKeywordSearch = {true}
					form={form}
					handleCSVDownload={handleCSVDownload}
				/>
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
							ta: "right",
							render: (_, index) => index + 1,
							footer: `Total: ${records.length}`,
						},
						{
							accessor: "created_at",
							title: t("Created"),
							textAlignment: "right",
							render: (item) => formatDate(item?.created_at),
						},
						{ accessor: "invoice", title: t("InvoiceID") },
						{ accessor: "patient_id", title: t("PatientID") },
						{ accessor: "name", title: t("Name") },
						{ accessor: "age", title: t("Age") },
						{ accessor: "gender", title: t("Gender") },
						{ accessor: "disease_profile", title: t("Disease Profile") },
					]}
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
				filename={`discharge_patient-${formatDate(new Date())}.csv`}
				style={{ display: "none" }}
				ref={csvLinkRef}
			/>
		</Box>
	);
}
