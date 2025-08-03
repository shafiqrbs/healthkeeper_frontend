import { Box, Checkbox, Flex, Text, Tooltip } from "@mantine/core";
import { useTranslation } from "react-i18next";

export default function InputCheckboxForm({
	label,
	field,
	name,
	required = false,
	form,
	tooltip,
	mt,
	id,
	disabled = false,
	color = "var(--theme-primary-color-6)",
}) {
	const { t } = useTranslation();

	return (
		<>
			{form && (
				<Box mt={mt} w="100%">
					<Flex
						align="center"
						justify="space-between"
						style={{ cursor: "pointer" }}
						onClick={() => form.setFieldValue(field, form.values[field] === 1 ? 0 : 1)}
					>
						<Text fz="sm" pt="xs">
							{t(label)}
						</Text>
						<Tooltip
							label={tooltip}
							opened={name in form.errors && !!form.errors[name]}
							px={16}
							py={2}
							position="top-end"
							bg="var(--theme-validation-error-color)"
							c="white"
							withArrow
							offset={2}
							zIndex={999}
							transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
						>
							<Checkbox
								id={id}
								pr="xs"
								name={name}
								required={required}
								disabled={disabled}
								checked={form.values[field] === 1}
								color={color}
								onChange={(event) => form.setFieldValue(field, event.currentTarget.checked ? 1 : 0)}
								styles={() => ({
									input: {
										borderColor: "var(--theme-primary-color-6)",
									},
								})}
							/>
						</Tooltip>
					</Flex>
				</Box>
			)}
		</>
	);
}
