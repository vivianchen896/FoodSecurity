// get the file
 var a = 0;
 var toggle = true;
var FoodType = new Array()
var All_facilities = new Array()
$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/foodwaste_data_us.csv",
        dataType: "text",
        success: function(data) {processData(data);}
     });
});

// parse
function processData(data) {
  Papa.parse(data, {
  	complete: function(results) {
      if (toggle) {
        draw(results.data);
      }
      toggle = false;
    }
  });
}

// actually draw
function draw(data) {
  for (i = 1; i < 3; i++) {
    FoodType.push(data[1][i]);
  }
  FoodType.push(""); //dummy
  //loop stores all food type
  for (i = 2; i < data.length; i++) {
    FoodType.push(data[i][0]);
  }
  FoodType.push(""); //dummy
  //loop stores all facility type

  //Production Data for matrix
  for( i = 0; i < 2; i++) {
     var facility = new Array();
    for (p = 0; p < 3; p++) {
      facility.push(0);
    }
    for (j = 2; j < data.length; j++) {
      facility.push(data[j][i+1]);
    }
    All_facilities.push(facility);
  }
  var dummy = new Array();
  for (i = 0; i < 10; i++){
    dummy.push(0)
  }
  dummy.push("emptyStroke")
  All_facilities.push(dummy);
  //matrix
  for ( i = 2; i < data.length; i++) {
    //a food 
    var facility = new Array();
    for (j = 1; j < 3; j++) {
      facility.push(data[i][j]);
    }
    for (k = 0; k < 8; k++){
      facility.push(0);
    }
    All_facilities.push(facility);
  }
  var dummy = new Array();
  for (i = 0; i < 10; i++){
    if (i ==  2) {
      dummy.push("emptyStroke")
    } else{
      dummy.push(0)
    }
  }

  All_facilities.push(dummy)

  console.log("Parsed: \n", data)
  console.log("by facility \n" , All_facilities);
  console.log("food:\n ", FoodType)

}
////////////////////////////////////////////////////////////
//////////////////////// Set-up ////////////////////////////
////////////////////////////////////////////////////////////

var screenWidth = $(window).innerWidth(), 
  mobileScreen = (screenWidth > 500 ? false : true);

var margin = {left: 50, top: 10, right: 50, bottom: 10},
  width = Math.min(screenWidth, 800) - margin.left - margin.right,
  height = (mobileScreen ? 300 : Math.min(screenWidth, 800)*5/6) - margin.top - margin.bottom;
      
var svg = d3.select("#chart").append("svg")
      .attr("width", (width + margin.left + margin.right))
      .attr("height", (height + margin.top + margin.bottom));
      
var wrapper = svg.append("g").attr("class", "chordWrapper")
      .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");;
      
var outerRadius = Math.min(width, height) / 2  - (mobileScreen ? 80 : 100),
  innerRadius = outerRadius * 0.95,
  opacityDefault = 0.7, //default opacity of chords
  opacityLow = 0.02; //hover opacity of those chords not hovered over
  
//How many pixels should the two halves be pulled apart
var pullOutSize = (mobileScreen? 20 : 50)

//////////////////////////////////////////////////////
//////////////////// Titles on top ///////////////////
//////////////////////////////////////////////////////

var titleWrapper = svg.append("g").attr("class", "chordTitleWrapper"),
  titleOffset = mobileScreen ? 15 : 40,
  titleSeparate = mobileScreen ? 30 : 0;

//Title top left
titleWrapper.append("text")
  .attr("class","title left")
  .style("font-size", mobileScreen ? "12px" : "16px" )
  .attr("x", (width/2 + margin.left - outerRadius - titleSeparate))
  .attr("y", titleOffset)
  .text("Food Type");
titleWrapper.append("line")
  .attr("class","titleLine left")
  .attr("x1", (width/2 + margin.left - outerRadius - titleSeparate)*0.6)
  .attr("x2", (width/2 + margin.left - outerRadius - titleSeparate)*1.4)
  .attr("y1", titleOffset+8)
  .attr("y2", titleOffset+8);
//Title top right
titleWrapper.append("text")
  .attr("class","title right")
  .style("font-size", mobileScreen ? "12px" : "16px" )
  .attr("x", (width/2 + margin.left + outerRadius + titleSeparate))
  .attr("y", titleOffset)
  .text("Facility");
titleWrapper.append("line")
  .attr("class","titleLine right")
  .attr("x1", (width/2 + margin.left - outerRadius - titleSeparate)*0.6 + 2*(outerRadius + titleSeparate))
  .attr("x2", (width/2 + margin.left - outerRadius - titleSeparate)*1.4 + 2*(outerRadius + titleSeparate))
  .attr("y1", titleOffset+8)
  .attr("y2", titleOffset+8);
  
////////////////////////////////////////////////////////////
/////////////////// Animated gradient //////////////////////
////////////////////////////////////////////////////////////

var defs = wrapper.append("defs");
var linearGradient = defs.append("linearGradient")
  .attr("id","animatedGradient")
  .attr("x1","0%")
  .attr("y1","0%")
  .attr("x2","100%")
  .attr("y2","0")
  .attr("spreadMethod", "reflect");


linearGradient.append("animate")
  .attr("attributeName","x2")
  .attr("values","100%;200%")
 .attr("from","100%")
 .attr("to","200%")
  .attr("dur","7s")
  .attr("repeatCount","indefinite");

linearGradient.append("stop")
  .attr("offset","5%")
  .attr("stop-color","#cc4726");
linearGradient.append("stop")
  .attr("offset","45%")
  .attr("stop-color","#6caff7");
linearGradient.append("stop")
  .attr("offset","55%")
  .attr("stop-color","#f9f9f9");
linearGradient.append("stop")
  .attr("offset","95%")
  .attr("stop-color","#E8E8E8");
  
////////////////////////////////////////////////////////////
////////////////////////// Data ////////////////////////////
////////////////////////////////////////////////////////////

 var FoodType = ["Loss during production and processing",
                 "Waste by retailers and consumers","","Fruits and vegetables",
                 "Cereals", "Roots and tubers",
                 "Oilseeds and pulses",
                 "Meat", "Fish and seafood", "Dairy products", ""]

var respondents = 259.7, //Total number of respondents (i.e. the number that makes up the group)
  emptyPerc = 0.5, //What % of the circle should become empty in comparison to the visible arcs
  emptyStroke = Math.round(respondents*emptyPerc); //How many "units" would define this empty percentage

var matrix = [
[0, 0, 0, 16.4, 8.8, 38.8, 24.7, 9.2, 17.7, 5.2, 0],
[0, 0, 0, 4.1, 25.9, 21.4, 27.5, 13.2, 32.1, 14.7, 0], //added 20 to balance it out
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0,emptyStroke],
[15, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[8, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[37, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[23, 26, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[9, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[16, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[5, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, emptyStroke, 0, 0, 0, 0, 0, 0, 0, 0]
]

//Calculate how far the Chord Diagram needs to be rotated clockwise
//to make the dummy invisible chord center vertically
var offset = Math.PI * (emptyStroke/(respondents + emptyStroke))/2;

//Custom sort function of the chords to keep them in the original order
var chord = d3.layout.chord() //d3.layout.chord()
  .padding(.02)
  .sortChords(d3.descending) //which chord should be shown on top when chords cross. Now the biggest chord is at the bottom
  .matrix(matrix);

var arc = d3.svg.arc()
  .innerRadius(innerRadius)
  .outerRadius(outerRadius)
  .startAngle(startAngle) //startAngle and endAngle now include the offset in degrees
  .endAngle(endAngle);

var path = stretchedChord() //Call the stretched chord function 
  .radius(innerRadius)
   .startAngle(startAngle)
   .endAngle(endAngle)
  .pullOutSize(pullOutSize);

////////////////////////////////////////////////////////////
//////////////////// Draw outer Arcs ///////////////////////
////////////////////////////////////////////////////////////

var g = wrapper.selectAll("g.group")
  .data(chord.groups)
  .enter().append("g")
  .attr("class", "group")
  .on("mouseover", fade(opacityLow))
  .on("mouseout", fade(opacityDefault));

g.append("path")
  .style("stroke", function(d,i) {if (FoodType[i] === ""){
                                    return "none"
                                  }else if (FoodType[i] === 
                                    "Loss during production and processing" || 
                                     FoodType[i] === "Waste by retailers and consumers")
                                  {
                                    return "#2096db"
                                  } else {
                                    return "#cc4726"
                                  }})
  .style("fill", function(d,i) {if (FoodType[i] === ""){
                                    return "none"
                                  }else if (FoodType[i] === 
                                    "Loss during production and processing" || 
                                     FoodType[i] === "Waste by retailers and consumers")
                                  {
                                    return "#2096db"
                                  } else {
                                    return "#cc4726"
                                  }})
  .style("pointer-events", function(d,i) { return (FoodType[i] === "" ? "none" : "auto"); })
  .attr("d", arc)
  .attr("transform", function(d, i) { //Pull the two slices apart
        d.pullOutSize = pullOutSize * ( d.startAngle + 0.001 > Math.PI ? -1 : 1);
        return "translate(" + d.pullOutSize + ',' + 0 + ")";
  });

////////////////////////////////////////////////////////////
////////////////////// Append Names ////////////////////////
////////////////////////////////////////////////////////////

//The text also needs to be displaced in the horizontal directions
//And also rotated with the offset in the clockwise direction
g.append("text")
  .each(function(d) { d.angle = ((d.startAngle + d.endAngle) / 2) + offset;})
  .attr("dy", ".35em")
  .attr("class", "titles")
  .style("font-size", mobileScreen ? "8px" : "10px" )
  .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
  .attr("transform", function(d,i) { 
    var c = arc.centroid(d);
    return "translate(" + (c[0] + d.pullOutSize) + "," + c[1] + ")"
    + "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
    + "translate(" + 20 + ",0)"
    + (d.angle > Math.PI ? "rotate(180)" : "")
  })
  .text(function(d,i) { return FoodType[i]; })
  .call(wrapChord, 100);

////////////////////////////////////////////////////////////
//////////////////// Draw inner chords /////////////////////
////////////////////////////////////////////////////////////
 
wrapper.selectAll("path.chord")
  .data(chord.chords)
  .enter().append("path")
  .attr("class", "chord")
  .style("stroke", "none")
  .style("fill", "url(#animatedGradient)") //An SVG Gradient to give the impression of a flow from left to right
  .style("opacity", function(d) { return (FoodType
[d.source.index] === "" ? 0 : opacityDefault); }) //Make the dummy strokes have a zero opacity (invisible)
  .style("pointer-events", function(d,i) { return (FoodType
[d.source.index] === "" ? "none" : "auto"); }) //Remove pointer events from dummy strokes
  .attr("d", path)
  .on("mouseover", fadeOnChord)
  .on("mouseout", fade(opacityDefault));  

////////////////////////////////////////////////////////////
////////////////// Extra Functions /////////////////////////
////////////////////////////////////////////////////////////

//Include the offset in de start and end angle to rotate the Chord diagram clockwise
function startAngle(d) { return d.startAngle + offset; }
function endAngle(d) { return d.endAngle + offset; }

// Returns an event handler for fading a given chord group
function fade(opacity) {
  return function(d, i) {
  wrapper.selectAll("path.chord")
    .filter(function(d) { return d.source.index !== i && d.target.index !== i && FoodType
    [d.source.index] !== ""; })
    .transition()
    .style("opacity", opacity);
  };
}//fade

// Fade function when hovering over chord
function fadeOnChord(d) {
  var chosen = d;
  wrapper.selectAll("path.chord")
    .transition()
    .style("opacity", function(d) {
      return d.source.index === chosen.source.index && d.target.index === chosen.target.index ? opacityDefault : opacityLow;
    });
    

}//fadeOnChord

/*Taken from http://bl.ocks.org/mbostock/7555321
//Wraps SVG text*/
function wrapChord(text, width) {
  text.each(function() {
  var text = d3.select(this),
    words = text.text().split(/\s+/).reverse(),
    word,
    line = [],
    lineNumber = 0,
    lineHeight = 1.1, // ems
    y = 0,
    x = 0,
    dy = parseFloat(text.attr("dy")),
    tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

  while (word = words.pop()) {
    line.push(word);
    tspan.text(line.join(" "));
    if (tspan.node().getComputedTextLength() > width) {
    line.pop();
    tspan.text(line.join(" "));
    line = [word];
    tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
    }
  }
  });
}//wrapChord