import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { IconCalendarWeek, IconUser, IconArrowNarrowRight } from "@tabler/icons-react";
import { Box, Flex, Grid, Text, ScrollArea, Button, ActionIcon, LoadingOverlay } from "@mantine/core";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { useState } from "react";
import { MODULES } from "@/constants";
import { formatDate } from "@utils/index";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll";
import { useSelector } from "react-redux";

const module = MODULES.BILLING;
const PER_PAGE = 500;

export default function _Table({ patient_mode }) {
	const { id } = useParams();
	const { mainAreaHeight } = useOutletContext();
	const navigate = useNavigate();
	const [selectedPatientId, setSelectedPatientId] = useState(id);
	const filterData = useSelector((state) => state.crud[module].filterData);

	const handleAdmissionOverview = (id) => {
		setSelectedPatientId(id);
		navigate(`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.ADMISSION_BILLING.VIEW}/${id}`);
	};

	const { records, fetching } = useInfiniteTableScroll({
		module,
		fetchUrl: HOSPITAL_DATA_ROUTES.API_ROUTES.BILLING.INDEX,
		perPage: PER_PAGE,
		sortByKey: "created_at",
		direction: "desc",
		filterParams: {
			created: filterData.created,
			term: filterData.keywordSearch,
			admission_billing:'billing',
		},
	});

	const handleView = (id) => {
		console.info(id);
	};

	return (
		<Box>
			<Flex gap="sm" p="les" c="white" bg="var(--theme-primary-color-6)" mt="3xs">
				<Text ta="center" fz="sm" fw={500}>
					S/N
				</Text>
				<Text ta="center" fz="sm" fw={500}>
					Patient Name
				</Text>
			</Flex>
			<ScrollArea bg="var(--mantine-color-white)" h={mainAreaHeight - 152} scrollbars="y" px="3xs">
				<LoadingOverlay visible={fetching} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
				{records?.map((item) => (
					<Grid
						columns={12}
						key={item.id}
						onClick={() => handleAdmissionOverview(item.uid)}
						my="xs"
						bg={
							String(selectedPatientId) === String(item?.uid)
								? "var(--theme-primary-color-0)"
								: "var(--theme-tertiary-color-0)"
						}
						px="xs"
						gutter="xs"
					>
						<Grid.Col span={6}>
							<Flex align="center" gap="3xs">
								<IconCalendarWeek size={16} stroke={1.5} />

								<Text
									fz="sm"
									onClick={() => handleView(item?.id)}
									className="activate-link text-nowrap"
								>
									{formatDate(item?.created_at)}
								</Text>
							</Flex>
							<Flex align="center" gap="3xs">
								<IconUser size={16} stroke={1.5} />
								<Text fz="sm">{item.patient_id}</Text>
							</Flex>
						</Grid.Col>
						<Grid.Col span={6}>
							<Flex justify="space-between" align="center" gap="3xs">
								<Box>
									<Text fz="sm">{item.name}</Text>
									<Text fz="sm">{item.mobile}</Text>
								</Box>
								<Button.Group>
									<ActionIcon
										variant="filled"
										onClick={() => handleAdmissionOverview(item.uid)}
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
