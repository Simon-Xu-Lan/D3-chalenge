class ChartX{
    constructor(elementId, data) {
        this.svgWidth = document.getElementById(elementId).clientWidth;
        // the ideal width/height ratio is 16/9
        this.svgHeight = this.svgWidth * 9 /16;
        this.marginPercent =0.05;
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
            console.log("Error in 'addCircles': the r value in params is not correct")
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
            console.log("Error in 'addCircles': the opacity value in params is not correct")
        }


        this.dataPlaceholder
            .append("circle")
            .attr("cx", d => this.xScale(d[params.x]))
            .attr("cy", d => this.yScale(d[params.y]))
            .attr("r", r)
            .attr("fill", params.color || "darkgreen" ) // if not sepecified by params, use default color "green"
            .attr("opacity", opacity)
    }

    addText(params) {
        /* params is an object 
        {
            x: "the name of key"
            y: "the name of key", 
            text: "some text or key name",
        } */ 



        this.dataPlaceholder
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

        // this.chartGroup
        //     .selectAll('text')
        //     .data(data)
        //     .enter()
        //     .append('text')
        //     .attr("x", d => this.xScale(d.x) - 8)
        //     .attr("y", d => this.yScale(d.y) + 5)
        //     .attr("fill", "black")
        //     .text(d => d.text)


        // var selection = this.chartGroup
        //                     .selectAll("circles") 
        //                     .data(data)
        
        // selection
        //     .enter()
        //     .append("text")
        //     .merge(selection)
        //     .attr("x", d => {
        //         console.log(d.x, d.y)
        //         return this.xScale(d.x) - 8})
        //     .attr("y", d => this.yScale(d.y) + 5)
        //     .attr("fill", "black")
        //     .text(d => d.text)

        // selection.exit().remove()
    }

}

