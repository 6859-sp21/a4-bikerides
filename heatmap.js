// Code for rendering a voronoi diagram heatmap using station locations as points

// Constants
const SHOW_HEATMAP = true
const TIME_SLICE_DURATION = 120 // in minutes
const NUM_TRIPS_TO_USE = 20000 // number of trips to use from the dataset
const NUM_SLICES = 12 // number of slices to display

// Global variables
var stationData, tripsData
var stationDataMap = new Map()
var timeSliceData
var voronoi, voronoiPolys
var currentTimeSliceIndex = 0

// Callback function for window slice slider
function onSlider(val) {
    console.log("Slider changed: ", val)
    let sliceData = timeSliceData[val][1]
    console.log("slider: sliceData ", sliceData)
    currentTimeSliceIndex = val
    d3BindData(stationData, stationDataMap)
}

// Called to whenver the data view changes to perform the d3 data -> UI binding
function d3BindData(stationData, stationDataMap) {
    if (!SHOW_HEATMAP) {
        return
    }

    sliceData = timeSliceData[currentTimeSliceIndex][1]

    console.log("d3JoinData() called.")
    console.log("sliceData: ", sliceData)
    // Voronoi guide: https://observablehq.com/@mbostock/u-s-airports-voronoi

    // Grab heatmap SVG group and set attributes
    var gHeatmap = d3.select("#heatmap")
        .attr("fill", "none")
        // .attr("stroke", "red")
        .attr("pointer-events", "all");

    gHeatmap.selectAll("path")
        .data(voronoiPolys)
        .join(
            enter => enter
                .append("path")
                .attr("d", polygonF)
                .attr("fill", getStationColor),
            update => update
                .attr("fill", getStationColor)
                .attr("d", polygonF),
            exit => exit.remove()
        )

    var maxStationID = 446

    // var minNetIncoming = Math.max(...stationData.map(v => v.netincoming))
    // var maxNetIncoming = Math.min(...stationData.map(v => v.netincoming))
    // console.log("minNetIncoming: ", minNetIncoming)
    // console.log("maxNetIncoming: ", maxNetIncoming)

    function getStationColor(d) {
        // TODO: replace with trip value
        let stationID = d.metadata["station id"]
        let stationData = stationDataMap.get(stationID)

        let colorValue = sliceData.get(stationID)
        if (colorValue == null) {
            colorValue = 0
        }

        let pct = colorValue / 20

        pct = Math.min(pct, 1.0)
        return `hsla(36, ${pct * 100}%, 63%, 0.7)`
    }

    function polygonF(d) {
        d = d.poly
        d = d.filter(v => v != null)

        let p = d.map(v => {
            // return albersProjection([v[1], v[0]])
            let point = {latitude: v[0], longitude: v[1]}
            return project(point).x + " " +project(point).y
        })
        return "M" + p.join("L") + "Z";
    }

}


function computeStationTraffic(stationData, tripsData) {
    console.log("Computing station traffic...")
    stationData.forEach(function (d) {
        d.arrivals = tripsData.filter(trip => (trip['end station id'] == d['station id'])).length;
        d.departures = tripsData.filter(trip => (trip['start station id'] == d['station id'])).length;
        d.netincoming = d.arrivals - d.departures
    })
    console.log("Done computing station traffic...")
}

// Given the a subset of the raw trip-level dataset, calculate aggregate metrics for time slices of the 
// specified duration
// @param: sliceDuration - duration of a slice in minutes
function createTimeSliceData(tripsData, sliceDuration, numSlices) {
    console.log("Calculating time slice data...")

    var sliceDurationSeconds = sliceDuration * 60

    var sliceMap = new Map()

    // unixtime in seconds
    var earliestStartTime = Math.floor(new Date(tripsData[0]["starttime"]).getTime() / 1000)
    var latestEndTime = Math.floor(new Date(tripsData[0]["stoptime"]).getTime() / 1000)

    console.log("earliest: ", earliestStartTime)
    console.log("latest: ", latestEndTime)

    tripsData.forEach(v => {
        let newStarttime = Math.floor(new Date(v["starttime"]).getTime() / 1000)
        let newEndtime = Math.floor(new Date(v["stoptime"]).getTime() / 1000)

        if (newStarttime < earliestStartTime) {
            earliestStartTime = newStarttime
        }

        if (newEndtime > latestEndTime) {
            latestEndTime = newEndtime
        }
    })

    for (let i = earliestStartTime; i < latestEndTime; i += sliceDurationSeconds) {
        sliceMap.set(i, { startTime: i, endTime: i + sliceDurationSeconds, tripsStarting: [], tripsEnding: [] })
    }

    sortedTrips = tripsData.sort((a, b) => a["starttime"] < b["starttime"])

    console.log("sorted trips: ", sortedTrips)

    // Bucket each trip into a time slice
    let currentSliceStart = earliestStartTime

    // TODO(bdnwang): bucketing logic is jank, pls fix later
    sortedTrips.forEach(v => {
        let tripStartTime = Math.floor(new Date(v["starttime"]).getTime() / 1000)

        while (tripStartTime > (currentSliceStart + sliceDurationSeconds)) {
            currentSliceStart += sliceDurationSeconds
        }

        let sliceData = sliceMap.get(currentSliceStart)
        sliceData["tripsStarting"].push(v)
    })

    sortedEndTimeTrips = tripsData.sort((a, b) => a["stoptime"] < b["stoptime"])
    console.log("sortedEndTimeTrips: ", sortedEndTimeTrips)

    currentSliceStart = earliestStartTime
    // TODO: end time trip bucketing gives weirdly clustered bucket assignments. should investigate
    sortedEndTimeTrips.forEach(v => {
        let tripEndTime = Math.floor(new Date(v["stoptime"]).getTime() / 1000)

        while (tripEndTime > (currentSliceStart + sliceDurationSeconds)) {
            currentSliceStart += sliceDurationSeconds
        }

        let sliceData = sliceMap.get(currentSliceStart)
        sliceData["tripsEnding"].push(v)
    })
    console.log("SLICE MAP: ", sliceMap)

    // Use the sliceData to calculate the per-station values for each time slice
    var finalStationValues = new Map()

    sliceMap.forEach((value, key) => {
        let tripsStarting = value["tripsStarting"]

        let stationValuesForSlice = new Map()

        tripsStarting.forEach(v => {
            let stationID = v["start station id"]
            let oldValue = stationValuesForSlice.get(stationID)
            if (oldValue == null) {
                oldValue = 0
            }

            stationValuesForSlice.set(stationID, oldValue + 1)
        })

        finalStationValues.set(key, stationValuesForSlice)
    })


    finalStationValues = Array.from(finalStationValues, ([key, value]) => [key, value])
    finalStationValues.sort((a, b) => a[0] < b[0])

    finalStationValues = finalStationValues.slice(0, numSlices)

    console.log("FINAL STATION VALUES: ", finalStationValues)
    console.log("Done calculating time slice data...")



    return finalStationValues
}


// Setup the heatmap using the given station data and trips dataset
function setupHeatmap(loadedStationData, loadedTripsData) {
    if (!SHOW_HEATMAP) {
        return
    }
    console.log("ready() called")
    console.log("LOADED TRIPS DATA: ", loadedTripsData)
    console.log("LOADED STATION DATA: ", loadedStationData)

    // convert stationData to a id -> data map

    loadedStationData.forEach(v => {
        stationDataMap.set(v["station id"], v)
    });
    console.log(stationDataMap)

    // var gStations = d3.select("#stations")
    //     .attr("fill", "CornflowerBlue")
    //     .attr("stroke", "CornflowerBlue")
    //     .attr("pointer-events", "all");

    // // Plot station locations
    // gStations.selectAll("circle")
    //     .data(loadedStationData)
    //     .enter()
    //     .append('circle')
    //     .attr("r", 1)
    //     .attr("cx", function (d) {
    //         return project(d).x;
    //      })
    //     .attr("cy", function (d) {
    //         return project(d).y;
    //     });


    timeSliceData = createTimeSliceData(loadedTripsData.slice(0, NUM_TRIPS_TO_USE), TIME_SLICE_DURATION, NUM_SLICES)
    // computeStationTraffic(loadedStationData, loadedTripsData)

    // Voronoi cells
    voronoi = d3.voronoi() //.extent([0,0], [width, height])
    voronoi.x((d) => d.latitude)
    voronoi.y((d) => d.longitude)

    voronoiPolys = voronoi(loadedStationData).polygons()

    voronoiPolys = voronoiPolys.map((v, i) => {
        let metadata = loadedStationData[i]
        return {
            poly: v,
            metadata: metadata,
        }
    })

    console.log("voronoiPolys: ", voronoiPolys)

    stationData = loadedStationData
    tripsData = loadedTripsData

    console.log("timeSliceData passed to intiializeSlider: ", timeSliceData)
    setupHeatmapSlider(timeSliceData, onSlider)

    d3BindData(stationData, stationDataMap)
}

