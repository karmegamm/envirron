import {Input,Button,Typography, Card,CardHeader,CardFooter,CardBody } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";  
import { XMarkIcon,CloudArrowDownIcon,PlusIcon, MinusCircleIcon,ArrowPathIcon,PhotoIcon,CircleStackIcon} from "@heroicons/react/24/solid";
import {FormatDate} from '../../../util/utils'
import Swal from "sweetalert2"
import { WhatsappShareButton, WhatsappIcon } from "react-share"
import { useSearch } from "../../../context/searchContext";
import { doFilter } from "../../../util/utils";
import Select from 'react-select';
import { useParams } from "react-router-dom";
import {ReturnMaterials} from '../../dashboard/supervisor/widgets'

export function Materials() {
    let [ optionData,setOptionData ] = useState([]);
    const [details,setDetails]=React.useState({request_type:'request'});
    const [projectData,setProjectData]=React.useState([]);
    const [toDo,setTodo]=React.useState([]);
    const [submit,setSubmit]=React.useState(false);
    const [editData,setEditData]=React.useState({});
    const [modelOpen,setModelOpen]=React.useState(false);
    const [ shops, setShops ] = useState([])
    const [ inputCount, setInputCount ] = useState(1)
    const [ inputs, setInputs ] = useState([{select:`material${inputCount}`,name:`nos${inputCount}`}])
    const [ filterData, setFilterData ] = useState([])
    const [or,setOr]=useState(true)
    const [returnModel,setReturnModel]=useState(false);

    const { searchQuery } = useSearch();
    const { id } = useParams();

    useEffect(()=>{
      setFilterData(doFilter(toDo,searchQuery))
    },[searchQuery])

    const addMaterial = () => {
      setInputCount(prec => prec+1)
      setInputs([...inputs,{select:`material${inputCount+1}`,name:`nos${inputCount+1}`}])
      console.log(inputs);
    }

    const removeMaterial = () => {
      if(inputCount>1){
        setInputCount(prec => prec-1)
        setInputs(inputs.filter((ele,index)=>index!=inputCount-1))
        setDetails({...details,[`material${inputCount}`]:null,[`nos${inputCount}`]:null})
      }
    }


    useEffect(()=>{
      async function fetchdata(){
        await fetch("http://localhost:3000/getmaterials",{
          method: "GET"
        }).then(res => res.json()).then((data)=>{
          const opData = data.map((e,i) => {
            return {value : e, label : e, index: i}
          })
          setOptionData(opData)
        })
        .catch(e=>console.log(e))
        await fetch("http://localhost:3000/supervisordata",{
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({name:sessionStorage.getItem('name')})
        }).then(res => res.json()).then((data)=>setProjectData(data[0])) 
        fetch("http://localhost:3000/getshops",{
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        }).then(res => res.json()).then((data)=>setShops(data)) 
      }
      fetchdata();
    },[])
    

    useEffect(() => {
      fetch("http://localhost:3000/getmaterials",{
        method: "GET"
      }).then(res => res.json()).then((data)=>setOptionData(data))
      .catch(e=>console.log(e))
    }, [modelOpen])

    useEffect(()=>{
      fetch("http://localhost:3000/getmaterialsbysupervisorname",{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({name:sessionStorage.getItem('name'),type:'request'})
      }).then(res => res.json()).then((data)=>{
        setFilterData(data)
        setTodo(data)})
    },[submit,window.location.href])
    
    const handleOpen = () => setModelOpen((cur) => {
      setSubmit(!submit)
      return !cur
    });
    
    const handleReturnModel = () => setReturnModel((cur) => {
      return !cur
    });

    const handlechange =(index, e)=>{
        if(typeof(e)==='string'){
          setDetails({...details,[inputs[index]["select"]]:e})
        }else{
          setDetails({...details,[e.target.name]:e.target.value})
          setEditData({...editData,nos:e.target.value})
        }
        console.log(details);
    }

    function handleImg(e){
      const file = e.target.files[0];
      setDetails(({request_type,shop_name}) => {
        return {
          request_type:request_type,
          shop_name:shop_name,
          file: file,
          material: "Material requests"
          // file: new Blob([file], { type: file.type })
      }})
    }
    

    // function editRow(requestid){
    //   setEditData(toDo.filter(ele=> {return ele.requestid==requestid})[0]);
    // }

    // function deleteRow(requestid){
    //   fetch("http://localhost:3000/deletetablebyfield",{
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //       table:'materials_booking',
    //       field:'requestid',
    //       id:requestid
    //     })
    //     }).then(res => res.json())
    //     .then((data)=>{
    //             setSubmit(!submit)
    //           })
    //     .catch(e=>console.log(e)) 
    // }

    
    const handlesubmit=async(e)=>{
      if(or){ 
        e.preventDefault();
          // Swal.fire({
          //   title: 'Do you want to Request Materials?',
          //   showCancelButton: true,
          //   confirmButtonText: 'Request',
          // }).then((result) => {
          //   if(result.isConfirmed){
          //     fetchdata();
          //   }
          // })
          let materials = "",nos="";
          for(let i=1;i<=inputCount;i++)
            materials+=`${details[`material${i}`]},` 
          for(let i=1;i<=inputCount;i++)
            nos+=`${details[`nos${i}`]},`
            console.log(materials,nos);
          fetchdata();
          function fetchdata(){
            fetch("http://localhost:3000/addrequest",{
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
                shop_name:details.shop_name,
                materials:materials,
                nos:nos,
                project_id:id,
                supervisor:projectData.supervisor,
                requestedat:new Date(),
                orderedat:null,
                deliveredat:null,
                type:details.request_type,
                status:'requested'
              })
            }).then(res => res.json())
            .then((data)=>{
                    // if(data.success)
                    //   Swal.fire({
                    //     icon: 'success',
                    //     title: 'Success',
                    //     text: 'Materials Requested Successfully',
                    //   })
                    setSubmit(!submit)
                    setInputs([{select:`material${inputCount}`,name:`nos${inputCount}`}])
                    setInputCount(1)
                    setDetails(({request_type,shop_name})=>{
                      return {
                        request_type:request_type,
                        shop_name:shop_name,
                        material1:"",
                        nos1:""}
                    })
                    document.querySelectorAll('input').forEach(input => input.value = '');
                  })
            .catch(e=>console.log(e));
          }
      }else{
        const formdata = new FormData()
        formdata.append("file",details.file)
        formdata.append("project_id",id)
        formdata.append("billType","Material requests")
        fetch("http://localhost:3000/imageupload",{
            method: "POST",
            body: formdata
            }).then(res => res.json())
            .then(({path})=>{
                    fetch("http://localhost:3000/materialRequestbyimage",{
                      headers: {
                        "Content-Type": "application/json"
                      },
                      method: "POST",
                      body: JSON.stringify({
                        shop_name:details.shop_name,
                        project_id:id,
                        supervisor:projectData.supervisor,
                        path:path,
                        requestedat:new Date(),
                        type:details.request_type,
                        status:'requested'
                      })
                    }).then(res => res.json()).then(data=>{
                      // if(data.success)
                    //   Swal.fire({
                    //     icon: 'success',
                    //     title: 'Success',
                    //     text: 'Materials Requested Successfully',
                    //   })
                      setSubmit(!submit)
                      setDetails(({request_type,shop_name})=>{
                        return {
                          request_type:request_type,
                          shop_name:shop_name,
                        }
                      })
                      document.querySelectorAll('input').forEach(input => input.value = '');
                    }).catch(e=>console.log(e)) 
                    })
            .catch(e=>console.log(e));
      } 
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

    
    function handleDeliverd(id){
        fetch("http://localhost:3000/updatetablebyfield",{

        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({table:'materials_booking',field1:'status',value1:'delivered',field2:'deliveredat',value2:new Date(Date.now()),wherefield:'requestid',id:id})
      }).then(res => res.json()).then((data)=>{
        setSubmit(!submit)
      }).catch(e=>console.log(e))
    }

    function handleOr(){
      setDetails(({request_type,shop_name})=>{
        return {
          request_type:request_type,
          shop_name:shop_name,
          material1:"",
          nos1:""}
      })
      setOr(prev=>!prev)
    }

    const handleComment = (requestid,value) => {
      Swal.fire({
        title: 'Enter the Comment for the Request',
        input: 'text',
        inputValue: value,
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Update Comment',
        showLoaderOnConfirm: true,
        preConfirm: (comment) => {
          if(comment==null||comment==""){
              Swal.showValidationMessage("Comment must be Empty..")
          }
          else{
            return fetch("http://localhost:3000/updatecomment",{
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({table:'materials_booking',comment,requestid})
            }).then(res => res.json())
            .catch(err => Swal.showValidationMessage(
              `Request failed: ${err}`
            ))
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            icon: "success",
            title: "Comment Updated Successfully",
            text: "Success",
          })
        setSubmit(!submit)
        }
      })
      // fetch("http://localhost:3000/changetablefield",{
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify({table:'materials_booking',field:'review',value:comment,id})
      // }).then(res => res.json()).then((data)=>{
      //   Swal.fire({icon: 'success',title: 'Success',text: 'Comment Updated Successfully',})
      //   setSubmit(!submit)
      // }).catch(e=>console.log(e))
    }
    
    optionData = optionData.map(e => {
      return {value : e, label : e}
    })
    
    return  <><div className="text-gray-700 mx-auto mb-8 md:mt-5">
                  <div className="flex flex-col md:flex-row mb-2 justify-between items-center gap-8">
                    <Typography color='blue-gray' className='first-letter:text-lime-800 font-serif text-2xl' variant="h4">
                      Materials Manage
                    </Typography>
                    <div className="flex gap-4">
                        <Button color="lime" variant="gradient" size="sm" className="flex justify-center items-center gap-2 text-[10px]" onClick={()=>setModelOpen(!modelOpen)}>
                          <PlusIcon strokeWidth={2} className="h-4 w-4 "/><span>Add Material</span>
                        </Button>
                        <Button color="lime" variant="gradient" size="sm" className="flex justify-center items-center gap-2 text-[10px]" onClick={()=>setReturnModel(!returnModel)}>
                          <CircleStackIcon strokeWidth={2} className="h-4 w-4 "/><span>Materials</span>
                        </Button>
                    </div>
                  </div>
                  {modelOpen&&<AddMaterials  open={modelOpen} handleOpen={handleOpen}/>}
                  {returnModel&&<ReturnMaterials  open={returnModel} handleOpen={handleReturnModel} projectData={projectData} handleComment={handleComment} handleDownloadImage={handleDownloadImage}/>}
                <div className="mt-8 flex flex-col mx-auto mb-2 md:w-[60%] sm:w-96">
                <div className="flex justify-between items-center ">
                    <select  className="select select-bordered max-w-xs w-[45%] bg-gray-200"
                    onChange={(e) => setDetails({...details,"request_type":e.target.value})}
                  >
                      <option value="request"  selected>Request</option>
                      <option value="return" >Return</option>   
                    </select>
                  <select className="select select-bordered w-[45%]  max-w-xs bg-gray-200"
                    onChange={(e) => setDetails({...details,"shop_name":e.target.value})}>
                      <option value="" disabled selected>Select Shop</option>
                      {
                        shops.map(({shop_name},index) => <option key={index} value={shop_name}>{shop_name}</option>)
                      }
                    </select>
                    <ArrowPathIcon onClick={handleOr} strokeWidth={2} className="h-5 w-5 md:hover:animate-spin " />
                </div>
                {or&&<div className=" w-full flex flex-col justify-start  gap-3 mt-5">
                    {
                      inputs.map(({name},index) => {
                        return <div className="flex  justify-start flex-wrap md:flex-nowrap gap-6">
                        <Select
                          options={optionData}
                          onChange={(selectedOption) => handlechange(index,selectedOption.value)}
                          placeholder="Select Material"
                          className="w-[100%] "
                        />
                        <Input size="lg" name={name} className="h-8" onChange={(e) => handlechange(index,e)} label="Nos" />
                        <div className="flex justify-center items-center gap-5">
                          <Button color="blue" disabled={index == inputs.length-1 ? false : true} className="flex rounded-lg justify-center items-center" onClick={() => addMaterial()}>
                            <PlusIcon strokeWidth={2} className="h-4 w-4 " />
                          </Button>
                          <Button color="red" disabled={index == inputs.length-1 ? false : true} className="  flex rounded-lg justify-center items-center" onClick={() => removeMaterial()}>
                            <MinusCircleIcon strokeWidth={2} className="h-4 w-4 " />
                          </Button>
                        </div>
                      </div>
                  })
                    }
                  </div>}
                  {!or&&<div className="w-full flex justify-center items-center md:h-10 mt-6">
                    <input name="document" type="file" className="file-input file-input-bordered file-input-primary file-input-sm w-full max-w-xs" accept="image/*" capture="camera" onChange={handleImg}/>
                  </div>}
                    <Button className="mt-6" color={"teal"} fullWidth onClick={handlesubmit}>
                      Request
                    </Button>
                  </div>
            </div>  
            <div className="mt-12 mb-8 flex flex-col gap-12">
               <Card>
                  <CardHeader variant="gradient"  color="teal" className="mb-8 p-6 flex justify-center items-center gap-10">
                    <Typography variant="h6" className='text-center' color="white">
                      Request Materials  
                    </Typography>
                  </CardHeader>
          <CardBody className="overflow-auto px-0 pt-0 pb-2">
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
                <tbody>
                {[...filterData].reverse().filter(({status})=>status!=='delivered').map(
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
                        </td>:<td className={`${className} cursor-pointer w-2/12`}>
                          <div className="flex flex-col justify-center items-center">
                            <PhotoIcon color="teal" className="w-7 h-7"/> <span className="text-[12px] font-semibold text-green-600">image uploaded</span>
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
                        <td className={className+" cursor-pointer"} onDoubleClick={() => handleComment(requestid,review)}>
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
          </>
}


function AddMaterials({open,handleOpen}){
  const [material,setMaterial]=React.useState('');
  const [ type, setType ] = useState('')

  async function  handlesubmit(){
    if(type === "material"){
      await fetch("http://localhost:3000/insertmaterial",{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({material:material})
      }).then(res => res.json())
      .then(data=> {
        console.log(data);
        Swal.fire(
          "Material Added SuccessFully",
          "Success",
          "success"
          )
        })
        .catch(e=>console.log(e))
        setMaterial('')
        handleOpen();
      }
      else{
        await fetch("http://localhost:3000/insertshop",{
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({shop:material})
        }).then(res => res.json())
        .then(data=> {
          if(data.success)
          Swal.fire(
            "Shop Added SuccessFully",
            "Success",
            "success"
          )
          else
          Swal.fire(
            "Shop Already Exists",
            "Error",
            "error"
          )
          })
          .catch(e=>console.log(e))
          setMaterial('')
          handleOpen();
    }
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
              Add New Meterials Or Shops
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
        <select placeholder="Select AnyOne" className="select select-success bg-transparent select-md w-full max-w-xs" name="type" onChange={(e) => setType(e)}>
        <option value="material">Material</option>
        <option value="shop">Shop</option>
        </select>
            <Input label="Materials" name="matreial" value={material} size="lg" onChange={(e)=>setMaterial(e.target.value)}/>
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" onClick={handlesubmit}  fullWidth>
              add
            </Button>
          </CardFooter>
        </Card>
    </div >
  );
}

