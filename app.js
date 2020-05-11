'use strict';

const e = React.createElement;

// TODO ideally an enum
const ChartType = {
  Bar: `bar`,
  Heat: `heat`,
  Lollipop: `lollipop`,
}

class App extends React.Component {
  render() {
    return e(
      `chart-button-container`,
      null,
      e(
        ChartButtonContainer,
        {
          chartTypes: Object.values(ChartType),
        },
      )
    )
  }
}

const domContainer = document.querySelector('#chart-app');
ReactDOM.render(e(App), domContainer);
