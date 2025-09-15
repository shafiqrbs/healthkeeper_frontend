import __PatientForm from "../../common/__PatientForm";
import { useEffect, useState, useMemo } from "react";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { getIndexEntityData } from "@/app/store/core/crudThunk";
import { useDispatch, useSelector } from "react-redux";
import { MODULES_CORE } from "@/constants";

const roomModule = MODULES_CORE.OPD_ROOM;

export default function _Form({ form, module }) {
	const [selectedRoom, setSelectedRoom] = useState(1);
	const [records, setRecords] = useState([]);
	const [fetching, setFetching] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const dispatch = useDispatch();
	const rooms = useSelector((state) => state.crud[roomModule].data);

	const filteredAndSortedRecords = useMemo(() => {
		if (!records || records.length === 0) return [];

		// filter records by name (case insensitive)
		const filtered = records.filter((item) => item.name?.toLowerCase().includes(searchQuery.toLowerCase()));

		// sort by invoice_count in ascending order
		return filtered.sort((a, b) => (a.invoice_count || 0) - (b.invoice_count || 0));
	}, [records, searchQuery]);

	const handleRoomClick = (room) => {
		setSelectedRoom(room);
		form.setFieldValue("room_id", room.id);
	};

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
		if (rooms?.data?.ipdRooms?.length) {
			setRecords(rooms.data.ipdRooms);
			const selectedId = rooms?.data?.selectedRoom;
			const selectedRoom = rooms.data?.ipdRooms?.find((item) => item.id === selectedId);
			setSelectedRoom(selectedRoom);
			form.setFieldValue("room_id", selectedRoom?.id);
		} else {
			fetchData();
		}
	}, []);

	return (
		<__PatientForm
			module={module}
			selectedRoom={selectedRoom}
			form={form}
			setSelectedRoom={setSelectedRoom}
			handleRoomClick={handleRoomClick}
			filteredAndSortedRecords={filteredAndSortedRecords}
		/>
	);
}
