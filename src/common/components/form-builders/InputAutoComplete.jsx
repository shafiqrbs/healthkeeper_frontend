import React from "react";
import { Tooltip, Autocomplete } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconInfoCircle, IconX } from "@tabler/icons-react";
import { getHotkeyHandler } from "@mantine/hooks";
import inputCss from "@assets/css/InputField.module.css";

function InputAutoComplete({
	readOnly = false,
	label = "",
	placeholder = "",
	required = false,
	nextField = "",
	name = "",
	form = {},
	tooltip = "",
	mt,
	data,
	id,
	disabled,
	leftSection,
	rightSection,
	styles = {},
}) {
	const { t } = useTranslation();

	return (
		<>
			{form && (
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
					zIndex={99}
					transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
				>
					<Autocomplete
						id={id}
						styles={styles}
						classNames={inputCss}
						size="sm"
						label={label}
						placeholder={placeholder}
						mt={mt}
						readOnly={readOnly}
						disabled={disabled}
						data={data}
						{...form.getInputProps(name)}
						onKeyDown={getHotkeyHandler([
							[
								"Enter",
								() => {
									nextField && nextField === "EntityFormSubmit"
										? document.getElementById(nextField).click()
										: document.getElementById(nextField).focus();
								},
							],
						])}
						leftSection={leftSection}
						rightSection={
							form.values[name] ? (
								<Tooltip label={t("Close")} withArrow bg="var(--theme-error-color)" c="white">
									<IconX
										color="var(--theme-error-color)"
										size={16}
										opacity={0.5}
										onClick={() => form.setFieldValue(name, "")}
									/>
								</Tooltip>
							) : (
								<Tooltip
									label={tooltip}
									px={16}
									py={2}
									withArrow
									position="left"
									c="white"
									bg="var(--theme-info-color)"
									transitionProps={{
										transition: "pop-bottom-left",
										duration: 500,
									}}
								>
									{rightSection ? rightSection : <IconInfoCircle size={16} opacity={0.5} />}
								</Tooltip>
							)
						}
						withAsterisk={required}
						inputWrapperOrder={["label", "input", "description"]}
					/>
				</Tooltip>
			)}
		</>
	);
}

export default InputAutoComplete;
