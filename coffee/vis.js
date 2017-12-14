var area, areas, color, createLegend, data, display, duration, height, hideLegend, line, paddingBottom, showLegend, stack, stackedAreas, start, streamgraph, svg, transitionTo, width, x, xAxis, y;

paddingBottom = 20;

width = 880;

height = 600 - paddingBottom;

duration = 750;

x = d3.time.scale().range([0, width]);

y = d3.scale.linear().range([height, 0]);

color = d3.scale.category10();

area = d3.svg.area().interpolate("basis").x(function(d) {
  return x(d.Year);
});

line = d3.svg.line().interpolate("basis").x(function(d) {
  return x(d.Year);
});

stack = d3.layout.stack().values(function(d) {
  return d.values;
}).x(function(d) {
  return d.Year;
}).y(function(d) {
  return d.insecurePercent;
}).out(function(d, y0, y) {
  return d.insecurePercent0 = y0;
}).order("reverse");

xAxis = d3.svg.axis().scale(x).tickSize(-height).tickFormat(d3.time.format('%Y'));

data = null;

svg = d3.select("#vis").append("svg").attr("width", width).attr("height", height + paddingBottom);

transitionTo = function(name) {
  if (name === "stream") {
    streamgraph();
  }
  if (name === "stack") {
    stackedAreas();
  }
  if (name === "area") {
    return areas();
  }
};

start = function() {
  var g, index, maxYear, minYear, requests, years;
  minYear = d3.min(data, function(d) {
    return d.values[0].Year;
  });
  maxYear = d3.max(data, function(d) {
    return d.values[d.values.length - 1].Year;
  });
  x.domain([minYear, maxYear]);
  years = data[0].values.map(function(v) {
    return v.Year;
  });
  index = 0;
  years = years.filter(function(d) {
    index += 1;
    return (index % 2) === 0;
  });
  xAxis.tickValues(years);
  svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
  area.y0(height / 2).y1(height / 2);
  g = svg.selectAll(".request").data(data).enter();
  requests = g.append("g").attr("class", "request");
  requests.append("path").attr("class", "area").style("fill", function(d) {
    return color(d.key);
  }).attr("d", function(d) {
    return area(d.values);
  });
  requests.append("path").attr("class", "line").style("stroke-opacity", 1e-6);
  createLegend();
  return streamgraph();
};

streamgraph = function() {
  var t;
  stack.offset("wiggle");
  stack(data);
  y.domain([
    0, d3.max(data[0].values.map(function(d) {
      return d.insecurePercent0 + d.insecurePercent;
    }))
  ]).range([height, 0]);
  line.y(function(d) {
    return y(d.insecurePercent0);
  });
  area.y0(function(d) {
    return y(d.insecurePercent0);
  }).y1(function(d) {
    return y(d.insecurePercent0 + d.insecurePercent);
  });
  t = svg.selectAll(".request").transition().duration(duration);
  t.select("path.area").style("fill-opacity", 1.0).attr("d", function(d) {
    return area(d.values);
  });
  return t.select("path.line").style("stroke-opacity", 1e-6).attr("d", function(d) {
    return line(d.values);
  });
};

stackedAreas = function() {
  var t;
  stack.offset("zero");
  stack(data);
  y.domain([
    0, d3.max(data[0].values.map(function(d) {
      return d.insecurePercent0 + d.insecurePercent;
    }))
  ]).range([height, 0]);
  line.y(function(d) {
    return y(d.insecurePercent0);
  });
  area.y0(function(d) {
    return y(d.insecurePercent0);
  }).y1(function(d) {
    return y(d.insecurePercent0 + d.insecurePercent);
  });
  t = svg.selectAll(".request").transition().duration(duration);
  t.select("path.area").style("fill-opacity", 1.0).attr("d", function(d) {
    return console.log(d.values);
  }).attr("d", function(d) {
    return area(d.values);
  });
  return t.select("path.line").style("stroke-opacity", 1e-6).attr("d", function(d) {
    return line(d.values);
  });
};

areas = function() {
  var g, t;
  g = svg.selectAll(".request");
  line.y(function(d) {
    return y(d.insecurePercent0 + d.insecurePercent);
  });
  g.select("path.line").attr("d", function(d) {
    return line(d.values);
  }).style("stroke-opacity", 1e-6);
  y.domain([
    0, d3.max(data.map(function(d) {
      return d.maxCount;
    }))
  ]).range([height, 0]);
  area.y0(height).y1(function(d) {
    return y(d.insecurePercent);
  });
  line.y(function(d) {
    return y(d.insecurePercent);
  });
  t = g.transition().duration(duration);
  t.select("path.area").style("fill-opacity", 0.5).attr("d", function(d) {
    return area(d.values);
  });
  return t.select("path.line").style("stroke-opacity", 1).attr("d", function(d) {
    return line(d.values);
  });
};

showLegend = function(d, i) {
  return d3.select("#legend svg g.panel").transition().duration(500).attr("transform", "translate(0,0)");
};

hideLegend = function(d, i) {
  return d3.select("#legend svg g.panel").transition().duration(500).attr("transform", "translate(165,0)");
};

createLegend = function() {
  var keys, legend, legendG, legendHeight, legendWidth;
  legendWidth = 200;
  legendHeight = 245;
  legend = d3.select("#legend").append("svg").attr("width", legendWidth).attr("height", legendHeight);
  legendG = legend.append("g").attr("transform", "translate(165,0)").attr("class", "panel");
  legendG.append("rect").attr("width", legendWidth).attr("height", legendHeight).attr("rx", 4).attr("ry", 4).attr("fill-opacity", 0.5).attr("fill", "white");
  legendG.on("mouseover", showLegend).on("mouseout", hideLegend);
  keys = legendG.selectAll("g").data(data).enter().append("g").attr("transform", function(d, i) {
    return "translate(" + 5. + "," + (10 + 40 * (i + 0)) + ")";
  });
  keys.append("rect").attr("width", 30).attr("height", 30).attr("rx", 4).attr("ry", 4).attr("fill", function(d) {
    return color(d.key);
  });
  return keys.append("text").text(function(d) {
    return d.key;
  }).attr("text-anchor", "left").attr("dx", "2.3em").attr("dy", "1.3em");
};

display = function(error, rawData) {
  var filterer, parseTime;
  filterer = {
    "White non-Hispanic": 1,
    "Black non-Hispanic": 1,
    "Hispanic": 1,
    "Other": 1
  };
  data = rawData.filter(function(d) {
    return filterer[d.key] === 1;
  });
  parseTime = d3.time.format.utc("%Y").parse;
  data.forEach(function(s) {
    s.values.forEach(function(d) {
      d.Year = parseTime(d.Year);
      return d.insecurePercent = parseFloat(d.insecurePercent);
    });
    return s.maxCount = d3.max(s.values, function(d) {
      return d.insecurePercent;
    });
  });
  data.sort(function(a, b) {
    return b.maxCount - a.maxCount;
  });
  console.log(data);
  return start();
};

$(function() {
  d3.selectAll(".switch").on("click", function(d) {
    var id;
    d3.event.preventDefault();
    id = d3.select(this).attr("id");
    return transitionTo(id);
  });
  return d3.json("data/by_race.json", display);
});
