import {Box, Text, Grid} from "@mantine/core";
import React, { forwardRef } from "react";
import "@/index.css";
import { t } from "i18next";
import {useOutletContext} from "react-router-dom";
const XrayReport = forwardRef(({reportData,report}) => {
	const getValue = (value, defaultValue = "") => {
		return value || defaultValue;
	};
	const { mainAreaHeight } = useOutletContext();
	console.log(mainAreaHeight)
	return (
		<Box>
			<Box mb="md" p={'xl'}  fz={'md'} h={600}>
				<Grid>
					<Grid.Col span={3} fw={700}>Trachea</Grid.Col>
					<Grid.Col span={9}><div dangerouslySetInnerHTML={{__html:getValue(reportData?.trachea)}}/></Grid.Col>
				</Grid>
				<Grid>
					<Grid.Col span={3} fw={700}>Diaphragm</Grid.Col>
					<Grid.Col span={9}><div dangerouslySetInnerHTML={{__html:getValue(reportData?.diaphragm)}}/></Grid.Col>
				</Grid>
				<Grid>
					<Grid.Col span={3} fw={700}>Lungs</Grid.Col>
					<Grid.Col span={9}><div dangerouslySetInnerHTML={{__html:getValue(reportData?.lungs)}}/></Grid.Col>
				</Grid>
				<Grid>
					<Grid.Col span={3} fw={700}>Heart</Grid.Col>
					<Grid.Col span={9}><div dangerouslySetInnerHTML={{__html:getValue(reportData?.heart)}}/></Grid.Col>
				</Grid>
				<Grid>
					<Grid.Col span={3} fw={700}>Bony Thorax</Grid.Col>
					<Grid.Col span={9}><div dangerouslySetInnerHTML={{__html:getValue(reportData?.bony_thorax)}}/></Grid.Col>
				</Grid>
				<Grid>
					<Grid.Col span={3} fw={700}>Impression</Grid.Col>
					<Grid.Col span={9}><div dangerouslySetInnerHTML={{__html:getValue(reportData?.impression)}}/></Grid.Col>
				</Grid>
			</Box>
			{/* =============== Additional Information Section ================ */}
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
XrayReport.displayName = "XrayReport";
export default XrayReport;
