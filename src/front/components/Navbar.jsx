import React, { useState } from "react";
import { Navbar, Nav, Container, Form, FormControl, Button, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NavbarProject = () => {
	const [searchQuery, setSearchQuery] = useState("")
	const navigate = useNavigate();

	const handleSearch = (e) =>{
		e.preventDefault();
		if (searchQuery.trim()){
			navigate(`/?search=${encodeURIComponent(searchQuery)}`);
			setSearchQuery("");
		}
	};
	const logoUrl = "https://i.imgur.com/CckqetR.png";
	const handleLogout = () => {
		localStorage.removeItem("access_token");
		navigate("/register");                    
	  };

	return (
		<Navbar bg="light" expand="lg" sticky="top" className="shadow">
			<Container className="rounded">
					<Navbar.Brand as={Link} to="/" className="d-flex align-items-center" style={{height:"60px"}}>
					<img src={logoUrl}
					alt="Logo"
					style={{
					width:"100px",
					height:"auto",
					maxHeight:"200%",
					objectFit:"contain"
					}}
					className="me-2"
					onError={(e) =>{ e.target.onerror = null;
						e.target.src = "https://via.placeholder.com/40";
					 }}
					 />
				<span className="text-center fw-bold"
					style={{
						color: "#2c3e50",
						fontWeight: "700",
						textShadow: "1px 1px 3px rgba(0,0,0,0.1)",
						position: "relative",
						paddingBottom: "5px",
						fontSize: "1.8rem",
					}}>
					Qué, Como y Cuánto
				</span>	
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					{/*menu de navegacion*/}
					<Nav className="me-auto">
						<Nav.Link as={Link} to="/" className="mx-2">
						Página Principal
						</Nav.Link>
						<Nav.Link as={Link} to="/recipes" className="mx-2">
						Recetas
						</Nav.Link>
						<Nav.Link as={Link} to="/planning" className="mx-2">
						Mi Plan
						</Nav.Link>
						<Nav.Link as={Link} to="/create-recipe" className="mx-2">
						Crear Receta
						</Nav.Link>
					</Nav>
					{/*barra de busqueda*/}
					<Form className="d-flex me-3" onSubmit={handleSearch}>
						<FormControl
						type="search"
						placeholder="Buscar Recetas..."
						className="me-2"
						aria-label="Search"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}/>
						<Button variant="outline-info" type="submit">
							<i className="fas fa-search"></i>
						</Button>
					</Form>

					{/*inicio de sesión*/}
					<NavDropdown
						title={<FaUser size={30} className="text-info" />}
						align="end"
						className="user-dropdown"
					>
						<NavDropdown.Item as={Link} to="/profile" className="text-dark">
						Hola usuario
						</NavDropdown.Item>
						<NavDropdown.Item as={Link} to="/register" onClick={handleLogout} className="text-danger">
						Salir
						</NavDropdown.Item>
						<hr className="dropdown-divider m-0"></hr>
						<NavDropdown.Item as={Link} to="/profile" className="text-dark">
						Perfil
						</NavDropdown.Item>
						<NavDropdown.Item as={Link} to="/login" className="text-dark">
						Iniciar Sesión
						</NavDropdown.Item>
						<NavDropdown.Item as={Link} to="/register" className="text-dark">
						Registrarse
						</NavDropdown.Item>
					</NavDropdown>
					<Nav as={Link} to="/favorites" className="text-secondary"><i href="" className="fi fi-rs-heart m-2 fs-3"></i></Nav>
				</Navbar.Collapse>
				
			</Container>
		</Navbar>
	);
};

export {NavbarProject};