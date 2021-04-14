// @TODO: YOUR CODE HERE!

var chart = new ChartX("scatter")
// chart.setAxisX(["simon", "hl", "lp"])
// chart.setAxisY([30, 80, 40])
// chart.buildBars([{x:"simon", y:30}, {x:"hl", y: 80}, {x:"lp", y:40}])
// console.log(chart)
d3.csv("./assets/data/data.csv")
    .then(data => {
        console.log(data)
        // Parse data / cast as numbers
        data.forEach( data => {
            data.poverty = +data.poverty
            data.healthcare = +data.healthcare
            data.age = +data.age
            data.smokes = +data.smokes
            data.income = +data.income
            data.obesity = +data.obesity
        })
        
        chart.bindData(data)
        chart.renderXScale({x: "poverty", min: true, padding: 0.2})
        chart.renderYScale({y: "healthcare", min: true, padding: 0.2})
        chart.addAxes()
        chart.addCircles({
            x: "poverty", 
            y: "healthcare",
            r: "income",
            // color: "lightblue",
            opacity: "age"
        })
        chart.addText({
            x: "poverty",
            y: "healthcare",
            dx: -7,
            dy: 4,
            text: "abbr",
            fontSize: "8px",
            fill: "white"
        })

        // chart.labelAxisX("In Poverty (%)")
        // chart.labelAxisX("Age (Median)")
        chart.labelAxisX([ {value: "poverty", text: "In Poverty (%)"},
                           {value: "age", text: "Age (Median)"},
                           {value: "income", text: "Household Income (median)"}
        ])
        // chart.labelAxisY("Lacks Healthcare (%)")
        chart.labelAxisY([ {value: "healthcare", text: "Lacks Healthcare (%)"},
                           {value: "smokes", text: "smokers (%)"},
                           {value: "obesity", text: "Obess (%)"}
        ])

        // x axis label event listener
        chart.xLabelsGroup.selectAll("text")
            .on("click", function() {
                var value = d3.select(this).attr("value")
                
                if (value !== chart.chosenXAxis) {
                    chart.renderXScale({x: value, min: true, padding: 0.2})
                    chart.renderXAxis()
                    chart.renderCircles()
                    chart.renderText()
                    chart.renderAxisLabels()

                }
            })

        chart.yLabelsGroup.selectAll("text")
            .on("click", function() {
                var value = d3.select(this).attr("value")
                
                if (value !== chart.chosenYAxis) {
                    chart.renderYScale({y: value, min: true, padding: 0.2})
                    chart.renderYAxis()
                    chart.renderCircles()
                    chart.renderText()
                    chart.renderAxisLabels()
                }
            })

        chart.addTips()
        chart.circleGroup
            .on('mouseover', function (d) {
                // this is the circle which mouse is ove
                console.log(this);
                chart.toolTip.show(d, this);
            })
        // Step 4: Create "mouseout" event listener to hide tooltip
            .on('mouseout', function (d) {
                chart.toolTip.hide(d);
            });

        chart.textGroup
            .on('mouseover', function (d) {
                // this is the circle which mouse is ove
                console.log(this);
                chart.toolTip.show(d, this);
            })
        // Step 4: Create "mouseout" event listener to hide tooltip
            .on('mouseout', function (d) {
                chart.toolTip.hide(d);
            });

        
    })
    .catch(error => console.log(error))