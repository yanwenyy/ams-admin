<template>
<!--  点击详情按钮之后会出现加载页面-->
  <div class="app-container" v-loading="colLoading">
    <el-row>
      <el-col
        v-if="openType !== 'showTable' && openType !== 'tableRegister'"
        align="right"
      >
        <!-- <el-button type="primary" size="mini" class="oper-btn iconoper-export" title="上移" @click="upTheCol()" />
        <el-button type="primary" size="mini" class="oper-btn iconoper-import" title="下移" @click="downTheCol()" /> -->
        <el-button
          type="primary"
          size="mini"
          class="oper-btn add"
          @click="addCol()"
        />
        <el-button
          type="primary"
          size="mini"
          class="oper-btn copy"
          :disabled="selections.length !== 1"
          @click="copyCol()"
        />
        <el-button
          type="primary"
          size="mini"
          class="oper-btn delete"
          :disabled="selections.length === 0"
          @click="delCol()"
        />
      </el-col>
    </el-row>
    <template
      v-if="openType !== 'showTable' && openType !== 'tableRegister'"
      class="detail-form"
    >
      <el-form ref="dataForm"
               :model="tempTable"
               :rules="judgeTbName"
      >
        <el-form-item label="表名称" prop="displayTbName">
          <el-input v-model="tempTable.displayTbName" />
        </el-form-item>
        <!-- <el-form-item v-if="openType !== 'addTable'" label="新建表注释" prop="tableComment">
          <el-input v-model="tempTable.tableComment" />
        </el-form-item> -->
      </el-form>
    </template>
    <el-table :data="temp" @selection-change="handleSelectionChange" class="detail-form" style="padding: 0"  height="250">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="colName" label="字段名称" show-overflow-tooltip >
        <template slot-scope="scope" show-overflow-tooltip >
          <el-tooltip
            :disabled="scope.row.colName.length < 12"
            effect="dark"
            :content="scope.row.colName"
            placement="top"
          >
            <el-input
              v-model="scope.row.colName"
              style="width: 90%"
              :disabled="openType === 'showTable' || openType === 'tableRegister'"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="dataType" label="数据类型">
        <template slot-scope="scope">
          <el-select
            ref="dataType"
            v-model="scope.row.dataType"
            :disabled="openType === 'showTable' || openType === 'tableRegister'"
            filterable
            style="width: 90%"
            @change="changeDataType(scope.row)"
            placeholder="请选择数据类型"
          >
            <el-option
              v-for="item in sqlType"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </template>
      </el-table-column>
      <!--        -->
      <el-table-column
        label="数据长度（精度）"
        prop="dataLengthText"
        show-overflow-tooltip>
        <template slot-scope="scope" show-overflow-tooltip>
        <!--   v-model 需要根据是否是decimal展示长度+精度 用到了双三目，有点难看
            @focus="clickVal(scope.row)"-->
          <el-input
            @change="isValidColumn(scope.row)"
            v-model="scope.row.dataLengthText"
            style="width: 90%"
            :disabled="!scope.row.enableDataLength"
          />
        </template>
      </el-table-column>
      <el-table-column label="是否为空" width="120px">
        <template slot-scope="scope">
          <el-radio
            v-model="scope.row.isNullable"
            :disabled="openType === 'showTable' || openType === 'tableRegister'"
            :label="1"
            @click.native.prevent="clickitem(scope.$index, 1)"
            ><span
          /></el-radio>
        </template>
      </el-table-column>
      <!-- <el-table-column v-if="openType !== 'addTable'" prop="colComment" label="注释" show-overflow-tooltip>
        <template slot-scope="scope" show-overflow-tooltip>
          <el-input v-model="scope.row.colComment" :disabled="openType === 'showTable' || openType === 'tableRegister'" style="width:90%;" />
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
import { getSqlType, getColsInfo } from "@/api/data/table-info";
import { addTable, updateTable } from "@/api/data/directory";
import _ from "lodash"
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ["tableId", "openType", "forderId", "getTree","clickId","isEdit","relationForm"],
  data() {
    return {
      colLoading: false,
      copyColObj: {},
      selections: [],
      sqlType: {},
      temp: [],
      tempIndex: 0,
      tempColumn: [],
      oldName: "",
      show: false,
      tempTable: { displayTbName: "" },
      currColType: '',
      dataTypeRules: {},
      disableEditColumn: false,
      re:[],
      judgeTbName:{
        displayTbName:[
          { required: true, message: "请填写表名称", trigger: "change" },
          {
            type: 'string',
            pattern: /^[\D][\u4E00-\u9FA5\w]{0}[\u4E00-\u9FA5\w]*$/,
            message: '请输入合法表名称',
          },{
            type: 'string',
            pattern: /^[\u4E00-\u9FA5\w]*$/,
            message: '请输入合法表名称',
          },
        ],

      }
    }

  },
  created() {
    this.dataTypeRules = this.CommonUtil.DataTypeRules;
    this.dataTypeRules = _.DataTypeRules;
    this.initTable(this.tableId);
  },
  watch: {
    openType: {
      handler(newOpenType) {
        this.disableEditColumn = newOpenType === 'showTable' || newOpenType === 'tableRegister'
      }
    }

  },
  methods: {
    changeDataType(row){
      this.$emit("changeDataType", row);
    },
    isValidColumn(row) {
      return this.$emit("isValidColumn", row);
    },
    initTable(tableId) {
      getSqlType().then((resp) => {
        this.sqlType = resp.data;
      });
      //在修改模型的时候才有loading
      if (this.openType !== "addTable") {
        this.colLoading = true;
        getColsInfo(tableId).then((resp) => {
          this.colLoading = false;
          // 返回两个新的数组
          this.oldName = resp.data.displayTbName;
          this.tempTable.displayTbName = resp.data.displayTbName;
          this.temp = resp.data.colMetas;
          this.temp.forEach((row) => {
            this.$set(row, "tempIndex", ++this.tempIndex);
            this.changeDataType(row);
          })
        });
      }
    },
    handleSelectionChange(val) {
      this.selections = val;
    },
    upTheCol() {
      var rulObj = Object.assign({}, this.selections[0]); // copy obj
      var index = this.temp.findIndex(
        (v) => JSON.stringify(v) === JSON.stringify(rulObj)
      );
      this.temp.splice(index - 1, 0, rulObj);
      this.temp.splice(index + 1, 1);
      this.selections = rulObj;
      // var rulObj = Object.assign({}, this.selections[0]) // copy obj
      // var index = this.temp.findIndex(v => JSON.stringify(v) === JSON.stringify(rulObj))
      // if (this.temp.length > 1 && index !== 0) {
      //   var tempObj = this.temp[index - 1]
      //   this.temp[index - 1] = this.temp[index]
      //   this.temp[index] = tempObj
      // }
    },
    downTheCol() {
      var rulObj = Object.assign({}, this.selections[0]); // copy obj
      var index = this.temp.findIndex(
        (v) => JSON.stringify(v) === JSON.stringify(rulObj)
      );
      this.temp.splice(index - 1, 0, rulObj);
      this.temp.splice(index + 1, 1);
      this.selections = rulObj;
      // var rulObj = Object.assign({}, this.selections[0]) // copy obj
      // var index = this.temp.findIndex(v => JSON.stringify(v) === JSON.stringify(rulObj))
      // if (this.temp.length > 1 && index !== this.temp.length - 1) {
      //   var tempObj = this.temp[index + 1] // 以c为基点
      //   this.temp[index + 1] = this.temp[index]
      //   this.temp[index] = tempObj
      // }
    },
    addCol() {
      var newObj = {}; // copy obj
      newObj.colName = "";
      newObj.dataType = "";
      newObj.dataLengthText = "";
      newObj.isNullable = 0;
      this.tempIndex++;
      newObj.tempIndex = this.tempIndex;
      newObj.colComment = "";
      this.temp.splice(this.temp.length, 0, newObj);
    },
    delCol() {
      this.selections.forEach((r, i) => {
        var index = this.temp.findIndex(
          (v) => JSON.stringify(v) === JSON.stringify(r)
        );
        this.temp.splice(index, 1);
      });
    },
    copyCol() {
      this.copyColObj = Object.assign({}, this.selections[0]);
      this.temp.splice(this.temp.length, 0, this.copyColObj);
    },
    clickitem(row, e) {
      // 当点击已经选中的把 isNullable 置0，就是取消选中，并返回
      if (this.temp[row].isNullable === e) {
        this.temp[row].isNullable = 0;
        return;
      }
      // 不是选中，选中当前点击 Radio
      this.temp[row].isNullable = e;
    },
    saveTableInfo() {
      if (this.openType === "addTable") {
        this.saveTable();
      } else {
        this.updateTable();
      }
    },
///^[\D][\u4E00-\u9FA5\w]{0}[\u4E00-\u9FA5\w]*$/
    judegeTable(val){
      const judege=(/^[\D][\u4E00-\u9FA5\w]{0}[\u4E00-\u9FA5\w]*$/ && /^[\u4E00-\u9FA5\w]*$/)
      if (judege.test(val)){
        return true;
        }else{
        return false;
      }
    },
    // 保存基本信息
    saveTable() {
      for (let index = 0; index < this.temp.length; index++) {
        //先判空
        let obj = this.temp[index]
        var a =this.judegeTable(obj.colName)
        if(this.CommonUtil.isBlank(obj.colName)){
          this.$message.error("请完善建表信息，字段名称不能为空");
          return
        }else if(this.CommonUtil.isBlank(obj.dataType)){
          this.$message.error("请完善建表信息，数据类型不能为空");
          return
        } if (!a){
          this.$message.error("请完善建表信息，字段名称不能有特殊符号");
          return
        }
        //再判合法
        if (!this.isValidColumn(obj)) {
          return;
        }
      }
      const addObj = {};
      addObj.colMetas = this.temp;
      addObj.folderUuid = this.forderId;
      addObj.displayTbName = this.tempTable.displayTbName;
      // var aa = this.relationForm;

      const tableMeta = {
            colMetas: this.temp,
            // tableMetaUuid: this.ischeck_data.id,
            displayTbName: this.tempTable.displayTbName,
            dbName: this.tempTable.displayTbName,
            tbName: this.tempTable.displayTbName,
            folderUuid: this.forderId,//目录id
            //资产认权人
            personLiables: this.relationForm.personLiables,
            tableRelationQuery: {
              tableDataSource: this.relationForm.tableDataSource, //数据源
              businessSystemId: this.relationForm.businessSystemId, //所属系统主键
              tableCode: this.relationForm.tableCode, //资源编码
              tableLayeredId: this.relationForm.tableLayeredId, //资产分层主键
              tableRemarks: this.relationForm.tableRemarks, //资产备注
              tableThemeId: this.relationForm.tableThemeId, //资产主题主键
              tableType: this.relationForm.tableType, //资产类型
              isSpike: this.relationForm.isSpike, //是否增量
              isSentFile: this.relationForm.isSentFile, //是否推送文件
              fileName: this.relationForm.fileName //文件名称
            },
      };


      addTable(tableMeta)
        .then((res) => {
          if (res.data.status === "500") {
            this.$notify({
              title: "失败",
              message: res.data.msg,
              type: "error",
              duration: 2000,
              position: "bottom-right",
            });
          } else {
            this.$notify({
              title: "成功",
              message: "新建表成功！",
              type: "success",
              duration: 2000,
              position: "bottom-right",
            });
            var childData = {
              id: res.data.successTable.tableMetaUuid,
              label: res.data.successTable.displayTbName,
              pid: res.data.successTable.folderUuid,
              type: "table",
              extMap: {
                accessType: ["FETCH_TABLE_DATA", "BASIC_PRIV"],
                createTime: res.data.successTable.createTime,
                displayTbName: res.data.successTable.displayTbName,
                tableName: res.data.successTable.displayTbName,
                tbSizeByte: 0,
                tblType: "T",
              },
            };
            // 添加节点
            this.$emit("table-show", this.show);
            this.$emit("append-node", childData, this.clickNode);
            this.$emit("saveTableInfoHelp");
            this.$emit("refresh", this.clickId);
          }
        })
        .catch((result) => {});
    },
    updateTable() {
      for (let index = 0; index < this.temp.length; index++) {
        //先判空
        let obj = this.temp[index]
        var a =this.judegeTable(obj.colName)
        if(this.CommonUtil.isBlank(obj.colName)){
          this.$message.error("请完善建表信息，字段名称不能为空");
          return
        }else if(this.CommonUtil.isBlank(obj.dataType)){
          this.$message.error("请完善建表信息，数据类型不能为空");
          return
        } if (!a){
          this.$message.error("请完善建表信息，字段名称不能有特殊符号");
          return
        }
        //再判合法
        if (!this.isValidColumn(obj)) {
          return;
        }
      }
      const newTableObj = {};
      newTableObj.tableMetaUuid = this.tableId;
      newTableObj.colMetas = this.temp;
      newTableObj.displayTbName = this.tempTable.displayTbName;
      newTableObj.tbComment = this.tempTable.tbComment;
      // const oldTableObj = {};
      // oldTableObj.tableMetaUuid = this.tableId;
      // oldTableObj.colMetas = this.tempColumn;
      // oldTableObj.displayTbName = this.oldName;
      // oldTableObj.tbComment = this.tempTable.tbComment;
      // var obj = {};
      for (let i = 0; i < newTableObj.colMetas.length; i++) {

        newTableObj.colMetas[i].dataLength = null;
        newTableObj.colMetas[i].colPrecision = null;
        if (this.CommonUtil.isBlank(newTableObj.colMetas[i].colName) || this.CommonUtil.isBlank(newTableObj.colMetas[i].dataType)) {
          this.$message.error("请完善数据信息!");
          return;
        }
        if (!this.isValidColumn(newTableObj.colMetas[i])) {
          return;
        }
      }
      // obj.newTableObj = newTableObj;
      // obj.oldTableObj = oldTableObj;

      // updateTable(obj)
      updateTable(newTableObj)
        .then((res) => {
          if (res.data.status === "500") {
            this.$message({
              type: "info",
              message: "修改失败！" + res.data.msg,
            });
          } else {
            // 修改成功后重新给页面赋值
            this.oldName = res.data.sussessTable.displayTbName;
            this.tempTable.displayTbName = res.data.sussessTable.displayTbName;
            res.data.sussessTable.colMetas.forEach((e) => {
              this.tempIndex = 0;
              this.tempIndex++;
              e.tempIndex = this.tempIndex;
            });
            this.tempColumn = res.data.sussessTable.colMetas.slice();
            this.temp = JSON.parse(
              JSON.stringify(res.data.sussessTable.colMetas)
            );
            this.$notify({
              title: "成功",
              message: "修改表结构成功",
              type: "success",
              duration: 2000,
              position: "bottom-right",
            });
          }
          this.$emit("table-show", this.show);
          this.$emit("saveTableInfoHelp");
          this.$emit("refresh", this.clickId);
        })
        .catch((result) => {
          console.error(result)
        });
      // var newColumn = this.arrRemoveMix(this.temp, this.tempColumn)
      // var oldColumn = this.arrRemoveMix(this.tempColumn, this.temp)
      // console.log(newColumn)
      // console.log(oldColumn)
      // // 修改字段类型sql
      // var modify = ''
      // // 新增字段sql
      // var add = ''
      // // 重命名字段sql
      // var alter = ''
      // // 删除字段sql
      // var drop = ''
      // // eslint-disable-next-line no-unused-vars
      // var sql = 'ALTER TABLE "' + this.tableObj.tbName + '" ' + '\n'
      // for (let index = 0; index < newColumn.length; index++) {
      //   const r = newColumn[index]
      //   if (typeof r.colMetaUuid === 'undefined') {
      //     if (r.isNullable === 0) {
      //       r.isNullable = 'NULL'
      //     } else {
      //       r.isNullable = 'NOT NULL'
      //     }
      //     if (r.dataLength !== '') {
      //       r.dataType = r.dataType + '(' + r.dataLength + ') '
      //     }
      //     add = add + 'ADD ( "' + r.colName + '" ' + r.dataType + ' ' + r.isNullable + ' ) ' + '\n'
      //   } else {
      //     var oldCol = oldColumn.filter(obj => { return obj.colMetaUuid === r.colMetaUuid })
      //     var reNameArr = oldColumn.filter(obj => { return obj.colName === r.colName })
      //     if (r.isNullable === 0) {
      //       r.isNullable = 'NULL'
      //     } else {
      //       r.isNullable = ' '
      //     }
      //     if (r.dataLength !== '') {
      //       r.dataType = r.dataType + '(' + r.dataLength + ') '
      //     }
      //     // 如果初始表列id在最终保存修改中找不到,说明该列已经重命名
      //     if (reNameArr.length === 0) {
      //       alter = alter + 'ALTER TABLE "' + this.tableObj.tbName + '" RENAME COLUMN"' + oldCol[0].colName + '" TO "' + r.colName + '"' + '\n'
      //       modify = modify + 'MODIFY ( "' + oldCol[0].colName + '" ' + r.dataType + ' ' + r.isNullable + ' ) ' + '\n'
      //     } else {
      //       modify = modify + 'MODIFY ( "' + r.colName + '" ' + r.dataType + ' ' + r.isNullable + ' ) ' + '\n'
      //     }
      //   }
      // }

      // for (let index = 0; index < oldColumn.length; index++) {
      //   const r = oldColumn[index]
      //   if (typeof r.colMetaUuid !== 'undefined') {
      //     var dropArr = newColumn.filter(obj => { return obj.colMetaUuid === r.colMetaUuid })
      //     // 如果初始表列id在最终保存修改中找不到,说明该列已经被删除
      //     if (dropArr.length === 0) {
      //       drop = drop + 'ALTER TABLE "' + this.tableObj.tbName + '" DROP("' + r.colName + '")' + '\n'
      //     }
      //   }
      // }
      // if (modify + add === '') {
      //   sql = drop + '\n' + alter
      // } else {
      //   sql = sql + modify + add + drop + '\n' + alter
      // }
      // const addObj = {}
      // addObj.sql = sql
      // addObj.tbName = this.tempTable.tableName
      // updateTable(addObj).then((res) => {
      //   this.$notify({
      //     title: '成功',
      //     message: '新建表成功',
      //     type: 'success',
      //     duration: 2000,
      //     position: 'bottom-right'
      //   })
      // }).catch((result) => {
      // })
    },
    // arrRemoveMix(arr1, arr2) {
    //   return this.filterData(this.arrayDifference(arr1, arr2))
    // },
    // arrayDifference(a, b) { // 差集 a - b
    //   const clone = a.slice(0) // clone = a
    //   for (let i = 0; i < b.length; i++) {
    //     const temp = b[i]
    //     for (var j = 0; j < clone.length; j++) {
    //       // eslint-disable-next-line eqeqeq
    //       if (this.isObjectValueEqual(temp, clone[j])) {
    //         clone.splice(j, 1) // remove clone[j]
    //       }
    //     }
    //   }
    //   return clone
    // },
    // filterData(array) { // 去重
    //   return Array.from(new Set(array))
    // },
    // 判断两个对象的值是否都相同
    // isObjectValueEqual(a, b) {
    //   // 取对象a和b的属性名
    //   var aProps = Object.getOwnPropertyNames(a)
    //   var bProps = Object.getOwnPropertyNames(b)
    //   // 判断属性名的length是否一致
    //   if (aProps.length !== bProps.length) {
    //     return false
    //   }
    //   // 循环取出属性名，再判断属性值是否一致
    //   for (var i = 0; i < aProps.length; i++) {
    //     var propName = aProps[i]
    //     if (propName !== '__ob__') {
    //       if (a[propName] !== b[propName]) {
    //         return false
    //       }
    //     }
    //   }
    //   return true
    // }
  },
};
</script>
