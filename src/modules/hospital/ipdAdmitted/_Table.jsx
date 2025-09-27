import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import {IconCalendarWeek, IconUser, IconArrowRight, IconArrowNarrowRight} from "@tabler/icons-react";
import {Box, Flex, Grid, Text, ScrollArea, Button, ActionIcon} from "@mantine/core";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { MODULES } from "@/constants";
import {useDispatch, useSelector} from "react-redux";
import { formatDate } from "@utils/index";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll";
import { useTranslation } from "react-i18next";
import {useForm} from "@mantine/form";
import {showEntityData} from "@/app/store/core/crudThunk";
import {showNotificationComponent} from "@components/core-component/showNotificationComponent";

const module = MODULES.ADMISSION;
const PER_PAGE = 500;

export default function _Table({ selectedPrescriptionId, setSelectedPrescriptionId, ipdMode }) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const filterData = useSelector((state) => state.crud[module].filterData);
	const { id } = useParams();
	const form = useForm({
		initialValues: {
			keywordSearch: "",
			created: formatDate(new Date()),
		},
	});


	const handleAdmissionOverview = (prescriptionId, id) => {
		setSelectedPrescriptionId(prescriptionId);
		navigate(`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.IPD_ADMITTED.INDEX}/${id}`, { replace: true });
	};

	const handleProcessConfirmation = async (id) => {
		const resultAction = await dispatch(
			showEntityData({
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.PRESCRIPTION.SEND_TO_PRESCRIPTION}/${id}`,
				module,
				id,
			})
		).unwrap();
		const prescription_id = resultAction?.data?.data.id;
		if (prescription_id) {
			navigate(`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.IPD_ADMITTED.IPD_PRESCRIPTION}/${prescription_id}`);
		} else {
			console.error(resultAction);
			showNotificationComponent(t("Something Went wrong , please try again"), "red.6", "lightgray");
		}
	};


	const { records } = useInfiniteTableScroll({
		module,
		fetchUrl: HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.INDEX,
		filterParams: {
			name: filterData?.name,
			patient_mode: "ipd",
			term: filterData.keywordSearch,
			prescription_mode: ipdMode,
		//	created: form.values.created,
		},
		perPage: PER_PAGE,
		sortByKey: "created_at",
		direction: "desc",
	});

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
						onClick={() => handleAdmissionOverview(item.prescription_id, item.id)}
						my="xs"
						bg={Number(id) === item?.id ? "var(--theme-primary-color-0)" : "var(--theme-tertiary-color-0)"}
						px="xs"
						gutter="xs"
					>
						<Grid.Col span={4}>
							<Flex align="center" gap="xxxs">
								<IconCalendarWeek size={16} stroke={1.5} />

								<Text
									fz="sm"
									onClick={() => handleAdmissionOverview(item.prescription_id)}
									className="activate-link text-nowrap"
								>
									{formatDate(item?.created_at)}
								</Text>
							</Flex>
							<Flex align="center" gap="xxxs">
								<IconUser size={16} stroke={1.5} />
								<Text fz="sm">{item.patient_id}</Text>
							</Flex>
						</Grid.Col>
						<Grid.Col span={3}>
							<Flex align="center" gap="xxxs">
								<Box>
									<Text fz="sm">{item.name}</Text>
									<Text fz="sm">{item.mobile}</Text>
								</Box>
							</Flex>
						</Grid.Col>
						<Grid.Col span={5}>
							<Flex justify="space-between" align="center">
								<Box>
									<Text fz="sm">{item.patient_payment_mode_name}</Text>
									<Text fz="sm">{item.visiting_room}</Text>
								</Box>
								<Flex direction="column">

									<ActionIcon
										variant="filled"
										onClick={() => handleProcessConfirmation(item.id)}
										color="var(--theme-primary-color-6)"
										radius="xs"
										aria-label="Settings"
									>
										<IconArrowNarrowRight style={{ width: "70%", height: "70%" }} stroke={1.5} />
									</ActionIcon>
									{/*<Button
										variant="filled"
										bg="var(--theme-secondary-color-6)"
										c="white"
										size="xs"
										onClick={() => handleAdmissionOverview(item.prescription_id)}
										radius="es"
										rightSection={<IconArrowRight size={18} />}
									>
										{t("Process")}
									</Button>*/}
								</Flex>
							</Flex>
						</Grid.Col>
					</Grid>
				))}
			</ScrollArea>
		</Box>
	);
}
