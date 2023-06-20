import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import { Link } from "react-router-dom"
import { FormatDate, doFilter } from "../../../util/utils";
import { useSearch } from "../../../context/searchContext";
import { Lottie } from "../../../widgets/lottie";
import animationData from "../../../widgets/docs.json";

export function Projects() {

    const { searchQuery } = useSearch();

    const [ filterData, setFilterData ] = useState([])
    const [ data, setData ] = useState([]);
    const [ head, setHead ] = useState(["Project id", "Project name", "Client Details", "Site Location", "Status", "Starting Date", "Pending Amount", "Edit"]);
    
    const calculateCompletionStatus = (start,end) => {
      const startAt = new Date(start);
      const endAt = new Date(end);
      const totalMilliseconds = endAt - startAt;
      const totalDays = totalMilliseconds / (1000 * 60 * 60 * 24);
      const percent = 100/totalDays;
      if(new Date(Date.now())>endAt) return 100
      const remainingMs = endAt - (new Date())
      const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
      const status = (totalDays-remainingDays)*percent
      return Math.floor(status);
    }

    useEffect(()=>{
      setFilterData(doFilter(data,searchQuery))
    },[searchQuery])

    useEffect(() => {
        document.title = "Projects | Manager Dashboard";
        const endpoint = window.location.href.split("/").pop()
        if(sessionStorage.getItem('role') === "supervisor"){
          fetch("http://localhost:3000/getsupervisorprojects", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: sessionStorage.getItem('name') })
          }).then((res) => res.json()).then((data) => {
            setData(data)
            setFilterData(data)
            data.map((e,key) => {
              const status = calculateCompletionStatus(e.startat,e.endat)
            e.completionStatus = status
          })
          console.log(data);
          })
        }
        else{
          if(endpoint === "finished"){
            fetch("http://localhost:3000/getprojectdetails", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ status: "completed" })
            }).then((res) => res.json()).then((data) => {
              setData(data)
              setFilterData(data)
              data.map((e,key) => {
                const status = calculateCompletionStatus(e.startat,e.endat)
              e.completionStatus = status
            })
            console.log(data);
            })
          }
          else{
            fetch("http://localhost:3000/getprojectdetails", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ status: "current" })
            }).then((res) => res.json()).then((data) => {
              setData(data)
              setFilterData(data)
              data.map((e,key) => {
                const status = calculateCompletionStatus(e.startat,e.endat)
                e.completionStatus = status
              })
              console.log(data);
            })
          }
        }
    },[window.location.href])

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Projects Table
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {head.map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filterData.map(
                  ({project_id, projectname, email, phone, completionStatus, clientname, location, status, startat, endat, estimation_budget, client_paid}, key) => {
                    const className = `py-3 px-5 ${
                      key === filterData.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;
                    return (
                      <tr key={project_id}>
                        <td className={className}>
                            <Typography>{project_id}</Typography>
                        </td>
                        <td className={`${className} cursor-pointer`}>
                          <Link to={`/${project_id}/project/home`}> 
                            <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold text-pink-200"
                            >
                            {projectname}
                            </Typography>
                          </Link>
                        </td>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                              >
                                {clientname}
                              </Typography>
                              <Typography className="text-xs font-normal text-blue-gray-500">
                                {email}
                              </Typography>
                              <Typography className="text-xs font-normal text-blue-gray-500">
                                {phone}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {location}
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="w-10/12">
                          <Typography
                            variant="small"
                            className="mb-1 block text-xs font-medium text-blue-gray-600"
                          >
                            {completionStatus}%
                          </Typography>
                          <Progress
                            value={completionStatus}
                            variant="gradient"
                            color={completionStatus === 100 ? "green" : "blue"}
                            className="h-1"
                          />
                          <Chip
                            variant="gradient"
                            color={status=="current" ? "green" : "blue-gray"}
                            value={status=="current" ? "Running" : "Finished"}
                            className="py-0.5 px-2 text-[11px] font-medium mt-2"
                          />
                        </div>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {FormatDate(startat)}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            ₹{estimation_budget-client_paid}/-
                          </Typography>
                        </td>
                        <td className={className}>
                          <Link to={`/dashboard/edit/${project_id}`}>
                          <Typography
                            as="a"
                            href="#"
                            className="text-xs font-semibold text-blue-gray-600"
                            >
                            Edit
                          </Typography>
                          </Link>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
            {
              filterData.length==0 
              && <div className="flex justify-center items-center">
                  <Lottie animationData={animationData}/>
                </div>
            }
          </CardBody>
        </Card>
    </div>
    );
}
