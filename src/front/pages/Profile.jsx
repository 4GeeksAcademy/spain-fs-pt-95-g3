import React, { useContext } from "react";
import { UserContext } from "../Context/UserContext";

export const Profile = () => {
  const { formData, weight, unit } = useContext(UserContext);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Perfil</h1>
      <p><strong>Nombre:</strong> {formData.name}</p>
      <p><strong>Correo:</strong> {formData.email}</p>
      <p><strong>Fecha de nacimiento:</strong> {formData.birthdate}</p>
      <p><strong>Sexo Biológico:</strong> {formData.sex}</p>
      <p><strong>Objetivo:</strong> {formData.objective}</p>
      <p><strong>Altura:</strong> {formData.height} cm</p>
      <p><strong>Peso:</strong> {weight} {unit}</p>
    </div>
  );
};