import { Routes, Route,useNavigate } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import { HomeIcon, BellIcon } from "@heroicons/react/24/solid";
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import { useEffect, useState } from "react";
import { History } from "@/pages/dashboard/supervisor";
import { Home } from "@/pages/dashboard";
import { SearchProvider } from "../context/searchContext";
import NotFound from "../404";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const navigate = useNavigate()
  const [userData,setUserData]=useState([]);

  useEffect(() => {
    if(!sessionStorage.getItem("role"))
      navigate("/auth/sign-in")
    setUserData(routes[sessionStorage.getItem('role')])
  },[])

  return (
    <SearchProvider> 
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
            <Route exact key={path} path={path} element={element} />
            ))}  
            <Route exact  path={'/*'} element={<NotFound/>} />
        </Routes>
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  </SearchProvider>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
