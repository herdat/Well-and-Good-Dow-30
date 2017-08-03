function bubbleChart() {


    function chart(selection) {
        var data = selection.enter().data();
        var div = selection,
            svg = div.selectAll('svg');
        svg.attr('width', width).attr('height', height);


// setup x 
// var xValue = function(d) { return d.esg}, // data -> value
//     xScale = d3.scaleLinear().range([100, width - 100]), // value -> display
//     xMap = function(d) { return xScale(xValue(d));}, // data -> display
//     xAxis = d3.axisBottom(xScale)

// setup y
var yValue = function(d) { 
        return d.esg}, // data -> value
    yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([900, 200]), // value -> display
    yMap = function(d) { return yScale(d.esg)},
    yE = function(d) { return yScale(d.e)},
    yS = function(d) { return yScale(d.s)},
    yG = function(d) { return yScale(d.g)}, // data -> display
    yAxis = d3.axisLeft(yScale);


    // xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
    yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1])





        var tooltip = selection
            .append("div")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("padding", "20px")
            .style("background-color", "rgba(58, 16, 45, .5)")
            .style("border-radius", "10px")
            .style("text-align", "left")
            .style("font-size", "10pt")
            .style("font-family", "gotham")
            .style("width", "220px")
            .text("");


        var elevationMode = 'overall';

        // var colorCircles = d3.scaleOrdinal(d3.schemeCategory10);
        var scaleRadius = d3.scaleLinear().domain([d3.min(data, function(d) {
            return +d.marketcap;
        }), d3.max(data, function(d) {
            return +d.marketcap;
        })]).range([5, 115])

        var simulation = d3.forceSimulation(data)
            .force("x", d3.forceX(550).strength(.04))
            // .force("y", d3.forceY().strength())
            .force("collide", d3.forceCollide(function(d) {
                return scaleRadius(d.marketcap) + 80
            })) 
            .on("tick", ticked);

        function ticked(e) {
            node.attr("cx", function(d) {
                    return d.x;
                })
        }

        var node = svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr('r', function(d) {
                return scaleRadius(d.marketcap)
            })
            .style("fill", function(d) {
                switch(d.sector) {
                    case 'Consumer':
                        return '#ff0000'
                        break
                    case 'Technology':
                        return '#00A6FF'
                        break
                    case 'Health Care':
                        return '#f9029d'                        
                        break
                    case 'Financial Services':
                        return '#00ff00'
                        break
                    case 'Basic Materials':
                        return '#32d69b'
                        break
                    case 'Industrials & Transportation':
                        return '#f27d0c'
                        break
                    case 'Media & Telecom':
                        return '#e4eaf0'
                        break
                    case 'Energy & Utilities':
                        return '#ebf90d'
                        break
                }
               
            })

           
            // .attr("cx", xMap)
            .attr("cy", yMap)
         

//HOVER COMPANY INFO/SECTOR
            .style("opacity", 0.8)   
                // .attr('transform', 'translate(' + [width / 2, height / 2] + ')')
            .on("mouseover", function(d) {
                fade(d.sector, .05);

                var scoreHeader,
                    score,
                    label;

                switch(elevationMode) {
                    case 'overall':
                        scoreHeader = "Overall ESG Score"
                        score = d.esg
                        label = d.esglabel
                        break;
                    case 'environmental':
                        scoreHeader = "Environmental Score"
                        score = d.e
                        label = d.elabel
                        break;
                    case 'social':
                        scoreHeader = "Social Score"
                        score = d.s
                        label = d.slabel
                        break;
                    case 'governance':
                        scoreHeader = "Governance Score"
                        score = d.g
                        label = d.glabel
                        break;
                }

                tooltip.html(
                    "<h>"
                    + d.company
                    + "</h>" 
                    + "<br>" 
                    + "<i>"
                    + d.sector 
                    + "</i>"
                    + "<hr>"
                    + "<h1>"
                    + "Market Cap (Radius)"  
                    + "<br>"
                    + "<i1>"
                    + d.marketcap 
                    + "B" 
                    + "</i1>"
                    + "<br>"
                    + "<hr>"
                    + "<h1>"
                    + scoreHeader
                    + "<br>"
                    + "<i1>"
                    + score
                    + "<br>"
                    + "<h1>"
                    + "Industry Comparison"
                    + "<br>"
                    + "<i3>" 
                    + label
                );
                return tooltip.style("visibility", "visible")
                ;
            })
            .on("mousemove", function() {
                return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
            })
            .on("mouseout", function() {
                fadeOut();
                return tooltip.style("visibility", "hidden");
            });

            function fade(sector, opacity) {
                              svg.selectAll("circle")
                                  .filter(function (d) {
                                      return d.sector != sector;
                                  })
                                .transition()
                                 .style("opacity", opacity);
                          }

            function fadeOut() {
                              svg.selectAll("circle")
                              .transition()
                                 .style("opacity",0.85);
                          }
    

//BUTTONS
d3.select("#esg").on("click", function() {
    elevationMode = 'overall';
    svg.selectAll("circle")
        .transition()
        .attr("cy", yMap) 
        .duration(2000)
})

d3.select("#e").on("click", function() {
    elevationMode = 'environmental';
    svg.selectAll("circle")
        .transition()
        .attr("cy", yE) 
        .duration(2000) 
    })

d3.select("#s").on("click", function() {
    elevationMode = 'social';
    svg.selectAll("circle")
        .transition()
        .attr("cy", yS) 
        .duration(2000) 
    })

d3.select("#g").on("click", function() {
    elevationMode = 'governance';
    svg.selectAll("circle")
        .transition()
        .attr("cy", yG) 
        .duration(2000) 
    })

// )
}

// d3.select(".nav").classed("current",true)
// // .on("click", function() {
// //     this.classed("current", true) 
// //     console.log("Hey Dayr")
// // }
// // )
    
 // // draw legend
 //  var legend = svg.selectAll(".legend")
 //      .data(color.domain())
 //    .enter().append("g")
 //      .attr("class", "legend")
 //      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })

 //  // draw legend colored rectangles
 //  legend.append("rect")
 //      .attr("x", width - 18)
 //      .attr("width", 18)
 //      .attr("height", 18)
 //      .style("fill", color)

 //  // draw legend text
 //  legend.append("text")
 //      .attr("x", width - 24)
 //      .attr("y", 9)
 //      .attr("dy", ".35em")
 //      .style("text-anchor", "end")
 //      .text(function(d) { return d })


    chart.width = function(value) {
        if (!arguments.length) {
            return width;
        }
        width = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) {
            return height;
        }
        height = value;
        return chart;
    };


    chart.columnForColors = function(value) {
        if (!arguments.sector) {
            return sector;
        }
        sector = value;
        return chart;
    };

    chart.marketcap = function(value) {
        if (!arguments.marketcap) {
            return marketcap;
        }
        marketcap = value;
        return chart;
    };

    return chart;
}
