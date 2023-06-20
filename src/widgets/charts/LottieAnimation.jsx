import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

const LottieAnimation = ({ animationData,className}) => {
    const containerRef = useRef(null);
  
    useEffect(() => {
      const anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        animationData: animationData,
      });
  
      return () => {
        anim.destroy();
      };
    }, [animationData]);
  
    return <div className={className} ref={containerRef}></div>;
  };
  
  export default LottieAnimation;
  