import { Routes, Route } from "react-router-dom";
import {
  ChartPieIcon,
  UserIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { Navbar, Footer } from "@/widgets/layout";
import routes from "@/routes";
import { SignIn, SignUp } from "@/pages/auth";


export function Auth() {
  const navbarRoutes = [
    {
      name: "Dashboard",
      path: "/dashboard/home",
      icon: ChartPieIcon,
    }
  ];

  return (
    <div className="relative min-h-screen w-full">
      <div className="container relative z-40 mx-auto p-4">
        <Navbar routes={navbarRoutes} />
      </div>
      <Routes>
        <Route exact path={"/sign-in"} element={<SignIn/>} />
      </Routes>
      <div className="container absolute bottom-2 md:bottom-8 left-2/4 z-10 mx-auto -translate-x-2/4 text-white">
        <Footer />
      </div>
    </div>
  );
}

Auth.displayName = "/src/layout/Auth.jsx";

export default Auth;
