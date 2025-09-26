import { getDataWithoutStore } from "@/services/apiService";
import { Box, Text, ScrollArea, Stack, Button, Flex } from "@mantine/core";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { IconHelpOctagon } from "@tabler/icons-react";
import {getLoggedInHospitalUser, getUserRole} from "@utils/index";


const ALLOWED_LAB_ROLES = [ "doctor_lab","lab_assistant", "admin_administrator"];
const ALLOWED_LAB_DOCTOR_ROLES = [ "doctor_lab", "admin_administrator"];
export default function Test({entity}) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const test = entity;
	const { id } = useParams();
	const navigate = useNavigate();
	const userHospitalConfig = getLoggedInHospitalUser();
	const userRoles = getUserRole();
	const userId = userHospitalConfig?.employee_id;
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

				{id ? (
					<ScrollArea scrollbars="y" type="never" h={mainAreaHeight - 154}>
					<Stack className="form-stack-vertical" p="xs">
						{test?.invoice_particular?.map((item, index) => (
							<Box key={index} className="borderRadiusAll" bg={"white"} p="sm">
								<Text fz="sm">{item.item_name}</Text>
								<Text fz="xs">Status:{item?.process}</Text>
								<Flex align="center" gap="sm">
									{userRoles.some((role) => ALLOWED_LAB_ROLES.includes(role)) && (
										<>
									{item?.process === "New" && userRoles.some((role) => ALLOWED_LAB_ROLES.includes(role)) && (
									<Button
										onClick={() => handleTest(item.invoice_particular_id)}
										size="xs"
										bg="var(--theme-primary-color-6)"
										color="white"
									>
										{t("Process")}
									</Button>
									)}
									{item?.process === "In-progress" && userRoles.some((role) => ALLOWED_LAB_DOCTOR_ROLES.includes(role)) && (
										<Button
										onClick={() => handleTest(item.invoice_particular_id)}
										size="xs"
										bg="var(--theme-primary-color-6)"
										color="white"
									>
										{t("Confirm")}
										</Button>
									)}
											{item?.process === "Done" &&(
												<>
												<Button
													onClick={() => handleTest(item.invoice_particular_id)}
													size="xs"
													bg="var(--theme-primary-color-6)"
													color="white"
												>
													{t("Show")}
												</Button>
												<Button
													onClick={() => handleTest(item.invoice_particular_id)}
													size="xs"
													bg="var(--theme-secondary-color-6)"
													color="white"
												>
													{t("Print")}
												</Button>
												</>
											)}
									<IconHelpOctagon stroke={1.2} />
									</>
									)}
								</Flex>
							</Box>
						))}
					</Stack>
					</ScrollArea>
				) : (
					<Stack
						h={mainAreaHeight - 154}
						bg="var(--mantine-color-body)"
						align="center"
						justify="center"
						gap="md"
					>
					<Box>{t('NoPatientSelected')}</Box>
					</Stack>
				)}

		</Box>
	);
}
