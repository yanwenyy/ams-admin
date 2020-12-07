import _ from 'lodash'
import {
  tasksState
} from './config'

const pie = {
  series: [{
    type: 'pie',
    clickable: true, // Whether to open clicks
    minAngle: 5, // The smallest sector angle (0 ~ 360), used to prevent a value from being too small, causing the sector to be too small to affect the interaction
    avoidLabelOverlap: true, // Whether to prevent the label overlap policy
    hoverAnimation: false, // Whether to enable hover to enlarge the animation on the sector.
    silent:true,
    radius: ['55%', '75%'],
    center: ['50%', '37.5%'],
    label: {
      normal: {
        show:true,
        position:'center',
        formatter:function(){
          return'  100% \r\n执行完成'
        },
        textStyle:{
          fontSize:30,
        }
      },
      align: 'left',
      position: 'center',
      show:true,
      
    },
    emphasis: {
        label: {
            show: false,
            fontSize: '20',
            fontWeight: 'bold'
        }
    },
    labelLine: {
        show: false
    }
  }]
}

const bar = {
  title: {
    text: ''
  },
  grid: {
    right: '2%'
  },
  xAxis: {
    splitLine: {
      show: false
    },
    axisLabel: {
      formatter(v) {
        return `${v.split(',')[0]} (${v.split(',')[2]})`
      }
    }
  },
  tooltip: {
    formatter(v) {
      const val = v[0].name.split(',')
      return `${val[0]} (${v[0].value})`
    }
  },
  series: [{
    type: 'bar',
    barWidth: 30
  }]
}

const simple = {
  xAxis: {
    splitLine: {
      show: false
    },
    axisLabel: {
      interval: 0,
      showMaxLabel: true,
      formatter(v) {
        return tasksState[v].desc
      }
    }
  },
  tooltip: {
    formatter(data) {
      let str = ''
      _.map(data, (v, i) => {
        if (i === 0) {
          str += `${tasksState[v.name].desc}<br>`
        }
        str += `<div style="font-size: 12px;">${v.seriesName} : ${v.data}<br></div>`
      })
      return str
    }
  },
  color: ['#D5050B', '#0398E1']

}

export {
  pie,
  bar,
  simple
}
