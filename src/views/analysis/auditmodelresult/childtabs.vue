<template>
  <!-- childTabs是子页签组件 -->
  <!-- 主页面大页签（模型列表等）执行结果 -->
  <el-tabs type="border-card" class="child-taps-top" v-model="selectTabName">
    <el-tab-pane v-if="useType==='modelRunResult'?true:false" style="height:calc(100% - 60px)" :label="useType === 'modelRunResult' ? '主表' : '结果1'"
      ><childTabCons
        :callType="callType"
        :tableType="tableType"
        :settingInfo="settingInfo"
        :nowtable="maintable"
        :model-uuid="modelUuid"
        :modelTitle="modelTitle"
        :useType="useType"
        :resultSpiltObjects="resultSpiltObjects"
        :modelId="modelId"
        :myIndex='1'
        :preLength="1"
        @addBigTabs="addBigTabs"
        @setNextValue="setNextValue"
        @saveModelResult="saveModelResult"
        ref="onlyChild"
        :modelType="modelType"
        :modelData="modelData"
        @triggerSearch="triggerSearch"
    /></el-tab-pane>
    <!-- 单个模型执行结果页签（主表、辅表） -->
    <el-tab-pane
      v-for="(item, key) in useType==='modelRunResult'?helptables:preValue"
      :key="key"
      :label="tabsName(key,item)"
      class="result-tabs"
      :style="useType==='previewTable'?'height:500px':''"
      >
      <!-- aggrid数据表格渲染 -->
      <childTabCons
          :callType="callType"
          :tableType="tableType"
        ref="child"
        :is-model-preview="isModelPreview"
        :model-uuid="tabsName(key,item) == '主表' && modelUuid || undefined"
        @addBigTabsModelPreview="addBigTabsModelPreview"
        @addBigTabs="addBigTabs"
        @setNextValue="setNextValue"
        @saveModelResult="saveModelResult"
        :chartModelUuid="chartModelUuid"
        :resultSpiltObjects="resultSpiltObjects"
        :modelId="modelId"
        :nowtable="item"
        :modelTitle="modelTitle"
        :prePersonalVal="item"
        :useType="useType"
        :modelType="modelType"
        :preLength="useType=='sqlEditor'||useType=='modelPreview'?preValue.length:1"
        :myIndex="useType=='sqlEditor'||useType=='modelPreview'?key:1"
        :modelData="modelData"
          :executeSqlViewData="executeSqlViewData"
          :dataSource="dataSource"
        @triggerSearch="triggerSearch"
        @refreshDataTabTree="refreshDataTabTree"
        />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import childTabCons from "@/views/analysis/auditmodelresult/childtabcon";
import { now } from "moment";
import {addRunTaskAndRunTaskRel, deleteModel, uuid2} from "@/api/analysis/auditmodel";
import {deleteGraphInfoById} from "@/api/graphtool/apiJs/graphList";
import {sendToOA} from "@/api/analysis/auditmodelresult";
export default {
  components: {
    'childTabCons':childTabCons
  },
  data() {
    return {
      tableType:'',
      index:0,
      hasButton:false,
      paramInfoCopy:{},
      helpTableCounter:0,
      selectTabName:'0'
    };
  },
  created(){
    console.log(this.useType)
  },
  mounted() {
    this.paramInfoCopy = this.paramInfo
  },
  methods: {
    //刷新数据表树
    refreshDataTabTree(){
      this.$emit('refreshDataTabTree',"")
    },
    //放大或缩小点击
    zoomChangeTable(type){
      this.tableType=type;
      // console.log(this.$refs.onlyChild);
      // this.$refs.child[0].zoomChange(type);
      for(let i in this.$refs.child){
        // console.log(this.$refs.child[i]);
        i&&this.$refs.child[i]&&this.$refs.child[i].zoomChange(type);
      }
      // for(let i=0,l=this.$refs.child.length;i<l;i++){
      //   this.$refs.child[i].zoomChange(type);
      // }
    },
    /**
     * sql编辑器模型结果用来给子组件aggrid表格赋值
     */
      loadTableData(nextValue,modelName, isPreviewAndFunc){
        this.$refs.child[this.index].initData(null,nextValue,modelName, isPreviewAndFunc)
        this.index++;
      },
      /**
       * sql编辑器模型结果用于给子组件aggrid表格加遮罩
       */
      reSetTable(){
        for(var i = 0;i<this.preValue.length;i++){
          this.$refs.child[i].reSet1()
        }
        this.index = 0
      },
      tabsName(key, item){
        console.log("=======")
        console.log(this.maintableindex)
        if(this.useType==='modelRunResult'||this.useType==='sqlEditor'||this.useType==='modelPreview'){
          let tabname = '';
          // if(this.maintableindex){
            if(key==this.maintableindex){
              tabname = '主表'
              this.selectTabName = ''+key
            }else{
              tabname = '辅助' + (key + 1)
            }
          // }else{
          //   if (item.type != null && item.type.trim().length > 0) {
          //     tabname = item.type =="1"?'主表':'辅助' + (key + 1)
          //   } else {
          //     tabname = this.preValue.length === key + 1 ? '主表' : '辅助' + (key + 1)
          //   }
          //   this.selectTabName = tabname === '主表' ? '' + key : this.selectTabName
          // }
          return tabname
        }else if(this.useType==='previewTable'){
            return '数据详情'
        }else if(this.useType==='graph'){
          return this.preValue[key].name
        }
      },
    addBigTabs(resultTable,mainTable,modelname,modelUuid,resultSpiltObjects,useType,currentExecuteSQL, detailModel){
        this.$emit('addTab',undefined,undefined,modelname,modelUuid,undefined,useType,currentExecuteSQL, undefined, detailModel)
    },
    addBigTabsModelPreview(modelName,modelUuid,currentExecuteSQL){
      var modelObj = {modelName:modelName,modelUuid:modelUuid}
      this.$emit('addTab',modelObj,false,currentExecuteSQL,true)
    },
    setNextValue(val){
      this.$emit('setNextValue',val)
    },
    clickBigTab(){
        if (this.resultMark==='modelResult'){
          this.$refs.onlyChild.clickBigTab()
        }else{
          this.$refs.child[this.index-1].clickBigTab()
        }
    },
    loadNewParamInfo(paramInfo){
      this.paramInfoCopy = paramInfo
    },
    saveModelResult(){
      var runTaskUuid = uuid2();
      var batchUuid = uuid2();
      var runTaskRels = [];
      var runTaskRelUuid = uuid2();
      var runTaskRel = {
        runTaskRelUuid: runTaskRelUuid,
        runTaskUuid: runTaskUuid,
        sourceUuid: this.modelId,
        settingInfo: JSON.stringify(this.paramInfoCopy),
        modelVersion: 1,
        runRecourceType: 1,
        isDeleted: 0,
        runStatus: 1,
      };
      runTaskRels.push(runTaskRel);
      var runTask = {
        runTaskUuid: runTaskUuid,
        batchUuid: batchUuid,
        runTaskName: "系统添加",
        runType: 3,
        timingExecute: "",
        //locationUuid: modelResultSavePathId,
        runTaskRels: runTaskRels
      };
      if(process.env["VUE_APP_BASE_PROJECT_TYPE"]=="BOE"){
        addRunTaskAndRunTaskRel(runTask,this.dataUserId,this.sceneCode).then((resp) => {
          if (resp.data == true) {
            // this.$notify({
            //   title: "提示",
            //   message: "已经将模型添加到后台自动执行，请去'模型结果'查看",
            //   type: "success",
            //   duration: 2000,
            //   position: "bottom-right",
            // });
            sendToOA(runTaskRelUuid).then((resp) => {
              this.$message({
                type: "success",
                message: "发送成功!",
              });
            });
          } else {
            this.$message({ type: "info", message: "执行运行任务失败" });
          }
        });
      }else{
          addRunTaskAndRunTaskRel(runTask).then((resp) => {
          if (resp.data == true) {
            this.$notify({
              title: "提示",
              message: "已经将模型添加到后台自动执行，请去'模型结果'查看",
              type: "success",
              duration: 2000,
              position: "bottom-right",
            });
          } else {
            this.$message({ type: "info", message: "执行运行任务失败" });
          }
        });
      }
    },
    triggerSearch (val) {
      this.$emit('triggerSearch',val)
    }
  },
  /**
   * SQL编辑器结果、模型结果界面使用变量：preValue:先传过来的值，用于判断加几个页签  nextValue：后传过来的数据表
   * 模型运行结果使用变量：maintable：运行结果表主表对象   helptables：运行结果表附表对象数组   modelUuid：点击模型结果名称模型的uuid
   * 公用变量：useType：判断是SQL编辑器结果、模型结果界面还是模型运行结果界面
   */
  props: [
      "callType",
    "maintable",
    "helptables",
    "modelUuid",
    "modelTitle",
    "useType",
    "preValue",
    "resultSpiltObjects",
    "modelId",
    "chartModelUuid",
    "settingInfo",
    "resultMark",
    "isModelPreview",
    "isRelation",
    "paramInfo",
    "dataUserId",
    "sceneCode",
    "maintableindex",
    "modelType",
    "modelData",
    "executeSqlViewData",
    "dataSource"
  ],
};
</script>
<style scoped>
>>>.el-tabs__item{
    height:32px!important;
    line-height:32px!important;
}
>>>.el-tabs__content{
  height: calc(100% - 50px);
  overflow-y: auto!important;
  padding:0px!important;
}
>>>.el-tabs__content::-webkit-scrollbar {
  height: 0;
  width: 0;
  color: transparent;
}
.result-tabs{
  height:100%
}
.child-taps-top{
  height:100%;
}
</style>
