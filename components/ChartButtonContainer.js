'use strict';

class ChartButtonContainer extends React.Component {
  constructor(props) {
    super(props);

    // so we get this.props to reference app's props
    this.handleClick = this.handleClick.bind(this); 
  }

  handleClick(ev) {
    this.props.onChartTypeChange(ev);
  }

  renderChartButton(chartType) {
    return e(
      `button`,
      {
        key: `chart-button-${chartType}`,
        className: `chart-button ${this.props.selectedChartType === chartType ? `enabled` : ``}`,
        value: chartType,
        onClick: this.handleClick,
      },
      chartType,
    )
  }

  render() {
    return e(
      `div`,
      null,
      this.props.chartTypes.map(chartType => this.renderChartButton(chartType)),
    )
  }
}
