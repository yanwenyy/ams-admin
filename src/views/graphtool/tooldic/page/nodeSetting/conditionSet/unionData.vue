<template>
    <div style="height: 560px;padding: 30px 0 0 15px;">
        <el-row>
            <p style="color:red">注：两张表所勾选融合字段的含义和顺序需保持一致，均可通过拖动行改变字段的的顺序</p>
        </el-row>
        <div class="div_table">
            <el-row style="padding: 10px 5px;">
                <el-col :span="20" v-if="!isLeftTip" ref="leftTableCol" style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">
                    <label>{{leftTableName}}</label>
                </el-col>
                <el-col :span="20" v-if="isLeftTip" ref="leftTableCol" style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">
                    <el-tooltip class="item" effect="dark" :content="leftTableName" placement="top">
                        <label>{{leftTableName}}</label>
                    </el-tooltip>
                </el-col>
                <el-col :span="4">
                    <el-checkbox v-model="leftMainTableChecked" @change="leftMainTableChange">主表</el-checkbox>
                </el-col>
            </el-row>
            <el-table :data="leftTableColArr" fit style="width: 100%;" height="435" ref="leftElTable">
                <el-table-column align="center" width="60" :resizable="false">
                    <template slot="header" slot-scope="scope">
                        <el-checkbox v-model="leftSelectAll" @change="leftSelectAllChange"></el-checkbox>
                    </template>
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.checked" @change="leftColumnChange"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="编号" width="60" align="center" :resizable="false"/>
                <el-table-column header-align="center" label="融合字段" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.colName}}
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div style="width: 130px;margin-top: 230px;float: left;">
            <el-select v-model="conn_type" @change="setConnType">
                <el-option v-for="connTypeObj in connTypeArr" :value="connTypeObj.value" :label="connTypeObj.name">{{connTypeObj.name}}</el-option>
            </el-select>
        </div>
        <div class="div_table">
            <el-row style="padding: 10px 5px;">
                <el-col :span="20" v-if="!isRightTip" ref="rightTableCol" style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">
                    <label>{{rightTableName}}</label>
                </el-col>
                <el-col :span="20" v-if="isRightTip" ref="rightTableCol" style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">
                    <el-tooltip class="item" effect="dark" :content="rightTableName" placement="top">
                        <label>{{rightTableName}}</label>
                    </el-tooltip>
                </el-col>
                <el-col :span="4">
                    <el-checkbox v-model="rightMainTableChecked" @change="rightMainTableChange">主表</el-checkbox>
                </el-col>
            </el-row>
            <el-table :data="rightTableColArr" fit style="width: 100%;" height="435" ref="rightElTable">
                <el-table-column align="center" width="60" :resizable="false">
                    <template slot="header" slot-scope="scope">
                        <el-checkbox v-model="rightSelectAll" @change="rightSelectAllChange"></el-checkbox>
                    </template>
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.checked" @change="rightColumnChange"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="编号" width="60" align="center" :resizable="false"/>
                <el-table-column header-align="center" label="融合字段" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.colName}}
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'unionDataSet',
        data(){
            return{
                nodeData:null,
                leftMainTableChecked: true,
                rightMainTableChecked: false,
                leftSelectAll: false,
                rightSelectAll: false,
                leftTableColArr: [],
                rightTableColArr: [],
                leftTableNodeId: '',
                rightTableNodeId: '',
                leftTablePreNodeId: '',
                rightTablePreNodeId: '',
                conn_type:'union',
                connTypeArr:[{value:"union",name:"合并"},{value:"intersect",name:"交集"},{value:"exclude",name:"补集"}],
                leftTableName:'',
                rightTableName:'',
                isLeftTip:false,
                isRightTip:false
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            init(){
                let graph = this.$parent.$parent.$parent.graph
                this.nodeData = graph.nodeData[graph.curCell.id]
                let parentIds = this.nodeData.parentIds
                let isSet = this.nodeData.isSet
                if (isSet) {
                    var setting = this.nodeData.setting
                    this.conn_type = setting.conn_type
                    var left_data = setting.left_data
                    var right_data = setting.right_data
                    var mainType = ''// 默认主表
                    this.leftTableNodeId = left_data.nodeId
                    this.leftTablePreNodeId = left_data.preNodeId
                    this.leftTableName = left_data.nodeName
                    this.rightTableNodeId = right_data.nodeId
                    this.rightTablePreNodeId = right_data.preNodeId
                    this.rightTableName = right_data.nodeName
                    if (left_data.mainTable) {
                        mainType = 'left'
                        this.leftMainTableChecked = true
                        this.rightMainTableChecked = false
                    }
                    if (right_data.mainTable) {
                        mainType = 'right'
                        this.leftMainTableChecked = false
                        this.rightMainTableChecked = true
                    }
                    if (left_data.selectAll) {
                        this.leftSelectAll = true
                    }
                    if (right_data.selectAll) {
                        this.rightSelectAll = true
                    }
                    let colArr = [];
                    $(left_data.columnSetArr).each(function(i, v) {
                        let id = v.id
                        let colName = v.name
                        let checked = v.checked
                        let num = i
                        colArr.push({id,colName,checked,num})
                    })
                    if (colArr.length !== 0) {
                        this.leftTableColArr = [...colArr];
                    }
                    colArr = [];
                    $(right_data.columnSetArr).each(function(i, v) {
                        let id = v.id
                        let colName = v.name
                        let checked = v.checked
                        let num = i
                        colArr.push({id,colName,checked,num})
                    })
                    if (colArr.length !== 0) {
                        this.rightTableColArr = [...colArr];
                    }
                    // 反显输出列
                    let data = []
                    if(mainType === "left"){
                        for(let i=0;i <this.leftTableColArr.length; i++){
                            if(this.leftTableColArr[i].checked){
                                data.push({
                                    'nodeId': this.leftTablePreNodeId,
                                    'value': this.leftTableColArr[i].colName,
                                    'nullNodeId': this.leftTableNodeId
                                })
                            }
                        }
                    }else{
                        for(let i=0;i <this.rightTableColArr.length; i++){
                            if(this.rightTableColArr[i].checked){
                                data.push({
                                    'nodeId': this.rightTablePreNodeId,
                                    'value': this.rightTableColArr[i].colName,
                                    'nullNodeId': this.rightTableNodeId
                                })
                            }
                        }
                    }
                    this.$parent.$parent.$parent.$refs.outputColumnVueRef.$nextTick( () => {
                        this.$parent.$parent.$parent.$refs.outputColumnVueRef.re_checkbox(data, true)
                    })
                } else {
                    if (parentIds && parentIds.length > 0) {
                        for(let i=0; i<parentIds.length; i++){
                            let per_node = graph.nodeData[parentIds[i]]
                            let columnsInfo = per_node.columnsInfo
                            let tableName = per_node.nodeInfo.nodeName
                            let nodeId = per_node.nodeInfo.nodeId
                            let preNodeId = per_node.nodeInfo.nodeId
                            // 如果前置节点为结果表且该结果表未配置
                            if (per_node && per_node.nodeInfo.optType === 'newNullNode' && !per_node.isSet) {
                                let per_node_parentIds = per_node.parentIds
                                if (per_node_parentIds && per_node_parentIds.length > 0) {
                                    columnsInfo = graph.nodeData[per_node_parentIds[0]].columnsInfo
                                    preNodeId = graph.nodeData[per_node_parentIds[0]].nodeInfo.nodeId
                                    tableName = graph.nodeData[per_node_parentIds[0]].nodeInfo.nodeName + "_" + tableName
                                }
                            }
                            let colArr = [];
                            let curNum = 0
                            $(columnsInfo).each(function(ind, val) {
                                if (val.isOutputColumn) {
                                    let id = ind;
                                    let colName = val.newColumnName;
                                    let checked = false
                                    let num = curNum
                                    colArr.push({id,colName,checked,num});
                                    curNum++
                                }
                            })
                            if (colArr.length !== 0) {
                                if (i === 0) {
                                    this.leftTableNodeId = nodeId
                                    this.leftTablePreNodeId = preNodeId
                                    this.leftTableName = tableName
                                    this.leftTableColArr = [...colArr]
                                } else {
                                    this.rightTableNodeId = nodeId
                                    this.rightTablePreNodeId = preNodeId
                                    this.rightTableName = tableName
                                    this.rightTableColArr = [...colArr]
                                }
                            }
                        }
                    }
                }
                this.$nextTick( () => {
                    $(this.$refs.leftElTable.$refs.bodyWrapper.children[0].children[1]).sortable().disableSelection()
                    $(this.$refs.rightElTable.$refs.bodyWrapper.children[0].children[1]).sortable().disableSelection()
                })
                this.$nextTick( () => {
                    let cWidth = this.$refs.leftTableCol.$el.clientWidth;
                    let sWidth = this.$refs.leftTableCol.$el.scrollWidth;
                    if (sWidth > cWidth) { //超过容器宽度
                        this.isLeftTip = true
                    }
                    cWidth = this.$refs.rightTableCol.$el.clientWidth;
                    sWidth = this.$refs.rightTableCol.$el.scrollWidth;
                    if (sWidth > cWidth) { //超过容器宽度
                        this.isRightTip = true
                    }
                })
            },
            leftColumnChange(){
                let chk = 0
                for(let i=0; i<this.leftTableColArr.length; i++){
                    if(this.leftTableColArr[i].checked){
                        chk++
                    }
                }
                if(chk === this.leftTableColArr.length){
                    this.leftSelectAll = true
                }else{
                    if(this.leftSelectAll){
                        this.leftSelectAll = false
                    }
                }
                if(this.leftMainTableChecked){
                    // 刷新输出字段信息
                    let data = []
                    for(let i=0;i <this.leftTableColArr.length; i++){
                        if(this.leftTableColArr[i].checked){
                            data.push({
                                'nodeId': this.leftTablePreNodeId,
                                'value': this.leftTableColArr[i].colName,
                                'nullNodeId': this.leftTableNodeId
                            })
                        }
                    }
                    this.$parent.$parent.$parent.$refs.outputColumnVueRef.re_checkbox(data, true)
                }
            },
            rightColumnChange(){
                let chk = 0
                for(let i=0; i<this.rightTableColArr.length; i++){
                    if(this.rightTableColArr[i].checked){
                        chk++
                    }
                }
                if(chk === this.rightTableColArr.length){
                    this.rightSelectAll = true
                }else{
                    if(this.rightSelectAll){
                        this.rightSelectAll = false
                    }
                }
                if(this.rightMainTableChecked){
                    // 刷新输出字段信息
                    let data = []
                    for(let i=0;i <this.rightTableColArr.length; i++){
                        if(this.rightTableColArr[i].checked){
                            data.push({
                                'nodeId': this.rightTablePreNodeId,
                                'value': this.rightTableColArr[i].colName,
                                'nullNodeId': this.rightTableNodeId
                            })
                        }
                    }
                    this.$parent.$parent.$parent.$refs.outputColumnVueRef.re_checkbox(data, true)
                }
            },
            leftMainTableChange(checked){
                let data = []
                if(checked){
                    this.rightMainTableChecked = false
                    for(let i=0;i <this.leftTableColArr.length; i++){
                        if(this.leftTableColArr[i].checked){
                            data.push({
                                'nodeId': this.leftTablePreNodeId,
                                'value': this.leftTableColArr[i].colName,
                                'nullNodeId': this.leftTableNodeId
                            })
                        }
                    }
                }else{
                    this.rightMainTableChecked = true
                    for(let i=0;i <this.rightTableColArr.length; i++){
                        if(this.rightTableColArr[i].checked){
                            data.push({
                                'nodeId': this.rightTablePreNodeId,
                                'value': this.rightTableColArr[i].colName,
                                'nullNodeId': this.rightTableNodeId
                            })
                        }
                    }
                }
                this.$parent.$parent.$parent.$refs.outputColumnVueRef.re_checkbox(data, true)
            },
            rightMainTableChange(checked){
                let data = []
                if(checked){
                    this.leftMainTableChecked = false
                    for(let i=0;i <this.rightTableColArr.length; i++){
                        if(this.rightTableColArr[i].checked){
                            data.push({
                                'nodeId': this.rightTablePreNodeId,
                                'value': this.rightTableColArr[i].colName,
                                'nullNodeId': this.rightTableNodeId
                            })
                        }
                    }
                }else{
                    this.leftMainTableChecked = true
                    for(let i=0;i <this.leftTableColArr.length; i++){
                        if(this.leftTableColArr[i].checked){
                            data.push({
                                'nodeId': this.leftTablePreNodeId,
                                'value': this.leftTableColArr[i].colName,
                                'nullNodeId': this.leftTableNodeId
                            })
                        }
                    }
                }
                this.$parent.$parent.$parent.$refs.outputColumnVueRef.re_checkbox(data, true)
            },
            leftSelectAllChange(checked){
                Array.from(this.leftTableColArr, (n) => n.checked = checked)
                if(this.leftMainTableChecked){
                    if(checked){
                        let data = []
                        for(let i=0;i <this.leftTableColArr.length; i++){
                            if(this.leftTableColArr[i].checked){
                                data.push({
                                    'nodeId': this.leftTablePreNodeId,
                                    'value': this.leftTableColArr[i].colName,
                                    'nullNodeId': this.leftTableNodeId
                                })
                            }
                        }
                        this.$parent.$parent.$parent.$refs.outputColumnVueRef.re_checkbox(data, true)
                    }else{
                        this.$parent.$parent.$parent.$refs.outputColumnVueRef.re_checkbox(null, true)
                    }
                }
            },
            rightSelectAllChange(checked){
                Array.from(this.rightTableColArr, (n) => n.checked = checked)
                if(this.rightMainTableChecked){
                    if(checked){
                        let data = []
                        for(let i=0;i <this.rightTableColArr.length; i++){
                            if(this.rightTableColArr[i].checked){
                                data.push({
                                    'nodeId': this.rightTablePreNodeId,
                                    'value': this.rightTableColArr[i].colName,
                                    'nullNodeId': this.rightTableNodeId
                                })
                            }
                        }
                        this.$parent.$parent.$parent.$refs.outputColumnVueRef.re_checkbox(data, true)
                    }else{
                        this.$parent.$parent.$parent.$refs.outputColumnVueRef.re_checkbox(null, true)
                    }
                }
            },
            saveSetting() {
                let left_data = {
                    'nodeId': this.leftTableNodeId,
                    'nodeName': this.leftTableName,
                    'columnSetArr': [],
                    'mainTable': false,
                    'selectAll': this.leftSelectAll,
                    'preNodeId': this.leftTablePreNodeId
                }
                let right_data = {
                    'nodeId': this.rightTableNodeId,
                    'nodeName': this.rightTableName,
                    'columnSetArr': [],
                    'mainTable': false,
                    'selectAll': this.rightSelectAll,
                    'preNodeId': this.rightTablePreNodeId
                }
                if (this.leftMainTableChecked) {
                    left_data.mainTable = true
                } else {
                    right_data.mainTable = true
                }
                let $this = this
                let leftTableColTr = this.$refs.leftElTable.$refs.bodyWrapper.children[0].children[1].children
                if(typeof leftTableColTr !== 'undefined' && leftTableColTr.length > 0){
                    $.each(leftTableColTr,function (i) {
                        const leftIndex = parseInt($(this).find("td:eq(1)>div>div").html()) - 1
                        let id = i
                        let name = $this.leftTableColArr[leftIndex].colName
                        let checked = $this.leftTableColArr[leftIndex].checked
                        left_data.columnSetArr.push({id, name, checked})
                    })
                }
                let rightTableColTr = this.$refs.rightElTable.$refs.bodyWrapper.children[0].children[1].children
                if(typeof rightTableColTr !== 'undefined' && rightTableColTr.length > 0){
                    $.each(rightTableColTr,function (i) {
                        const rightIndex = parseInt($(this).find("td:eq(1)>div>div").html()) - 1
                        let id = i
                        let name = $this.rightTableColArr[rightIndex].colName
                        let checked = $this.rightTableColArr[rightIndex].checked
                        right_data.columnSetArr.push({id, name, checked})
                    })
                }
                this.nodeData.setting.left_data = left_data// 选择的数据（带顺序）
                this.nodeData.setting.right_data = right_data// 选择的数据（带顺序）
                this.nodeData.setting.conn_type = this.conn_type
            },
            inputVerify() {
                let checkedIndex = 0
                let verify = true
                let leftTableColTr = this.$refs.leftElTable.$refs.bodyWrapper.children[0].children[1].children
                let rightTableColTr = this.$refs.rightElTable.$refs.bodyWrapper.children[0].children[1].children
                let $this = this
                if(typeof leftTableColTr !== 'undefined' && typeof rightTableColTr !== 'undefined'){
                    $.each(leftTableColTr,function (i) {
                        const leftIndex = parseInt($(this).find("td:eq(1)>div>div").html()) - 1
                        if($this.leftTableColArr[leftIndex].checked){
                            let rightIndex = parseInt($(rightTableColTr[i]).find("td:eq(1)>div>div").html()) - 1
                            let curRightCol = $this.rightTableColArr[rightIndex]
                            if(typeof curRightCol === 'undefined' || !$this.rightTableColArr[rightIndex].checked){
                                verify = false
                                return false
                            }
                        }
                    })
                    if(this.leftMainTableChecked){//左表为主表
                        checkedIndex = this.leftTableColArr.findIndex( n => n.checked === true)
                    }else{//右表为主表
                        checkedIndex = this.rightTableColArr.findIndex( n => n.checked === true)
                        $.each(rightTableColTr,function (i) {
                            const rightIndex = parseInt($(this).find("td:eq(1)>div>div").html()) - 1
                            if($this.rightTableColArr[rightIndex].checked){
                                let leftIndex = parseInt($(leftTableColTr[i]).find("td:eq(0)>div>div").html()) - 1
                                let curLeftCol = $this.rightTableColArr[leftIndex]
                                if(typeof curLeftCol === 'undefined' || !$this.leftTableColArr[leftIndex].checked){
                                    verify = false
                                    return false
                                }
                            }
                        })
                    }
                }
                if(checkedIndex < 0){
                    this.$message({ type: 'info', message: '请勾选主表的输出字段' })
                    return false
                }
                if(!verify){
                    this.$message({ type: 'info', message: '字段顺序或勾选状态不一致，请修改' })
                }
                return verify
            },
            setConnType(val){
                this.conn_type = val
            },
        }
    }
</script>
<style scoped type="text/css">
    .div_table {
        float: left;
        width: 400px;
        height: 480px;
        margin-top:20px;
        background-color: #fff;
        border:1px solid #E6E6E6;
    }
</style>
