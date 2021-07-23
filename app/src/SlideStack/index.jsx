import React from 'react';
import './SlideStack.css';

import Gesture from 'rc-gesture';

import Slide from '../Slide';

const max = window.innerWidth / 2;
let canDouble = false;

class SlideStack extends React.Component {
  state = {
    moving: false,
    moved: false,
    dir: 0, 
    dx: 0,
    slides: this.props.slides
  }

  handleSwiped = (dir) => {
    console.log("Swipe event: ");

    if(!canDouble){
      canDouble = true;

      setTimeout(() => {
        if(canDouble){
          canDouble = false;
          this.props.onSlideAction({ type: 'revealdown' });
        }
      }, 200);

      return;
    }

    canDouble = false;
    this.props.onSlideAction({ type: 'revealup' });
  }
  
  handlePanning = (status, e) => {
    this.setState({moving: status});

    if(e){
      const canNext = e.direction === 2 && this.props.next;
      const canPrev = e.direction === 4 && this.props.prev;
      if(status && (canNext || canPrev))
        this.setState({dx: e.moveStatus.x, dir: e.direction === 2 ? -1: 1});
    }

    if(!status){
      if(Math.abs(this.state.dx) < max){
        this.setState({dx: 0, dir: 0});
      }else{
        this.props.onAction({ type: this.state.dir === -1 ? 'next' : 'prev' });
        this.setState({moved: true, dx: this.state.dir === -1 ? -max * 2: max * 2});

        setTimeout(() => {
          this.setState({moved: false, dx: 0, dir: 0});
        }, 5);
      }
    }
  }

  render(){ 
    const { dx, moving, moved, dir } = this.state;
    const { cur, next, prev } = this.props;
    const deg = dir * (Math.abs(dx) * 0.2 / (max * 2)) * 45;
   
    const prevStyle = {
      opacity: moved ? 1 : moving && dir === 1 ? Math.abs(dx) / (max * 2)  : '',
      transform: `scale(${moving && dir === 1 ? (0.8 + (Math.abs(dx) * 0.2 / (max * 2))).toFixed(2) : 'none'})`
    }
    
    const nextStyle = {
      opacity: moved ? 1 : moving && dir === -1 ? Math.abs(dx) / (max * 2)  : '',
      transform: `scale(${moving && dir === -1 ? (0.8 + (Math.abs(dx) * 0.2 / (max * 2))).toFixed(2) : 'none'})`
    }

    return (
      <React.Fragment>
      <div id="slideStack">
        <Slide nextStyle={prevStyle} slide={ prev } />

        <Gesture direction="horizontal"
            onTap={ this.handleSwiped }
            onPanStart={() => this.handlePanning(true) }
            onPanMove={e => this.handlePanning(true, e) }
            onPanEnd={() => this.handlePanning(false) }
          >
          
          <div id="Slide" className={ 'current ' + (moved ? 'moved' : ' ')} 
            style={{ transform: `translateX(${dx}px) rotate(${deg}deg)` }}>
              <div id="title">
                <h2>{cur.name}</h2>
              </div>
          </div>
          
        </Gesture>

        <Slide nextStyle={nextStyle} slide={ next } />
      </div>

      {
        cur.actions && cur.actions.length > 0 && cur.actions.filter(a => a.type === 'video').length > 0
        && <button className="video-player" onClick={ () => this.props.onSlideAction({ type: 'video' }) }>PLAY VIDEO</button>
      }

      </React.Fragment>

    );
  }
}
 
export default SlideStack;