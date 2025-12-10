import {Box, Flex, Grid, ScrollArea} from "@mantine/core";
import Navigation from "@components/layout/Navigation";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import { useOutletContext } from "react-router-dom";
import Form from "./form/_Form";
import { useForm } from "@mantine/form";
import { getVendorFormInitialValues } from "./helpers/request";
import { useTranslation } from "react-i18next";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import {MODULES, MODULES_CORE} from "@/constants";
import _Table from "./_Table";
import OpdRoomModal from "@hospital-components/OpdRoomModal";
import RoomCard from "@hospital-components/RoomCard";
import {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {HOSPITAL_DATA_ROUTES} from "@/constants/routes";
import {getIndexEntityData} from "@/app/store/core/crudThunk";
// import {useMantineScale} from "@/hooks/useMantineScale";

const module = MODULES.VISIT;
const roomModule = MODULES_CORE.OPD_ROOM;

export default function Index() {
	const { t } = useTranslation();
	const form = useForm(getVendorFormInitialValues(t));
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();
	const [searchQuery, setSearchQuery] = useState("");
	// const scale = useMantineScale();

	const [selectedRoom, setSelectedRoom] = useState(1);
	const [records, setRecords] = useState([]);
	const [fetching, setFetching] = useState([]);

	const dispatch = useDispatch();
	const rooms = useSelector((state) => state.crud[roomModule].data);
	const refetching = useSelector((state) => state.crud[roomModule].refetching);


	// Dynamically scale table height and spacing
	// const scaledTableHeight = mainAreaHeight * scale;
	const scaledTableHeight = mainAreaHeight;

	const filteredAndSortedRecords = useMemo(() => {
		if (!records || records.length === 0) return [];

		// filter records by name (case insensitive)
		const filtered = records.filter((item) => item.name?.toLowerCase().includes(searchQuery.toLowerCase()));

		// sort by invoice_count in ascending order
		return filtered.sort((a, b) => (a.invoice_count || 0) - (b.invoice_count || 0));
	}, [records, searchQuery]);

	const fetchData = async () => {
		setFetching(true);
		const value = {
			url: HOSPITAL_DATA_ROUTES.API_ROUTES.OPD.VISITING_ROOM,
			module: roomModule,
		};

		try {
			const result = await dispatch(getIndexEntityData(value)).unwrap();
			const roomData = result?.data?.data?.ipdRooms || [];
			const selectedId = result?.data?.data?.selectedRoom;
			const selectedRoom = roomData.find((item) => item.id === selectedId);

			setRecords(roomData);
			setSelectedRoom(selectedRoom);
			form.setFieldValue("room_id", selectedRoom?.id);
		} catch (err) {
			console.error("Unexpected error:", err);
		} finally {
			setFetching(false);
		}
	};

	useEffect(() => {
		if (rooms?.data?.ipdRooms?.length && !refetching) {
			setRecords(rooms.data.ipdRooms);
			const selectedId = rooms?.data?.selectedRoom;
			const selectedRoom = rooms.data?.ipdRooms?.find((item) => item.id === selectedId);
			setSelectedRoom(selectedRoom);
			form.setFieldValue("room_id", selectedRoom?.id);
		} else {
			fetchData();
		}
	}, [refetching]);

	const handleRoomClick = (room) => {
		setSelectedRoom(room);
		form.setFieldValue("room_id", room.id);
	};
	console.log(filteredAndSortedRecords)

	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
			) : (
				<Box p="md">
					<Flex w="100%" gap="sm">
						<Navigation module="home" mainAreaHeight={mainAreaHeight} />
						<Grid w="100%" columns={24}>
							<Grid.Col span={8}>
								<Form form={form} module={module} />
							</Grid.Col>
							<Grid.Col span={4}>
								<ScrollArea h={mainAreaHeight - 70} scrollbars="y" mt="xs" p="xs" bg="var(--mantine-color-white)">
									{filteredAndSortedRecords?.map((item, index) => (
										<RoomCard
											key={index}
											room={item}
											selectedRoom={selectedRoom}
											handleRoomClick={handleRoomClick}
										/>
									))}
								</ScrollArea>
							</Grid.Col>
							<Grid.Col span={12}>
								<_Table module={module} height={scaledTableHeight} />
							</Grid.Col>
						</Grid>
					</Flex>
				</Box>
			)}
		</>
	);
}
