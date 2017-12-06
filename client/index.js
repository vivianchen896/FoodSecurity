// get the file
$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/foodsecurity_datafile.csv",
        dataType: "text",
        success: function(data) {processData(data);}
     });
});

// parse
function processData(data) {
  Papa.parse(data, {
  	complete: function(results) {
      draw(results.data);
  	}
  });
}

// actually draw
function draw(data) {
  console.log("Parsed: \n", data)
}
