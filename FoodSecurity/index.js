const statistics = {"header": ["Program Description" , "Number"],
                    "values": [{"program": "College of Liberal Arts", "number": 22},
                               {"program": "Graduate Engineering", "number": 7},
                               {"program": "School of Engineering", "number": 8}]};



let container = document.getElementById("container");

const svgns = "http://www.w3.org/2000/svg";

let svg = document.createElementNS(svgns, "svg");
svg.setAttribute("width", 500);
svg.setAttribute("height", 500);
container.appendChild(svg);

let chart = document.createElementNS(svgns, "g");
chart.setAttribute("id", "pie-chart");
svg.appendChild(chart);


class PieChart {
    constructor(statistics) {
        this.centerX = 250;
        this.centerY = 250;
        this.radius = 200;
        let sum = 0;
        for (let i = 0; i < statistics.values.length; i++) {
            sum += statistics.values[i].number;
        }
        this.sum = sum;
        this.statistics = statistics;
        for (let i = 0; i < statistics.values.length; i++) {
            this.statistics.values[i]['perc'] = statistics.values[i].number / sum;
        }
    }
}

function getPathDescription() {
    let pchart = new PieChart(statistics);
    let startOuterX = pchart.centerX + pchart.radius;
    let startOuterY = pchart.centerY;
    let startInnerX = pchart.centerX + 100;
    let startInnerY = pchart.centerY;
    let pathDesc = new Array();
    let accumAng = 0;
    for (let value of statistics.values) {

        accumAng += Math.PI * 2 * value.perc;
        let endOuterX = pchart.centerX + Math.cos(accumAng) * pchart.radius;
        let endOuterY = pchart.centerY + Math.sin(accumAng) * pchart.radius;
        let endInnerX = pchart.centerX + Math.cos(accumAng) * 100;
        let endInnerY = pchart.centerY + Math.sin(accumAng) * 100;
        let currAng = Math.PI * 2 * value.perc;
        if (currAng < Math.PI) {
          pathDesc.push(`M${startInnerX},${startInnerY}
                  L${startOuterX},${startOuterY}
                  A${pchart.radius},${pchart.radius} 0, 0, 1, ${endOuterX},${endOuterY}
                  L${endInnerX},${endInnerY}
                  A100, 100, 0, 0, 0, ${startInnerX}, ${startInnerY} z`);
        } else {
          pathDesc.push(`M${startInnerX},${startInnerY}
                  L${startOuterX},${startOuterY}
                  A${pchart.radius},${pchart.radius} 0, 1, 1, ${endOuterX},${endOuterY}
                  L${endInnerX},${endInnerY}
                  A100, 100, 0, 1, 0, ${startInnerX}, ${startInnerY} z`);
        }

        startInnerX = endInnerX;
        startInnerY = endInnerY;
        startOuterX = endOuterX;
        startOuterY = endOuterY;
    }
    return pathDesc;
}


//The below is an example which creates a pie chart consisting of 4 pie slices, but it does not use the given dataset.
/*let pathDescriptions = ["M250,250 L250,50 A200,200 0 0,1 450,250 z",
                        "M250,250 L450,250 A200,200 0 0,1 250,450 z",
                        "M250,250 L250,450 A200,200 0 0,1 50,250 z",
                        "M250,250 L50,250 A200,200 0 0,1 250,50 z"];
                        */
let pathDescriptions = getPathDescription();
let counter = 0;


const clrs  = ["#e7ef8d", "#89d160", "#4286f4"];
const highlightClrs = ["#fcf11b", "#4fad3e", "#3453ef"];

for(const description of pathDescriptions){

  let path = document.createElementNS(svgns, "path");
  path.setAttribute("d", description);
  path.setAttribute("stroke", "black");
  path.setAttribute("fill", clrs[counter]);
  path.setAttribute("id", counter);
  counter+=1;

  path.addEventListener("mouseover", function(event){
    console.log("mouseover");
    path.setAttribute("fill", highlightClrs[path.id]);

  });

  path.addEventListener("mouseleave", function(event){
    console.log("mouseleave");
    path.setAttribute("fill", clrs[path.id]);
  });

  chart.appendChild(path);
}


console.log(container);
