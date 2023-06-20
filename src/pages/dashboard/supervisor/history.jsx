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
import { FormatDate } from "../../../util/utils";

export function History() {

    const [ data, setData ] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/projectfinishedbysupervisor",{
            method : "POST",
            headers : {
                "content-Type" : "application/json"
            },
            body: JSON.stringify({name: sessionStorage.getItem('name')})
        }).then(res => {
            return res.json()
        }).then(data => {
            console.log(data);
            setData(data)
        }).catch(err => console.log(err))
    },[])
 
    return (
        <>
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
                  {["Project id", "Project name", "Client Details", "Site Location", "Status", "Starting Date", "Ending Date"].map((el) => (
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
                {data.map(
                  ({project_id, projectname, email, phone, completionStatus, clientname, location, status, startat, endat}, key) => {
                    const className = `py-3 px-5 ${
                      key === data.length - 1
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
                          <Chip
                            variant="gradient"
                            color={status=="current" ? "yellow" : "green"}
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
                            {FormatDate(endat)}
                          </Typography>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
    </div>
        </>
     );
}