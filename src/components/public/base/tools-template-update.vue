<!--<template>-->
<!--  <div class="tools-template w100 h100 relative" id="tool">-->
<!--    <div class="tools-content h100 relative">-->
<!--      <div class="title text-white">-->
<!--        <i class="el-icon-s-grid" />-->
<!--        <span class="label">更多工具</span>-->
<!--      </div>-->
<!--      <div class="lately-use">-->
<!--        <div class="title-label">常用功能</div>-->
<!--        <div class="lately-use-box flex a-center j-start flex-row">-->
<!--          <div-->
<!--            v-for="(item,index) in latelyBdInList"-->
<!--            :key="index"-->
<!--            class="use-box flex a-center j-center use-zy"-->
<!--            @click="theRouting(index)"-->
<!--            :style='{background:item.bg}'-->
<!--          >-->
<!--            <img :src="item.image" />-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="lately-use-box flex a-center j-start flex-row">-->
<!--          <div v-for="(item,index) in latelyUseList"-->
<!--               :key="index"-->
<!--               class="use-box flex a-center j-center use-zyt"-->
<!--          >-->
<!--            <el-tooltip :content="item" placement="bottom" effect="light">-->
<!--              <span class="doubleWords"> {{ item }} </span>-->
<!--            </el-tooltip>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="title-label" style="margin-top: 15px;">自定义快捷菜单</div>-->
<!--          <div class="lately-use-box flex a-center j-start flex-row" >-->
<!--            <div-->
<!--              v-for="(item,index) in latelyFastList"-->
<!--              :key="index"-->
<!--              class="use-box flex a-center j-center use-zy"-->
<!--              @click="theRoutingIn(item)"-->
<!--              :style='{background:item.bg}'-->
<!--            >-->
<!--              <img :src="item.image" />-->
<!--            </div>-->
<!--            <div-->
<!--              class="use-box flex a-center j-center use-zy"-->
<!--              @click="dialogVisible = true"-->
<!--              :style='{background:"rgb(95, 190, 235)"}'-->
<!--            >-->
<!--              <img src="../../public/base/accessIcon/zidingyi.png" />-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="lately-use-box flex a-center j-start flex-row">-->
<!--            <div v-for="(item,index) in latelyFastList"-->
<!--                :key="index"-->
<!--                class="use-box flex a-center j-center use-zyt"-->
<!--            >-->
<!--              <el-tooltip :content="item.name" placement="bottom" effect="light">-->
<!--                <span class="doubleWords"> {{ item.name }} </span>-->
<!--              </el-tooltip>-->
<!--            </div>-->
<!--            <div class="use-box flex a-center j-center use-zyt">-->
<!--              <span style="font-size:14px"> 维护 </span>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--&lt;!&ndash;      <div class="other-tools">&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="title-label">其他工具</div>&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="other-tools-box flex flex-row a-center j-start">&ndash;&gt;-->
<!--&lt;!&ndash;          <div&ndash;&gt;-->
<!--&lt;!&ndash;            v-for="(item,index) in otherToolsList"&ndash;&gt;-->
<!--&lt;!&ndash;            :key="index"&ndash;&gt;-->
<!--&lt;!&ndash;            class="tools-box flex a-start j-center flex-column"&ndash;&gt;-->
<!--&lt;!&ndash;          >&ndash;&gt;-->
<!--&lt;!&ndash;            <i class="el-icon-s-home tools-box-icon" />&ndash;&gt;-->
<!--&lt;!&ndash;            <div class="tools-box-name">{{ item.name }}</div>&ndash;&gt;-->
<!--&lt;!&ndash;          </div>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->

<!--      <div class="newest-item">-->
<!--        <div class="title-label">执行任务</div>-->
<!--&lt;!&ndash;        style="background: #559ed4 !important;"&ndash;&gt;-->
<!--        <div class="newest-item-box">-->
<!--          <div>-->
<!--            <ul>-->
<!--              <li v-for="(item , index) in list" :key="index">-->
<!--                <span v-if="item.taskStatus == 2" style="color:#eaeaea" class="el-icon-success" />-->
<!--                <span v-if="item.taskStatus == 1" style="color:#eaeaea" class="el-icon-loading" />-->
<!--                <span v-if="item.taskStatus == 3" style="color:#eaeaea" class="el-icon-error" />-->
<!--                <span style="color:#eaeaea;font-size:11px;padding:2px" class="tools-box-name" v-text="item.taskEstimatedTime" />-->
<!--                <span style="color:#eaeaea;font-size:11px;padding:2px;cursor:pointer;" class="tools-box-name" @click="toUrl(item.taskUrl)" v-text="item.taskName" />-->
<!--              </li>-->
<!--            </ul>-->
<!--            <span type="primary" style="color:#fff;position: absolute; bottom: 10px; right: 15px;font-size:13px;font-weight:bold;cursor:pointer;" @click="moreTask">更多</span>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--&lt;!&ndash;      <div class="btns-wrap absolute">&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="btn-box flex a-center j-center">&ndash;&gt;-->
<!--&lt;!&ndash;          <i class="el-icon-close" />&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="btn-box1 flex a-center  flex-column">&ndash;&gt;-->
<!--&lt;!&ndash;          <i class="el-icon-close" />&ndash;&gt;-->
<!--&lt;!&ndash;          <i class="el-icon-close" />&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--    </div>-->
<!--&lt;!&ndash;    <div class="new-time-wrap absolute">&ndash;&gt;-->
<!--&lt;!&ndash;      <ace-progress />&ndash;&gt;-->
<!--&lt;!&ndash;    </div>&ndash;&gt;-->
<!--&lt;!&ndash;    <div v-if="isShowInfoBox" class="info-box absolute flex a-center j-start flex-row">&ndash;&gt;-->
<!--&lt;!&ndash;      <img src="../../../assets/styles/image/提示icon2@2x.png" class="info-icon">&ndash;&gt;-->
<!--&lt;!&ndash;      <span class="msg">Helpful and short message.</span>&ndash;&gt;-->
<!--&lt;!&ndash;      <i class="el-icon-close icon-close" @click="isShowInfoBox=false" />&ndash;&gt;-->
<!--&lt;!&ndash;    </div>&ndash;&gt;-->
<!--    <div class="tools-right" @click="callback">-->
<!--    </div>-->
<!--    <div class="tools-center" v-show="dialogVisible">-->
<!--      <el-collapse class="tools-menu-small" v-if="showmenuGroup">-->
<!--        <el-collapse-item :title="menugroupId[0].name">-->
<!--          <el-tree-->
<!--            :data="menugroup[0]"-->
<!--            show-checkbox-->
<!--            node-key="id"-->
<!--            ref="tree0"-->
<!--            highlight-current-->
<!--            :check-strictly="defaultProps.checkStrictly"-->
<!--            :props="defaultProps">-->
<!--          </el-tree>-->
<!--        </el-collapse-item>-->
<!--        <el-collapse-item :title="menugroupId[1].name">-->
<!--          <el-tree-->
<!--            :data="menugroup[1]"-->
<!--            show-checkbox-->
<!--            node-key="id"-->
<!--            ref="tree1"-->
<!--            highlight-current-->
<!--            @check=""-->
<!--            :check-strictly="defaultProps.checkStrictly"-->
<!--            :props="defaultProps">-->
<!--          </el-tree>-->
<!--        </el-collapse-item>-->
<!--        <el-collapse-item :title="menugroupId[2].name">-->
<!--          <el-tree-->
<!--            :data="menugroup[2]"-->
<!--            show-checkbox-->
<!--            node-key="id"-->
<!--            ref="tree2"-->
<!--            highlight-current-->
<!--            :check-strictly="defaultProps.checkStrictly"-->
<!--            :props="defaultProps">-->
<!--          </el-tree>-->
<!--        </el-collapse-item>-->
<!--        <el-collapse-item :title="menugroupId[3].name">-->
<!--          <el-tree-->
<!--            :data="menugroup[3]"-->
<!--            show-checkbox-->
<!--            node-key="id"-->
<!--            ref="tree3"-->
<!--            highlight-current-->
<!--            :check-strictly="defaultProps.checkStrictly"-->
<!--            :props="defaultProps">-->
<!--          </el-tree>-->
<!--        </el-collapse-item>-->
<!--      </el-collapse>-->
<!--      <el-button @click="getCheckedNodes" type="primary" class="btn-tree">保 存</el-button>-->
<!--      <el-button @click="dialogVisible = false">取 消</el-button>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import { querySystemTask } from '@/api/base/systemtask'-->
<!--import { getUserRes } from '@/api/user'-->
<!--import { saveQuickMenuList, getQuickMenuList } from '@/api/base/quickmenu'-->
<!--export default {-->
<!--  data() {-->
<!--    return {-->
<!--      websocket: null,-->
<!--      list: {},-->
<!--      applications: [],-->
<!--      menugroup: [],-->
<!--      menugroupId: [],-->
<!--      showmenuGroup: false,-->
<!--      dialogVisible: false,-->
<!--      isShowInfoBox: true,-->
<!--      otherToolsList: [-->
<!--        {-->
<!--          name: '工具名称',-->
<!--          color: ''-->
<!--        },-->
<!--        {-->
<!--          name: '工具名称',-->
<!--          color: ''-->
<!--        },-->
<!--        {-->
<!--          name: '工具名称',-->
<!--          color: ''-->
<!--        },-->
<!--        {-->
<!--          name: '工具名称',-->
<!--          color: ''-->
<!--        },-->
<!--        {-->
<!--          name: '工具名称',-->
<!--          color: ''-->
<!--        },-->
<!--        {-->
<!--          name: '工具名称',-->
<!--          color: ''-->
<!--        },-->
<!--        {-->
<!--          name: '工具名称',-->
<!--          color: ''-->
<!--        }-->
<!--      ],-->
<!--      latelyBackList:[-->
<!--        {-->
<!--          bg: '#559ed4 !important'-->
<!--        },-->
<!--        {-->
<!--          bg: '#559ed4 !important'-->
<!--        },-->
<!--        {-->
<!--          bg: '#559ed4 !important'-->
<!--        },-->
<!--        {-->
<!--          bg: '#559ed4 !important'-->
<!--        },-->
<!--        {-->
<!--          bg: '#559ed4 !important'-->
<!--        }-->
<!--      ],-->
<!--      latelyUseList: [],-->
<!--      latelyPathList: [],-->
<!--      latelyImgList:[-->
<!--        {-->
<!--          name: '审计计划',-->
<!--          image: require("../../public/base/accessIcon/shenji.png")-->
<!--        },-->
<!--        {-->
<!--          name: '备选计划',-->
<!--          image: require("../../public/base/accessIcon/shenji.png")-->
<!--        },-->
<!--        {-->
<!--          name: '快速通道授权',-->
<!--          image: require("../../public/base/accessIcon/shouquan.png")-->
<!--        },-->
<!--        {-->
<!--          name: '立项申请',-->
<!--          image: require("../../public/base/accessIcon/xiangmu.png")-->
<!--        },-->
<!--        {-->
<!--          name: '项目执行',-->
<!--          image: require("../../public/base/accessIcon/zhixing.png")-->
<!--        },-->
<!--        {-->
<!--          name: '指标分析',-->
<!--          image: require("../../public/base/accessIcon/zhixing.png")-->
<!--        },-->
<!--        {-->
<!--          name: '作废申请',-->
<!--          image: require("../../public/base/accessIcon/zuofei.png")-->
<!--        },-->
<!--        {-->
<!--          name: '整改管理',-->
<!--          image: require("../../public/base/accessIcon/zhenggai.png")-->
<!--        },-->
<!--        {-->
<!--          name: '问责管理',-->
<!--          image: require("../../public/base/accessIcon/zhenggai.png")-->
<!--        },-->
<!--        {-->
<!--          name: '档案下载申请',-->
<!--          image: require("../../public/base/accessIcon/dangan.png")-->
<!--        },-->
<!--        {-->
<!--          name: '档案下载列表',-->
<!--          image: require("../../public/base/accessIcon/dangan.png")-->
<!--        },-->
<!--        {-->
<!--          name: '调度流程',-->
<!--          image: require("../../public/base/accessIcon/diaodu.png")-->
<!--        },-->
<!--        {-->
<!--          name: '调度管理',-->
<!--          image: require("../../public/base/accessIcon/diaodu.png")-->
<!--        },-->
<!--        {-->
<!--          name: '调度监控',-->
<!--          image: require("../../public/base/accessIcon/diaodu.png")-->
<!--        },-->
<!--        {-->
<!--          name: '调度配置',-->
<!--          image: require("../../public/base/accessIcon/diaodu.png")-->
<!--        },-->
<!--        {-->
<!--          name: '数据表管理',-->
<!--          image: require("../../public/base/accessIcon/shuju.png")-->
<!--        },-->
<!--        {-->
<!--          name: '数据授权',-->
<!--          image: require("../../public/base/accessIcon/shuju.png")-->
<!--        },-->
<!--        {-->
<!--          name: '数据转码',-->
<!--          image: require("../../public/base/accessIcon/shuju.png")-->
<!--        },-->
<!--        {-->
<!--          name: '数据挖掘',-->
<!--          image: require("../../public/base/accessIcon/shuju.png")-->
<!--        },-->
<!--        {-->
<!--          name: '表关系管理',-->
<!--          image: require("../../public/base/accessIcon/guanxi.png")-->
<!--        },-->
<!--        {-->
<!--          name: '数据资源目录',-->
<!--          image: require("../../public/base/accessIcon/shuju.png")-->
<!--        },-->
<!--        {-->
<!--          name: '主题展示',-->
<!--          image: require("../../public/base/accessIcon/zhuti.png")-->
<!--        },-->
<!--        {-->
<!--          name: '主题展示配置',-->
<!--          image: require("../../public/base/accessIcon/zhuti.png")-->
<!--        },-->
<!--        {-->
<!--          name: '阈值管理',-->
<!--          image: require("../../public/base/accessIcon/yuzhi.png")-->
<!--        },-->
<!--        {-->
<!--          name: '审计模型',-->
<!--          image: require("../../public/base/accessIcon/moxing.png")-->
<!--        },-->
<!--        {-->
<!--          name: '模型参数',-->
<!--          image: require("../../public/base/accessIcon/moxing.png")-->
<!--        },-->
<!--        {-->
<!--          name: '模型结果',-->
<!--          image: require("../../public/base/accessIcon/moxing.png")-->
<!--        },-->
<!--        {-->
<!--          name: '线索核实',-->
<!--          image: require("../../public/base/accessIcon/yonghu.png")-->
<!--        },-->
<!--        {-->
<!--          name: '图形化工具',-->
<!--          image: require("../../public/base/accessIcon/gongju.png")-->
<!--        },-->
<!--        {-->
<!--          name: 'SQL编辑器',-->
<!--          image: require("../../public/base/accessIcon/gongju.png")-->
<!--        },-->
<!--        {-->
<!--          name: '审计预警',-->
<!--          image: require("../../public/base/accessIcon/yujing.png")-->
<!--        },-->
<!--        {-->
<!--          name: '预警结果',-->
<!--          image: require("../../public/base/accessIcon/yujing.png")-->
<!--        },-->
<!--        {-->
<!--          name: '被审计机构',-->
<!--          image: require("../../public/base/accessIcon/jigou.png")-->
<!--        },-->
<!--        {-->
<!--          name: '领导干部',-->
<!--          image: require("../../public/base/accessIcon/lingdao.png")-->
<!--        },-->
<!--        {-->
<!--          name: '工程项目',-->
<!--          image: require("../../public/base/accessIcon/gongcheng.png")-->
<!--        },-->
<!--        {-->
<!--          name: '业务产品',-->
<!--          image: require("../../public/base/accessIcon/yewu.png")-->
<!--        },-->
<!--        {-->
<!--          name: '审计手册',-->
<!--          image: require("../../public/base/accessIcon/shenji.png")-->
<!--        },-->
<!--        {-->
<!--          name: '审计手册查询',-->
<!--          image: require("../../public/base/accessIcon/shenji.png")-->
<!--        },-->
<!--        {-->
<!--          name: '业务分类',-->
<!--          image: require("../../public/base/accessIcon/yewu.png")-->
<!--        },-->
<!--        {-->
<!--          name: '问题词条',-->
<!--          image: require("../../public/base/accessIcon/yujing.png")-->
<!--        },-->
<!--        {-->
<!--          name: '培训管理',-->
<!--          image: require("../../public/base/accessIcon/peixun.png")-->
<!--        },-->
<!--        {-->
<!--          name: '培训查询',-->
<!--          image: require("../../public/base/accessIcon/peixun.png")-->
<!--        },-->
<!--        {-->
<!--          name: '法律法规',-->
<!--          image: require("../../public/base/accessIcon/falv.png")-->
<!--        },-->
<!--        {-->
<!--          name: '制度依据',-->
<!--          image: require("../../public/base/accessIcon/falv.png")-->
<!--        },-->
<!--        {-->
<!--          name: '基础代码管理',-->
<!--          image: require("../../public/base/accessIcon/jichu.png")-->
<!--        },-->
<!--        {-->
<!--          name: '基础数据管理',-->
<!--          image: require("../../public/base/accessIcon/jichu.png")-->
<!--        },-->
<!--        {-->
<!--          name: '假期管理',-->
<!--          image: require("../../public/base/accessIcon/jiaqi.png")-->
<!--        },-->
<!--        {-->
<!--          name: '公告管理',-->
<!--          image: require("../../public/base/accessIcon/gonggao.png")-->
<!--        },-->
<!--        {-->
<!--          name: '公告查阅',-->
<!--          image: require("../../public/base/accessIcon/gonggao.png")-->
<!--        },-->
<!--        {-->
<!--          name: '审计机构管理',-->
<!--          image: require("../../public/base/accessIcon/jigou.png")-->
<!--        },-->
<!--        {-->
<!--          name: '审计人员管理',-->
<!--          image: require("../../public/base/accessIcon/yonghu.png")-->
<!--        },-->
<!--        {-->
<!--          name: '审计机构辖区管理',-->
<!--          image: require("../../public/base/accessIcon/jigou.png")-->
<!--        },-->
<!--        {-->
<!--          name: '被审计机构查询',-->
<!--          image: require("../../public/base/accessIcon/jigou.png")-->
<!--        },-->
<!--        {-->
<!--          name: '被审计部门查询',-->
<!--          image: require("../../public/base/accessIcon/jigou.png")-->
<!--        },-->
<!--        {-->
<!--          name: '被审计人员查询',-->
<!--          image: require("../../public/base/accessIcon/yonghu.png")-->
<!--        },-->
<!--        {-->
<!--          name: '项目阶段管理',-->
<!--          image: require("../../public/base/accessIcon/xiangmu.png")-->
<!--        },-->
<!--        {-->
<!--          name: '项目阶段结束条件管理',-->
<!--          image: require("../../public/base/accessIcon/xiangmu.png")-->
<!--        },-->
<!--        {-->
<!--          name: '项目查询权限',-->
<!--          image: require("../../public/base/accessIcon/xiangmu.png")-->
<!--        },-->
<!--        {-->
<!--          name: '监管常规项目管理',-->
<!--          image: require("../../public/base/accessIcon/xiangmu.png")-->
<!--        },-->
<!--        {-->
<!--          name: '服务监控',-->
<!--          image: require("../../public/base/accessIcon/jiankong.png")-->
<!--        },-->
<!--        {-->
<!--          name: '数据源监控',-->
<!--          image: require("../../public/base/accessIcon/jiankong.png")-->
<!--        },-->
<!--        {-->
<!--          name: '系统操作日志',-->
<!--          image: require("../../public/base/accessIcon/xitong.png")-->
<!--        },-->
<!--        {-->
<!--          name: '系统异常日志',-->
<!--          image: require("../../public/base/accessIcon/xitong.png")-->
<!--        },-->
<!--        {-->
<!--          name: '系统帮助维护',-->
<!--          image: require("../../public/base/accessIcon/bangzhu.png")-->
<!--        }-->
<!--      ],-->
<!--      latelyInImgList:[],-->
<!--      latelyBdInList:[],-->
<!--      latelyFastList:[],-->
<!--      defaultProps: {-->
<!--        children: 'children',-->
<!--        label: 'name',-->
<!--        disabled: this.ifFather,-->
<!--        checkStrictly: true-->
<!--      },-->
<!--      quickRefresh: {-->
<!--        top: true,-->
<!--        bottom: false-->
<!--      }-->
<!--    }-->
<!--  },-->
<!--  created() {-->
<!--    // 页面刚进入时开启长连接-->
<!--    this.init()-->
<!--    this.initWebSocket()-->
<!--  },-->
<!--  mounted(){-->
<!--    //最近使用 功能-->
<!--    let arry = []-->
<!--    let arryV = []-->
<!--    arry = JSON.parse(localStorage.getItem('userid'))-->
<!--    for(let i = 0 ; i < arry.length ; i++){-->
<!--      arryV.push(arry[i].v)-->
<!--    }-->
<!--    arryV.sort(function(num1,num2){-->
<!--      return num1-num2;-->
<!--    })-->
<!--    for(let x=1;x<200;x++){-->
<!--      let Num= eval(arryV[arryV.length-x]);-->
<!--      for(let i=0; i<arry.length; i++){-->
<!--        if(arry[i].v === Num && arry[i].p !== ''){-->
<!--          if(this.latelyUseList.indexOf(arry[i].id) === -1) {-->
<!--            this.latelyPathList.push(arry[i].p)-->
<!--            this.latelyUseList.push(arry[i].id)-->
<!--            for(let c=0;c<this.latelyImgList.length;c++){-->
<!--              if(arry[i].id === this.latelyImgList[c].name){-->
<!--                this.latelyInImgList.push({image:this.latelyImgList[c].image})-->
<!--              }-->
<!--            }-->
<!--            break-->
<!--          }-->
<!--        }-->
<!--      }-->
<!--      if(this.latelyUseList.length>=5){-->
<!--        break-->
<!--      }-->
<!--    }-->
<!--    for(let i =0; i<this.latelyInImgList.length; i++){-->
<!--      this.latelyBdInList.push({image:this.latelyInImgList[i].image,bg:this.latelyBackList[i].bg})-->
<!--    }-->
<!--    let listTree = JSON.parse(sessionStorage.getItem('shenjiMenuTree'))-->
<!--    this.menugroup = listTree.second-->
<!--    this.menugroupId = listTree.first-->
<!--    this.showmenuGroup = true-->
<!--    getQuickMenuList().then(res => {-->
<!--      // latelyImgList中的name与数据库中的name不同  比如latelyImgList中的服务监控-->
<!--      for (let i=0; i<res.data.length; i++) {-->
<!--        for (let n=0; n<this.latelyImgList.length; n++) {-->
<!--          if (this.latelyImgList[n].name === res.data[i].quickMenuName) {-->
<!--            this.latelyFastList.push({-->
<!--              id: res.data[i].quickMenuId,-->
<!--              name: res.data[i].quickMenuName,-->
<!--              path: res.data[i].quickMenuPath,-->
<!--              image: this.latelyImgList[i].image,-->
<!--              bg: this.latelyBackList[i].bg-->
<!--            })-->
<!--          }-->
<!--        }-->
<!--      }-->
<!--    })-->
<!--  },-->
<!--  methods: {-->
<!--    theRouting(index){-->
<!--      this.$router.push({ path: this.latelyPathList[index] })-->
<!--      this.$store.commit('aceState/setRightFooterTags', {-->
<!--        type: 'active',-->
<!--        val: {-->
<!--          name: this.latelyUseList[index],-->
<!--          path: this.latelyPathList[index]-->
<!--        }-->
<!--      })-->
<!--      // this.$emit('func',false)-->
<!--    },-->
<!--    theRoutingIn(item){-->
<!--      this.$router.push({ path: item.path })-->
<!--      this.$store.commit('aceState/setRightFooterTags', {-->
<!--        type: 'active',-->
<!--        val: {-->
<!--          name: item.name,-->
<!--          path: item.path-->
<!--        }-->
<!--      })-->
<!--    },-->
<!--    init() {-->
<!--      querySystemTask().then(resp => {-->
<!--      })-->
<!--    },-->
<!--    initWebSocket() {-->
<!--      this.webSocket = this.getWebSocket()-->
<!--    },-->
<!--    moreTask() {-->
<!--      this.$router.push({-->
<!--        path: '/base/querytask'-->
<!--      })-->
<!--    },-->
<!--    toUrl(url) {-->
<!--      this.$router.push({-->
<!--        path: url-->
<!--      })-->
<!--    },-->
<!--    /**-->
<!--     *-->
<!--     * 使用说明：-->
<!--     * 1、WebSocket客户端通过回调函数来接收服务端消息。例如：webSocket.onmessage-->
<!--     * 2、WebSocket客户端通过send方法来发送消息给服务端。例如：webSocket.send();-->
<!--     */-->
<!--    getWebSocket() {-->
<!--      var userId = this.$store.getters.personuuid-->
<!--      const wsuri = this.AmsWebsocket.getWSBaseUrl(this.AmsModules.BASE) + userId + 'systemTask'// 连接地址，可加参数// 连接地址，可加参数-->
<!--      // WebSocket客户端 PS：URL开头表示WebSocket协议 中间是域名端口 结尾是服务端映射地址-->
<!--      this.webSocket = new WebSocket(wsuri) // 建立与服务端的连接-->
<!--      // 当服务端打开连接-->
<!--      this.webSocket.onopen = function(event) {-->
<!--      }-->
<!--      // 发送消息-->
<!--      this.webSocket.onmessage = function(event) {-->
<!--        func1(event)-->
<!--      }-->
<!--      const func2 = function func3(val) {-->
<!--        this.list = JSON.parse(val.data).slice(0, 5)-->
<!--        this.list.forEach(element => {-->
<!--          var taskEstimatedTime = new Date(element.taskEstimatedTime)-->
<!--          element.taskEstimatedTime = taskEstimatedTime.getFullYear() + '-' + (taskEstimatedTime.getMonth() + 1) + '-' + taskEstimatedTime.getDate() + '-' + taskEstimatedTime.getHours() + ':' + taskEstimatedTime.getMinutes() + ':' + taskEstimatedTime.getSeconds()-->
<!--        })-->
<!--      }-->
<!--      const func1 = func2.bind(this)-->
<!--      this.webSocket.onclose = function(event) {-->
<!--      }-->
<!--      // 通信失败-->
<!--      this.webSocket.onerror = function(event) {-->
<!--      }-->
<!--    },-->
<!--    callback() {-->
<!--      this.$emit('func',false)-->
<!--    },-->
<!--    getCleanSrc(src) {-->
<!--      if (src.indexOf('&resUUID') !== -1) {-->
<!--        src = src.split('&resUUID')[0]-->
<!--      } else if (src.indexOf('?resUUID') !== -1) {-->
<!--        src = src.split('?resUUID')[0]-->
<!--      }-->
<!--      return src-->
<!--    },-->
<!--    getCheckedNodes() {-->
<!--      let allThing = []-->
<!--      for (let i=0;i<this.$refs.tree0.getCheckedNodes().length;i++) {-->
<!--        allThing.push({-->
<!--          quickMenuId: this.$refs.tree0.getCheckedNodes()[i].id,-->
<!--          quickMenuName: this.$refs.tree0.getCheckedNodes()[i].name,-->
<!--          quickMenuPath: this.$refs.tree0.getCheckedNodes()[i].path-->
<!--        })-->
<!--      }-->
<!--      for (let i=0;i<this.$refs.tree1.getCheckedNodes().length;i++) {-->
<!--        allThing.push({-->
<!--          quickMenuId: this.$refs.tree1.getCheckedNodes()[i].id,-->
<!--          quickMenuName: this.$refs.tree1.getCheckedNodes()[i].name,-->
<!--          quickMenuPath: this.$refs.tree1.getCheckedNodes()[i].path-->
<!--        })-->
<!--      }-->
<!--      for (let i=0;i<this.$refs.tree2.getCheckedNodes().length;i++) {-->
<!--        allThing.push({-->
<!--          quickMenuId: this.$refs.tree2.getCheckedNodes()[i].id,-->
<!--          quickMenuName: this.$refs.tree2.getCheckedNodes()[i].name,-->
<!--          quickMenuPath: this.$refs.tree2.getCheckedNodes()[i].path-->
<!--        })-->
<!--      }-->
<!--      for (let i=0;i<this.$refs.tree3.getCheckedNodes().length;i++) {-->
<!--        allThing.push({-->
<!--          quickMenuId: this.$refs.tree3.getCheckedNodes()[i].id,-->
<!--          quickMenuName: this.$refs.tree3.getCheckedNodes()[i].name,-->
<!--          quickMenuPath: this.$refs.tree3.getCheckedNodes()[i].path-->
<!--        })-->
<!--      }-->
<!--      if (allThing.length > 4) {-->
<!--        this.$message.error('自定义快捷菜单不能超过四个！');-->
<!--      } else {-->
<!--        saveQuickMenuList(allThing).then(resp => {-->
<!--          if(resp.code != 0){-->
<!--            this.$message({-->
<!--              type: 'error',-->
<!--              message: '保存失败!'-->
<!--            })-->
<!--            return-->
<!--          }-->
<!--          this.latelyFastList = []-->
<!--          getQuickMenuList().then(res => {-->
<!--            for (let i=0; i<res.data.length; i++) {-->
<!--              for (let n=0; n<this.latelyImgList.length; n++) {-->
<!--                if (this.latelyImgList[n].name === res.data[i].quickMenuName) {-->
<!--                  this.latelyFastList.push({-->
<!--                    id: res.data[i].quickMenuId,-->
<!--                    name: res.data[i].quickMenuName,-->
<!--                    path: res.data[i].quickMenuPath,-->
<!--                    image: this.latelyImgList[i].image,-->
<!--                    bg: this.latelyBackList[i].bg-->
<!--                  })-->
<!--                }-->
<!--              }-->
<!--            }-->
<!--          })-->
<!--        })-->
<!--        this.dialogVisible = false-->
<!--      }-->
<!--    },-->
<!--    // 父节点不可选-->
<!--    ifFather(data) {-->
<!--      if (data.children) {-->
<!--        return true-->
<!--      }else{-->
<!--        return false-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style lang="scss" scoped>-->
<!--#tool .use-zy{-->
<!--  width: 18%;-->
<!--  height: 27px;-->
<!--  margin: 8px 5px 2px 5px;-->
<!--  padding: 25px;-->
<!--}-->
<!--#tool .use-zy img{-->
<!--  width:27px;-->
<!--}-->
<!--#tool .use-zyt{-->
<!--  width:18%;-->
<!--  white-space: nowrap;-->
<!--  text-overflow: ellipsis;-->
<!--  overflow: hidden;-->
<!--  word-break: break-all;-->
<!--  margin:0px 5px 2px 5px;-->
<!--  height:24px;-->
<!--}-->
<!--.tools-template {-->
<!--  //background: rgba(0, 0, 0, 0.5);-->

<!--  .info-box {-->
<!--    background: #fcf4f1;-->
<!--    border-radius: 6px;-->
<!--    width: 288px;-->
<!--    height: 64px;-->
<!--    top: 17px;-->
<!--    right: 14px;-->
<!--    padding: 8px 12px 28px 12px;-->
<!--    .info-icon {-->
<!--      width: 28px;-->
<!--      height: 28px;-->
<!--      border-radius: 50%;-->
<!--      background: grey;-->
<!--      margin-right: 12px;-->
<!--    }-->
<!--    .msg {-->
<!--      font-family: Helvetica;-->
<!--      font-size: 15px;-->
<!--      color: #212b36;-->
<!--      letter-spacing: 0;-->
<!--      line-height: 20px;-->
<!--    }-->
<!--    .icon-close {-->
<!--      width: 36px;-->
<!--      height: 36px;-->
<!--      font-size: 20px;-->
<!--      color: #637381;-->
<!--      text-align: center;-->
<!--      line-height: 36px;-->
<!--      &:hover {-->
<!--        opacity: 0.6;-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--  .new-time-wrap {-->
<!--    right: 167px;-->
<!--    top: 50%;-->
<!--    margin-top: -40px;-->
<!--    height: 80px;-->
<!--  }-->
<!--  .tools-content {-->
<!--    background: rgb(85,158,212);-->
<!--    box-shadow: -10px 10px 5px 0 rgba(85,158,212,.5);-->
<!--    border-radius: 1px 1px 30px 30px;-->
<!--    width: 510px;-->
<!--    height: 640px;-->
<!--    padding: 25px 20px;-->
<!--    margin: 65px 0 0 0;-->
<!--    float: right;-->
<!--    z-index: 10;-->
<!--    animation: allinwidth .5s ease-out;-->
<!--    overflow: auto;-->
<!--    .btns-wrap {-->
<!--      right: 9px;-->
<!--      top: 186px;-->
<!--      color: #8691A2;-->
<!--      font-size: 16px;-->
<!--      .btn-box {-->
<!--        background: #559ed4;-->
<!--        border-radius: 3px;-->
<!--        margin-bottom: 10px;-->
<!--        width: 30px;-->
<!--        height: 30px;-->
<!--      }-->
<!--      .btn-box1{-->
<!--        background: #559ed4;-->
<!--        border-radius: 3px;-->
<!--        width: 30px;-->
<!--        height: 60px;-->
<!--        justify-content: space-around;-->
<!--      }-->
<!--    }-->
<!--    .title-label {-->
<!--      font-family: PingFangSC-Semibold;-->
<!--      font-size: 12px;-->
<!--      color: #ffffff;-->
<!--      letter-spacing: 0;-->
<!--    }-->
<!--    .title {-->
<!--      font-family: BebasNeue;-->
<!--      font-size: 16px;-->
<!--      color: #ffffff;-->
<!--      letter-spacing: 0;-->
<!--      .label {-->
<!--        margin-left: 6px;-->
<!--        display: inline-block;-->
<!--      }-->
<!--    }-->
<!--    .lately-use {-->
<!--      margin-top: 23px;-->
<!--      &-box {-->
<!--        margin-top: 11px;-->
<!--        .use-box {-->
<!--          //box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.1);-->
<!--          border-radius: 12.6px;-->
<!--          width: 67.2px;-->
<!--          height: 67.2px;-->
<!--          font-size: 30px;-->
<!--          margin-right: 15.8px;-->
<!--          color: white;-->
<!--          &-add {-->
<!--            border: 1px solid #454c58;-->
<!--            color: #454c58;-->
<!--          }-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--    .other-tools {-->
<!--      margin-top: 24px;-->
<!--      margin-bottom: 21px;-->
<!--      &-box {-->
<!--        margin-top: 11px;-->
<!--        padding-top: 9px;-->
<!--        flex-wrap: wrap;-->
<!--        .tools-box {-->
<!--          border: 1px solid rgb(95, 190, 235);-->
<!--          //box-shadow: 0 0 10px 0 rgba(95, 190, 235, 0.1);-->
<!--          border-radius: 8px;-->
<!--          width: 136px;-->
<!--          height: 80px;-->
<!--          padding: 0 14px;-->
<!--          margin-top: 11px;-->
<!--          &:not(:nth-child(3n)) {-->
<!--            margin-right: 9px;-->
<!--          }-->
<!--          &-icon {-->
<!--            font-size: 29px;-->
<!--            color: #eaeaea;-->
<!--          }-->
<!--          &-name {-->
<!--            font-family: PingFangSC-Regular;-->
<!--            font-size: 12px;-->
<!--            color: #eaeaea;-->
<!--            line-height: 12px;-->
<!--            display: inline-block;-->
<!--            margin-top: 14.5px;-->
<!--          }-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--    .newest-item {-->
<!--      width: 500px;-->
<!--      &-box {-->
<!--        height: 140px;-->
<!--        margin-top: 20px;-->
<!--        border: 1px solid #559ed4 !important;-->
<!--        //box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);-->
<!--        border-radius: 8px;-->
<!--        padding: 10px 20px;-->
<!--        &-title {-->
<!--          font-family: PingFangSC-Regular;-->
<!--          font-size: 14px;-->
<!--          color: rgba(255, 255, 255, 0.5);-->
<!--          line-height: 24px;-->
<!--        }-->
<!--        &-content {-->
<!--          .content-left {-->
<!--            font-family: BebasNeue;-->
<!--            font-size: 56px;-->
<!--            color: #ffffff;-->
<!--            line-height: 64px;-->
<!--            margin-right: 26px;-->
<!--          }-->
<!--          .content-right {-->
<!--            .right-p1 {-->
<!--              font-family: PingFangSC-Regular;-->
<!--              font-size: 18px;-->
<!--              color: white;-->
<!--              line-height: 32px;-->
<!--            }-->
<!--            .right-p2 {-->
<!--              font-family: PingFangSC-Semibold;-->
<!--              font-size: 14px;-->
<!--              color: rgba(255, 255, 255, 0.5);-->
<!--              line-height: 24px;-->
<!--            }-->
<!--          }-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--  @keyframes allinwidth-->
<!--  {-->
<!--    0%{height:0}100%{height: 85%;}-->
<!--  }-->
<!--}-->
<!--.tools-right{-->
<!--  height: 100%;-->
<!--  width: 100%;-->
<!--  position: absolute;-->
<!--  top: 0;-->
<!--  right: 0;-->
<!--}-->
<!--.tools-center{-->
<!--  position: absolute;-->
<!--  width: 300px;-->
<!--  max-height: 94vh;-->
<!--  box-shadow: 0 0 20px 0 #888;-->
<!--  z-index:10000;-->
<!--  top: 67px;-->
<!--  right: 520px;-->
<!--  background-color: #fff;-->
<!--  border-radius: 5px;-->
<!--  padding: 10px;-->
<!--  overflow: hidden;-->
<!--}-->
<!--.tools-menu-small{-->
<!--  max-height: 86vh;-->
<!--  overflow: auto;-->
<!--}-->
<!--.btn-tree{-->
<!--  margin: 10px 80px 0 22px;-->
<!--}-->
<!--.doubleWords{-->
<!--  font-size:14px;-->
<!--  width:75px;-->
<!--  overflow: hidden;-->
<!--  text-overflow:ellipsis;-->
<!--  white-space: nowrap;-->
<!--  text-align: center-->
<!--}-->
<!--</style>-->
