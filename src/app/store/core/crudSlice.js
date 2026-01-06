import { createSlice } from "@reduxjs/toolkit";
import {
	deleteEntityData,
	editEntityData,
	getIndexEntityData,
	getStatusInlineUpdateData,
	showEntityData,
	storeEntityData,
	inlineUpdateEntityData,
	updateEntityData,
	updateEntityDataWithFile,
} from "./crudThunk";
import { formatDate } from "@/common/utils";

const initialState = {
	// --------------- core modules starts -------------------
	medicineGeneric: {
		isLoading: true,
		refetching: false,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { term: "" },
	},
	auth: {
		isLoading: true,
		refetching: false,
		error: null,
		data: {},
		editData: {},
		validation: false,
	},

	free_patient: {
		isLoading: true,
		refetching: false,
		error: null,
		data: {},
		editData: {},
		validation: false,
	},
	police_case: {
		isLoading: true,
		refetching: false,
		error: null,
		data: {},
		editData: {},
		validation: false,
	},
	generic: {
		isLoading: true,
		refetching: false,
		error: null,
		data: {},
		editData: {},
		validation: false,
	},
	dashboardDailySummary: {
		isLoading: true,
		refetching: false,
		error: null,
		data: {},
		editData: {},
		validation: false,
	},
	particular: {
		isLoading: true,
		refetching: true,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { created: formatDate(new Date()), keywordSearch: "" },
	},

	labTest: {
		isLoading: true,
		refetching: true,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { created: formatDate(new Date()), keywordSearch: "" },
	},

	particularList: {
		isLoading: true,
		refetching: true,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { created: formatDate(new Date()), keywordSearch: "" },
	},

	lab_user: {
		isLoading: true,
		refetching: true,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { created: formatDate(new Date()), keywordSearch: "" },
	},

	dosage: {
		isLoading: true,
		refetching: false,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { created: formatDate(new Date()), keywordSearch: "" },
	},

	byMeal: {
		isLoading: true,
		refetching: false,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { created: formatDate(new Date()), keywordSearch: "" },
	},

	medicine: {
		isLoading: true,
		refetching: true,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { created: "", keywordSearch: "" },
	},

	bed: {
		isLoading: true,
		refetching: false,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { created: formatDate(new Date()), keywordSearch: "" },
	},

	billing: {
		isLoading: true,
		refetching: false,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { created: formatDate(new Date()), keywordSearch: "" },
	},
	refund: {
		isLoading: true,
		refetching: false,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { created: formatDate(new Date()), keywordSearch: "" },
	},

	refund_history: {
		isLoading: true,
		refetching: false,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { created: "", keywordSearch: "" },
	},
	finalBilling: {
		isLoading: true,
		refetching: false,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { created: formatDate(new Date()), keywordSearch: "" },
	},

	advice: {
		isLoading: true,
		refetching: false,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { created: formatDate(new Date()), keywordSearch: "" },
	},

	exemergency: {
		isLoading: true,
		refetching: false,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { created: formatDate(new Date()), keywordSearch: "" },
	},

	doctor: {
		isLoading: true,
		refetching: false,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { created: formatDate(new Date()), keywordSearch: "" },
	},

	nurse: {
		isLoading: true,
		refetching: false,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { created: formatDate(new Date()), keywordSearch: "" },
	},

	staff: {
		isLoading: true,
		refetching: false,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { created: formatDate(new Date()), keywordSearch: "" },
	},

	opd_room: {
		isLoading: true,
		refetching: false,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { created: formatDate(new Date()), keywordSearch: "" },
	},

	treatment: {
		isLoading: true,
		refetching: false,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { created: formatDate(new Date()), keywordSearch: "" },
	},

	user_treatment: {
		isLoading: true,
		refetching: false,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { created: formatDate(new Date()), keywordSearch: "" },
	},

	particular_matrix: {
		isLoading: true,
		refetching: false,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { created: "", keywordSearch: "" },
	},

	cabin: {
		isLoading: true,
		refetching: false,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { created: "", keywordSearch: "" },
	},

	investigation: {
		isLoading: true,
		refetching: false,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { created: formatDate(new Date()), keywordSearch: "" },
	},

	particular_mode: {
		isLoading: true,
		refetching: true,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { created: formatDate(new Date()), keywordSearch: "" },
	},

	e_fresh: {
		isLoading: true,
		refetching: false,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { created: formatDate(new Date()), keywordSearch: "" },
		validationMessages: [],
	},

	particular_type: {
		isLoading: true,
		refetching: true,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { created: formatDate(new Date()), keywordSearch: "" },
	},

	stock: {
		isLoading: true,
		refetching: false,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { term: "" },
	},

	medicines: {
		isLoading: true,
		refetching: false,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { term: "" },
	},

	prescriptionItem: {
		isLoading: true,
		refetching: false,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { term: "" },
	},

	vendor: {
		insertType: "create",
		isLoading: true,
		refetching: false,
		error: null,
		data: {},
		editData: {},
		validation: false,
		searchKeyword: "",
		validationMessages: [],
		filterData: { name: "", mobile: "", company_name: "" },
	},
	user: {
		isLoading: true,
		refetching: false,
		insertType: "create",
		error: null,
		data: {},
		editData: {},
		validation: false,
		validationMessages: [],
		filterData: {
			name: "",
			mobile: "",
			email: "",
			keywordSearch: "",
			created: formatDate(new Date()),
		},
	},
	labUser: {
		isLoading: true,
		refetching: true,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { name: "", mobile: "", email: "" },
	},
	customer: {
		insertType: "create",
		isLoading: true,
		refetching: false,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { name: "", mobile: "" },
	},
	warehouse: {
		isLoading: true,
		refetching: true,
		error: null,
		data: {},
		editData: {},
		validation: false,
		filterData: { name: "", mobile: "", email: "", location: "" },
	},
	fileUpload: { filterData: { file_type: "", original_name: "", created: "" } },
	// -------------------- core modules stops ----------------------

	// ---------------- inventory modules starts ---------------------
	config: {
		isLoading: true,
		refetching: true,
		error: null,
		validation: false,
		data: {},
	},
	category: {
		isLoading: true,
		refetching: true,
		error: null,
		validation: false,
		data: {},
		filterData: { name: "" },
	},
	categoryGroup: {
		isLoading: true,
		refetching: true,
		error: null,
		validation: false,
		data: {},
		editData: {},
		filterData: { name: "" },
	},
	purchase: {
		isLoading: true,
		refetching: true,
		error: null,
		validation: false,
		data: {},
		editData: {},
		filterData: { vendor_id: "", start_date: "", end_date: "", searchKeyword: "" },
	},
	product: {
		isLoading: true,
		refetching: true,
		error: null,
		validation: false,
		data: {},
		editData: {},
		filterData: { name: "" },
	},
	// -------------------- inventory modules stops -------------------------
	// -------------------- procurement modules starts -------------------------

	dispense: {
		isLoading: true,
		refetching: true,
		error: null,
		validation: false,
		data: {},
		editData: {},
		filterData: { vendor_id: "", start_date: "", end_date: "", searchKeyword: "" },
	},
	requisition: {
		isLoading: true,
		refetching: true,
		error: null,
		validation: false,
		data: {},
		editData: {},
		filterData: { vendor_id: "", start_date: "", end_date: "", searchKeyword: "" },
	},
	workorder: {
		isLoading: true,
		refetching: true,
		error: null,
		validation: false,
		data: {},
		editData: {},
		filterData: { vendor_id: "", start_date: "", end_date: "", searchKeyword: "" },
	},
	// -------------------- procurement modules stops -------------------------
	// -------------------- production modules starts -------------------------
	batch: {
		isLoading: true,
		refetching: true,
		error: null,
		validation: false,
		data: {},
		editData: {},
		filterData: { name: "" },
	},
	settings: {
		isLoading: true,
		refetching: true,
		error: null,
		validation: false,
		data: {},
		editData: {},
		filterData: { name: "", code: "", description: "" },
	},
	setting: {
		isLoading: true,
		refetching: true,
		error: null,
		validation: false,
		data: {},
		editData: {},
		filterData: { name: "" },
	},
	store: {
		isLoading: true,
		refetching: true,
		error: null,
		validation: false,
		data: {},
		editData: {},
		filterData: { name: "" },
	},
	recipeItems: {
		isLoading: true,
		refetching: true,
		error: null,
		validation: false,
		data: {},
		editData: {},
		filterData: { name: "" },
	},
	// -------------------- domain modules starts -------------------------
	domain: {
		isLoading: true,
		refetching: false,
		error: null,
		validation: false,
		insertType: "create",
		data: {},
		editData: {},
		filterData: { name: "" },
		validationMessages: [],
	},
	// -------------------- domain modules stops -------------------------
	// -------------------- hospital modules starts -------------------------
	visit: {
		isLoading: true,
		refetching: true,
		error: null,
		validation: false,
		insertType: "create",
		data: {},
		editData: {},
		filterData: { created: "", keywordSearch: "" },
		validationMessages: [],
	},
	// -------------------- hospital modules stops -------------------------

	// -------------------- hospital modules starts -------------------------
	emergency: {
		isLoading: true,
		refetching: false,
		error: null,
		validation: false,
		insertType: "create",
		data: {},
		editData: {},
		filterData: { created: formatDate(new Date()), keywordSearch: "" },
		validationMessages: [],
	},
	// -------------------- hospital modules stops -------------------------

	// -------------------- prescription modules starts -------------------------
	prescription: {
		isLoading: true,
		refetching: true,
		error: null,
		validation: false,
		insertType: "create",
		data: {},
		editData: {},
		filterData: { name: "" },
		validationMessages: [],
	},
	// -------------------- prescription modules stops -------------------------
	// -------------------- admission modules starts -------------------------
	admission: {
		isLoading: true,
		refetching: false,
		error: null,
		validation: false,
		insertType: "create",
		data: {},
		editData: {},
		filterData: { created: formatDate(new Date()), keywordSearch: "" },
		validationMessages: [],
	},
	// -------------------- admission modules stops -------------------------
	// -------------------- admission modules starts -------------------------
	discharge: {
		isLoading: true,
		refetching: false,
		error: null,
		validation: false,
		insertType: "create",
		data: {},
		editData: {},
		filterData: { created: formatDate(new Date()), keywordSearch: "" },
		validationMessages: [],
	},
	// -------------------- admission modules stops -------------------------
	// -------------------- doctor report modules starts -------------------------
	doctorReport: {
		isLoading: true,
		refetching: true,
		error: null,
		validation: false,
		insertType: "create",
		data: {},
		editData: {},
		filterData: { name: "" },
		validationMessages: [],
	},
	// -------------------- doctor report modules stops -------------------------
	// -------------------- doctor revisit modules starts -------------------------
	doctorRevisit: {
		isLoading: true,
		refetching: true,
		error: null,
		validation: false,
		insertType: "create",
		data: {},
		editData: {},
		filterData: { name: "" },
		validationMessages: [],
	},
	// -------------------- doctor revisit modules stops -------------------------

	// -------------------- configuration module starts -------------------------

	hospitalConfig: {
		isLoading: true,
		refetching: false,
		error: null,
		validation: false,
		data: {},
		editData: {},
		filterData: { name: "" },
		validationMessages: [],
	},

	// -------------------- configuration module starts -------------------------

	hospitalSetting: {
		isLoading: true,
		refetching: false,
		error: null,
		validation: false,
		data: {},
		editData: {},
		filterData: { name: "" },
		validationMessages: [],
	},

	// location module starts
	locations: {
		isLoading: true,
		refetching: false,
		error: null,
		validation: false,
		data: [],
	},

	// Report medicine issue module starts
	medicineIssue: {
		isLoading: true,
		refetching: false,
		error: null,
		validation: false,
		data: [],
	},
	stockSummery: {
		isLoading: true,
		refetching: false,
		error: null,
		validation: false,
		data: [],
	},

	// -------------------- configuration module stops -------------------------
	searchKeyword: "", // keep it for compatibility issues, remove it in no time
	searchKeywordTooltip: false, // keep it for compatibility issues, remove it in no time
	globalFetching: false,
};

const crudSlice = createSlice({
	name: "crud",
	initialState,
	reducers: {
		setSearchKeyword: (state, action) => {
			state.searchKeyword = action.payload;
		},
		setFilterData: (state, action) => {
			const { module, data } = action.payload;

			if (state?.[module]?.filterData) {
				state[module].filterData = {
					...state[module].filterData,
					...data,
				};
			}
		},
		setInsertType: (state, action) => {
			const { module, insertType } = action.payload;
			state[module].insertType = insertType;
		},
		setKeyWordSearch: (state, action) => {
			state.searchKeyword = action.payload;
		},
		setSearchKeywordTooltip: (state, action) => {
			state.searchKeywordTooltip = action.payload;
		},
		setGlobalFetching: (state, action) => {
			state.globalFetching = action.payload;
		},
		setDeleteMessage: (state, action) => {
			state.entityDataDelete = action.payload;
		},
		setValidationData: (state, action) => {
			state.validation = action.payload;
		},
		setInventoryShowDataEmpty: (state) => {
			state.config.data = {};
		},
		setRefetchData: (state, action) => {
			const { module, refetching } = action.payload;
			state[module].refetching = refetching;
		},
		setItemData: (state, action) => {
			const { module, data } = action.payload;
			state[module].data = data;
		},
	},

	extraReducers: (builder) => {
		builder
			.addCase(getIndexEntityData.fulfilled, (state, action) => {
				const { module, data } = action.payload;

				state[module].data = data;
				state[module].refetching = false;
			})
			.addCase(getIndexEntityData.rejected, (state, action) => {
				const { module } = action.payload;
				state[module].error = action.payload; // Save error
			});

		builder.addCase(inlineUpdateEntityData.fulfilled, (state, action) => {
			const { module, data } = action.payload;
			if (action.payload.data.message === "success") {
				// state[module].refetching = true;
			} else {
				state[module].validationMessages = data.data;
				state[module].validation = true;
			}
		});

		builder.addCase(storeEntityData.fulfilled, (state, action) => {
			const { module, data } = action.payload;
			if (action.payload.data.message === "success") {
				state[module].refetching = true;
			} else {
				state[module].validationMessages = data.data;
				state[module].validation = true;
			}
		});

		builder.addCase(storeEntityData.rejected, (state, action) => {
			const { module, errors } = action.payload;
			state[module].validationMessages = errors;
			state[module].validation = true;
		});

		builder.addCase(editEntityData.fulfilled, (state, action) => {
			const { module } = action.payload;
			state[module].editData = action.payload.data.data;
			state[module].refetching = true;
		});

		builder.addCase(updateEntityData.fulfilled, (state, action) => {
			const { module } = action.payload;
			state[module].refetching = true;
			state[module].editData = {};
		});

		builder.addCase(updateEntityData.rejected, (state, action) => {
			const { module, data } = action.payload;
			state[module].validationMessages = data.data;
			state[module].validation = true;
		});

		builder.addCase(updateEntityDataWithFile.fulfilled, (state, action) => {
			const { module } = action.payload;
			state[module].refetching = true;
		});

		builder.addCase(showEntityData.fulfilled, (state, action) => {
			state.showEntityData = action.payload.data.data;
		});

		builder.addCase(deleteEntityData.fulfilled, (state, action) => {
			const { module } = action.payload;
			state[module].refetching = true;
		});

		builder.addCase(deleteEntityData.rejected, (state, action) => {
			const { module, data } = action.payload;
			state[module].validationMessages = data?.data;
			state[module].validation = true;
		});

		builder.addCase(getStatusInlineUpdateData.fulfilled, (state, action) => {
			state.statusInlineUpdateData = action.payload.data.data;
		});
	},
});

export const {
	setFilterData,
	setSearchKeyword,
	setDeleteMessage,
	setValidationData,
	setInventoryShowDataEmpty,
	setGlobalFetching,
	setKeyWordSearch,
	setSearchKeywordTooltip,
	setRefetchData,
	setInsertType,
	setItemData,
} = crudSlice.actions;

export default crudSlice.reducer;
