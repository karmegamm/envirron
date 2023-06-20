import {
    Chip,
    Input,
    Button,
    Typography,
    Select,
    Option
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2"
import { useParams, useNavigate } from "react-router-dom"
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { isAdmin } from "../../../util/utils"
import ReactLoading from "react-loading";

export function NewProject() {

    const navigate = useNavigate();
    const { project_id } = useParams();
    
    const [ details, setDetails ] = useState({type:"civil"})
    const [ supervisors, setSupervisors ] = useState([])
    const [ isadmin, setIsadmin ] = useState(false)
    const [ isloading, setIsLoading ] = useState(false)
    
    useEffect(() => {
        setIsadmin(isAdmin())
        setDetails({project_id:project_id})
        if(project_id){
            fetch("http://localhost:3000/getprojectbyid",{
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({"project_id" : project_id})
            }).then(res => res.json())
            .then(data => {
                const startat = FormatDate(data.startat)
                const endat = FormatDate(data.endat)
                setDetails({...data,startat,endat})
                fetch("http://localhost:3000/getallsupervisors",{
                    method: "POST"
                }).then(res => res.json())
                .then(dat => {
                    setSupervisors([...dat,{name:data.supervisor}])
                    console.log(supervisors);
                })
                .catch(err => console.log(err)) 
            })
            .catch(err => console.log(err))
        }
        if(!project_id){
            fetch("http://localhost:3000/getnewprojectid",{
                method: "POST"
            }).then(res => res.json())
            .then(data => setDetails({project_id : data.project_id}))
            .catch(err => console.log(err)) 
            fetch("http://localhost:3000/getallsupervisors",{
                    method: "POST"
            }).then(res => res.json())
            .then(dat => {
                setSupervisors(dat)
                console.log(supervisors);
            })
            .catch(err => console.log(err))
        }   
    },[])

    const FormatDate = (date) => {
        date = new Date(date);
        const day = date.getDate();
        const month = date.getMonth() + 1; 
        const year = date.getFullYear();
        const formattedDate = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        return formattedDate
      }

    const handleChange = (e) => {
        console.log(e);
        if(typeof(e) == "string"){
            setDetails({
                ...details,
                supervisor : e
            })
        }
        else
        setDetails({
          ...details,
          [e.target.name] : e.target.value
        })
        console.log(details);
    }

    const handleFileChange = (e) => {
        setDetails({
            ...details,
            [e.target.name] : e.target.files[0]
        })
        console.log(details);
    }

    const check = () => {
        if(!details.projectname)
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Project Name is required!',
        }).then(() => false)
        else if(!details.clientname)
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Client Name is required!',
        }).then(() => false)
        else if(!details.email)
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Client Email is Optional! But if provided, it should be valid',
        }).then(() => true)
        else if(!details.phone)
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Client Mobile Number is required!',
        }).then(() => false)
        else if(!details.startat)
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Start Date is required!',
        }).then(() => false)
        else if(!details.endat)
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'End Date is required! Please provide expected Ending Date',
        }).then(() => false)
        else if(!details.estimation_budget)
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Budget is required! Please provide the estimated budget for this project',
        }).then(() => false)
        else if(!details.client_paid)
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Client Paid is required! Please provide the amount paid by the client Or enter 0 if not paid yet',
        }).then(() => false)
        else if(!details.length)
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Length is required! Please provide the length of the land',
        }).then(() => false)
        else if(!details.width)
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Width is required! Please provide the width of the land',
        }).then(() => false)
        else if(!details.supervisor)
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Supervisor isn\'t Allocated for this project! please choose anyone from the list',
        }).then(() => false)
        else if(!details.land_document)
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Land Document is required! Please upload the land document Or upload After creating the project',
        }).then(() => true)
        else if(!details.location)
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Location is required! Please provide the location of the land',
        }).then(() => false)
        else return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(check()){
            //confirmation alert with cancel button
            const { value: accept } = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, Confirm!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            })
            if (accept) {
                setIsLoading(true)
                if(typeof(details.land_document) == "string"){
                    fetch("http://localhost:3000/newproject",{
                        method: "POST",
                        headers : {
                            "Content-type" : "application/json"
                        },
                        body : JSON.stringify({project_id:project_id,...details})
                    }).then(res => res.json())
                    .then(data => {
                        if(data.success){
                            setIsLoading(false)
                            Swal.fire({
                                icon:"success",
                                title:"Success",
                                text:data.msg
                            }).then(() => navigate("/dashboard/projects"))
                        }
                        else{
                            setIsLoading(false)
                            Swal.fire("error")
                        }
                    }).catch(err => {
                        setIsLoading(false)
                        console.log(err)})
                }        
                else{
                    const formData = new FormData();
                    formData.append('file', details.land_document);
                    formData.append('project_id', details.project_id);
                    fetch('http://localhost:3000/upload', {
                        method: 'POST',
                        body: formData,
                    }).then(res => {
                        if (res.ok)
                        return res.json();
                        else
                        throw new Error('Error uploading file: ' + res.status);
                    }).then(data => {
                        console.log(data.filename);
                        if(data.filename)
                        fetchAll(data.filename)
                    }).catch(error => {
                        setIsLoading(false)
                        console.log('Error:', error);
                    });
                }
            }
        }
    };
      
    const fetchAll = (filename) => {
        fetch("http://localhost:3000/newproject",{
            method: "POST",
            headers : {
                "Content-type" : "application/json"
            },
            body : JSON.stringify({...details,land_document:filename})
        }).then(res => res.json())
        .then(data => {
            if(data.success){
                setIsLoading(false)
                Swal.fire({
                    icon:"success",
                    title:"Success",
                    text:data.msg
                }).then(() => navigate("/dashboard/projects"))
            }
            else{
                setIsLoading(false)
                Swal.fire("error")
            }
        }).catch(err => {
            setIsLoading(false)
            console.log(err)})
    }

    const handleFinish = (status) => {
        fetch("http://localhost:3000/changetablefield",{
            method: "POST",
            headers : {
                "Content-type" : "application/json"
            },
            body : JSON.stringify({id:project_id,field:"status",value:status,table:"projectdetails"})
        }).then(res => res.json())
        .then(data => {
            if(data)
            Swal.fire("Project Finished Or Returned Successfully!").then(() => navigate("/dashboard/projects"))
            else
            Swal.fire("error")
        }).catch(err => console.log(err))
    }

    return ( 
    <>
    <div className="flex justify-center">
        <div>
        {(project_id&&isadmin) && details.status=="current" ? 
                <Button color="red" onClick={() => handleFinish("completed")} fullWidth className="flex justify-center text-base">
                    <PaperAirplaneIcon stroke="2" className="w-5 h-5 mr-3"/>
                    Set as Finish
                </Button> :
                <Button color="red" onClick={() => handleFinish("current")} fullWidth className="flex justify-center text-base">
                    <PaperAirplaneIcon stroke="2" className="w-5 h-5 mr-3"/>
                    Set as Current
                </Button>
        }
        <Typography variant="h4" color="blue-gray">
          {project_id ? `Update ${project_id} Project` : "Create New project"}
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Enter Project details to register.
        </Typography>
        </div>
    </div>
    <div className="flex flex-col justify-center items-center">
        <select onChange={handleChange} name="type" defaultValue={details.type} className="select select-bordered w-full max-w-xs bg-gray-200 border border-gray-400">
            <option selected value="civil" >Civil</option>
            <option value="interior" >Interior</option>
            <option value="steel" >Steel</option>
        </select>
        <label className="">Project Id</label>
        <Chip variant="ghost" value={details.project_id} className="flex justify-center" />
    </div>
    <div className="w-full mt-10">
          <div className="mb-4 w-full grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-5">
            <Input size="lg" label="Project Name" name="projectname" onChange={handleChange} value={details.projectname} />
            <Input size="lg" label="Client Name" name="clientname" onChange={handleChange} value={details.clientname} />
            <Input size="lg" type="email" label="Client Email" name="email" onChange={handleChange} value={details.email} />
            <Input size="lg" label="Client Mobile Number" name="phone" onChange={handleChange} value={details.phone} />
            <Input size="lg" type="date" label="Starting Date" name="startat" onChange={handleChange} value={details.startat} />
            <Input size="lg" type="date" label="Ending Date" name="endat" onChange={handleChange} value={details.endat} />
            <Input size="lg" label="Estimated Budget" name="estimation_budget" onChange={handleChange} value={details.estimation_budget} />
            <Input size="lg" label="Client Paid" name="client_paid" onChange={handleChange} value={details.client_paid} />
            <div className="grid grid-cols-2 gap-5  ">
                <input type="number" name="length" onChange={handleChange} value={details.length} placeholder="Length" className="w-28 bg-blue-gray-50 border border-blue-gray-200 rounded-lg placeholder:text-center placeholder:text-gray-400" />
                <input type="number" name="width" onChange={handleChange} value={details.width} placeholder="Width" className="w-28 bg-blue-gray-50 border border-blue-gray-200 rounded-lg placeholder:text-center placeholder:text-gray-400" />
            </div>
            <Select
                label="Select SuperVisor"
                animate={{
                mount: { y: 0 },
                unmount: { y: 25 },
                }}
                name="supervisor"
                onChange={handleChange}
                defaultValue={details.supervisor}
            >
            {
                supervisors.map(sv => {
                    return <Option value={sv.name}>{sv.name}</Option>
                })
            }
            </Select>
            <input type="file" name="land_document"  className="file-input file-input-bordered file-input-info file-input-sm w-full max-w-xs" onChange={handleFileChange} />
            <textarea name="location" value={details.location} className="textarea bg-blue-gray-50 border-blue-gray-200" placeholder="Location" onChange={handleChange}></textarea>
          </div>
          <div className="w-full flex justify-center">
            {isloading ? <ReactLoading type={"spinningBubbles"} color={"lightblue"} height={50} width={50} className="ml-36"/>
            :   <Button className="mt-6" onClick={handleSubmit}>
                    {project_id ? "Update Project" : "Register New Project"}
                </Button>
            }
          </div>
    </div>
    </>
     );
}