import lottie from 'lottie-web';
import { useEffect, useRef } from 'react';

export function Lottie({animationData}) {

    const containerRef = useRef(null);
    useEffect(() => {
        const anim = lottie.loadAnimation({
            container: containerRef.current,
            renderer: 'svg',
            animationData: animationData
        })
        return () => {
            anim.destroy();
        }
    }, [animationData])


    return ( 
        <>
        <div className='grid grid-rows-2 gap-5'>
            <span className='font-extrabold text-2xl italic'>No Data Found!</span>
            <span className='font-extrabold text-2xl italic'>Search with some other phrases</span>
        </div>
        <div ref={containerRef} className='w-72 h-72'></div>
        </>
    );
}