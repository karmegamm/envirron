import '../public/css/index404.css'
import build from '../public/img/building.svg'
import {ArrowRightIcon} from "@heroicons/react/24/solid";
import { Link } from 'react-router-dom';

function NotFound() {
  return (
        <section class="page_404 mb-10 bg-transparent"> 
            <div className='flex flex-col md:flex-row gap-10 mt-10 justify-center items-center'>
                <div class="flex flex-col justify-center items-center">
                    <div className="box text-gray-600 text-[150px] ">
                        <span  style={{ "--x": 1 }} className="text-gray-700">4</span>
                        <span  style={{ "--x": 2 }} className="text-red-400 animate-bounce">0</span>
                        <span  style={{ "--x": 3 }} className="">4</span>
                    </div> 
                    <strong><h2 className="text-[30px] text-gray-700">Look like you're lost</h2></strong>
                    <p className='font-bold text-gray-600'>the page you are looking for not avaible!</p>
                    <Link to={'home'}><strong className="flex justify-center gap-2 items-center hover:border-b-2 border-double pb-1 border-gray-700 mt-7  text-red-700 w-44">Go to <span className='text-gray-700'>Dashboard</span> <ArrowRightIcon strokeWidth={2} className=' h-4 w-4 transition-transform duration-700 hover:translate-x-3 '/></strong></Link>
                </div>
                <div className=''>
                    <img src={build} alt="img" className=' h-80 w-80'/>
                </div>   
            </div>    
        </section>
  );
}

export default NotFound;
