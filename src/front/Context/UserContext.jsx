import { createContext, useState } from "react";

//contexto
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthdate: "",
    sex: "",
    objective: "",
    height: ""
  });

  const [userData, setUserData] = useState(null);

  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("kg");

  return (
    <UserContext.Provider
      value={{
        formData,
        setFormData,
        weight,
        setWeight,
        unit,
        setUnit,
        userData,
        setUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};