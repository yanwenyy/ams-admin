<template>
  <div>
    <el-container style="min-height: 450px;overflow: auto; width: 100%">
      <div ref="basicInfo"
           style="width: 100%">
        <el-form ref="basicInfoForm"
                 :model="form"
                 :rules="rules"
                 class="detail-form"
                 :disabled="isBanEdit">
          <el-row>
            <el-col :span="24">
              <el-form-item label="名称"
                            prop="modelDetailName">
                <el-input v-model="form.modelDetailName"
                          @input="nameValueChange" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="描述">
                <el-input v-model="form.modelDetailMemo"
                          type="textarea" />
              </el-form-item>
            </el-col>
          </el-row>
          <p style="font-size:large;font-weight:bold">关联设置</p>
          <hr style="color:silver" />
          <el-row>
            <el-col :span="24">
              <el-form-item label="关联类型"
                            prop="relationType">
                <el-select ref="relTypeSelect"
                           style="width: 100%"
                           v-model="form.relationType"
                           placeholder="请选择关联类型"
                           @change="relTypeSelectChange">
                  <el-option label="关联模型"
                             :value="1" />
                  <el-option label="关联表"
                             :value="2" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div ref="relModelDivParent"
               style="display: none;">
            <el-row>
              <el-form-item label="被关联模型">
                <el-col :span="20">
                  <el-input :disabled="true"
                            v-model="form.relationObjectUuid"
                            style="display: none" />
                  <el-input :disabled="true"
                            v-model="form.relationObjectName" />
                </el-col>
                <el-button @click="selectModel"
                           type="primary">选择</el-button>
              </el-form-item>
            </el-row>
            <div ref="relModelTableDiv"
                 style="display: none;height:200px;overflow-y: scroll">
              <el-button type="primary"
                         size="mini"
                         @click="addRelFilter(1)">添加</el-button>
              <el-table ref="relModelTable"
                        :data="relModelTable"
                        stripe
                        border
                        fit
                        highlight-current-row
                        v-loading="relationTableLoading">
                <el-table-column label="原模型字段"
                                 align="center">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.resultColumn"
                               value="-1">
                      <el-option v-for="state in columns"
                                 :key="state.outputColumnName"
                                 :value="state.outputColumnName"
                                 :label="state.outputColumnName" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="关联模型参数"
                                 align="center">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.ammParamUuid"
                               value="-1">
                      <el-option v-for="state in relModelParam"
                                 :key="state.ammParamUuid"
                                 :value="state.ammParamUuid"
                                 :label="state.formatParamValue.name" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="操作"
                                 align="center">
                  <template slot-scope="scope">
                    <el-button type="primary"
                               size="mini"
                               @click.native.prevent="deleteRow(scope.$index, relModelTable)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div ref="relTableDivParent"
               style="display: none;height:200px;overflow-y: scroll">
            <el-row>
              <el-form-item label="被关联表"
                            prop="relationObjectUuidTable">
                <el-col :span="20">
                  <el-input v-model="form.relationObjectUuid"
                            style="display: none"
                            :disabled="true"></el-input>
                  <el-input v-model="form.relationObjectName"
                            :disabled="true"></el-input>
                </el-col>
                <el-button @click="showDataTree"
                           type="primary">选择</el-button>
              </el-form-item>
            </el-row>
            <div ref="relTableDiv"
                 style="display: none">
              <el-button type="primary"
                         size="mini"
                         @click="addRelFilter(2)">添加</el-button>
              <el-table ref="relTable"
                        :data="relTable"
                        stripe
                        border
                        fit
                        highlight-current-row>
                <el-table-column label="过滤条件"
                                 align="center"
                                 prop=""
                                 width="450px">
                  <template slot-scope="scope"
                            v-if="!scope.row.noShow">
                    <el-row>
                      <el-col :span="18">
                        <el-input :disabled="true"
                                  v-model="scope.row.relFilterValue=inputValue[scope.row.modelDetailConfigUuid]">
                        </el-input>
                        <el-input :disabled="true"
                                  v-show="false"
                                  v-model="scope.row.relFilterValueJson=inputValueJson[scope.row.modelDetailConfigUuid]">
                        </el-input>
                      </el-col>
                      <el-button type="primary"
                                 size="mini"
                                 @click="openQueryBuilder(scope.row.modelDetailConfigUuid)">设置</el-button>
                    </el-row>
                  </template>
                </el-table-column>
                <el-table-column label="操作"
                                 align="center"
                                 prop="runTime"
                                 width="100px">
                  <template slot-scope="scope"
                            v-if="!scope.row.noShow">
                    <el-button type="primary"
                               size="mini"
                               @click.native.prevent="deleteRow(scope.$index, relTable)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-form>
      </div>
    </el-container>
    <el-dialog v-if="ModelTreeDialog"
               :close-on-click-modal="false"
               :destroy-on-close="true"
               :append-to-body="true"
               :visible.sync="ModelTreeDialog"
               title="请选择模型"
               width="80%">
      <ModelFolderTree ref="modelFolderTree"
                       publicModel="relationModel"
                       v-loading="modelTreeLoading" />
      <div slot="footer">
        <el-button type="primary"
                   @click="getSelectModel">确定</el-button>
        <el-button @click="ModelTreeDialog = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog v-if="dataTableTree"
               :close-on-click-modal="false"
               :destroy-on-close="true"
               :append-to-body="true"
               :visible.sync="dataTableTree"
               title="请选择数据表"
               width="80%">
      <dataTree :dataUserId="dataUserId"
                ref="dataTableTree"
                :sceneCode="sceneCode"></dataTree>
      <div slot="footer">
        <el-button type="primary"
                   @click="getDataTable">确定</el-button>
        <el-button @click="dataTableTree = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="条件设置"
               :close-on-click-modal="false"
               :visible.sync="queryBuilderDialogVisible"
               width="30%"
               :append-to-body="true">
      <myQueryBuilder v-if="queryBuilderDialogVisible"
                      ref="myQueryBuilder"
                      :columns="queryRules"
                      :data="queryBuilderJson"
                      :inputselectvalue=columns />
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="queryBuilderDialogVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="queryCondition">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import dataTree from '@/views/data/role-res/data-tree'
import myQueryBuilder from '@/views/analysis/auditmodelresult/myquerybuilder'
import ModelFolderTree from '@/views/analysis/auditmodel/modelfoldertree'
import { selectModel, getTableCol } from '@/api/analysis/auditmodel'
import _ from 'lodash'
import { debug } from 'leancloud-storage'
export default {
  name: 'EditModel',
  components: { ModelFolderTree, dataTree, myQueryBuilder },
  props: ['columns', 'treeId', 'data', 'operationtype'],
  data () {
    return {
      tableData: [{ modelDetailName: '111', modelDetailMemo: '11111111', relationType: 1, relationObjectUuid: '3333', relationObjectName: '5555' }],
      form: {
        modelRelationUuid: '',
        modelUuid: '',
        modelDetailName: '',
        modelDetailMemo: '',
        relationType: '',
        relationObjectUuid: '',
        relationObjectName: '',
        modelDetailConfig: []
      },
      queryBuilderJson: {},
      //关联类型为数据表时，记录当前input框的值
      inputValue: {},
      //关联类型为数据表时，记录当前input框的JSON值 主要用于queryBuilder反显
      inputValueJson: {},
      //当前用户登录名
      dataUserId: this.$store.getters.personcode,
      sceneCode: 'auditor',
      //模型树dialog
      ModelTreeDialog: false,
      //模型树loading
      modelTreeLoading: false,
      //数据表树dialog
      dataTableTree: false,
      //数据表树loading
      dataTableTreeLoading: false,
      //关联模型表数组
      relModelTable: [],
      //关联模型参数数组（页面展示的已去重）
      relModelParam: [],
      // 记录原始的关联模型参数数组
      originalRelModelParam: [],
      //queryBuilderDialog
      queryBuilderDialogVisible: false,
      //queryBuilder列对象
      queryRules: {},
      //关联表数组
      relTable: [],
      //是否禁止编辑
      isBanEdit: false,
      //关联表列数组
      relTableColumn: [],
      currentFilterInputId: '',
      // 非空参数集合
      notNullParamList: [],
      //校验
      rules: {
        modelDetailName: [
          { type: 'string', required: true, message: '请输入详细名称', trigger: 'blur' }
        ],
        relationType: [
          { required: true, message: '请选择关联类型', trigger: 'change' }
        ]
      },
      // 关联列表加载状态
      relationTableLoading: false
    }
  },
  created () {
  },
  mounted () {
    this.initData()
  },
  methods: {
    /**
     * 初始化数据
     */
    initData () {
      if (this.data.length != 0) {
        // 如果数据不为0则证明是修改，需要反显数据
        this.form = this.data
        // 初始化关联详细配置
        if (this.data.relationType == 1) {
          // 显示界面dom
          this.$refs.relModelDivParent.style = 'block'
          this.$refs.relModelTableDiv.style = 'block'
          // 初始化完成树之后初始化被关联模型的参数
          this.loadParamInfo(this.data.relationObjectUuid, 1)
          // 初始化关联模型table
          this.relModelTable = this.data.modelDetailConfig
        }
        if (this.data.relationType == 2) {
          // 显示界面dom
          this.$refs.relTableDivParent.style = 'block'
          this.$refs.relTableDiv.style = 'block'
          //初始化数据表列
          this.loadTableCol(this.data.relationObjectUuid)
          //this.initTableTree()
          // 初始化关联表table
          for (let i = 0; i < this.data.modelDetailConfig.length; i++) {
            this.inputValue[this.data.modelDetailConfig[i].modelDetailConfigUuid] = this.data.modelDetailConfig[i].relFilterValue
            this.inputValueJson[this.data.modelDetailConfig[i].modelDetailConfigUuid] = this.data.modelDetailConfig[i].relFilterValueJson
            //循环处理数据
          }
          this.relTable = this.data.modelDetailConfig
          this.setQueryBuilderColumn()
        }
        //判断是查看还是编辑
        if (this.operationtype == 3) {
          this.isBanEdit = true
        }
      }
    },
    /**
     *获取要添加的对象
     */
    getObj () {
      var verResult = false
      //校验表单
      this.$refs['basicInfoForm'].validate((valid) => {
        if (valid) {
          verResult = valid
        }
      })
      if (!verResult) {
        return { verResult: false, treeId: this.treeId, message: '输入信息不全,添加失败！' }
      }

      // 组织关联详细的对象
      if (this.$refs.relTypeSelect.value == 1) {
        // 如果为关联模型则取模型表的数据
        //校验关联参数的个数和关联的参数是否相等
        let modelDetailConfig = this.$refs.relModelTable.data
        // 获取非空参数集合
        let paramsList = _.filter(this.relModelParam, function (o) { return JSON.parse(o.paramValue).allowedNull == 0 })
        // 非空集合根据formatParamValue.moduleParamId 去重
        paramsList = _.uniqBy(paramsList, 'formatParamValue.moduleParamId')
        // 请设置关联参数
        if (modelDetailConfig.length == 0) {
          return { verResult: false, treeId: this.treeId, message: '请设置关联参数' }
        }
        //如果个数相等则判断当前选择的参数编号与被关联模型的参数编号是否全部一致
        // if(this.relModelParam.length == modelDetailConfig.length){
        if (modelDetailConfig.length <= this.relModelParam.length) {
          let verResult = true
          let oldParamId = []
          let relParamId = []
          //先将被关联模型的参数编号拿到数组
          for (let i = 0; i < this.relModelParam.length; i++) {
            oldParamId.push(this.relModelParam[i].ammParamUuid)
          }
          //循环界面填写的数据判断填写的关联参数编号是否存在于模型参数的编号内，如果不存在则证明参数关联重复了
          for (let i = 0; i < modelDetailConfig.length; i++) {
            if (relParamId.indexOf(modelDetailConfig[i].ammParamUuid) == 0) {
              return { verResult: false, treeId: this.treeId, message: '关联模型的关联参数重复' }
            }
            relParamId.push(modelDetailConfig[i].ammParamUuid)
            if (modelDetailConfig[i].ammParamUuid == '' || modelDetailConfig[i].ammParamUuid == null) {
              return { verResult: false, treeId: this.treeId, message: '关联模型的关联参数不能为空' }
            }
            if (modelDetailConfig[i].resultColumn == '' || modelDetailConfig[i].resultColumn == null) {
              return { verResult: false, treeId: this.treeId, message: '关联模型的关联列不能为空' }
            }
          }
          // if(!verResult){
          //   return { verResult: false, treeId: this.treeId ,message: '关联模型的关联参数重复'}
          // }
          var paramName = []
          if (paramsList.length > 0) {
            paramsList.forEach((r) => {
              paramName.push(r.formatParamValue.name)
              if (relParamId.indexOf(r.ammParamUuid) == -1) {
                verResult = false
              }
            })
          }
          if (!verResult) {
            return { verResult: false, treeId: this.treeId, message: '关联模型的关联参数必须包含所有的非空参数,非空参数包含【' + paramName.join(',') + '】' }
          }
        }
        else if (this.relModelParam.length < modelDetailConfig.length) {
          return { verResult: false, treeId: this.treeId, message: '关联模型的关联参数重复' }
        }
        else {
          return { verResult: false, treeId: this.treeId, message: '关联配置必须包含被关联模型的所有参数' }
        }
        if (this.$refs.relModelTable.data.length === 0) {
          return { verResult: false, treeId: this.treeId, message: '请选择关联的模型或表' }
        } else {
          this.form.modelDetailConfig = this.$refs.relModelTable.data
        }
      } else if (this.$refs.relTypeSelect.value == 2) {
        if (this.$refs.relTable.data.length == 0) {
          return { verResult: false, treeId: this.treeId, message: '关联表必须设置过滤条件' }
        }
        // 如果为关联表则取表的数据
        this.form.modelDetailConfig = this.$refs.relTable.data;
      }
      return this.form
    },
    /**
       * 添加关联条件
       * @param type 1、关联模型；2、关联表
       */
    addRelFilter (type) {
      if (type == 1) {
        this.relModelTable.push({})
      } else {
        let id = new Date().getTime()
        this.relTable.push({ modelDetailConfigUuid: id, noShow: false })
      }
    },
    loadTableCol (id) {
      //获取选中表的列id，列名称等信息
      getTableCol(id).then(result => {
        if (result.data == null) {
          this.$message({ type: 'info', message: '加载数据表列失败!' })
          return
        }
        this.relTableColumn = result.data
        this.$refs.relTableDiv.style.display = 'block'
        this.setQueryBuilderColumn()
      })
    },
    /**
       * 关联类型下拉框改变事件
       */
    relTypeSelectChange (vId) {
      // 根据选择的类型来决定加载模型还是加载数据表
      if (vId == 1) {
        this.$refs.relTableDivParent.style.display = 'none'
        this.$refs.relModelDivParent.style.display = 'block'
        this.$refs.relTableDiv.style.display = 'none'
      } else if (vId == 2) {
        this.$refs.relModelDivParent.style.display = 'none'
        this.$refs.relTableDivParent.style.display = 'block'
        this.$refs.relModelTableDiv.style.display = 'none'
      }
      //清空数据
      this.relTable = []
      this.relModelTable = []
      this.form.relationObjectName = ""
      this.form.relationObjectUuid = ""
    },
    /**
       * 删除表格指定行
       * @param index 要删除的索引
       * @param rows 要删除的数据数组
       */
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },
    /**
     * 值改变同时更改树节点名称
     * @param value 改变的值
     */
    nameValueChange (value) {
      this.$emit('updateTreeNode', value)
    },
    /**
     * 关联模型选择模型窗体
     */
    selectModel () {
      this.ModelTreeDialog = true
    },
    /**
     * 获取模型选择窗体选择的数据
     */
    getSelectModel () {
      const modelTreeNode = this.$refs.modelFolderTree.getSelectNode()
      if (modelTreeNode.type != 'model') {
        this.$message({ type: 'info', message: '请选择模型!' })
        return
      }
      this.modelTreeLoading = true
      // 获取模型基本信息开始初始化能关联的参数
      this.loadParamInfo(modelTreeNode.id, 2)
    },
    /**
     * 加载模型参数信息
     * @param modelUuid 模型编号
     * @param type 初始化1，编辑2
     */
    loadParamInfo (modelUuid, type) {
      this.relationTableLoading = true
      selectModel(modelUuid).then(result => {
        this.modelTreeLoading = false
        if (result.data == null) {
          this.$message({ type: 'error', message: '获取模型信息失败!' })
          return
        }
        if (result.data.parammModelRel.length == 0) {
          this.$message({ type: 'info', message: '该模型没有参数,请重新选择!' })
          return
        }
        this.ModelTreeDialog = false
        // 初始化模型的参数
        result.data.parammModelRel.map(i => {
          i.formatParamValue = JSON.parse(i.paramValue)
          i.moduleParamId = i.formatParamValue.moduleParamId
        })
        let parammModelRel = result.data.parammModelRel

        // 深拷贝parammModelRel提交时备用
        this.originalRelModelParam = parammModelRel.concat();
        // parammModelRel 根据resourceUuid 去重
        let filtered_parammModelRel = _.uniqBy(result.data.parammModelRel, 'formatParamValue.moduleParamId')
        this.relModelParam = filtered_parammModelRel
        // this.relModelParam = result.data.parammModelRel
        this.relationTableLoading = false
        if (type == 2) {
          // 编辑切换模型对象时初始化先清空
          this.relModelTable = []
        }
        // 必填参数初始化
        this.notNullParamList = _.filter(this.relModelParam, function (o) { return JSON.parse(o.paramValue).allowedNull == 0 })
        // 输出列根据formatParamValue.moduleParamId去重
        this.notNullParamList = _.uniqBy(this.relModelParam, 'formatParamValue.moduleParamId')
        if (this.notNullParamList.length > 0) {
          this.notNullParamList.forEach((r) => {
            if (typeof _.find(this.relModelTable, ['ammParamUuid', r.ammParamUuid]) == 'undefined'
              || _.find(this.relModelTable, ['ammParamUuid', r.ammParamUuid]) == null)
              this.relModelTable.push({ ammParamUuid: r.ammParamUuid, resultColumn: null, allowedNull: 0 })
          })
        }
        //设置对象
        this.form.relationObjectUuid = result.data.modelUuid
        this.form.relationObjectName = result.data.modelName
        this.$refs.relModelTableDiv.style = 'block'
      })
    },
    /**
     * 设置queryBuilder列
     */
    setQueryBuilderColumn () {
      const queryRules = []
      for (let i = 0; i < this.relTableColumn.length; i++) {
        const obj = {}
        obj.columnType = this.relTableColumn[i].dataType
        if (this.relTableColumn[i].chnName == null || this.relTableColumn[i].chnName === "") {
          obj.columnName = this.relTableColumn[i].colName
        }
        else {
          obj.columnName = this.relTableColumn[i].chnName
        }
        queryRules.push(obj)
      }
      this.queryRules.columnList = queryRules
    },
    /**
     * 显示数据表树
     */
    showDataTree () {
      this.dataTableTree = true
    },
    getDataTable () {
      let dataTree = this.$refs.dataTableTree.getTree()
      let currentNode = dataTree.getCurrentNode()
      if (currentNode.type != "table") {
        this.$message({ type: 'info', message: '请选择数据表!' })
        return
      }
      this.loadTableCol(currentNode.id)
      this.form.relationObjectName = currentNode.label
      this.form.relationObjectUuid = currentNode.id
      this.dataTableTree = false

    },
    openQueryBuilder (id) {
      if (this.inputValueJson[id] != undefined) {
        this.queryBuilderJson = JSON.parse(this.inputValueJson[id])
      }
      this.queryBuilderDialogVisible = true
      this.currentFilterInputId = id
    },
    queryCondition () {
      const obj = this.$refs.myQueryBuilder.getSelectSql()
      this.queryBuilderDialogVisible = false
      this.setFilter(obj.sql, JSON.stringify(obj.queryJson))
    },
    setFilter (sql, queryJson) {
      this.inputValue[this.currentFilterInputId] = sql
      this.inputValueJson[this.currentFilterInputId] = queryJson
      this.relTable.push({ modelDetailConfigUuid: 1, noShow: true })
    }
  }
}
</script>
