import "./modulepreload-polyfill-Dezn_h7o.js";
/* empty css               */ import "./init-CC0aACO2.js";
import { t as e } from "./auto-CBo2XcXh.js";
document.addEventListener(`DOMContentLoaded`, function () {
  let t = document.getElementById(`pointsChart`);
  if (!t) return;
  let n = t.getContext(`2d`),
    r = {
      labels: [
        `Mar`,
        `Apr`,
        `May`,
        `Jun`,
        `Jul`,
        `Aug`,
        `Sep`,
        `Oct`,
        `Nov`,
        `Dec`,
      ],
      datasets: [
        {
          label: `Ortico`,
          data: [0, 0, 0, 0, 0, 0, 0, 184, 250, 267],
          borderColor: `#ffd700`,
        },
        {
          label: `Flopp`,
          data: [111, 227, 227, 227, 227, 227, 227, 227, 227, 227],
          borderColor: `#e5e7eb`,
        },
        {
          label: `Jeej`,
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 195],
          borderColor: `#cd7f32`,
        },
        {
          label: `@polbaladas`,
          data: [105, 106, 106, 106, 106, 106, 116, 116, 116, 116],
          borderColor: `#4dabff`,
        },
        {
          label: `lk`,
          data: [0, 0, 48, 48, 76, 76, 96, 106, 106, 106],
          borderColor: `#a78bfa`,
        },
        {
          label: `Anonymous`,
          data: [8, 8, 18, 28, 34, 34, 35, 87, 94, 98],
          borderColor: `#94a3b8`,
        },
        {
          label: `YRY`,
          data: [1, 1, 1, 66, 74, 74, 74, 84, 84, 84],
          borderColor: `#f472b6`,
        },
        {
          label: `@jman`,
          data: [0, 0, 35, 75, 75, 75, 75, 75, 75, 75],
          borderColor: `#ec4899`,
        },
        {
          label: `Matti`,
          data: [25, 55, 55, 55, 55, 55, 55, 55, 55, 55],
          borderColor: `#10b981`,
        },
        {
          label: `Www`,
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 47],
          borderColor: `#3b82f6`,
        },
      ],
    };
  new e(n, {
    type: `line`,
    data: {
      labels: r.labels,
      datasets: r.datasets.map((e) => ({
        ...e,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
        fill: !1,
      })),
    },
    options: {
      responsive: !0,
      maintainAspectRatio: !1,
      plugins: {
        legend: {
          position: `bottom`,
          labels: {
            color: `#94a3b8`,
            boxWidth: 10,
            font: { size: 9, family: `Sora` },
          },
        },
      },
      scales: {
        x: { ticks: { color: `#94a3b8` }, grid: { display: !1 } },
        y: {
          ticks: { color: `#94a3b8` },
          grid: { color: `rgba(255,255,255,0.05)` },
        },
      },
    },
  });
});
