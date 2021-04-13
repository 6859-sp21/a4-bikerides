// Set up a dynamic legend



function setupLegend(maxValue, nTicks, radiusFn) {
    var legend = d3.select("#legend")

    // top center
    let baseX = 100
    let baseY = 0

    let ticks = []

    let logBase = 10
    let log = Math.log(maxValue) / Math.log(logBase)
    let nearestBase = 25

    function roundTo(value, nearestBase) {
        return Math.ceil(value / nearestBase) * nearestBase
    }

    let scaleMax = roundTo(maxValue, nearestBase)

    console.log("maxValue: ", maxValue)
    console.log("scaleMax: ", scaleMax)

    // log 2 ticks
    for (let i = 0; i < nTicks; i += 1) {
        let multiplier = 1 / (3 ** i)
        ticks.push(roundTo(scaleMax * multiplier, nearestBase))
    }

    console.log("ticks", ticks)
    console.log("radii", ticks.map(d => radiusFn(d)))


    let centerFn = (val) => {
        let radius = radiusFn(val)

        let centerX = baseX
        let centerY = baseY + radius

        return [centerX, centerY]
    }

    // Add bubbles
    legend.selectAll("circle")
        .data(ticks)
        .join(
            enter => enter
                .append("circle")
                .attr("r", radiusFn)
                .attr("cx", d => centerFn(d)[0])
                .attr("cy", d => centerFn(d)[1])
                .attr("fill", "hsla(236, 100%, 87%, 1)")
                .attr("stroke", "gray")
                .attr("stroke-width", 1)
            ,
            update => update
                .attr("r", radiusFn)
                .attr("cx", d => centerFn(d)[0])
                .attr("cy", d => centerFn(d)[1])
                .attr("fill", "hsla(236, 100%, 87%, 1)")
                .attr("stroke", "gray")
                .attr("stroke-width", 1),
            exit => exit.remove()
        )


    // Add labels
    let labelPaddingX = 10
    let labelX = baseX + radiusFn(Math.max(...ticks)) + labelPaddingX
    console.log(labelX)
    legend.selectAll("text")
        .data(ticks)
        .join(
            enter => enter
                .append("text")
                .attr("x", labelX)
                .attr("y", d => radiusFn(d) * 2)
                .text((d) => `${d} rides`)
                .attr("font-size", "smaller")
            ,
            update => update
                .attr("x", labelX)
                .attr("y", d => radiusFn(d) * 2)
                .text((d) => `${d} rides`)
                .attr("font-size", "smaller"),
            exit => exit.remove()
        )

    // Add label lines
    legend.selectAll("line")
        .data(ticks)
        .join(
            enter => enter
                .append("line")
                .attr("x1", baseX)
                .attr("y1", d => radiusFn(d) * 2)
                .attr("x2", labelX - 3)
                .attr("y2", d => radiusFn(d) * 2)
                .attr("stroke", "gray")
                .attr("stroke-width", 1.5)
                .attr("stroke-dasharray", 4)
            ,
            update => update
                .attr("x1", baseX)
                .attr("y1", d => radiusFn(d) * 2)
                .attr("x2", labelX - 3)
                .attr("y2", d => radiusFn(d) * 2)
                .attr("stroke", "gray")
                .attr("stroke-width", 1.5)
                .attr("stroke-dasharray", 4),
            exit => exit.remove()
        )

}