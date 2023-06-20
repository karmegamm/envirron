import {Card,CardHeader,CardBody,CardFooter,Input,Select,Option,Button,Typography,Tabs,TabsHeader,TabsBody,Tab,TabPanel,} from "@material-tailwind/react";
import { XMarkIcon,CloudArrowDownIcon,PhotoIcon,ArrowTrendingDownIcon,ArrowTrendingUpIcon} from "@heroicons/react/24/solid";
import React,{useEffect,useState} from "react";
import {FormatDate,doFilter} from '../../../../util/utils'
import { WhatsappShareButton, WhatsappIcon } from "react-share"
import { useSearch } from "../../../../context/searchContext";


export function ReturnMaterials({open,handleOpen,projectData,handleComment,handleDownloadImage}){
    const [requestData,setRequestData] = useState([]);
    const [returnData,setReturnData] = useState([]);
    const [filterData,setFilterData] = useState([]);
    const [type, setType] = React.useState("request");
    
    const {setSearchQuery,searchQuery}=useSearch()
    
    useEffect(()=>{
      function fetchData(){
        fetch("http://localhost:3000/getmaterialsbysupervisorname",{
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({name:sessionStorage.getItem('name'),type:'request'})
        }).then(res => res.json()).then((data)=>{
          setFilterData(data)
          setRequestData(data)
        }).catch(e=>console.log(e))
        
        fetch("http://localhost:3000/getmaterialsbysupervisorname",{
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({name:sessionStorage.getItem('name'),type:'return'})
        }).then(res => res.json()).then((data)=>{
          setReturnData(data)
        }).catch(e=>console.log(e))
      }
      fetchData()
    },[])

    function handleSearch(e){
        setSearchQuery(e.target.value.toLowerCase())
    }

    useEffect(()=>{
       let data = type=='request' ? requestData:returnData;
       setFilterData(doFilter(data,searchQuery))
      },[searchQuery])

    function handleRequestTab(){
      setType("request")
      setFilterData(requestData)
    }

    function handleReturnTab(){
      setType("return")
      setFilterData(returnData)
    }
      
    return (
      <div className='bg-opacity-70 z-50 inset-0 fixed w-screen h-auto bg-black' >
          <Card className="md:mx-auto  absolute left-3 w-[93%] top-[4%] opacity-100 md:left-[5%] md:top-[5%] z-50 md:w-[90%] max-h-[650px]">
              <div className="bg-transparent flex justify-end items-center gap-4 ml-10 md:ml-0">
                <div className="relative top-1 mb-1 bg-white  p-1 rounded-sm ">
                    <Input label="Type here" onChange={handleSearch}/>
                </div>
                <div className="flex justify-center items-center rounded-2xl md:-translate-x-2 cursor-pointer">
                    <XMarkIcon strokeWidth={2} className=" h-7 w-7  pl-1" onClick={handleOpen}/>
                </div>
              </div>

              <Tabs className='p-1   overflow-y-scroll  'value={type}  >
                
                <CardHeader color="orange" className="mt-2 md:mt-1.5 ">
                  <TabsHeader
                    className="rounded-none border-b border-blue-gray-50 bg-transparent p-3"
                  >
                    <Tab className="py-2" onClick={handleRequestTab}  value={"request"}>
                      <div className=" flex items-center gap-2 ">
                        <ArrowTrendingUpIcon  strokeWidth={2} className="h-5 w-5"/><span className="hidden md:block">Request Materials</span> 
                      </div>
                    </Tab>
                    <Tab className="py-2" onClick={handleReturnTab}  value={"return"}>
                      <div className="flex items-center gap-2 ">
                      <ArrowTrendingDownIcon  strokeWidth={2} className="h-5 w-5"/> <span className="hidden md:block">Return Materials</span> 
                      </div>
                    </Tab>
                  </TabsHeader>
                </CardHeader>   

                <TabsBody className="" >
                  <TabPanel value={type} className="p-0">
                  <div className="mt-4 mb-8 flex flex-col gap-12">
                    <Card>
                      <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
                        <table className="w-full min-w-[640px] table-auto ">
                          <thead>
                            <tr>
                              {[ "Date","Project Name","Shop Name","Materials and Nos","Status","Comments","Share"].map((el) => (
                                <th
                                  key={el}
                                  className={`border-b border-gray-400  py-3 px-3 ${(el=='Status')?'text-center':'text-left'}`}
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
                            <tbody className="">
                            {
                            [...filterData].reverse().map(
                              ({requestid,file_name,shop_name,materials,nos,requestedat,status,review}, key) => {
                                const className = `py-3 px-3  ${
                                  key === filterData.length - 1
                                    ? ""
                                    : "border-b border-blue-gray-50"
                                }`;
                                const step={
                                  requested :'step-error',
                                  ordered :'step-primary',
                                  delivered :' step-accent',
                                }
                                const materialData = materials.split(',');
                                const nosData = nos.split(',');
                                const formattedData = materialData.map((material, index) => index!=materialData.length-1 ? `${material} - ${nosData[index]}` : "");
                                const msg = formattedData.join('\n');
                                return (
                                  <tr key={`${key}th`}>
                                    <td className={className}>
                                        <Typography
                                          variant="small"
                                          color="blue-gray"
                                          className="font-semibold text-blue-gray-600"
                                        >
                                          {FormatDate(requestedat)}
                                        </Typography>
                                    </td>
                                    <td className={`${className} cursor-pointer`}>
                                        <Typography
                                          variant="small"
                                          color="blue-gray"
                                          className="font-semibold text-blue-gray-600"
                                        >
                                        {projectData.projectname}
                                        </Typography>
                                    </td>
                                    <td className={`${className}`}>
                                        <Typography
                                          variant="small"
                                          color="blue-gray"
                                          className="font-semibold text-blue-gray-600"
                                        >
                                        {shop_name}
                                        </Typography>
                                    </td>
                                    {!file_name?<td className={className}>
                                      <div className="flex items-center gap-4">
                                        <div>
                                          <Typography
                                            variant="small"
                                            color="blue-gray-600"
                                            className="font-semibold"
                                          >
                                            {materialData.map((ele,index)=> index!=materialData.length-1 && <div key={index}>{ele+" : "+nosData[index]}</div>)}
                                          </Typography>
                                        </div>
                                      </div>
                                    </td>:<td className={`${className} cursor-pointer`}>
                                      <div className="flex flex-col justify-start items-start">
                                        <PhotoIcon color="teal" className="w-7 h-7 translate-x-6"/> <span className="text-[12px] font-semibold text-green-600">image uploaded</span>
                                      </div>
                                    </td>}
                                    <td className={className}>
                                      <div className=" flex">
                                      <ul className="steps text-[10px] transition-colors duration-700">
                                        <li data-content={`${status=='requested'?'✓':''}`} className={`step  ${step?.[status]} ${status=='requested'?'font-extrabold text-black':''}`}>Requested</li>
                                        <li data-content={`${status=='ordered'?'✓':''}`}  className={`step  ${step?.[status]} ${status=='ordered'?'✓':''}`}>Ordered</li>
                                        <li  data-content={`${status=='delivered'?'✓':''}`} className={`step  ${step?.[status]} ${status=='delivered'?'✓':''}`}>Delivered</li>
                                      </ul>
                                      <Button size='sm' className="text-[9px] translate-y-3 h-8" color="teal"  onClick={()=>handleDeliverd(requestid)} disabled={status=='ordered'?false:true}>
                                        delivered 
                                      </Button>
                                      </div>
                                    </td>
                                    <td className={className+" cursor-pointer"} onDoubleClick={() => handleComment(requestid)}>
                                      <Typography className="text-xs font-semibold text-blue-gray-600">
                                        {review||"----"}
                                      </Typography>
                                    </td>
                                    {!file_name?<td className={className}>
                                      <Button
                                        size="sm"
                                        variant="text"
                                      >
                                        <WhatsappShareButton url={msg}>
                                          <WhatsappIcon size={32} round={true} />
                                        </WhatsappShareButton>
                                      </Button>
                                    </td>:<td className={className}>
                                    <Button size="sm" variant="text" color="light-green" className="flex justify-center items-center" onClick={()=>handleDownloadImage(file_name)}>
                                      <CloudArrowDownIcon className="h-7 w-7"/>
                                    </Button>
                                    </td>}
                                    {/* <td className={className}>
                                        <Button
                                          size="sm" 
                                          variant="text" 
                                          onClick={()=>editRow(requestid)} 
                                          className="text-xs font-semibold text-blue-gray-600"
                                          disabled={status=='requested'?false:true}
                                        >
                                          <PencilSquareIcon strokeWidth={2} className="h-5 w-5 -translate-x-3 pl-1"/>
                                        </Button> 
                                      </td>
                                    <td className={className}>
                                        <Button
                                          size="sm" 
                                          variant="text" 
                                          onClick={()=>{
                                            deleteRow(requestid);
                                          }}
                                          className="text-xs font-semibold text-blue-gray-600"
                                          disabled={status=='requested'?false:true}
                                        >
                                          <TrashIcon strokeWidth={2} className="h-5 w-5 -translate-x-3 pl-1"/>
                                        </Button> 
                                    </td> */}
                                  </tr>
                                );
                              }
                            )}
                          </tbody>
                        </table> 
                      </CardBody>
                    </Card>
                  </div>
                  </TabPanel>
                </TabsBody>
              </Tabs>
        </Card>
      </div >
    );
}