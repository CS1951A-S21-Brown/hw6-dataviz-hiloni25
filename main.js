// Add your JavaScript code here
console.log("entered js file");
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 400;//250
let graph_2_width = (MAX_WIDTH / 2) - 10 + 100, graph_2_height = 275 + 600;
let graph_3_width = MAX_WIDTH / 3 , graph_3_height = 400;




d3.csv("../data/netflix.csv").then(function(data) {

  const piefn = d3.pie()
  if(graph_1_width < graph_1_height){
    radius = graph_1_width/2;
  }
  else{
    radius = graph_1_height/2;
  }
  let svg = d3.select("#graph1")
      .append("svg")
      .attr("width", graph_1_width)
      .attr("height", graph_1_height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top+margin.right+20})`);

  const in_out = d3.arc().outerRadius(radius).innerRadius(0);

  data = cleanDatagraph1(data);
  console.log("pie");
  console.log(data);

  dataCount = [];
  data.forEach(d => {
    dataCount.push(d.count);
  });

  console.log(dataCount);

  //console.log("issue");
  len = data.length;
  //console.log("issue solved");
  let color = d3.scaleOrdinal().range(d3.quantize(d3.interpolateHcl("#d3f8e2", "#e4c1f9", "#f694c1","#ede7b1","#a9def9","#e3e3e7","#d4d4eb","#cbcab6","#eaeabe","#bfcof2"),len));

  piefn.value(function(d){return d.count;})

  console.log("entering pies");

  const arcs = svg.selectAll('.arc')
                .data(piefn(data))
                .enter();

  console.log("pies");

  var interaction = d3.select("#graph1").append("div").attr("class","interaction");

  function mouseoverfn(d){
    console.log("I am inside");
    interaction.text("Genre: "+d.data.genre+", Count: "+d.data.count+", Percentile: "+percentilecalculation(dataCount,d.data.count));
    interaction.style("visibility", "visible").style("font-weight","bold").style("margin-left","120px");
  }




  arcs.append('path')
    .attr('d', in_out)
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .attr('fill', function(d){return color(d.data.count);})
    .on("mouseover", function(d){return mouseoverfn(d)})

  let title = svg.append("text")
      .attr("transform", `translate(${(graph_2_width - margin.left - margin.right)/2 -200 }, ${-150})`)       // HINT: Place this at the top middle edge of the graph
      .style("text-anchor", "bottom")
      .style("font-size", 15);

  title.text('Genres with respective count of title');



});

function percentilecalculation(countArray, count){
  belowVal = 0
  len = countArray.length;
  //equalVal = 0
  countArray.forEach(d => {
      if(d < count){
          belowVal += 1;
      }
      if(d == count){
          belowVal += 0.5;
      }
  });
  return ((100*belowVal)/len).toFixed(2);

}

function cleanDatagraph1(data){
  console.log(data);
  var graph1Dict = new Object();
  data.forEach(d => {
    splitted_list=d['listed_in'].split(',');

    splitted_list.forEach(genre => {
      genre = String(genre).trim();
      if(genre in graph1Dict){
        graph1Dict[genre] = graph1Dict[genre] + 1;
      }
      else{
        graph1Dict[genre] = 1;
      }
    }); //splitted list loop ends here


})//data loop ends here
console.log(graph1Dict);
var outdata = [];

for (let k in graph1Dict){
  console.log(k);
  outdata.push({genre: k, count: graph1Dict[k]});
}

console.log(outdata);
return(outdata);

};  
