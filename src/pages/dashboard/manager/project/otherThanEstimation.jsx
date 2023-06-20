import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { FormatDate, doFilter } from "../../../../util/utils";
import { useParams } from "react-router-dom";
import { useSearch } from "../../../../context/searchContext";

export function OtherThanEstimation() {

    const { id } = useParams();
    const [ data, setData ] = useState([])
    const [ filterData, setFilterData ] = useState([])
    const {searchQuery} = useSearch();

    useEffect(()=>{
      setFilterData(doFilter(data,searchQuery))
    },[searchQuery])

    useEffect(() => {
        fetch("http://localhost:3000/getnmrbyid",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({"project_id":id})
            }).then(res => res.json()).then((data)=>{
                setFilterData(data)
                setData(data)
                console.log(data);
        })
    },[])

    return ( 
        <>
        <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              NMR Works
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Sl No","Date","NMR Description","Worker Type","Numbers"].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-center"
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
                  ({date,particular,division,nos}, key) => {
                    const className = `py-3 px-5 ${
                      key === filterData.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;
                    return (
                      <tr key={key}>
                        <td className={className}>
                            <Typography className="text-center">{key+1}</Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600 text-center">
                            {FormatDate(date)}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-600 text-center">
                            {particular}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600 text-center">
                            {division}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-center text-red-600">
                            {nos}
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