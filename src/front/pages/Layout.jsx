import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { NavbarProject } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { Carrusel } from "../components/carrusel"

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    return (
        <ScrollToTop>
            <NavbarProject />
                <Outlet />
            <Carrusel />
        </ScrollToTop>
    )
}