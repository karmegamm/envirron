import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import '../../../public/css/home.css'
import { UserGroupIcon,ShieldExclamationIcon,ShieldCheckIcon,CalendarDaysIcon} from "@heroicons/react/24/solid";
import { InfoCard } from '../../widgets/cards/infocard';

function get(data){
  return sessionStorage.getItem(data);
}

export function Home() {

  const navigate = useNavigate()
  let [qt,setQt]=useState({quote:'Because it\'s about motivating the doers Because I\'m here to follow my dreams and inspire others.',author:'raja'})
  useEffect(() => {
    if(!sessionStorage.getItem("role"))
      navigate("/auth/sign-in")
    async function fetchData(){
        await fetch("https://api.api-ninjas.com/v1/quotes?category=success",{
        method:'GET',  
        headers:{
          "Content-Type": "application/json",
          'X-Api-Key': '96aK3Q1bTjY39u13/d85Og==IXLWNC41oMS5ixfM'
          }
        })
        .then(response => response.json())
        .then(data => {
           setQt(data[0])
          // console.log(data[0]);
        })
        .catch(error => {
          console.log("Error fetching quote:", error);
        });
      }
    // fetchData();
  },[])
 

  return (
    <div className="">
      <section className={`flex flex-col-reverse md:flex-row justify-evenly items-center ${get('role')=='admin'?'md:-mt-7':'md:mt-1'}  `}>  
        <Card color="transparent" shadow={false} className="md:w-[60%]">
          <CardBody>
            <Typography variant="h5" color="teal" className="mb-2">
              <span className="welcome text-[35px] text-gray-800 ">Welcome back,</span>
              <span className="name text-[35px] ml-4">{get('name')}</span>
              <span className='welcome text-[35px] ml-2 text-gray-800' >!</span>
            </Typography>
            <Typography variant="h6" color="black" className="mb-2 font-extralight">
              Today Quote 
            </Typography>
            <Typography className= 'mb-2 border-l-2 border-brown-500 pl-5'>
              {qt.quote}
            </Typography>
            <Typography className='name'>
              - <span className="name text-blue-gray-700">{qt.author}</span> 
            </Typography>
          </CardBody>
        </Card>
        <img src={`/img/${get('role')}.svg`} alt="svg" className={`h-72 w-[95%] md:w-[40%] md:-translate-x-4`}/>
      </section>
      {get('role')=='admin'&&<Admin/>}
      {get('role')=='manager'&&<Manager/>}
      {get('role')=='supervisor'&&<Supervisor/>}
      {get('role')=='planner'&&<Planner/>}
    </div>
  );
}


function Admin(){
  const [data,setData] = React.useState({})

  useEffect(()=>{
    async function fetchdata(){
      fetch('http://localhost:3000/getadmindashboarddata').then(res=>res.json())
      .then(data=>{
      setData(data)}).catch(e=>log(e))
    }
    fetchdata();
  },[])

return <section>
            <div className="flex flex-col md:flex-row gap-4 justify-start mt-1">     
                  <InfoCard head={"Employees"} data={data.employee} className={" md:w-1/2  "} Element={<UserGroupIcon className='text-blue-gray-500 w-12 h-11' />} bodyclass={'flex justify-center gap-5 items-center'}/>
                  <InfoCard head={"Contractors"} data={data?.contractors} className={" md:w-1/2 "} Element={<UserGroupIcon className='text-blue-gray-500 w-12 h-11' />} bodyclass={'flex justify-center gap-5 items-center '}/>
            </div>
            <div className="flex flex-col md:flex-row gap-4 justify-between mt-3">     
                  <InfoCard head={"Current Projects "} data={data?.current} className={"md:w-1/2 "} Element={<ShieldExclamationIcon  className='text-teal-700 w-12 h-11' />}  bodyclass={'flex justify-center gap-5 items-center'}/>
                  <InfoCard head={"Finished Projects"} data={data?.finished} className={"md:w-1/2"} Element={<ShieldCheckIcon className='text-green-700 w-12 h-11' />} bodyclass={'flex justify-center gap-5 items-center'}/>
            </div>
        </section>
}

function Supervisor(){
  const [data,setData] = React.useState({})

  useEffect(()=>{
    async function fetchdata(){
      fetch(`http://localhost:3000/getsupervisordashboarddata?supervisor=${get('name')}`).then(res=>res.json())
      .then(data=>{
      setData(data)}).catch(e=>log(e))
    }
    fetchdata();
  },[])
   
  function Calc(date){
    date = new Date(date);
    let starttime = date.getTime();
    let endtime =new Date().getTime()
    let diff = endtime-starttime;

    let days =Math.floor(diff/(1000*60*60*24));
    return days ;

  }

return <section>
          <div className="flex flex-col md:flex-row gap-4 justify-start md:my-10">     
                <InfoCard head={"Contractors"} data={data?.contractor} className={" md:w-1/2 "} Element={<UserGroupIcon className='text-[#42b3d2] w-12 h-11' />} bodyclass={'flex justify-center gap-5 items-center '}/> 
                <InfoCard head={"Days of journy"} data={Calc(data?.startat)+' - days'} className={" md:w-1/2 "} Element={<CalendarDaysIcon className='text-[#42b3d2] w-12 h-11' />} bodyclass={'flex justify-center gap-5 items-center '}/> 
          </div>
      </section>
}

function Manager(){
  const [data,setData] = React.useState({})

  useEffect(()=>{
    async function fetchdata(){
      fetch('http://localhost:3000/getadmindashboarddata').then(res=>res.json())
      .then(data=>{
      setData(data)}).catch(e=>log(e))
    }
    fetchdata();
  },[])

return <section>
           <section>
        <div className="flex flex-col md:flex-row gap-4 justify-start md:my-10">     
              <InfoCard head={"Contractors"} data={data?.contractors} className={" md:w-1/2 "} Element={<UserGroupIcon className='text-blue-gray-500 w-12 h-11' />} bodyclass={'flex justify-center gap-5 items-center '}/> 
              <InfoCard head={"Current Projects "} data={data?.current} className={"md:w-1/2 "} Element={<ShieldExclamationIcon  className='text-teal-700 w-12 h-11' />}  bodyclass={'flex justify-center gap-5 items-center'}/>
              <InfoCard head={"Finished Projects"} data={data?.finished} className={"md:w-1/2"} Element={<ShieldCheckIcon className='text-green-700 w-12 h-11' />} bodyclass={'flex justify-center gap-5 items-center'}/>
        </div>
      </section>
        </section>
}

function Planner(){
  const [data,setData] = React.useState({})

  useEffect(()=>{
    async function fetchdata(){
      fetch('http://localhost:3000/getadmindashboarddata').then(res=>res.json())
      .then(data=>{
      setData(data)}).catch(e=>log(e))
    }
    fetchdata();
  },[])

return <section>
        <div className="flex flex-col md:flex-row gap-4 justify-start md:my-10">     
          <InfoCard head={"Current Projects "}  data={data?.current} className={"md:w-1/2 "} Element={<ShieldExclamationIcon  className='text-teal-700 w-12 h-11' />}  bodyclass={'flex justify-center gap-5 items-center'}/>
          <InfoCard head={"Finished Projects"} data={data?.finished} className={"md:w-1/2"} Element={<ShieldCheckIcon className='text-green-700 w-12 h-11' />} bodyclass={'flex justify-center gap-5 items-center'}/>
        </div>
        </section>
}

export default Home;