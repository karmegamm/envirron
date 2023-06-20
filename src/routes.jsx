import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import { Home, ProjectInfo } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import { Projects, Payment } from "@/pages/dashboard/manager";
import { ProjectInit, NewProject } from "@/pages/dashboard/planner";
import { SiteDrawing, ExteriorDesign, InteriorDesign } from "@/pages/dashboard/planner/project";
import { Materials, History, Quotation, TodayWork, NMRWorks } from "@/pages/dashboard/supervisor";
import { GstBills, MaterialRequest, OtherThanEstimation, Contractors, UploadBill } from "@/pages/dashboard/manager/project";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = 
  {
    title: "project details",
    layout: "dashboard",
    admin: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Projects",
        path: "/projects",
        element: <ProjectInit />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Finished Projects",
        path: "/finished",
        element: <Projects />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Register New Employee",
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/new",
        element: <NewProject />,
      },
      {
        path: "/edit/:project_id",
        element: <NewProject />,
      },
    ],
    manager:[
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Projects",
        path: "/projects",
        element: <Projects />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Finished Projects",
        path: "/finished",
        element: <Projects />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Weekly Payments",
        path: "/payments",
        element: <Payment />,
      },
    ],
    planner:[
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Projects",
        path: "/projects",
        element: <ProjectInit />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Finished Projects",
        path: "/finished",
        element: <Projects />,
      },
      {
        path: "/new",
        element: <NewProject />,
      },
      {
        path: "/edit/:project_id",
        element: <NewProject />,
      },
    ],
    supervisor:[
        {
          icon: <HomeIcon {...icon} />,
          name: "dashboard",
          path: "/home",
          element: <Home />,
        },
        {
          icon: <HomeIcon {...icon} />,
          name: "Projects",
          path: "/projects",
          element: <Projects />,
        },
      ]
}
    
export default routes;
    
export const projectRoutes = {
  title: "project details",
  layout: "project",
  manager:[
  {
    layout: "project",
    icon: <HomeIcon {...icon} />,
    name: "dashboard",
    path: "/home",
    element: <ProjectInfo />,
  },
  {
    layout: "project",
    icon: <BellIcon {...icon} />,
    name: "Material Request",
    path: "/material-request",
    element: <MaterialRequest />,
  }, 
  {
    layout: "project",
    icon: <BellIcon {...icon} />,
    name: "NON GST Bills",
    path: "/non-gst-bills",
    element: <GstBills />,
  },
  {
    layout: "project",
    icon: <BellIcon {...icon} />,
    name: "GST Bills",
    path: "/gst-bills",
    element: <GstBills />,
  }, 
  {
    layout: "project",
    icon: <BellIcon {...icon} />,
    name: "Contractors",
    path: "/contractors",
    element: <Contractors />,
  }, 
  {
    layout: "project",
    icon: <BellIcon {...icon} />,
    name: "Other Than Estimation",
    path: "/otherthan-estimation",
    element: <OtherThanEstimation />,
  }, 
  {
    layout: "project",
    path: "/uploadbill/:bill_id",
    element: <UploadBill />,
  }, 
  {
    layout: "project",
    path: "/uploadbill",
    element: <UploadBill />,
  }, 
],
planner:[
  {
    layout: "project",
    icon: <HomeIcon {...icon} />,
    name: "dashboard",
    path: "/home",
    element: <ProjectInfo />,
  },
  {
    layout: "project",
    icon: <HomeIcon {...icon} />,
    name: "Site Drawing",
    path: "/site-drawing",
    element: <SiteDrawing />,
  },
],
admin:[
  {
    layout: "project",
    icon: <HomeIcon {...icon} />,
    name: "dashboard",
    path: "/home",
    element: <ProjectInfo />,
  },
  {
    layout: "project",
    icon: <HomeIcon {...icon} />,
    name: "Quotation",
    path: "/quotation",
    element: <Quotation />,
  },
  {
    layout: "project",
    icon: <BellIcon {...icon} />,
    name: "Material Request",
    path: "/material-request",
    element: <MaterialRequest />,
  }, 
  {
    layout: "project",
    icon: <BellIcon {...icon} />,
    name: "NON GST Bills",
    path: "/non-gst-bills",
    element: <GstBills />,
  },
  {
    layout: "project",
    icon: <BellIcon {...icon} />,
    name: "GST Bills",
    path: "/gst-bills",
    element: <GstBills />,
  }, 
  {
    layout: "project",
    icon: <BellIcon {...icon} />,
    name: "Contractors",
    path: "/contractors",
    element: <Contractors />,
  }, 
  {
    layout: "project",
    icon: <BellIcon {...icon} />,
    name: "Other Than Estimation",
    path: "/otherthan-estimation",
    element: <OtherThanEstimation />,
  }, 
  {
    layout: "project",
    path: "/uploadbill/:bill_id",
    element: <UploadBill />,
  }, 
  {
    layout: "project",
    path: "/uploadbill",
    element: <UploadBill />,
  },
  {
    layout: "project",
    icon: <HomeIcon {...icon} />,
    name: "Site Drawing",
    path: "/site-drawing",
    element: <SiteDrawing />,
  },
],
  supervisor:[
    {
      layout: "project",
      icon: <HomeIcon {...icon} />,
      name: "dashboard",
      path: "/home",
      element: <ProjectInfo />,
    },
    {
      layout: "project",
      icon: <BellIcon {...icon} />,
      name: "Materials",
      path: "/materials",
      element: <Materials />,
    },
    {
      layout: "project",
      icon: <BellIcon {...icon} />,
      name: "Quotation",
      path: "/quotation",
      element: <Quotation />,
    },
    {
      layout: "project",
      icon: <BellIcon {...icon} />,
      name: "Today's Work",
      path: "/today-work",
      element: <TodayWork />,
    },
    {
      layout: "project",
      icon: <BellIcon {...icon} />,
      name: "NMR Works",
      path: "/nmr-works",
      element: <NMRWorks />,
    },
  ]
}