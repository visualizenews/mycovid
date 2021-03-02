
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
    },
    chart: {
      barHeight: 20,
      lineHeight: 30,
      margins: [5, 5, 5, 50],
      states: ['normal', 'good', 'bad', 'worst'],
      templates: {
        normal: '<div class="normal"><svg width="100%" height="100%"><rect x="0" y="0" width="100%" height="100%" stroke="none" fill="url(#dots)" /></svg></div>',
        good: '<div class="good"><svg width="100%" height="100%"><rect x="0" y="0" width="100%" height="100%" stroke="none" fill="url(#dots2)" /></svg></div>',
        bad: '<div class="bad"><svg width="100%" height="100%"><rect x="0" y="0" width="100%" height="100%" stroke="none" fill="url(#dots3)" /></svg></div>',
        worst: '<div class="worst"><svg width="100%" height="100%"><rect x="0" y="0" width="100%" height="100%" stroke="none" fill="url(#dots4)" /></svg></div>',
      }
    }
  };

  let data = [];

  const drawDrugs = (container, id) => {
    const thisData = data.find(d => d.date === id);
    console.log(thisData);
  };

  const drugs = () => {
    const containers = document.querySelectorAll('[data-chart="drugs"]');
    containers.forEach((c) => {
      drawDrugs(c, c.getAttribute('data-id'));
    });
  }

  const drawSymptoms = (container, id, w, h) => {
    const thisData = data.find(d => d.date === id);
    const chartData = [];
    thisData.symptoms.forEach((d) => {
      const k = Object.keys(d);
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
      let html = '';
      container.style.height = `${(chartData.length * config.chart.lineHeight) + config.chart.margins[0] + config.chart.margins[2]}px`;
      const barsWidth = Math.round((w - config.chart.margins[1] - config.chart.margins[3]) / config.chart.states.length);
      config.chart.states.forEach((s,i) => {
        html += `<div class="chart-block ${s}" style="left: ${config.chart.margins[3] + (i * barsWidth)}px; width:${barsWidth}px; top: ${config.chart.margins[0]}px; bottom: ${config.chart.margins[1]}px;">${config.chart.templates[s]}</div>`;
      });
      chartData.forEach((d, i) => {
        html += `<div class="chart-bar" style="left: ${config.chart.margins[3]}px; top: ${config.chart.margins[0] + (config.chart.lineHeight * i) + (config.chart.lineHeight - config.chart.barHeight) / 2}px; height: ${config.chart.barHeight}px; width: ${(barsWidth * d.x) + Math.round(barsWidth / 2)}px;"></div>`;
        html += `<div class="chart-label" style="left: ${config.chart.margins[1]}px; top: ${config.chart.margins[0] + (config.chart.lineHeight * i)}px; height: ${config.chart.lineHeight}px; line-height: ${config.chart.lineHeight}px; width: ${config.chart.margins[3]}px;">${d.y}</div>`;
      });
      html += `<div class="chart-legend" style="left: ${config.chart.margins[3]}px; right: ${config.chart.margins[1]}px;"><span>← Normal</span><span>Bad →</span></div>`;
      container.innerHTML = html;
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
        drugs();
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