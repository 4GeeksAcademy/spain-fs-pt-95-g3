import React, { useContext, useState } from "react";
import { UserContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";

const KG_IN_POUND = 2.20462;
const baseUrl = import.meta.env.VITE_API_URL;
export const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthdate: "",
    objective: "",
    height: "",
    weight: "",
    password: "",
    sex: "",
  });

  const navigate = useNavigate();
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("kg");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectSex = (sex) => {
    setFormData({ ...formData, sex });
    nextStep();
  };

  const handleWeightChange = (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, "");
    setWeight(value);
  };

  const handleUnitChange = (e) => {
    let newUnit = e.target.value;
    let newWeight = weight;

    if (newUnit === "lb" && unit === "kg") {
      newWeight = (weight * KG_IN_POUND).toFixed(2);
    } else if (newUnit === "kg" && unit === "lb") {
      newWeight = (weight / KG_IN_POUND).toFixed(2);
    }

    setUnit(newUnit);
    setWeight(newWeight);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleRegister = async () => {
    
    const userData = {
      username: formData.name, 
      password: formData.password,
      email: formData.email,
      birthdate: formData.birthdate,
      objective: formData.objective,
      height: formData.height,
      sex: formData.sex,  
      weight: weight,         
      unit: unit
    };
    try {
      const response = await fetch(`${baseUrl}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
  
      const data = await response.json();
  
      if (response.status >= 200 && response.status < 300) {
        alert("Registro completado con éxito!");
        console.log("Respuesta del backend:", data);

         // Actualizamos el contexto con toda la info y guardamos el peso y unidad
        setFormData(userData);    
        setWeight(weight);        
        setUnit(unit);           

        navigate("/login");

      } else {
        alert(`Error: ${data.error || data.message}`);
      }
    } catch (error) {
      console.error("Error al conectar con el backend:", error);
      alert("Hubo un problema al intentar registrarte.");
    }
  };
  

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-5 shadow w-100 " style={{ maxWidth: "70vw" }}>
        {step === 1 && (
          <div className="text-center d-grid gap-4">
            <h2>Te damos la bienvenida a Qué, Como y Cuánto</h2>
            <p>Donde podrás encontrar solución a todas las cuestiones que puedas tener para llevar una buena alimentación, y además, completamente personalizada.</p>
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
            />
            <input
              type="email"
              name="email"
              placeholder="Correo"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
            />
            <input
              type="password"
              name="password"
              placeholder="Crea una contraseña"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
            />
            <button onClick={nextStep} className="btn btn-warning w-100">
              Siguiente
            </button>
          </div>
        )}
  
        {step === 2 && (
          <div className="text-center d-grid gap-4">
            <h2>Fecha de nacimiento</h2>
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              className="form-control"
            />
            <button onClick={nextStep} className="btn btn-warning w-100 my-2">
              Siguiente
            </button>
          </div>
        )}
  
        {step === 3 && (
          <div className="text-center d-grid gap-3">
            <h2>Selecciona tu sexo biológico</h2>
            <p>Necesitamos saberlo para poder calcular tu ingesta calórica recomendada con mayor precisión.</p>
            <div className="d-flex justify-content-between">
              <button onClick={() => selectSex("Hombre")} className="btn btn-warning w-100 me-2">
                Hombre
              </button>
              <button onClick={() => selectSex("Mujer")} className="btn btn-warning w-100 ms-2">
                Mujer
              </button>
            </div>
          </div>
        )}
  
        {step === 4 && (
          <div className="text-center d-grid gap-4">
            <h2>¿Cuál es tu objetivo principal?</h2>
            <select
              name="objective"
              value={formData.objective}
              onChange={handleChange}
              className="form-select my-2"
            >
              <option value="">Selecciona un objetivo</option>
              <option value="Perder peso">Perder peso</option>
              <option value="Ganar peso">Ganar peso</option>
              <option value="Mantenerse">Mantenerse</option>
              <option value="Ganar masa muscular">Ganar masa muscular</option>
            </select>
            <div className="d-flex justify-content-between">
              <button onClick={prevStep} className="btn btn-secondary me-2 w-50">Atrás</button>
              <button onClick={nextStep} className="btn btn-warning ms-2 w-50">Siguiente</button>
            </div>
          </div>
        )}
  
        {step === 5 && (
          <div className="text-center d-grid gap-2">
            <h2>Altura</h2>
            <input
              type="number"
              name="height"
              placeholder="En centímetros"
              value={formData.height}
              onChange={handleChange}
              className="form-control text-center"
            />
            <h2 className="mt-3">Peso</h2>
            <div className="d-flex align-items-center">
              <input
                type="number"
                name="weight"
                placeholder="Tu peso"
                value={weight}
                onChange={handleWeightChange}
                className="form-control me-2 text-center"
              />
              <select
                value={unit}
                onChange={handleUnitChange}
                className="form-select w-auto"
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            </div>
            <div className="d-flex justify-content-between mt-4">
              <button onClick={prevStep} className="btn btn-secondary me-2 w-50">Atrás</button>
              <button onClick={nextStep} className="btn btn-warning ms-2 w-50">Siguiente</button>
            </div>
          </div>
        )}
  
        {step === 6 && (
          <div className="text-center">
            <h2>Confirmación</h2>
            <p>Estos son los datos que tenemos de ti por ahora. ¡Podrás actualizarlos en tu perfil cuando quieras! ☺️</p>
            <p><strong>Nombre:</strong> {formData.name}</p>
            <p><strong>Correo:</strong> {formData.email}</p>
            <p><strong>Fecha de nacimiento:</strong> {formData.birthdate}</p>
            <p><strong>Sexo Biológico:</strong> {formData.sex}</p>
            <p><strong>Objetivo:</strong> {formData.objective}</p>
            <p><strong>Altura:</strong> {formData.height}</p>
            <p><strong>Peso:</strong> {weight} {unit}</p>
            <button onClick={handleRegister} className="btn btn-info text-white my-4 w-100">
              Confirmar y Registrarse
            </button>
            <button onClick={prevStep} className="btn btn-secondary w-25">Atrás</button>
          </div>
        )}
  
        {step === 99 && (
          <div className="text-center">
            <img src="https://i.imgur.com/20vE9hf.jpeg" className="img-fluid w-50 mb-3" />
            <h2>Recuperar Contraseña</h2>
            <p>Introduce tu correo y te enviaremos instrucciones para restablecer tu contraseña.</p>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              className="form-control my-3"
            />
            <button className="btn btn-warning w-100 mb-2">Enviar</button>
            <button className="btn btn-secondary w-100" onClick={() => setStep(1)}>
              Volver al inicio de sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
