import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Dashboard, Auth, Project } from "@/layouts";
import { useEffect, useState } from "react";
import { FormatDate } from "./util/utils";
import { Demo } from "./demo"

function App() {

  const navigate = useNavigate();
  const [ role,setRole ] = useState(sessionStorage.getItem('role'));

  useEffect(() => {
    if(role=="manager"){
      fetch("http://localhost:3000/getmaterialrequests",{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
      .then(data => {
        console.log(data);
        if(data.length > 0){
          data.map(data => {  
            if ('Notification' in window) {
              Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                const notification = new Notification('Material Request', {
                  body: `Materials Requested from ${data.project_id} by ${FormatDate(data.requestedat)}`,
                  icon: '/img/logo.png',
                  requireInteraction: true,
                  tag: data.request_id
                });
                notification.addEventListener('click', () => {
                  navigate(`${data.project_id}/project/material-request`)
                });
              }
            });
          }
          })
        }
      })
    }
  },[])

  return (
    <Routes>
        <Route path="/demo" element={<Demo />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/:id/project/*" element={<Project />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  );
}

export default App;
