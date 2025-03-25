import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

const SimpleNavbar = () => {
  return (
    <Navbar bg="primary" variant="dark">
      <Container>
        <Navbar.Brand href="#home">Recetas App</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="#home">Inicio</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export {SimpleNavbar};