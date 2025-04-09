import React, { useEffect, useState } from "react";

export const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("No hay token. Por favor inicia sesión.");
        return; //detener si no hay token
      }

      try {
        console.log(token)
        const res = await fetch("https://laughing-waffle-x5vgqj4g9556hv95x-3001.app.github.dev/api/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setUserData(data);
        } else {
          setError(data.error || "No se pudo cargar el perfil");
        }
      } catch (err) {
        console.error(err);
        setError("Error al conectar con el servidor");
      }
    };

    fetchProfile();
  }, []);  //ejecutar fetchPr una sola vez al montar el componente

  if (error) return <p>{error}</p>;
  if (!userData) return <p>Cargando perfil...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Perfil</h1>
      <p><strong>Nombre:</strong> {userData.username}</p>
      <p><strong>Correo:</strong> {userData.email}</p>
      <p><strong>Fecha de nacimiento:</strong> {userData.birthdate}</p>
      <p><strong>Sexo Biológico:</strong> {userData.sex}</p>
      <p><strong>Objetivo:</strong> {userData.objective}</p>
      <p><strong>Altura:</strong> {userData.height} cm</p>
      <p><strong>Peso:</strong> {userData.weight} kg</p>
    </div>
  );
};
