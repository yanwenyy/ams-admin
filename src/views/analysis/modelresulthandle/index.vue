<template>
  <!-- index.vue是最外层的父页签组件，把firstParentTabCon.vue挂载进来作为第一个页签中的内容 -->
  <div>
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      closable
      @tab-remove="removeTab">
      <!-- 加一个固定页签 -->
      <el-tab-pane
        name="模型分配结果"
        label="模型分配结果"
      ><firstParentTabCon :projectId="projectId" @addtab="addTab" />
      </el-tab-pane>
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name">
        <!-- 新页签中页签组件 -->
        <!-- <div v-html="item.content"></div> -->
        <childTabs
          :maintable="item.mainTable"
          :helptables="item.helpTables"
          :model-uuid="item.modeluuid"
          :resultSpiltObjects="item.resultSpiltObjects"
          useType="modelRunResult"
          :projectUuid="item.projectUuid"
          :modelType="item.modelType"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import firstParentTabCon from '@/views/analysis/modelresulthandle/firstparenttabcon'
import childTabs from '@/views/analysis/modelresulthandle/childtabs'
import { getOneDict } from "@/utils/index";
export default {
  components: {
    firstParentTabCon,
    childTabs
  },
   props: {
    projectId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editableTabsValue: '模型分配结果', //第一个大页签的名称
      editableTabs: [], //存放每一个页签对象
      tabIndex: 0, //语句记录页签个数
      mainTable: {}, //运行结果表主表对象
      helpTables: [], //运行结果表附表数组
    }
  },
  methods: {
    // 添加页签方法  resultTable:辅表（运行结果表）数组    mainTable:主表（运行结果表对象）   modelname:模型的名称，用来给新页签赋值title属性用
    addTab(resultTable, mainTable, modelname, modelUuid,resultSpiltObjects,projectUuid, selectRow) {
      const newTabName = ++this.tabIndex + ''
      this.mainTable = mainTable
      this.helpTables = resultTable
      this.editableTabs.push({
        title: modelname + '模型结果',
        name: newTabName,
        mainTable: mainTable,
        helpTables: resultTable,
        modeluuid: modelUuid,
        resultSpiltObjects:resultSpiltObjects,
        projectUuid:projectUuid,
        modelType: this.getModelType(this.modelTypeFormatter({modelType: selectRow.model.modelType}))
      })
      this.editableTabsValue = newTabName
    },
    modelTypeFormatter(row, column) {
      const modelType = row.modelType;
      const dicObj = getOneDict(modelType);
      let value = "";
      if (dicObj.length == 0) {
        return "";
      }
      value = dicObj[0].codeName;
      return value;
    },
    getModelType (name) {
      if(name == 'SQL模型') {
        return 'sql'
      } else if (name == '图形化模型') {
        return 'graph'
      } else {
        return name
      }
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
              activeName = '模型分配结果'
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
