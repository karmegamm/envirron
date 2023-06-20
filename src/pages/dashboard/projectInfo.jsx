import { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import { FormatDate } from '../../util/utils';
import build from '../../../public/img/building.svg'
import { InfoCard } from '../../widgets/cards/infocard';
import shield from '../../../public/img/shield.svg'
import {
    Card,
    CardBody,
    CardFooter,
    Typography,
    Button,
  } from "@material-tailwind/react";
  import { BanknotesIcon,BuildingOffice2Icon,UserCircleIcon,CalendarDaysIcon,MapPinIcon,UserIcon,DevicePhoneMobileIcon,EnvelopeIcon} from "@heroicons/react/24/solid";
   


export function ProjectInfo() {

    const [ data, setData ] = useState({});
    const { id } = useParams()
    
    useEffect(() => {
        fetch(`http://localhost:3000/getprojectbyid`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({project_id:id})
        }).then(res => res.json())
        .then(data => setData(data))
        .catch(err => console.log(err))
    },[window.location.href])

    const handleMapClick = () => {
        window.open(`https://www.google.com/maps/search/?api=1&query=${data.location}`)
    }

    return (
        <>
        <section className="flex flex-col md:flex-row gap-4 justify-between mt-6">     
            <InfoCard head={"Project ID"} data={data.project_id} className={" md:w-1/3 "} Element={<img src={shield} className='w-12 h-11' />} bodyclass={'flex justify-center gap-5 items-center'}/>
            <InfoCard head={"Project Name"} data={data.projectname} className={" md:w-1/3 "} Element={<BuildingOffice2Icon className='text-blue-500 w-12 h-11' />} bodyclass={'flex justify-center gap-5 items-center'}/>
            <InfoCard head={"Supervisor"} data={data.supervisor} className={" md:w-1/3 "} Element={<UserCircleIcon className='text-blue-500 w-12 h-11' />}  bodyclass={'flex justify-center gap-5 items-center'}/>
        </section>
        <section className='grid grid-cols-1 md:grid-cols-3  mt-5'>
            <div className='flex flex-col gap-4 md:items-start items-center w-full'>
                <InfoCard head={" Start @"} data={FormatDate(data.startat)} className={" md:w-[80%] w-full"} Element={<CalendarDaysIcon className='text-blue-500 w-12 h-11' />}  bodyclass={'flex justify-center md:justify-start items-center gap-5'}/>
                <InfoCard head={"Estimate Date"} data={FormatDate(data.endat)} className={"  md:w-[80%] w-full  "} Element={<CalendarDaysIcon className='text-blue-500 w-12 h-11' />}  bodyclass={'flex justify-center md:justify-start items-center gap-5'}/>
            </div>
            <div className='hidden relative h-auto md:flex justify-center items-center'>
                <img src={build} alt="img" className='h-full w-full'/>
            </div>
            <div className='flex flex-col gap-4 items-end w-full mt-5 md:mt-0'>
                <InfoCard head={"Budget"} data={data.estimation_budget} className={"  md:w-[80%] w-full"} Element={<BanknotesIcon className='text-blue-500 w-12 h-11' />}  bodyclass={'flex justify-center md:justify-start items-center gap-5'}/>
                <InfoCard head={"Location"} data={data.location} className={"md:w-[80%] w-full "} Element={<MapPinIcon onClick={handleMapClick} className='text-blue-500 w-12 h-11 cursor-pointer' />}  bodyclass={'flex justify-center md:justify-start items-center gap-5'}/>
            </div>
        </section>
        <section className="flex flex-col md:flex-row gap-4 justify-between mt-6">     
            <InfoCard head={"Client"} data={data.clientname} className={" md:w-1/3 "} Element={<UserIcon className='text-blue-500 w-12 h-11' />} bodyclass={'flex justify-center gap-5 items-center'}/>
            <InfoCard head={"Mobile"} data={data.phone} className={"md:w-1/3 "} Element={<a href={`tell:${data.phone}`}><DevicePhoneMobileIcon  className='text-blue-500 w-12 h-11' /></a>}  bodyclass={'flex justify-center gap-5 items-center'}/>
            <InfoCard head={"Mail ID"} data={data.email} className={"md:w-1/3 "} Element={<a href={`mail  to:${data.email}`}><EnvelopeIcon className='text-blue-500 w-12 h-11' /></a>} bodyclass={'flex justify-center gap-5 items-center'}/>
        </section>
        </>
     );
}