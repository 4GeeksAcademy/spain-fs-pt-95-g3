import React, { useContext, useState } from "react";
import { UserContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";

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
      newWeight = (weight * 2.20462).toFixed(2);  // Kg a libras redondeando 2 decimales
      
    } else if (newUnit === "kg" && unit === "lb") {
      newWeight = (weight / 2.20462).toFixed(2);  // Libras a kg
    }
  
    setUnit(newUnit);
    setWeight(newWeight);
  };  

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleRegister = async () => {

    const userData = {
      username: escapeJsonString(formData.name), 
      password: escapeJsonString(formData.password),
      email: escapeJsonString(formData.email),
      birthdate: escapeJsonString(formData.birthdate),
      objective: escapeJsonString(formData.objective),
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

        navigate("/profile");

      } else {
        alert(`Error: ${data.error || data.message}`);
      }
    } catch (error) {
      console.error("Error al conectar con el backend:", error);
      alert("Hubo un problema al intentar registrarte.");
    }
  };
  

  return (
    <div className="p-4 border">
      {step === 1 && (
        <div className="d-flex flex-column align-items-center text-center">
          <h2>Te damos la bienvenida a Qué, Como y Cuándo</h2>
          <p className="w-75">Donde podrás encontrar solución a todas las 
            cuestiones que puedas tener para llevar una buena alimentación y completamente personalizada.</p>
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            className="w-50 p-2 mt-2 form-control"
          />
          <input
            type="email"
            name="email"
            placeholder="Correo"
            value={formData.email}
            onChange={handleChange}
            className="w-50 p-2 mt-2 form-control"
          />
          <input
            type="password"
            name="password"
            placeholder="Crea una contraseña"
            value={formData.password}
            onChange={handleChange}
            className="w-50 p-2 mt-2 form-control"
          />
          <button onClick={nextStep} className="mt-4 p-2 btn btn-warning">
            Siguiente
          </button>
        </div>
      )}
      {step === 2 && (
        <div className="d-flex flex-column align-items-center text-center">
          <h2 className="text-xl font-bold">Fecha de nacimiento</h2>
          <input
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
            className="w-50 p-2 mt-2 form-control"
          />
          <button onClick={nextStep} className="mt-4 p-2 btn btn-warning">
            Siguiente
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="d-flex flex-column align-items-center">
          <h2 className="text-xl font-bold">Selecciona tu sexo biológico</h2>
          <p>Necesitamos saberlo para poder calcular tu ingesta calórica recomendada
            con mayor precisión.</p>
          <div className="d-flex justify-content-center mt-3">
            <button onClick={() => selectSex("Hombre")} className="m-2 p-3 btn btn-warning w-50">
              Hombre
            </button>
            <button onClick={() => selectSex("Mujer")} className="m-2 p-3 btn btn-warning w-50">
              Mujer
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="d-flex flex-column align-items-center">
          <h2 className="text-xl font-bold">¿Cuál es tu objetivo principal?</h2>
          <select
            name="objective"
            value={formData.objective}
            onChange={handleChange}
            className="w-50 p-2 mt-2 form-control"
          >
            <option value="">Selecciona un objetivo</option>
            <option value="Perder peso">Perder peso</option>
            <option value="Ganar peso">Ganar peso</option>
            <option value="Mantenerse">Mantenerse</option>
            <option value="Ganar masa muscular">Ganar masa muscular</option>
          </select>
          <div className="flex justify-between mt-4">
            <button onClick={prevStep} className="m-1 p-2 btn btn-secondary">Atrás</button>
            <button onClick={nextStep} className="m-1 p-2 btn btn-warning">Siguiente</button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="d-flex flex-column align-items-center">
          <h2>Altura</h2>
          <input
            type="number"
            name="height"
            placeholder="En centímetros"
            value={formData.height}
            onChange={handleChange}
            className="w-50 p-2 mt-2 form-control text-center"
          />
          <div className="w-50 flex items-center justify-center mt-4 text-center">
            <h2>Peso</h2>
            <div className="w-100">
              <input
                type="number"
                name="weight"
                placeholder="Tu peso"
                value={weight}
                onChange={handleWeightChange}
                className="col-9 p-2 border rounded text-center"
              />
              <select
                value={unit}
                onChange={handleUnitChange}
                className="col-3 ml-2 p-2 border rounded"
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <button onClick={prevStep} className="m-1 p-2 btn btn-secondary">
              Atrás
            </button>
            <button onClick={nextStep} className="m-1 p-2 btn btn-warning">
              Siguiente
            </button>
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="d-flex flex-column align-items-center">
          <h2 className="text-xl font-bold">Confirmación</h2>
          <p>Estos son los datos que tenemos de ti por ahora. 
            ¡Podrás actualizarlos en tu perfil cuando quieras! ☺️</p>

          <p><strong>Nombre:</strong> {formData.name}</p>
          <p><strong>Correo:</strong> {formData.email}</p>
          <p><strong>Fecha de nacimiento:</strong> {formData.birthdate}</p>
          <p><strong>Sexo Biológico:</strong> {formData.sex}</p>
          <p><strong>Objetivo:</strong> {formData.objective}</p>
          <p><strong>Altura:</strong> {formData.height}</p>
          <p><strong>Peso:</strong> {weight} {unit}</p>
          <button onClick={handleRegister} className="mt-4 p-2 btn btn-info text-white">
            Confirmar y Registrarse
          </button>
        </div>
      )}

      {step === 99 && (
        <div className="d-flex flex-column align-items-center">
          <img src="https://i.imgur.com/20vE9hf.jpeg" className="img-fluid w-25"></img>
          <h2 className="text-xl font-bold">Recuperar Contraseña</h2>
          <p>Introduce tu correo y te enviaremos instrucciones para restablecer tu contraseña.</p>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            className="w-50 p-2 mt-3 form-control"
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