import { Box, Flex, Grid } from "@mantine/core";
import Navigation from "@components/layout/Navigation";
import { useGetLoadingProgress } from "@hooks/loading-progress/useGetLoadingProgress";
import { useOutletContext } from "react-router-dom";
import Form from "./form/_Form";
import { useForm } from "@mantine/form";
import { getVendorFormInitialValues } from "./helpers/request";
import { useTranslation } from "react-i18next";
import DefaultSkeleton from "@components/skeletons/DefaultSkeleton";
import { MODULES } from "@/constants";
import _Table from "./_Table";

const module = MODULES.VISIT;

export default function Index() {
	const { t } = useTranslation();
	const form = useForm(getVendorFormInitialValues(t));
	const progress = useGetLoadingProgress();
	const { mainAreaHeight } = useOutletContext();

	return (
		<>
			{/* {progress !== 100 ? (
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
										{t("SelectRoom")}
									</Text>
									<Box mt="es" p="xs" bg="var(--theme-primary-color-0)">
										<TextInput
											leftSection={<IconSearch size={18} />}
											name="search"
											placeholder={t("SearchByRoomName")}
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
										/>
									</Box>
									<ScrollArea h={mainAreaHeight - 120} scrollbars="y" p="xs">
										{filteredAndSortedRecords?.map((item, index) => (
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
								<Form
									form={form}
									setSelectedRoom={setSelectedRoom}
									selectedRoom={selectedRoom}
									module={module}
								/>
							</Grid.Col>
						</Grid>
					</Flex>
				</Box>
			)} */}
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
							<Grid.Col span={16}>
								<_Table module={module} height={mainAreaHeight - 156} />
							</Grid.Col>
						</Grid>
					</Flex>
				</Box>
			)}
		</>
	);
}
