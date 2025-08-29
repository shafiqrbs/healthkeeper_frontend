import { Tooltip, InputBase } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconInfoCircle, IconX } from "@tabler/icons-react";
import { getHotkeyHandler } from "@mantine/hooks";
import inputCss from "@assets/css/InputField.module.css";
import { IMaskInput } from "react-imask";

function InputMaskForm({
	readOnly = false,
	label = "",
	placeholder = "",
	required = false,
	nextField = "",
	name = "",
	form = {},
	tooltip = "",
	mt,
	id,
	disabled,
	type,
	leftSection,
	rightSection,
	maskInput,
	styles = {},
	onChange,
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
					zIndex={999}
					transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
				>
					<InputBase
						type={type}
						id={id}
						styles={styles}
						classNames={inputCss}
						size="sm"
						label={label}
						placeholder={placeholder}
						component={IMaskInput}
						mask={maskInput}
						onChange={onChange}
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
					/>
				</Tooltip>
			)}
		</>
	);
}

export default InputMaskForm;
