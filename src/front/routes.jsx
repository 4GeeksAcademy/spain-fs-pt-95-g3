// Import necessary components and functions from react-router-dom.


import {
    createBrowserRouter,
    createRoutesFromElements,
    Route, Outlet
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { Register } from "./pages/Register";
import { Favorites } from "./pages/Favorites";
import { Recipes } from "./pages/Recipes";
import { Planning } from "./pages/Planning";
import { DetallReceta } from "./pages/DetallReceta";
import { PrivateRoute } from "./pages/PrivateRoute";
import { CreateRecipe } from "./pages/CreateRecipe";

export const router = createBrowserRouter(
    createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

      // Root Route: All navigation will start from here.
      <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/recipes" element={<Recipes />} />
  <Route path="/receta/:id" element={<DetallReceta />} />
  <Route path="/create-recipe" element={<CreateRecipe />} />

  
  <Route element={
      <PrivateRoute>
        <Outlet />
      </PrivateRoute>
    }
  >
    <Route path="/profile" element={<Profile />} />
    <Route path="/favorites" element={<Favorites />} />
    <Route path="/planning" element={<Planning />} />
  </Route>
</Route>
    )
);