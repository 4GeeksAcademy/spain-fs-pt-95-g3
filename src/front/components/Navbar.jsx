import React from "react";
import { Navbar, Nav, Container, Form, FormControl, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const NavbarProject = () => {
	return (
		<Navbar bg="light" expand="lg" sticky="top">
			<Container>
				{/*Que, Como y cuando*/}
				<Navbar.Brand as={Link} to="/" className="fw-bold text-success">
					<i classname="fas fa-utensils me-2"></i>
					Que, Como y Cuando
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					{/*menu de navegacion*/}
					<Nav classname="me-auto">
						<Nav.Link as={Link} to="/" className="mx-2">
						Página Principal
						</Nav.Link>
						<Nav.Link as={Link} to="/recetas" className="mx-2">
						Recetas
						</Nav.Link>
						<Nav.Link as={Link} to="/planificador" className="mx-2">
						Mi Plan
						</Nav.Link>
					</Nav>
					{/*barra de busqueda*/}
					<Form className="d-flex me-3">
						<FormControl
						type="search"
						placeholder="Buscar Recetas..."
						className="me-2"
						aria-label="Search"/>
						<Button variant="outline-success">
							<i className="fas fa-search"></i>
						</Button>
					</Form>

					{/*inicio de sesión*/}
					<div>
						<Button
							variant="outline-primary"
							className="me-2"
							as={Link}
							to="/login" >
								Iniciar Sesión
							</Button>
							<Button 
							variant="success"
							as={Link}
							to="/register">
								Registrarse
							</Button>
					</div>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export {NavbarProject};