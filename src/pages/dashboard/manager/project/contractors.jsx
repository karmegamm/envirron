import React,{ useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import {XMarkIcon,ArrowUpOnSquareIcon,CurrencyRupeeIcon} from "@heroicons/react/24/solid";
import advance from '../../../../../public/img/advance.svg'
import { FormatDate, doFilter } from '../../../../util/utils'
import {
    Card,
    CardHeader,
    CardBody,
    Input,
    Button,
    Typography,
    Select,
    Option,
} from "@material-tailwind/react";
import { useSearch } from "../../../../context/searchContext";



export function Contractors() {

  const { id } = useParams();
  const [open,setOpen] = useState(false);
  const [tableOpen,setTableOpen] = useState(false);
  const [ data, setData ] = useState([]);
  const [ filterData, setFilterData ] = useState([]);
  const {searchQuery} = useSearch();

  useEffect(()=>{
    setFilterData(doFilter(data,searchQuery))
  },[searchQuery])

  
  useEffect(() => {
    fetch("http://localhost:3000/getworkerdetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({project_id : id}),
    }).then(res => res.json())
    .then(data => {
      console.log(data);
      setFilterData(data)
      setData(data)})
  },[])
  

  return ( 
      <>
        <div className=" my-6 ">
          <Card className="mt-10">
          <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Worker Details
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Sl No","Date","Work Type","Contractor Name","Division","Numbers"].map((el) => (
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
                  ({date,work_type,contractor,division,total_nos}, key) => {
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
                            {work_type}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-600 text-center">
                            {contractor}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600 text-center">
                            {division}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-center text-red-600">
                            {total_nos}
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

