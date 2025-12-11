import {Box, Text, Grid} from "@mantine/core";
import React, { forwardRef } from "react";
import "@/index.css";
import { t } from "i18next";
import {useOutletContext} from "react-router-dom";
const DefaultCustomReport = forwardRef(({reportData,report}) => {
	const getValue = (value, defaultValue = "") => {
		return value || defaultValue;
	};
	const { mainAreaHeight } = useOutletContext();
	console.log(mainAreaHeight)
	return (
		<Box>
			<Box mb="md" p={'xl'} mt={'100'} fz={'md'} h={650}>
				<div dangerouslySetInnerHTML={{__html:getValue(reportData?.findings)}}/>
				{report?.comment && (
					<Box p="md" pt={0}>
						<Text fw="bold" size="xs" mb="xs">
							{t("Comment")}
						</Text>
						<Box p="xs" bd="1px solid #ddd">
							<Text size="xs">{report?.comment || ""}</Text>
						</Box>
					</Box>
				)}
			</Box>
			{/* =============== Additional Information Section ================ */}
			<Box p="md" pt={0} pb={0}>
				<Grid columns={12} gutter="xs">
					<Grid.Col span={8}/>
					<Grid.Col span={4}>
						<Box>
							<Box h={40} ta="center">
								{/*{renderImagePreview([], patientInfo?.signature_path)}*/}
							</Box>
							<Text fw="bold" size="xs" mb="sm" ta="center">
								{report?.assign_doctor_name}
							</Text>
						</Box>
					</Grid.Col>
				</Grid>
			</Box>
			{/* =============== Doctor Information and Signature ================ */}
		</Box>
	);
});
DefaultCustomReport.displayName = "DefaultCustomReport";
export default DefaultCustomReport;
