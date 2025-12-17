import { Box, Text, Grid } from "@mantine/core";
import React, { forwardRef } from "react";
import "@/index.css";
import { t } from "i18next";
import { useOutletContext } from "react-router-dom";
const XrayReport = forwardRef(({ reportData, report }) => {
	const getValue = (value, defaultValue = "") => {
		return value || defaultValue;
	};
	const { mainAreaHeight } = useOutletContext();
	return (
		<Box>
			<Box mb="md" p={"xl"} fz={"md"} h={600}>
				<Grid>
					<Grid.Col span={3} fw={700}>
						Trachea
					</Grid.Col>
					<Grid.Col span={9}>
						<div dangerouslySetInnerHTML={{ __html: getValue(reportData?.trachea) }} />
					</Grid.Col>
				</Grid>
				<Grid>
					<Grid.Col span={3} fw={700}>
						Diaphragm
					</Grid.Col>
					<Grid.Col span={9}>
						<div dangerouslySetInnerHTML={{ __html: getValue(reportData?.diaphragm) }} />
					</Grid.Col>
				</Grid>
				<Grid>
					<Grid.Col span={3} fw={700}>
						Lungs
					</Grid.Col>
					<Grid.Col span={9}>
						<div dangerouslySetInnerHTML={{ __html: getValue(reportData?.lungs) }} />
					</Grid.Col>
				</Grid>
				<Grid>
					<Grid.Col span={3} fw={700}>
						Heart
					</Grid.Col>
					<Grid.Col span={9}>
						<div dangerouslySetInnerHTML={{ __html: getValue(reportData?.heart) }} />
					</Grid.Col>
				</Grid>
				<Grid>
					<Grid.Col span={3} fw={700}>
						Bony Thorax
					</Grid.Col>
					<Grid.Col span={9}>
						<div dangerouslySetInnerHTML={{ __html: getValue(reportData?.bony_thorax) }} />
					</Grid.Col>
				</Grid>
				<Grid>
					<Grid.Col span={3} fw={700}>
						Impression
					</Grid.Col>
					<Grid.Col span={9}>
						<div dangerouslySetInnerHTML={{ __html: getValue(reportData?.impression) }} />
					</Grid.Col>
				</Grid>
			</Box>
			{/* =============== Doctor Information and Signature ================ */}
		</Box>
	);
});
XrayReport.displayName = "XrayReport";
export default XrayReport;
