import {Group, Box, ActionIcon, Text, rem, Flex, Button, Grid, Stack, Title} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
	IconTrashX,
	IconAlertCircle,
	IconEdit,
	IconEye,
	IconChevronUp,
	IconSelector, IconDeviceFloppy,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { modals } from "@mantine/modals";
import KeywordSearch from "@modules/filter/KeywordSearch";
import ViewDrawer from "./__ViewDrawer";
import { notifications } from "@mantine/notifications";
import { useOs, useHotkeys } from "@mantine/hooks";
import CreateButton from "@components/buttons/CreateButton";
import DataTableFooter from "@components/tables/DataTableFooter";
import {HOSPITAL_DATA_ROUTES, MASTER_DATA_ROUTES} from "@/constants/routes";
import tableCss from "@assets/css/Table.module.css";
import {
	deleteEntityData,
	editEntityData, storeEntityData,
} from "@/app/store/core/crudThunk";
import {
	setInsertType,
	setRefetchData,
} from "@/app/store/core/crudSlice.js";
import {
	ERROR_NOTIFICATION_COLOR,
} from "@/constants/index.js";
import { deleteNotification } from "@components/notification/deleteNotification";
import {useState} from "react";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll.js";
import InputForm from "@components/form-builders/InputForm";
import {useForm} from "@mantine/form";
import {getVendorFormInitialValues} from "@modules/hospital/emergency/helpers/request";
import {showNotificationComponent} from "@components/core-component/showNotificationComponent";
import TextAreaForm from "@components/form-builders/TextAreaForm";
import SelectForm from "@components/form-builders/SelectForm";

const PER_PAGE = 50;

export default function _ReportFormatTable({ module, open }) {
	const { t } = useTranslation();
	const os = useOs();
	const dispatch = useDispatch();
	const { mainAreaHeight } = useOutletContext();
	const navigate = useNavigate();
	const { id } = useParams();
	const height = mainAreaHeight - 78;

	const searchKeyword = useSelector((state) => state.crud.searchKeyword);
	const filterData = useSelector((state) => state.crud[module].filterData);
	const listData = useSelector((state) => state.crud[module].data);

	// for infinity table data scroll, call the hook
	const {
		scrollRef,
		records,
		fetching,
		sortStatus,
		setSortStatus,
		handleScrollToBottom,
	} = useInfiniteTableScroll({
		module,
		fetchUrl: MASTER_DATA_ROUTES.API_ROUTES.INVESTIGATION.INDEX,
		filterParams: {
			name: filterData?.name,
			particular_type: 'investigation',
			term: searchKeyword,
		},
		perPage: PER_PAGE,
		sortByKey: "name",
	});

	const [viewDrawer, setViewDrawer] = useState(false);

	const handleEntityEdit = (id) => {
		dispatch(setInsertType({ insertType: "update", module }));
		dispatch(
			editEntityData({
				url: `${MASTER_DATA_ROUTES.API_ROUTES.INVESTIGATION.VIEW}/${id}`,
				module,
			})
		);
		navigate(`${MASTER_DATA_ROUTES.NAVIGATION_LINKS.INVESTIGATION.INDEX}/${id}`);
	};

	const form = useForm(getVendorFormInitialValues(t));
	const [showUserData, setShowUserData] = useState(false);

	const handleSubmit = async () => {
		if (!form.validate().hasErrors) {
			setIsSubmitting(true);

			if (!form.values.amount && form.values.patient_payment_mode_id == "30") {
				showNotificationComponent(t("Amount is required"), "red", "lightgray", true, 1000, true);
				setIsSubmitting(false);
				return {};
			}

			try {
				const createdBy = JSON.parse(localStorage.getItem("user"));
				const options = { year: "numeric", month: "2-digit", day: "2-digit" };
				const [day, month, year] = form.values.dob.split("-").map(Number);
				const dateObj = new Date(year, month - 1, day);

				const today = new Date();

				// strict validation: check if JS normalized it
				const isValid =
					dateObj.getFullYear() === year && dateObj.getMonth() === month - 1 && dateObj.getDate() === day;

				// check if future date
				if (dateObj > today) {
					showNotificationComponent(
						t("Date of birth can't be future date"),
						"red",
						"lightgray",
						true,
						1000,
						true
					);
					setIsSubmitting(false);
					return {};
				}

				const formValue = {
					...form.values,
					created_by_id: createdBy?.id,
					dob: isValid ? dateObj.toLocaleDateString("en-CA", options) : "invalid",
					appointment: new Date(form.values.appointment).toLocaleDateString("en-CA", options),
				};

				const data = {
					url: HOSPITAL_DATA_ROUTES.API_ROUTES.EMERGENCY.CREATE,
					data: formValue,
					module,
				};

				const resultAction = await dispatch(storeEntityData(data));

				if (storeEntityData.rejected.match(resultAction)) {
					showNotificationComponent(resultAction.payload.message, "red", "lightgray", true, 1000, true);
					return {};
				} else {
					showNotificationComponent(
						t("Emergency saved successfully"),
						"green",
						"lightgray",
						true,
						1000,
						true
					);
					setRefetchData({ module, refetching: true });
					const selectedRoom = form.values.room_id;
					form.reset();
					localStorage.removeItem(LOCAL_STORAGE_KEY);
					setShowUserData(false);
					form.setFieldValue("room_id", selectedRoom);
					return resultAction.payload.data;
				}
			} catch (error) {
				console.error("Error submitting emergency:", error);
				showNotificationComponent(t("Something went wrong"), "red", "lightgray", true, 1000, true);
				return {};
			} finally {
				setIsSubmitting(false);
			}
		} else {
			if (Object.keys(form.errors)?.length > 0 && form.isDirty()) {
				console.error(form.errors);
				showNotificationComponent(t("PleaseFillAllFields"), "red", "lightgray", true, 1000, true);
			}
			return {};
		}
	};

	return (
		<>
			<Box p="xs" className="boxBackground borderRadiusAll border-bottom-none ">
				<Flex align="center" justify="space-between" gap={4}>
					<KeywordSearch module={module} />
				</Flex>
			</Box>

			<Box className="borderRadiusAll border-top-none">
				<Grid w="100%" columns={24}>
					<Grid.Col span={16}>
						<DataTable
							classNames={{
								root: tableCss.root,
								table: tableCss.table,
								body: tableCss.body,
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
									sortable: false,
									render: (_item, index) => index + 1,
								},
								{
									accessor: "category",
									title: t("Category"),
									textAlignment: "right",
									sortable: true,
									render: (item) => item.category,
								},
								{
									accessor: "name",
									title: t("Name"),
									sortable: true,
									render: (values) => (
										<Text
											className="activate-link"
											fz="sm"
											onClick={() => handleDataShow(values.id)}
										>
											{values.name}
										</Text>
									),
								},
								{
									accessor: "display_name",
									title: t("DisplayName"),
									sortable: true,
									render: (values) => (
										<Text
											className="activate-link"
											fz="sm"
											onClick={() => handleDataShow(values.id)}
										>
											{values.display_name}
										</Text>
									),
								},

								{
									accessor: "price",
									title: t("Price"),
									sortable: false,
								},

								{
									accessor: "action",
									title: "",
									textAlign: "right",
									titleClassName: "title-right",
									render: (values) => (
										<Group gap={4} justify="right" wrap="nowrap">
											<Button.Group>
												<Button
													onClick={() => {
														handleEntityEdit(values.id);
														open();
													}}
													variant="filled"
													c="white"
													size="xs"
													radius="es"
													leftSection={<IconEdit size={16} />}
													className="border-right-radius-none btnPrimaryBg"
												>
													{t("Edit")}
												</Button>
												<Button
													onClick={() => handleDataShow(values.id)}
													variant="filled"
													c="white"
													bg="var(--theme-primary-color-6)"
													size="xs"
													radius="es"
													leftSection={<IconEye size={16} />}
													className="border-left-radius-none"
												>
													{t("View")}
												</Button>
												<ActionIcon
													onClick={() => handleDelete(values.id)}
													className="action-icon-menu border-left-radius-none"
													variant="light"
													color="var(--theme-delete-color)"
													radius="es"
													ps="les"
													aria-label="Settings"
												>
													<IconTrashX height={18} width={18} stroke={1.5} />
												</ActionIcon>
											</Button.Group>
										</Group>
									),
								},
							]}
							textSelectionDisabled
							fetching={fetching}
							loaderSize="xs"
							loaderColor="grape"
							height={height - 72}
							onScrollToBottom={handleScrollToBottom}
							scrollViewportRef={scrollRef}
							sortStatus={sortStatus}
							onSortStatusChange={setSortStatus}
							sortIcons={{
								sorted: (
									<IconChevronUp
										color="var(--theme-tertiary-color-7)"
										size={14}
									/>
								),
								unsorted: (
									<IconSelector color="var(--theme-tertiary-color-7)" size={14} />
								),
							}}
						/>
					</Grid.Col>
					<Grid.Col span={8}>
						<Box pt={'4'} ml={'4'} pb={'4'} pr={'12'} bg="var(--theme-primary-color-1)" >
							<Stack right align="flex-end">
								<>
									<Button
										size="xs"
										bg="var(--theme-primary-color-6)"
										type="submit"
										id="EntityFormSubmit"
										leftSection={<IconDeviceFloppy size={16} />}
									>
										<Flex direction={`column`} gap={0}>
											<Text fz={14} fw={400}>
												{t("CreateAndSave")}
											</Text>
										</Flex>
									</Button>
								</>
							</Stack>
						</Box>
						<Stack mih={height} className="form-stack-vertical">
							<Grid align="center">
								<Grid.Col span={12} pb={0}>
									<SelectForm
										form={form}
										label={t("ParentName")}
										tooltip={t("ParentName")}
										placeholder={t("ParentName")}
										name="parent_id"
										id="parent_id"
										nextField="name"
										value={form.values.patient_id}
										required={false}
									/>
								</Grid.Col>
							</Grid>
							<Grid align="center">
								<Grid.Col span={12} pb={0}>
									<InputForm
										form={form}
										label={t("Name")}
										tooltip={t("NameName")}
										placeholder={t("ParameterName")}
										name="name"
										id="name"
										nextField="sample_value"
										value={form.values.name}
										required={true}
									/>
								</Grid.Col>
							</Grid>
							<Grid align="center">
								<Grid.Col span={12} pb={0}>
									<InputForm
										form={form}
										label={t("SampleValue")}
										tooltip={t("SampleValue")}
										placeholder={t("SampleValue")}
										name="sample_value"
										id="sample_value"
										nextField="unit_name"
										value={form.values.sample_value}
									/>
								</Grid.Col>
							</Grid>
							<Grid align="center">
								<Grid.Col span={12} pb={0}>
									<InputForm
										form={form}
										label={t("UnitName")}
										tooltip={t("UnitName")}
										placeholder={t("UnitName")}
										name="unit_name"
										id="unit_name"
										nextField="reference_value"
										value={form.values.unit_name}
									/>
								</Grid.Col>
							</Grid>
							<Grid align="center">
								<Grid.Col span={12} pb={0}>
									<TextAreaForm
										form={form}
										label={t("ReferenceValue")}
										tooltip={t("ReferenceValue")}
										placeholder={t("ReferenceValue")}
										name="reference_value"
										id="reference_value"
										nextField=""
										value={form.values.reference_value}
									/>
								</Grid.Col>
							</Grid>
						</Stack>
					</Grid.Col>
				</Grid>


			</Box>

			<DataTableFooter indexData={listData} module={module} />
			<ViewDrawer viewDrawer={viewDrawer} setViewDrawer={setViewDrawer} module={module} />
		</>
	);
}

