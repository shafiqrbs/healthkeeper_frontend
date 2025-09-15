import {
	Box,
	Grid,
	Modal,
	Stack,
	Text,
	Badge,
	TextInput,
	Select,
	Group,
	ActionIcon,
	Flex,
	Tabs,
	FloatingIndicator, Button, Checkbox
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {MASTER_DATA_ROUTES} from "@/constants/routes";
import {editEntityData, getIndexEntityData, storeEntityData} from "@/app/store/core/crudThunk";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll";
import tableCss from "@assets/css/Table.module.css";
import {IconArrowRight, IconDeviceFloppy,IconX, IconTrashX,IconWindowMinimize,IconArrowDownLeft} from "@tabler/icons-react";
import {DataTable} from "mantine-datatable";
import filterTabsCss from "@assets/css/FilterTabs.module.css";
import {errorNotification} from "@components/notification/errorNotification";

const PER_PAGE = 500;

export default function OpdRoomModal({ openedOpdRoom, closeOpdRoom,module,height }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	//const [opened, { open, close }] = useDisclosure(false);
	const [submitFormData, setSubmitFormData] = useState({});
	const searchKeyword = useSelector((state) => state.crud.searchKeyword);
	const filterData = useSelector((state) => state.crud[module].filterData);
	const listData = useSelector((state) => state.crud[module].data);
	const [fetching, setFetching] = useState(false);
	const [records, setRecords] = useState([]);
	const [updatingRows, setUpdatingRows] = useState({});
	const fetchData = async () => {
		setFetching(true);
		const value = {
			url:  MASTER_DATA_ROUTES.API_ROUTES.OPD_ROOM.INDEX,
			params: {
				particular_type: 'opd-room',
				page: 1,
				offset: PER_PAGE,
			},
			module,
		};
		try {
			const result = await dispatch(getIndexEntityData(value)).unwrap();
			setRecords(result?.data?.data|| []);
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
								onChange={(val) =>
									handleFieldChange(
										item.id,
										"status",
										val.currentTarget.checked
									)
								}
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
