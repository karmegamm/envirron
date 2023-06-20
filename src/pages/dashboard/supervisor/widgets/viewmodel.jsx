import {Card,CardHeader,CardBody,CardFooter,Input,Select,Option,Button,Typography,Tabs,TabsHeader,TabsBody,Tab,TabPanel,} from "@material-tailwind/react";
import {BuildingOffice2Icon,UserPlusIcon,TruckIcon,XMarkIcon,DocumentDuplicateIcon} from "@heroicons/react/24/solid";
import React,{useEffect,useState} from "react";
import {FormatDate,doFilter} from '../../../../util/utils'
import { useSearch } from "../../../../context/searchContext";


export function ViewModel({open,handleOpen,id}){
    const [estimationData,setEstimationData]=React.useState([]);
    const [transportationData,setTransportationData]=React.useState([]);
    const [festimationData,setfEstimationData]=React.useState([]);
    const [ftransportationData,setfTransportationData]=React.useState([]);
    const {setSearchQuery,searchQuery}=useSearch()
    
    useEffect(()=>{
        function  fetchData(){
                fetch("http://localhost:3000/getworkerdetailsbytype",{
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify({
                        "project_id" : id
                    })
                }).then(res => res.json()).then(({estimation,transportation})=>{
                  setEstimationData(estimation);
                  setfEstimationData(estimation);
                  setTransportationData(transportation)
                  setfTransportationData(transportation)
                }).catch(e=>console.log(e))
        }
        fetchData();
    },[])

    function handleSearch(e){
        setSearchQuery(e.target.value.toLowerCase())
    }
    useEffect(()=>{
        setfEstimationData(doFilter(estimationData,searchQuery))
        setfTransportationData(doFilter(transportationData,searchQuery))
      },[searchQuery])
    return (
      <div className='bg-opacity-70 z-50  inset-0 fixed w-screen h-auto bg-black' >
          <Card className="md:mx-auto  absolute left-3 w-[94%] top-[4%] opacity-100 md:left-[13%] md:top-[10%] z-50 md:w-[75%] max-h-[600px]">
                <div className="flex justify-end items-center gap-4 ml-10 md:ml-0">
                    <div className="relative top-1 mb-1 bg-white  p-1 rounded-sm ">
                        <Input label="Type here" onChange={handleSearch}/>
                    </div>
                    <div className="flex justify-center items-center rounded-2xl md:-translate-x-2 cursor-pointer">
                        <XMarkIcon strokeWidth={2} className=" h-7 w-7  pl-1" onClick={handleOpen}/>
                    </div>
                </div>
            <Tabs className='p-1  overflow-y-scroll overflow-x-auto' value={'ESTIMATION'}  >
            <CardHeader color="orange" className="mt-2 md:mt-1.5 ">
              <TabsHeader
               className="rounded-none border-b border-blue-gray-50 bg-transparent p-3"
              >
                  <Tab className="py-2"  value={"ESTIMATION"}>
                    <div className=" flex items-center gap-2 ">
                    <BuildingOffice2Icon  strokeWidth={2} className="h-5 w-5"/> <span className="hidden md:block">ESTIMATION</span> 
                    </div>
                  </Tab>
                  <Tab className="py-2"  value={"TRANSPORTATION"}>
                    <div className="flex items-center gap-2 ">
                      <TruckIcon  strokeWidth={2} className="h-5 w-5"/><span className="hidden md:block">TRANSPORTATION</span> 
                    </div>
                  </Tab>
            </TabsHeader>
            </CardHeader>       
              <TabsBody animate={{
                initial: { x: -2000 },
                mount: { x:0 },
                unmount: { x: 1000 },
              }}
              >
                <TabPanel  value={"ESTIMATION"}>                  
                        <CardHeader variant="gradient" color="blue-gray" className="my-1.5 md:p-6 p-5">
                            <Typography variant="h3" className='flex justify-center md:gap-5 gap-3 items-center text-[22px] md:text-[25px] font-extralight' color="white">
                            ESTIMATION RECORD
                            </Typography>
                        </CardHeader> 
                        <CardBody className="overflow-y-auto overflow-x-auto px-0 pt-0 pb-2">
                        <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                            {['s_no','date','worktype','contractor','division','nos'].map((el) => (
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
                        {festimationData?.map(
                        ({date,work_type,contractor,division,nos}, key) => {
                            const className = `py-3 px-5 ${
                            key === estimationData.length - 1
                                ? ""
                                : "border-b border-blue-gray-50"
                            }`;
                            return (
                            <tr key={key}>
                                <td className={className}>
                                <Typography className="text-sm font-semibold text-blue-gray-600">
                                   {(key+1)}
                                </Typography>
                                </td>
                                <td className={className}>
                                <Typography className="text-sm  font-semibold text-blue-gray-600">
                                   {FormatDate(date)}
                                </Typography>
                                </td>
                                <td className={className}>
                                <Typography className="text-sm font-semibold text-blue-gray-600">
                                 {work_type} 
                                </Typography>
                                </td>
                                <td className={className}>
                                <Typography className="text-sm font-semibold text-blue-gray-600">
                                 {contractor} 
                                </Typography>
                                </td>
                                <td className={className}>
                                <Typography className="text-sm font-semibold text-blue-gray-600">
                                 {division} 
                                </Typography>
                                </td>
                                <td className={className}>
                                <Typography className="text-sm font-semibold text-blue-gray-600">
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
                </TabPanel>
                <TabPanel  value={"TRANSPORTATION"}>
                    
                <CardHeader variant="gradient" color="blue-gray" className="my-1.5 md:p-6 p-5">
                            <Typography variant="h3" className='flex justify-center md:gap-5 gap-3 items-center text-[18px] font-extralight  md:text-[25px]' color="white">
                                TRANSPORTATION RECORD
                            </Typography>
                        </CardHeader> 
                        <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
                        <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                            {['s_no','date','Particulars','nos'].map((el) => (
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
                        {ftransportationData?.map(
                        ({project_id,date,particular,nos}, key) => {
                            const className = `py-3 px-5 ${
                            key === transportationData.length - 1
                                ? ""
                                : "border-b border-blue-gray-50"
                            }`;
                            return (
                            <tr key={key}>
                                <td className={className}>
                                <Typography className="text-sm font-semibold text-blue-gray-600">
                                    {key+1}
                                </Typography>
                                </td>
                                <td className={className}>
                                <Typography className="text-sm  font-semibold text-blue-gray-600">
                                    {FormatDate(date)}
                                </Typography>
                                </td>
                                <td className={className}>
                                <Typography className="text-sm font-semibold text-blue-gray-600">
                                {particular}
                                </Typography>
                                </td>
                                <td className={className}>
                                <Typography className="text-sm font-semibold text-blue-gray-600">
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
                </TabPanel>
              </TabsBody>
            </Tabs> 
          </Card>
      </div >
    );
}