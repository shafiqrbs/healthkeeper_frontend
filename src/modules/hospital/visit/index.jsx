import { Box, Flex, Grid, ScrollArea, Text, TextInput } from "@mantine/core";
import Navigation from "@components/layout/Navigation";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import { useOutletContext } from "react-router-dom";
import Form from "./form/_Form";
import { useForm } from "@mantine/form";
import { getVendorFormInitialValues } from "./helpers/request";
import { useTranslation } from "react-i18next";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import { MODULES } from "@/constants";
import RoomCard from "../common/RoomCard";
import { useEffect, useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { getIndexEntityData } from "@/app/store/core/crudThunk";
import { useDispatch } from "react-redux";

const module = MODULES.VISIT;

export default function Index() {
	const { t } = useTranslation();
	const form = useForm(getVendorFormInitialValues(t));
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();
	const [selectedRoom, setSelectedRoom] = useState(1);
	const [records, setRecords] = useState([]);
	const [fetching, setFetching] = useState([]);
	const dispatch = useDispatch();

	const handleRoomClick = (room) => {
		setSelectedRoom(room);
		form.setFieldValue("room_id", room.id);
	};

	const fetchData = async () => {
		setFetching(true);
		const value = {
			url: HOSPITAL_DATA_ROUTES.API_ROUTES.OPD.VISITING_ROOM,
			module,
		};
		try {
			const result = await dispatch(getIndexEntityData(value)).unwrap();
			const roomData = result?.data?.data || [];
			setRecords(roomData);
			setSelectedRoom(roomData[0]);
			form.setFieldValue("room_id", roomData[0].id);
		} catch (err) {
			console.error("Unexpected error:", err);
		} finally {
			setFetching(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<>
			{progress !== 100 ? (
				<DefaultSkeleton />
			) : (
				<Box p="md">
					<Flex w="100%" gap="sm">
						<Navigation module="home" mainAreaHeight={mainAreaHeight} />
						<Grid w="100%" columns={24}>
							<Grid.Col span={4}>
								<Box bg="white" className="borderRadiusAll">
									<Text
										py="md"
										bg="var(--theme-secondary-color-3"
										className="borderRadiusTop"
										px="sm"
										fz="sm"
									>
										{t("selectRoom")}
									</Text>
									<Box mt="es" p="xs" bg="var(--theme-primary-color-0)">
										<TextInput
											leftSection={<IconSearch size={18} />}
											name="search"
											placeholder={t("search")}
										/>
									</Box>
									<ScrollArea h={mainAreaHeight - 120} scrollbars="y" p="xs">
										{records?.map((item, index) => (
											<RoomCard
												key={index}
												room={item}
												selectedRoom={selectedRoom}
												handleRoomClick={handleRoomClick}
											/>
										))}
									</ScrollArea>
								</Box>
							</Grid.Col>
							<Grid.Col span={20}>
								<Form form={form} selectedRoom={selectedRoom} module={module} />
							</Grid.Col>
						</Grid>
					</Flex>
				</Box>
			)}
		</>
	);
}
