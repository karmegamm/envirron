import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Radio,
  Button,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { FolderPlusIcon, UserGroupIcon, XMarkIcon, LockClosedIcon, LockOpenIcon,UserPlusIcon} from "@heroicons/react/24/solid";
import { RocketLaunchIcon,PaperAirplaneIcon,TrashIcon} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import ReactLoading from "react-loading"
import signup from '../../../public/img/signup.svg'
import { useSearch } from "../../context/searchContext";
import {doFilter} from '../../util/utils'
import LottieAnimation from '../../widgets/charts/LottieAnimation';
import animationData from '../../data/business-team.json'
export function SignUp() {

  const [ details,setDetails ] = useState({});
  const [ isloading, setIsLoading ] = useState(false)
  const [ tableOpen, setTableOpen ] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const isadmin = sessionStorage.getItem("role")
    if(isadmin!="admin")
      navigate("/auth/sign-in")
  },[])

  const handleChange = (e) =>{
    setDetails({
      ...details,[e.target.name] : e.target.value
    })
  }

  const handletableopen =()=>setTableOpen(prev=>!prev);

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const { name, email, password, designation,phone } = details
    if(name == "" || name == undefined)
      Swal.fire("Please Enter Employee Name!")
    else if(email == "" || email == undefined || !emailRegex.test(email))
    Swal.fire("Please Enter Valid Email!")
    else if(password == "" || password == undefined || password.length<8)
      Swal.fire("Password must be 8 characters")
    else if(phone == "" || phone == undefined || phone.length!=10)
      Swal.fire("Enter a correct phone number")
    else if(designation == "" || designation == undefined)
      Swal.fire("Please select anyone of the Role for Your Employee")
    else{
      console.log(details)
      setIsLoading(true)
      fetch("http://localhost:3000/registeremployee",{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(details)
      }).then(res => res.json())
      .then(data => {
        Swal.fire(data.msg)
        document.querySelectorAll("input").forEach(input => input.value = "");
        document.querySelectorAll('input[type="radio"]').forEach((input) => {
          input.checked = false;
        });
        setDetails({})
        setIsLoading(false)
      }).catch(err => console.log(err))
    }
  }

  return (
    <div className=" flex md:flex-row flex-col justify-around items-center my-8 ">
        <Card className="w-[98%] md:w-[48%] ">
            <CardHeader
            color="blue"
            floated={true}
            shadow={true}
            className="flex justify-center items-center gap-3  py-8 px-4 text-center"
          >
            <UserPlusIcon color="white" strokeWidth={2} className="h-9 w-9"/>
            <Typography variant="h3" color="white" className='text-[20px] md:text-[35px]'>
              REGISTRATION
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Input label="Name" size="lg" variant="standard" name="name" onChange={handleChange} className="" id="in" />
            <Input type="email" label="Email" variant="standard" size="lg" name="email" onChange={handleChange} id="in" />
            <Input type="password" label="Password" variant="standard" size="lg" name="password" onChange={handleChange} />
            <Input type="text" label="Phone number" variant="standard" size="lg" name="phone" onChange={handleChange} />
            <div className="flex justify-around items-center text-[17px] ">
              <Radio name="designation" label="Manager" value="manager" className="" onChange={handleChange} />
              <Radio name="designation" label="Plan Designer" value="panner" onChange={handleChange} />
              <Radio name="designation" label="Super Visor" value="supervisor" onChange={handleChange} />
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            {isloading?  <ReactLoading type={"spinningBubbles"} color={"lightblue"} height={50} width={50} className="ml-36"></ReactLoading>
            :<Button variant="gradient" className="flex justify-center items-center" fullWidth onClick={handleSubmit}>
              <PaperAirplaneIcon className="mr-2 h-5 w-5" /> 
            <span>Register</span>
            </Button>}
          </CardFooter>
        </Card>
        <div className="bg-transparent flex flex-col  justify-center items-center md:-mt-16">
          <img src={signup} alt="dd" className="h-[400px] w-[90%]" />
          <Button variant="gradient" className="flex" onClick={handletableopen}>
            <RocketLaunchIcon className="mr-2 h-5 w-5" /> 
            <span>Show All Employees</span>
          </Button>
        </div>
          {tableOpen&&<Employees open={tableOpen} handleOpen={handletableopen} />}
    </div>
  );
}



export default SignUp;

export function Employees({open,handleOpen}){

  const [employee,setEmployee] = useState([]);
  const [ showPassword, setShowPassword ] = useState([])
  const [ click, setClick ] = useState(false)
  const [ filterData, setFilterData ] = useState([])
  const {setSearchQuery,searchQuery}=useSearch();

  
  useEffect(()=>{
    function fetchdata(){
      fetch('http://localhost:3000/getallemployees', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
      })
      .then(res=>res.json())
      .then(data=>{
        setEmployee(data)
        setFilterData(data)
        setShowPassword(new Array(data.length).fill(false));
      })
    }
    fetchdata();
  },[click])

  useEffect(()=>{
    setFilterData(doFilter(employee,searchQuery))
  },[searchQuery])

  
  const togglePasswordVisibility = (index) => {
    setShowPassword((prevPasswords) => {
      const newPasswords = [...prevPasswords];
      newPasswords[index] = !newPasswords[index];
      return newPasswords;
    });
  };

  function handleDelete(email){
    if(prompt('enter password ')==='admin123'){
      fetch("http://localhost:3000/deletetablebyfield",{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          table:'users',
          field:'email',
          id:email
        })
        }).then(res=>res.json()).then(({affectedRows})=>{
          if(affectedRows==1){
            setClick(pre=>!pre)
          }
        })
        .catch(e=>console.log(e)) 
    }
  }
  
  function handleSearch(e){
    setSearchQuery(e.target.value.toLowerCase())
  }


  return (
    <div className='bg-opacity-70 z-50 inset-0 fixed w-screen h-auto bg-black' >
        <Card color="white" shadow={true} className="p-2 px-3 md:p-5 mx-auto absolute left-[1.5%] md:left-[10%] w-[94%] h-[90%] top-[5%] opacity-100 z-50 md:w-[80%]">
          <div className="absolute right-2 top-2 flex gap-10 md:gap-0 md:justify-end items-center  ">
            <div className="md:w-56">
              <Input label="Type here" onChange={handleSearch}/>
            </div>
            <XMarkIcon strokeWidth={2} color="blue-gray" className=" h-7 w-7 -translate-x-0.5 pl-1 p-1 rounded-2xl cursor-pointer"  onClick={handleOpen}/>
          </div>
          <CardHeader variant="gradient" color="blue-gray" className="my-12 md:my-9 md:p-6 p-5">
            <Typography variant="h3" className='flex justify-center md:gap-5 gap-3 items-center text-[25px]' color="white">
              <UserGroupIcon className="h-7 w-7" /> Employees
            </Typography>
          </CardHeader> 
          <CardBody className="px-0 pt-0 pb-2 h-full overflow-x-auto overflow-y-scroll scrollbar scrollbar-thumb-blue-gray-700 scrollbar-track-blue-gray-100">
            <table className="w-full">
              <thead>
                <tr>
                  {["Employee Name","Email Address","Mobile Number","Password","Role","delete"].map((el) => (
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
                {filterData?.map(
                  ({email,password,name,phone,designation}, key) => {
                      const className = `py-3 px-5 ${
                      key === employee.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;
                    return (
                      <tr key={key}>
                        <td className={className}>
                          <Typography className=" text-[17px] font-semibold text-blue-gray-700">
                            {name.toUpperCase()}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-[19px] font-semibold text-blue-gray-700">
                            {email}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-[19px] font-semibold text-blue-gray-600">
                           {phone}
                          </Typography>
                        </td>
                        <td className={className+" flex justify-between"}>
                          <Typography className="text-[19px]  font-bold text-blue-gray-600">
                            {showPassword[key] ? password : '•'.repeat(password.length)}
                          </Typography>
                            {showPassword[key] 
                             ? <LockOpenIcon stroke="2" className="w-5 h-5" onClick={() => togglePasswordVisibility(key)}/>
                             : <LockClosedIcon stroke="2" className="w-5 h-5" onClick={() => togglePasswordVisibility(key)}/>}
                        </td>
                        <td className={className}>
                          <Typography className="text-[17px]  font-semibold text-blue-gray-600">
                           {designation.toUpperCase()}
                          </Typography>
                        </td>
                        <td className={className}>
                          <IconButton variant="text" className="ml-2" onClick={()=>handleDelete(email)}><TrashIcon color="red" className=" h-5 w-5" /> </IconButton>
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
