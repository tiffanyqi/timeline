'use strict';

/**
 * Eventually I want this to be the wrapper of all d3 charts, and have each chart type
 * have its own initialization and type rules file
 * And eventually have this file be in typescript
 */

// TODO make these enums
const Color = {
  Primary: `green`,
  Secondary: `gray`,
  White: `white`,
  Black: `black`,
}

const maxValue = 12394;
const boxDimensions = 20;

// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 40, left: 100},
    width = 460 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          `translate(${margin.left}, ${margin.top})`);

const colorScale = d3.scaleLinear()
  .range([Color.White, Color.Primary])
  .domain([1, maxValue]) // max value

const csv = "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv";
/**
 * Country,Value
 * United States,12394
 * Russia,6148
 * Germany (FRG),1653
 * France,2162
 * United Kingdom,1214
 * China,1131
 * Spain,814
 * Netherlands,1167
 * Italy,660
 * Israel,1263
 */

class ChartContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transformedData: null,
      x: null,
      y: null,
    }

    // so we get this.props to reference app's props
    this.clearChart = this.clearChart.bind(this); 
    this.drawChart = this.drawChart.bind(this);

    this.setupChart();
  }

  componentDidUpdate() {
    this.clearChart();
    this.drawChart();
  }

  render() {
    return e(
      `chart-container`,
      {},
    )
  }

  setupChart() {
    d3.csv(csv, (data) => {
      const dates = [
        "04/1/2020",
        "04/2/2020",
        "04/3/2020",
        "04/4/2020",
        "04/5/2020",
        "04/6/2020",
        "04/7/2020",
        "04/8/2020",
        "04/9/2020",
        "04/10/2020",
      ];
      // can just use data everywhere, this is just for date tests
      const transformedData = data.map((d, i) => ({"Date": dates[i], ...d}));
    
      // Add X axis
      const x = d3.scaleLinear()
        .domain([0, maxValue])
        .range([0, width]); // scaled to width
      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end");
    
      // Y axis
      const y = d3.scaleBand()
        .range([0, height])
        .domain(transformedData.map(d => Object.values(d)[0]))
        .padding(1);
      svg.append("g")
        .call(d3.axisLeft(y));

      this.setState({transformedData, x, y});
    });
  }

  // Parse the Data and redraw the chart
  drawChart() {
    const selectedChart = this.props.selectedChartType;
    const {transformedData, x, y} = this.state;

    // determine which type of chart it is and display that here
    switch (selectedChart) {
      case ChartType.Bar:
        // Rectangles
        svg.selectAll("bars")
          .data(transformedData)
          .enter()
          .append("rect")
            .attr(`id`, `bar-viz`)
            .attr("x", x(0))
            .attr("y", d => y(Object.values(d)[0]) - boxDimensions / 2)
            .attr("width", x(0)) // starts at 0
            .attr("height", boxDimensions)
            .attr("fill", Color.Primary)

        svg.selectAll("rect")
          .transition()
          .duration(2000)
          .attr("width", d => x(Object.values(d)[2])) // eventually width ends up here
        break;

      case ChartType.Heat:
        // POC multiple squares
        for (let i = 1; i <= 7; i++) {
          // Squares
          svg.selectAll(`heatSquares`)
            .data(transformedData)
            .enter()
            .append(`rect`)
              .attr(`id`, `heat-viz`)
              .attr(`x`, (i - 1) * boxDimensions)
              .attr(`y`, d => y(Object.values(d)[0]) - boxDimensions / 2)
              .attr(`width`, boxDimensions)
              .attr(`height`, boxDimensions)
              .attr(`fill`, d => colorScale(Object.values(d)[2]))
              .attr(`stroke`, Color.White)
              .attr(`stroke-width`, `2`)
        }
        break;

      case ChartType.Lollipop:
        // Lines
        svg.selectAll("lollipopLines")
          .data(transformedData)
          .enter()
          .append("line")
            .attr(`id`, `lollipop-viz`)
            .attr("x1", x(0)) // ending x, ends at 0
            .attr("x2", x(0)) // starting x, starts at 0
            .attr("y1", d => y(Object.values(d)[0])) // ending y
            .attr("y2", d => y(Object.values(d)[0])) // starting y, both values the same bc flat
            // automatically calculates the proper y value because the value passed in isn't a number
            .attr("stroke", Color.Secondary)
            .attr("stroke-width", "5")

        // Circles
        svg.selectAll("lollipopCircles")
          .data(transformedData)
          .enter()
          .append("circle")
            .attr(`id`, `lollipop-viz`)
            .attr("cx", x(0)) // x position
            .attr("cy", d => y(Object.values(d)[0])) // y position
            .attr("r", "8") // radius
            .style("fill", Color.Primary)
            .attr("stroke", Color.Black)

        // Change the X coordinates of line and circle
        svg.selectAll("circle")
          .transition()
          .duration(2000)
          .attr("cx", d => x(Object.values(d)[2])) // sets the circle to the value specified

        svg.selectAll("line")
          .transition()
          .duration(2000)
          .attr("x1", d => x(Object.values(d)[2])) // draws the line at the same duration
          // Error: <line> attribute x1: Expected length, "NaN".
        break;
    }
  }

  clearChart() {
    svg.selectAll("#bar-viz").remove();
    svg.selectAll("#heat-viz").remove();
    svg.selectAll("#lollipop-viz").remove();
  }
}
