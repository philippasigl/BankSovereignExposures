(function() {

//check whether valid data
if (line_values === -1) { 
    return;
}
d=[];
xVals=[];

//array for x-axis values 
for (i=0;i<line_values.length;i++) {
 if(line_values[i].cat == line_values[0].cat) {
    xVals.push(line_values[i].x);
 }
}

//array used for lines of the structure d[category][time].x/y/cat
t=0, round=0; 
for (j=0;j<(categories.length-1);j++) {
 d[j]=[];
   for (i=0;i<(xVals.length);i++) {
     row={};
     row.y=line_values[t].y;
     row.x=xVals[i];
     d[j].push(row);
     t=t+categories.length-1;       
   }
   round++;
   t=round;
}

//array for categories without x-axis
cats=[];
for (j=1;j<(categories.length);j++) {
 cats.push(categories[j])
}

//address d like d[1][1].x

//set flag
line=true;
return;
}) ();