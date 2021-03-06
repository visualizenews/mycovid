
(() => {
  const pattern = 'dots';
  const config = {
    source: "./symptoms.json",
    mapping: {
      "mood": "Mood",
      "head": "Headache",
      "belly": "Stomach Ache",
      "fatigue": "Fatigue",
      "cough": "Cough",
      "fever": "Fever",
      "unrest": "Irritability",
      "saturation": "O2 Saturation",
      "sneezing": "Sneezing",
      "bloodPressure": "Blood Pressure",
      "smellAndTaste": "Smell & Taste",
      "throatAche": "Sore Throat",
      "gp": "G.P.",
      "pediatrician": "Pediatrician",
      "ats": "Local Health Authority",
      "tf": "Covid-19 Task Force",
    },
    chart: {
      barHeight: 20,
      lineHeight: 30,
      margins: [5, 5, 5, 60],
      states: ['normal', 'good', 'bad', 'worst'],
      templates: {
        normal: `<div class="normal"><svg width="100%" height="100%"><rect x="0" y="0" width="100%" height="100%" stroke="none" fill="url(#${pattern})" /></svg></div>`,
        good: `<div class="good"><svg width="100%" height="100%"><rect x="0" y="0" width="100%" height="100%" stroke="none" fill="url(#${pattern}2)" /></svg></div>`,
        bad: `<div class="bad"><svg width="100%" height="100%"><rect x="0" y="0" width="100%" height="100%" stroke="none" fill="url(#${pattern}3)" /></svg></div>`,
        worst: `<div class="worst"><svg width="100%" height="100%"><rect x="0" y="0" width="100%" height="100%" stroke="none" fill="url(#${pattern}4)" /></svg></div>`,
      }
    }
  };

  let data = [];

  const heatmaps = () => {
    if (document.querySelector('#heatmaps')) {
      const drugs = [];
      const days = [];
      const kpis = {};
      data.forEach((d) => {
        days.push(new Date(d.date));
        d.symptoms.forEach((s) => {
          const k = Object.keys(s);
          if (!kpis[k[0]]) {
            kpis[k[0]] = [];
          }
          kpis[k[0]].push(s[k[0]]);
        });
        drugs.push(d.drugs);
      });

      let datesHTML = '';
      let kpisHTML = '';
      let heatmapsHTML = '';

      const alfa = Object.keys(config.mapping);
      const mp = {};
      alfa.forEach((a) => {
        mp[config.mapping[a]] = a;
      });

      const looops = Object.keys(mp).sort((a, b) => a > b ? 1 : -1);

      looops.forEach((kk) => {
        if (kpis[mp[kk]]) {
          kpisHTML += `<div class="kpi-label">${config.mapping[mp[kk]]}</div>`;
          heatmapsHTML += `<div class="kpi-heatmap">`;
          kpis[mp[kk]].forEach((hm, i) => {
            heatmapsHTML += `<div class="kpi-heatmap-cell kpi-heatmap-cell-${i}"><div class="kpi-heatmap-cell-inner"><svg width="100%" height="100%"><rect x="0" y="0" width="100%" height="100%" stroke="none" fill="url(#${pattern}${hm > 0 ? hm + 1 : ''})"</svg></div></div>`;
          });
          heatmapsHTML += `</div>`;
        }
      });
      datesHTML += `<div class="kpi-heatmap kpi-days">`;
      days.forEach((dd, i) => {
        datesHTML += `<div class="kpi-heatmap-cell kpi-heatmap-cell-${i}" title="${new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(dd)}">${(i % 7 === 0) ? i + 1 : ''}</div>`;
      });
      datesHTML += `</div>`;
      document.querySelector('#heatmaps .kpis').innerHTML = kpisHTML;
      document.querySelector('#heatmaps .heatmaps-wrapper').innerHTML = datesHTML + heatmapsHTML;
      const heatmapPositioner = document.querySelector('.heatmap-position');
      let cWidth = 140 + document.querySelectorAll('.heatmaps-wrapper .kpi-days .kpi-heatmap-cell').length * document.querySelector('.heatmaps-wrapper .kpi-days .kpi-heatmap-cell').offsetWidth;
      if (cWidth < window.innerWidth) {
        heatmapPositioner.style.marginLeft = 'auto';
        heatmapPositioner.style.marginRight = 'auto';
        heatmapPositioner.style.width = `${cWidth}px`;
      }

      let drugsHTML = '';
      drugs.forEach((d, i) => {
        drugsHTML += `<div class="drugs-day" title="${new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(days[i])}">`;
        drugsHTML += `<ul>`;
        d.sort((a,b) => a > b ? -1 : 1).forEach((dd) => {
          drugsHTML += `<li class="drug"><span>${dd}</span></li>`;
        });
        drugsHTML += `</ul>`;
        drugsHTML += `<span>Day ${i + 1}</span>`;
        drugsHTML += `</div>`;
      });

      document.querySelector('.drugs-wrapper').innerHTML = drugsHTML;

      let dWidth = 40 + document.querySelectorAll('.drugs-position .drugs-day').length * document.querySelector('.drugs-position .drugs-day').offsetWidth;
      const drugsPositioner = document.querySelector('.drugs-position');
      console.log(dWidth, window.innerWidth);
      if (dWidth < window.innerWidth) {
        drugsPositioner.style.marginLeft = 'auto';
        drugsPositioner.style.marginRight = 'auto';
        drugsPositioner.style.width = `${dWidth}px`;
      } else {
        drugsPositioner.style.marginLeft = null;
        drugsPositioner.style.marginRight = null;
        drugsPositioner.style.width = null;
      }
    }
  };

  const ogimage = () => {
    const tag = document.querySelector('[data-chart="ogimage"]');
    if (tag) {
      const id = data[data.length - 1].date;
      tag.innerHTML = `<div class="chart" data-chart="symptoms" data-id="${id}"></div>`;
      const d = new Date(id);
      document.querySelector('#today').innerHTML = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(d);
    }
  };

  const drawContacts = (container, id) => {
    const thisData = data.find(d => d.date === id);
    let html = `<ul>`;
    thisData.contacts.forEach((d) => {
      const keys = Object.keys(d);
      html += `<li class="contact"><span>${config.mapping[keys[0]]} <em>${d[keys[0]]}</em></span></li>`;
    });
    html += '</ul>';
    container.innerHTML = html;
  }

  const contacts = () => {
    const containers = document.querySelectorAll('[data-chart="contacts"]');
    containers.forEach((c) => {
      drawContacts(c, c.getAttribute('data-id'));
    });
  };

  const drawDrugs = (container, id) => {
    const thisData = data.find(d => d.date === id);
    let html = `<ul>`;
    thisData.drugs.sort((a, b) => (a > b) ? 1 : -1).forEach((d) => {
      html += `<li class="drug"><span>${d}</span></li>`;
    });
    html += '</ul>';
    container.innerHTML = html;
  };

  const drugs = () => {
    const containers = document.querySelectorAll('[data-chart="drugs"]');
    containers.forEach((c) => {
      drawDrugs(c, c.getAttribute('data-id'));
    });
  }

  const drawSymptoms = (container, id, w) => {
    const thisData = data.find(d => d.date === id);
    const chartData = [];
    thisData.symptoms.forEach((d) => {
      const k = Object.keys(d);
      chartData.push({
        x: d[k[0]],
        y: config.mapping[k[0]],
      });
    });
    chartData.sort((a, b) => {
      return a.y > b.y ? 1 : -1
    });
    if (chartData && chartData.length) {
      const w = container.offsetWidth;
      let html = '';
      container.style.height = `${(chartData.length * config.chart.lineHeight) + config.chart.margins[0] + config.chart.margins[2]}px`;
      const barsWidth = Math.round((w - config.chart.margins[1] - config.chart.margins[3]) / config.chart.states.length);
      config.chart.states.forEach((s,i) => {
        html += `<div class="chart-block ${s}" style="left: ${config.chart.margins[3] + (i * barsWidth)}px; width:${barsWidth}px; top: ${config.chart.margins[0]}px; bottom: ${config.chart.margins[1]}px;">${config.chart.templates[s]}</div>`;
      });
      chartData.forEach((d, i) => {
        html += `<div class="chart-bar" style="left: ${config.chart.margins[3]}px; top: ${config.chart.margins[0] + (config.chart.lineHeight * i) + (config.chart.lineHeight - config.chart.barHeight) / 2}px; height: ${config.chart.barHeight}px; width: ${(barsWidth * d.x) + Math.round(barsWidth / 2)}px;"></div>`;
        html += `<div class="chart-label label-${d.x}" style="left: ${config.chart.margins[1]}px; top: ${config.chart.margins[0] + (config.chart.lineHeight * i)}px; height: ${config.chart.lineHeight}px; line-height: ${config.chart.lineHeight}px; width: ${config.chart.margins[3]}px;">${d.y}</div>`;
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

  const details = () => {
    const days = document.querySelectorAll('[data-id]');
    days.forEach((d) => {
      const id = d.getAttribute('data-id');
      let HTML = '';
      if (id) {
        const thisData = data.find(d => d.date === id);
        if (thisData) {
          if (thisData.symptoms) {
            HTML += `<div class="timeline-chart"><h3>My Symptoms</h3><div class="chart" data-chart="symptoms" data-id="${id}"></div></div>`;
          }
          HTML += `<div class="timeline-details">`;
          if (thisData.drugs) {
            HTML += `<div class="timeline-drugs"><h3>Drugs I took</h3><div class="day-drugs" data-chart="drugs" data-id="${id}"></div></div>`;
          }
          if (thisData.contacts) {
            HTML += `<div class="timeline-contacts"><h3>Phone calls I had</h3><div class="contacts" data-chart="contacts" data-id="${id}"></div></div>`;
          }
          HTML += `</div>`;
          d.innerHTML += HTML;
        }
      }
    });
  };

  const footers = () => {
    if (document.querySelector('.page-footer')) {
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
    }
  };

  const draw = () => {
    heatmaps();
    details();
    ogimage();
    symptoms();
    drugs();
    contacts();
  };

  const init = () => {
    fetch(config.source)
      .then(response => response.json())
      .then(d => {
        data = d;
        draw();
        window.addEventListener('resize', () => {
          setTimeout(() => {
            const t = document.querySelectorAll('.timeline-detail');
            t.forEach((tt) => {
              tt.innerHTML = '';
            });
            draw(); 
          }, 500);
        });
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