<template>
  <!-- childtabscopy和childtabs组件完全一致 -->
  <el-tabs type="border-card">
    <el-tab-pane v-if="useType=='modelRunResult'?true:false" :label="useType == 'modelRunResult' ? '主表' : '结果1'"
      ><childtabconcopy
        :nowtable="maintable"
        :model-uuid="modelUuid"
        :useType="useType"
    /></el-tab-pane>
    <el-tab-pane
      v-for="(item, key) in useType=='modelRunResult'?helptables:preValue"
      :key="key"
      :label="
        useType == 'modelRunResult' ? '辅表' + (key + 1) : '结果' + (key + 1)
      "
      ><childtabconcopy ref="child" :nowtable="item" :prePersonalVal="item" :useType="useType" />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import childtabconcopy from "@/views/analysis/auditmodelresult/childtabconcopy";
import { now } from "moment";
export default {
  components: {
    childtabconcopy
  },
  data() {
    return {
      index:0
    };
  },
  methods: {
      loadTableData(nextValue){
        this.$refs.child[this.index].initData(null,nextValue)
        this.
          index++;
      },
      reSetTable(){
        for(var i = 0;i<this.preValue.length;i++){
          this.$refs.child[i].reSet()
        }
        this.index = 0
      }
  },
  /**
   * SQL编辑器结果、模型结果界面使用变量：preValue:先传过来的值，用于判断加几个页签  nextValue：后传过来的数据表
   * 模型运行结果使用变量：maintable：运行结果表主表对象   helptables：运行结果表附表对象数组   modelUuid：点击模型结果名称模型的uuid
   * 公用变量：useType：判断是SQL编辑器结果、模型结果界面还是模型运行结果界面
   */
  props: [
    "maintable",
    "helptables",
    "modelUuid",
    "useType",
    "preValue"
  ],
};
</script>
