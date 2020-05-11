'use strict';

class ChartButtonContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartType: props.chartTypes[0],
    }
  }

  handleClick(chartType) {
    this.setState({chartType});
  }

  renderChartButton(chartType) {
    return e(
      `button`,
      {
        key: `chart-button-${chartType}`,
        className: `chart-button`,
        onClick: () => this.handleClick(chartType),
      },
      chartType,
    )
  }

  render() {
    return e(
      `div`,
      null,
      this.state.chartTypes.map(chartType => this.renderChartButton(chartType)),
    )
  }
}
