import { useNavigate, useOutletContext, useParams, useLocation } from "react-router-dom";
import { IconCalendarWeek, IconUser, IconArrowRight, IconArrowNarrowRight, IconBed } from "@tabler/icons-react";
import { Box, Flex, Grid, Text, ScrollArea, Button, ActionIcon, LoadingOverlay } from "@mantine/core";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { MODULES } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "@utils/index";
import useInfiniteTableScroll from "@hooks/useInfiniteTableScroll";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import { showEntityData } from "@/app/store/core/crudThunk";
import { showNotificationComponent } from "@components/core-component/showNotificationComponent";

const module = MODULES.ADMISSION;
const PER_PAGE = 500;

export default function _Table({ setSelectedPrescriptionId, ipdMode }) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { state } = useLocation();
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
		const isPrescribed = resultAction?.data?.data?.json_content;

		if (isPrescribed) {
			navigate(
				`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.IPD_ADMITTED.INDEX}/${id}?tabs=true&redirect=prescription`,
				{
					state: { prescriptionId: prescription_id },
					replace: true,
				}
			);
		} else if (prescription_id) {
			navigate(
				`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.IPD_ADMITTED.IPD_PRESCRIPTION}/${prescription_id}?redirect=prescription&itemid=${id}`
			);
		} else {
			console.error(resultAction);
			showNotificationComponent(t("SomethingWentWrongPleaseTryAgain"), "red.6", "lightgray");
		}
	};

	const { records, fetching } = useInfiniteTableScroll({
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
		<Box pos="relative">
			<LoadingOverlay
				visible={fetching}
				zIndex={1000}
				overlayProps={{ radius: "sm", blur: 2 }}
				loaderProps={{ color: "red" }}
			/>
			<Flex gap="sm" p="les" c="white" bg="var(--theme-primary-color-6)" mt="xxxs">
				<Text ta="center" fz="xs" fw={500}>
					S/N
				</Text>
				<Text ta="center" fz="xs" fw={500}>
					Patient Name
				</Text>
			</Flex>
			<ScrollArea bg="white" h={mainAreaHeight - 164} scrollbars="y" px="xxxs">
				{records?.length === 0 && (
					<Flex justify="center" align="center">
						<Text fz="xs">{t("NoDataAvailable")}</Text>
					</Flex>
				)}
				{records?.map((item) => (
					<Grid
						columns={18}
						key={item.id}
						onClick={() => handleProcessConfirmation(item.id)}
						my="xs"
						bg={
							(typeof id !== "undefined" && id == item?.prescription_id) ||
							state?.prescriptionId == item?.prescription_id
								? "var(--theme-primary-color-0)"
								: "var(--theme-tertiary-color-0)"
						}
						px="xs"
						gutter="xs"
					>
						<Grid.Col span={8}>
							<Flex align="center" gap="xxxs">
								<IconCalendarWeek size={16} stroke={1.5} />
								<Text
									fz="xs"
									onClick={() => handleAdmissionOverview(item.prescription_id)}
									className="activate-link text-nowrap"
								>
									{formatDate(item?.created_at)}
								</Text>
							</Flex>
							<Flex align="center" gap="xxxs">
								<IconUser size={16} stroke={1.5} />
								<Text fz="xs">{item.patient_id}</Text>
							</Flex>
							<Flex align="center" gap="xxxs">
								<IconBed size={16} stroke={1.5} />
								<Text fz="xs">{item.visiting_room}</Text>
							</Flex>
						</Grid.Col>
						<Grid.Col span={10}>
							<Flex justify="space-between" align="center">
								<Box>
									<Text fz="xs">{item.name}</Text>
									<Text fz="xs">{item.mobile}</Text>
									<Text fz="xs">{item.patient_payment_mode_name}</Text>
								</Box>
								<Flex direction="column">
									{ipdMode === "non-prescription" && (
										<ActionIcon
											variant="filled"
											onClick={() => handleProcessConfirmation(item.id)}
											color="var(--theme-primary-color-6)"
											radius="xs"
											aria-label="Settings"
										>
											<IconArrowNarrowRight
												style={{ width: "70%", height: "70%" }}
												stroke={1.5}
											/>
										</ActionIcon>
									)}
									{ipdMode === "prescription" && (
										<ActionIcon
											variant="filled"
											onClick={() => handleAdmissionOverview(item.prescription_id)}
											color="var(--theme-secondary-color-6)"
											radius="xs"
											aria-label="Settings"
										>
											<IconArrowNarrowRight
												style={{ width: "70%", height: "70%" }}
												stroke={1.5}
											/>
										</ActionIcon>
									)}
								</Flex>
							</Flex>
						</Grid.Col>
					</Grid>
				))}
			</ScrollArea>
		</Box>
	);
}
