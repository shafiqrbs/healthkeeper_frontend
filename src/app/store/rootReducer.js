import { combineReducers } from "redux";

import utilitySlice from "./core/utilitySlice.js";
import crudSlice from "./core/crudSlice.js";

const rootReducer = (asyncReducers) => (state, action) => {
	const combinedReducer = combineReducers({
		utility: utilitySlice,
		crud: crudSlice,
		...asyncReducers,
	});
	return combinedReducer(state, action);
};

export default rootReducer;
