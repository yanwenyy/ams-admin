<template>
    <div style="width: 100%;">
        <el-row style="padding-top: 10px;">
            <el-col align="right">
                <el-button type="primary" v-show="nodeData != null && nodeData.nodeInfo.optType !== 'union' && nodeData.nodeInfo.optType !== 'delRepeat'" class="oper-btn customfield btn-width-max" @click="customizeColumn('1')" title="自定义字段" style="line-height: normal;"/>
                <el-button type="primary" class="oper-btn help" @click="helpDialogVisible = true" title="说明" style="line-height: normal;"/>
            </el-col>
        </el-row>
        <!-- 图形化展示 -->
        <el-table :data="items" border style="width: 100%;" height="526" ref="outPutTable">
            <el-table-column type="index" label="编号" width="60" align="center" :resizable="false"/>
            <el-table-column label="上一节点名称" width="200" :show-overflow-tooltip="true" prop="rtn" header-align="center" :resizable="false"></el-table-column>
            <el-table-column label="字段名称" width="260" :show-overflow-tooltip="true" header-align="center"  :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.columnInfo.columnName}}
                </template>
            </el-table-column>
            <el-table-column label="输出字段名称" width="240" header-align="center" :resizable="false">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.disColumnName"></el-input>
                </template>
            </el-table-column>
            <el-table-column align="center" width="100" :resizable="false">
                <template slot="header" slot-scope="scope">
                    输出字段<el-checkbox v-model="checkAll" :disabled="isAllDisabled" @change="handleCheckAllChange" style="padding-left: 5px;"/>
                </template>
                <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.checked" :disabled="isDisabled" @change="checkBoxChange" />
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="100" :resizable="false">
                <template slot-scope="scope">
                    <el-button type="primary" class="oper-btn setting" @click="customizeColumn('2',scope.row)" title="设置" style="line-height: normal;"/>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="helpDialogVisible" :append-to-body="true" title="说明" width="400px">
            <div style="height: 260px;padding: 10px;">
                <p style="text-indent: 2em">（1）如果修改了【输出字段名称】且存在已配置过或执行过的后续节点，则后续节点关于该字段的配置信息会失效</p>
                <p style="text-indent: 2em">（2）如果继续使用后续节点，则需重新配置和执行相关节点</p>
                <p style="text-indent: 2em">（3）如果修改了【输出字段名称】后并执行了当前节点，则后续节点的执行结果会发生变化</p>
                <p style="text-indent: 2em">（4）支持通过拖拽更改输出字段的顺序，同时在结果集中同步展示</p>
            </div>
        </el-dialog>
        <el-dialog v-if="customizeColumnDialogVisible" :visible.sync="customizeColumnDialogVisible" :title="customizeColumnTitle" :close-on-press-escape="false" :close-on-click-modal="false" :append-to-body="true" width="1000px">
            <CustomizeColumn ref="customizeColumn" :columnInfoArr="columnsInfoArray" :node-is-set="nodeIsSet" :cur-column-info="curColumnInfo" node-type="common"/>
            <div slot="footer" class="dialog-footer">
                <el-button @click="customizeColumnDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="customizeColumnBack()">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import CustomizeColumn from '@/views/graphtool/tooldic/page/nodeSetting/customizeColumn'
    export default {
        name: 'OutputColumnSetting',
        components:{ CustomizeColumn },
        data() {
            return {
                nodeData: null,
                columnsInfoPre: this.$parent.$parent.$parent.columnsInfoPre,
                items: [],
                isIndeterminate: true,
                checkAll: false,
                isAllDisabled: false,
                isDisabled: false,
                helpDialogVisible:false,
                customizeColumnDialogVisible:false,
                curColumnInfo:null,
                customizeColumnType:'',
                customizeColumnTitle:'',
                columnsInfoArray:[],
                nodeIsSet:false
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            init() {
                const graph = this.$parent.$parent.$parent.graph
                this.nodeData = graph.nodeData[graph.curCell.id]
                this.nodeIsSet = this.nodeData.isSet// 判断当前节点是否已经设置
                this.columnsInfoArray = this.nodeIsSet ? this.nodeData.columnsInfo : this.columnsInfoPre
                this.initConfig()
            },
            initConfig() { // 初始化字段列表
                this.createTrFacture()
                var num = 0
                for (let i = 0; i < this.items.length; i++) {
                    if (!this.items[i].checked) {
                        this.checkAll = false
                        num++
                        break
                    }
                }
                if (num === 0) {
                    this.checkAll = true
                }
                if (this.nodeData.nodeInfo.optType === 'delRepeat' || this.nodeData.nodeInfo.optType === 'union') {				// 分组汇总和数据去重节点的输出字段单独处理，置为不可编辑
                    this.isAllDisabled = true
                    this.isDisabled = true
                }
            },
            /**
             * 重置输出列的勾选状态（只适用于数据融合、数据去重节点）
             */
            re_checkbox(data, hasMoreTable) {
                var num = 0
                for (let i = 0; i < this.items.length; i++) {
                    this.items[i].checked = false
                }
                for (let j = 0; j < this.items.length; j++) {
                    var nodeId = this.items[j].nodeId
                    var nullNodeId = this.items[j].nullNodeId
                    if (data && data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            if(hasMoreTable){//数据融合节点
                                if (data[i].value === this.items[j].disColumnName && data[i].nodeId === nodeId && data[i].nullNodeId === nullNodeId) {
                                    this.items[j].checked = true
                                    num++
                                    break
                                }
                            }else{//数据去重节点
                                if (data[i] === this.items[j].curColumnName) {
                                    this.items[j].checked = true
                                    num++
                                    break
                                }
                            }
                        }
                    }
                }
                if (num === this.items.length) {
                    this.checkAll = true
                } else {
                    if (this.checkAll) {
                        this.checkAll = false
                    }
                }
            },
            createTrFacture() {
                for (let i = 0; i < this.columnsInfoArray.length; i++) {
                    const curColumnName = this.nodeIsSet ? this.columnsInfoArray[i].columnName : this.columnsInfoArray[i].newColumnName
                    let nodeId = this.columnsInfoArray[i].nodeId
                    let nullNodeId = this.columnsInfoArray[i].nullNodeId
                    let resourceTableName = this.columnsInfoArray[i].resourceTableName
                    let columnInfo = this.columnsInfoArray[i]
                    let rtn = this.columnsInfoArray[i].rtn
                    let checked = false
                    const id = i
                    let disColumnName = this.columnsInfoArray[i].newColumnName
                    if (this.nodeIsSet) {
                        if(this.columnsInfoArray[i].isOutputColumn === 1){
                            checked = true
                        }
                    }
                    this.items.push({ id, curColumnName, nodeId, nullNodeId, columnInfo, rtn, disColumnName, checked, resourceTableName})
                }
                this.$nextTick( () => {
                    $(this.$refs.outPutTable.$refs.bodyWrapper.children[0].children[1]).sortable().disableSelection()
                })
            },
            get_column() { // 这里保存的是上级节点所有的字段，包括输出字段，（意义：不输出的字段不代表不是该节点的字段，在获取上级节点字段应该进一步筛选师傅是输出字段）
                let $this = this
                const this_columnInfos = []
                let trDom = this.$refs.outPutTable.$refs.bodyWrapper.children[0].children[1].children
                if(typeof trDom !== 'undefined' && trDom.length > 0){
                    $.each(trDom,function () {
                        const index = parseInt($(this).find("td:eq(0)>div>div").html()) - 1
                        var checked = $this.items[index].checked
                        var this_column = {...{},...$this.items[index].columnInfo}
                        var old_colum_name = $this.items[index].columnInfo.columnName// 之前的newColumnName
                        if (checked) {
                            this_column.isOutputColumn = 1
                        } else {
                            this_column.isOutputColumn = 0
                        }
                        this_column.newColumnName = $this.items[index].disColumnName
                        this_column.columnName = old_colum_name
                        this_column.rtn = $this.items[index].rtn
                        this_column.nodeId = $this.items[index].nodeId
                        this_columnInfos.push(this_column)
                    })
                }
                this.nodeData.columnsInfo = this_columnInfos
            },
            handleCheckAllChange(checked) {
                Array.from(this.items, (n) => n.checked = checked)
            },
            checkBoxChange() {
                var chk = 0
                for (let i = 0; i < this.items.length; i++) {
                    if (this.items[i].checked) {
                        chk++
                    }
                }
                if (this.items.length === chk) { // 全选
                    this.checkAll = true
                } else { // 不全选
                    this.checkAll = false
                }
            },
            vilidata_simple() {
                const checkedIndex = this.items.findIndex(n => n.checked === true)
                if (checkedIndex < 0) {
                    this.$message({ type: 'warning', message: '请选择输出字段' })
                    return false
                }
                const vili_column = []
                let verify = true
                let message = ''
                for (let i = 0; i < this.items.length; i++) {
                    if (this.items[i].checked) {
                        let disColumnName = this.items[i].disColumnName
                        // 避免出现 ""gender"_计数" 情况导致语法错误的问题
                        let newColumnName = disColumnName.replaceAll("\"", "");
                        disColumnName = "\"" + newColumnName + "\"";
                        this.items[i].disColumnName = disColumnName;
                        if($.trim(disColumnName) === ""){
                            verify = false
                            message = `第${i + 1}行的输出字段的内容不能为空值，请修改`
                            break;
                        }
                        if(getStrBytes(disColumnName) > 30){
                            verify = false
                            message = `第${i + 1}行的输出字段超过30个字符的长度限制，请修改`
                            break;
                        }
                        if(!verifyReg(disColumnName)){
                            verify = false
                            message = `第${i + 1}行的输出字段中含有特殊字符或以数字开头，请修改`
                            break;
                        }
                        const curIndex = vili_column.findIndex(item => item.disColumnName === disColumnName)
                        if (curIndex > -1 && vili_column[curIndex].checked) {
                            verify = false
                            message = `第${curIndex + 1}行与第${i + 1}行的输出字段重复，请修改`
                            break;
                        }
                    }
                    vili_column.push({"checked":this.items[i].checked,"disColumnName":this.items[i].disColumnName})
                }
                if (!verify) {
                    this.$message({ type: 'warning', message: message })
                }
                return verify
            },
            outputVerify() {
                return this.vilidata_simple()
            },
            /**
             * 自定义列/设置
             * @param type 打开方式（1、自定义字段，2、设置）
             * @param curColumnInfo 当前字段的信息
             */
            customizeColumn(type,curColumnInfo){
                this.customizeColumnType = type
                if(type === "1"){//自定义字段
                    this.customizeColumnTitle = '自定义字段'
                    this.curColumnInfo = null
                }else{//修改设置
                    if (this.nodeData.nodeInfo.optType === 'delRepeat' || this.nodeData.nodeInfo.optType === 'union') {// 分组汇总和数据去重节点的输出字段单独处理
                        if(curColumnInfo.nodeId !== 'customizeColumn'){
                            this.$message({'type':'warning','message':'当前字段信息不可被修改'})
                            return
                        }
                    }
                    this.customizeColumnTitle = '修改设置'
                    this.curColumnInfo = curColumnInfo
                }
                this.customizeColumnDialogVisible = true
            },
            customizeColumnBack(){
                let returnObj = this.$refs.customizeColumn.saveInfo()
                if(!returnObj.isError){
                    this.customizeColumnDialogVisible = false
                    const curColumnName = returnObj.columnInfo.columnName
                    let nodeId = ''
                    let nullNodeId = ''
                    let resourceTableName = ''
                    let columnInfo = returnObj.columnInfo
                    let rtn = ''
                    let checked = true
                    let id = null
                    let disColumnName = returnObj.columnInfo.newColumnName
                    if(this.customizeColumnType === "1"){//自定义字段
                        id = this.items.length + 1
                        rtn = '自定义字段'
                        nodeId = 'customizeColumn'
                        nullNodeId = 'customizeColumn'
                        resourceTableName = 'customizeColumnTempTable'
                        this.items.push({ id, curColumnName, nodeId, nullNodeId, columnInfo, rtn, disColumnName, checked, resourceTableName,selectColumnName:curColumnName})
                    }else{//修改设置
                        id = this.curColumnInfo.id
                        nodeId = this.curColumnInfo.nodeId
                        nullNodeId = this.curColumnInfo.nullNodeId
                        rtn = this.curColumnInfo.rtn
                        resourceTableName = this.curColumnInfo.resourceTableName
                        let index = this.items.findIndex( item => item.id === this.curColumnInfo.id)
                        if(index > -1){
                            this.items.splice(index,1,{id, curColumnName, nodeId, nullNodeId, columnInfo, rtn, disColumnName, checked, resourceTableName,selectColumnName:curColumnName})
                        }
                    }
                }
            }
        }
    }
</script>
<style scoped type="text/css">
    >>> .el-table .cell {
        padding: 0 !important;
    }
</style>
