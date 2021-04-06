// Set up a slider for the heatmap.
// Expects a html elements that match the following selectors to exist. These are where the slider UI elements will be attached.
// div#slider-simple
// p#value-simple
// @param timeSliceData: sorted of array of tuples. (unix timestamps, map of station id to heatmap values)
// @param onSlider: callback function that takes a index into timeSliceData. Called with the slider value is updated.
function setupHeatmapSlider(timeSliceData, onSlider) {
    // Simple
    // https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518
    var data = timeSliceData.map((val, idx) => idx)
    console.log("slider data: ", data)
    var sliderSimple = d3
        .sliderBottom()
        .min(d3.min(data))
        .max(d3.max(data))
        .width(600)
        .step(1)
        .tickFormat(idx => {
            console.log("inside tickFormat")
            console.log(idx)
            let date = new Date(timeSliceData[idx][0] * 1000)
            console.log("hours: ", date.getHours())
            return d3.timeFormat("%I %p")(date)
        })
        .ticks(data.length - 1)
        .default(0)
        .on('onchange', idx => {
            onSlider(idx)

            let sumTrips = 0
            timeSliceData[idx][1].forEach((value, key) => {
                sumTrips += value
            })

            d3.select('p#value-simple').text(sumTrips + " trips in this time slice.");
        });

    var gSimple = d3
        .select('div#slider-simple')
        .append('svg')
        .attr('width', 800)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(30,30)');

    gSimple.call(sliderSimple);

    d3.select('p#value-simple').text(d3.format('.1')(sliderSimple.value()));
}