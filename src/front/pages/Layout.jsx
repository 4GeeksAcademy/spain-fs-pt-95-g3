import { Outlet } from "react-router-dom/dist";
import ScrollToTop from "../components/ScrollToTop";
import { NavbarProject } from "../components/Navbar";
import { BackgroundImage } from "../components/BackgroundImage";

export const Layout = () => {
  return (
    <ScrollToTop>
      <NavbarProject />
      <BackgroundImage />
      <Outlet />
    </ScrollToTop>
  );
};