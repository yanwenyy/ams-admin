<template>
  <div class="page-container" style="overflow: auto">
    <template class="detail-form">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        style="width: 700px"
      >
        <span class="midText">业务场景维护：</span>
        <el-form-item label="业务场景名称" prop="sceneName" label-width="150px">
          <el-input v-model="temp.sceneName" class="input" />
        </el-form-item>
        <el-form-item label="业务属性编码" prop="sceneCode" label-width="150px">
          <el-input v-model="temp.sceneCode" class="input" />
        </el-form-item>
      </el-form>
      <template style="height: 160px">
        <span class="midText">用户组定义：</span>
        <el-row>
          <el-col align="right">
            <el-button
              type="primary"
              size="mini"
              class="oper-btn add"
              @click="handleCreate()"
            />
          </el-col>
        </el-row>
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="list"
          border
          highlight-current-row
          style="width: 100%"
          @sort-change="sortChange"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="index"
            label="序号"
            width="50px"
            align="center"
          />
          <el-table-column label="组名称" prop="grpName" width="200px" />
          <el-table-column label="组代码" prop="grpCode" width="200px" />
          <el-table-column
            label="组用户来源SQL"
            width="500px"
            align="center"
            prop="grpSql"
          >
            <template
              v-if="scope.row.grpSql != null && scope.row.grpSql.length > 0"
              slot-scope="scope"
            >
              <el-popover trigger="hover" placement="top" width="500">
                <el-row>
                  <el-col :span="24">
                    {{ scope.row.grpSql }}
                  </el-col>
                </el-row>
                <div slot="reference" class="name-wrapper">
                  <!-- <el-tag><i class="el-icon-tickets" /></el-tag> -->
                  <el-link :underline="false" type="primary"
                    >查看组用户来源SQL</el-link
                  >
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="100">
            <template slot-scope="scope">
              <el-button
                type="primary"
                class="oper-btn preview"
                size="mini"
                @click="selectFilterOne(scope.row.sceneGrpUuid)"
              />
              <el-button
                type="primary"
                class="oper-btn edit"
                size="mini"
                @click="updateGrp(scope.row.sceneGrpUuid)"
              />
              <el-button
                type="primary"
                class="oper-btn delete"
                size="mini"
                @click="deleteGrp(scope.row.sceneGrpUuid)"
              />
            </template>
          </el-table-column>
        </el-table>
        <!-- <pagination v-show="total>0" :total="total" :page.sync="pageQuery.pageNo" :limit.sync="pageQuery.pageSize" @pagination="getList" /> -->
        <el-dialog
          :title="textMap[dialogStatus]"
          :visible.sync="dialogFormVisible"
          :close-on-click-modal="false"
        >
          <template class="detail-form">
            <el-form
              ref="dataFormGrp"
              :rules="rulesGrp"
              :model="tempGrp"
              label-position="right"
              style="width: 100%"
            >
              <el-form-item label="组名称" prop="grpName">
                <el-input v-model="tempGrp.grpName" />
              </el-form-item>
              <el-form-item label="组代码" prop="grpCode">
                <el-input v-model="tempGrp.grpCode" />
              </el-form-item>
              <el-form-item
                label="组用户来源SQL(所写SQL中必须有id,name,pid 三列才可预览查看)"
                prop="grpSql"
              >
                <el-input v-model="tempGrp.grpSql" :rows="6" type="textarea" />
              </el-form-item>
            </el-form>
          </template>
          <div slot="footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button
              type="primary"
              @click="dialogStatus === 'create' ? createData() : updateData()"
              >保存</el-button
            >
          </div>
        </el-dialog>
      </template>
      <el-row>
        <el-col style="height: 260px; margin-top: 150px">
          <span class="midText">维护业务场景下数据筛选器：</span>
          <el-row>
            <el-col align="right">
              <el-button
                type="primary"
                size="mini"
                class="oper-btn add"
                @click="handleCreateFilter()"
              />
            </el-col>
          </el-row>
          <el-table
            :key="tableKeyFilter"
            v-loading="listLoadingFilter"
            :data="listFilter"
            border
            highlight-current-row
            style="width: 100%; max-height: 150px; overflow: auto"
            @sort-change="sortChangeFilter"
            @selection-change="handleSelectionChangeFilter"
          >
            <el-table-column
              type="index"
              label="序号"
              width="50px"
              align="center"
            />
            <el-table-column
              label="筛选器名称"
              prop="filterName"
              width="200px"
            />
            <el-table-column label="描述" width="200px" prop="describtion">
              <template
                v-if="
                  scope.row.describtion != null &&
                  scope.row.describtion.length > 0
                "
                slot-scope="scope"
              >
                <el-popover trigger="hover" placement="top" width="500">
                  <el-row>
                    <el-col :span="24">
                      {{ scope.row.describtion }}
                    </el-col>
                  </el-row>
                  <div slot="reference" class="name-wrapper">
                    <!-- <el-tag><i class="el-icon-tickets" /></el-tag> -->
                    <el-link :underline="false" type="primary"
                      >查看描述</el-link
                    >
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              label="IN值SQL"
              width="500px"
              align="center"
              prop="inValueSql"
            >
              <template
                v-if="
                  scope.row.inValueSql != null &&
                  scope.row.inValueSql.length > 0
                "
                slot-scope="scope"
              >
                <el-popover trigger="hover" placement="top" width="500">
                  <el-row>
                    <el-col :span="24">
                      {{ scope.row.inValueSql }}
                    </el-col>
                  </el-row>
                  <div slot="reference" class="name-wrapper">
                    <!-- <el-tag><i class="el-icon-tickets" /></el-tag> -->
                    <el-link :underline="false" type="primary"
                      >查看IN值SQL</el-link
                    >
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="100">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  class="oper-btn preview"
                  size="mini"
                  @click="selectFilterOne(scope.row.inValueSql)"
                />
                <el-button
                  type="primary"
                  class="oper-btn edit"
                  size="mini"
                  @click="updateFilter(scope.row.sceneFilterUuid)"
                />
                <el-button
                  type="primary"
                  class="oper-btn delete"
                  size="mini"
                  @click="deleteFilter(scope.row.sceneFilterUuid)"
                />
              </template>
            </el-table-column>
          </el-table>
          <!-- <pagination v-show="totalFilter>0" :total="totalFilter" :page.sync="pageQueryFilter.pageNo" :limit.sync="pageQueryFilter.pageSize" @pagination="getListFilter" /> -->

          <el-dialog
            :title="textMapFilter[dialogStatusFilter]"
            :visible.sync="dialogFormVisibleFilter"
            :close-on-click-modal="false"
          >
            <div class="detail-form">
              <el-form
                ref="dataFormFilter"
                :rules="rulesFilter"
                :model="tempFilter"
                label-position="right"
              >
                <el-form-item label="筛选器名称" prop="filterName">
                  <el-input v-model="tempFilter.filterName" />
                </el-form-item>
                <el-form-item label="IN值SQL" prop="inValueSql">
                  <el-input
                    v-model="tempFilter.inValueSql"
                    type="textarea"
                    :rows="5"
                  />
                </el-form-item>
                <el-form-item label="描述" prop="describtion">
                  <el-input
                    v-model="tempFilter.describtion"
                    type="textarea"
                    :rows="4"
                  />
                </el-form-item>
                <el-form-item label="关联业务属性" prop="bizAttrUuid">
                  <el-select
                    ref="bizAttrUuid"
                    v-model="tempFilter.bizAttrUuid"
                    placeholder="请选择业务属性"
                  >
                    <el-option
                      v-for="item in bizJson"
                      :key="item.bizAttrUuid"
                      :label="item.attrName"
                      :value="item.bizAttrUuid"
                    />
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            <div slot="footer">
              <el-button @click="dialogFormVisibleFilter = false"
                >取消</el-button
              >
              <el-button
                type="primary"
                @click="
                  dialogStatusFilter === 'create'
                    ? createDataFilter()
                    : updateDataFilter()
                "
                >保存</el-button
              >
            </div>
          </el-dialog>

          <el-dialog
            title="预览"
            :visible.sync="dialogFormVisibleTree"
            :close-on-click-modal="false"
          >
            <MyElTree
              ref="tree1"
              v-loading="tree1Loading"
              :props="props"
              class="filter-tree"
              :highlight-current="true"
              :data="treeData1"
              node-key="id"
              :filter-node-method="filterNode"
              show-checkbox
            >
              <span slot-scope="{ node, data }" class="custom-tree-node">
                <!-- style="color:#409EFF" -->
                <i v-if="data.id === 'root'" class="el-icon-s-home" />
                <!-- class="el-icon-folder" style="color:#409EFF" / -->
                <i v-if="data.type === 'folder'">
                  <img
                    src="../../../assets/img/table_0.png"
                    style="
                      height: 16px;
                      width: 16px;
                      margin-right: 2px;
                      vertical-align: top;
                      *vertical-align: middle;
                    "
                  />
                </i>
                <!-- class="el-icon-tickets" style="color:#409EFF" / -->
                <i v-else-if="data.type === 'table'">
                  <img
                    src="../../../assets/img/table_1.png"
                    style="
                      height: 16px;
                      width: 16px;
                      margin-right: 2px;
                      vertical-align: top;
                      *vertical-align: middle;
                    "
                  />
                </i>
                <!-- style="color:#409EFF" -->
                <i
                  v-else-if="data.type === 'column'"
                  class="el-icon-c-scale-to-original"
                />
                <i v-else>
                  <img
                    src="../../../assets/img/table_2.png"
                    style="
                      height: 16px;
                      width: 16px;
                      margin-right: 2px;
                      vertical-align: top;
                      *vertical-align: middle;
                    "
                  />
                </i>
                <span :title="node.name">{{ node.label }}</span>
              </span>
            </MyElTree>
            <div slot="footer">
              <el-button type="primary" @click="dialogFormVisibleTree = false"
                >关闭</el-button
              >
            </div>
          </el-dialog>
        </el-col>
      </el-row>
    </template>
    <div slot="footer" style="float: right">
      <el-button @click="closeEdit">取消</el-button>
      <el-button type="primary" @click="saveScene">保存</el-button>
    </div>
  </div>
</template>

<script>
import MyElTree from "@/components/public/tree/src/tree.vue";
import { update, initSceneTree } from "@/api/data/scene";
import { listByPage } from "@/api/data/biz-attr";
import {
  listByPageGrp,
  saveGrp,
  updateGrp,
  delGrp,
  getById,
} from "@/api/data/sceneGrp";
import {
  listByPageFilter,
  saveFilter,
  updateFilter,
  delFilter,
  getByIdFilter,
} from "@/api/data/sceneFilter";
export default {
  components: { MyElTree },
  data() {
    return {
      treeData1: [],
      tableKey: "sceneUuid",
      tableKeyFilter: "sceneUuid",
      list: null,
      listFilter: null,
      props: {
        label: "label",
        isLeaf: "leaf",
      },
      total: 0,
      totalFilter: 0,
      listLoading: false,
      listLoadingFilter: false,
      tree1Loading: false,
      bizJson: [],
      pageQuery: {
        condition: null,
        pageNo: 1,
        pageSize: 20,
        sortBy: "asc",
        sortName: "create_time",
      },
      pageQueryFilter: {
        condition: null,
        pageNo: 1,
        pageSize: 20,
        sortBy: "asc",
        sortName: "create_time",
      },
      temp: {
        sceneUuid: undefined,
        sceneName: "",
        sceneCode: "",
        describtion: "",
      },
      tempGrp: {
        sceneGrpUuid: undefined,
        grpName: "",
        grpCode: "",
        grpSql: "",
      },
      tempFilter: {
        sceneGrpUuid: undefined,
        inValueSql: "",
        describtion: "",
        bizAttrUuid: "",
      },
      selections: [],
      selectionsFilter: [],
      dialogFormVisible: false,
      dialogFormVisibleFilter: false,
      dialogFormVisibleTree: false,
      dialogStatus: "",
      dialogStatusFilter: "",
      textMap: {
        update: "修改用户组定义",
        create: "新增用户组定义",
      },
      textMapFilter: {
        update: "修改数据筛选器",
        create: "新增数据筛选器",
      },
      rules: {
        sceneName: [
          { required: true, message: "请填写场景名称", trigger: "change" },
        ],
        sceneCode: [
          { required: true, message: "请填写场景编码", trigger: "change" },
        ],
      },
      rulesGrp: {
        grpName: [
          { required: true, message: "请填写组名称", trigger: "change" },
        ],
        grpCode: [
          { required: true, message: "请填写组编号", trigger: "change" },
        ],
        grpSql: [{ required: true, message: "请填写组SQL", trigger: "change" }],
      },
      rulesFilter: {
        filterName: [
          { required: true, message: "请填写筛选器名称", trigger: "change" },
        ],
        inValueSql: [
          { required: true, message: "请填写IN值SQL", trigger: "change" },
        ],
        describtion: [
          { required: true, message: "请填写描述", trigger: "change" },
        ],
        bizAttrUuid: [
          { required: true, message: "请选择业务属性", trigger: "change" },
        ],
      },
      downloadLoading: false,
    };
  },
  created() {
    this.allList();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 初始化页面所有列表
    allList() {
      this.temp.sceneUuid = this.$route.query.sceneUuid;
      this.temp.sceneName = this.$route.query.sceneName;
      this.temp.sceneCode = this.$route.query.sceneCode;
      this.getList();
      this.getListFilter();
    },
    selectFilterOne(sceneGrpUuid) {
      initSceneTree(sceneGrpUuid).then((resp) => {
        if (resp.data) {
          this.treeData1 = resp.data;
          this.dialogFormVisibleTree = true;
        }else{
          this.$message.error('sql编写错误或服务器异常');
        }
      });
    },
    // 初始化用户组定义
    getList() {
      this.listLoading = true;
      this.pageQuery.condition = this.temp;
      listByPageGrp(this.pageQuery).then((resp) => {
        this.total = resp.data.total;
        this.list = resp.data.records;
        this.listLoading = false;
      });
    },
    // 初始化数据筛选器
    getListFilter() {
      this.listLoadingFilter = true;
      this.pageQueryFilter.condition = this.temp;
      listByPageFilter(this.pageQueryFilter).then((resp) => {
        this.totalFilter = resp.data.total;
        this.listFilter = resp.data.records;
        this.listLoadingFilter = false;
      });
    },
    // 格式化创建时间显示列表
    formatCreateTime(row, column) {
      // 拼接日期规格为YYYY-MM-DD hh:mm:ss
      var createTime = new Date(row.createTime);
      var createTimeRow =
        createTime.getFullYear() +
        "-" +
        (createTime.getMonth() + 1) +
        "-" +
        createTime.getDate() +
        " " +
        createTime.getHours() +
        ":" +
        createTime.getMinutes() +
        ":" +
        createTime.getSeconds();
      return createTimeRow;
    },
    // 预览用户组
    selectGrpOne() {},
    // 删除用户组
    deleteGrp(id) {
      this.$confirm("确定删除场景?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      }).then(() => {
        delGrp(id).then(() => {
          this.getList();
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000,
            position: "bottom-right",
          });
        });
      });
    },
    // 删除关联数据筛选器
    deleteFilter(id) {
      this.$confirm("确定删除数据筛选器?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      }).then(() => {
        delFilter(id).then(() => {
          this.getListFilter();
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000,
            position: "bottom-right",
          });
        });
      });
    },
    handleFilter() {
      this.pageQuery.pageNo = 1;
      this.getList();
    },
    sortChange(data) {
      const { prop, order } = data;
      this.pageQuery.sortBy = order;
      this.pageQuery.sortName = prop;
      this.handleFilter();
    },
    sortChangeFilter(data) {
      const { prop, order } = data;
      this.pageQueryFilter.sortBy = order;
      this.pageQueryFilter.sortName = prop;
      this.handleFilter();
    },
    // 重置用户组对象
    resetTemp() {
      this.tempGrp = {
        sceneGrpUuid: undefined,
        grpName: "",
        grpCode: "",
        grpSql: "",
      };
    },
    // 重置数据筛选器对象
    resetTempFilter() {
      this.tempFilter = {
        sceneFilterUuid: undefined,
        bizAttrUuid: "",
        filterName: "",
        inValueSql: "",
        describtion: "",
      };
    },
    // 打开创建用户组窗口
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataFormGrp"].clearValidate();
      });
    },
    // 初始化创建数据筛选器窗口
    handleCreateFilter() {
      listByPage(this.pageQueryFilter).then((resp) => {
        this.bizJson = resp.data.records;
      });
      this.resetTempFilter();
      this.dialogStatusFilter = "create";
      this.dialogFormVisibleFilter = true;
      this.$nextTick(() => {
        this.$refs["dataFormFilter"].clearValidate();
      });
    },
    // 新增用户组
    createData() {
      this.tempGrp.sceneUuid = this.$route.query.sceneUuid;
      this.$refs["dataFormGrp"].validate((valid) => {
        if (valid) {
          saveGrp(this.tempGrp).then(() => {
            this.getList();
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000,
              position: "bottom-right",
            });
          });
        }
      });
    },
    // 新增关联数据筛选器
    createDataFilter() {
      this.tempFilter.sceneUuid = this.$route.query.sceneUuid;
      this.$refs["dataFormFilter"].validate((valid) => {
        if (valid) {
          saveFilter(this.tempFilter).then(() => {
            this.getListFilter();
            this.dialogFormVisibleFilter = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000,
              position: "bottom-right",
            });
          });
        }
      });
    },
    // 数据过滤器修改时回显
    updateGrp(id) {
      getById(id).then((res) => {
        this.tempGrp = Object.assign({}, res.data); // copy obj
      });
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataFormGrp"].clearValidate();
      });
    },
    // 数据过滤器修改时回显
    updateFilter(id) {
      getByIdFilter(id).then((res) => {
        this.tempFilter = Object.assign({}, res.data); // copy obj
      });
      listByPage(this.pageQueryFilter).then((resp) => {
        this.bizJson = resp.data.records;
      });
      this.dialogStatusFilter = "update";
      this.dialogFormVisibleFilter = true;
      this.$nextTick(() => {
        this.$refs["dataFormFilter"].clearValidate();
      });
    },
    // 修改用户组
    updateData() {
      this.$refs["dataFormGrp"].validate((valid) => {
        if (valid) {
          var tempData = Object.assign({}, this.tempGrp);
          updateGrp(tempData).then(() => {
            const index = this.list.findIndex(
              (v) => v.sceneGrpUuid === this.tempGrp.sceneGrpUuid
            );
            this.list.splice(index, 1, this.tempGrp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000,
              position: "bottom-right",
            });
          });
        }
      });
    },
    // 修改数据过滤器
    updateDataFilter() {
      this.$refs["dataFormFilter"].validate((valid) => {
        if (valid) {
          var tempData = Object.assign({}, this.tempFilter);
          console.log(tempData);
          updateFilter(tempData).then(() => {
            const index = this.listFilter.findIndex(
              (v) => v.sceneFilterUuid === this.tempFilter.sceneFilterUuid
            );
            this.listFilter.splice(index, 1, this.tempFilter);
            this.dialogFormVisibleFilter = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000,
              position: "bottom-right",
            });
          });
        }
      });
    },
    // 保存业务场景表单信息
    saveScene() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          var tempData = Object.assign({}, this.temp);
          update(tempData).then(() => {
            this.closeEdit();
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000,
              position: "bottom-right",
            });
          });
        }
      });
    },
    // 退出业务场景维护详情信息
    closeEdit() {
      this.$router.push({
        path: `/data/scene`,
      });
    },
    handleSelectionChange(val) {
      this.selections = val;
    },
    handleSelectionChangeFilter(val) {
      this.selectionsFilter = val;
    },
    getSortClass: function (key) {
      const sort = this.pageQuery.sort;
      return sort === `+${key}` ? "asc" : "desc";
    },
  },
};
</script>
<style scoped lang="scss" rel="stylesheet/scss">
.midText {
  color: #4bc0f0;
}
</style>

