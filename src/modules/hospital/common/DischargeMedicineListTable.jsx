import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Center, Flex, Switch, TableTd, ActionIcon, TextInput, Text, Autocomplete, Loader } from "@mantine/core";
import { IconCheck, IconGripVertical, IconX, IconTrash } from "@tabler/icons-react";
import { DataTable, DataTableDraggableRow } from "mantine-datatable";
import clsx from "clsx";
import { useState, useMemo, useEffect, useCallback, useRef, memo } from "react";
import debounce from "lodash.debounce";

import classes from "./MedicineListTable.module.css";
import tableCss from "@assets/css/Table.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { HOSPITAL_DATA_ROUTES } from "@/constants/routes";
import { storeEntityData } from "@/app/store/core/crudThunk";
import { errorNotification } from "@components/notification/errorNotification";
import inlineInputCss from "@assets/css/InlineInputField.module.css";
import DateSelector from "@components/form-builders/DateSelector";
import useAutocompleteSuggestions from "@hooks/useAutocompleteSuggestions";

const MemoSwitch = memo(function MemoSwitch({ checked, onChange }) {
	return (
		<Switch
			size="md"
			onLabel="ON"
			color="teal"
			offLabel="OFF"
			radius="sm"
			checked={checked}
			onChange={(e) => onChange(e.currentTarget.checked)}
			thumbIcon={
				checked ? (
					<IconCheck size={12} color="var(--mantine-color-teal-6)" stroke={3} />
				) : (
					<IconX size={12} color="var(--mantine-color-red-6)" stroke={3} />
				)
			}
		/>
	);
});

const MemoTextInput = memo(function MemoTextInput({ value, placeholder, className, onBlur }) {
	const [ localValue, setLocalValue ] = useState(value || "");

	// =============== sync local state when prop value changes externally ================
	useEffect(() => {
		setLocalValue(value || "");
	}, [ value ]);

	const handleChange = (event) => {
		setLocalValue(event.currentTarget.value);
	};

	const handleBlur = () => {
		onBlur(localValue);
	};

	return (
		<TextInput
			size="xs"
			className={className}
			placeholder={placeholder}
			value={localValue}
			onChange={handleChange}
			onBlur={handleBlur}
			styles={{
				input: {
					borderRadius: "8px",
				},
			}}
		/>
	);
});

const MemoAutocomplete = memo(function MemoAutocomplete({ value, placeholder, className, onBlur, fieldName, data }) {
	const [ localValue, setLocalValue ] = useState(value || "");

	const shouldUseApi = !!fieldName;
	const { searchResults, isSearching, handleSearchChange } = useAutocompleteSuggestions({
		baseUrl: HOSPITAL_DATA_ROUTES.API_ROUTES.DISCHARGE.DOSAGE_MEALS_SUGGESTIONS,
		fieldName,
		debounceDelay: 300,
	});

	useEffect(() => {
		setLocalValue(value || "");
	}, [ value ]);

	// =============== extract display text from different response formats ================
	const getDisplayText = (item) => {
		if (typeof item === "string") {
			return item;
		}
		return item?.by_meal_bn || item?.dose_details_bn || item?.instruction || JSON.stringify(item);
	};

	const autocompleteData = shouldUseApi
		? searchResults.map((item) => getDisplayText(item))
		: data || [];

	const handleChange = (newValue) => {
		setLocalValue(newValue);
		if (shouldUseApi && newValue && newValue.trim()) {
			handleSearchChange(newValue);
		}
	};

	const handleBlur = () => {
		onBlur(localValue);
	};

	return (
		<Autocomplete
			size="xs"
			className={className}
			placeholder={placeholder}
			value={localValue}
			data={autocompleteData}
			onChange={handleChange}
			onBlur={handleBlur}
			rightSection={shouldUseApi && isSearching ? <Loader size="xs" /> : null}
			styles={{
				input: {
					borderRadius: "8px",
				},
			}}
		/>
	);
});

const parseSafeDate = (dateValue) => {
	if (!dateValue) return null;

	const parsedDate = new Date(dateValue);

	if (isNaN(parsedDate.getTime())) {
		return null;
	}

	return parsedDate;
};

function DischargeMedicineListTable({
	medicines,
	tableHeight = 0,
	showDelete = false,
	showSwitch = true,
	onDelete,
	prescriptionId: propPrescriptionId,
	setMedicines,
	forDischarge = false,
}) {
	const { id: paramsPrescriptionId } = useParams();
	const prescriptionId = propPrescriptionId || paramsPrescriptionId;
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const recordsWithIds = useMemo(
		() =>
			medicines.map((m) => ({
				...m,
				id: m.id?.toString(),
			})),
		[ medicines ]
	);

	const [ records, setRecords ] = useState(recordsWithIds);

	// =============== only resync when list length changes ================
	useEffect(() => {
		setRecords((prev) => (prev.length !== recordsWithIds.length ? recordsWithIds : prev));
	}, [ recordsWithIds ]);

	const debouncedUpdate = useRef(
		debounce(async (payload) => {
			try {
				await dispatch(storeEntityData(payload));
			} catch {
				errorNotification(t("Failed to update medicine"), "red", "lightgray", true, 700, true);
			}
		}, 300)
	).current;

	const handleInlineEdit = useCallback(
		(id, field, value) => {
			setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, [ field ]: value } : r)));

			debouncedUpdate({
				url: `${HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.INLINE_UPDATE}/${id}`,
				data: {
					medicine_id: id,
					[ field ]: value,
					prescription_id: prescriptionId,
				},
				module: "prescription",
			});
		},
		[ debouncedUpdate, prescriptionId ]
	);

	const handleDragEnd = async (result) => {
		if (!result.destination) return;

		const oldItems = [ ...records ];
		const items = [ ...records ];

		const [ moved ] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, moved);

		setRecords(items);

		if (setMedicines) {
			setMedicines(
				items.map((item, index) => ({
					...item,
					order: index + 1,
				}))
			);
		}

		const resultAction = await dispatch(
			storeEntityData({
				url: HOSPITAL_DATA_ROUTES.API_ROUTES.IPD.MEDICINE_REORDER,
				data: {
					order: items.map((item, index) => ({
						id: item.id,
						ordering: index + 1,
					})),
				},
				module: "prescription",
			})
		);

		if (storeEntityData.rejected.match(resultAction)) {
			setRecords(oldItems);
			if (setMedicines) setMedicines(oldItems);
			errorNotification("Failed to update medicine order", "red", "lightgray", true, 700, true);
		}
	};

	const columns = useMemo(() => {
		const cols = [
			{ accessor: "", hiddenContent: true, width: 40 },
			{
				accessor: "medicine_name",
				title: "Medicine Name",
				render: (item) => <Text fz="xs">{item?.medicine_name}</Text>,
			},

			// {
			// 	accessor: "medicine_dosage",
			// 	title: "Dosage",
			// 	width: "20%",
			// 	render: (record) => (
			// 		<MemoAutocomplete
			// 			value={record.dose_details}
			// 			className={inlineInputCss.inputText}
			// 			placeholder={t("Medicine Dosage")}
			// 			fieldName="dose_details_bn"
			// 			onBlur={(value) => handleInlineEdit(record.id, "dose_details", value)}
			// 		/>
			// 	),
			// },
			// {
			// 	accessor: "by_meal",
			// 	title: "By meal",
			// 	width: "10%",
			// 	render: (record) => (
			// 		<MemoAutocomplete
			// 			value={record.by_meal}
			// 			className={inlineInputCss.inputText}
			// 			placeholder={t("By meal")}
			// 			fieldName="by_meal_bn"
			// 			onBlur={(value) => handleInlineEdit(record.id, "by_meal", value)}
			// 		/>
			// 	),
			// },
			{
				accessor: "instruction",
				title: "Dosages & Instruction",
				width: "55%",
				render: (record) => (
					<MemoAutocomplete
						fieldName="instruction"
						value={record.instruction}
						className={inlineInputCss.inputText}
						placeholder={t("Dosages & Instruction")}
						onBlur={(value) => handleInlineEdit(record.id, "instruction", value)}
					/>
				),
			},
		];


		cols.push({
			accessor: "action",
			title: "Action",
			width: 60,
			textAlign: "center",
			render: (record) => (
				<Flex justify="center" align="center" gap="sm">
					{showDelete && onDelete && (
						<ActionIcon
							variant="outline"
							color="var(--theme-error-color)"
							onClick={() => onDelete(record.id)}
						>
							<IconTrash size={16} />
						</ActionIcon>
					)}
				</Flex>
			),
		});

		return cols;
	}, [ handleInlineEdit, showDelete, onDelete, showSwitch, t, forDischarge ]);

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<DataTable
				records={records}
				columns={columns}
				height={tableHeight}
				striped
				withTableBorder
				withColumnBorders
				stripedColor="var(--theme-tertiary-color-1)"
				classNames={{
					root: tableCss.root,
					table: tableCss.table,
					header: tableCss.header,
					footer: tableCss.footer,
					pagination: tableCss.pagination,
				}}
				tableWrapper={({ children }) => (
					<Droppable droppableId="medicine-datatable">
						{(provided) => (
							<div ref={provided.innerRef} {...provided.droppableProps}>
								{children}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				)}
				rowFactory={({ record, index, rowProps, children }) => (
					<Draggable draggableId={record.id} index={index} key={record.id}>
						{(provided, snapshot) => (
							<DataTableDraggableRow
								{...rowProps}
								isDragging={snapshot.isDragging}
								className={clsx(rowProps.className, classes.draggableRow)}
								{...provided.draggableProps}
							>
								<TableTd>
									<Center ref={provided.innerRef} {...provided.dragHandleProps}>
										<IconGripVertical size={16} />
									</Center>
								</TableTd>
								{children}
							</DataTableDraggableRow>
						)}
					</Draggable>
				)}
			/>
		</DragDropContext>
	);
}

export default memo(DischargeMedicineListTable);
