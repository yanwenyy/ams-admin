(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-156fe6ed"],{"40b2":function(e,t,i){"use strict";i.d(t,"a",(function(){return a})),i.d(t,"b",(function(){return o}));var a=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("el-container",[i("el-main",[i("el-form",[i("el-form-item",{attrs:{label:"指标名称"}},[i("el-input",{attrs:{id:"inName"},model:{value:e.form.inName,callback:function(t){e.$set(e.form,"inName",t)},expression:"form.inName"}})],1),i("el-form-item",{attrs:{label:"来源表"}},[i("el-input",{attrs:{id:"tableName",readonly:"readonly"},model:{value:e.form.tableName,callback:function(t){e.$set(e.form,"tableName",t)},expression:"form.tableName"}})],1),i("el-form-item",{attrs:{label:"指标列"}},[i("el-input",{attrs:{id:"colName",readonly:"readonly"},model:{value:e.form.colName,callback:function(t){e.$set(e.form,"colName",t)},expression:"form.colName"}})],1),i("el-row",[i("el-col",{attrs:{span:12}},[i("el-form-item",{attrs:{label:"聚合方式"}},[i("el-select",{staticStyle:{width:"100%"},attrs:{id:"group",readonly:"readonly"},model:{value:e.form.group,callback:function(t){e.$set(e.form,"group",t)},expression:"form.group"}},[i("el-option",{attrs:{value:"sum",label:"总计"}}),i("el-option",{attrs:{value:"count",label:"计数"}}),i("el-option",{attrs:{value:"avg",label:"平均值"}}),i("el-option",{attrs:{value:"max",label:"最大值"}}),i("el-option",{attrs:{value:"min",label:"最小值"}}),i("el-option",{attrs:{value:"distinct",label:"差异计数"}})],1)],1)],1),i("el-col",{attrs:{span:12}},[i("el-form-item",{staticStyle:{"margin-left":"15px"},attrs:{label:"所属分类"}},[i("el-select",{ref:"folderName",staticStyle:{width:"100%"},attrs:{placeholder:"请选择所属分类"},model:{value:e.form.folderName,callback:function(t){e.$set(e.form,"folderName",t)},expression:"form.folderName"}},[i("el-option",{staticStyle:{width:"100%",height:"200px",overflow:"auto","background-color":"#fff"},attrs:{value:e.form.folderName,label:e.form.folderName}},[i("publictree",{attrs:{setFolderIdAndName:e.setFolderIdAndName,type:2}})],1)],1)],1)],1)],1),i("el-form-item",{attrs:{label:"指标说明"}},[i("el-input",{attrs:{type:"textarea",id:"inMemo"},model:{value:e.form.inMemo,callback:function(t){e.$set(e.form,"inMemo",t)},expression:"form.inMemo"}})],1)],1)],1),i("el-footer",[i("div",{staticStyle:{float:"right"}},[i("el-button",{attrs:{type:"primary"},on:{click:e.saveIndicatrix}},[e._v("保存")]),i("el-button",{attrs:{type:"primary"},on:{click:e.closeDialog}},[e._v("取消")])],1)])],1)},o=[]},5001:function(e,t,i){"use strict";var a=i("4ea4");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;a(i("b775"));var o=a(i("1157")),s=(i("5c96"),{name:"addIndicatrix",props:["tableId","tableName","columnId","columnName","inUUID"],components:{publictree:function(e){return i.e("chunk-48ddfab7").then(function(){var t=[i("b25b")];e.apply(null,t)}.bind(this)).catch(i.oe)}},data:function(){return{form:{inName:"",tableName:"",colName:"",folderName:"",group:"",inMemo:""},editData:null,clickTreeId:"",treePath:"",verButton:"",auditorOrauditorgan:0,pbScopeUuid:""}},mounted:function(){},created:function(){this.clearData(),this.initData()},methods:{initData:function(){null==this.inUUID?(this.form.tableName=this.tableName,this.form.colName=this.columnName):this.antiDisplayIndicatrixData(this.inUUID)},saveIndicatrix:function(){null==this.inUUID?this.addIn():this.editIn()},antiDisplayIndicatrixData:function(e){var t=this,i=this.contextUrl+"/InMeasure/getInMeasure";o.default.post(i,{inMeasureUuid:e},(function(e){t.editData=e,t.pbScopeUuid=t.editData.pbScopeUuid,t.treePath=t.editData.measurePath,t.form.inName=e.measureName,t.form.tableName=e.tableName,t.form.colName=e.columnName,t.form.group=e.measureGroup,t.form.folderName=e.folderName,t.form.inMemo=e.measureMemo}),"json")},addIn:function(){var e=this;if(""!==this.form.inName&&null!==this.form.inName&&void 0!==this.form.inName)if(this.form.inName.length>50)this.$message("指标名称不能大于50个字符！");else if(this.form.inMemo.length>2e3)this.$message("指标描述不能大于2000个字符！");else if(""!==this.form.group)if(1!==this.verButton&&2!==this.verButton&&3!==this.verButton)if(""!==this.clickTreeId&&null!=this.clickTreeId&&void 0!==this.clickTreeId){var t={inMeasureUuid:"",measureName:this.form.inName,measureType:1,inFolderUuid:this.clickTreeId,measureMemo:this.form.inMemo,measureGroup:this.form.group,measureFormula:"",tableUuid:this.tableId,isDelete:0,createTime:"",updateTime:"",createPersonUuid:"",createPersonName:"",measurePath:this.treePath,measureAlias:this.form.inName,belongOrg:"",belongType:this.auditorOrauditorgan,pbScopeUuid:this.pbScopeUuid,inFilterShow:JSON.stringify(this.form.inFilterShowObj)},i={inColumnrelationUuid:"",inMeasureUuid:"",columnUuid:this.columnId},a=this.contextUrl+"/InMeasure/verMeasureName";o.default.post(a,{measureName:this.form.inName,pbScopeUuid:this.pbScopeUuid},(function(a){if(0!=a.state)if(0!=a.state){var s=e.contextUrl+"/InMeasure/insertSelective";o.default.post(s,{inMeasure:JSON.stringify(t),inColumnRelation:JSON.stringify(i)},(function(t){1==t.state?(e.$emit("getAllColumn",e.tableId),e.$emit("addInTable",e.tableId),e.$emit("getAllIndicatrix",e.tableId),e.closeDialog()):e.$message(t.message)}),"json")}else this.$message(a.message);else this.$message(a.message)}),"json")}else this.$message("请选择文件夹！");else this.$message("根目录下不允许创建指标。");else this.$message("请选择聚合方式！");else this.$message("请输入指标名称。")},editIn:function(){var e=this;if(""!=this.form.inName&&null!=this.form.inName&&void 0!=this.form.inName)if(this.form.inName.length>50)this.$message("指标名称不能大于50个字符！");else if(void 0!=this.form.inMemo&&this.form.inMemo.length>2e3)this.$message("指标描述不能大于2000个字符！");else if(this.editData.measureName!=this.form.inName){var t=this.contextUrl+"/InMeasure/verMeasureName";o.default.post(t,{measureName:this.form.inName,pbScopeUuid:this.pbScopeUuid},(function(t){1==t.state?e.update():e.$message(t.message)}),"json")}else e.update();else this.$message("请输入指标名称。")},update:function(){var e=this;this.editData.measureName=this.form.inName,this.editData.measureMemo=this.form.inMemo,this.editData.measureAlias=this.form.inName,this.editData.measureGroup=this.form.group,this.editData.inFilterShow=JSON.stringify(this.form.inFilterShowObj),this.editData.measurePath=this.treePath,""!=this.clickTreeId&&(this.editData.inFolderUuid=this.clickTreeId),""!=this.pbScopeUuid&&(this.editData.pbScopeUuid=this.pbScopeUuid),this.editData.belongType=this.auditorOrauditorgan;var t=this.contextUrl+"/InMeasure/updateByPrimaryKeySelective";o.default.post(t,{inMeasure:JSON.stringify(this.editData)},(function(t){1==t.state?(e.$emit("getAllIndicatrix",e.tableId),e.$emit("getAllColumn",e.tableId),e.closeDialog()):e.$message(t.message)}),"json")},closeDialog:function(){this.$emit("closeAddIndicatrix")},setFolderIdAndName:function(e,t,i,a,o){this.form.folderName=t,this.clickTreeId=e,this.pbScopeUuid=o,this.treePath=i},clearData:function(){this.form={inName:"",tableName:"",colName:"",folderName:"",group:"",inMemo:""},this.queryRules={},this.editData=null}}});t.default=s},cfce:function(e,t,i){"use strict";i.r(t);var a=i("40b2"),o=i("f26c");for(var s in o)["default"].indexOf(s)<0&&function(e){i.d(t,e,(function(){return o[e]}))}(s);var r=i("0c7c"),l=Object(r["a"])(o["default"],a["a"],a["b"],!1,null,null,null);t["default"]=l.exports},f26c:function(e,t,i){"use strict";i.r(t);var a=i("5001"),o=i.n(a);for(var s in a)["default"].indexOf(s)<0&&function(e){i.d(t,e,(function(){return a[e]}))}(s);t["default"]=o.a}}]);