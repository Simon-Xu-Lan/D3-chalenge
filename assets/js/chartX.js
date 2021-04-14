class ChartX{
    constructor(elementId, data) {
        this.svgWidth = document.getElementById(elementId).clientWidth;
        // the ideal width/height ratio is 16/9
        this.svgHeight = this.svgWidth * 9 /16;
        this.marginPercent =0.1;
        this.chartMargin = {
            top: this.svgWidth * this.marginPercent,
            right: this.svgWidth * this.marginPercent,
            bottom: this.svgWidth * this.marginPercent,
            left: this.svgWidth * this.marginPercent
        }
        this.chartWidth = this.svgWidth - this.chartMargin.left - this.chartMargin.right
        this.chartHeight = this.svgHeight - this.chartMargin.top -this.chartMargin.bottom

        // Set svg area with dimension and attach to a div with an id "elementId"
        this.svg = d3.select('#' + elementId)
                     .append('svg')
                     .attr('height', this.svgHeight)
                     .attr('width', this.svgWidth)

        this.chartGroup = this.svg
                              .append('g')
                              .attr('transform', `translate(${this.chartMargin.left}, ${this.chartMargin.top})`)
        // Add a group under chartGroup for x axis labels
        this.xLabelsGroup = this.chartGroup
                                .append('g')
                                .attr('transform', `translate(${this.chartWidth *2 / 5}, ${this.chartHeight + 20})`)
        // Add a group under chartGroup for y axis labels
        this.yLabelsGroup = this.chartGroup
                                .append('g')
                                .attr('transform', 'rotate(-90)')
        this.axisLabels = {}
    }

    bindData(data) {
        // The parameter is an array of objects 
        // [{ x : 5, y:6, r:20, text: "tx" }, ...{...}]
        this.dataPlaceholder = this.chartGroup
                                  .selectAll("data")
                                  .data(data)
                                  .enter()
        this.data = data
    }

    renderXScale(params) {
        /* params is a string or an object 
        {
            x: "the name of key", 
            padding: 0.2,
            min: true,
        } */ 
        // Update this.chosenXAxis
        this.chosenXAxis = params.x || params

        // Create an array of x values
        var xValues = this.data.map(d => d[params.x || params]) // if params is an object use params.x; if pramas is string, use params
        // The padding default value is 0.1 if not sepcified in params
        var xPadding = params.padding || 0.1


        if (typeof(xValues[0]) === "string") {
            this.xScale = d3.scaleBand()
                            .domain(xValue)
                            .range([0, this.chartWidth])
                            .padding(0.1) // Only scaleBand() has padding method
                        
        } else if (typeof(xValues[0]) === "number") {
            var xMin = params.min ? d3.min(xValues) : 0 // if params.min is true, use d3.min(xValues)
            var xMax = d3.max(xValues) 

            this.xScale = d3.scaleLinear()
                            .domain([xMin*(1 - xPadding), xMax*(1 + xPadding)])
                            .range([0, this.chartWidth])
            // Note: scaleLinear does not have padding() method                   
        } else {
            console.error("The parameter in xScale method is not correct")
        }

    }

    renderYScale(params) {
        /* params is a string or an object 
        {
            y: "the name of key", 
            padding: 0.2,
            min: true,
        } */ 

        // Update this.chosenYAxis
        this.chosenYAxis = params.y
        // Create an array of y values
        var yValues = this.data.map(d => d[params.y || params])
        // The padding default value is 0.1 if not sepcified in params
        var yPadding = params.padding || 0.1


        if (typeof(yValues[0]) === "string") {
            this.yScale = d3.scaleBand()
                            .domain(data)
                            .range([this.chartHeight, 0])
                            .padding(0.1)
                        
        } else if (typeof(yValues[0]) === "number") {
            var yMin = params.min ? d3.min(yValues) : 0 // if yMin is not sepcified in params, use 0
            var yMax = d3.max(yValues)

            this.yScale = d3.scaleLinear()
                            .domain([yMin*(1 - yPadding), yMax * (1 + yPadding)])
                            .range([this.chartHeight, 0])
            // Note: scaleLinear does not have padding() method                   
        }
    }

    addAxes() {
        // X axis
        // Create a new d3 function passing the scale in as arguments
        // These will be used to create the chart's axes
        var bottomAxis = d3.axisBottom(this.xScale);
        
        // Append a SVG group element to the chartGroup are, and then create bottom axis inside of it
        this.xAxis = this.chartGroup
                        .append('g')
                        .attr('transform', `translate(0, ${this.chartHeight})`)
                        .call(bottomAxis)

        // Y axis
        var leftAxis = d3.axisLeft(this.yScale);
        
        // Append a SVG group element to the chartGroup are, and then create left axis inside of it
        this.yAxis = this.chartGroup
                        .append('g')
                        .call(leftAxis)
    }

    renderXAxis() {
        var bottomAxis = d3.axisBottom(this.xScale)
        this.xAxis.transition()
                        .duration(1000)
                        .call(bottomAxis)
    }

    renderYAxis() {
        var leftAxis = d3.axisLeft(this.yScale)
        this.yAxis.transition()
                        .duration(1000)
                        .call(leftAxis)
    }


    setAxisX(params) {
        /* params is an object 
        {
            x: "the name of key", 
            padding: 0.2,
            min: 8,
        } */ 
    
        // Create an array of x values
        var xValues = this.data.map(d => d[params.x])
        // The padding default value is 0.1 if not sepcified in params
        var xPadding = params.padding || 0.1


        if (typeof(xValues[0]) === "string") {
            this.xScale = d3.scaleBand()
                            .domain(xValue)
                            .range([0, this.chartWidth])
                            .padding(0.1) // Only scaleBand() has padding method
                        
        } else if (typeof(xValues[0]) === "number") {
            var xMin = params.min ? d3.min(xValues) : 0 // if params.xMIN is true, use d3.min(xValues)
            var xMax = d3.max(xValues) 

            this.xScale = d3.scaleLinear()
                            .domain([xMin*(1 - xPadding), xMax*(1 + xPadding)])
                            .range([0, this.chartWidth])
            // Note: scaleLinear does not have padding() method                   
        }

        // Create a new d3 function passing the scale in as arguments
        // These will be used to create the chart's axes
        var bottomAxis = d3.axisBottom(this.xScale);
        
        // Append a SVG group element to the chartGroup are, and then create bottom axis inside of it
        this.chartGroup
        .append('g')
        .attr('transform', `translate(0, ${this.chartHeight})`)
        .call(bottomAxis)
    }

    setAxisY(params) {
        /* params is an object 
        {
            y: "the name of key", 
            padding: 0.2,
            yMin: true,
        } */ 

        // Create an array of y values
        var yValues = this.data.map(d => d[params.y])
        // The padding default value is 0.1 if not sepcified in params
        var yPadding = params.padding || 0.1


        if (typeof(yValues[0]) === "string") {
            this.yScale = d3.scaleBand()
                            .domain(data)
                            .range([this.chartHeight, 0])
                            .padding(0.1)
                        
        } else if (typeof(yValues[0]) === "number") {
            var yMin = params.min ? d3.min(yValues) : 0 // if yMin is not sepcified in params, use 0
            var yMax = d3.max(yValues)

            this.yScale = d3.scaleLinear()
                            .domain([yMin*(1 - yPadding), yMax * (1 + yPadding)])
                            .range([this.chartHeight, 0])
            // Note: scaleLinear does not have padding() method                   
        }
        // Create a new d3 function passing the scale in as arguments
        // These will be used to create the chart's axes
        var leftAxis = d3.axisLeft(this.yScale);
        
        // Append a SVG group element to the chartGroup are, and then create left axis inside of it
        this.chartGroup
        .append('g')
        .call(leftAxis)
    }

    buildBars(data) {
        // data is an object, format is {x: [1,2,3], y: [20,40, 50] }
        this.chartGroup
            .selectAll('bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', (d) => this.xScale(d.x))
            .attr('y', (d) => this.yScale(d.y))
            .attr('width', this.xScale.bandwidth())
            .attr('height', (d) => this.chartHeight - this.yScale(d.y))
    }

    addCircles(params) {
        /* params is an object 
        {
            x: "the name of key"
            y: "the name of key", 
            r: 0.2,
            yMin: true,
        } */ 

        var xKey = params.x
        var yKey = params.y

        if (!params.r) {
            // if r is not sepecified in params, use default value 20
            var r = 20 
        } else if (typeof(params.r) === "number") {
            // if r is provided with a number, assign the number to r
            var r = params.r
        } else if ( params.r in this.data[0]) {
            // if r is provide with key name, assign a functionn to r
            var rValues = this.data.map(d => d[params.r])
            var rScale = d3.scaleLinear()
                           .domain([d3.min(rValues), d3.max(rValues)])
                           .range([8, 30])
            var r = (d) => rScale(d[params.r]) 
        } else {
            // Handle error
            console.error( "the r value in params is not correct")
        }

        if (!params.opacity) {
            // if r is not sepecified in params, use default value 20
            var opacity = 1
        } else if (typeof(params.opacity) === "number") {
            // if r is provided with a number, assign the number to r
            var opacity = params.opacity
        } else if ( params.opacity in this.data[0]) {
            // if r is provide with key name, assign a functionn to r
            var opacityValues = this.data.map(d => d[params.opacity])
            
                            
            var opacityscale = d3.scaleLinear()
                                 .domain([d3.min(opacityValues), d3.max(opacityValues)])
                                 .range([0, 1])

            var opacity = (d) => opacityscale(d[params.opacity]) 
        } else {
            // Handle error
            console.error("Error in 'addCircles': the opacity value in params is not correct")
        }


        this.circleGroup = this.dataPlaceholder
                                .append("circle")
                                .attr("cx", d => this.xScale(d[params.x]))
                                .attr("cy", d => this.yScale(d[params.y]))
                                .attr("r", r)
                                .attr("fill", params.color || "darkgreen" ) // if not sepecified by params, use default color "green"
                                .attr("opacity", opacity)
    }

    renderCircles() {
        this.circleGroup.transition()
                .duration(1000)
                .attr("cx", d => this.xScale(d[this.chosenXAxis]))
                .attr("cy", d => this.yScale(d[this.chosenYAxis]))

    }

    addText(params) {
        /* params is an object 
        {
            x: "the name of key"
            y: "the name of key", 
            text: "some text or key name",
        } */ 

        this.textGroup = this.dataPlaceholder
            .append('text')
            .attr("x", d => this.xScale(d[params.x]))
            .attr("y", d => this.yScale(d[params.y]))
            .attr("dx", params.dx || -10)
            .attr("dy", params.dy || 5)
            .attr("font-size", params.fontSize || "10px")
            .attr("fill", params.fill || "black")
            .text(d => d[params.text])

        // this.chartGroup
        //     .selectAll('text1') // Questions: Why "text" add text partially,  "circle" doesn't add text. Why others works
        //     .data(data)
        //     .enter()
        //     .append('text')
        //     .attr("x", d => this.xScale(d.x))
        //     .attr("y", d => this.yScale(d.y))
        //     .attr("dx", -10)
        //     .attr("dy", 5)
        //     .attr("font-size", "12px")
        //     .text(d => d.text)

    }

    renderText() {
        this.textGroup.transition()
                .duration(1000)
                .attr("x", d => this.xScale(d[this.chosenXAxis]))
                .attr("y", d => this.yScale(d[this.chosenYAxis]))
    }

    labelAxisX(params) {
        /* params is a string or an array of objects.
        object format:
        [{
            value: "the name of key of data"
            text: "the label text"
            fontSize: "12px", 
            activeStatus: "active"// or "inactive"
        }]
        */ 
        if (typeof(params) === "string") {
            this.xLabelsGroup
            .append("text")
            .attr("x", 0)
            .attr("y", 20)
            .text(params)
            .attr("font-size", "10px")
        } 
        else if (typeof(params) === "object") {
            // Add each label
            params.forEach((eachLabel, index) => {
                this.axisLabels[eachLabel.value] = 
                    this.xLabelsGroup
                        .append("text")
                        .attr("x", 0)
                        .attr("y", 20 * (index + 1))
                        .classed(eachLabel.value === this.chosenXAxis ? "active" : "inactive", true) // Set the chosen axis label to be active, unchosen to be inactive
                        .text(eachLabel.text)
                        .attr("font-size", eachLabel.fontSize || "10px")
                        .attr("value", eachLabel.value)

            })
        } 
        else {
            console.error("The params of labelAxisX is not correct")
        }

        
    }

    labelAxisY(params) {
        /* params is a string or an array of objects.
        object format:
        [{
            value: "the name of key of data"
            text: "the label text"
            fontSize: "12px", 
            activeStatus: "active"// or "inactive"
        }]
        */ 

        if (typeof(params) === "string") {
            this.yLabelsGroup
            .append("text")
            .attr("y", 0 - this.chartMargin.left /2)
            .attr("x", -this.chartHeight * 2 / 3)
            .text(params)
            .attr("font-size", "10px")
        } 
        else if (typeof(params) === "object") {
            // Update the margin left based on the quantity of labels. Each label takes 20px space
            this.chartMargin.left = 25 * params.length
            // Add each label
            params.forEach((eachLabel, index) => {
                this.axisLabels[eachLabel.value] = 
                        this.yLabelsGroup
                            .append("text")
                            .attr("y", 0 - 20 * (index + 1) - 6)
                            .attr("x", 0 - this.chartHeight * 2 / 3)
                            .classed(eachLabel.value === this.chosenYAxis ? "active" : "inactive", true)
                            .text(eachLabel.text)
                            .attr("font-size", eachLabel.fontSize || "10px")
                            .attr("value", eachLabel.value)
                            // .attr("id", eachLabel.value)
            })
        } 
        else {
            console.error("The params of labelAxisY is not correct")
        }
    }

    renderAxisLabels() {
        Object.keys(this.axisLabels).forEach(key => {
            console.log(key)
            if (key === this.chosenYAxis || key === this.chosenXAxis) {
                this.axisLabels[key].classed("active", true)
                this.axisLabels[key].classed("inactive", false)
            } else {
                this.axisLabels[key].classed("inactive", true)
                this.axisLabels[key].classed("active", false)
            }
        })
    }

    addTips() {
        // Step 1: Initialize Tooltip
        this.toolTip = 
            d3.tip()
                .attr('class', 'tooltip')
                .offset([80, -60])
                .html(d => `${d[this.chosenXAxis]}<hr>${d[this.chosenYAxis]}`);

        // Step 2: Create the tooltip in chartGroup.
        this.chartGroup.call(this.toolTip);

        // Step 3: Create "mouseover" event listener to display tooltip
        // this.circleGroup
        //     .on('mouseover', function (d) {
        //         // this is the circle which mouse is ove
        //         console.log(this);
        //         toolTip.show(d, this);
        //     })
        // // Step 4: Create "mouseout" event listener to hide tooltip
        //     .on('mouseout', function (d) {
        //         toolTip.hide(d);
        //     });
    }
}

