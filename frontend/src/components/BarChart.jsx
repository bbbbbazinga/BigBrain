import React from 'react';
import { Bar } from 'react-chartjs-2';
import PropTypes from 'prop-types';

function BarChart({ correctPer, avgTime }) {
  const correctLabels = correctPer.map((each, index) => `Question${index + 1}`);
  const avgLabels = avgTime.map((each, index) => `Question${index + 1}`);

  const correctPerState = {
    labels: correctLabels,
    datasets: [
      {
        label: 'Correct rate of each question (%)',
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: correctPer,
      },
    ],
  };

  const correctPerOptions = {
    // maintainAspectRatio: false,
    responsive: true,
    title: {
      display: true,
      text: 'Correct Percentage Chart',
    },
    legend: {
      display: true,
      position: 'right',
    },
    scales: {
      yAxes: [{
        ticks: {
          min: 0,
          max: 100,
          stepSize: 20,
        },
      }],
      xAxes: [{
        gridLines: {
          display: false,
        },
      }],
    },
  };

  const avgTimeState = {
    labels: avgLabels,
    datasets: [
      {
        label: 'Average answer time for each question (s)',
        backgroundColor: 'rgba(40,157,235,0.2)',
        borderColor: 'rgba(40,157,235,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(40,157,235,0.4)',
        hoverBorderColor: 'rgba(40,157,235,1)',
        data: avgTime,
      },
    ],
  };

  const avgTimeOptions = {
    // maintainAspectRatio: false,
    responsive: true,
    title: {
      display: true,
      text: 'Average Time Chart',
    },
    legend: {
      display: true,
      position: 'right',
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
        },
      }],
      xAxes: [{
        gridLines: {
          display: false,
        },
      }],
    },
  };

  return (
    <div className="resultChart">
      <Bar
        data={correctPerState}
        options={correctPerOptions}
      />
      <Bar
        data={avgTimeState}
        options={avgTimeOptions}
      />
    </div>
  );
}

BarChart.propTypes = {
  correctPer: PropTypes.arrayOf(PropTypes.number).isRequired,
  avgTime: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default BarChart;
