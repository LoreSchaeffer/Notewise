import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthProvider.tsx";
import Button from "../Button.tsx";
import {Input} from "../form/Input.tsx";

function LoginPage() {
    const {handleLogin} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (error) console.error(error);
    }, [error]);

    const handleSubmit = async () => {
        handleLogin(username, password).then(() => {
            navigate(from, {replace: true});
        }).catch(e => {
            setError(e.message);
        });
    };

    return (
        <>
            <h1>Login</h1>
            <Input label={'Username'} value={username} onChange={(e) => setUsername(e.target.value)}/>
            <Input label={'Password'} type={'password'} value={password} onChange={(e) => setPassword(e.target.value)}/>
            <Button onClick={handleSubmit}>Login</Button>
        </>
    )
}

export default LoginPage;