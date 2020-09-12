import router from 'umi/router';
import React from 'react';
import { Button, Timeline, Breadcrumb  } from 'antd';
import Plot from 'react-plotly.js';
import styles from './resume.less';

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

const category_color_map = {
  "senior engineer": '#FF6692',
  "owner": '#636EFA',
  "student": '#EF553B',
  "tutor": '#00CC96',
  "intern/extern": '#AB63FA',
  "training": '#FECB52',
  "engineer": '#19D3F3',
  "volunteer": '#B603A5'
}

const role_data = [
  {"color": '#FF6692', "company":"JP3, a Flotek Company", "position":"Senior work_data Quality Engineer", "start":"2020-03-01", "end":"current", "category":"Senior Engineer", "short_title":"work_data & Software", "textposition":"top"},
  {"color": '#636EFA', "company":"NiCATine llc", "position":"Owner", "start":"2014-03-01", "end":"2016-08-01", "category":"owner", "short_title":"Entrepreneur", "textposition":"top"},
  {"color": '#EF553B', "company":"University of Oklahoma", "position":"Petroleum Engineer Student", "start":"2015-08-01", "end":"2018-05-01", "category":"student", "short_title":"Petroleum", "textposition":"bottom"},
  {"color": '#00CC96', "company":"University of Oklahoma", "position":"University Tutor", "start":"2015-08-01", "end":"2018-05-01", "category":"tutor", "short_title":"Math & Science", "textposition":"bottom"},
  {"color": '#00CC96', "company":"Self-Employed", "position":"Private Tutor", "start":"2016-08-01", "end":"2017-04-01", "category":"tutor", "short_title":"Math & Science", "textposition":"top"},
  {"color": '#AB63FA', "company":"Macmillan", "position":"Content Developer", "start":"2016-06-01", "end":"2016-09-01", "category":"intern/extern", "short_title":"work_data & Software", "textposition":"top"},
  {"color": '#FFA15A', "company":"Shell", "position":"Engineer in Training", "start":"2017-03-01", "end":"2017-03-15", "category":"training", "short_title":"Petroleum", "textposition":"top"},
  {"color": '#AB63FA', "company":"Crescent Point Energy", "position":"Reservoir Engineer", "start":"2017-05-01", "end":"2017-08-01", "category":"intern/extern", "short_title":"Petroleum", "textposition":"bottom"},
  {"color": '#AB63FA', "company":"Blue Waters", "position":"Reservoir Simulation Developer", "start":"2017-05-01", "end":"2018-05-01", "category":"intern/extern", "short_title":"work_data & Software", "textposition":"top"},
  {"color": '#19D3F3', "company":"International Paper", "position":"Manufacturing Excellence Engineer", "start":"2018-05-01", "end":"2019-01-01", "category":"Engineer", "short_title":"Chemical", "textposition":"bottom"},
  {"color": '#19D3F3', "company":"JP3, a Flotek Company", "position":"work_data Quality Engineer", "start":"2019-01-01", "end":"2020-03-01", "category":"Engineer", "short_title":"work_data & Software", "textposition":"top"},
]

const volunteer_data = [
  {"color": '#B603A5', "company":"Society of Petroleum Engineers", "position":"Treasurer", "start":"2017-04-01", "end":"2018-06-01", "category":"volunteer", "short_title":"Petroleum", "textposition":"bottom"},
  {"color": '#B603A5', "company":"Society of Petroleum Engineers", "position":"Tutor Chair", "start":"2016-04-01", "end":"2018-06-01", "category":"volunteer", "short_title":"Petroleum", "textposition":"bottom"},
  {"color": '#B603A5', "company":"Supercomputing Conference", "position":"Student Volunteer", "start":"2017-11-01", "end":"2017-11-15", "category":"volunteer", "short_title":"Petroleum", "textposition":"bottom"},
]

const work_data = [...role_data, ...volunteer_data]

const awards = [
  {"color": "#CBC500", "award": "Honorary Professor", "organization": "Society of Petroleum Engineers", "date": '2017-04-06'},
  {"color": "#CBC500", "award": "Outstanding New Tutor of the Year Runner-Up", "organization": "University of Oklahoma College Action Program", "date": '2016-04-06'},
  {"color": "#CBC500", "award": "Honorary Professor", "organization": "Society of Petroleum Engineers", "date": '2017-04-06'},
]

const colors = ['#636EFA', '#EF553B', '#00CC96', '#AB63FA', '#FFA15A', '#19D3F3', '#FF6692', '#B603A5', '#FF97FF', '#FECB52', '#2DA005']

class Overview extends React.Component {
  render() {
    // replace "current" with now
    work_data.map((d) => {
        d.end = d.end.toString().replace('current', current_date);
    });
    // turn date strings into dates
    work_data.map((d) => {
        d.start = new Date(d.start)
        d.end = new Date(d.end)
        return d
    });
    // find the max date
    let maxDate = new Date(Math.max.apply(null, work_data.map(function(d) {
      return d.end;
    })));
    // find the min date
    let minDate = new Date(Math.min.apply(null, work_data.map(function(d) {
      return new Date(d.start);
    })));
    // find the mid date
    let midDate = new Date((minDate.getTime() + maxDate.getTime()) / 2);
    // sort by start date
    work_data.sort((a, b) => b.start - a.start)

    let companies = work_data.map((d) => {
      return (
        d.company
      )
    })
    let starts = work_data.map((d, i) => {
      return (
        d.start
      )
    })
    let legendgroups = []
    let showlegend_bool = true

    // define traces
    let role_traces = work_data.map((d, i) => {
      // determine if legend already exists
      if (legendgroups.includes(d.category)) {
        showlegend_bool = false
      } else {
        showlegend_bool = true
        legendgroups.push(d.category)
      }

      //determine which side text should float
      let start_mid = Math.abs(d.start - midDate)
      let end_mid = Math.abs(d.end - midDate)
      let text = [d.company + " ", ""]
      let textposition = "left"
      if (start_mid > end_mid) {
        text = ["", " " + d.company]
        textposition = "right"
      } else {
        text = [d.company + " ", ""]
        textposition = "left"
      }

      return (
        {
          x: [d.start, d.end],
          y: [i, i],
          text: text,
          customdata: [d.position, d.position],
          textposition: textposition,
          textfont: {
            size: 12,
          },
          type: 'lines',
          mode: 'lines+text',
          legendgroup: d.category,
          name: d.category,
          showlegend: showlegend_bool,
          hovertemplate:
            "<b>%{customdata}</b><br><br>" +
            "<extra></extra>",
          line: {
            color: category_color_map[d.category],
            width: 10
          }
        }
      )
    })
    return (
      <div className={styles.contentDiv}>
        <h1>Overview</h1>
        <div className={styles.mainChartDiv}>
          <Plot className={styles.mainChart}
            data={role_traces}
            layout={
              {
                autosize: true,
                hovermode: "closest",
                showlegend: true,
                plot_bgcolor: 'rgba(0, 0, 0, 0)',
                paper_bgcolor: 'rgba(0, 0, 0, 0)',
                margin: {l:150},
                legend: {
                  orientation: "h",
                  xanchor: "center",
                  yanchor: "top",
                  x: 0.5,
                  y: 1.3
                },
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
                  visible: false,
                  tickfont: {size: 8}
                }
              }
            }
            config={{responsive: true}}
          />
        </div>
      </div>
    )
  }
}

export default Overview;
