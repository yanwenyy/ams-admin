<template>
    <Details ref="Details_ref" v-if="isShow"
             :dataSource = "dataSource"
             :tableMetaUuid = "tableMetaUuid"
             :isDisable_input = true
             :isHide_step = false
             @query_data = "queryData"></Details>
</template>
<script>
import Details from "@/components/directory/details.vue"
export default {
    data () {
        return {
            dataSource: '',
            tableMetaUuid: '',
            isShow: false
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init(){
            this.dataSource = this.$route.query.dataSource
            this.tableMetaUuid = this.$route.query.tableMetaUuid
            this.isShow = true
        },
        queryData(){

        }
    },
    components: {
        Details
    }
}
</script>