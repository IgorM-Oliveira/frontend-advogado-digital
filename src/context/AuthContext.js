import axios from "../service/api";
import {createContext, useState, useEffect} from "react";
import jwt_decode from "jwt-decode";
import {useHistory} from "react-router-dom";
const swal= require('sweetalert2')

const AuthContext = createContext(undefined);

export default AuthContext

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null
    );

    const [user, setUser] = useState(() =>
        localStorage.getItem("authTokens")
            ? localStorage.getItem("authTokens")
            : null
    );


    const [loading, setLoading] = useState(true);

    const history = useHistory();

    const loginUser = async (user, password) => {
        axios.post('/login', {
                user: user,
                senha: password,
            }, {
                withCredentials: false
            }
        ).then(response => {
            const {authTokens} = response.data

            setAuthTokens(authTokens)

            try {
                setUser(jwt_decode(authTokens.access))
            } catch (error) {
                console.error('Error decoding token:', error.message);
            }

            localStorage.setItem("authTokens", JSON.stringify(authTokens))

            history.push("/")

            swal.fire({
                title: "Login bem-sucedido!",
                icon: "success",
                toast: true,
                timer: 3000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        })
        .catch(error => {
            console.log("there was a server issue");
            swal.fire({
                title: "Nome de usuário ou senha não existe!",
                icon: "error",
                toast: true,
                timer: 3000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        })
    }

    const loginClient = async (user, password) => {
        axios.post('/login/client', {
                user: user,
                senha: password,
            }, {
                withCredentials: false
            }
        ).then(response => {
            const {authTokens} = response.data

            setAuthTokens(authTokens)

            try {
                setUser(jwt_decode(authTokens.access))
            } catch (error) {
                console.error('Error decoding token:', error.message);
            }

            localStorage.setItem("authTokens", JSON.stringify(authTokens))

            history.push("/")

            swal.fire({
                title: "Login bem-sucedido!",
                icon: "success",
                toast: true,
                timer: 3000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        })
            .catch(error => {
                console.log("there was a server issue");
                swal.fire({
                    title: "Nome de usuário ou senha não existe!",
                    icon: "error",
                    toast: true,
                    timer: 3000,
                    position: 'top-right',
                    timerProgressBar: true,
                    showConfirmButton: false,
                })
            })
    }

    const registerUser = async (email, username, password, password2) => {
        const response = await fetch("http://127.0.0.1:8000/api/register/", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email, username, password, password2
            })
        })
        if(response.status === 201){
            history.push("/login")
            swal.fire({
                title: "Registration Successful, Login Now",
                icon: "success",
                toast: true,
                timer: 3000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        } else {
            console.log(response.status);
            console.log("there was a server issue");
            swal.fire({
                title: "An Error Occured " + response.status,
                icon: "error",
                toast: true,
                timer: 3000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        }
    }

    const logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem("authTokens")
        history.push("/login")
        swal.fire({
            title: "Você foi desconectado...",
            icon: "success",
            toast: true,
            timer: 3000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
        })
    }

    const contextData = {
        user, 
        setUser,
        authTokens,
        setAuthTokens,
        registerUser,
        loginUser,
        loginClient,
        logoutUser,
    }

    useEffect(() => {
        if (authTokens) {
            setUser(jwt_decode(authTokens))
        }
        setLoading(false)
    }, [authTokens, loading])

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )

}
