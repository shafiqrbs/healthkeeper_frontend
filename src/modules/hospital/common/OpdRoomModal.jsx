import { Box, Text, Flex, Button, Checkbox } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { MASTER_DATA_ROUTES } from "@/constants/routes";
import { getIndexEntityData, storeEntityData } from "@/app/store/core/crudThunk";
import tableCss from "@assets/css/TableAdmin.module.css";
import { DataTable } from "mantine-datatable";
import { IconX } from "@tabler/icons-react";
import { errorNotification } from "@components/notification/errorNotification";
import { MODULES_CORE } from "@/constants";
const PER_PAGE = 500;
const opdRoomModule = MODULES_CORE.OPD_ROOM;
const module = MODULES_CORE.PARTICULAR;
export default function OpdRoomModal({ closeOpdRoom, height }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	//const [opened, { open, close }] = useDisclosure(false);
	const [submitFormData, setSubmitFormData] = useState({});
	const [fetching, setFetching] = useState(false);
	const [records, setRecords] = useState([]);
	const [updatingRows, setUpdatingRows] = useState({});

	const fetchData = async () => {
		setFetching(true);
		const value = {
			url: MASTER_DATA_ROUTES.API_ROUTES.OPD_ROOM.INDEX,
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
		if (!records?.length) return;
		setSubmitFormData((prev) => {
			const newData = { ...prev };
			records.forEach((item, idx) => {
				if (!newData[item.id]) {
					newData[item.id] = {
						name: item.name ?? "",
						status: item?.status ?? false,
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
					{t("ManageOPDRoom")}
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

			<Box>
				<DataTable
					classNames={{
						root: tableCss.root,
						table: tableCss.table,
						body: tableCss.body,
						header: tableCss.header,
						footer: tableCss.footer,
					}}
					records={records}
					columns={[
						{
							accessor: "index",
							title: t("S/N"),
							textAlignment: "right",
							render: (item) => records?.indexOf(item) + 1,
						},
						{
							accessor: "name",
							title: t("Name"),
							textAlignment: "right",
							sortable: true,
							render: (item) => item.name,
						},
						{
							accessor: "opd_referred",
							title: t("ReferredRoom"),
							render: (item) => (item.opd_referred === 1 ? "Yes" : "No"),
						},
						{
							accessor: "status",
							title: t("Status"),
							render: (item) => (
								<Checkbox
									key={item.id}
									size="sm"
									checked={submitFormData[item.id]?.status ?? false}
									onChange={(val) => handleFieldChange(item.id, "status", val.currentTarget.checked)}
								/>
							),
						},
					]}
					fetching={fetching}
					height={height}
					loaderSize="xs"
					loaderColor="grape"
				/>
			</Box>
		</Box>
	);
}
