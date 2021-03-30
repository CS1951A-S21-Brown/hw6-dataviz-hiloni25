console.log("entered third file");
var svg3 = d3.select("#graph3").append("svg").attr("width", graph_3_width).attr("height", graph_3_height)
            .call(d3.zoom().on("zoom", zoomFunction))//.append("g");

var zooming = svg3.append("g");
function zoomFunction(){
  return zooming.attr("transform",d3.event.transform);
}

d3.csv("../data/netflix.csv").then(function(data) {
  dataset = cleanDatagraph3(data);
  console.log("dataset");
  console.log(dataset);
  var radius = 4;

  var forcesim = d3.forceSimulation(dataset.nodes)
                  .force("charge", d3.forceManyBody().strength(-850))
                  .force("link", d3.forceLink(dataset.links).id(function(d) {return d.id; }).strength(1.5).distance(40))
                  .force("center", d3.forceCenter(graph_3_width/2, graph_3_height/2))
                  .on("tick",updateNodes)

  forcesim.force("x", d3.forceX(graph_3_width / 2).strength(1.5))
          .force("y", d3.forceY(graph_3_height / 2).strength(1.5));

  var link = zooming.append("g").selectAll("line").data(dataset.links).enter().append("line").attr("stroke","#d3f8e2");
  var node = zooming.append("g").selectAll("circle").data(dataset.nodes).enter().append("circle")
              .attr("r",radius)
              .on("mouseover", function(d){ mouseover(d)})
              .call(d3.drag());



  var printValue = document.getElementById("nodeValue")

  function mouseover(d){
    console.log("inside mouseover");
    console.log(d.id);
    var outputValue = d.id
    printValue.innerHTML = outputValue;

  }

  function updateNodes(){
    console.log("updating nodes");

    link.attr("x1", function(d) { return d.source.x; }).attr("y1", function(d) { return d.source.y; }).attr("x2", function(d) { return d.target.x; }).attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function (d) { return d.x; }).attr("cy", function(d) { return d.y; });

  }

});

function cleanDatagraph3(data){
            console.log("data3");
            console.log(data);
            var graph3nodes = [];
            var graph3links = [];
            var track = [];
            var id = 1;
            var startId = 0
            data.forEach(d => {
              castSplit = d['cast'].split(',');
              if(castSplit.length > 1 && track.length <= 100){
              var startId = id;
              var l = [];
              castSplit.forEach(actor => {

                if(track.includes(actor.trim()) == false){
                graph3nodes.push({'id': actor.trim()});
                track.push(actor.trim());
                }
                l.push(actor.trim());


              });

              for (i=0; i< l.length - 1; i++){
                for (j=i+1; j< l.length; j++){
                  graph3links.push({'source': l[i], 'target': l[j]});
                }
              }


            }

            });
            console.log("here");
            console.log(graph3nodes);
            console.log(graph3links);
            return {"nodes": graph3nodes, "links": graph3links};

          }  
