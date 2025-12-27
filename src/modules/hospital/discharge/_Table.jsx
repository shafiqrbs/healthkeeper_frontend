import { useNavigate, useOutletContext } from "react-router-dom";
import { IconChevronUp, IconSelector } from "@tabler/icons-react";
import { Box, Text } from "@mantine/core";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { MODULES } from "@/constants";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll";
import { useTranslation } from "react-i18next";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";
import { DataTable } from "mantine-datatable";
import tableCss from "@assets/css/Table.module.css";
import { capitalizeWords, formatDateTimeAmPm } from "@utils/index";
import { useForm } from "@mantine/form";
import KeywordSearch from "@hospital-components/KeywordSearch";

const module = MODULES.DISCHARGE;
const PER_PAGE = 50;

export default function _Table() {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const navigate = useNavigate();

	const { records, fetching, handleScrollToBottom, scrollRef, sortStatus, setSortStatus } = useInfiniteTableScroll({
		module,
		fetchUrl: HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.INDEX,
		filterParams: {
			// name: filterData?.name,
			patient_mode: "ipd",
			process: "paid",
			release_mode: "release",
		},
		perPage: PER_PAGE,
		sortByKey: "created_at",
		direction: "desc",
	});

	const form = useForm({
		initialValues: {
			keywordSearch: "",
			created: "",
		},
	});

	const handleProcessConfirmation = async (id) => {
		if (id) {
			navigate(`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.IPD_ADMITTED.MANAGE}/${id}?tab=discharge`, {
				replace: true,
			});
		} else {
			showNotificationComponent(t("NoDataAvailable"), "red.6", "lightgray");
		}
	};

	return (
		<Box pos="relative">
			<Box>
				<KeywordSearch module={module} form={form} />
			</Box>
			<Box className="border-top-none">
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
					onRowClick={({ record }) => {
						handleProcessConfirmation(record.uid);
					}}
					columns={[
						{
							accessor: "index",
							title: t("S/N"),
							textAlignment: "center",
							render: (_, index) => index + 1,
						},
						{
							accessor: "created_at",
							title: t("Created"),
							textAlignment: "right",
							sortable: true,
							render: (item) => <Text fz="xs">{formatDateTimeAmPm(item?.created_at)}</Text>,
						},
						{ accessor: "visiting_room", sortable: true, title: t("RoomNo") },
						{ accessor: "invoice", sortable: true, title: t("InvoiceID") },
						{ accessor: "patient_id", sortable: true, title: t("PatientID") },
						{ accessor: "health_id", title: t("HealthID") },
						{ accessor: "name", sortable: true, title: t("Name") },
						{ accessor: "mobile", title: t("Mobile") },
						{ accessor: "gender", sortable: true, title: t("Gender") },
						{
							accessor: "patient_payment_mode_name",
							sortable: true,
							title: t("Patient"),
						},
						{ accessor: "total", title: t("Total") },
						{
							accessor: "doctor_name",
							title: t("Doctor"),
							render: (item) => item?.doctor_name,
						},
						{
							accessor: "referred_mode",
							title: t("RefMode"),
							render: (item) => capitalizeWords(item?.referred_mode),
						},
					]}
					textSelectionDisabled
					fetching={fetching}
					loaderSize="xs"
					loaderColor="grape"
					height={mainAreaHeight - 164}
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
		</Box>
	);
}
