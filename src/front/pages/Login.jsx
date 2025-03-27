import React from "react";
import { useState } from "react";

export const Login = () => {
	const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    objective: "",
    height: "",
    weight: "",
    password: "",
    sex: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectSex = (sex) => {
    setFormData({ ...formData, sex });
    nextStep();
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="p-4 max-w-md mx-auto border rounded-lg shadow-md">
      {step === 1 && (
        <div className="d-flex flex-column align-items-center">
          <img src="https://i.imgur.com/20vE9hf.jpeg" className="img-fluid w-25"></img>
          <h2 className="text-xl font-bold">Regístrate</h2>
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
        <button onClick={nextStep} className="mt-4 p-2 btn btn-info text-white">
          Iniciar sesión
        </button>
        <p className="mt-2 btn text-warning" onClick={() => setStep(99)}>¿Has olvidado tu contraseña?</p>
        <p>¿No tienes una cuenta con nosotros?<span onClick={nextStep} className="btn text-warning">¡Crear una ahora!</span></p>
	  </div>
      )}
	  {step === 2 && (
        <div className="d-flex flex-column align-items-center">
          <h2 className="text-xl font-bold">Te damos la bienvenida a Qué, Como y Cuándo</h2>
          <p className="w-75">Donde podrás encontrar solución a todas las cuestiones que puedas tener para llevar una buena 
            alimentación y completamente personalizada.</p>
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            className="w-50 p-2 mt-2 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Correo"
            value={formData.email}
            onChange={handleChange}
            className="w-50 p-2 mt-2 border rounded"
          />
          <input
          type="email"
          name="password"
          placeholder="Crea una contraseña"
          value={formData.password}
          onChange={handleChange}
          className="w-50 p-2 mt-3 border rounded"
          />
          <button onClick={nextStep} className="mt-4 p-2 btn btn-info text-white">
            Siguiente
          </button>
        </div>
      )}
      {step === 3 && (
        <div className="d-flex flex-column align-items-center">
        <h2 className="text-xl font-bold">Selecciona tu sexo biológico</h2>
        <div className="d-flex justify-content-center mt-3">
          <button onClick={() => selectSex("Hombre")} className="m-2 p-3 btn btn-info w-50 text-white">
            Hombre
          </button>
          <button onClick={() => selectSex("Mujer")} className="m-2 p-3 btn btn-warning w-50 text-white">
            Mujer
          </button>
        </div>
      </div>
      )}
      {step === 4 && (
        <div className="text-center">
          <h2 className="text-xl font-bold">¿Tienes un objetivo?</h2>
          <select
            name="objective"
            value={formData.objective}
            onChange={handleChange}
            className="w-full p-2 mt-2 border rounded"
          >
            <option value="">Selecciona un objetivo</option>
            <option value="lose">Perder peso</option>
            <option value="gain">Ganar peso</option>
            <option value="maintain">Mantenerse</option>

          </select>
          <div className="flex justify-between mt-4">
            <button onClick={prevStep} className="m-1 p-2 btn btn-primary">Atrás</button>
            <button onClick={nextStep} className="m-1 p-2 btn btn-primary">Siguiente</button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="text-center">
          <h2 className="text-xl font-bold">Altura</h2>
          <input
            type="text"
            name="height"
            placeholder="En centímetros"
            value={formData.height}
            onChange={handleChange}
            className="w-full p-2 mt-2 border rounded"
          />
		  <h2 className="text-xl font-bold">Peso</h2>
          <input
            type="text"
            name="weight"
            placeholder="En kilogramos"
            value={formData.weight}
            onChange={handleChange}
            className="w-full p-2 mt-2 border rounded"
          />
          <div className="flex justify-between mt-4">
            <button onClick={prevStep} className="m-1 p-2 btn btn-secondary">Atrás</button>
            <button onClick={nextStep} className="m-1 p-2 btn btn-info">Finalizar</button>
          </div>
        </div>
      )}

      {step === 6 && (
        <div>
          <h2 className="text-xl font-bold">Confirmación</h2>
          <p><strong>Nombre:</strong> {formData.name}</p>
          <p><strong>Correo:</strong> {formData.email}</p>
          <p><strong>Sexo Biológico:</strong> {formData.sex}</p>
          <p><strong>Objetivo:</strong> {formData.objective}</p>
          <p><strong>Altura:</strong> {formData.height}</p>
		      <p><strong>Peso:</strong> {formData.weight}</p>
          <button onClick={() => alert("Registro completado")} className="mt-4 p-2 btn btn-success">
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
