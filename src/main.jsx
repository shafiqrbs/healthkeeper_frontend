import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n.js";
import "./lang/i18next";
import App from "./App.jsx";

import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter } from "react-router-dom";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./app/store";
import { Provider } from "react-redux";

const theme = createTheme({
	primaryColor: "indigo",
	fontFamily: "Open Sans, sans-serif",
});

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<MantineProvider theme={theme} withNormalizeCSS withGlobalStyles>
			<BrowserRouter>
				<Notifications />
				<Provider store={store}>
					<PersistGate loading={null} persistor={persistor}>
						<ModalsProvider>
							<App />
						</ModalsProvider>
					</PersistGate>
				</Provider>
			</BrowserRouter>
		</MantineProvider>
	</React.StrictMode>
);
