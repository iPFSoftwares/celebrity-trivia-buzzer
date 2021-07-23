import React from 'react';
import './Slide.css';

const Slide = ( props ) => {
  const { slide, current, dx, moved, nextStyle } = props;
  const slideStyle = {...nextStyle, transform: `translateX(${dx}px)`};

  return (
    <div id="Slide" className={ current ? 'current' : ' ' + (moved ? 'moved' : ' ')} 
      style={slideStyle}>
      
      { 
        slide && (<div id="title">
          <h2>{ slide.name }</h2>
        </div>)
      }
      
    </div>
  );
}
 
export default Slide;