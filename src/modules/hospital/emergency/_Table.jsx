import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import DataTableFooter from "@components/tables/DataTableFooter";
import { ActionIcon, Box, Button, Flex, FloatingIndicator, Grid, Group, Menu, Tabs, Text } from "@mantine/core";
import { IconArrowRight, IconDotsVertical, IconTrashX } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useTranslation } from "react-i18next";
import { rem } from "@mantine/core";
import tableCss from "@assets/css/Table.module.css";
import filterTabsCss from "@assets/css/FilterTabs.module.css";

import KeywordSearch from "../common/KeywordSearch";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import DetailsDrawer from "./__DetailsDrawer";
import OverviewDrawer from "./__OverviewDrawer";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useDispatch, useSelector } from "react-redux";
import { sortBy } from "lodash";
import { getIndexEntityData } from "@/app/store/core/crudThunk";
import { setItemData } from "@/app/store/core/crudSlice";
import { formatDate } from "@utils/index";
import CompactDrawer from "@/common/components/drawers/CompactDrawer";
import TextAreaForm from "@/common/components/form-builders/TextAreaForm";

const PER_PAGE = 20;
const tabs = ["all", "closed", "done", "inProgress", "returned"];

export default function Table({ module }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const listData = useSelector((state) => state.crud[module].data);
	const refetch = useSelector((state) => state.crud[module].refetching);
	const [fetching, setFetching] = useState(false);
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 34;
	const scrollViewportRef = useRef(null);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [opened, { open, close }] = useDisclosure(false);
	const [openedOverview, { open: openOverview, close: closeOverview }] = useDisclosure(false);
	const [openedAdmission, { open: openAdmission, close: closeAdmission }] = useDisclosure(false);

	const form = useForm({
		initialValues: {
			keywordSearch: "",
			admission_comment: "",
		},
	});

	const [rootRef, setRootRef] = useState(null);
	const [value, setValue] = useState("all");
	const [controlsRefs, setControlsRefs] = useState({});

	const filterData = useSelector((state) => state.crud[module].filterData);

	const [sortStatus, setSortStatus] = useState({
		columnAccessor: "name",
		direction: "asc",
	});

	const [records, setRecords] = useState(sortBy(listData.data, "name"));

	useEffect(() => {
		const data = sortBy(listData.data, sortStatus.columnAccessor);
		setRecords(sortStatus.direction === "desc" ? data.reverse() : data);
	}, [sortStatus, listData.data]);

	const setControlRef = (val) => (node) => {
		controlsRefs[val] = node;
		setControlsRefs(controlsRefs);
	};

	const fetchData = async (pageNum = 1, append = false) => {
		if (!hasMore && pageNum > 1) return;

		setFetching(true);
		const value = {
			url: HOSPITAL_DATA_ROUTES.API_ROUTES.OPD.INDEX,
			params: {
				term: filterData.keywordSearch,
				page: pageNum,
				offset: PER_PAGE,
			},
			module,
		};

		try {
			const result = await dispatch(getIndexEntityData(value));
			if (result.payload) {
				const newData = result.payload.data;
				const total = result.payload.total;

				// Update hasMore based on whether we've loaded all data
				setHasMore(newData.length === PER_PAGE && pageNum * PER_PAGE < total);

				// If appending, combine with existing data
				if (append && pageNum > 1) {
					dispatch(
						setItemData({
							module,
							data: {
								...listData,
								data: [...listData.data, ...newData],
								total,
							},
						})
					);
				}
			}
		} catch (err) {
			console.error("Unexpected error:", err);
		} finally {
			setFetching(false);
		}
	};

	const loadMoreRecords = useCallback(() => {
		if (hasMore && !fetching) {
			const nextPage = page + 1;
			setPage(nextPage);
			fetchData(nextPage, true);
		} else if (!hasMore) {
			console.info("No more records");
		}
	}, [hasMore, fetching, page]);

	useEffect(() => {
		fetchData(1, false);
		setPage(1);
		setHasMore(true);
		// reset scroll position when data is refreshed
		scrollViewportRef.current?.scrollTo(0, 0);
	}, [dispatch, refetch, filterData]);

	const handleView = (id) => {
		open();
	};

	const handleOpenViewOverview = () => {
		openOverview();
	};

	const handlePrescription = () => {
		navigate(HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.PRESCRIPTION.INDEX);
	};

	const handleAdmission = () => {
		console.log(form.values);
		navigate(HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.ADMISSION.INDEX);
	};

	return (
		<Box w="100%" bg="white" style={{ borderRadius: "4px" }}>
			<Flex justify="space-between" align="center" px="sm">
				<Text fw={600} fz="sm" py="xs">
					{t("EmergencyInformation")}
				</Text>
				<Flex gap="xs" align="center">
					<Tabs mt="xs" variant="none" value={value} onChange={setValue}>
						<Tabs.List ref={setRootRef} className={filterTabsCss.list}>
							{tabs.map((tab) => (
								<Tabs.Tab value={tab} ref={setControlRef(tab)} className={filterTabsCss.tab} key={tab}>
									{t(tab)}
								</Tabs.Tab>
							))}
							<FloatingIndicator
								target={value ? controlsRefs[value] : null}
								parent={rootRef}
								className={filterTabsCss.indicator}
							/>
						</Tabs.List>
					</Tabs>
					<Button
						onClick={handleOpenViewOverview}
						size="xs"
						radius="es"
						rightSection={<IconArrowRight size={16} />}
						bg="var(--theme-success-color)"
						c="white"
					>
						{t("VisitOverview")}
					</Button>
				</Flex>
			</Flex>
			<Box px="sm" mb="sm">
				<KeywordSearch form={form} />
			</Box>
			<Box className="borderRadiusAll border-top-none" px="sm">
				<DataTable
					striped
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
							render: (item) => (
								<Text fz="sm" onClick={() => handleView(item.id)} className="activate-link text-nowrap">
									{formatDate(item.created_at)}
								</Text>
							),
						},
						{
							accessor: "created_by",
							title: t("CreatedBy"),
							render: (item) => item.created_by || "N/A",
						},
						{ accessor: "patient_id", title: t("patientId") },
						{ accessor: "name", title: t("Name") },
						{ accessor: "mobile", title: t("Mobile") },
						{ accessor: "doctor_name", title: t("doctor") },
						{ accessor: "total", title: t("Total") },
						{
							accessor: "action",
							title: t("Action"),
							textAlign: "right",
							titleClassName: "title-right",
							render: (values) => (
								<Group gap={4} justify="right" wrap="nowrap">
									<Button
										variant="filled"
										bg="var(--theme-primary-color-6)"
										c="white"
										size="xs"
										onClick={() => handlePrescription(values.id)}
										radius="es"
										rightSection={<IconArrowRight size={18} />}
									>
										{t("Prescription")}
									</Button>
									<Button
										variant="filled"
										bg="var(--theme-success-color)"
										c="white"
										size="xs"
										onClick={openAdmission}
										radius="es"
										rightSection={<IconArrowRight size={18} />}
										className="border-right-radius-none"
									>
										{t("Admission")}
									</Button>
									<Menu
										position="bottom-end"
										offset={3}
										withArrow
										trigger="hover"
										openDelay={100}
										closeDelay={400}
									>
										<Menu.Target>
											<ActionIcon
												className="action-icon-menu border-left-radius-none"
												variant="default"
												radius="es"
												aria-label="Settings"
											>
												<IconDotsVertical height={18} width={18} stroke={1.5} />
											</ActionIcon>
										</Menu.Target>
										<Menu.Dropdown>
											<Menu.Item
												onClick={() => {
													// handleVendorEdit(values.id);
													// open();
												}}
											>
												{t("Edit")}
											</Menu.Item>
											<Menu.Item
												// onClick={() => handleDelete(values.id)}
												bg="red.1"
												c="red.6"
												rightSection={
													<IconTrashX
														style={{
															width: rem(14),
															height: rem(14),
														}}
													/>
												}
											>
												{t("Delete")}
											</Menu.Item>
										</Menu.Dropdown>
									</Menu>
								</Group>
							),
						},
					]}
					fetching={fetching}
					loaderSize="xs"
					loaderColor="grape"
					height={height - 118}
					onScrollToBottom={loadMoreRecords}
					scrollViewportRef={scrollViewportRef}
				/>
			</Box>
			<DataTableFooter indexData={listData} module="visit" />
			<DetailsDrawer opened={opened} close={close} />
			<OverviewDrawer opened={openedOverview} close={closeOverview} />

			<CompactDrawer
				opened={openedAdmission}
				close={closeAdmission}
				save={() => handleAdmission()}
				position="right"
				size="30%"
				keepMounted={false}
				bg="white"
				title={t("Admission")}
			>
				<Grid align="center" columns={20}>
					<Grid.Col span={7}>
						<Text fz="sm">{t("Comment")}</Text>
					</Grid.Col>
					<Grid.Col span={13}>
						<TextAreaForm
							tooltip={t("Comment")}
							label=""
							placeholder={t("DummyMessage")}
							form={form}
							name="admission_comment"
							mt={0}
							id="comment"
							showRightSection={false}
							style={{ input: { height: 100 } }}
						/>
					</Grid.Col>
				</Grid>
			</CompactDrawer>
		</Box>
	);
}
