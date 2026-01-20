import { Box, Grid } from "@mantine/core";
import { forwardRef } from "react";
import "@/index.css";

const XrayReport = forwardRef(({ reportData, report }, ref) => {
	const getValue = (value, defaultValue = "") => {
		return value || defaultValue;
	};

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
				<Grid>
					<Grid.Col span={3} />
					<Grid.Col span={9}>
						<div dangerouslySetInnerHTML={{ __html: getValue(reportData?.impression_two) }} />
					</Grid.Col>
				</Grid>
			</Box>
			{/* =============== Doctor Information and Signature ================ */}
		</Box>
	);
});
XrayReport.displayName = "XrayReport";
export default XrayReport;
