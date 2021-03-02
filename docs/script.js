
(() => {
  const config = {
    source: "./symptoms.json",
    mapping: {
      "head": "Headache",
      "belly": "Bellyache",
      "fatigue": "Fatigue",
      "cough": "Cough",
      "fever": "Fever",
      "unrest": "Unrest",
      "saturation": "O2 Saturation",
      "sneezing": "Sneezing",
      "bloodPressure": "Blood Pressure",
    }
  };

  let data = [];

  const drawSymptoms = (container, id, w, h) => {
    const thisData = data.find(d => d.date === id);
    const chartData = [];
    thisData.symptoms.forEach((d) => {
      console.log(d);
      const k = Object.keys(d);
      console.log(k);
      chartData.push({
        x: d[k[0]],
        y: config.mapping[k[0]],
      });
    });
    console.log(data, id, thisData, chartData);
    chartData.sort((a, b) => {
      return a.y > b.y ? 1 : -1
    });
    if (chartData && chartData.length) {
      const chart = chrt.Chrt();
        chart
          .node(container)
          .margins({
            top: 30,
            bottom: 30,
            left: 45,
            right: 50,
          })
          .padding({
            top: 0,
            bottom: 0,
            left: 0,
            right: 20,
          })
          .size(w, h)
          .svg()
          .x(null, null, { scale:'linear' })
          .y(null, null, { scale: 'ordinal' })
          .add(chrt.yAxis().color("#444"))
          .add(chrt.xAxis().color("#444").hideAxis())
          .add(
            chrt.chrtBars()
              .fill('#fff')
              .color('#444')
              .strokeWidth(1)
              .width(0.8)
              .data(chartData, (d) => ({
                  x: d.x,
                  y: d.y,
                })
              )
          );
    }
  };

  const symptoms = () => {
    const containers = document.querySelectorAll('[data-chart="symptoms"]');
    containers.forEach((c) => {
      drawSymptoms(c, c.getAttribute('data-id'), c.offsetWidth, c.offsetHeight);
    });
  };

  const investigation = () => {
  };

  const footers = () => {
    fetch('https://visualize.news/remotes/footer/corporate_en.html')
      .then(response => response.text())
      .then(content => {
        document.querySelector('#footer-corporate').innerHTML =content;
      });
    fetch('https://visualize.news/remotes/footer/legal_en.html')
      .then(response => response.text())
      .then(content => {
        document.querySelector('#footer-legal').innerHTML =content;
      });
  };

  const init = () => {
    fetch(config.source)
      .then(response => response.json())
      .then(d => {
        data = d;
        investigation();
        symptoms();
      }
    );
    footers();
  };

  const ready = (fn) => {
    if (document.readyState != 'loading'){
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(init);
})();