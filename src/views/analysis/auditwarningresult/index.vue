<template>
  <!-- index.vue是最外层的父页签组件，把firstParentTabCon.vue挂载进来作为第一个页签中的内容 -->
  <div class="warningresult">
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      closable
      @tab-remove="removeTab"
    >
      <!-- 加一个固定页签 -->
      <el-tab-pane
        name="预警结果"
        label="预警结果"
      ><firstParentTabCon :runTaskUuid="runTaskUuid" @addtab="addTab" /></el-tab-pane>
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        <!-- 新页签中页签组件 -->
        <!-- <div v-html="item.content"></div> -->
        <childTabs
          ref="childtabsref"
          :maintable="item.mainTable"
          :helptables="item.helpTables"
          :model-uuid="item.modeluuid"
          :modelTitle="item.title"
          :resultSpiltObjects="item.resultSpiltObjects"
          :useType="item.useType===undefined?'modelRunResult':item.useType"
          :pre-value="item.currentExecuteSQL"
          @addTab="addTab"
          @setNextValue="setNextValue"
          :model-id="item.modelId"
          :result-mark="item.currentExecuteSQL===undefined?'modelResult':'modelPreview'"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import firstParentTabCon from '@/views/analysis/auditwarningresult/firstparenttabcon'
import childTabs from '@/views/analysis/auditmodelresult/childtabs'
export default {
  components: {
    firstParentTabCon,
    childTabs
  },
  data() {
    return {
      editableTabsValue: '预警结果', //第一个大页签的名称
      editableTabs: [], //存放每一个页签对象
      tabIndex: 0, //语句记录页签个数
      mainTable: {}, //运行结果表主表对象
      helpTables: [], //运行结果表附表数组
      runTaskUuid: null // 模型预警结果id
    }
  },
  created(){
    if (this.$route.params.runTaskUuid) {
      this.runTaskUuid = this.$route.params.runTaskUuid
    }
  },
  methods: {
    // 添加页签方法  resultTable:辅表（运行结果表）数组    mainTable:主表（运行结果表对象）   modelname:模型的名称，用来给新页签赋值title属性用
    addTab(resultTable, mainTable, modelname, modelUuid,resultSpiltObjects,usetype,currentExecuteSQL) {
      const newTabName = ++this.tabIndex + ''
      this.mainTable = mainTable
      this.helpTables = resultTable
      this.editableTabs.push({
        title: modelname + '预警结果',
        name: newTabName,
        mainTable: mainTable,
        helpTables: resultTable,
        modeluuid: modelUuid,
        resultSpiltObjects:resultSpiltObjects,
        useType : usetype,
        modelId:modelUuid,
        currentExecuteSQL:currentExecuteSQL
      })
      this.editableTabsValue = newTabName
    },
    setNextValue(val){
      let _this =this
      setTimeout(function(){
        _this.$refs.childtabsref[_this.editableTabs.length-1].loadTableData(val,'apple')
      },1000)
    },
    // 删除页签方法
    removeTab(targetName) {
      const tabs = this.editableTabs
      let activeName = this.editableTabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            } else {
              activeName = '预警结果'
            }
          }
        })
      }

      this.editableTabsValue = activeName
      this.editableTabs = tabs.filter((tab) => tab.name !== targetName)
    }
  }
}
</script>
<style>
.warningresult .is-vertical{
  overflow: hidden;
}
</style>
