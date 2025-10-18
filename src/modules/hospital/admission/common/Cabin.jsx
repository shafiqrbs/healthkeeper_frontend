import { Grid, ScrollArea, Text } from "@mantine/core";
import { useOutletContext } from "react-router-dom";
import { HOSPITAL_DROPDOWNS } from "@/app/store/core/utilitySlice";
import useGlobalDropdownData from "@hooks/dropdown/useGlobalDropdownData";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getIndexEntityData } from "@/app/store/core/crudThunk";
import { MASTER_DATA_ROUTES } from "@/constants/routes";
import DetailedRoomCard from "../../common/DetailedRoomCard";

const PER_PAGE = 100;

export default function Cabin({ selectedRoom, handleRoomClick }) {
	const dispatch = useDispatch();
	const { mainAreaHeight } = useOutletContext();
	const listData = useSelector((state) => state.crud.cabin?.data?.data);
	const filterData = useSelector((state) => state.crud.cabin?.filterData);
	const height = mainAreaHeight - 320;

	const { data: getParticularPaymentModes } = useGlobalDropdownData({
		path: HOSPITAL_DROPDOWNS.PARTICULAR_PAYMENT_MODE.PATH,
		params: { "dropdown-type": HOSPITAL_DROPDOWNS.PARTICULAR_PAYMENT_MODE.TYPE },
		utility: HOSPITAL_DROPDOWNS.PARTICULAR_PAYMENT_MODE.UTILITY,
	});

	// =============== filter room data based on payment modes ================
	const filteredRoomsByPaymentMode =
		getParticularPaymentModes?.reduce((acc, paymentMode) => {
			const filteredRooms =
				listData?.filter((room) => room.payment_mode_name?.toLowerCase() === paymentMode.slug) || [];
			acc[paymentMode.slug] = filteredRooms;
			return acc;
		}, {}) || {};

	const fetchData = () => {
		dispatch(
			getIndexEntityData({
				url: MASTER_DATA_ROUTES.API_ROUTES.OPERATIONAL_API.ROOM_CABIN,
				module: "cabin",
				params: { particular_type: "cabin", term: filterData?.keywordSearch || "", page: 1, offset: PER_PAGE },
			})
		);
	};

	useEffect(() => {
		fetchData();
	}, [filterData.keywordSearch]);

	return (
		<Grid columns={24} gutter="xs">
			{getParticularPaymentModes?.map((paymentMode, index) => {
				const isLastColumn = index === getParticularPaymentModes.length - 1;
				const columnSpan = Math.floor(24 / getParticularPaymentModes.length);
				const rooms = filteredRoomsByPaymentMode[paymentMode.slug] || [];

				return (
					<Grid.Col key={index} span={columnSpan}>
						<Text
							mt="xxxs"
							ta="center"
							bg="var(--theme-primary-color-1)"
							px="xs"
							py="xxxs"
							fw={500}
							fz="sm"
						>
							{paymentMode.label}
						</Text>
						<ScrollArea
							pt="xxxs"
							h={height}
							bg="white"
							pl={index === 0 ? "xxxs" : undefined}
							pr={isLastColumn ? "xxxs" : undefined}
						>
							{rooms.map((room, idx) => (
								<DetailedRoomCard
									key={idx}
									room={room}
									selectedRoom={selectedRoom}
									handleRoomClick={handleRoomClick}
								/>
							))}
						</ScrollArea>
					</Grid.Col>
				);
			})}
		</Grid>
	);
}
