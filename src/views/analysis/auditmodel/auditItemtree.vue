<template>
  <div class="app-container" style="height: 500px;overflow-y: scroll">
    <el-input
      v-model="filterText1"
      placeholder="输入关键字进行过滤"
    />
    <MyElTree
      ref="tree1"
      v-loading="treeLoading"
      :props="props"
      class="filter-tree"
      :highlight-current="true"
      :data="treeData1"
      :filter-node-method="filterNode"
      node-key="id"
      show-checkbox
      check-strictly
      @check-change="handleNodeClick1"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <i v-if="data.id==='root'" class="el-icon-s-home" style="color:#409EFF" />
        <i v-if="data.type==='folder'" class="el-icon-folder" style="color:#409EFF" />
        <i v-if="data.type==='table'" class="el-icon-tickets" style="color:#409EFF" />
        <i v-if="data.type==='column'" class="el-icon-c-scale-to-original" style="color:#409EFF" />
        <span :title="node.name">{{ node.label }}</span>
      </span>
    </MyElTree>
  </div>
</template>

<script>
import MyElTree from '@/components/public/tree/src/tree.vue'
import { getAuditItem } from '@/api/analysis/auditmodel'
export default {
  components: { MyElTree },
  data() {
    return {
      filterText1: null,
      props: {
        label: 'label',
        isLeaf: 'leaf'
      },
      accessForm: {
        folderUuid: null,
        folderName: null,
        parentFolderUuid: null,
        orderNum: 0,
        fullPath: null
      },
      treeData1: [],
      treeLoading: true,
      checkedId: ''
    }
  },
  computed: {
  },
  watch: {
    filterText1(val) {
      this.$refs.tree1.filter(val)
    }
  },
  created() {
    getAuditItem().then(resp => {
      this.treeData1 = resp.data
      this.treeLoading = false
    })
  },
  methods: {
    handleNodeClick1(data, checked, node) {
    if(checked === true) {
        this.checkedId = data.id;
        this.$refs.tree1.setCheckedKeys([data.id]);
    } else {
        if (this.checkedId == data.id) {
            this.$refs.tree1.setCheckedKeys([data.id]);
        }
    }
},
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getTree() {
      return this.$refs.tree1
    }
  } // 注册
}

</script>

<style lang="scss" scoped>
.filter-tree {
  margin-top: 20px;
}
.dialog-bottom-btns{

}
.transfer-center-item{
  width: 40px;
  margin: 2px
}
.page-container .left-tree{
  height: 80vh;
  overflow: scroll;
}
.bottom-btn{
  float: right;
  padding-right: 100px
}
</style>
