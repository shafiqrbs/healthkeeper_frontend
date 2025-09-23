import { getDataWithoutStore } from "@/services/apiService";
import { Box, Text, ScrollArea, Stack, Button, Flex } from "@mantine/core";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { IconHelpOctagon } from "@tabler/icons-react";

export default function Test() {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const [test, setTest] = useState([]);
	const { id } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		fetchTest();
	}, [id]);

	const fetchTest = async () => {
		const res = await getDataWithoutStore({
			url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.LAB_TEST.INDEX}/${id}`,
		});

		setTest(res?.data);
	};

	const handleTest = (reportId) => {
		navigate(`${HOSPITAL_DATA_ROUTES.NAVIGATION_LINKS.LAB_TEST.VIEW}/${id}/report/${reportId}`);
	};

	return (
		<Box className="borderRadiusAll" bg="white">
			<Box bg="var(--theme-primary-color-0)" p="sm">
				<Text fw={600} fz="sm" py="es">
					{t("Test")}
				</Text>
			</Box>
			<ScrollArea scrollbars="y" type="never" h={mainAreaHeight - 60}>
				{id ? (
					<Stack className="form-stack-vertical" p="xs">
						{test?.invoice_particular?.map((item, index) => (
							<Box key={index} className="borderRadiusAll" bg={"white"} p="sm">
								<Text fz="sm">{item.item_name}</Text>
								<Flex align="center" gap="sm">
									<Button
										onClick={() => handleTest(item.invoice_particular_id)}
										size="xs"
										bg="var(--theme-primary-color-6)"
										color="white"
									>
										{t("Confirm")}
									</Button>
									<IconHelpOctagon stroke={1.2} />
								</Flex>
							</Box>
						))}
					</Stack>
				) : (
					<Box>No patient selected</Box>
				)}
			</ScrollArea>
		</Box>
	);
}
