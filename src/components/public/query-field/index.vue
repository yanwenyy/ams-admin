<template>
  <div class="query-field"
       :class="skinMisalignment?(componentMisalignment?'re-or':'ab-or'):'re-or'"
       :style="queryFieldStyle">
    <el-form :inline="true"
             :model="query"
             label-position="bottom">
      <!--      <div class="switch-btn">-->
      <!--        <img :src="this.switchImg" @click="onSwitchWith">-->
      <!--      </div>-->

      <el-form-item v-for="fd in formData"
                    v-if="searchBar == '0'"
                    :label="fd.label">
        <el-input v-if="fd.type==='text'"
                  v-model="query[fd.name]"
                  :style="textStyle" />
        <el-input v-if="fd.type==='fuzzyText'"
                  v-model="query[fd.name]"
                  placeholder=""
                  :style="textStyle" />
        <el-select v-if="fd.type==='select'"
                   v-model="query[fd.name]"
                   :style="selectStyle">
          <el-option label="全部"
                     value="" />
          <el-option v-for="opt in fd.data"
                     :label="opt.name"
                     :value="opt.value" />
        </el-select>
        <template v-if="fd.type==='timePeriod'">
          <el-date-picker v-model="query[fd.name+'Start']"
                          :type="dateType"
                          placeholder="开始时间"
                          :style="timeStyle"
                          :picker-options="(query[fd.name+'End'] != null &&  query[fd.name+'End'] != '') ?
                               { disabledDate(time) { return query[fd.name+'End'] <  time.getTime() }} :
                               { disabledDate() { return null }}" />
          <el-date-picker v-model="query[fd.name+'End']"
                          :type="dateType"
                          placeholder="结束时间"
                          :style="timeStyle"
                          :picker-options="(query[fd.name+'Start'] != null  &&  query[fd.name+'Start'] != '')  ?
                               { disabledDate(time) { return time.getTime() <  query[fd.name+'Start'] }} :
                               { disabledDate() { return null }}" />
        </template>
      </el-form-item>

      <el-form-item v-if="searchBar == '0'">
        <el-button type="primary"
                   @click="onSubmit"
                   class="search_btn">查询</el-button>
        <el-button type="primary"
                   @click="clearAll"
                   class="search_btn">清空</el-button>
        <!--        <img :src="searchFor" @click="onSubmit" class="someimgin"/>-->
        <!--        <img :src="resetFor" @click="clearAll" class="someimgin"/>-->
      </el-form-item>

      <el-form-item v-if="searchBar == '1'"
                    class="full-search">
        <el-input v-model="keywordQuery['keyword']"
                  placeholder="查询">
          <img slot="suffix"
               src="./input.png"
               class="img-icon"
               @click="onSubmit">
        </el-input>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { objectMerge } from '@/utils'
export default {
  props: {
    formData: {
      type: Array,
      default: []
    },
    dateType: {
      type: String,
      default: 'date'
    }
  },
  data () {
    return {
      query: {},
      keywordQuery: {},
      searchBar: '0',
      switchImg: '',
      searchFor: require('../../public/query-field/搜索.png'),
      resetFor: require('../../public/query-field/重置.png'),
      /*      inquire:[
        {
          text: 'test',
          fuzzyText: 'asd',
          startTime:'2020-12-02',
          endTime:'2020-12-04',
          select:'002002001'
        }
      ],*/
      // 监听浏览器宽度
      screenWidth: document.body.clientWidth,
      // 是否需要错行显示
      componentMisalignment: false,
      skinMisalignment: true,
      textWidth: 163,
      selectWidth: 163,
      timePeriodWidth: 220,
      queryFieldHeight: 45
    }
  },
  computed: {
    textStyle () {
      return `width: ${this.textWidth}px`
    },
    selectStyle () {
      return `width: ${this.selectWidth}px`
    },
    timeStyle () {
      return `width: ${this.timePeriodWidth}px`
    },
    // 解决两层搜索框高度折叠问题
    queryFieldStyle () {
      return `height: ${this.queryFieldHeight}px !important`
    }
  },
  watch: {
    formData: {
      deep: true,
      immediate: true,
      handler (o) {
        this.setData(o)
      }
    },
    screenWidth: {
      handler (newVal, oldVal) {
        // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
        if (!this.timer) {
          // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
          this.screenWidth = newVal;
          this.timer = true;
          let that = this;
          setTimeout(function () {
            that.timer = false;
            that.contentWidthChange();//执行自己的逻辑
          }, 1000 / 60)
        }
      },
      immediate: true,
    }
  },
  created () {
    this.setData(this.formData)
  },
  mounted () {
    this.cSearch()
    let that = this;
    window.addEventListener("resize", function () {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        that.screenWidth = window.screenWidth;
      })();
    })
    if (process.env.VUE_APP_BASE_SKIN === 'default') {
      this.skinMisalignment = true
    } else {
      this.skinMisalignment = false
    }
  },
  methods: {
    getData () {
      return this.query
    },
    setData (data) {
      switch (this.searchBar) {
        case '0':
          data.forEach(fd => {
            if (fd.type === 'timePeriod') {
              this.$set(this.query, fd.name + 'Start', null)
              this.$set(this.query, fd.name + 'End', null)
              // 示例fd.value = '2020-12-02,2020-12-04'
              if (fd.value && fd.value !== null && fd.value instanceof Array) {
                const valueTime = fd.value
                if (valueTime.length === 2) {
                  this.query[fd.name + 'Start'] = valueTime[0]
                  this.query[fd.name + 'End'] = valueTime[1]
                }
              }
            } else if (fd.type === 'text' || fd.type === 'fuzzyText') {
              this.$set(this.query, fd.name, '')
              // 示例fd.value = 'asd'
              if (fd.value && fd.value !== null && fd.value !== '') { this.query[fd.name] = fd.value }
            } else if (fd.type === 'select') {
              this.$set(this.query, fd.name, null)
              // 示例fd.value = '002002001'
              if (fd.value && fd.value !== null && fd.value !== '') { this.query[fd.name] = fd.value } else {
                this.$set(this.query, fd.name, '')
              }
            }
          })
          break
        case '1':
          data.forEach(fd => {
            if (fd.type === 'timePeriod') {
              this.$set(this.keywordQuery, fd.name + 'Start', null)
              this.$set(this.keywordQuery, fd.name + 'End', null)
              // 示例fd.value = '2020-12-02,2020-12-04'
              if (fd.value && fd.value !== null && fd.value instanceof Array) {
                const valueTime = fd.value
                if (valueTime.length === 2) {
                  this.keywordQuery[fd.name + 'Start'] = valueTime[0]
                  this.keywordQuery[fd.name + 'End'] = valueTime[1]
                }
              }
            } else if (fd.type === 'text' || fd.type === 'fuzzyText') {
              this.$set(this.keywordQuery, fd.name, '')
              // 示例fd.value = 'asd'
              if (fd.value && fd.value !== null && fd.value !== '') { this.keywordQuery[fd.name] = fd.value }
            } else if (fd.type === 'select') {
              this.$set(this.keywordQuery, fd.name, null)
              // 示例fd.value = '002002001'
              if (fd.value && fd.value !== null && fd.value !== '') { this.keywordQuery[fd.name] = fd.value } else {
                this.$set(this.query, fd.name, '')
              }
            }
          })
          break
      }
    },
    onSubmit () {
      switch (this.searchBar) {
        case '0':
          // return
          this.$emit('submit', this.query)
          break
        case '1':
          // return
          this.$emit('submit', this.keywordQuery)
          break
      }
    },
    clearAll () {
      Object.keys(this.query).forEach(o => {
        this.query[o] = null
      })
    },
    // 查询方式切换
    onSwitchWith () {
      if (this.searchBar === '0') {
        this.searchBar = '1'
      } else {
        this.searchBar = '0'
      }
      const url = window.location.href
      const urls = url.split('/')
      this.searchBar === '0' ? this.switchImg = require('../../public/query-field/filter.png') : this.switchImg = require('../../public/query-field/filter-in.png')
      localStorage.setItem(urls, this.searchBar)
    },
    cSearch () {
      const url = window.location.href
      const urls = url.split('/')
      if (localStorage.getItem(urls)) {
        this.searchBar = localStorage.getItem(urls)
      }
      this.searchBar === '0' ? this.switchImg = require('../../public/query-field/filter.png') : this.switchImg = require('../../public/query-field/filter-in.png')
    },
    contentWidthChange () {
      // 获取搜索框数量
      let widthCount = 0
      for (let i = 0; i < this.formData.length; i++) {
        if (this.formData[i].type === 'timePeriod') {
          widthCount += 2
        } else {
          widthCount += 1
        }
      }
      this.componentMisalignment = false
      this.queryFieldHeight = 45
      // 判断应该减少宽度的情况
      if (this.screenWidth < 1920 && widthCount > 3) {
        // // 调度流程实例使用
        if (widthCount >= 7) {
          let inPutWords = (30 * (1920 - this.screenWidth) / 520).toFixed(1)
          this.textWidth = 153 - inPutWords
          this.selectWidth = 153 - inPutWords
          let inPutTimes = (85 * (1920 - this.screenWidth) / 520).toFixed(1)
          this.timePeriodWidth = 230 - inPutTimes
          this.componentMisalignment = true
          // 多行的时候修改高度
          this.componentMisalignment ? this.queryFieldHeight = 90 : this.queryFieldHeight = 45
          return
        }
        // 如果减少宽度仍旧不够 则放开限制 自动换行
        if (this.screenWidth >= 1400 && this.screenWidth < 1920) {
          let inPutWords = (30 * (1920 - this.screenWidth) / 520).toFixed(1)
          this.textWidth = 153 - inPutWords
          this.selectWidth = 153 - inPutWords
          let inPutTimes = (85 * (1920 - this.screenWidth) / 520).toFixed(1)
          this.timePeriodWidth = 210 - inPutTimes
          this.componentMisalignment = false
        } else {
          this.textWidth = 90
          this.selectWidth = 100
          this.timePeriodWidth = 125
          this.componentMisalignment = true
        }
      } else {
        // 宽度足够则恢复原设定
        this.textWidth = 153
        this.selectWidth = 153
        this.timePeriodWidth = 200
        this.componentMisalignment = false
      }
    }
  }

}
</script>
<style lang="scss" scoped>
.query-field {
  height: 45px;
  z-index: 500;
}
/*.el-form--inline .el-form-item {*/
/*margin-right: 30px;*/
/*vertical-align: top;*/
/*}*/
/*.el-form-item__label{*/
/*vertical-align: top;*/
/*}*/
.el-form-item__label {
  text-align: right;
  vertical-align: top;
}
.full-search {
  float: left;
}
.switch-btn {
  margin-top: 3px;
  float: left;
  margin-right: 10px;
}
.img-icon {
  margin-top: 8px;
  margin-right: 5px;
}
.someimgin {
  height: 35px;
  padding: 4px;
  border-radius: 100%;
  border: 1px solid #000;
  margin-right: 8px;
  cursor: pointer;
}
.someimgin:hover {
  background: #ececec;
}
.ab-or {
  position: absolute;
}
.re-or {
  position: relative;
}
</style>
