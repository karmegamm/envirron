import React,{ useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Select,
    Option, 
    Input,
    Button,
    Typography,
    CardFooter
} from "@material-tailwind/react";
import { FormatDate, getLastSaturday } from "../../../util/utils"
import { BanknotesIcon,CloudArrowUpIcon ,XMarkIcon,AdjustmentsVerticalIcon,CurrencyRupeeIcon,ArrowUpOnSquareIcon } from "@heroicons/react/24/solid"
import Swal from "sweetalert2"
import { useParams } from "react-router-dom";
import advance from '../../../../public/img/advance.svg'


export function Payment() {

    const [ data, setData ] = useState([]);
    const [ modelOpen,setModelOpen ] = useState(false);
    const [ salary, setSalary ] = useState([])
    const [open,setOpen] = useState(false);
    const [tableOpen,setTableOpen] = useState(false);

    const handleOpen = () => {
      setModelOpen(!modelOpen);
    };

    useEffect(() => {
      fetch("http://localhost:3000/getalldivisions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      }).then(res => res.json())
      .then(data => {
        setSalary(data);
      }).catch(err => console.log(err))
    },[modelOpen])

    useEffect(() => {
        document.title = "Contractors | Payment";
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        fetch("http://localhost:3000/getworkerdetailsbyweek", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({date: `${year}-${month}-${day}`})
        }).then((res) => res.json())
        .then((data) => {
          setData(data);
        }).catch(err => console.log(err))    
    }, [modelOpen]);

    const getPaymentDetails = () => {
      fetch("http://localhost:3000/getworkerdetailsbyweek", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({date: new Date("2023-06-17")})
      }).then((res) => res.json())
      .then((data) => {
          setData(data);
      }).catch(err => console.log(err))
    }
    
    const handleopen =()=>setOpen(prev=>!prev);
    const handletableopen =()=>setTableOpen(prev=>!prev);

    return ( 
        <>
        <div className='flex md:gap-4
         gap-1 justify-end px-5 mt-2'>
            <Button size="md" color="lime" variant="gradient" className="flex justify-center items-center" onClick={()=>setModelOpen(true)} >
              <BanknotesIcon className="mr-2 h-5 w-5" /> 
              <span className="text-[14px]">Update Salary</span>
            </Button>
            <Button size="md" color="lime" variant="gradient" className="flex justify-center items-center"  onClick={handleopen}>
            <CloudArrowUpIcon className="mr-2 h-5 w-5" /> 
            <span className="text-[14px]">upload advance</span>
              </Button>
            {open&&<Advance open={open} handleOpen={handleopen}/>}
            <Button  size="md" color="lime" variant="gradient" className="flex justify-center items-center"  onClick={handletableopen}>
            <AdjustmentsVerticalIcon className="mr-2 h-5 w-5" /> 
            <span className="text-[14px]">view Advance</span></Button>
            {tableOpen&&<AdvanceTable open={tableOpen} handleOpen={handletableopen} />}
          </div>
        {modelOpen&&<Salary  open={modelOpen} handleOpen={handleOpen}/>}
        <div className="mt-10 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Payment Details
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Sl No","Date","Contractor Name","Division","Numbers","Value"].map((el) => (
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
                {data.map(
                  ({date,contractor_name,division,total_nos}, key) => {
                    const className = `py-3 px-5 ${
                      key === data.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;
                    let value = 0;
                    salary.map(e => {
                      if(e.division === division)
                        value = e.salary
                      else{
                        const divs = e.division.split(",");
                        const sals = e.salary.split(",");
                        divs.map((div,index) => div === division ? value = sals[index] : null )
                      }
                      if(value == null||value == undefined)
                      value = "Slary Not Provided Yet!"
                    });
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
                            {contractor_name}
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
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-center text-red-600">
                            {(total_nos*value)}
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

export default Payment;

function Salary({open,handleOpen}){

  const [ values, setValues ] = useState({})
  const [ divisions, setDivisions ] = useState([])

  useEffect(() => {
    document.title = "Contractors | Update Salary";
    fetch("http://localhost:3000/getalldivisions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(res => res.json())
    .then(data => {
      console.log(data);
      setDivisions(data);
    }).catch(err => console.log(err))
  },[])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  }

  async function  handlesubmit() {
    divisions.map(({division,salary}) => {
      if(division.includes(values.division+',')||division.includes(','+values.division)){
        const arr = division.split(',');
        const sal = salary.split(',');
        arr.map((e,index)=>{
          if(e===values.division)
            sal[index]=values.salary;
        })
        const newdiv = arr.join(',');
        const newsal = sal.join(',');
        console.log(newdiv,newsal);
        updateSalary(newdiv,newsal);
      }
      else
      updateSalary(values.division,values.salary);
    })
  }

  const updateSalary = (div,sal) => {
    fetch("http://localhost:3000/updatesalary",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({division: div, salary: sal})
    }).then(res => res.json())
    .then(data => {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Salary Updated Successfully',
      })
    }).catch(err => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      })
    })
    handleOpen();
  }

  return (
    <div className='bg-opacity-80 z-50  inset-0 fixed w-screen h-auto bg-black' >
        <Card className="mx-aut0 absolute left-3 w-[94%] top-[25%] opacity-100 md:left-[39%] md:top-[30%] z-50 md:w-96"
        >
          <CardHeader
            variant="gradient"
            color="blue"
            className="relative py-5"
          >
            <Typography variant="h5" className={'text-center'} color="white">
              Update Worker Salary
            </Typography>
            <div  className=" text-white absolute top-0 right-0 rounded-bl-xl bg-red-600">
              <button className="translate-x-2.5 translate-y-1" 
              onClick={ handleOpen}
              >
                <XMarkIcon strokeWidth={2} className="h-7 w-7 -translate-x-3 pl-1"/>
              </button>
            </div>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
          <select className="select select-bordered w-full max-w-xs bg-gray-200" name="division" onChange={handleChange}>
            <option disabled selected>Select Division</option>
            {divisions.map(({division}) => {
              if(division.includes(','))
                return division.split(',').map((el) => <option value={el}>{el}</option>)
              else
                return <option value={division}>{division}</option>
            })}
          </select>
            <Input label="Salary" name="salary" size="lg" onChange={handleChange}/>
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" onClick={handlesubmit}  fullWidth>
              Update
            </Button>
          </CardFooter>
        </Card>
    </div >
  );
}


export function AdvanceTable({open,handleOpen}){
  const { id } = useParams();
  const [advanceData,setAdvanceData] = useState([]);
  
  useEffect(()=>{
    function fetchdata(){
      fetch('http://localhost:3000/getadvancedetails')
      .then(res=>res.json())
      .then(data=>{
        setAdvanceData(data)
      }).catch(e=>console.log(e))
    }
    fetchdata();
  },[])

  return (
    <div className='bg-opacity-70 z-50  inset-0 fixed w-screen h-auto bg-black' >
        <Card color="white" shadow={true} className=" p-2 px-3 md:p-5 mx-auto absolute left-3 w-[94%] top-[6%] opacity-100 md:left-[26%] md:top-[16%] z-50 md:w-[50%]">
          <div className="absolute right-2 top-2 rounded-lg ">
            <XMarkIcon strokeWidth={2} color="blue-gray" className=" h-7 w-7 -translate-x-0.5 pl-1"  onClick={handleOpen}/>
          </div>
          <CardHeader variant="gradient" color="blue-gray" className="my-7 md:p-6 p-5">
            <Typography variant="h3" className='flex justify-center md:gap-5 gap-3 items-center text-[25px]' color="white">
              <CurrencyRupeeIcon strokeWidth={2} color="blue-gray" className=" h-9 w-9 -translate-x-0.5 "/>Advance Details
            </Typography>
          </CardHeader> 
          <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {['date','contractor name','amount'].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[17px] font-light uppercase text-black"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {advanceData?.map(
                  ({advance_date,contractor_name,advance}, key) => {
                      const className = `py-3 px-5 ${
                      key === advanceData.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;
                    return (
                      <tr key={key}>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {FormatDate(advance_date)}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs  font-semibold text-blue-gray-600">
                            {contractor_name}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                           ₹ {advance} /-
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
)}

export function Advance({open,handleOpen}){
  const { id } = useParams();
  const [details,setDetails]=useState({})
  const [contractors,setContractors]=useState([])

  useEffect(() => {
    function fetchData(){
      fetch('http://localhost:3000/getcontractors')
      .then(res=>res.json())
      .then(data=>setContractors(data))
    }
    fetchData()
  },[])

  
  async function handleSubmit(){
    if(details.amount&&details.contractor_id&&details.date){
      await fetch("http://localhost:3000/contractoradvanceupdate",{
        method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({...details})
      }).then(res => res.json()).then((data)=>{
          console.log(data)
          setDetails({contractor_id:undefined})
          alert('success')
          document.querySelectorAll(".custom").forEach(input=>input.value="");
      }).catch(e=>console.log(e))
    }else{
      alert('enter  all details')
    }
  }

  const handleChange =(e)=>{
    console.log(e);
    if(typeof(e)==='number'){
      setDetails({...details,contractor_id:e})
    }else{
      setDetails({...details,[e.target.name]:e.target.value})
    }
  }

  return (
    <div className='bg-opacity-70 z-50  inset-0 fixed w-screen h-auto bg-black' >
        <Card color="white" className=" p-5 md:px-10 mx-auto absolute left-3 w-[94%] top-[6%] opacity-100 md:left-[26%] md:top-[16%] z-50 md:w-[50%]">
          <div className="absolute right-2 top-2 rounded-lg ">
            <XMarkIcon strokeWidth={2} color="blue-gray" className=" h-7 w-7 -translate-x-0.5 pl-1"  onClick={handleOpen}/>
          </div>
          <div className="flex justify-around  items-center">
            <div>
            <Typography variant="h4" color="blue-gray" className='text-[28px]  md:text-[43px] text-center'>
              Contractor Advance
            </Typography>
            <Typography color="gray" className="mt-1 text-[12px] md:text-[20px] font-normal text-center">
              Enter Contractors Advance particulars.
            </Typography>
            </div>
            <img src={advance} className="h-16 w-16 md:h-20 md:w-20 translate-y-3 " alt="jc" />
          </div>
        <div className="mt-8 mb-2  max-w-screen-lg ">
          <div className="mb-4 flex flex-col gap-6">
            <div className="relative">
              <div className="absolute h-5 w-5 right-0 top-5 rounded-md bg-blue-gray-700"></div>
              <Input type="date" variant="standard" name='date' size="lg" label="date" onChange={handleChange} className="custom" />
            </div>
            <Select  variant="static" color="teal" 
              label="contractor name"  
              // selected={element=>{
              //   return details&&React.cloneElement(<Option >{details?.contractor_id}</Option>,{
              //       className:'list-none',
              //       value:details?.contractor_name
              //   })
              // }}
              onChange={handleChange}
            >
              {contractors?.map(({contractor_name,contractor_id},index)=><Option key={index} value={contractor_id} >{contractor_name}</Option>)}
            </Select>
            <Input type="number" name='amount' variant="standard" size="lg" label="amount" onChange={handleChange} className="custom"/>
          </div> 
          <Button className="mt-6 flex justify-center items-center gap-2"  color="blue-gray" onClick={handleSubmit} fullWidth>
            <ArrowUpOnSquareIcon strokeWidth={2} className="h-5 w-5 -translate-y-0.5"/>upload
          </Button>
        </div>
    </Card>
    </div >
  );
}
