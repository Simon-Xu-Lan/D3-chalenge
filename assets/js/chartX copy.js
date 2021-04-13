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

    setAxisX(data) {
        // axis is a string. "x" or "y", represent x axis or y axis
        // data is an array.
        // [1, 2, 3, ...] or ["simon", "str", ...]

        if (typeof(data[0]) === "string") {
            this.xScale = d3.scaleBand()
                            .domain(data)
                            .range([0, this.chartWidth])
                            .padding(0.1)
                        
        } else if (typeof(data[0]) === "number") {
            this.xScale = d3.scaleLinear()
                            .domain([d3.min(data)*0.9, d3.max(data)])
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

    setAxisY(data) {
        // axis is a string. "x" or "y", represent x axis or y axis
        // data is an array. 
        // [1, 2, 3, ...] or ["simon", "str", ...]
        if (typeof(data[0]) === "string") {
            this.yScale = d3.scaleBand()
                            .domain(data)
                            .range([this.chartHeight, 0])
                            .padding(0.1)
                        
        } else if (typeof(data[0]) === "number") {
            this.yScale = d3.scaleLinear()
                            .domain([d3.min(data)*0.9, d3.max(data)])
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
        this.setAxisX(data.map(d => d.x))
        this.setAxisY(data.map(d => d.y))
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

    buildCircles(data) {
        // build axes
        this.setAxisX(data.map(d => d.x))
        this.setAxisY(data.map(d => d.y))

        // build circles
        this.chartGroup
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => this.xScale(d.x))
            .attr("cy", d => this.yScale(d.y))
            .attr("r", 10)
            .attr("fill", "pink")
            .attr("opacity", ".5")
    }

    addText(data) {

        this.chartGroup
            .selectAll('circles')
            .data(data)
            .enter()
            .append('text')
            .attr("x", d => this.xScale(d.x) - 8)
            .attr("y", d => this.yScale(d.y) + 5)
            .attr("fill", "black")
            .text(d => d.text)

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

