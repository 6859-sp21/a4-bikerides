


function setMarkerAppearanceSelected(marker) {
   marker
      .attr("stroke","black")
      .attr("stroke-width", 5)
      //.attr("fill-opacity", 0.8);
}

function setMarkerAppearanceHover(marker) {
   marker
      .attr("stroke", "black")
      .attr("stroke-width", 4)
      //.attr("fill-opacity", 0.8);
}

function setMarkerAppearanceUnselected(marker) {
   marker
      .attr("stroke", marker.style("fill"))
      .attr("stroke-width", 1)
      .attr("fill-opacity", 0.4);
}

function hideTooltip() {
   tooltip
      .transition().duration(500)
      .style("opacity", 0);
}
function showTooltip() {
   tooltip
      .transition().duration(0)
      .style("opacity", 0.9)
      .style("left", (event.pageX) + "px")
      .style("background", "white")
      .style("top", (event.pageY - 80) + "px")
      .style("cursor", "pointer");
}

function addStationMarkers() {
  circleMarker
    .attr("cx", function(d) {
      return project(d).x;
    })
    .attr("cy", function(d) {
      return project(d).y;
    });
}

function setUpBubbles() {
   circleMarker = svg
      .selectAll("circle")
      .data(stationData)
      .enter()
      .append("circle")
      .attr("r", 5)
      .style("fill", "#808080")
      .attr("stroke", "#808080")
      .attr("stroke-width", 1)
      .attr("fill-opacity", 0.4)
      .attr("class", "circle")
      .attr("stationId", function(d){ return d['station id']})
      .attr("stationName", function(d){ return d['station name']})
      .attr("id", function(d){ return "station-" + d['station id']})
      .on("mouseover", function(d) {
           setMarkerAppearanceHover(d3.select(this));
      })
      .on("mousemove", function(event, d) {
          {
            d3.select(this).style("cursor", "pointer");
            if (selectedStation.stationId === null ||
                  d3.select(this).attr("stationId") != selectedStation.stationId ){
               var tooltipText ;
               if (selectedStation.stationId === null) {
                  tooltipText =
                  "<b>"+d['station name']+"</b><br/>"
                  + (+d.arrivals + d.departures) + " riders" +"<br/>"
                  + "(" + d.arrivals + " arriving, "
                  + d.departures + " leaving)";
                }
                else {
                   tooltipText =
                  "<b>"+d['station name']+"</b><br/>"
                  + "<i>From / to " + selectedStation.bubble.attr("stationName") +"</i><br/>"
                  + (+d.specificArrivals +d.specificDepartures)+" riders " +"<br/>"
                  + "(" + d.specificArrivals + " arriving from, "
                  + d.specificDepartures + " leaving to)";
                }
               tooltip.html(tooltipText)
               showTooltip();
            }
          }
      })
      .on("mouseout", function(event, d) {
         hideTooltip();
         if(d3.select(this).attr("stationId") == selectedStation.stationId ) {
            setMarkerAppearanceSelected(d3.select(this));
         } else {
            setMarkerAppearanceUnselected(d3.select(this));
         }
      })
      .on("click", function(event, d){
         // No bubble currently selected, or user selected a different bubble
         if (selectedStation.stationId === null ||
               d3.select(this).attr("stationId") != selectedStation.stationId) {
            d3.select(this).classed("selected", true);
            if (selectedStation.stationId !== null) {
               setMarkerAppearanceUnselected(selectedStation.bubble);
            }
            selectedStation.select(d['station id']);
            hideTooltip();
            computeStationSpecificStats(d['station id']);
            updateMarkersAndLegend();
         }
         // User clicked on same bubble
         else {
            selectedStation.bubble.classed("selected", false);
            setMarkerAppearanceUnselected(selectedStation.bubble);
            selectedStation.clear();
            updateMarkersAndLegend();
            hideInfobox();
         }
        
    })
    
    addStationMarkers();
}


              