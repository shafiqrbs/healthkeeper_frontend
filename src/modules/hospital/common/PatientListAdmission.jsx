import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { IconCalendarWeek, IconUser, IconArrowNarrowRight } from "@tabler/icons-react";
import { Box, Flex, Grid, Text, ScrollArea, Button, ActionIcon } from "@mantine/core";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useEffect, useState } from "react";
import { getIndexEntityData } from "@/app/store/core/crudThunk";
import { MODULES } from "@/constants";
import {useDispatch, useSelector} from "react-redux";
import { formatDate } from "@utils/index";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll";

const module = MODULES.ADMISSION;
const PER_PAGE = 500;

export default function PatientListAdmission() {
	const { id } = useParams();
	const { mainAreaHeight } = useOutletContext();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const filterData = useSelector((state) => state.crud[module].filterData);
	const [selectedPatientId, setSelectedPatientId] = useState(id);
	const handleAdmissionOverview = (id) => {
		setSelectedPatientId(id)
		navigate(`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.IPD_ADMISSION.VIEW}/${id}`);
	};

	const {
		scrollRef,
		records,
		fetching,
		sortStatus,
		setSortStatus,
		handleScrollToBottom,
	} = useInfiniteTableScroll({
		module,
		fetchUrl: HOSPITAL_DATA_ROUTES.API_ROUTES.OPD.INDEX,
		filterParams: {
			name: filterData?.name,
			patient_mode: "ipd",
			process: "New",
			term: filterData.keywordSearch,
		},
		perPage: PER_PAGE,
		sortByKey: "created_at",
		direction: "desc",
	});
	console.log(selectedPatientId)

	return (
		<Box>
			<Flex gap="sm" p="les" c="white" bg="var(--theme-primary-color-6)" mt="xxxs">
				<Text ta="center" fz="sm" fw={500}>
					S/N
				</Text>
				<Text ta="center" fz="sm" fw={500}>
					Patient Name
				</Text>
			</Flex>
			<ScrollArea bg="white" h={mainAreaHeight - 164} scrollbars="y" px="xxxs">
				{records?.map((item) => (
					<Grid
						columns={12}
						key={item.id}
						onClick={()=>handleAdmissionOverview(item.id)}
						my="xs"
						bg={
							Number(selectedPatientId) === item?.id
								? "var(--theme-primary-color-0)"
								: "var(--theme-tertiary-color-0)"
						}
						px="xs"
						gutter="xs"
					>
						<Grid.Col span={4}>
							<Flex align="center" gap="xxxs">
								<IconCalendarWeek size={16} stroke={1.5} />

								<Text
									fz="sm"
									onClick={() => handleView(item?.id)}
									className="activate-link text-nowrap">
									{formatDate(item?.created_at)}
								</Text>
							</Flex>
							<Flex align="center" gap="xxxs">
								<IconUser size={16} stroke={1.5} />
								<Text fz="sm">{item.patient_id}</Text>
							</Flex>
						</Grid.Col>
						<Grid.Col span={4}>
							<Flex align="center" gap="xxxs">
								<Box>
									<Text fz="sm">{item.name}</Text>
									<Text fz="sm">{item.mobile}</Text>
								</Box>
							</Flex>
						</Grid.Col>
						<Grid.Col span={4}>
							<Flex justify="space-between" align="center">
								<Box>
									<Text fz="sm">{item.patient_payment_mode_name}</Text>
									<Text fz="sm">{item.visiting_room}</Text>
								</Box>
								<Button.Group>
									<ActionIcon
										variant="filled"
										onClick={() => handleAdmissionOverview(item.id)}
										color="var(--theme-primary-color-6)"
										radius="xs"
										aria-label="Settings"
									>
										<IconArrowNarrowRight style={{ width: "70%", height: "70%" }} stroke={1.5} />
									</ActionIcon>

								</Button.Group>
							</Flex>
						</Grid.Col>
					</Grid>
				))}
			</ScrollArea>
		</Box>
	);
}
