import React from "react";
import { Tooltip, TextInput, Box, Grid, Checkbox } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconInfoCircle, IconX } from "@tabler/icons-react";
import { getHotkeyHandler } from "@mantine/hooks";
import inputCss from "@assets/css/InputField.module.css";

function InputCheckboxForm({
	label,
	field,
	name,
	required,
	nextField,
	form,
	tooltip,
	mt,
	id,
	disabled,
	closeIcon,
	color = "var(--theme-error-color)",
}) {
	const { t } = useTranslation();

	return (
		<>
			{form && (
				<Box mt={"xs"}>
					<Grid
						gutter={{ base: 1 }}
						style={{ cursor: "pointer" }}
						onClick={() => form.setFieldValue(field, form.values[field] === 1 ? 0 : 1)}
					>
						<Grid.Col span={11} fz={"sm"} pt={"1"}>
							{t(label)}
						</Grid.Col>
						<Grid.Col span={1}>
							<Checkbox
								pr="xs"
								checked={form.values[field] === 1}
								// {...form.getInputProps(field, {
								// 	type: "checkbox",
								// })}
								color={color}
								onChange={(event) =>
									form.setFieldValue(field, event.currentTarget.checked ? 1 : 0)
								}
								styles={(theme) => ({
									input: {
										borderColor: "var(--theme-error-color)",
									},
								})}
							/>
						</Grid.Col>
					</Grid>
				</Box>
			)}
		</>
	);
}

export default InputCheckboxForm;
