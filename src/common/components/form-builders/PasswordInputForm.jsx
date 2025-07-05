import React from "react";
import { PasswordInput, Tooltip } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { getHotkeyHandler } from "@mantine/hooks";
import inputCss from "../../assets/css/InputField.module.css";

function PasswordInputForm(props) {
	const { label, placeholder, required, nextField, name, form, tooltip, mt, id, value } = props;
	const { t, i18n } = useTranslation();
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
					<PasswordInput
						classNames={inputCss}
						id={id}
						size="sm"
						label={label}
						placeholder={placeholder}
						mt={mt}
						{...form.getInputProps(name && name)}
						onKeyDown={getHotkeyHandler([
							[
								"Enter",
								(e) => {
									document.getElementById(nextField).focus();
								},
							],
						])}
						autoComplete={"off"}
						withAsterisk={required}
						inputWrapperOrder={["label", "input", "description"]}
					/>
				</Tooltip>
			)}
		</>
	);
}

export default PasswordInputForm;
