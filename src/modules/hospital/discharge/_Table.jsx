import { useNavigate, useOutletContext } from "react-router-dom";
import { IconArrowRight, IconChevronUp, IconSelector } from "@tabler/icons-react";
import { Box, Button, Text } from "@mantine/core";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { MODULES } from "@/constants";
import { useTranslation } from "react-i18next";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";
import { DataTable } from "mantine-datatable";
import tableCss from "@assets/css/Table.module.css";
import {capitalizeWords, formatDate, formatDateTimeAmPm} from "@utils/index";
import { useForm } from "@mantine/form";
import KeywordSearch from "@hospital-components/KeywordSearch";
import usePagination from "@hooks/usePagination";
import useAppLocalStore from "@hooks/useAppLocalStore";
import {getDataWithoutStore} from "@/services/apiService";
import {useSelector} from "react-redux";

const module = MODULES.DISCHARGE;
const PER_PAGE = 25;
const ALLOWED_CONFIRMED_ROLES = ["doctor_ipd","doctor_rs_rp_confirm", "doctor_emergency", "admin_administrator"];


export default function _Table() {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const navigate = useNavigate();
	const { userRoles } = useAppLocalStore();
	const filterData = useSelector((state) => state.crud[module].filterData);


	const form = useForm({
		initialValues: {
			keywordSearch: "",
			created: formatDate(new Date()),
			room_id: "",
		},
	});

	const { scrollRef, records, fetching, sortStatus, setSortStatus, page, total, perPage, handlePageChange } =
		usePagination({
			module,
			fetchUrl: HOSPITAL_DATA_ROUTES.API_ROUTES.ADMISSION.INDEX_CONFIRM,
			filterParams: {
				name: filterData?.name,
				patient_mode: "ipd",
				process: "paid",
				created: form.values.created,
				term: form.values.keywordSearch,
			},
			perPage: PER_PAGE,
			sortByKey: "created_at",
			direction: "desc",
		});

	const handleProcessConfirmation = async (id) => {
		if (id) {
			const { data } = await getDataWithoutStore({
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.DISCHARGE_PROCESS}/${id}`,
			});
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
						{ accessor: "room_name", sortable: true, title: t("RoomNo") },
						{ accessor: "invoice", sortable: true, title: t("InvoiceID") },
						{ accessor: "patient_id", sortable: true, title: t("PatientID") },
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
							accessor: "release_mode",
							title: t("RefMode"),
							render: (item) => capitalizeWords(item?.release_mode),
						},
						{
							accessor: "",
							title: t("Action"),
							render: (item) => (
								userRoles.some((role) => ALLOWED_CONFIRMED_ROLES.includes(role)) &&
								item.process?.toLowerCase() === "paid" && (
									<Button
										variant="filled"
										size="compact-xs"
										color="var(--theme-primary-color-6)"
										onClick={() => handleProcessConfirmation(item.uid)}
										rightSection={<IconArrowRight size={14} />}
									>
										{t("Process")}
									</Button>
								)
							),
						}
					]}
					fetching={fetching}
					loaderSize="xs"
					loaderColor="grape"
					height={mainAreaHeight - 114}
					page={page}
					scrollViewportRef={scrollRef}
					totalRecords={total}
					recordsPerPage={perPage}
					onPageChange={handlePageChange}
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
