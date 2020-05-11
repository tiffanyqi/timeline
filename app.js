'use strict';

const e = React.createElement;

// TODO ideally an enum
const ChartType = {
  Bar: `bar`,
  Heat: `heat`,
  Lollipop: `lollipop`,
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedChartType: Object.values(ChartType)[0],
    }

    // so we get this.props to reference app's props
    this.handleChartTypeChange = this.handleChartTypeChange.bind(this);
  }

  handleChartTypeChange(ev) {
    this.setState({selectedChartType: ev.target.value});
  }

  render() {
    return e(
      `chart-button-container`,
      null,
      e(
        ChartButtonContainer,
        {
          chartTypes: Object.values(ChartType),
          selectedChartType: this.state.selectedChartType,
          onChartTypeChange: this.handleChartTypeChange,
        },
      ),
    )
  }
}

const domContainer = document.querySelector('#chart-app');
ReactDOM.render(e(App), domContainer);
