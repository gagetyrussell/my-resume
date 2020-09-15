import router from 'umi/router';
import React from 'react';
import { Button, Timeline, Breadcrumb  } from 'antd';
import Plot from 'react-plotly.js';
import styles from './resume.less';
import OverViewTimeline from '../../components/overViewTimeline/index.js';


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

const skill_data = [
  {"skill": "python", "start": "2015-01-01", "end": "current", "proficiency": "Expert"},
  {"skill": "R", "start": "2017-01-01", "end": "current", "proficiency": "Advanced"},
  {"skill": "MATLAB", "start": "2015-01-01", "end": "current", "proficiency": "Advanced"},
  {"skill": "Mathematica", "start": "2014-01-01", "end": "2015-01-01", "proficiency": "Intermediate"},
  {"skill": "SQL", "start": "2017-01-01", "end": "current", "proficiency": "Advanced"},
  {"skill": "NoSQL", "start": "2019-01-01", "end": "current", "proficiency": "Advanced"},
  {"skill": "ReactJS", "start": "2019-01-01", "end": "current", "proficiency": "Intermediate"},
]

const award_data = [
  {"color": "#CBC500", "award": "Honorary Professor", "organization": "Society of Petroleum Engineers", "date": '2017-04-06'},
  {"color": "#CBC500", "award": "Outstanding New Tutor of the Year Runner-Up", "organization": "University of Oklahoma College Action Program", "date": '2016-04-06'},
  {"color": "#CBC500", "award": "HSSE-SR Studen Challenge 2nd Place", "organization": "Society of Petroleum Engineers", "date": '2017-04-20'},
  {"color": "#CBC500", "award": "President's Honor Roll", "organization": "University of Oklahoma", "date": '2015-12-30'},
  {"color": "#CBC500", "award": "Dean's Honor Roll", "organization": "University of Oklahoma", "date": '2016-06-30'},
  {"color": "#CBC500", "award": "Dean's Honor Roll", "organization": "University of Oklahoma", "date": '2016-12-30'},
  {"color": "#CBC500", "award": "Dean's Honor Roll", "organization": "University of Oklahoma", "date": '2017-06-30'},
  {"color": "#CBC500", "award": "Dean's Honor Roll", "organization": "University of Oklahoma", "date": '2017-12-30'},
  {"color": "#CBC500", "award": "Dean's Honor Roll", "organization": "University of Oklahoma", "date": '2018-06-30'},
]

const colors = ['#636EFA', '#EF553B', '#00CC96', '#AB63FA', '#FFA15A', '#19D3F3', '#FF6692', '#B603A5', '#FF97FF', '#FECB52', '#2DA005']

class Overview extends React.Component {
  render() {

    let g = ['', '', '']
    console.log('og', g)
    g.splice(0, 1, 'hello')
    console.log('11', g)

    let gr = ['', '', '']
    console.log('og2', gr)
    gr.splice(gr.length-1, 1, 'hello')
    console.log('112', gr)    // g.splice(1, 0, 'hey')
    // console.log('10', g)

    return (
      <div className={styles.contentDiv}>
        <div className={styles.mainChartDiv}>
          <OverViewTimeline
            work_data = {work_data}
            skill_data = {skill_data}
            award_data = {award_data}
            category_color_map = {category_color_map}
          />
        </div>
      </div>
    )
  }
}

export default Overview;
