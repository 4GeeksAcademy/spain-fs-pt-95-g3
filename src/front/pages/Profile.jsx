import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, ProgressBar, Button, Form } from "react-bootstrap";
import { FaFire, FaWalking, FaTrophy } from "react-icons/fa";

function getAge(birthdate) {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();
  const birthMonth = birthDate.getMonth();
  const birthDay = birthDate.getDate();

  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && currentDay < birthDay)
  ) {
    age--;
  }

  return age;
}

const baseUrl = import.meta.env.VITE_API_URL;

export const Profile = () => {

  const [showInput, setShowInput] = useState(false);
  const [widgetAdded, setWidgetAdded] = useState(
    () => localStorage.getItem("widgetAdded") === "true");
  const [actualWeight, setActualWeight] = useState(
    () => parseFloat(localStorage.getItem("pesoActual")) || 0);
  const [newWeight, setNewWeight] = useState("");

  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  const [retos, setRetos] = useState([]);
  const [nuevoReto, setNuevoReto] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("No hay token. Por favor inicia sesión.");
        return;
      }
      try {
        const res = await fetch(`${baseUrl}/api/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) setUserData(data);
        else setError(data.error || "No se pudo cargar el perfil");
      } catch (err) {
        console.error(err);
        setError("Error al conectar con el servidor");
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchRetos = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const res = await fetch(`${baseUrl}/api/challenges`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setRetos(data);
        else console.error("Error al cargar retos", data);
      } catch (err) {
        console.error("Error de conexión al cargar retos", err);
      }
    };
    fetchRetos();
  }, []);

  if (error) return <p>{error}</p>;
  if (!userData) return <p>Cargando perfil...</p>;

  // GuardarPeso
  const handleSavingWeight = async () => {
    const peso = parseFloat(newWeight);
    if (isNaN(peso)) return;
  
    const token = localStorage.getItem("access_token");
    const unidad = localStorage.getItem("unit") || "kg"; // unidad guardada
  
    try {
      const res = await fetch(`${baseUrl}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ weight: peso, unit: unidad })
      });
      if (!res.ok) console.error("Error actualizando peso en servidor");
    } catch (err) {
      console.error(err);
    }
  
    setActualWeight(peso);
    localStorage.setItem("pesoActual", peso.toString());
    localStorage.setItem("widgetAdded", "true");
    setWidgetAdded(true);
    setShowInput(false);
    setNewWeight("");
  };

  const handleAgregarReto = async () => {
    const token = localStorage.getItem("access_token");
    if (nuevoReto.trim() === "") return;
  
    try {
      const res = await fetch(`${baseUrl}/api/challenges`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nombre: nuevoReto })
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setRetos((prev) => [...prev, data]);
        setNuevoReto("");
      } else {
        console.error("Error al crear reto", data);
      }
    } catch (err) {
      console.error("Error de conexión al crear reto", err);
    }
  };

  const handleCompletarReto = async (id) => {
    const token = localStorage.getItem("access_token");
  
    try {
      const res = await fetch(`${baseUrl}/api/challenges/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setRetos((prev) =>
          prev.map((reto) =>
            reto.id === id ? { ...reto, completado: true } : reto
          )
        );
      } else {
        console.error("Error al completar reto", data);
      }
    } catch (err) {
      console.error("Error de conexión al completar reto", err);
    }
  };

  return (
    <Container className="my-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h1 className="text-center mb-4"
            style={{
              color: "#2c3e50",
              fontWeight: "700",
              textShadow: "1px 1px 3px rgba(0,0,0,0.1)",
              position: "relative",
              paddingBottom: "10px"
            }}>Perfil
          </h1>
        </Col>
      </Row>

      {/* info del perfil */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="text-center">{userData.username}</Card.Title>
              <Card.Text className="text-center">
                {getAge(userData.birthdate)} años<br />
                <strong>Objetivo:</strong> {userData.objective}
              </Card.Text>
              <Row className="mt-3">
                <Col xs={6} className="text-center">
                  <div className="d-flex flex-column align-items-center">
                    <FaFire size={24} className="text-danger mb-2" />
                    <strong>Kcal restantes</strong>
                    <span>{userData.calorias_diarias}</span>
                  </div>
                </Col>
                <Col xs={6} className="text-center">
                  <div className="d-flex flex-column align-items-center">
                    <FaWalking size={24} className="text-primary mb-2" />
                    <strong>Pasos</strong>
                    <span>0</span>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="text-center">Mis objetivos</Card.Title>
              <ul className="list-unstyled text-center">
                <li><strong>Calorías:</strong> {userData.calorias_diarias} kcal</li>
                <li><strong>Proteínas:</strong> {userData.proteinas} g</li>
                <li><strong>Grasas:</strong> {userData.grasas} g</li>
                <li><strong>Carbohidratos:</strong> {userData.carbohidratos} g</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Widget */}
      {!widgetAdded && !showInput && (
        <Button
          variant="info text-white"
          className="w-100 mb-4 p-4 fs-4"
          onClick={() => setShowInput(true)}
        >
          Añadir widget de pérdida de peso
        </Button>
      )}

      {showInput && (
        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm">
              <Card.Body>
                <h5 className="text-center mb-3">Actualizar peso actual</h5>
                <Form.Control
                  type="number"
                  placeholder="Introduce tu peso"
                  className="mb-2"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                />
                <Button onClick={handleSavingWeight} className="w-100 btn-info text-white">
                  Guardar peso
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {widgetAdded && (
        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="text-center">Mi progreso</Card.Title>
                <div className="text-center m-3">
                  <FaTrophy size={32} className="text-warning" />
                  <h4 className="mt-2">
                    ¡Has perdido {Math.abs(userData.weight - actualWeight).toFixed(1)} Kg!
                  </h4>
                  <p>¡Enhorabuena! ¡Vas por muy buen camino! 😊</p>
                </div>
                <div className="text-center">
                  <h5>{actualWeight} Kg</h5>
                  <ProgressBar now={(actualWeight / userData.weight) * 100}
                    label={`${(
                      ((userData.weight - actualWeight) / userData.weight) * 100).toFixed(1)}%`}
                      variant="warning" className="mb-3"/>
                  <p>{userData.weight} Kg</p>
                </div>
                <Button variant="outline-secondary" onClick={() => setShowInput(true)}>
                  Actualizar peso
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/*Retos*/}
      <Card className="shadow-sm">
      <Card.Body>
      <Form className="mb-3 d-flex gap-2">
  <Form.Control
    type="text"
    placeholder="Nuevo reto"
    value={nuevoReto}
    onChange={(e) => setNuevoReto(e.target.value)}
  />
  <Button onClick={handleAgregarReto} className="btn btn-info text-white">Añadir</Button>
</Form>

{retos.map((reto) => (
  <div key={reto.id} className="d-flex justify-content-between align-items-center mb-3">
    <span>{reto.nombre}</span>
    <Button
      variant={reto.completado ? "success" : "warning text-white"}
      size="sm"
      onClick={() => handleCompletarReto(reto.id)}
    >
      {reto.completado ? "Completado" : "Reto empezado"}
    </Button>
  </div>
))}
</Card.Body>
</Card>
    </Container>
  );
};
