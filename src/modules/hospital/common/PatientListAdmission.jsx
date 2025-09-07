import { useNavigate, useOutletContext } from "react-router-dom";
import { IconCalendarWeek, IconUser,IconArrowNarrowRight } from "@tabler/icons-react";
import { Box, Flex, Grid, Text, ScrollArea, Button,ActionIcon } from "@mantine/core";
import { useTranslation } from "react-i18next";
import {HOSPITAL_DATA_ROUTES, MASTER_DATA_ROUTES} from "@/constants/routes";
import {useEffect, useState} from "react";
import {getIndexEntityData} from "@/app/store/core/crudThunk";
import {MODULES} from "@/constants";
import {useDispatch} from "react-redux";
import {formatDate} from "@utils/index";



const module = MODULES.ADMISSION;
const PER_PAGE = 500;
export default function PatientListAdmission({ isOpenPatientInfo, setIsOpenPatientInfo,selectedId }) {

	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const navigate = useNavigate();
	const [records,setRecords] = useState([]);
	const [fetching,setFetching] = useState([]);
	const dispatch = useDispatch();

	const handleAdmissionOverview = (id) => {
		navigate(`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.IPD_ADMISSION.VIEW}/${id}`);
	};



	const fetchData = async () => {
		setFetching(true);
		const value = {
			url: HOSPITAL_DATA_ROUTES.API_ROUTES.OPD.INDEX,
			params: {
			//	term: filterData.keywordSearch,
			//	created: filterData.created,
				page: 1,
				offset: PER_PAGE,
				patient_mode: "ipd",
				process: "New",
			},
			module,
		};
		try {
			const result = await dispatch(getIndexEntityData(value)).unwrap();
			setRecords(result?.data?.data|| []);
		} catch (err) {
			console.error("Unexpected error:", err);
		} finally {
			setTimeout(() => {
				setFetching(false);
			}, 1000);
		}
	};
	useEffect(() => {
		fetchData();
	}, []);

	const [selectedPatient, setSelectedPatient] = useState(records[1]);

	const selectPatient = (patient) => {
		setSelectedPatient(patient);
	};

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
				{records.map((item) => (
					<Grid
						columns={12}
						key={item.id}
						onClick={() => selectPatient(item)}
						my="xs"
						bg={
							Number(selectedId) === item?.id
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
									<ActionIcon variant="filled" onClick={()=>handleAdmissionOverview(item.id)} color="var(--theme-primary-color-6)" radius="xs" aria-label="Settings">
										<IconArrowNarrowRight style={{ width: '70%', height: '70%' }} stroke={1.5} />
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
