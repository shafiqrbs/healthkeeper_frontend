import React from "react";
import { Tooltip, Textarea } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconInfoCircle, IconX } from "@tabler/icons-react";
import { getHotkeyHandler } from "@mantine/hooks";
import inputCss from "../../assets/css/InputField.module.css";

function TextAreaGenericForm(props) {
	const {
		label,
		placeholder,
		required,
		nextField,
		name,
		form,
		tooltip,
		mt,
		id,
		minRows,
		autosize,
		maxRows,
		style,
		size,
	} = props;
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
					zIndex={0}
					transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
				>
					<Textarea
						maxRows={maxRows}
						classNames={inputCss}
						minRows={minRows}
						id={id}
						label={label}
						placeholder={placeholder}
						mt={mt}
						{...form.getInputProps(name && name)}
						autoComplete="off"
						onKeyDown={getHotkeyHandler([
							[
								"Enter",
								(e) => {
									document.getElementById(nextField).focus();
								},
							],
						])}
						rightSection={
							form.values[name] ? (
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
									transitionProps={{
										transition: "pop-bottom-left",
										duration: 500,
									}}
								>
									<IconInfoCircle size={16} opacity={0.5} />
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

export default TextAreaGenericForm;
