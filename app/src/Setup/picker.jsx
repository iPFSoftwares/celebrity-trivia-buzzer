import React, { Component } from 'react';
import CircularSlider from 'react-circular-slider-bar';

class Setup extends Component {
    state = {
        type: 0,
        value: 0,
        actual_value: 0
    }
    toggleType = () => {
        let new_type = this.state.type === 0 ? 1 : 0;
        this.setState({ type: new_type});
        this.setValue(0);
    }
    setValue  = (value) => {
        let max_value = this.state.type === 0 ? 46 : 4;
        let actual_value = value / 100 * max_value;
        actual_value = this.state.type === 0 ? actual_value.toFixed(1) : parseInt(actual_value);

        this.setState({ value: value, actual_value });
    }
    render() {
        return (
            <div id="timePicker">
                <div id="time">
                    <span>
                        { parseInt(this.state.actual_value) }
                    </span>

                    <button onClick={this.toggleType}>
                        { this.state.type === 0 ? 'MINS' : 'HOURS' }
                    </button>
                </div>
                <CircularSlider
                    r={(window.innerWidth - 70) * 0.8 / 2}
                    trackWidth={30}
                    trackColor={'rgba(210, 205, 223, 0.33)'}
                    arcColor={'#4c377e'}
                    thumbBorderColor={'rgb(160, 157, 165)'}
                    thumbColor={'rgb(163, 151, 192)'}
                    thumbWidth={35}
                    value={this.state.value}
                    onChange={value => this.setValue(value)}
                    />
            </div>
        );
    }
}

export default Setup;
