<template>
  <!--数据资源管理 业务系统管理 -->
  <div class="page-container"
       style="background-color: none !important;border: none;">
    <div class="left_conter pd20">
      <el-input v-model="filterText"
                placeholder="输入关键字进行树的过滤"
                class="tree-search" />
      <MyElTree ref="tree"
                :data="data"
                :props="defaultProps"
                :filter-node-method="filterNode"
                :expand-on-click-node="false"
                node-key="id"
                check-strictly
                @node-click="handleNodeClick">
        <span slot-scope="{ node, data }"
              class="custom-tree-node">
          <span> <i :class="data.icon" />{{ node.label }} </span>
          <el-button title="添加SQL草稿文件夹"
                     type="text"
                     size="mini"
                     class="tree-line-btn"
                     @click.stop="() => setSelectTreeNode(node, data, 1)">
            <svg-icon icon-class="icon-add-1" />
          </el-button>
          <el-button title="修改SQL草稿文件夹"
                     type="text"
                     size="mini"
                     class="tree-line-btn"
                     @click.stop="() => setSelectTreeNode(node, data, 2)"
                     v-if="data.pid != 'root'">
            <svg-icon icon-class="icon-edit-1" />
          </el-button>
          <el-button title="删除SQL草稿文件夹"
                     type="text"
                     size="mini"
                     class="tree-line-btn"
                     @click.stop="() => deleteFolder(node, data)"
                     v-if="data.pid != 'root'">
            <svg-icon icon-class="icon-delete-1" />
          </el-button>
        </span>
      </MyElTree>
      <!--   新增修改树   -->
      <el-dialog append-to-body
                 v-if="dialogFormVisible"
                 title="请填写文件夹信息"
                 :visible.sync="dialogFormVisible"
                 :close-on-click-modal="false">
        <el-form :model="formtree"
                 class="detail-form">
          <el-form-item label="文件夹名称">
            <el-input v-model="formtree.folderName"
                      autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="enterBtn">确 定</el-button>
        </div>
      </el-dialog>
      <!--   新增修改树 end   -->
    </div>

    <!--右侧数据列表-->
    <div class="right_conter">
      <div class="pd20">
        <div class="query-field">
          <SearchCommon ref="tags"
                        @search="search"
                        @clearSearch="clearAll"
                        :dropDown="dropDown"
                        @change="onChange"></SearchCommon>
<!--          <el-form :inline="true"-->
<!--                   :model="query"-->
<!--                   label-position="bottom">-->
<!--            <el-form-item label="校验名称：">-->
<!--              <el-input v-model="query.checkName"-->
<!--                        clearable />-->
<!--            </el-form-item>-->

<!--            <el-form-item label="校验SQL：">-->
<!--              <el-input v-model="query.serviceDescription"-->
<!--                        clearable />-->
<!--            </el-form-item>-->

<!--            <el-form-item label="规则类型：">-->
<!--              <el-select v-model="query.ruleType"-->
<!--                         clearable-->
<!--                         @change="selectdata_type"-->
<!--                         placeholder="请选择规则类型">-->
<!--                <el-option v-for="item in options_type_list"-->
<!--                           :key="item.value"-->
<!--                           :label="item.label"-->
<!--                           :value="item.value" />-->
<!--              </el-select>-->
<!--            </el-form-item>-->

<!--            <el-form-item>-->
<!--              <el-button type="primary"-->
<!--                         @keyup.enter.native="search"-->
<!--                         @click="search()">查询</el-button>-->
<!--              <el-button type="primary"-->
<!--                         @click="clearAll()">清空</el-button>-->
<!--            </el-form-item>-->
<!--          </el-form>-->
        </div>
        <div class="mb10">
          <el-row>
            <el-col align="right">
              <el-button type="primary"
                         class="oper-btn "
                         @click="add()"> <img src="../../../styles/image/add.png"
                     class="btn_icon icon1"
                     alt="">
                <img src="../../../styles/image/add2.png"
                     class="btn_icon icon2"
                     alt="">新增
              </el-button>
            </el-col>
          </el-row>
        </div>

        <el-table v-loading="listLoading"
                  :data="page_list"
                  border
                  fit
                  highlight-current-row
                  style="width: 100%; overflow: auto"
                  height="calc(100vh - 280px)"
                  @selection-change="handleSelectionChange">
          <!-- <el-table-column type="selection"
                         width="55" /> -->
          <el-table-column label="校验名称"
                           prop="checkName"
                           show-overflow-tooltip
                           min-width="150px">
            <template slot-scope="scope">

              <el-link type="text"
                       :underline="false"
                       prop="displayTbName"
                       @click="details(scope.row.oamUuid)">{{ scope.row.checkName }}</el-link>

            </template>
          </el-table-column>
          <el-table-column label="业务描述"
                           prop="serviceDescription"
                           show-overflow-tooltip
                           min-width="150px" />
          <el-table-column label="校验SQL"
                           prop="implementationLogic"
                           show-overflow-tooltip
                           min-width="150px" />
          <el-table-column label="规则类型"
                           align="center"
                           prop="ruleType"
                           width="100">
            <template slot-scope="scope">
              {{
                scope.row.ruleType == 1
                  ? "一致性"
                  : scope.row.ruleType == 2
                  ? "完整性"
                  : scope.row.ruleType == 3
                  ? "规范性"
                  : "空"
              }}
            </template>
          </el-table-column>

          <el-table-column label="操作"
                           align="center"
                           width="200">
            <template slot-scope="scope">

              <el-link type="text"
                       :underline="false"
                       @click="edit_table(scope.row.oamUuid)">编辑</el-link>

              <el-link type="text"
                       :underline="false"
                       @click="delete_table(scope.row.oamUuid)">删除</el-link>
              <!-- 
              <el-button type="primary"
                         class="oper-btn"
                         title="修改"
                         size="mini"
                         @click="edit_table(scope.row.oamUuid)"><img src="../../../styles/image/edits.png"
                     class="btn_icon"
                     alt="">编辑</el-button> -->
              <!-- <el-button type="primary"
                         class="oper-btn"
                         title="删除"
                         size="mini"
                         @click="delete_table(scope.row.oamUuid)"><img src="../../../styles/image/delete.png"
                     class="btn_icon"
                     alt="">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-show="total > 0"
                       :total="total"
                       @current-change="handleCurrentChange"
                       @size-change="handleSizeChange"
                       layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>

      <!-- 新增编辑 -->
      <el-dialog :title="title"
                 class="data_res"
                 :visible.sync="dialogVisible"
                 @close="handleClose('form')"
                 width="40%">
        <el-form
            :label-position="labelPosition"
            :rules="rules"
                 ref="form"
                 label-width="130px"
                 :model="form"
                 :inline="false">
          <el-form-item label="校验名称:"
                        prop="checkName">
            <el-col :span="24">
              <el-input type="text"
                        v-model="form.checkName"
                        style="width: 100%"
                        :disabled="title == '查看校验规则'"
                        :rows="4">
              </el-input>
            </el-col>

          </el-form-item>
          <el-form-item label="业务描述222:"
                        prop="serviceDescription">
            <el-col :span="24">

              <el-input style="width: 100%"
                        type="textarea"
                        :disabled="title == '查看校验规则'"
                        v-model="form.serviceDescription"></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="校验SQL:"
                        prop="implementationLogic">
            <el-col :span="24">

              <el-input type="textarea"
                        style="width: 100%"
                        :rows="4"
                        :disabled="title == '查看校验规则'"
                        v-model="form.implementationLogic">
              </el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="规则类型:"
                        prop="ruleType">
            <!--          <el-input type="textarea"-->
            <!--                    style="width: 80%;"-->
            <!--                    :rows="4"-->
            <!--                    :disabled="title == '查看校验规则'"-->
            <!--                    v-model="form.ruleType">-->
            <!--          </el-input>-->
            <el-col :span="24">

              <el-select v-model="form.ruleType"
                         style="width: 100%"
                         :rows="4"
                         clearable
                         placeholder="请选择规则类型">
                <el-option v-for="item in options_type_list"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value" />
              </el-select>
            </el-col>
          </el-form-item>
        </el-form>

        <span slot="footer"
              class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     :disabled="isDisable"
                     v-if="title !== '查看校验规则'"
                     @click="save('form')">保存</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  addData,
  getById,
  deleteData,
  page_list_data,
  updateData,
  getDraftTree,
} from "@/api/analysis/dataOamResource.js";
import {
  addDraftFolder,
  getDraftFolderById,
  removeDraftFolder,
  updateDraftFolder,
} from "@/api/analysis/treeOamResoure";
import MyElTree from "@/components/public/tree/src/tree.vue";
export default {
  /*树*/
  // name: 'SqlDraftTree',
  components: { MyElTree },
  // props: ["isShowDraft", "openType"],
  /*树end*/
  data () {
    return {
    dropDown:[
        {
          code: 'checkName',
          name: '校验名称',
          value: []
        },
        {
          code: 'serviceDescription',
          name: '校验SQL',
          value: []
        },
        {
          code: 'ruleType',
          name: '规则类型',
          value: []
        }
      ],
      labelPosition:"top",
      query: {
        checkName: "", // 规则名称
        serviceDescription: "", // 业务描述
        ruleType: "",
        parentUuid: "", //父节点id
        // pageNo: 1,
        // pageSize: 10,
      },
      total:0,
      pageQuery: {
        condition: null,
        pageNo: 1,
        pageSize: 10,
      },
      listLoading: false,
      page_list: [], //列表
      Selectval: [], //多选的值
      // 新增的数据
      form: {
        checkName: "",
        serviceDescription: "",
        ruleType: "",
        implementationLogic: "",
        parentUuid: "",
      },
      dialogVisible: false, //新增弹窗
      isDisable: false, //防止重复提交
      title: "", //弹窗标题

      options_type_list: [
        {
          value: 1,
          label: "一致性",
        },
        {
          value: 2,
          label: "完整性",
        },
        {
          value: 3,
          label: "规范性",
        },
      ],
      rules: {
        checkName: [
          { required: true, message: "请输入校验名称", trigger: "blur" },
        ],
        serviceDescription: [
          { required: true, message: "请输入业务描述", trigger: "blue" },
        ],
        implementationLogic: [
          { required: true, message: "请输入校验SQL", trigger: "blue" },
        ],
        ruleType: [
          { required: true, message: "请输入规则类型", trigger: "blue" },
        ],
      },

      // listLoading: false,
      /*树*/
      defaultProps: {
        children: "children",
        label: "label",
      },
      selectTreeNode: {},
      filterText: "",
      data: [],
      // 是否为管理员身份
      // isManager: false,
      dataUserId: "",
      // 操作类型 1、添加；2、修改
      operationType: 0,
      // 弹窗状态
      dialogFormVisible: false,
      formtree: {
        oamTreeUuid: "",
        folderName: "",
        parentUuid: "",
        sceneInstUuid: "",
        path: "",
      },
    };
  },
  /*树*/
  computed: {},
  created () {
    this.dataUserId = this.$store.getters.datauserid;
    // 校验用户权限
    // isAdmin().then((res) => {
    //   // 是管理员
    //   if (res.data) {
    //     this.isManager = true
    //   } else {
    //     // 不是管理员
    //     this.isManager = false
    //   }
    // })
    this.getTree();
    this.getList();
  },
  watch: {
    filterText (val) {
      // 搜索树
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    // 清空
    clearAll () {
      this.query.checkName = "";
      this.query.serviceDescription = "";
      this.query.implementationLogic = "";
      this.query.ruleType = "";
    },

    search (queryData) {
      queryData = this.$refs.tags.serachParams;
      // this.listLoading = true;
      if (queryData) this.query = queryData;
      this.getList();

      // page_list_data(this.pageQuery).then((res) => {
      //   this.page_list = res.data.records;
      //   this.listLoading = false;
      //   this.total = res.data.total;
      // });


      // this.listLoading = true;
      // let params = {
      //   condition: {
      //     checkName: "", //校验名称
      //     serviceDescription: "", //校验SQL
      //     ruleType: "", //规则类型
      //   },
      //   // pageNo: this.query.pageNo,
      //   // pageSize: this.query.pageSize,
      // };
      // page_list_data(params).then((res) => {
      //   this.page_list.records = res.data;
      //   this.listLoading = false;
      // });
      // console.log(queryData,"sadadasdasdasd")
      // this.query.pageNo = 1;
      // this.getList(); //刷新列表
      // condition: {
      //   checkName: this.query.checkName, //校验名称
      //           serviceDescription: this.query.serviceDescription, //校验SQL
      //           ruleType: this.query.ruleType, //规则类型
      //           parentUuid: this.query.parentUuid, //父节点id
      // },
      // //
      // // var checkNameList = []
      // // var serviceDescriptionList = []
      // // var ruleTypeList = []
      // // debugger;
      // // queryData.forEach((searchParams,index)=>{
      // //   if(searchParams.code == 'checkName'){
      // //     checkNameList.push(searchParams.value)
      // //   }
      // //   if(searchParams.code == 'serviceDescription'){
      // //     serviceDescriptionList.push(searchParams.value)
      // //   }
      // //   if(searchParams.code == 'ruleType'){
      // //     ruleTypeList.push(searchParams.value)
      // //   }
      // // })
      // // console.log(checkNameList)
      // // console.log(serviceDescriptionList)
      // // console.log(ruleTypeList)
      // // let params = {
      // //   condition: {
      // //     checkName: checkNameList.length >= 2 ? checkNameList.join(',') : checkNameList[0], //校验名称
      // //     serviceDescription: serviceDescriptionList.length >= 2 ? serviceDescriptionList.join(',') :serviceDescriptionList[0] , //校验SQL
      // //     ruleType: ruleTypeList.length >=2 ? ruleTypeList.join(',') : ruleTypeList[0], //规则类型
      // //   },
      // //   pageNo: this.query.pageNo,
      // //   pageSize: this.query.pageSize,
      // // };
      // this.listLoading = true;
      // page_list_data(params).then((res) => {
      //   this.page_list = res.data;
      //   this.listLoading = false;
      // });

    },

    // 刷新列表
    getList () {
      this.listLoading = true;
      let params = {
        condition: {
          checkName: this.query.checkName, //校验名称
          serviceDescription: this.query.serviceDescription, //校验SQL
          ruleType: this.query.ruleType, //规则类型
          parentUuid: this.query.parentUuid, //父节点id
        },
        pageNo: this.pageQuery.pageNo,
        pageSize: this.pageQuery.pageSize,
      };
      page_list_data(params).then((res) => {
        this.page_list = res.data.records;
        this.total = res.data.total;
        this.listLoading = false;
      });
    },
    // 多选
    handleSelectionChange (val) {
      this.Selectval = val;
    },
    // 分页
    handleCurrentChange (val) {
      this.pageQuery.pageNo = val;
      this.getList();
    },
    // 每页多少条
    handleSizeChange (val) {
      this.pageQuery.pageSize = val;
      this.getList();
    },
    // 详情
    details (oamUuid) {
      this.title = "查看校验规则";
      this.form.oamUuid = oamUuid;
      this.dialogVisible = true;
      this.details_details();
    },
    // 新建
    add () {
      // eslint-disable-next-line no-debugger
      if (
        this.form.parentUuid == null ||
        this.form.parentUuid == undefined ||
        this.form.parentUuid == ""
      ) {
        this.$message({ type: "info", message: "请先选择树节点再进行新增" });
        return;
      }

      if (this.form.parentUuid == 0) {
        this.$message({
          type: "info",
          message: "请先选择树的第三级子节点进行新增",
        });
        return;
      }

      if (
        this.form.path.split("/")[2] == null ||
        this.form.path.split("/")[2] == undefined ||
        this.form.path.split("/")[2] == ""
      ) {
        this.$message({
          type: "info",
          message: "请先选择树的第三级子节点进行新增",
        });
        return;
      }
      console.log("path第3级节点的id：" + this.form.parentUuid);

      this.dialogVisible = true;
      this.title = "新建校验规则";
      // 清除校验
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs["form"].clearValidate();
        });
      }
    },
    // 编辑
    edit_table (oamUuid) {
      this.title = "编辑校验规则";
      console.log(oamUuid);
      this.form.oamUuid = oamUuid;
      this.dialogVisible = true;
      this.isDisable = false;
      this.details_details();
    },

    // 详情 接口
    details_details () {
      let params = {
        oamUuid: this.form.oamUuid,
      };
      getById(params).then((res) => {
        if (res.data.ruleType == 1) {
          res.data.ruleType = "一致性";
        } else if (res.data.ruleType == 2) {
          res.data.ruleType = "完整性";
        } else if (res.data.ruleType == 3) {
          res.data.ruleType = "规范性";
        } else {
          res.data.ruleType = "空";
        }
        this.form = res.data;
      });
    },

    // 新建保存 && 编辑保存
    save (form) {
      this.isDisable = true;
      setTimeout(() => {
        this.isDisable = false;
      }, 2000);

      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.title == "新建校验规则") {
            let params = {
              checkName: this.form.checkName,
              serviceDescription: this.form.serviceDescription,
              implementationLogic: this.form.implementationLogic,
              ruleType: this.form.ruleType,
              parentUuid: this.form.parentUuid,
            };
            console.log("卡卡" + params.parentUuid);
            console.log(params);
            addData(params).then((res) => {
              if (res.code == 0) {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  showClose: true,
                });
                this.dialogVisible = false;
                this.getList();
              } else {
                this.$message({
                  message: res.msg,
                  type: "error",
                  showClose: true,
                });
              }
            });
          } else {
            let params = {
              oamUuid: this.form.oamUuid,
              checkName: this.form.checkName,
              serviceDescription: this.form.serviceDescription,
              implementationLogic: this.form.implementationLogic,
              ruleType: this.form.ruleType,
              parentUuid: this.form.parentUuid,
            };
            updateData(params).then((res) => {
              if (res.code == 0) {
                this.$message({
                  message: "编辑成功",
                  type: "success",
                  showClose: true,
                });
                this.dialogVisible = false;
                this.getList();
              } else {
                this.$message({
                  message: res.msg,
                  type: "error",
                  showClose: true,
                });
              }
            });
          }
        } else {
          this.$message({
            message: "请填写信息",
            type: "info",
            showClose: true,
          });
          return false;
        }
      });
    },
    // closeDialog(){
    //   this.addDialogVisible=false;
    // },
    // 关闭弹窗
    handleClose (form) {
      this.$refs[form].resetFields(); //清空添加的值
    },

    // 请选择规则类型
    // eslint-disable-next-line no-unused-vars
    selectdata_type (val) { },
    // 删除
    delete_table (oamUuid) {
      this.$confirm("是否确定将选中的内容?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            oamUuid: oamUuid,
          };
          deleteData(params).then((res) => {
            if (res.code == 0) {
              this.$message({
                message: "删除成功",
                type: "success",
                showClose: true,
              });
              this.getList();
            } else {
              this.$message({
                message: res.msg,
                type: "error",
                showClose: true,
              });
            }
          });
        })
        .catch(() => {
          this.$notify.warning("取消删除");
        });
    },
    /*树 开始*/

    deleteFolder (node, data) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        removeDraftFolder(data.id).then((res) => {
          if (res != null && res.code === 0) {
            this.$message({ type: "info", message: "删除文件夹成功！" });
            this.refreshTree();
          } else {
            this.$message({ type: "error", message: res.msg });
          }
        });
      });
    },
    /**
     * 生成UUID
     * @returns {string} 返回生成的UUID
     */
    getGuuid () {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";
      var uuid = s.join("");
      return uuid;
    },
    /**
     * 修改文件夹
     */
    updateFolder () {
      var pNode = this.selectTreeNode;
      // 再次校验非管理员不能操作公共文件夹
      // if(!this.isManager && pNode.sceneInstUuid == null){
      //   this.$message({type:"info",message:"非管理员不能操作公共文件夹!"});
      //   return;
      // }
      getDraftFolderById(pNode.id).then((res) => {
        var draftFolder = res.data;
        draftFolder.folderName = this.formtree.folderName;
        updateDraftFolder(draftFolder).then((resp) => {
          if (resp != null && resp.code === 0) {
            this.formtree.folderName = null;
            this.$message({ type: "info", message: "修改文件夹成功！" });
            this.dialogFormVisible = false;
            this.refreshTree();
            this.getList();
          } else {
            this.$message({ type: "error", message: resp.msg });
          }
        });
      });
    },
    /**
     * 添加文件夹
     */
    addFolder () {
      var pNode = this.selectTreeNode;
      // 再次校验非管理员不能操作公共文件夹
      // if(!this.isManager && pNode.sceneInstUuid == null){
      //   this.$message({type:"info",message:"非管理员不能操作公共文件夹!"});
      //   return;
      // }
      console.log(pNode);
      console.log("uuid:" + this.getGuuid());
      this.formtree.oamTreeUuid = this.getGuuid();
      this.formtree.parentUuid = pNode.id;
      var rootAamPath = pNode.path;
      console.log("树节点" + rootAamPath);
      if (rootAamPath != null || rootAamPath != undefined) {
        rootAamPath = rootAamPath.split("/")[0];
      }
      this.formtree.sceneInstUuid = rootAamPath == "0" ? null : this.dataUserId;
      console.log("id节点" + this.formtree.oamTreeUuid);
      this.formtree.path = pNode.path + "/" + this.formtree.oamTreeUuid;

      addDraftFolder(this.formtree).then((result) => {
        if (result != null && result.code === 0) {
          const newChild = {
            id: this.formtree.oamTreeUuid,
            label: this.formtree.folderName,
            children: [],
            pid: this.selectTreeNode.id,
            icon: "el-icon-folder",
            type: "folder",
            path: this.formtree.path,
          };
          if (!this.selectTreeNode.children) {
            this.$set(this.selectTreeNode, "children", []);
          }
          this.selectTreeNode.children.push(newChild);
          this.formtree.folderName = null;
          this.$message({ type: "info", message: "新增SQL草稿文件夹成功！" });
          this.dialogFormVisible = false;
        } else {
          this.$message({ type: "error", message: result.msg });
        }
      });
    },
    /**
     * 表单确定按钮
     */
    enterBtn () {
      if (this.operationType === 1) {
        this.addFolder();
      } else {
        this.updateFolder();
      }
    },
    /**
     * 树过滤
     * @param value 过滤值
     * @param data 数据
     * @returns {boolean}
     */
    filterNode (value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    /**
     * 树的点击事件
     * @param data 树的对象数据 包括子节点
     */
    handleNodeClick (data) {
      this.selectTreeNode = data;
      /*点击树的时候把父节点id 赋给 查询和新增*/
      this.query.parentUuid = data.id; /*查询*/
      this.form.parentUuid = data.id; /*新增*/
      this.form.path = data.path; /*新增*/
      console.log("当前树节点的id:" + data.id);
      console.log("当前树节点的path:" + this.form.path);
      this.getList();
    },
    /**
     *获取草稿树(true：文件夹+草稿，false：文件夹)
     */
    getTree () {
      getDraftTree().then((res) => {
        console.log(res.data, "res.data");
        this.data = res.data;
      });
    },
    /**
     * 设置选中的节点
     * @param node 整个节点数据
     * @param data 数据 要设置的节点数据
     * @param operationType 1、添加；2、修改
     */
    setSelectTreeNode (node, data, operationType) {
      this.formtree.folderName = "";
      this.operationType = operationType;
      this.selectTreeNode = data;
      if (operationType === 2) {
        this.formtree.folderName = this.selectTreeNode.label;
      }
      this.dialogFormVisible = true;
    },
    refreshTree () {
      this.getTree();
    },
    /*树 结束*/
  },
};
</script>

<style scoped>
.data_res >>> .el-form-item {
  /* margin-top: 25px !important; */
  /*display: flex;*/
}
.data_res >>> .el-form-item--medium .el-form-item__label {
  text-align: right;
  /*float: left !important;*/
}
.data_res >>> .el-form-item__content {
  flex: 1;
  margin-left: 0 !important;
  /*float: left;*/
}
.data_res >>> .el-textarea .el-textarea__inner {
  resize: none;
}
.page-container {
  display: flex;
  background: transparent !important;
}

</style>
