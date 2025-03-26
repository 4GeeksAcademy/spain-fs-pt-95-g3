import React from "react";
import { Navbar, Nav, Container, Form, FormControl, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const NavbarProject = () => {
	const logoUrl = "https://i.imgur.com/CckqetR.png";
	return (
		<Navbar bg="info-subtle" expand="lg" sticky="top">
			<Container>
				{/*Que, Como y cuando*/}
				<Navbar.Brand as={Link} to="/" className="d-flex align-items-center" style={{height:"60px"}}>
					<img src={logoUrl}
					alt="Logo"
					style={{
					width:"100px",
					height:"auto",
					maxHeight:"200%",
					objectFit:"contain"
					}}
					classname="me-2"
					onError={(e) =>{ e.target.onerror = null;
						e.target.src = "https://via.placeholder.com/40";
					 }}
					 />
				<span className="fw-bold text-info fs-4 ">
					Que, Como y Cuando
				</span>	
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
						<Button variant="outline-info">
							<i className="fas fa-search"></i>
						</Button>
					</Form>

					{/*inicio de sesión*/}
					<div>
						<Button
							variant="outline-info"
							className="me-2"
							as={Link}
							to="/login" >
								Iniciar Sesión
							</Button>
							<Button 
							variant="light"
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