import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate(); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleLogin = async () => {
        try {
            const res = await fetch("https://laughing-waffle-x5vgqj4g9556hv95x-3001.app.github.dev/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                // Guarda el token
                localStorage.setItem("token", data.token);
                // ajustar
                navigate("/profile");
            } else {
                setError(data.message || "Error al iniciar sesión");
            }

        } catch (err) {
            console.error(err);
            setError("Ocurrió un error inesperado");
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto border rounded-lg shadow-md">
            {step === 1 && (
                <div className="d-flex flex-column align-items-center text-center">
                    <img src="https://i.imgur.com/20vE9hf.jpeg" className="img-fluid w-25" alt="Logo" />
                    <h2 className="text-xl font-bold mt-4">Iniciar Sesión</h2>

                    <input
                        type="text"
                        name="email"
                        placeholder="Correo electrónico"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-50 p-2 mt-3 border rounded"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-50 p-2 mt-3 border rounded"
                    />

                    {error && <p className="text-danger mt-2">{error}</p>}

                    <button onClick={handleLogin} className="mt-4 p-2 btn bg-info text-white">
                        Iniciar sesión
                    </button>

                    <p className="mt-2 btn text-warning" onClick={() => setStep(99)}>¿Has olvidado tu contraseña?</p>
                    <p>¿No tienes una cuenta con nosotros?
                        <Link to="/register" className="btn text-warning m-0">¡Crear una ahora!</Link>
                    </p>
                </div>
            )}

            {step === 99 && (
                <div className="d-flex flex-column align-items-center">
                    <img src="https://i.imgur.com/20vE9hf.jpeg" className="img-fluid w-25" alt="logo" />
                    <h2 className="text-xl font-bold">Recuperar Contraseña</h2>
                    <p>Introduce tu correo y te enviaremos instrucciones para restablecer tu contraseña.</p>
                    <input
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-50 p-2 mt-3 border rounded"
                    />
                    <button className="btn btn-warning w-50 mt-3">Enviar</button>
                    <button className="btn btn-secondary w-50 mt-2" onClick={() => setStep(1)}>
                        Volver al inicio de sesión
                    </button>
                </div>
            )}
        </div>
    );
};
