<template>
  <div class="page-container">
    <el-row :gutter="5">
      <el-col :span="6">
        <el-select
          v-model="currentSceneUuid"
          placeholder="请选择"
          style="display: none"
        >
          <el-option
            v-for="scene in allScene"
            :key="scene.sceneUuid"
            :label="scene.sceneName"
            :value="scene.sceneUuid"
          />
        </el-select>
        <div class="org-box" v-loading="orgLoading">
          <el-tabs
            v-model="grpUuid"
            @tab-click="tabClick"
            ref="eltab"
            v-if="currentScene && currentScene.groups.length > 0"
          >
            <el-tab-pane
              v-for="grp in currentScene.groups"
              :key="grp.sceneGrpUuid"
              :label="grp.grpName"
              :name="grp.sceneGrpUuid"
            >
              <!-- <el-input
              v-model="filterText"
              placeholder="输入关键字进行过滤"
              /> -->
              <div class="orgTree-box">
                <div v-if="orglistLoading" class="orglistLoadingDia"></div>
                <MyElTree
                  :ref="'A' + grp.sceneGrpUuid"
                  v-loading="treeLoading"
                  :props="props"
                  class="filter-tree left-tree"
                  :highlight-current="true"
                  :data="orgTreeData"
                  node-key="id"
                  :filter-node-method="filterNode"
                  show-checkbox
                  :lazy="true"
                  :load="loadNode"
                  @node-expand="handleNodeClick"
                >
                  <span slot-scope="{ node, data }" class="custom-tree-node">
                    <span>{{ node.label }}</span>
                  </span>
                </MyElTree>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>

      <el-col :span="2" style="width: 45px; padding-top: 10%">
        <div class="transfer-center">
          <p class="transfer-center-item">
            <el-button
              type="primary"
              icon="el-icon-arrow-right"
              circle
              :disabled="isNoClick"
              @click="addGrp"
              title="选中（或勾选）左侧组织树节点并点击此按钮可以向角色添加用户/用户组"
            />
          </p>
        </div>
      </el-col>

      <el-col :span="17">
        <el-col align="right" style="padding-top: 10px;">
          <!--          <el-button type="primary" class="oper-btn edit-period btn-width-max" :disabled="selections.length !== 1" @click="setExpireDate" />-->
          <el-button
            type="primary"
            class="oper-btn"
            :disabled="selections.length === 0 || isNoClick"
            @click="removeGrp"
          ><img src="../../../styles/image/delete.png"
                class="btn_icon icon1"
                alt="">
            <img src="../../../styles/image/delete2.png"
                 class="btn_icon icon2"
                 alt="">删除</el-button>
          <el-button type="primary" :disabled="isNoClick" @click="saveRoleGrp">保存</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-col>
        <el-table
          key="colMetaUuid"
          v-loading="listLoading"
          :data="tableData"
          border
          fit
          highlight-current-row
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :row-class-name="tableRowClassName"
          max-height="500"
        >
          <el-table-column width="55" type="selection" />
          <el-table-column
            prop="tableId"
            label="序号"
            width="50">
          </el-table-column>
          <el-table-column
            label="类型"
            min-width="150px"
            align="center"
            prop="userType"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.userType == 1 ? "用户组" : "用户" }}
            </template>
          </el-table-column>
          <el-table-column
            label="名称"
            min-width="150px"
            align="center"
            prop="userName"
            show-overflow-tooltip
          />
          <el-table-column label="编码" width="300px" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.userType == 1">{{
                scope.row.grpInstUuid
              }}</span>
              <span v-if="scope.row.userType == 2">{{
                scope.row.unitUuid
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="使用期限" width="300px" align="center">
            <template slot-scope="scope">
              <div @click="clickSelectTime(scope.row)">
                <span class="serviceLife" v-if="scope.row.startTime == null && scope.row.endTime == null">无限制</span>
                <span class="serviceLife" v-else>
                  {{ scope.row.startTime == null ? " - " : scope.row.startTime }}
                  至
                  {{ scope.row.endTime == null ? " - " : scope.row.endTime }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="授权时间"
            width="200px"
            align="center"
            prop="createTime"
            show-overflow-tooltip
          />
          <!--<el-table-column label="操作" width="150px" align="center">
            <template slot-scope="scope">
              <el-button @click="removeGrp(scope)">删除</el-button>
            </template>
          </el-table-column>-->
        </el-table>
      </el-col>
    </el-row>

    <!-- 选择授权时间 -->
    <el-dialog :append-to-body="false"
               :close-on-click-modal="false"
               title="使用期限"
               :visible.sync="serviceLifeDialog">
      <div>
        <el-form ref="parammodelform" :model="temp">
          <el-form-item label="开始时间" prop="startTime">
              <el-date-picker v-model="temp.startTime"
                              format="yyyy-MM-dd HH:mm:ss"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              clearable
                              style="width: 100%"
                              :picker-options="startDatePicker"
                              :disabled="false"
                              type="datetime"
                              :placeholder="'请输入生效开始时间'" />
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker v-model="temp.endTime"
                              format="yyyy-MM-dd HH:mm:ss"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              clearable
                              style="width: 100%"
                              :picker-options="endDatePicker"
                              :disabled="false"
                              type="datetime"
                              :placeholder="'请输入生效结束时间'" />
            </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="serviceLifeDialog = false">关 闭</el-button>
        <el-button @click="sureServiceLife()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MyElTree from "@/components/public/tree/src/tree.vue";
import { getAllScene, initSceneTree, queryOrgTree } from "@/api/data/scene";
import { saveRoleGrp, getRoleGrp, getById } from "@/api/data/role";
import { commonNotify } from "@/utils";
import {parseDateTimeFromString} from "@ag-grid-community/core/dist/es6/utils/date";
export default {
  components: { MyElTree },
  data() {
    return {
      roleUuid: this.$route.params.roleUuid,
      paramSceneCode: this.$route.params.sceneCode,
      allScene: [],
      // currentScene: {},
      currentSceneUuid: "",
      treeLoading: false,
      grpUuid: "",
      filterText: null,
      treeData: {},
      listLoading: false,
      props: {
        label: "name",
        isLeaf: "leaf",
      },
      userMap: {},
      tableData: [],
      selections: [],
      role: {},
      loadTree: [], //左边树懒加载的数据
      orgTreeData: [],
      orglistLoading: false,
      serviceLifeDialog:false,//选择使用期限
      startDatePicker: this.beginDate(),
      endDatePicker: this.processDate(),
      temp: {
        startTime: '',
        endTime: ''
      },
      row:{},//点击的单元格数据
      isNoClick:false,//非数据管理员方式不能操作
    };
  },
  computed: {
    currentTreeData() {
      return this.treeData["A" + this.grpUuid];
    },
    currentScene() {
      return this.allScene.filter((e) => {
        return e.sceneUuid === this.currentSceneUuid;
      })[0];
    },
    orgLoading() {
      if (this.currentScene && this.currentScene.groups.length) {
        return false;
      } else {
        return true;
      }
    },
  },
  watch: {
    filterText(val) {
      this.$refs["A" + this.grpUuid][0].filter(val);
    },
  },
  created() {
    // 获取树列表
    this.getOrgTree();
    getAllScene().then((resp) => {
      this.allScene = resp.data;
      if (this.allScene.length > 0)
        this.currentSceneUuid = this.allScene[0].sceneUuid;
      // //根据param设置默认scene
      // console.log("设置默认scene  "+this.paramSceneCode);
      if (this.paramSceneCode) {
        this.allScene.forEach((s) => {
          if (this.paramSceneCode === s.sceneCode) {
            this.currentSceneUuid = s.sceneUuid;
          }
        });
      }
    });
    getById(this.roleUuid).then((resp) => {
      this.role = resp.data;
      if(this.role.authenType === '004001002'){
        this.isNoClick = true
      }
    });
    getRoleGrp(this.roleUuid).then((resp) => {
      this.tableData = resp.data;
    });
    
  },
  mounted() {
    setTimeout(() => {
      if (this.currentScene && this.currentScene.groups) {
        document.getElementById("tab-" + this.currentScene.groups[0].sceneGrpUuid).click();
      }
      //默认设置第一个选中
      this.grpUuid = this.currentScene.groups[0].sceneGrpUuid
    }, 1000);
  },
  methods: {
    tableRowClassName({row, rowIndex}){
      row.tableId = rowIndex+1;
    },
    sureServiceLife(){
      var tableId = this.row.tableId
      //起止时间必填
      if(this.temp.startTime === null || this.temp.startTime === undefined || this.temp.startTime === ""){
        return this.$message({ type: "error", message: "请填写开始时间" });
      }
      if(this.temp.endTime === null || this.temp.endTime === undefined || this.temp.endTime === ""){
        return this.$message({ type: "error", message: "请填写结束时间" });
      }
      if (parseDateTimeFromString(this.temp.endTime) < new Date()){
        return this.$message({ type: "error", message: "结束时间不可以早于当前时间" });
      }
      this.tableData[tableId-1].startTime = this.temp.startTime
      this.tableData[tableId-1].endTime = this.temp.endTime
      this.serviceLifeDialog = false
    },
    beginDate () {
      const self = this
      return {
        disabledDate (time) {
          if (self.temp.endTime) { // 如果结束时间不为空，则小于结束时间
            return new Date(self.temp.endTime).getTime() < time.getTime()
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        }
      }
    },
    processDate () {
      const self = this
      return {
        disabledDate (time) {
          if (self.temp.startTime) { // 如果开始时间不为空，则结束时间大于开始时间
            return new Date(self.temp.startTime).getTime() > time.getTime()
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        }
      }
    },
    //选择使用期限
    clickSelectTime(row){
      this.row = {}//每次置空重新赋值
      this.row = row
      this.serviceLifeDialog = true
      this.temp.startTime = row.startTime
      this.temp.endTime = row.endTime
    },
    // 获取机构或人员列表
    getOrgTree() {
      this.treeLoading = true;
      queryOrgTree("").then((res) => {
        this.orgTreeData = res.data;
        this.treeLoading = false;
      });
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve(this.orgTreeData);
      }
      if (node.data.children && node.data.children != "") {
        return resolve(node.data.children);
      } else {
        setTimeout(() => {
          resolve(this.loadTree);
        }, 500);
      }
    },
    handleNodeClick(data, obj, node) {
      this.getLoadTree(data, obj, node);
    },
    //展开树形结构进行懒加载的方法 data该节点所对应的对象、obj节点对应的 Node、node节点组件本身
    getLoadTree(datas, obj, node) {
      this.orglistLoading = true;
      queryOrgTree(datas.id).then((res) => {
        this.loadTree = res.data;
        this.orglistLoading = false;
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    addGrp() {
      var nodes = this.$refs["A" + this.grpUuid][0].getCheckedNodes();
      if (nodes.length === 0) {
        nodes.push(this.$refs["A" + this.grpUuid][0].getCurrentNode());
      }
      nodes.forEach((node) => {
        if (
          this.tableData.filter((data) => {
            return data.unitUuid === node.id;
          }).length === 0 &&
                this.tableData.filter((data) => {
                  return data.grpInstUuid === node.id;
                }).length === 0
        ) {
          this.tableData.push({
            dataRoleUuid: this.roleUuid,
            sceneGrpUuid: this.grpUuid,
            userName: node.name,
            userType: node.type,
            grpInstUuid: node.type == 1 ? node.id : "null",
            unitUuid: node.type == 2 ? node.id : "null",
            valid: 1,
            startTime: null,
            endTime: null,
          });
        }
      });
    },

    saveRoleGrp() {
      this.listLoading = true;
      saveRoleGrp(this.roleUuid, this.tableData).then((resp) => {
        this.listLoading = false;
        this.$notify(commonNotify({ type: "success", message: "保存成功！" }));
      });
    },

    removeGrp() {
      var map = {};
      this.selections.forEach((sel) => {
        map[sel.userType + sel.grpInstUuid + sel.unitUuid] = sel;
      });
      for (var index = 0; index < this.tableData.length; ) {
        var value = this.tableData[index];
        if (map[value.userType + value.grpInstUuid + value.unitUuid]) {
          this.tableData.splice(index, 1);
        } else {
          index++;
        }
      }
    },

    /* setUserMap(roleGrps){
      roleGrps.forEach(sel=>{
        this.userMap[sel.userType+sel.grpInstUuid+sel.unitUuid] = sel;
      });
      return map;
    },
    getByUserMap(grp){
      return this.userMap[grp.userType+grp.grpInstUuid+grp.unitUuid];
    },*/

    setExpireDate() {},

    tabClick(tab, event) {
      // if (!this.currentTreeData) {
      //   var grpUuid = tab.paneName
      //   this.treeLoading = true
      //   initSceneTree(grpUuid).then(resp => {
      //     this.treeLoading = false
      //     console.log(resp)
      //     resp.data.map(i => {
      //       i.children = []
      //     })
      //     this.$set(this.treeData, 'A' + this.grpUuid, resp.data)
      //   })
      // }
    },

    handleSelectionChange(val) {
      this.selections = val;
    },

    goBack() {
      this.$router.go(-1);
    },
  }, // 注册
};
</script>

<style lang="scss" scoped>
.org-box {
  width: 100%;
  height: 70vh;
  padding:0 10px;
  box-sizing:border-box;
}
.orgTree-box {
  width: 100%;
  height: 100%;
  position: relative;
  .orglistLoadingDia {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 9999;
  }
}
.filter-tree {
  // margin-top: 20px;
}
.transfer-center-item {
  width: 40px;
  margin: 2px;
}
.page-container .left-tree {
  height: 70vh;
  overflow: scroll;
  padding-top: 10px;
}
.bottom-btn {
  float: right;
  padding-right: 100px;
}
.serviceLife{
  color: #409EFF;
  cursor:pointer;
}
</style>
