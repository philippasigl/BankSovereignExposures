
(function() { 
//check whether valid data
if (sankey_values === -1) {
    return;
}

//add all nodes from the source list and define their keys as "source + level"
nodes=[]
for (i=0;i<sankey_values.length;i++) {
    row={};
    row.name = sankey_values[i].source;
    row.time = sankey_values[i].time;
    //if a level is given, this level is added to the source key 
    row.key = sankey_values[i].source.concat(sankey_values[i].source_level);
    sankey_values[i].source = sankey_values[i].source.concat(sankey_values[i].source_level);
    nodes.push(row);
}
//add all nodes from the target list and define their keys as "target+level"
for (i=0;i<sankey_values.length;i++) {
    row={};
    row.name = sankey_values[i].target;
    row.time = sankey_values[i].time;
    //if no levels are given, "2" will be added to target keys
    if (typeof sankey_values[i].target_level === 'undefined') {
        row.key = sankey_values[i].target.concat(2);
        sankey_values[i].target = sankey_values[i].target.concat(2);
    }
    //if a level is given, this level is added to the target key
    else {
        row.key = sankey_values[i].target.concat(sankey_values[i].target_level);
        sankey_values[i].target = sankey_values[i].target.concat(sankey_values[i].target_level);
    }
    nodes.push(row);
}

//console.log("nodes",nodes)
//console.log("sankey_values", sankey_values)
//filter for unique nodes
filteredNodes = [];
nodes.filter(function(item){
    var i = filteredNodes.findIndex(x => x.key == item.key && x.time == item.time);
    if(i <= -1)
        filteredNodes.push({key: item.key, name: item.name, time: item.time});
});

//split the nodes into arrays for each time period (since sankey connects to nodes by their indices)
filteredNodesByTime=[];
for (i=0;i<time.length;i++) {
    filteredNodesByTime.push([])
    for (j=0;j<filteredNodes.length;j++) {
        if (filteredNodes[j].time == time[i]) {
            filteredNodesByTime[i].push(filteredNodes[j])
        }
    }
}

//replace node names with idx in values and create data array
d=[]
for (i=0;i<sankey_values.length;i++) {
    idx = time.findIndex(x => x == sankey_values[i].time)
    var source = filteredNodesByTime[idx].findIndex(x => x.key == sankey_values[i].source )
    var target = filteredNodesByTime[idx].findIndex(x => x.key == sankey_values[i].target )
    row={};
    row.source = source;
    row.target = target;
    row.value = sankey_values[i].value;
    row.edge_type = sankey_values[i].edge_type;

    //if there is a time dimension, add the former
    if (typeof sankey_values[i].time !== 'undefined') {
        row.time = sankey_values[i].time;
        //flag that this is a multiPeriod sankey
        multiPeriodSankey=true;
    }
    d.push(row);
}

//assign colours to nodes and edges; use consistent colours for all periods
//first colour is used for first and final level nodes
colors = EXTENDED_DISCRETE_COLOR_RANGE.slice(1)
//find unique nodes
uniqueNodes = []
filteredNodes.filter(function(item){
    var i = uniqueNodes.findIndex(x => x.key == item.key)
    if(i <= -1)
        uniqueNodes.push({key: item.key, name: item.name})
})
//ensure enough colours present
if (colors.length<uniqueNodes.length) {
    extendedColors=colors
    extend=Math.round((uniqueNodes.length/colors.length)+1)
    for (i=0;i<extend-1;i++) {
        extendedColors=extendedColors.concat(colors)
    }
    colors=extendedColors
}

//map to unique nodes
addColor = (node,idx) => {
    node.color = colors[idx]
}
//uniqueNodes.forEach(addColor)
uniqueCountries = []
uniqueNodes.filter(function(item){
    var i = uniqueCountries.findIndex(x => x.name == item.name)
    if(i <= -1)
        uniqueCountries.push({name: item.name})
})
uniqueCountries.forEach(addColor)

addNodeColor = (node,idx) => {
    var i= uniqueCountries.findIndex( x => x.name == node.name)
    node.color = uniqueCountries[i].color
}

uniqueNodes.forEach(addNodeColor)

//specific overrides for this chart
turnLevelOneAndTwoECBBlue = (node) => {
    if (node.key.indexOf("2") == -1 && node.key.indexOf("0") == -1) {
        node.color = EXTENDED_DISCRETE_COLOR_RANGE[0]
        node.opacity = 1
    }
    else {
        node.opacity = 0.7
    }
}

uniqueNodes.forEach(turnLevelOneAndTwoECBBlue)
//assign colors to node array
assignColorNodes = (node) => {
    var colIndex = uniqueNodes.findIndex( uniqueNode => node.key == uniqueNode.key)
    node.color = uniqueNodes[colIndex].color
    node.opacity = uniqueNodes[colIndex].opacity
}
filteredNodesByTime.forEach((nodes) => {
    nodes.forEach(assignColorNodes)
})
//assign colors to edges
assignColorEdges = (edge) => {
    var colIndex = uniqueNodes.findIndex( uniqueNode => edge.edge_type == uniqueNode.name)
    edge.color = uniqueNodes[colIndex].color
}
d.forEach(assignColorEdges)

//set the sankey flag to true
sankey=true;
return;
}) ();
