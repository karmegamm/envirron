import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Typography,
  IconButton
} from "@material-tailwind/react";
import Swal  from "sweetalert2";
import { FormatDate,doFilter } from "../../../util/utils";
import ReactLoading from "react-loading";
import { useParams } from "react-router-dom";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { isProjectFinished } from "../../../util/utils";
import { useSearch } from "../../../context/searchContext";


export function NMRWorks() {

  const { id } = useParams()

    const [ isfinished, setIsFinished ] = useState(false)
    const [ isloading, setIsLoading ] = useState(false)
    const [ details, setDetails ] = useState({})  
    const [ clicked, setClicked ] = useState(false)
    const [ data, setData ] = useState([])
    const [ filterData, setFilterData ] = useState([])
    const {searchQuery} = useSearch();
    
    const handleChange = (e) => {
      setDetails({...details,
          [e.target.name]: e.target.value
      })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(details);
    }

    
    
    useEffect(() => {
      if(id){
        fetch("http://localhost:3000/getnmrbyid",{
          method: "POST",
          headers: {
              "Content-Type": "application/json"
              },
              body: JSON.stringify({"project_id":id})
          }).then(res => res.json()).then((data)=>{
              setData(data)
              console.log(data);
            })
            setIsFinished(isProjectFinished(id))
            console.log(isProjectFinished(id));
      }
      else{
        fetch("http://localhost:3000/supervisordata",{
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({name:sessionStorage.getItem('name')})
        }).then(res => res.json()).then((data)=>{
            setDetails({project_id:data[0].project_id})
            fetch("http://localhost:3000/getnmrbyid",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({"project_id":data[0].project_id})
            }).then(res => res.json()).then((data)=>{
                setData(data)
                setFilterData(data)
          })
        }) 
      }
    },[clicked])
   
    
    useEffect(()=>{
      setFilterData(doFilter(data,searchQuery))
    },[searchQuery])

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
                fetch("http://localhost:3000/deletetablebyfield",{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({"table":"nmr_works","field":"work_id","id":id})
                }).then(res => res.json()).then((data)=>{
                console.log(data);
                Swal.fire(
                    'Deleted!',
                    'Work has been deleted.',
                    'success'
                    )
                    setClicked(!clicked)
                })
            }
          })
    }

    const handleEdit = (work_id) => {
        const arr = data.filter((el) => el.work_id === work_id)
        console.log(arr);
        setDetails({"work_id":work_id,"description":arr[0].description,"amount":arr[0].amount})
    }

    return ( 
        <>
        <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card color="white" className="">
          <CardHeader variant="gradient" color="teal" className="mb-8 p-6">
            <Typography variant="h6" className='text-center' color="white">
              NMR Works
            </Typography>
          </CardHeader>
          <CardBody  className="overflow-x-auto px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto ">
              <thead>
                <tr>
                  {["Sl No","Date","NMR Description","Worker Type","Numbers"].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-100 py-3 px-5 text-center"
                    >
                      <Typography
                        variant="small"
                        className="text-[16px] font-light uppercase text-blue-gray-900"
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
                      key === data.length - 1
                        ? ""
                        : "border-b border-blue-gray-100"
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
)}