import './main.css';
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from "./App.tsx";
import AuthProvider from "./context/AuthProvider.tsx";
import LocationsProvider from "./context/LocationsProvider.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <LocationsProvider>
            <AuthProvider>
                <App/>
            </AuthProvider>
        </LocationsProvider>
    </StrictMode>,
);
