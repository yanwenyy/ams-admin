<template>
  <div>
    <div class="title-div">
      <span class="title">操作</span>
    </div>
    <div>
      <el-form
        ref="dataForm"
        :model="formCodeData"
        :rules="rules"
        class="detail-form">
        <el-row>
          <el-col :span="11">
          <el-form-item
            label="类型名称"
            prop="codeName" >
            <el-input
              v-model="formCodeData.codeName"
              class="input" />
          </el-form-item>
            <el-form-item
              v-if="show=false"
              label="uuid"
              prop="codeUuid">
              <el-input
                v-model="formCodeData.codeUuid"
                placeholder="请输入数字"
                class="input" />
          </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
          <el-form-item
              label="类型编码"
              prop="codeValue" >
            <el-input
                v-model="formCodeData.codeValue"
                placeholder="请输入4-10位的数字"
                class="input"
                @change="number()"
              />
          </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
          <el-form-item
            label="排序号"
            prop="codeIndex" >
            <el-input
              v-model="formCodeData.codeIndex"
              placeholder="请输入数字"
              class="input"
              @change="number()"
            />
          </el-form-item>
          </el-col>
        </el-row>
          <el-form-item
            label="类型描述"
            prop="codeDesc" >
            <el-input
              v-model="formCodeData.codeDesc"
              type="textarea" />
          </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { saveSecond, updateSecond } from '@/api/base/sysdata'
export default {
  props: ['codeOperate'],
  data() {
    return {
      formCodeData: {
        codeUuid: '',
        codeIndex: '',
        codeName: '',
        codeDesc: '',
        codeValue: '',
        parentCodeUuid: '',
        dataSortUuid: '',
        delTag: '0'
      },
      editCodeValue: '',
      rules: {
        codeName: [
          { required: true, message: '请输入类型名称', trigger: 'blur' }
        ],
        codeValue: [
          { required: true, message: '请输入类型编码', trigger: 'blur' }
        ],
        codeIndex: [
          { required: true, message: '请输入排序号', trigger: 'blur' }
        ],
        codeDesc: [
          { required: true, message: '请填写类型描述', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    codeOperate(data) {
      if (data.length === 1) {
        this.formCodeData.codeUuid = data[0].codeUuid
        this.formCodeData.codeName = data[0].codeName
        this.formCodeData.codeDesc = data[0].codeDesc
        this.formCodeData.codeIndex = data[0].codeIndex
        this.formCodeData.codeValue = data[0].codeValue
        this.editCodeValue = data[0].codeValue
      } else {
        this.resetForm()
      }
    }
  },
  methods: {
    // 校验编码格式
    number() {
      var data = this.formCodeData.codeValue
      const codeValue = new RegExp('^[0-9]{4,32}$').test(data)
      if (!codeValue) {
        this.$notify.error({
          title: '错误',
          duration: 2000,
          message: '请输入4-32位的数字',
          position: 'bottom-right'
        })
        this.formCodeData.codeValue = ''
      }
    },
    // 重置
    resetForm() {
      this.formCodeData = {
        codeUuid: '',
        codeIndex: '',
        codeName: '',
        codeDesc: '',
        codeValue: '',
        parentCodeUuid: '',
        dataSortUuid: '',
        delTag: ''
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 添加
    saveCedeData(sortUuid, parentCodeUuid) {
      if (
        this.formCodeData.codeName === undefined ||
        this.formCodeData.codeName === null ||
        this.formCodeData.codeName === ''
      ) {
        this.$message.warning(`请输入类型名称(必填)`)
        return false
      }
      if (
        this.formCodeData.codeValue === undefined ||
        this.formCodeData.codeValue === null ||
        this.formCodeData.codeValue === ''
      ) {
        this.$message.warning(`请输入类型编码(必填)`)
        return false
      }
      if (
        this.formCodeData.codeDesc === undefined ||
        this.formCodeData.codeDesc === null ||
        this.formCodeData.codeDesc === ''
      ) {
        this.$message.warning(`请输入类型描述(必填)`)
        return false
      }
      if (
        this.formCodeData.codeIndex === undefined ||
        this.formCodeData.codeIndex === null ||
        this.formCodeData.codeIndex === ''
      ) {
        this.$message.warning(`请输入排序号(必填)`)
        return false
      }
      if (sortUuid === '' || sortUuid === null || sortUuid === undefined) {
        sortUuid = parentCodeUuid
      }
      this.formCodeData.dataSortUuid = sortUuid
      this.formCodeData.parentCodeUuid = parentCodeUuid
      saveSecond(this.formCodeData).then(() => {
        this.resetForm()
        this.$emit('closeMain')
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000,
          position: 'bottom-right'
        })
      }).catch(function(error) {
        console.log(error)
      })
    },
    // 修改前的校验
    editCodeDataBefore(sortUuid, parentCodeUuid) {
      if (
              this.formCodeData.codeName === undefined ||
              this.formCodeData.codeName === null ||
              this.formCodeData.codeName === ''
      ) {
        this.$message.warning(`请输入类型名称(必填)`)
        return false
      }
      if (
              this.formCodeData.codeDesc === undefined ||
              this.formCodeData.codeDesc === null ||
              this.formCodeData.codeDesc === ''
      ) {
        this.$message.warning(`请输入类型描述(必填)`)
        return false
      }
      if (
              this.formCodeData.codeIndex === undefined ||
              this.formCodeData.codeIndex === null ||
              this.formCodeData.codeIndex === ''
      ) {
        this.$message.warning(`请输入排序号(必填)`)
        return false
      }
      if (
              this.formCodeData.codeValue === undefined ||
              this.formCodeData.codeValue === null ||
              this.formCodeData.codeValue === ''
      ) {
        this.$message.warning(`请输入类型编码(必填)`)
        return false
      }
      if (this.editCodeValue != this.formCodeData.codeValue) {
        this.$confirm(
            '系统参数编码不能随便修改，确定继续修改吗?',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
        ).then(() => {
          this.editCodeData(sortUuid, parentCodeUuid)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消修改'
          })
          return false
        });
      } else {
        this.editCodeData(sortUuid, parentCodeUuid)
      }
    },
    // 修改
    editCodeData(sortUuid, parentCodeUuid) {
      // this.$confirm(
      //   '不可以修改类型编码，编码将保持不变，是否确认修改其他信息?',
      //   '提示',
      //   {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }
      // ).then(() => {
        this.formCodeData.dataSortUuid = sortUuid
        this.formCodeData.parentCodeUuid = parentCodeUuid
        this.formCodeData.delTag = '0'
        // this.formCodeData.codeValue = this.editCodeValue
        updateSecond(this.formCodeData).then(response => {
          this.$emit('closeMain')
          this.resetForm()
          // const index = this.listSecond.findIndex(v => v.codeUuid === this.tempSecond.codeUuid)
          // this.listSecond.splice(index, 1, tempDataSecond)
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000,
            position: 'bottom-right'
          }).catch(function(error) {
            console.log(error)
          })
        })
      // })
    }
  }
}
</script>
<style scoped>
.title-div {
  text-align: left;
}
.input {
  width: 100%;
  float: left;
}
.title {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #42444d;
  font-weight: 600;
}
</style>

