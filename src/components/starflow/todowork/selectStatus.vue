<template>
    <div class="table_template">
  <div>
    <el-select v-model="warningStatus" placeholder="请选择">
      <el-option
        v-for="(item, i) in warningStatusOption"
        :key="i"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    </div>
    
    <div style="margin-top:-2px;float:right">
      <span slot="footer">
        <el-button
          size="mini"
          type="info"
          class="table_header_btn"
          @click="save"
          >确定</el-button
        >
        <el-button
          size="mini"
          type="info"
          class="table_header_btn"
          @click="turnOff"
          >关闭</el-button
        >
      </span>
    </div>
  </div>
  
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "tableTest",
  data() {
    return {
      warningStatus: '',
      warningStatusOption: [
        {
          value: "0",
          label: "初始状态（不可挂号）",
        },
        {
          value: "1",
          label: "待挂号",
        },
        {
          value: "2",
          label: "预警待查，待办疑点清单--预警待查",
        },
        {
          value: "3",
          label: "已销号",
        },
      ],
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //子路由保存
    save() {
      this.$emit("closeSelectStatus", this.warningStatus);
    },
    turnOff() {
      this.$emit("closeSelectStatusdialog");
    },
  },
};
</script>

<style scoped>
</style>