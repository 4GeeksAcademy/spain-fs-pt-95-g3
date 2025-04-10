import React from "react";
import { Container, Row, Col, Card, ProgressBar, Button } from "react-bootstrap";
import { FaFire, FaWalking, FaTrophy } from "react-icons/fa";

export const MiPlan = () => {
  const userData = {
    nombre: "Adrian Silva",
    edad: 24,
    tipoPlan: "Clasica",
    objetivo: "Perder peso",
    kcalRestantes: 2441,
    pasos: 0,
    pesoActual: 85.0,
    pesoInicial: 87.0,
    objetivos: {
      alimentacion: "Estandar",
      caloriasDiarias: 2441,
      pasosDiarios: 10000
    },
    retos: [
      {nombre: "Dejar el chocolate", completado: false},
      {nombre: "Dejar el azúcar", completado: false}
    ]
  };

  return (
    <Container className="my-4">
      {/*Header*/}
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">Mi Plan</h1>
          <div className="d-flex justify-content-center mb-3">
            <Button variant="outline-primary" className="mx-2">YO</Button>
            <Button variant="outline-secondary" className="mx-2">AMIGOS</Button>
          </div>
        </Col>
      </Row>

      {/* Perfil */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="text-center">{userData.nombre}</Card.Title>
              <Card.Text className="text-center">
                {userData.edad} años<br />
                {userData.tipoPlan}<br />
                {userData.objetivo}
              </Card.Text>
              <Row className="mt-3">
                <Col xs={6} className="text-center">
                  <div className="d-flex flex-column align-items-center">
                    <FaFire size={24} className="text-danger mb-2" />
                    <strong>Kcal restantes</strong>
                    <span>{userData.kcalRestantes}</span>
                  </div>
                </Col>
                <Col xs={6} className="text-center">
                  <div className="d-flex flex-column align-items-center">
                    <FaWalking size={24} className="text-primary mb-2" />
                    <strong>Pasos</strong>
                    <span>{userData.pasos}</span>
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
              <ul className="list-unstyled">
                <li className="mb-2">Alimentación: {userData.objetivos.alimentacion}</li>
                <li className="mb-2">Calorias: {userData.objetivos.caloriasDiarias}</li>
                <li className="mb-2">Pasos: {userData.objetivos.pasosDiarios}</li>
              </ul>
              <Button variant="outline-info" block>EDITAR</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/*progreso*/}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="text-center">Mi progreso</Card.Title>
              <div className="text-center m-3">
                <FaTrophy size={32} className="text-warning" />
                <h4 className="mt-2">¡Has perdido {userData.pesoInicial - userData.pesoActual} Kg!</h4>
                <p>¡Enhorabuena! ¡Has alcanzado tu objetivo! 😊</p>
              </div>
              <div className="text-center">
                <h5>{userData.pesoActual} Kg</h5>
                <ProgressBar
                now={(userData.pesoActual / userData.pesoInicial) * 100}
                label={`${((userData.pesoInicial - userData.pesoActual) / userData.pesoInicial *100).toFixed(1)}%`}
                variant="success"
                className="mb-3"/>
                <p>{userData.pesoInicial} Kg</p>
              </div>
              <Button variant="outline-secondary" block>ANÁLISIS</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/*Retos*/}
      <Row>
        <Col>
          <Card className="shadow-sm">
           <Card.Body>
            <Card.Title className="text-center">Reto</Card.Title>
            {userData.retos.map((reto, index) => (
              <div key={index} className="d-flex justify-content-between align-items-center mb-3">
                <span>{reto.nombre}</span>
                <Button variant={reto.completado ? "success" : "primary"} size="sm">
                  {reto.completado ? "Completado" : "Empezar el reto"}
                </Button>
              </div>              
            ))}
           </Card.Body>
          </Card>
        </Col>
      </Row>

      {/*Menu inferior*/}
      <Row className="fixed-bottom bg-white p-2 border-top">
        <Col className="d-flex justify-content-around">
          <Button variant="link">Diario</Button>
          <Button variant="link">Ayuno</Button>
          <Button variant="link">Recetas</Button>
          <Button variant="link" className="font-weight-bold">Perfil</Button>
          <Button variant="link" className="text-danger">PRO</Button>
        </Col>
      </Row>
    </Container> 
  );
};