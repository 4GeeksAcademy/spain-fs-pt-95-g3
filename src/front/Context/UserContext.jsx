import { createContext, useState } from "react";

// Creamos el contexto
export const UserContext = createContext();

// Proveedor del contexto para envolver toda la aplicación
export const UserProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthdate: "",
    sex: "",
    objective: "",
    height: ""
  });

  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("kg");

  return (
    <UserContext.Provider value={{ formData, setFormData, weight, setWeight, unit, setUnit }}>
      {children}
    </UserContext.Provider>
  );
};