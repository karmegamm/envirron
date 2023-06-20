import {Input,Button,Typography, Select, Option,Card,CardHeader,CardFooter,CardBody,Dialog,Checkbox} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PhotoIcon,CloudArrowDownIcon,CircleStackIcon} from "@heroicons/react/24/solid";
import { FormatDate, doFilter } from "../../../../util/utils"
import { WhatsappShareButton, WhatsappIcon } from "react-share"
import { useSearch } from "../../../../context/searchContext";
import { MaterialsModel } from "./materialsmodel";

export function MaterialRequest() {

    const { id } = useParams();
    const [materialRequest, setMaterialRequest] = useState([]);
    const [click, setClick] = useState(false);
    const [filterData, setFilterData ] = useState([])
    const {searchQuery} = useSearch();
    const [ projectData, setProjectData ] = useState([])
    const [ model, setModel ] = useState(false)

    useEffect(() => {
      fetch(`http://localhost:3000/getprojectbyid`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({project_id:id})
      }).then(res => res.json())
      .then(data => setProjectData(data))
      .catch(err => console.log(err))
    },[])

    useEffect(()=>{
      setFilterData(doFilter(materialRequest,searchQuery))
    },[searchQuery])

    useEffect(() => {
        document.title = "Material Request | Manager"
        fetch("http://localhost:3000/materialRequestbyid", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
              project_id: id,
              type:'request'
            }),
        }).then(res => res.json())
        .then(data => {
            setFilterData(data)
            setMaterialRequest(data)
        }).catch(err => console.log(err))
    },[click])
    
    const handleOredred = (requestid) => {
        fetch("http://localhost:3000/updatetablebyfield",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({table:'materials_booking',field1:'status',value1:'ordered',field2:'orderedat',value2:new Date(Date.now()),wherefield:'requestid',id:requestid})
        }).then(res => res.json()).then((data)=>{
            setClick(c => !c)
        }).catch(e=>console.log(e))
    }

    function handleDownloadImage(path){
      fetch(`http://localhost:3000/downloadfile`,{
        method:"POST",
        headers:{
          "Content-Type": "application/json"
        },
        body:JSON.stringify({filepath:path})
      })
      .then((response) => {
        if (response.ok) {
          return response.blob();
        }
        throw new Error('Error occurred during download');
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'image.png';
        link.click();
      })
      .catch((error) => {
        console.error(error);
      });
    }

    function handleModel(){
      setModel(prev=>!prev)
    }
    
    return ( 
        <>
            <div className="mt-12 mb-8 flex flex-col gap-12">
            {model&&<MaterialsModel  open={model} handleOpen={handleModel} projectData={projectData}  handleDownloadImage={handleDownloadImage}/>}
               <Card>
                  <CardHeader variant="gradient" color="blue" className="mb-8 p-6 flex justify-between items-center">
                    <Typography variant="h6" className='text-center' color="white">
                      Materials  Table
                    </Typography>
                    <Button color="lime" variant="gradient" size="sm" className="flex justify-center items-center gap-2 text-[10px]" onClick={()=>setModel(!model)}>
                      <CircleStackIcon strokeWidth={2} className="h-4 w-4 "/><span>All Materials</span>
                    </Button>
                  </CardHeader>
          <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto ">
              <thead>
                <tr>
                  {[ "Requested Date","Oredered Date","Delivery Date","SuperVisor Name","Shop Name","Materials and Nos","Status","Comments","Share"].map((el) => (
                    <th
                      key={el}
                      className={`border-b border-gray-400   py-3 px-3 ${(el=='Status')?'text-center':'text-left'}`}
                    >
                      <Typography
                        variant="small"
                        className="text-[2px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
                <tbody>
                {[...filterData].reverse().filter(({requestedat,deliveredat,status})=>{
                  const delDate = new Date(deliveredat);
                  let diffInMs,diffInDays=5;
                  if(deliveredat){
                   diffInMs = new Date() - delDate;
                   diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));              
                  }
                  console.log(diffInDays);
                  return (status==='delivered'? diffInDays <= 2:status!=='delivered')
                }).map(
                  ({requestid, orderedat, requestedat,shop_name, materials, nos, deliveredat, supervisor,file_name,review,status}, key) => {
                    const className = ` py-3 px-3 ${
                      key === filterData.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;
                    const step={
                      requested :'step-error',
                      ordered :'step-info',
                      delivered :' step-accent',
                    }
                    const materialData = materials.split(',');
                    const nosData = nos.split(',');
                    const formattedData = materialData.map((material, index) => index!=materialData.length-1 ? `${material} - ${nosData[index]}` : "");
                    let msg = `Site Name : ${projectData.projectname}\nShop Name : ${shop_name}\n`
                    msg += formattedData.join('\n');
                    return (
                      <tr key={`${requestid}`}>
                        <td className={className}>
                            <Typography
                              color="blue-gray"
                              className="font-semibold text-blue-gray-600  text-[14px]"
                            >
                              {FormatDate(requestedat)}
                            </Typography>
                        </td>
                        <td className={className}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold text-blue-gray-600 text-center text-[14px]"
                            >
                              {FormatDate(orderedat)==null?'---':FormatDate(orderedat)}
                            </Typography>
                        </td>
                        <td className={className}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold text-blue-gray-600 text-center text-[14px]"
                            >
                              {FormatDate(deliveredat)==null?'---':FormatDate(deliveredat)}
                            </Typography>
                        </td>
                        <td className={`${className} cursor-pointer`}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold text-blue-gray-600 text-[14px]"
                            >
                            {supervisor}
                            </Typography>
                        </td>
                        <td className={`${className} cursor-pointer`}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold text-blue-gray-600 text-[14px] w-24"
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
                                className="font-semibold text-[17px]"
                              >
                                {materialData.map((ele,index)=> index!=materialData.length-1 && <div className="w-28" key={index}>{ele+"  : "+nosData[index]}</div>)}
                              </Typography>
                            </div>
                          </div>
                        </td>:<td className={`${className} cursor-pointer`}>
                          <div className="flex flex-col justify-start items-center">
                            <PhotoIcon color="teal" className="w-7 h-7"/> <span className="text-[12px] font-semibold text-green-600">image uploaded</span>
                          </div>
                        </td>}
                        <td className={className}>
                          <div className=" flex justify-start items-center">
                          <ul className="steps  text-[10px] transition-colors duration-700">
                            <li data-content={`${status=='requested'?'✓':''}`} className={`step  ${step?.[status]} `}>Requested</li>
                            <li data-content={`${status=='ordered'?'✓':''}`}  className={`step  ${step?.[status]}  `}>Ordered</li>
                            <li  data-content={`${status=='delivered'?'✓':''}`} className={`step  ${step?.[status]}  `}>Delivered</li>
                          </ul>
                          <Button size='sm' className="text-[10px] cursor-pointer"  onClick={()=>handleOredred(requestid)} disabled={status=='requested'?false:true}>
                            Ordered 
                          </Button>
                          </div>
                        </td>
                        <td className={className+" cursor-pointer"} >
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