<template>
  <div>
    <div v-if="applyType == 'early_warning'">
      <!--          // TODO 根据applyType，判断不同工作流，引用不同业务组件，例如：problemflow(问题复核)、clueflow(线索核实)、modelpublishflow(模型上线)-->
      <busDatas
        ref="busDatas"
        :versionUuid="versionUuid"
        :appDataUuid="appDataUuid"
        :applyType="applyType"
        :flowSetup="flowSetup"
        :actionIdList="actionIdList"
      ></busDatas>
    </div>
<!--    <div  v-if="applyType == 'problemflow'">
      <problemFlow
        :appDataUuid="appDataUuid"
        :applyType="applyType"
       ></problemFlow>
    </div>-->

    <div v-if="applyType == 'clueflow' && approvalData.workflowPackageId=='com.icss.ams.auditflow'">
      <!--          // TODO 根据applyType，判断不同工作流，引用不同业务组件，例如：problemflow(问题复核)、clueflow(线索核实)、modelpublishflow(模型上线)-->
      <tcClueBusDatas
              ref="busDatas"
              :versionUuid="versionUuid"
              :appDataUuid="appDataUuid"
              :applyType="applyType"
              :flowSetup="flowSetup"
              :actionIdList="actionIdList"
      ></tcClueBusDatas>
    </div>

    <div v-if="applyType == 'modelpublishflow' && approvalData.workflowPackageId=='com.icss.ams.auditflow'">
      <!--          // TODO 根据applyType，判断不同工作流，引用不同业务组件，例如：problemflow(问题复核)、clueflow(线索核实)、modelpublishflow(模型上线)-->
      <reivewCheck
              ref="busDatas"
              :versionUuid="versionUuid"
              :appDataUuid="appDataUuid"
              :applyType="applyType"
              :flowSetup="flowSetup"
              :actionIdList="actionIdList"
      ></reivewCheck>
    </div>
  </div>
</template>
<script>
// TODO 引入待办业务组件
import busDatas from "ams-clue-vue/src/components/todowork/busDatas";
// import problemFlow from "@/views/flowwork/problemflow";
import tcClueBusDatas from "ams-clue-vue/src/components/tcFlowWork/todowork/busDatas";
import reivewCheck from "@/views/flowwork/reivewCheck";
export default {
  components: {
    busDatas,
    // problemFlow,
    tcClueBusDatas,
    reivewCheck,
  },

  data() {
    return {
      // versionUuid: "",
      // appDataUuid: "",
      // applyType: "",
    };
  },
  /**
       * versionUuid: 流程图版本号，审批单版本号
       * appDataUuid: 业务数据主键(如：问题ID、线索ID、模型id)
       * applyType:   审批单类型，工作流流程id(如：problemflow(问题复核)、clueflow(线索核实)、modelpublishflow(模型上线))
       * flowSetup:   工作流设置参数
       *               //控制审批页面元素显示隐藏参数
       *                  flowSet:{
       *                     opinionList:true,
       *                     opinion:true,
       *                     nextStep:true,     // 下一步
       *                     done:false    // 是否已办
       *                   },
       * actionIdList: 业务操作ID,与工作流无关的其他操作
       */
  props: [
    "versionUuid",
    "appDataUuid",
    "applyType",
    "flowSetup",
    "actionIdList",
    "approvalData",
  ],
  // mounted: function () {
  //   alert("ss")
  //   alert(this.applyType)
  //   alert(this.approvalData.workflowPackageId)
  // },
  created() {
    console.log(this.applyType);
  },
  methods: {
    updateSave() {
      setTimeout(() => {
        this.$refs["busDatas"].updateSave();
      }, 20);
    },
  },
};
</script>