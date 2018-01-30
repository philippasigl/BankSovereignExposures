//sankey for multiple levels & multiple periods with buttons for switching; requires a predefined color
import React, {Component} from 'react'
import {Hint} from 'react-vis'
//using a newer Sankey version than in the react-vis distribution
import Sankey from './Sankey/index'
import ShowcaseButton from './button'
//import {EXTENDED_DISCRETE_COLOR_RANGE} from './theme'

const BLURRED_LINK_OPACITY = 0.3
const FOCUSED_LINK_OPACITY = 0.6

const TIME = time
//const edgeColors = EXTENDED_DISCRETE_COLOR_RANGE

export default class MultiPeriodCustomSankey extends Component {
    state = { 
            //button
            timeIndex: 0,
            //hoover
            linkValue: null
        }
    
    _renderHint() {
        //linkValue {source: , target: , value: , color: , time: , index: , width: , y0: , y1: }
        //linkValues.source { key: , name: , index: , sourceLinks: , targetLinks: , value: , depth: , height: , x0: , x1: , y0: , y1: }}
        const {linkValue} = {linkValue: this.state.linkValue}
        const x = linkValue.source.x1-(linkValue.source.x1-linkValue.source.x0)/2
        const y = linkValue.y1-(linkValue.y1-linkValue.y0)/2
        //const label = String(linkValue.source.name + " to "+ linkValue.target.name)
        //[] computed property name
        const hintValue = { category: linkValue.edge_type, value: linkValue.value}
        return (
            <Hint x={x} y={y} value={hintValue}>
            <div style={{
                background: '#e9e9e9',
                borderRadius: 3,
                border: 1,
                borderColor: '#edaf00',
                padding: 2,
                color: '#333',
                fontSize: 10,
                position: 'relative',
                marginLeft: 12,
                marginTop: 0,
                marginBottom: 0,
                marginRight: -10,
                lineHeight: 1}}>
                <p>Category: {hintValue.category}</p>
                <p>Value: {(hintValue.value).toFixed(2)}</p>
            </div>
        </Hint>
      );
    }

    updateTimeIndex = increment => () => {
        const newIndex = this.state.timeIndex + (increment ? 1 : -1);
        const timeIndex = newIndex < 0 ? TIME.length - 1 : newIndex >= TIME.length ? 0 : newIndex;
        this.setState({timeIndex});
        
    }

    //setEdgeColors(edges) {
    //    let typeEdges = [...new Set(edges.map(row => row.edge_type))]
    //    let newEdges=[]
        //assigns colors; in case there aren't enough colors, repeat color scheme
    //    for (i=0;i<typeEdges.length;i++) {
    //        let color = i
    //        if (typeEdges.length>edgeColors.length) { color = typeEdges.length/edgeColors.length-1}
    //        let filteredEdges = edges.filter(row => row.edge_type===typeEdges[i])
    //        filteredEdges.map(row => { Object.assign(row, {color: edgeColors[color]})} )
    //    }
    //}
    render() { 
        const {timeIndex} = {timeIndex: this.state.timeIndex}
        const {linkValue} = {linkValue: this.state.linkValue}
        //get the links for the current button value
        let filteredD = d.filter(row => row.time === TIME[timeIndex])
        //get the node indices for the current button value
        let nodes = filteredNodesByTime[timeIndex]
        //nodes.map(node => {Object.assign(node, {color: '#003299'})})
        //set colors for edges
        //this.setEdgeColors(filteredD)
        console.log(filteredD)
        //create the sankey
        return (<div className="centered-and-flexed"
        style={{
            background: 'white',
            borderRadius: '3px',
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)',
            margin: 10,
            padding: 20,
            left: 0,
            right: 0
            //padding: '12px'
            //margin: 10
        }}>
        
        <div className="center-aligned-controls"  style= {{width: '1500px'}}>
          <ShowcaseButton onClick={this.updateTimeIndex(false)} buttonContent={'Prev Period'} />
          <div> {TIME[timeIndex]} </div>
          <ShowcaseButton onClick={this.updateTimeIndex(true)} buttonContent={'Next Period'} />
        </div>
        <Sankey 
            nodes={nodes}
            //links={filteredD}
            links = {filteredD.map((d,i) => (
            {...d,
            opacity: linkValue && i === linkValue.index ? FOCUSED_LINK_OPACITY : BLURRED_LINK_OPACITY}))}
            onLinkMouseOver = {link => this.setState({linkValue: link})}
            onLinkMouseOut = {() => this.setState({linkValue: null})}
            width={1500}
            //width={960}
            height={900}
            nodeWidth={15}
            nodePadding={scale[timeIndex].value}
            style={{
            links: {
              opacity: 0.3
            },
            labels: {
              fontSize: '10px'
            }
            
            }}
            align={'left'}
            margin={20}
            >
            { linkValue && this._renderHint() }
            </Sankey>
            
        </div>
        );
    }
}
