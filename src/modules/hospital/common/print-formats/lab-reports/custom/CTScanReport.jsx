import {Box, Text, Grid, Stack} from "@mantine/core";
import React, { forwardRef } from "react";
import "@/index.css";
import { t } from "i18next";
import {useOutletContext} from "react-router-dom";
import InputForm from "@components/form-builders/InputForm";
const CTScanReport = forwardRef(({reportData,report}) => {
	const getValue = (value, defaultValue = "") => {
		return value || defaultValue;
	};
	const { mainAreaHeight } = useOutletContext();
	return (
		<Box>
			<Box mb="md" p={'xl'} pt={'xs'}  fz={'md'} h={600}>
				<Grid>
					<Grid.Col span={4} fw={'600'}>Technique</Grid.Col>
					<Grid.Col span={9}><div dangerouslySetInnerHTML={{__html:getValue(reportData?.technique)}}/></Grid.Col>
				</Grid>
				<Grid>
					<Grid.Col span={12} fw={'600'}>Findings</Grid.Col>
				</Grid>
				<Grid>
					<Grid.Col span={4}>Parenchyma</Grid.Col>
					<Grid.Col span={9}><div dangerouslySetInnerHTML={{__html:getValue(reportData?.parenchyma)}}/></Grid.Col>
				</Grid>
				<Grid>
					<Grid.Col span={12} fw={'600'}>Mediastinum</Grid.Col>
				</Grid>
				<Grid>
					<Grid.Col span={1}/>
					<Grid.Col span={3} >a. Vessels</Grid.Col>
					<Grid.Col span={9}><div dangerouslySetInnerHTML={{__html:getValue(reportData?.mediastinum_vessels)}}/></Grid.Col>
				</Grid>
				<Grid>
					<Grid.Col span={1}/>
					<Grid.Col span={3} >b. Trachea-</Grid.Col>
					<Grid.Col span={9}><div dangerouslySetInnerHTML={{__html:getValue(reportData?.mediastinum_trachea)}}/></Grid.Col>
				</Grid>
				<Grid>
					<Grid.Col span={1}/>
					<Grid.Col span={3} >c. Oesophagus-</Grid.Col>
					<Grid.Col span={9}><div dangerouslySetInnerHTML={{__html:getValue(reportData?.mediastinum_oesophagus)}}/></Grid.Col>
				</Grid>
				<Grid>
					<Grid.Col span={1}/>
					<Grid.Col span={3} >d. Thymus-</Grid.Col>
					<Grid.Col span={9}><div dangerouslySetInnerHTML={{__html:getValue(reportData?.mediastinum_thymus)}}/></Grid.Col>
				</Grid>
				<Grid>
					<Grid.Col span={1}/>
					<Grid.Col span={3} >d. Lymph Nodes-</Grid.Col>
					<Grid.Col span={9}><div dangerouslySetInnerHTML={{__html:getValue(reportData?.mediastinum_lymph_nodes)}}/></Grid.Col>
				</Grid>
				<Grid>
					<Grid.Col span={4}>Heart</Grid.Col>
					<Grid.Col span={9}><div dangerouslySetInnerHTML={{__html:getValue(reportData?.heart)}}/></Grid.Col>
				</Grid>

				<Grid>
					<Grid.Col span={4}>Pleura</Grid.Col>
					<Grid.Col span={9}><div dangerouslySetInnerHTML={{__html:getValue(reportData?.pleura)}}/></Grid.Col>
				</Grid>
				<Grid>
					<Grid.Col span={3}>Bones</Grid.Col>
					<Grid.Col span={9}><div dangerouslySetInnerHTML={{__html:getValue(reportData?.bones)}}/></Grid.Col>
				</Grid>
				<Grid>
					<Grid.Col span={4}>After I/V Contrast</Grid.Col>
					<Grid.Col span={9}><div dangerouslySetInnerHTML={{__html:getValue(reportData?.after_iv_contrast)}}/></Grid.Col>
				</Grid>
				<Grid>
					<Grid.Col span={4}  fw={'600'}>Impression</Grid.Col>
					<Grid.Col span={9} fw={'600'}><div dangerouslySetInnerHTML={{__html:getValue(reportData?.impression)}}/></Grid.Col>
				</Grid>
			</Box>
			{/* =============== Doctor Information and Signature ================ */}
		</Box>
	);
});
CTScanReport.displayName = "CTScanReport";
export default CTScanReport;
