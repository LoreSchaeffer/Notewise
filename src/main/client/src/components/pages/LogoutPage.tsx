import {useEffect} from "react";
import {useAuth} from "../../context/AuthProvider.tsx";
import {useNavigate} from "react-router-dom";

function LogoutPage() {
    const navigate = useNavigate();
    const {handleLogout} = useAuth();

    useEffect(() => {
        handleLogout().then(() => navigate("/"));
    }, []);

    return (
        <></>
    )
}

export default LogoutPage;