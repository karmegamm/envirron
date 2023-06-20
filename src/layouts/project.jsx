import { Routes, Route,useNavigate } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import { projectRoutes } from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import { useEffect, useState } from "react";

export function Project() {
  const routes = projectRoutes;
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const navigate = useNavigate()
  const [userData,setUserData]=useState([]);

  useEffect(() => {
    if(!sessionStorage.getItem("role"))
      navigate("/auth/sign-in")
    setUserData(routes[sessionStorage.getItem('role')]);
  },[])

  return (
    <div className="min-h-screen bg-blue-gray-50">
      <Sidenav
        routes={userData}
        brandImg={
          sidenavType === "dark" ? "/img/logo.png" : "/img/logo.png"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>
        <Routes>  
          {userData.map(({ path, element }) => (
            <Route exact path={path} element={element} />
          ))}  
        </Routes>
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Project;
