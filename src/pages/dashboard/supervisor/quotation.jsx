import {Card,CardHeader,CardBody,CardFooter,Typography,Button,IconButton} from "@material-tailwind/react";
import {ArrowDownTrayIcon,TrashIcon} from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import Swal from "sweetalert2"
import { Link, useParams } from "react-router-dom";

export function Quotation() {

    const { id } = useParams()

    const [ isfinished, setIsFinished ] = useState(false)
    const [ isloading, setIsloading ] = useState(false);
    const [ details, setDetails ] = useState({});
    const [projectData,setProjectData] =useState();
    const [click,setClick] =useState(false);
    const [tableData,setTableData] =useState();

    
    useEffect(()=>{
        async function fetchdata(){
        await fetch("http://localhost:3000/supervisordata",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
        },
        body: JSON.stringify({name:sessionStorage.getItem('name')})
        }).then(res => res.json()).then((data)=>{
            console.log(data);
            setProjectData(data[0])
            setDetails({...details,project_id:data[0].project_id})
            setTableData(prev =>{ 
                const{projectname,quotation,abstract_quotation}=data[0];
                return [{projectname,filename:quotation,type:'sample Quotation',field:"quotation"},{projectname,filename:abstract_quotation,type:'Abstract Quotation',field:"abstract_quotation"}];
            })
        });
}
if(!id){
    fetchdata();
}
},[])

useEffect(() => {
    if(id){
        fetch("http://localhost:3000/getprojectbyid",{
                method: "POST",
                headers: {
                    "Content-Type" : "application/json" 
                },
                body: JSON.stringify({project_id:id})
            }).then(res => res.json())
            .then(data => {
                if(data.status=="completed")
                setIsFinished(true)
                setProjectData(data[0])
                setDetails({...details,project_id:data.project_id})
                setTableData(prev =>{ 
                const{projectname,quotation,abstract_quotation}=data;
                return [{projectname,filename:quotation,type:'sample Quotation',field:"quotation"},{projectname,filename:abstract_quotation,type:'Abstract Quotation',field:"abstract_quotation"}];
            })
            }).catch(err => console.log(err))
        }
    },[])

    useEffect(()=>{
        async function fetchdata(){
            await fetch("http://localhost:3000/supervisordata",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name:sessionStorage.getItem('name')})
            }).then(res => res.json()).then((data)=>{
                setTableData(prev =>{ 
                    const{projectname,quotation,abstract_quotation}=data[0];
                    return [{projectname,filename:quotation,type:'Sample Quotation',field:"quotation"},{projectname,filename:abstract_quotation,type:'Abstract  Quotation',field:"abstract_quotation"}];
                })
            });
          }
          if(!id)
          fetchdata();
    },[click])

    const handleFileChange = (e) => {
        setDetails({
            ...details,
            document : e.target.files[0]
        })
    }

    const quotationSubmit = (e) => {
        setIsloading(true)
        details.quotation_type = "quotation"
        const formdata = new FormData();
        formdata.append("project_id",details.project_id)
        formdata.append("file",details.document)
        upload(formdata);
    }

    const abstractSubmit = (e) => {
        details.quotation_type = "abstract_quotation"
        const formdata = new FormData()
        formdata.append("project_id",details.project_id)
        formdata.append("file",details.document)
        upload(formdata)
    }

    async function insertRecord(){
        await fetch("http://localhost:3000/changetablefield",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                table:'projectdetails',
                value:details?.filename,
                field:details.quotation_type,
                id:details.project_id
            }),
        }).then((res) => res.json())
        .then((data) => {
            console.log(data);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: `${details.quotation_type} Uploaded Successfully`,
            })
            setIsloading(false)
            setClick(prev=>!prev);
        }
        ).catch(err => console.log(err))
    }

    const upload = async (formdata) => {
        await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formdata,
        }).then(res => {
            if (res.ok)
              return res.json();
            else
              throw new Error('Error uploading file: ' + res.status);
        }
        ).then(data => {
            setIsloading(false)
            if(data.success){
                details.filename = data.filename
                insertRecord();
            }
        }).catch(error => console.log('Error:', error));
    }

    const downloadFile = (filename,quotationtype,extention) => {
        // const formdata = new FormData()
        // formdata.append("filename",filename)
        // formdata.append("project_id",details.project_id)
        // formdata.append("filepath",`/uploads/${details.project_id}/${filename}`)
        fetch('http://localhost:3000/downloadfile', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({"filepath":`/uploads/${details.project_id}/${filename}`}),
        }).then(res => {
            if (res.ok)
              return res.blob();
            else
              throw new Error('Error downloading file: ' + res.status);
        }).then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${quotationtype}.${extention}`;
            a.click();
            URL.revokeObjectURL(url);
        }).catch(error => console.log('Error:', error));
    }

    async function handledelete(field){
        await fetch("http://localhost:3000/changetablefield",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                table:'projectdetails',
                value:'not submit',
                field:field,
                id:details.project_id
            }),
        }).then((res) => res.json())
        .then((data) => {
            console.log(data);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: `${details.quotation_type} Uploaded Successfully`,
            })
            setIsloading(false)
            setClick(prev=>!prev);
        }
        ).catch(err => console.log(err))
    } 

    return <>
        {!isfinished && <div className=" w-full grid grid-cols-1 md:grid-cols-2 mt-10 gap-10 md:gap-0">
         <Card color='transparent'className="relative border-2 border-teal-700 top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4" shadow={true}>
          <CardHeader
            variant="gradient"
            color="teal"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Quotation
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
              <input type="file" name="plandrawing"  className="file-input file-input-bordered  file-input-md w-full max-w-xs" onChange={handleFileChange} />
          </CardBody>
          <CardFooter className="pt-0">
            {isloading ? <ReactLoading type={"spinningBubbles"} color={"lightblue"} height={50} width={50} className="ml-36"/>
            :<Button variant="gradient" color="teal" fullWidth onClick={quotationSubmit}>
                upload sample quotation
            </Button>}
          </CardFooter>
        </Card>         
        <Card color="transparent" className="relative  border-2 border-teal-700 top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4" shadow={true}>
          <CardHeader
            variant="gradient"
            color="teal"
            className="mb-4 grid h-28 text-center place-items-center"
          >
            <Typography variant="h3" color="white">
            Abstract Quotation
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
              <input type="file" name="structdrawing"  className="file-input file-input-bordered  file-input-md w-full max-w-xs" onChange={handleFileChange} />
          </CardBody>
          <CardFooter className="pt-0">
            {isloading ? <ReactLoading type={"spinningBubbles"} color={"lightblue"} height={50} width={50} className="ml-36"/>
            :<Button variant="gradient" color="teal" fullWidth onClick={abstractSubmit}>
                Upload abstract quotation
            </Button>}
                </CardFooter>
            </Card>                
        </div>}
        {tableData?.filter(({filename})=>(filename!=='not submit')).length>0?<Card className="h-full w-[90%] mx-auto mt-10 border-2 boder overflow-x-scroll md:overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left">
                <thead>
                    <tr>
                        {["S.NO","PROJECTNAME","TYPE","DELETE","DOWNLOAD"].map((head) => (
                            <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal leading-none opacity-70"
                                >
                                    {head}
                                </Typography>
                            </th>
                        ))}
                    </tr>
                </thead>
            <tbody>
                {tableData?.filter(({filename})=>(filename!=='not submit')).map(({projectname,type,field,filename}, index) => (
                    <tr key={index+'th'} className="even:bg-blue-gray-50/50">
                        <td className="p-4">
                            <Typography variant="small" color="blue-gray" className="font-normal">
                            {index+1}
                            </Typography>
                        </td>
                        <td className="p-4">
                            <Typography variant="small" color="blue-gray" className="font-normal">
                            {projectname}
                            </Typography>
                        </td>
                        <td className="p-4">
                            <Typography variant="small" color="blue-gray" className="font-normal">
                            {type}
                            </Typography>
                        </td>
                        <td className="p-4">
                            <Typography  variant="small" color="gray" className="font-medium -ml-8">
                            <IconButton variant="text" disabled={isfinished} color="teal" className="translate-x-4" onClick={()=>{handledelete(field)}}>
                                <TrashIcon stroke={2} className="h-6 w-6"/>
                            </IconButton>
                            </Typography>
                        </td>
                        <td className="p-4">
                            <Typography  variant="small" color="gray" className="font-medium">
                            <IconButton variant="text" color="teal" className="translate-x-4"  
                            onClick={()=>{
                                let ext=filename.split(".")[1]
                                downloadFile(filename,field,ext)
                                }}
                            >
                                <ArrowDownTrayIcon stroke={2} className="h-6 w-6"/>
                            </IconButton>
                            </Typography>
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
        </Card>:''}
    </>
}