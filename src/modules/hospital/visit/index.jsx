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
import { useState } from "react";
import { IconSearch } from "@tabler/icons-react";

const module = MODULES.VISIT;

export default function Index() {
	const { t } = useTranslation();
	const form = useForm(getVendorFormInitialValues(t));
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();
	const [selectedRoom, setSelectedRoom] = useState(1);

	const handleRoomClick = (room) => {
		setSelectedRoom(room);
		form.setFieldValue("room_id", room);
	};

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
										bg="var(--theme-primary-color-0"
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
									<ScrollArea h={mainAreaHeight - 54} scrollbars="y" p="xs">
										{[...Array(20)].map((_, index) => (
											<RoomCard
												key={index}
												room={index + 1}
												selectedRoom={selectedRoom}
												handleRoomClick={handleRoomClick}
											/>
										))}
									</ScrollArea>
								</Box>
							</Grid.Col>
							<Grid.Col span={20}>
								<Form form={form} module={module} />
							</Grid.Col>
						</Grid>
					</Flex>
				</Box>
			)}
		</>
	);
}
