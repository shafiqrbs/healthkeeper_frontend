import {Box, Text, Flex, Button, Checkbox, Grid} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {HOSPITAL_DATA_ROUTES, MASTER_DATA_ROUTES} from "@/constants/routes";
import { getIndexEntityData, storeEntityData } from "@/app/store/core/crudThunk";
import tableCss from "@assets/css/TableAdmin.module.css";
import { DataTable } from "mantine-datatable";
import { IconX } from "@tabler/icons-react";
import { errorNotification } from "@components/notification/errorNotification";
import { MODULES_CORE } from "@/constants";
import useAppLocalStore from "@hooks/useAppLocalStore";
const PER_PAGE = 500;
const opdRoomModule = MODULES_CORE.OPD_ROOM;
const module = MODULES_CORE.PARTICULAR;
const ALLOWED_OPD_ROLES = ["doctor_ipd_confirm","admin_administrator"];
export default function OpdRoomStatusModal({ closeOpdRoom, height }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	//const [opened, { open, close }] = useDisclosure(false);
	const [submitFormData, setSubmitFormData] = useState({});
	const [fetching, setFetching] = useState(false);
	const [records, setRecords] = useState([]);
	const [updatingRows, setUpdatingRows] = useState({});
	const { userRoles } = useAppLocalStore();
	const fetchData = async () => {
		setFetching(true);
		const value = {
			url: HOSPITAL_DATA_ROUTES.API_ROUTES.OPD.DOCTOR_ROOM,
			params: {
				particular_type: "opd-room",
				page: 1,
				offset: PER_PAGE,
			},
			module: opdRoomModule,
		};
		try {
			const result = await dispatch(getIndexEntityData(value)).unwrap();
			setRecords(result?.data?.data || []);
		} catch (err) {
			console.error("Unexpected error:", err);
		} finally {
			setTimeout(() => {
				setFetching(false);
			}, 1000);
		}
	};
	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		if (!records?.entities?.length) return;
		setSubmitFormData((prev) => {
			const newData = { ...prev };
			records?.entities?.forEach((item, idx) => {
				if (!newData[item.id]) {
					newData[item.id] = {
						name: item.name ?? "",
						is_opd: item?.is_opd ?? false,
					};
				}
			});
			return newData;
		});
	}, [records]);

	const handleFieldChange = async (rowId, field, value) => {
		setSubmitFormData((prev) => ({
			...prev,
			[rowId]: { ...prev[rowId], [field]: value },
		}));

		setUpdatingRows((prev) => ({ ...prev, [rowId]: true }));

		try {
			await dispatch(
				storeEntityData({
					url: `${MASTER_DATA_ROUTES.API_ROUTES.PARTICULAR.INLINE_UPDATE}/${rowId}`,
					data: { [field]: value },
					module,
				})
			);
		} catch (error) {
			errorNotification(error.message);
		} finally {
			setUpdatingRows((prev) => ({ ...prev, [rowId]: false }));
		}
	};

	return (
		<Box>
			<Flex justify="space-between" align="center" px="sm">
				<Text fw={600} fz="sm" py="xs">
					{t("Doctor Status")}
				</Text>
				<Flex gap="xs" align="center">
					<Button
						onClick={closeOpdRoom}
						variant="outline"
						size="xs"
						radius="es"
						leftSection={<IconX size={16} />}
						color="var(--theme-delete-color)"
					>
						{t("Close")}
					</Button>
				</Flex>
			</Flex>
			<Grid align="center" columns={20}>

				<Grid.Col span={8}>
					<Text fw={600} fz="sm" py="xs">
						{t("ManageOPDRoom")}
					</Text>
					<Box>
						<DataTable
							classNames={{
								root: tableCss.root,
								table: tableCss.table,
								body: tableCss.body,
								header: tableCss.header,
								footer: tableCss.footer,
							}}
							records={records?.entities}
							columns={[
								{
									accessor: "index",
									title: t("S/N"),
									textAlignment: "right",
									render: (item) => records?.entities?.indexOf(item) + 1,
								},
								{
									accessor: "name",
									title: t("Name"),
									textAlignment: "right",
									sortable: true,
									render: (item) => item.name,
								},
								{
									accessor: "invoice_count",
									title: t("Patients"),
									textAlignment: "right",
									sortable: true,
									render: (item) => item.invoice_count,
								},
								{
									accessor: "opd_referred",
									title: t("ReferredRoom"),
									render: (item) => (item.opd_referred === 1 ? "Yes" : "No"),
								},
								{
									accessor: "git",
									title: t("OPDActive"),
									render: (item) => (
										<>
											{userRoles.some((role) => ALLOWED_OPD_ROLES.includes(role)) && (
												<Checkbox
													key={item.id}
													size="sm"
													checked={submitFormData[item.id]?.is_opd ?? false}
													onChange={(val) => handleFieldChange(item.id, "is_opd", val.currentTarget.checked)}
												/>
											)}
										</>
									),
								},
							]}
							fetching={fetching}
							height={height}
							loaderSize="xs"
							loaderColor="grape"
						/>
					</Box>
				</Grid.Col>
				<Grid.Col span={6}>
						<Box>
							<Text fw={600} fz="sm" py="xs">
								{t("Doctor Prescription")}
							</Text>
						</Box>
						<Box>
							<DataTable
								classNames={{
									root: tableCss.root,
									table: tableCss.table,
									body: tableCss.body,
									header: tableCss.header,
									footer: tableCss.footer,
								}}
								records={records?.doctorVisits}
								columns={[
									{
										accessor: "index",
										title: t("S/N"),
										textAlignment: "right",
										render: (item) => records?.doctorVisits?.indexOf(item) + 1,
									},
									{
										accessor: "name",
										title: t("Name"),
										textAlignment: "right",
										sortable: true,
										render: (item) => item.name,
									},
									{
										accessor: "invoice_count",
										title: t("Patients"),
										textAlignment: "right",
										sortable: true,
										render: (item) => item.invoice_count,
									},

								]}
								fetching={fetching}
								height={height}
								loaderSize="xs"
								loaderColor="grape"
							/>

					</Box>
				</Grid.Col>
				<Grid.Col span={6}>
					<Box>
						<Text fw={600} fz="sm" py="xs">
							{t("Admission Confirm")}
						</Text>
					</Box>
					<Box>
						<DataTable
							classNames={{
								root: tableCss.root,
								table: tableCss.table,
								body: tableCss.body,
								header: tableCss.header,
								footer: tableCss.footer,
							}}
							records={records?.doctorIpds}
							columns={[
								{
									accessor: "index",
									title: t("S/N"),
									textAlignment: "right",
									render: (item) => records?.doctorIpds?.indexOf(item) + 1,
								},
								{
									accessor: "name",
									title: t("Name"),
									textAlignment: "right",
									sortable: true,
									render: (item) => item.name,
								},
								{
									accessor: "invoice_count",
									title: t("Patients"),
									textAlignment: "right",
									sortable: true,
									render: (item) => item.invoice_count,
								},

							]}
							fetching={fetching}
							height={height}
							loaderSize="xs"
							loaderColor="grape"
						/>

					</Box>
				</Grid.Col>
			</Grid>
		</Box>
	);
}
