import {Box, Text, Grid} from "@mantine/core";
import React, { forwardRef } from "react";
import "@/index.css";
import { t } from "i18next";
const DefaultCustomReport = forwardRef(({reportData,report}) => {
	const getValue = (value, defaultValue = "") => {
		return value || defaultValue;
	};
	console.log(report);
	return (
		<Box>
			<Box mb="md">
				<Box p="md" style={{ borderRadius: "6px" }}>
					<div dangerouslySetInnerHTML={{__html:getValue(reportData?.findings)}}/>
				</Box>
			</Box>
			{/* =============== Additional Information Section ================ */}
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
			<Box p="md" pt={0} pb={0}>
				<Grid columns={12} gutter="xs">
					<Grid.Col span={4}>
						<Box>
							<Box h={40} ta="center">
								{/*{renderImagePreview([], patientInfo?.signature_path)}*/}
							</Box>
							<Text fw="bold" size="xs" mb="sm" ta="center">
								{report?.assign_labuser_name}
							</Text>
							<Text fw="bold" ta="center">
								Medical Technologist(Lab)
							</Text>
						</Box>
					</Grid.Col>
					<Grid.Col span={4}></Grid.Col>
					<Grid.Col span={4}>
						<Box>
							<Box h={40} ta="center">
								{/*{renderImagePreview([], patientInfo?.signature_path)}*/}
							</Box>
							<Text fw="bold" size="xs" mb="sm" ta="center">
								{report?.assign_doctor_name}
							</Text>
							<Text fw="bold" mb="sm" ta="center">
								Clinical Pathologist
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
