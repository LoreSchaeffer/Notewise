import './App.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import {useLocations} from "./context/LocationsProvider.tsx";
import Page from "./components/Page.tsx";

export default function App() {
    const {locations} = useLocations();

    const router = createBrowserRouter(locations.map(l => {
        return {
            path: l.path,
            element: l.allowedRoles
                ? <ProtectedRoute allowedRoles={l.allowedRoles}>{l.element}</ProtectedRoute>
                : <Page>{l.element}</Page>
        }
    }), {
        future: {
            v7_relativeSplatPath: true,
            v7_fetcherPersist: true,
            v7_partialHydration: true,
            v7_normalizeFormMethod: true,
            v7_skipActionErrorRevalidation: true,
        }
    });

    return (
        <RouterProvider router={router} future={{v7_startTransition: true}}></RouterProvider>
    )
}