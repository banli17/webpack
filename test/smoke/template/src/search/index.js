import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import blUtil from 'bl-util';
import './search.css';
import { a } from './treeshaking';

import logo from './imgs/avatar.jpg';


if (true) {
    a(); // 没有用到
}

class Index extends Component {
    constructor() {
        super();
        this.state = {
            text: 'hello',
        };
    }

    click = () => {
        import('./text.js').then((text) => {
            this.setState({
                text: text.default, // text 是一个模块 Minified React error #31;
            });
        });
    }

    render() {
        return (
            <div>
                <p onClick={this.click}>{this.state.text}</p>
                <img src={logo} alt="" />
          </div>
        );
    }
}

ReactDOM.render(<Index />, document.querySelector('#app'));
