//main interface from which all individual charts are launched
import MultiPeriodCustomSankey from './multiPeriodCustomSankey';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';


class App extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        //console.log("graph in app.js", graph)
        const charts = []
        
        //draw multiperiod sankey
        if (typeof multiPeriodSankey !== 'undefined' ) {
            charts.push(
            <div className='app' key='multiPeriodsankey'>
                <MultiPeriodCustomSankey />
            </div> 
            )     
        }

        return <div className='app'>{charts}</div>
        
    }
}

ReactDOM.render(<App/>, document.getElementById('reactEntry'));
