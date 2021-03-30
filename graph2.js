console.log("entered js file 2");


let svg = d3.select("#graph2")
    .append("svg")
    .attr("width", graph_2_width)
    .attr("height", graph_2_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


let x = d3.scaleLinear()
    .range([0,graph_2_width - margin.left - margin.right]);


console.log("x range");
console.log(x.range());

let y = d3.scaleBand()
    .range([0,graph_2_height - margin.top - margin.bottom])
    .padding(0.1);

let countRef = svg.append("g");
let y_axis_label = svg.append("g");

svg.append("text")
    .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2},
                                    ${(graph_2_height - margin.top - margin.bottom) + 30})`)
    .style("text-anchor", "middle")
    .text("Average movie runtime");


let y_axis_text = svg.append("text")//year
    .attr("transform", `translate(-80, ${(graph_2_height - margin.top - margin.bottom) / 2})`)
    .style("text-anchor", "middle")
    .style("font-size", 13);


let title = svg.append("text")//graph title
    .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2}, ${-20})`)
    .style("text-anchor", "middle")
    .style("font-size", 15);



function updateChange(el){

  let rangeVal = arguments[0];

  startDate = rangeVal.split(',')[0];
  endDate = rangeVal.split(',')[1];
  console.log("startDate");
  console.log(startDate);
  console.log("endDate");
  console.log(endDate);




  d3.csv("../data/netflix.csv").then(function(data) {

  console.log(data);
  data = cleanDatagraph2(data, startDate, endDate);
  console.log("----");
  console.log(data);

  x.domain([0,d3.max(data, function(d) {return d.avg;})]);

  console.log(x.domain());

  y.domain(data.map(function(d) { return d['year'];}));

  y_axis_label.call(d3.axisLeft(y).tickSize(0).tickPadding(10));

  let bars = svg.selectAll("rect").data(data);

  let color = d3.scaleOrdinal().range(d3.quantize(d3.interpolateHcl("#a9def9"),endDate - startDate + 1));


  bars.enter()
      .append("rect")
      .merge(bars)
      .transition()
      .duration(1000)
      .attr("fill", function(d) { return color(d['year']) })
      .attr("x", x(0))
      .attr("y", function(d) {return y(d['year'])})
      .attr("width", function(d) {return x(d.avg)})
      .attr("height", y.bandwidth());

      let counts = countRef.selectAll("text").data(data);



      counts.enter()
          .append("text")
          .merge(counts)
          .transition()
          .duration(1000)
          .attr("x", function(d) {return x(d.avg)})
          .attr("y", function(d) {return y(d['year'])})
          .style("text-anchor", "start")
          .text(function(d) {return (d.avg.toFixed(2))})
          .attr("transform", `translate(10, 7)`)
          .style("font-size", "10px") ;

      y_axis_text.text('year');
      title.text("Average movie runtime per year");


      bars.exit().remove();
      counts.exit().remove();

})

};

function cleanDatagraph2(data,startDate,endDate){

  var graph2Dict = new Object();
  data.forEach(d => {

      if(d['type'] == 'Movie'){
      year = d["release_year"];
      duration = parseInt(d["duration"].split(" ")[0]);

      if(year in graph2Dict){

        graph2Dict[year] = [graph2Dict[year][0] + duration, graph2Dict[year][1] + 1];
      }
      else{

        graph2Dict[year] = [duration,1];

      }
    }
    }); //splitted list loop ends here


console.log(graph2Dict);
var outdata = [];

for (let k in graph2Dict){
  console.log(k);
  if(k >= parseInt(startDate) && k<= parseInt(endDate)){
  average = graph2Dict[k][0]/graph2Dict[k][1]
  outdata.push({year: k, avg: average});
  }
}

console.log(outdata);
return(outdata);

}   
