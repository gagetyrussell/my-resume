import router from 'umi/router';
import React from 'react';
import { Button, Timeline, Breadcrumb  } from 'antd';
import Plot from 'react-plotly.js';
import chroma from "chroma-js";

const today = new Date()
const current_date = today.toISOString();

function GetSortOrder(prop) {
    return function(a, b) {
        if (a[prop] < b[prop]) {
            return 1;
        } else if (a[prop] > b[prop]) {
            return -1;
        }
        return 0;
    }
}

const data = [
  {"color": '#636EFA', "company":"NiCATine llc", "position":"Owner", "start":"2014-03-01", "end":"2016-08-01", "category":"owner", "short_title":"Entrepreneur", "textposition":"top"},
  {"color": '#EF553B', "company":"University of Oklahoma", "position":"Petroleum Engineer Student", "start":"2015-08-01", "end":"2018-05-01", "category":"student", "short_title":"Petroleum", "textposition":"bottom"},
  {"color": '#00CC96', "company":"University of Oklahoma", "position":"University Tutor", "start":"2015-08-01", "end":"2018-05-01", "category":"tutor", "short_title":"Math & Science", "textposition":"bottom"},
  {"color": '#00CC96', "company":"Self-Employed", "position":"Private Tutor", "start":"2016-08-01", "end":"2017-04-01", "category":"tutor", "short_title":"Math & Science", "textposition":"top"},
  {"color": '#AB63FA', "company":"Macmillan", "position":"Content Developer", "start":"2016-06-01", "end":"2016-09-01", "category":"intern/extern", "short_title":"Data & Software", "textposition":"top"},
  {"color": '#FFA15A', "company":"Shell", "position":"Engineer in Training", "start":"2017-03-01", "end":"2017-03-15", "category":"training", "short_title":"Petroleum", "textposition":"top"},
  {"color": '#AB63FA', "company":"Crescent Point Energy", "position":"Reservoir Engineer", "start":"2017-05-01", "end":"2017-08-01", "category":"intern/extern", "short_title":"Petroleum", "textposition":"bottom"},
  {"color": '#AB63FA', "company":"Blue Waters", "position":"Reservoir Simulation Developer", "start":"2017-05-01", "end":"2018-05-01", "category":"intern/extern", "short_title":"Data & Software", "textposition":"top"},
  {"color": '#19D3F3', "company":"International Paper", "position":"Manufacturing Excellence Engineer", "start":"2018-05-01", "end":"2019-01-01", "category":"Engineer", "short_title":"Chemical", "textposition":"bottom"},
  {"color": '#19D3F3', "company":"JP3, a Flotek Company", "position":"Data Quality Engineer", "start":"2019-01-01", "end":"2020-03-01", "category":"Engineer", "short_title":"Data & Software", "textposition":"top"},
  {"color": '#FF6692', "company":"JP3, a Flotek Company", "position":"Senior Data Quality Engineer", "start":"2020-03-01", "end":"current", "category":"Senior Engineer", "short_title":"Data & Software", "textposition":"top"},
]

const colors = ['#636EFA', '#EF553B', '#00CC96', '#AB63FA', '#FFA15A', '#19D3F3', '#FF6692', '#B603A5', '#FF97FF', '#FECB52', '#2DA005']

class Overview extends React.Component {
  render() {
    console.log(current_date)

    data.map((d) => {
        d.end = d.end.toString().replace('current', current_date);
    });
    data.sort(GetSortOrder("start"));
    console.log(data)
    let companies = data.map((d) => {
      return (
        d.company
      )
    })
    let starts = data.map((d, i) => {
      return (
        d.start
      )
    })
    let legendgroups = []
    let showlegend_bool = true
    let textposition = 'bottom'
    let traces = data.map((d, i) => {
      if (legendgroups.includes(d.category)) {
        showlegend_bool = false
      } else {
        showlegend_bool = true
        legendgroups.push(d.category)
      }
      return (
        {
          x: [d.start, d.end],
          y: [d.position, d.position],
          text:[d.company],
          textposition: "top",
          type: 'scatter',
          mode: 'lines+text',
          legendgroup: d.category,
          name: d.category,
          showlegend: showlegend_bool,
          marker: {
            color: d.color
          },
          line: {
            color: d.color,
            width: 10
          }
        }
      )
    })
    return (
      <div>
        <h1>Overview</h1>
        <Plot
          data={traces}
          layout={
            {
              autosize: true,
              height: 600,
              width: 1000,
              title: 'Experience Overview Timeline',
              showlegend: true,
              plot_bgcolor: 'rgba(0, 0, 0, 0)',
              paper_bgcolor: 'rgba(0, 0, 0, 0)',
              margin: {l:150},
              legend: {"orientation": "h"},
              xaxis: {
                showlines: true,
                linecolor: 'black',
                mirror : "allticks",
                side: "top"
              },
              yaxis: {
                showlines: true,
                linecolor: 'black',
                mirror: true,
                visible: true,
                tickfont: {size: 8}
              }
            }
          }
        />
      </div>
    )
  }
}

export default Overview;
