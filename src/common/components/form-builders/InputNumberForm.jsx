import React from "react";
import { Tooltip, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconInfoCircle, IconX } from "@tabler/icons-react";
import { getHotkeyHandler } from "@mantine/hooks";
import inputCss from "@assets/css/InputField.module.css";

function InputNumberForm({
	label,
	placeholder,
	required,
	nextField,
	name,
	form,
	tooltip,
	mt,
	id,
	disabled,
	closeIcon,
	leftSection,
	rightSection,
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
					bg="var(--theme-error-color)"
					c="white"
					withArrow
					offset={2}
					zIndex={999}
					transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
				>
					<TextInput
						type="number"
						classNames={inputCss}
						id={id}
						size="sm"
						label={label}
						placeholder={placeholder}
						mt={mt}
						disabled={disabled}
						autoComplete="off"
						{...form.getInputProps(name)}
						onKeyDown={getHotkeyHandler([
							[
								"Enter",
								(e) => {
									nextField === "EntityFormSubmit"
										? document.getElementById(nextField).click()
										: document.getElementById(nextField).focus();
								},
							],
						])}
						leftSection={leftSection}
						rightSection={
							form.values[name] && closeIcon ? (
								<Tooltip
									label={t("Close")}
									withArrow
									bg="var(--theme-error-color)"
									c="white"
								>
									<IconX
										color="var(--theme-error-color)"
										size={16}
										opacity={0.5}
										onClick={() => {
											form.setFieldValue(name, "");
										}}
									/>
								</Tooltip>
							) : (
								<Tooltip
									label={tooltip}
									px={16}
									py={2}
									withArrow
									position={"left"}
									c="white"
									bg="var(--theme-info-color)"
									radius="sm"
									transitionProps={{
										transition: "pop-bottom-left",
										duration: 500,
									}}
								>
									{rightSection ? (
										rightSection
									) : (
										<IconInfoCircle size={16} opacity={0.5} />
									)}
								</Tooltip>
							)
						}
						withAsterisk={required}
					/>
				</Tooltip>
			)}
		</>
	);
}

export default InputNumberForm;
