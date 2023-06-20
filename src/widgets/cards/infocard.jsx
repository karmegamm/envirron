import { Card,CardBody, Tooltip, Typography } from "@material-tailwind/react";
import React from "react";
import '../../../public/css/infocard.css'

export function InfoCard({ head,data,className,Element,bodyclass }) {
  return (
    <Card className={`${className} relative overflow-hidden tin`}>
        <div className="div absolute h-5 w-5 bg-blue-gray-100 rounded-xl top-0 -left-5">
        </div>
        <div className="div absolute h-5 w-5 bg-blue-gray-100 rounded-xl bottom-0 -right-5">
        </div>
        <CardBody className={`${bodyclass} `}>
             {Element}
            <div >
                <Typography variant="h6" color="blue-gray" className="mb-1 text-[19px] font-head">
                    {head}
                </Typography>
                {new String(data).length>30?
                <Tooltip  
                    className="bg-blue-gray-500 font-thin w-52 transition-color duration-300"
                    placement="top" 
                    content={`${head} : ${data}`}
                >
                    <Typography variant='h5' className='text-[17px] font-ans cursor-pointer'>
                        {new String(data).length>30 ? new String(data).slice(0,14)+'...':data} 
                    </Typography>
                </Tooltip>:
                    <Typography variant='h5' className='text-[17px] font-ans'>
                        {new String(data).length>30 ? new String(data).slice(0,14)+'...':data} 
                    </Typography>}
            </div>
        </CardBody>
    </Card>
  );
}