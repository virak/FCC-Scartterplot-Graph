
let width = 1000
let height = 400
let barWidth = width/275

var tooltip = d3.select("#scatterplotGraphContainer").append("div")
                .attr("id", "tooltip")
                .style("opacity", 0)

let svgContainer = d3.select("#scatterplotGraphContainer")
                        .append('svg')
                        .attr('width', width + 100)
                        .attr('height', height + 60)

let color = d3.scaleOrdinal(d3.schemePaired);                        


 d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json').then( function(dataJson){
    // console.log(dataJson)

    // -- Set up X axis
    let years = dataJson.map((element) => element.Year )
    let xScale = d3.scaleLinear()
                .domain([d3.min(years), d3.max(years)])
                .range([0, width])
    let xAxis = d3.axisBottom()
                .scale(xScale)
                .tickFormat(d3.format("d"))
    svgContainer.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(60, 400)');

    // -- Set up Y axis
    let times = dataJson.map((current) => {
      let tmpTime = current.Time.split(':')
      return new Date(1970, 0, 1, 0, tmpTime[0], tmpTime[1])
    })
    let maxTimeDate = d3.max(times)
    // let moreThanMax = new Date(maxTimeDate)
    // moreThanMax.setMinutes(maxTimeDate.getMinutes() + 1)
    let yAxisScale = d3.scaleTime()
                        .domain([d3.min(times), maxTimeDate])
                        .range([height, 0])
    let yAxis = d3.axisLeft(yAxisScale).tickFormat(d3.timeFormat("%M:%S"))
    
    svgContainer.append('g')
                .call(yAxis)
                .attr('id', 'y-axis')
                .attr('transform', 'translate(60, 0)')


    // Set up dot
    svgContainer.selectAll('.dot')
      .data(dataJson)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("r", 12)
      .attr('cx', (d) => xScale(d.Year))
      .attr('cy', (d) => {
        let tmpTime = d.Time.split(':')
        let tmpTimeValueDateFormat = new Date(1970, 0, 1, 0, tmpTime[0], tmpTime[1])
        return yAxisScale(tmpTimeValueDateFormat)
      })
      .attr('transform', 'translate(60, 0)')
      .attr('data-xvalue', (d) => d.Year)
      .attr('data-yvalue', (d) => {
        let tmpTime = d.Time.split(':')
        let tmpTimeValueDateFormat = new Date(1970, 0, 1, 0, tmpTime[0], tmpTime[1])
        return tmpTimeValueDateFormat.toISOString()
      })
      .style('fill', (d) => color(d.Doping != ""))
      .on('mouseover', (d,i) => {
          tooltip.transition()
          .duration(200)
          .style('opacity', 1);
          tooltip.attr('data-year', d.Year)
          tooltip.html(d.Name + " - " + d.Nationality + ' : ' + d.Year + ' : ' + d.Time)
              .style('left', (i * barWidth) + 660 + 'px')
              .style('top', height - 50 + 'px')
              .style('transform', 'translateX(30px)');
      })
      .on('mouseout', () =>{
          tooltip.transition()
          .duration(200)
          .style('opacity', 0);
      })

})
