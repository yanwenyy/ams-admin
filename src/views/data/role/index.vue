<template>
  <div class="page-container">
    <div class="pd20">
      <div class="filter-container">
        <QueryField ref="queryfield"
                    :form-data="queryFields"
                    @submit="getList" />
      </div>
      <div class="mb10">
        <el-row>
          <el-col align="right">
            <el-button size="small"
                       class="oper-btn"
                       type="primary"
                       @click="handleCreate()"><img src="../../../styles/image/add.png"
                   class="btn_icon icon1"
                   alt="">
              <img src="../../../styles/image/add2.png"
                   class="btn_icon icon2"
                   alt="">
              新增</el-button>

            <el-button size="small"
                       type="primary"
                       class="oper-btn"
                       :disabled="selections.length !== 1"
                       @click="handleUpdate()"><img src="../../../styles/image/edits.png"
                   class="btn_icon icon1"
                   alt="">
              <img src="../../../styles/image/edits2.png"
                   class="btn_icon icon2"
                   alt="">编辑</el-button>
            <el-button size="small"
                       type="primary"
                       class="oper-btn"
                       :disabled="selections.length === 0"
                       @click="handleDelete()"><img src="../../../styles/image/delete.png"
                   class="btn_icon icon1"
                   alt="">
              <img src="../../../styles/image/delete2.png"
                   class="btn_icon icon2"
                   alt="">删除</el-button>

            <!-- 绑定资源 -->
            <el-button size="small"
                       type="primary"
                       class="oper-btn"
                       :disabled="selections.length !== 1"
                       @click="bindRes()"><img src="../../../styles/image/bind.png"
                   class="btn_icon icon1"
                   alt="">
              <img src="../../../styles/image/bind2.png"
                   class="btn_icon icon2"
                   alt="">绑定资源</el-button>

            <el-button size="small"
                       type="primary"
                       class="oper-btn"
                       :disabled="selections.length !== 1"
                       @click="authentic()"><img src="../../../styles/image/authentic.png"
                   class="btn_icon icon1"
                   alt="">
              <img src="../../../styles/image/authentic2.png"
                   class="btn_icon icon2"
                   alt="">授权</el-button>
          </el-col>
        </el-row>
      </div>

      <el-table :key="tableKey"
                v-loading="listLoading"
                :data="list"
                border
                fit
                style="width: 100%;"
                height="calc(100vh - 300px)"
                @sort-change="sortChange"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="55" />
        <el-table-column label="数据角色名称"
                         min-width="150px"
                         prop="dataRoleName"
                         show-overflow-tooltip />
        <el-table-column label="创建时间"
                         align="center"
                         min-width="150px"
                         prop="createTime"
                         show-overflow-tooltip />
        <el-table-column label="授权方式"
                         align="center"
                         prop="authenType"
                         min-width="150px"
                         :formatter="formatAuthenType" />
        <!-- <el-table-column label="数据筛选" style="width: 50px" align="center">
        <template slot-scope="scope">
          <el-button type="primary" class="oper-btn preview" size="mini" @click="openFilterPanel(scope.row.dataRoleUuid)" />
        </template>
      </el-table-column> -->
        <!-- <el-table-column label="数据有效期"
                       align="center"
                       prop="timeDuring"
                       :formatter="formatDuring"
                       width="400px"
                       show-overflow-tooltip /> -->
      </el-table>
      <pagination v-show="total>0"
                  :total="total"
                  :page.sync="pageQuery.pageNo"
                  :limit.sync="pageQuery.pageSize"
                  @pagination="getList" />

      <el-dialog :title="textMap[dialogStatus]"
                 :visible.sync="dialogFormVisible"
                 :close-on-click-modal="false">
        <div class="detail-form">
          <template class="detail-form">
            <el-form ref="dataForm"
                     :rules="rules"
                     :model="temp"
                     label-position="right">
              <el-form-item label="数据角色名称"
                            prop="dataRoleName">
                <el-input v-model="temp.dataRoleName" />
              </el-form-item>
              <el-form-item label="授权方式"
                            prop="authenType">
                <el-select ref="authenType"
                           v-model="temp.authenType"
                           placeholder="请选择授权方式"
                           style="width: 100%">
                  <el-option v-for="item in authenTypeJson"
                             :key="item.codeValue"
                             :label="item.codeName"
                             :value="item.codeValue" />
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="开始时间"
                          prop="startTime">
              <el-date-picker v-model="temp.startTime"
                              format="yyyy-MM-dd HH:mm:ss"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              clearable
                              style="width: 100%"
                              :picker-options="startDatePicker"
                              :disabled="dialogStatus=='view'"
                              type="datetime"
                              :placeholder="dialogStatus=='view'?'':'请输入生效开始时间'" />
            </el-form-item>
            <el-form-item label="结束时间"
                          prop="endTime">
              <el-date-picker v-model="temp.endTime"
                              format="yyyy-MM-dd HH:mm:ss"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              clearable
                              style="width: 100%"
                              :picker-options="endDatePicker"
                              :disabled="dialogStatus=='view'"
                              type="datetime"
                              :placeholder="dialogStatus=='view'?'':'请输入生效结束时间'" />
            </el-form-item> -->
            </el-form>
          </template>

        </div>
        <div slot="footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary"
                     @click="dialogStatus==='create'?createData():updateData()">保存</el-button>
        </div>
      </el-dialog>

      <el-dialog title="数据筛选选择"
                 :visible.sync="filterVisible"
                 :close-on-click-modal="false">
        <template class="detail-form">
          <el-form>
            <el-form-item>
              <el-checkbox v-for="filter in allFilters"
                           :key="filter.filterName"
                           v-model="filter.roleUuid"
                           :label="filter.filterName" />
            </el-form-item>
          </el-form>
        </template>
        <div slot="footer">
          <el-button @click="filterVisible = false">取消</el-button>
          <el-button type="primary"
                     @click="handleSaveRoleFilter">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import {listByPage, save, update, del, getSceneFilter, changeRoleFilter, isApplied} from '@/api/data/role'
import QueryField from '@/components/public/query-field/index'
import { getDictList, commonNotify } from '@/utils'
import { cacheDict } from "@/api/base/sys-dict";

export default {
  components: { Pagination, QueryField },
  data () {
    return {
      sceneCode: this.$route.params.sceneCode,
      startDatePicker: this.beginDate(),
      endDatePicker: this.processDate(),
      tableKey: 'dataRoleUuid',
      list: null,
      total: 0,
      listLoading: false,
      // text 精确查询   fuzzyText 模糊查询  select下拉框  timePeriod时间区间
      queryFields: [
        { label: '数据角色名称', name: 'dataRoleName', type: 'text', value: '' }
      ],
      pageQuery: {
        condition: null,
        pageNo: 1,
        pageSize: 20,
        sortBy: 'asc',
        sortName: 'create_time'
      },
      authenTypeJson: [],
      temp: {
        dataRoleUuid: undefined,
        dataRoleName: '',
        authenType: '',
        filterState: '',
        startTime: '',
        endTime: ''
      },
      selections: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改数据角色',
        create: '新增数据角色'
      },
      dialogPvVisible: false,
      rules: {
        dataRoleName: [{ required: true, message: '请填写数据角色名称', trigger: 'change' }],
        authenType: [{ required: true, message: '请选择授权方式', trigger: 'change' }],
        startTime: [{ required: true, message: '请填写生效开始时间', trigger: 'change' }],
        endTime: [{ required: true, message: '请填写生效结束时间', trigger: 'change' }]
      },
      downloadLoading: false,
      filterVisible: false,
      currentRoleUuid: '',
      allFilters: [],
      authenTypeTemp: '',// 临时授权类型
    }
  },
  computed: {
    /* ...mapState({
      personcode: state => state.user.code
    })*/

  },
  created () {
    this.getList()
  },
  methods: {
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
    getList (query) {
      this.authenTypeJson = getDictList('004001')
      if (this.authenTypeJson === null) {
        cacheDict().then((resp) => {
          sessionStorage.setItem("sysDict", JSON.stringify(resp.data));
        });
        this.authenTypeJson = getDictList('004001')
      }
      this.listLoading = true
      if (query) {
        this.pageQuery.condition = query;
        this.pageQuery.pageNo = 1;
      }
      listByPage(this.pageQuery).then(resp => {
        this.total = resp.data.total
        this.list = resp.data.records
        this.listLoading = false
      })
    },
    handleFilter () {
      this.pageQuery.pageNo = 1
      this.getList()
    },
    sortChange (data) {
      const { prop, order } = data
      this.pageQuery.sortBy = order
      this.pageQuery.sortName = prop
      this.handleFilter()
    },
    resetTemp () {
      this.temp = {
        dataRoleUuid: undefined,
        dataRoleName: '',
        authenType: '',
        filterState: '',
        startTime: '',
        endTime: ''
      }
    },
    handleCreate () {
      /* console.log(this.$store.getters.personuuid);
      getDict('sex').then(data => {
        console.log(data)
      });*/
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData () {
      if (this.temp.startTime > this.temp.endTime) {
        this.$notify({
          title: '警告',
          message: '开始时间要小于结束时间',
          type: 'warning',
          duration: 2000,
          position: 'bottom-right',
        })
        return
      }

      // var starDate = new Date(this.temp.startTime)
      // this.temp.startTime = starDate
      // var endDate = new Date(this.temp.endTime)
      // this.temp.endTime = endDate
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          save(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000,
              position: 'bottom-right'
            })
          })
        }
      })
    },
    handleUpdate () {
      this.temp = Object.assign({}, this.selections[0]) // copy obj
      this.authenTypeTemp = this.temp.authenType;
      // var startTime = new Date(this.temp.startTime)
      // this.temp.startTime = startTime.getFullYear() + '-' + (startTime.getMonth() + 1) + '-' + startTime.getDate() + ' ' + startTime.getHours() + ':' + startTime.getMinutes() + ':' + startTime.getSeconds()
      // var endTime = new Date(this.temp.endTime)
      // this.temp.endTime = endTime.getFullYear() + '-' + (endTime.getMonth() + 1) + '-' + endTime.getDate() + ' ' + endTime.getHours() + ':' + endTime.getMinutes() + ':' + endTime.getSeconds()
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // formatCreateTime(row, column) {
    //   // 拼接日期规格为YYYY-MM-DD hh:mm:ss
    //   var createTime = new Date(row.createTime)
    //   var createTimeRow = createTime.getFullYear() + '-' + (createTime.getMonth() + 1) + '-' + createTime.getDate() + ' ' + createTime.getHours() + ':' + createTime.getMinutes() + ':' + createTime.getSeconds()
    //   return createTimeRow
    // },
    formatAuthenType (row, column) {
      var data = getDictList('004001')
      if (data === null) {
        cacheDict().then((resp) => {
          sessionStorage.setItem("sysDict", JSON.stringify(resp.data));
        });
        data = getDictList('004001')
      }
      var authenObj = data.filter(obj => { return obj.codeValue === row.authenType })
      if (authenObj !== null) {
        return authenObj[0].codeName
      }
    },
    formatDuring (row, column) {
      return row.startTime + '至' + row.endTime
      // var startDate = new Date(row.startTime)
      // var rowStart = startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate() + ' ' + startDate.getHours() + ':' + startDate.getMinutes() + ':' + startDate.getSeconds()
      // var endDate = new Date(row.endTime)
      // var rowEnd = endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate() + ' ' + endDate.getHours() + ':' + endDate.getMinutes() + ':' + endDate.getSeconds()
      // return rowStart + '至' + rowEnd
    },
    updateData () {
      // var starDate = new Date(this.temp.startTime)
      // this.temp.startTime = starDate
      // var endDate = new Date(this.temp.endTime)
      // this.temp.endTime = endDate
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          if (this.authenTypeTemp != tempData.authenType){
            isApplied(tempData.dataRoleUuid).then((resp) => {
              if (resp.data){
                this.$notify({
                  title: '提示',
                  message: '无法修改已被用户拥有的角色授权方式',
                  type: 'warning',
                  duration: 2000,
                  position: 'bottom-right'
                });
                return;
              }
              this.doUpdate(tempData);
            })
          }else {
            this.doUpdate(tempData);
          }
        }
      })
    },
    doUpdate(tempData){
      update(tempData).then(() => {
        const index = this.list.findIndex(v => v.dataRoleUuid === this.temp.dataRoleUuid)
        this.list.splice(index, 1, this.temp)
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000,
          position: 'bottom-right'
        })
      })
    },
    handleDelete () {
      var ids = []
      // 删除列表中是否存在数据申请角色
      var flag = false;
      this.selections.forEach((r, i) => {
        ids.push(r.dataRoleUuid);
        if (r.authenType == "004001002"){
          flag = true;
        }
      });
      if (flag){
        isApplied(ids.join(',')).then((resp) => {
          if (resp.data){
            this.$notify({
              title: '提示',
              message: '无法删除已经被申请的角色',
              type: 'warning',
              duration: 2000,
              position: 'bottom-right'
            });
          }else {
            this.doDelete(ids);
          }
        })
      }else {
        this.doDelete(ids);
      }

    },
    doDelete(ids){
      this.$confirm('确定删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        del(ids.join(',')).then(() => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000,
            position: 'bottom-right'
          })
        })
      })
    },
    handleSelectionChange (val) {
      this.selections = val
    },
    getSortClass: function (key) {
      const sort = this.pageQuery.sort
      return sort === `+${key}` ? 'asc' : 'desc'
    },
    authentic () {
      var roleUuid = this.selections[0].dataRoleUuid
      var sceneCode = this.sceneCode;
      this.$router.push({
        path: `/data/roleGrp/${roleUuid}/${sceneCode}`
      })
    },
    bindRes () {
      var roleUuid = this.selections[0].dataRoleUuid
      this.$router.push({
        path: '/data/roleRes/' + roleUuid
      })
    },
    openFilterPanel (roleUuid) {
      getSceneFilter(roleUuid, this.sceneCode).then(resp => {
        console.log(resp.data)
        resp.data.forEach(f => {
          f.roleUuid = (f.roleUuid != null)
        })
        this.allFilters = resp.data
        this.filterVisible = true
        this.currentRoleUuid = roleUuid
      })
    },
    handleSaveRoleFilter () {
      var datas = []
      this.allFilters.forEach(f => {
        datas.push({
          sceneFilterUuid: f.sceneFilterUuid,
          dataRoleUuid: this.currentRoleUuid,
          isSave: f.roleUuid // true or false
        })
      })
      changeRoleFilter(datas).then(resp => {
        this.$notify(commonNotify({ type: 'success', message: '保存成功！' }))
        this.filterVisible = false
      })
    }
  }
}
</script>
<style scoped>
  >>>table tr:nth-child(odd){
    background: none!important;
  }
</style>
