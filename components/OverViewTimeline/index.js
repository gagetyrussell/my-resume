import router from 'umi/router';
import React from 'react';
import { Button, Timeline, Breadcrumb  } from 'antd';
import Plot from 'react-plotly.js';
import styles from './index.less';
import moment from 'moment';

const today = new Date()
const current_date = today.toISOString();

function getDateArray(start, end) {

  var
    arr = new Array(),
    dt = new Date(start);

  while (dt <= end) {
    arr.push(new Date(dt));
    dt.setDate(dt.getDate() + 1);
  }

  return arr;

}

function getAbsoluteMonths(d) {
  let momentDate = moment(d)
  var months = Number(momentDate.format("MM"));
  var years = Number(momentDate.format("YYYY"));
  return months + (years * 12);
}

class OverViewTimeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let work_data = this.props.work_data
    let skill_data = this.props.skill_data
    let award_data = this.props.award_data
    let certification_data = this.props.certification_data
    let prof_dev_data = this.props.prof_dev_data
    // replace "current" with now
    work_data.map((d) => {
        d.end = d.end.toString().replace('current', current_date);
    });
    skill_data.map((d) => {
        d.end = d.end.toString().replace('current', current_date);
    });
    // turn date strings into dates
    work_data.map((d) => {
        d.start = new Date(d.start)
        d.end = new Date(d.end)
        return d
    });
    skill_data.map((d) => {
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
    skill_data.sort((a, b) => b.start - a.start)

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

      let startDate = moment(d.start);
      let endDate = moment(d.end);

      let years = endDate.diff(startDate, 'year');
      startDate.add(years, 'years')

      let months = endDate.diff(startDate, 'months');
      startDate.add(months, 'months');

      let elapsed_time = years + " yr " + months + " mos ";

      let dateArray = getDateArray(d.start, d.end);
      let iterator = Array(dateArray.length).fill(i)
      let text = Array(dateArray.length).fill("")
      let hovertext = Array(dateArray.length).fill("<b>Company:</b> " + " " + d.company + "<br> <b>Role:</b> " +  d.position + "<br>" + elapsed_time)

      //determine which side text should float
      let start_mid = Math.abs(d.start - midDate)
      let end_mid = Math.abs(d.end - midDate)
      let textposition = "left"
      if (start_mid > end_mid) {
        text.splice(text.length-1, 1, " " + d.company)
        textposition = "right"
      } else {
        text.splice(0, 1, d.company + " ")
        textposition = "left"
      }

      return (
        {
          x: dateArray,
          y: iterator,
          text: text,
          hovertext: hovertext,
          xaxis: "x1",
          yaxis: "y1",
          //customdata: [d.position, d.position],
          textposition: textposition,
          textfont: {
            size: 12,
          },
          type: 'line',
          mode: 'lines+text',
          legendgroup: d.category,
          name: d.category,
          showlegend: showlegend_bool,
          hoverinfo: "x+text",
          // hovertemplate:
          //   "<b>%{customdata}</b><br><br>" +
          //   "<extra></extra>",
          line: {
            color: this.props.category_color_map[d.category],
            width: 10
          }
        }
      )
    })

    // define skill traces
    let skill_traces = skill_data.map((d, i) => {
      // determine if legend already exists
      if (i==1) {
        showlegend_bool = false
      } else {
        showlegend_bool = false
      }

      let startDate = moment(d.start);
      let endDate = moment(d.end);

      let years = endDate.diff(startDate, 'year');
      startDate.add(years, 'years')

      let months = endDate.diff(startDate, 'months');
      startDate.add(months, 'months');

      let elapsed_time = years + " yr " + months + " mos ";

      let dateArray = getDateArray(d.start, d.end);
      let iterator = Array(dateArray.length).fill(i)
      let text = Array(dateArray.length).fill("")
      let hovertext = Array(dateArray.length).fill("<b>Skill:</b> " + " " + d.skill + "<br> <b>Proficiency:</b> " +  d.proficiency + "<br>" + elapsed_time)

      //determine which side text should float
      let start_mid = Math.abs(d.start - midDate)
      let end_mid = Math.abs(d.end - midDate)
      let textposition = "left"
      if (start_mid > end_mid) {
        text.splice(text.length-1, 1, " " + d.skill)
        textposition = "right"
      } else {
        text.splice(0, 1, d.skill + " ")
        textposition = "left"
      }

      return (
        {
          x: dateArray,
          y: iterator,
          text: text,
          hovertext: hovertext,
          xaxis: "x1",
          yaxis: "y2",
          textposition: textposition,
          textfont: {
            size: 12,
          },
          type: 'line',
          mode: 'lines+text',
          hoverinfo: "x+text",
          legendgroup: "skills",
          name: "skills",
          showlegend: showlegend_bool,
          line: {
            color: "black",
            width: 10
          }
        }
      )
    })

    let traces = [...role_traces, ...skill_traces]

    // define award traces
    let award_dates = []
    let award_hovertext = []
    let award_iterator = []
    award_data.map((d,i) => {
      award_dates.push(d.date)
      award_hovertext.push("<b>Organization:</b> " + " " + d.organization + "<br> <b>Award:</b> " +  d.award)
      award_iterator.push(1)
    })

    let award_trace = {
      x: award_dates,
      y: award_iterator,
      hovertext: award_hovertext,
      xaxis: "x1",
      yaxis: "y3",
      textfont: {
        size: 12,
      },
      type: 'scatter',
      mode: 'markers',
      marker: {
        symbol: "star",
        color: "gold",
        size: 12,
        line: {
          color: "black",
          width: 1
        }
      },
      hoverinfo: "x+text",
      legendgroup: "awards",
      name: "awards",
      showlegend: false,
    }

    traces.push(award_trace)

    // define certification traces
    let cert_dates = []
    let cert_hovertext = []
    let cert_iterator = []
    certification_data.map((d,i) => {
      cert_dates.push(d.date)
      cert_hovertext.push("<b>Organization:</b> " + " " + d.organization + "<br> <b>Certification:</b> " +  d.certification)
      cert_iterator.push(1)
    })

    let cert_trace = {
      x: cert_dates,
      y: cert_iterator,
      hovertext: cert_hovertext,
      xaxis: "x1",
      yaxis: "y4",
      textfont: {
        size: 12,
      },
      type: 'scatter',
      mode: 'markers',
      marker: {
        symbol: "diamond-x",
        color: "rgba(0,0,0,0)",
        size: 12,
        line: {
          color: "black",
          width: 2
        }
      },
      hoverinfo: "x+text",
      legendgroup: "certifcations",
      name: "certifcations",
      showlegend: true,
    }

    traces.push(cert_trace)

    // define certification traces
    let pd_dates = []
    let pd_hovertext = []
    let pd_iterator = []
    prof_dev_data.map((d,i) => {
      pd_dates.push(d.completion_date)
      pd_hovertext.push("<b>Organization:</b> " + " " + d.organization + "<br> <b>Training:</b> " +  d.training)
      pd_iterator.push(1)
    })

    let pd_trace = {
      x: pd_dates,
      y: pd_iterator,
      hovertext: pd_hovertext,
      xaxis: "x1",
      yaxis: "y4",
      textfont: {
        size: 12,
      },
      type: 'scatter',
      mode: 'markers',
      marker: {
        symbol: "bowtie",
        color: "rgba(0,0,0,0)",
        size: 12,
        line: {
          color: "black",
          width: 1
        }
      },
      hoverinfo: "x+text",
      legendgroup: "professional_development",
      name: "professional-development",
      showlegend: true,
    }
    console.log(prof_dev_data)
    console.log(pd_dates)
    console.log(pd_trace)
    traces.push(pd_trace)


    return (
      <Plot className={styles.mainChart}
        data={traces}
        layout={
          {
            autosize: true,
            showlegend: true,
            plot_bgcolor: 'rgba(0, 0, 0, 0)',
            paper_bgcolor: 'rgba(0, 0, 0, 0)',
            margin: {l:150},
            legend: {
              orientation: "h",
              xanchor: "center",
              yanchor: "top",
              x: 0.5,
              y: 1.15
            },
            xaxis: {
              showlines: true,
              showgrid: false,
              zeroline: false,
              linecolor: 'black',
              mirror : false,
              side: "top"
            },
            yaxis: {
              showlines: false,
              showticks: false,
              showticklabels: false,
              showgrid: false,
              zeroline: false,
              domain: [0.7, 1],
              title: "Experience",
              titlefont: {
                size: 16
              },
              side: "left"
            },
            yaxis2: {
              showlines: false,
              showticks: false,
              showticklabels: false,
              showgrid: false,
              zeroline: false,
              domain: [0.4, 0.6],
              title: 'Skills',
              titlefont: {
                size: 16
              },
              side: "left"
            },
            yaxis3: {
              showlines: false,
              showticks: false,
              showticklabels: false,
              showgrid: false,
              zeroline: false,
              domain: [0.2, 0.3],
              title: 'Awards',
              titlefont: {
                size: 16
              },
              side: "left"
            },
            yaxis4: {
              showlines: false,
              showticks: false,
              showticklabels: false,
              showgrid: false,
              zeroline: false,
              domain: [0, 0.1],
              title: 'Professional<br>Development',
              titlefont: {
                size: 16
              },
              side: "left"
            },
          }
        }
        config={
          {
            responsive: true,
            modeBarButtonsToRemove: ['pan2d','select2d','lasso2d','resetScale2d','zoomOut2d', 'zoomIn2d', 'toggleSpikelines'],
            displaylogo: false
          }
        }
      />
    )
  }
}

export default OverViewTimeline;
