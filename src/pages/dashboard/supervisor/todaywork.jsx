import {Card,CardHeader,CardBody,CardFooter,Input,Select,Option,Button,Typography,Tabs,TabsHeader,TabsBody,Tab,TabPanel,} from "@material-tailwind/react";
import {ArrowUpOnSquareIcon,ArrowRightIcon,ArrowLeftIcon,UserPlusIcon,WrenchScrewdriverIcon,XMarkIcon,DocumentDuplicateIcon} from "@heroicons/react/24/solid";
import React,{useEffect,useState} from "react";
import { ViewModel } from "./widgets";
import Swal from "sweetalert2";
   
export  function TodayWork() {
    const [projectData,setProjectData] = React.useState({});
    const [details,setDetails] = React.useState({});
    const [results,setResults] = React.useState([]);
    let   [wt,setWt] = React.useState([]);
    const [contractor,setContractor] = React.useState([]);
    const [dv,setDv] = React.useState([]);
    const [type,setType] = React.useState('ESTIMATION');
    const [open,setOpen] = React.useState(false);
    const [viewOpen,setViewOpen] = React.useState(false);

    useEffect(()=>{
        async function fetchdata(){
            await fetch("http://localhost:3000/work_type_contractors").then(res => res.json()).then((result)=>{
              setResults(result);
            }).catch(e=>console.log(e));
            await fetch("http://localhost:3000/supervisordata",{
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({name:sessionStorage.getItem('name')})
              }).then(res => res.json()).then((data)=>setProjectData(data[0])).catch(e=>console.log(e))
          }
        fetchdata();
    },[])

    useEffect(()=>{
      async function fetchdata(){
        await fetch("http://localhost:3000/work_type_contractors").then(res => res.json()).then((result)=>{
              setResults(result);
              let set = new Set(result?.map(({work_type})=>work_type))
              setWt([...set])
            }).catch(e=>console.log(e));
      }
      fetchdata();
    },[open])
    
    const handleopen =()=>setOpen(prev=>!prev);
    const handleViewopen =()=>setViewOpen(prev=>!prev);

    function handleContractorChange(e){
      setDv(contractor.filter(({contractor_name})=>contractor_name===e)[0]?.division.split(","))
      setDetails({...details,contractor_name:e})
    };
    function handleTypeChange(e){
      setDetails({...details,type:e.toUpperCase()})
    }
    async function handleSubmit(){
        await fetch("http://localhost:3000/addtodaywork",{
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({...details,project_id:projectData.project_id})
        }).then(res => res.json()).then((data)=>{
            if(data.success)
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Successfully added',
            })
            setDetails({})
            document.querySelectorAll(".custom").forEach(input=>input.value="");
        }).catch(e=>console.log(e))
    }

    const handleChange =(e)=>{
        function istoday(value){
            return value!==new Date().toISOString().split('T')[0]
        }
        if(typeof(e)==='string'){
          setDetails({...details,work_type:e})
          setContractor(results.filter(ele=>ele.work_type===e)?.map(({contractor_name,division})=>{return {contractor_name,division}}))  
        }else{
            if(e.target.name=='date'){
                if(istoday(e.target.value)){
                    alert('are you sure do you want to choose not today ? ')
                }
            }
            setDetails({...details,[e.target.name]:e.target.value})
        }
        console.log(details);
    }

    useEffect(() => {
      if (details?.type === 'NMR' || details?.type === 'ESTIMATION') {
        const updatedDetails = dv?.map((ele, i) => {
          return {
            [`division${i}`]: ele,
            [`nos${i}`]: 0,
          };
        });
    
        setDetails((prevDetails) => ({
          ...prevDetails,
          ...Object.assign({}, ...updatedDetails),
        }));
      }
    }, [details?.type, dv]);

    const handleDv=(e)=>setDetails({...details,division:e})
    return (
    <div className="w-full mt-3" >
        <div className="flex justify-end mr-8 gap-5">
        <Button color="deep-orange" className={`flex  justify-center items-center gap-2`}onClick={handleopen} disabled={details?.type==='TRANSPORTATION'}>
           <span >add</span> <WrenchScrewdriverIcon strokeWidth={2} className="h-5 w-5 -translate-y-0.5"/><span className={'hidden md:block'}>work</span><UserPlusIcon strokeWidth={2} className="h-5 w-5 -translate-y-0.5"/><span className={'hidden md:block'}>contractor</span>
        </Button>
        <Button color="orange" className={`flex  justify-center items-center gap-2`}onClick={handleViewopen}>
          view  <DocumentDuplicateIcon strokeWidth={2} className="h-5 w-5 -translate-y-0.5"/>
        </Button>
      </div>
      {open&&<AddMore open={open} handleOpen={handleopen} wt={wt} contractor={contractor}/>}
      {viewOpen&&<ViewModel open={viewOpen} handleOpen={handleViewopen} id={projectData?.project_id}/>}
      <Card  className="px-1 py-5 mt-14  mb-4 " shadow={true}>
        <CardHeader color="teal" className="py-5 -translate-y-8">
            <Typography variant="h4" className='text-center' color="white">
            Today's check-in
            </Typography>
            <Typography color="white" className="mt-1 text-center font-normal">
            Update today's work 
            </Typography>
        </CardHeader>
        <form className="  max-w-screen ">
          <div className=" grid md:grid-cols-2 gap-y-6 gap-x-10 py-5 px-9 -mt-3">
            <Select  variant="static" color="teal" label="Partitions"  
            onChange={handleTypeChange}
            selected={element=>{
                return details&&React.cloneElement(<Option >{details?.type}</Option>,{
                    className:'list-none',
                    value:details?.type
                })
            }}
            >
              <Option value={'ESTIMATION'} >{'ESTIMATION'}</Option> 
              <Option value={"NMR"} >{'NMR'}</Option> 
              <Option value={"TRANSPORTATION"}>{'TRANSPORTATION'}</Option> 
            </Select>
            {(details?.type==='NMR'||details?.type==='ESTIMATION')&&<Select  variant="static" color="teal" label="work type"  
            onChange={handleChange}
            selected={element=>{
                return details&&React.cloneElement(<Option >{details?.work_type}</Option>,{
                    className:'list-none',
                    value:details?.work_type
                })
            }}
            >
                {wt?.map((ele,i)=>{
                    return<Option value={ele} key={i}>{ele}</Option>})
                }
            </Select>}
            {(details?.type==='NMR'||details?.type==='ESTIMATION')&&<Select variant="static"  color="teal" label="contractor" 
            onChange={handleContractorChange}
            selected={element=>{
                return details&&React.cloneElement(<Option >{details?.contractor_name}</Option>,{
                    className:'list-none',
                    value:details?.contractor_name
                })
            }}
            >
                {contractor?.map(({contractor_name},i)=>{
                    return<Option value={contractor_name} key={i}>{contractor_name}</Option>})
                }
            </Select>}
            <div className="relative">
                <dir className='absolute -right-[4px] bottom-[-13px] h-7 cursor-pointer  translate-x-1.5 rounded-2xl bg-opacity-90 bg-teal-600'></dir>        
                <Input type="date" name="date"  className="custom" variant="standard" size="md" label="date"  color="" onChange={handleChange}/>
            </div>
            {(details?.type === 'NMR' || details?.type === 'ESTIMATION') && (
              <>
                {dv?.map((ele, i) => (
                  <>
                    <Input type="text" name={`division${i}`} variant="standard" size="md" disabled value={ele} />
                    <Input type="number" name={`nos${i}`} variant="standard" size="md" defaultValue="0" onChange={handleChange} />
                  </>
                ))}
              </>
            )}

          {(details?.type==='NMR'||details?.type==='TRANSPORTATION')&&<Input size="md" name="particular" variant='static'  label="Description" type="text" onChange={handleChange}/>}
          </div>
          <div  className=" mx-8 ">
            <Button color="teal" className="flex justify-center items-center gap-2" onClick={handleSubmit} fullWidth>
                <ArrowUpOnSquareIcon strokeWidth={2} className="h-5 w-5 -translate-y-0.5"/>Register
            </Button>
          </div>
        </form>
      </Card>
    </div>
    );
}


export function AddMore({open,handleOpen,wt,contractor}){

  const [worktype,setWorkType]=React.useState(null);
  const [contractorDetails,setContractorDetails]=React.useState(null);
  const [value,setValue]=React.useState("work");
  
  const handleContractorChange=(e)=>{
    const {name,value}=e.target;
    setContractorDetails({...contractorDetails,[name]:value})
  }

  const handleWtChange=(e)=>{
    setWorkType(e.target.value.toUpperCase())
  }

  async function handleContractorSubmit(){
    const {contractor_name,division}= contractorDetails;
    if(worktype&&contractor_name&&division){
      if(contractor.some((ele)=>{return ele.contractor_name.toUpperCase()==contractor_name.toUpperCase()})){
        alert('contractor already exists use another name' );
      }else{
        await fetch("http://localhost:3000/addcontractordivision",{
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                      work_type:worktype,
                      contractor_name:contractor_name.toUpperCase(),
                      division:division.toUpperCase()
                    })
              }).then(res => res.json()).then((data)=>{
                console.log(data)
                setContractorDetails({})
                setWorkType('')
                document.querySelectorAll('.contractdv').forEach(ele=>ele.value='');
              }).catch(e=>console.log(e))
      }
    }
  } 

  function handleWorkSubmit(){
    if(worktype!==null){
        setValue('contractor')
      }
  }

  return (
    <div className='bg-opacity-70 z-50  inset-0 fixed w-screen h-auto bg-black' >
        <Card className="mx-auto absolute left-3 w-[94%] top-[6%] opacity-100 md:left-[26%] md:top-[16%] z-50 md:w-[50%]">
          <div className="absolute right-2 top-2 rounded-lg ">
            <XMarkIcon strokeWidth={2} className=" h-7 w-7  cursor-pointer pl-1" onClick={handleOpen}/>
          </div>
          <Tabs className='p-2 md:p-5' value={value} >
            <TabsHeader
             className="rounded-none border-b border-blue-gray-50 bg-transparent p-3"
             indicatorProps={{
               className: "bg-transparent border-b-2 mt-3 border-blue-500 shadow-none rounded-none",
             }}>
                <Tab   value={"work"}>
                  <div className=" flex items-center ">
                      WORK<WrenchScrewdriverIcon  strokeWidth={2} className="h-5 w-5"/>
                  </div>
                </Tab>
                {(value=='contractor')?<Tab value={"contractor"}>
                  <div className="flex items-center gap-2 z-50">
                    CONTRACTOR<UserPlusIcon  strokeWidth={2} className="h-5 w-5"/>
                  </div>
                </Tab>:<></>}
            </TabsHeader>
            <TabsBody animate={{
              initial: { y: 250 },
              mount: { y: 0 },
              unmount: { y: 250 },
            }}
            >
              <TabPanel  value={"work"}>                  
                <Card className="mx-auto w-full p-4"  color="transparent" >
                  <Typography variant="h4" className='text-center' color="blue-gray">
                    ADD NEW WORK
                  </Typography>
                  <Typography color="gray"  className="mt-1 text-center font-normal">
                    Enter type of work you want to add
                  </Typography>
                  <form className="mt-8 mb-2 px-6  max-w-screen-lg ">
                  {value=='work'?<><div className="mb-4 flex flex-col justify-center-center gap-6">
                      <Input size="lg" variant="static" className="work_type" color="teal" label="new work type" onChange={handleWtChange} />
                    </div>
                    <Button className="my-6 flex justify-center gap-x-2" color="deep-orange" onClick={handleWorkSubmit} fullWidth disabled={value==='contractor'} >
                      ADD NEW WORK <WrenchScrewdriverIcon  strokeWidth={2} className="h-5 w-5"/>
                    </Button></>:<div className="mt-4 flex justify-center gap-3 items-center"> GO TO NEXT STEP<ArrowRightIcon className="h-5 w-5"/> </div>}
                  </form>
                </Card>
              </TabPanel>
              <TabPanel  value={"contractor"}>
              <Card className="mx-auto w-full py-4"  color="transparent" >
                  <Typography variant="h4" className='text-center' color="blue-gray">
                    ADD CONTRACTOR
                  </Typography>
                  <Typography color="gray"  className="mt-1 text-center font-normal">
                    Enter contractor and divisions...
                  </Typography>
                  <form className="mt-8 mb-2 px-6  max-w-screen-lg ">
                    <div className="mb-4 flex md:flex-row flex-col gap-10 md:gap-6">
                      <Input size="lg" variant="static" name="contractor_name" className="contractdv" color="teal" label="contractor name" onChange={handleContractorChange} />
                      <Input size="lg" variant="static" name="division" className="contractdv" color="teal" label="division *(use comma `,` to seperate)" onChange={handleContractorChange} />
                    </div>
                    <Button className="my-6 flex justify-center gap-x-2" color="deep-orange" onClick={handleContractorSubmit} fullWidth >
                      <UserPlusIcon  strokeWidth={2} className="h-5 w-5 -translate-y-0.5"/>ADD NEW CONTRACTOR
                    </Button>
                  </form>
                </Card>
              </TabPanel>
            </TabsBody>
          </Tabs> 
        </Card>
    </div >
  );
  }