import React from "react";
import { Navbar, Nav, Container, Form, FormControl, Button, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";

const NavbarProject = () => {
	const logoUrl = "https://i.imgur.com/CckqetR.png";
	return (
		<Navbar bg="light" expand="lg" sticky="top">
			<Container>
				{/*Logo y titulo*/}
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
				<span className="fw-bold text-dark fs-4 ">
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
					<NavDropdown
						title={<FaUser size={30} className="text-info" />}
						align="end"
						className="user-dropdown"
					>
						<NavDropdown.Item as={Link} to="/login" className="text-dark">
						Iniciar Sesión
						</NavDropdown.Item>
						<NavDropdown.Item as={Link} to="/register" className="text-dark">
						Registrarse
						</NavDropdown.Item>
					</NavDropdown>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export {NavbarProject};