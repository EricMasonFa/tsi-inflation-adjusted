import { createChart } from 'lightweight-charts';
import { PriceScaleMode, CrosshairMode } from 'lightweight-charts'
import './cpi-values'
import './stock-index-values'

const chart = createChart(document.body, {
  width: 600,
  height: 350,
  layout: {
    backgroundColor: '#ffffff',
    textColor: '#333',
  },
  grid: {
    vertLines: {
      color: 'rgba(197, 203, 206, 0.5)',
    },
    horzLines: {
      color: 'rgba(197, 203, 206, 0.5)',
    },
  },
  crosshair: {
    mode: CrosshairMode.Normal,
    vertLine: {
      width: 5,
      color: 'rgba(224, 227, 235, 0.1)',
      style: 0,
    },
  },
  priceScale: {
    borderColor: 'rgba(197, 203, 206, 0.8)',
    scaleMargins: {
      top: 0.1,
      bottom: 0.1,
    },
    mode: PriceScaleMode.Logarithmic,
  },
  timeScale: {
    borderColor: 'rgba(197, 203, 206, 0.8)',
  },
  watermark: {
    visible: true,
    fontSize: 24,
    horzAlign: 'center',
    vertAlign: 'center',
    color: 'rgba(171, 71, 188, 0.2)',
    text: 'Avakh.com',
  },
});

const lineSeries = chart.addLineSeries({
  color: 'rgba(38, 198, 218, 1)',
  lineWidth: 3,
});

for (let i = 0; i < index.length; i++) {
  index[i].time = index[i].t
}

let inflationAdjusted = [];

for (let i = 0; i < cpi.length; i++) {
  inflationAdjusted[i] = {};
  inflationAdjusted[i].time = cpi[i].time;
  let indexValue = 0
  let t = cpi[i].time
  while (indexValue === 0) {
    indexValue = getIndexValue(t);
    let li = t.lastIndexOf('/')
    let day = t.substring(li + 1)
    day = parseInt(day)
    day += 1
    let ym = t.substring(0, li)
    t = ym + '/' + day
  }
  inflationAdjusted[i].value = (indexValue / cpi[i].value) * 100;
}

const lineSeries2 = chart.addLineSeries({
  color: 'rgba(38, 55, 18, .5)',
  lineWidth: 1,
});

lineSeries.setData(inflationAdjusted);
lineSeries2.setData(index);

chart.timeScale().fitContent();

document.body.style.position = 'relative';

var legend = document.createElement('div');
legend.classList.add('legend');
document.body.appendChild(legend);

var firstRow = document.createElement('div');
firstRow.innerText = 'Tehran Stock Index';
firstRow.style.color = 'rgba(38, 55, 18, .5)';
legend.appendChild(firstRow);

var secondRow = document.createElement('div');
secondRow.innerText = 'TSI - Inflation Adjusted';
secondRow.style.color = 'rgba(38, 198, 218, 1)';
legend.appendChild(secondRow);

chart.subscribeCrosshairMove((param) => {
  if (param.time) {
    const price = param.seriesPrices.get(lineSeries2);
    if (price) {
      firstRow.innerText = 'Tehran Stock Index' + '  ' + price.toFixed(2);
    }
  }
  else {
    firstRow.innerText = 'Tehran Stock Index';
  }
});

chart.subscribeCrosshairMove((param) => {
  secondRow.innerText = 'TSI - Inflation Adjusted';
  if (param.time) {
    const price = param.seriesPrices.get(lineSeries);
    if (price) {
      secondRow.innerText = 'TSI - Inflation Adjusted' + '  ' + price.toFixed(2);
    }
  }
});

function pad(n) {
  var s = ('0' + n);
  return s.substr(s.length - 2);
}

function getIndexValue(ctime) {
  for (let i = 0; i < index.length; i++) {
    let sTime =  index[i].t
    if (sTime === ctime) {
      return index[i].value
    }
  }

  return 0
}
