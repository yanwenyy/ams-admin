<template>
  <div class="left-menu relative flex a-center flex-cow j-between"
       @mouseleave="menuLeave()">
    <template>
      <div class="top-open flex flex-row a-center">
        <div class="logo-icon"
             @click="jumpHome">
          <!-- <img  src="../../../../assets/img/logo1.png" alt=""> -->
          <img src="../../../../assets/img/login-logo.png"
               alt="">
        </div>
        <div class="menu flex a-center j-between flex-row">
          <div class="list flex a-center j-between flex-row">
            <div class="box flex a-center j-center flex-row box-new"
                 :class="[currentIndex === 0 && 'box-active']"
                 @click="selectMenu({}, 0)">
              <div class="name">首页</div>
            </div>
            <!-- <div class="box flex a-center j-center flex-row box-active" ><div class="name">审计分析</div></div> -->
            <div v-for="(item, index) in applications"
                 ref="navDom"
                 :key="index"
                 class="box flex a-center j-center flex-row relative box-new"
                 :class="[currentIndex === (index+1) && 'box-active']"
                 @click="selectMenu(item, (index+1))">
              <div class="name">{{ item.name }}</div>
              <div class="tree-list-new-box">
                <div class="tree-list-content tree-list-back tree-list-new">
                  <menu-tree :list="moremenugroup[index]"
                             @closetree="isShrink = true"
                             @click="selectMenu(item, index)" />
                </div>
              </div>
            </div>
            <div class="box flex a-center j-center flex-row box-new"
                 :class="[currentIndex === 'todo' && 'box-active']"
                 @click="selectMenu({}, 'todo')">
              <el-badge :value="getToDoNum"
                        v-if="getToDoNum>0"
                        :max="99">
                <div class="name">我的待办</div>
              </el-badge>
              <div class="name"
                   v-else>我的待办</div>
            </div>
          </div>
          <!--          <div class="tree-out-box absolute" v-if="isShowTreeList">-->
          <!--            <transition-->
          <!--              name="slide-fade"-->
          <!--              v-for="(item, index) in applications"-->
          <!--              :key="index"-->
          <!--            >-->
          <!--              <div-->
          <!--                -->
          <!--                class="tree-list"-->
          <!--                @mouseover="selectMenu(item, (index+1))"-->
          <!--              >-->
          <!--                <div-->
          <!--                  class="tree-list-content"-->
          <!--                  :class="[currentIndex === (index+1) && 'tree-list-back']"-->
          <!--                >-->
          <!--                  <p class="tree-list-tit"><img src="../../../../assets/img/sjfx.png"><span>{{applications[index].name}}</span></p>-->
          <!--                  <menu-tree-->
          <!--                    :list="moremenugroup[index]"-->
          <!--                    @closetree="isShrink = true"-->
          <!--                    @click="selectMenu(item, (index+1))"-->
          <!--                  />-->
          <!--                </div>-->
          <!--              </div>-->
          <!--            </transition>-->
          <!--          </div>-->

        </div>

      </div>
      <div class="flex a-center">
        <!-- 搜索和功能按钮 -->
        <div class="search-btn-box flex a-center j-end">
          <div class="search-box flex a-center j-between"
               @click="jumpToFullSearch">
            <el-input v-model="search"
                      placeholder="搜索"></el-input>
            <img src="../../../../assets/img/search.png">
          </div>
          <el-badge class="badge-icon"
                    :value="UditNum"
                    v-if="UditNum>0"
                    :max="99">
            <img src="../../../../assets/img/activity.png"
                 @click="jumptTo('/base/remind', '消息列表')">
          </el-badge>
          <img src="../../../../assets/img/activity.png"
               class="badge-icon"
               @click="jumptTo('/base/remind')"
               v-else>
          <!-- runStatus：1、待运行；2、运行中；3、运行成功；4、运行失败 -->
          <div class="task-box">
            <img @click="jumptTo('/base/querytask', '任务列表')"
                 class="search-icon"
                 src="../../../../assets/img/task-queue.png">
            <span class="runStatus-icon run-successfully-icon"
                  v-if="runStatus == 3"></span>
            <span class=" run-failed-icon"
                  v-if="runStatus == 4">！</span>
            <span class="runStatus-icon runing-icon"
                  v-if="runStatus == 2"></span>
            <!-- <img src="">  -->
          </div>

          <!-- runStatus -->
        </div>
        <!-- 用户名及菜单 -->
        <div class="bottom-open flex a-center j-end flex-row">
          <div class="footer-btns flex a-center j-end flex-row"
               @click="isShowSettingList = !isShowSettingList">
            <!-- <i class="shrink-btn icon iconfont iconleft-1" @click="isShrink=false" /> -->
            <!--          <i class="setting-btn icon iconfont iconmenu-2 setting-btn-right" @click="widthChange" />-->
            <div class="label-wang">
              <i class="label-wang-in"
                 v-if="isThereReminder"></i>
              <!-- <img v-if="isThereReminder" src="../../../../assets/img/user.png"> -->
            </div>
            <span class="label-word">{{ $store.getters.name }}</span>
          </div>
          <!--        <div-->
          <!--            class="label-open flex a-center j-end flex-row"-->
          <!--            @click="isShowToolsList=!isShowToolsList, isShowTreeList=false, currentIndex=-1"-->
          <!--        >-->
          <!--          <span class="oper-btn menu-21" style="color: #303030;background: transparent"/>-->
          <!--        </div>-->
        </div>
      </div>
    </template>
    <!-- v-if="isShowSettingList" -->
    <!-- 点击显示菜单修改为划过显示菜单 -->
    <transition name="setting-fade">
      <div v-if="isShowSettingList"
           class="setting-list absolute"
           @click="isShowSettingList = !isShowSettingList"
           @mouseleave="isShowSettingList = false">
        <div class="setting-list-content">
          <div v-for="(item, index) in settingList"
               :key="index"
               class="setting-list-line flex flex-row a-center j-start">
            <!-- <i v-if="index == 0" class="el-icon-info icon" />
            <i v-else-if="index == 1" class="el-icon-question icon" />
            <i v-else-if="index == 2" class="el-icon-s-tools icon" />
            <i v-else class="el-icon-error icon" />  -->
            <div class="name-box"
                 @click="item.method">
              <span>{{ item.name }}</span>
              <span v-if="item.count"
                    class="count"
                    :class="[
                  index === 0 ? 'count-red' : index === 1 ? 'count-green' : '',
                ]">{{ item.count }}</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="showAnimation">
      <div v-if="isShowToolsList"
           class="tools-list">
        <tools-template-update @func="showWith" />
      </div>
    </transition>
    <div class="page-left"
         v-if="showHelpWidth">
      <el-collapse class="tools-menu-small"
                   v-model="activeName"
                   accordion>
        <el-collapse-item v-for="(item, index) in moremenugroupId"
                          :title="item.name"
                          :name="index">
          <el-tree :data="moremenugroup[index]"
                   node-key="id"
                   @node-click="handleNodeClick"
                   ref="tree"
                   highlight-current
                   v-if="activeName === index"
                   :props="defaultProps">
          </el-tree>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="page-close"
         v-if="showHelpWidth"
         @click="(showHelpWidth = false), (showHelpHeight = false)"></div>
    <div class="readonlyTo"
         v-if="showHelpWidth && showHelpHeight"
         v-loading="loading">
      <div @click="showHelpHeight = false"
           class="readonlyToX">X</div>
      <div class="readonlyChild"
           id="readonlyChild"></div>
    </div>
  </div>
</template>

<script>
import { getUserRes } from "@/api/user";
import MenuTree from "./menu-tree/index.vue";
import { cacheDict } from "@/api/base/sysdata.js";
import { getUnReadRemind, getUditDataList } from "@/api/base/base";
import { querySystemTask } from "@/api/base/systemtask";
import { getByMenuId, saveHelpDocument } from "@/api/base/helpdocument";
import { getAllRunTaskRel } from "@/api/analysis/auditmodelresult"
import { mapGetters } from "vuex";
export default {
  components: { MenuTree },
  data () {
    return {
      currentIndex: -1,
      websocket: null,
      isShowTreeList: false,
      scrollTop: false,
      isShowSettingList: false,
      isShowToolsList: false,
      isShrink: false,
      nowAppName: "",
      menugroup: {},
      moremenugroup: [],
      moremenugroupId: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      // 激活菜单
      activeName: "1",
      showHelpWidth: false,
      showHelpHeight: false,
      settingList: [
        {
          icon: "",
          name: "提醒",
          count: 0,
          method: this.logoutRemind,
        },
        // {
        //   icon: "",
        //   name: "帮助",
        //   method: this.showHelp,
        // },
        // {
        //   icon: "",
        //   name: "修改密码",
        //   method: this.goresetpassword,
        // },
        {
          icon: "",
          name: "退出",
          method: this.logout,
        },
        // {
        //   icon: "",
        //   name: "我的待办",
        //   method: this.todowork,
        // }
      ],
      applications: [],
      workbenchImg: require("../style/images/icon0.png"),
      isThereReminder: false,
      drawer: false,
      loading: false,
      projectname: process.env.VUE_APP_BASE_NAME || "",
      search: '',
      UditNum: 0, // 未读数量
      runStatus: 2, // 跑批任务执行结果
    };
  },
  computed: {
    ...mapGetters(["getToDoNum"]),
    leftWidth () {
      return this.isShrink ? 64 : 120;
    },
    currentMenuGroup () {
      if (this.applications.length === 0) {
        return [];
      }
      const appid = this.applications[this.currentIndex].id;
      return this.menugroup[appid];
    },
    getPersonUuid () {
      return this.$store.getters.personuuid;
    },
    // isShowTreeList(){
    //   return this.$store.state.aceState.isShowTreeList
    // }
  },
  watch: {
    isShrink: {
      handler: function (newVal, oldVal) {
        this.$store.commit("aceState/setLeftMenuShrink", newVal);
      },
      immediate: true,
    },
    currentIndex () {
      this.currentIndexChange();
    },
    getPersonUuid (newv, oldv) {
      if (newv && newv != "") {
        this.webSocket = this.getWebSocket(newv);
      }
    },
    $route: {
      handler (val, oldval) {
        if (oldval.path == "/login") {
          this.initmounted()
        }
      },
      // 深度观察监听
      deep: true,
    },
  },
  created () {
    // 页面刚进入时开启长连接
    this.init();
    if (this.getPersonUuid) {
      this.webSocket = this.getWebSocket(this.getPersonUuid);
    }
  },
  mounted () {
    this.initmounted()
    // 获取项目列表
    // this.getMyProjectPage();

    // 青海VUE_APP_BASE_QUERYMENU为true不请求顶部消息信息和跑批状态
    // if (!process.env.VUE_APP_BASE_QUERYMENU) {
    // 获取未读消息个数
    this.getUditDataNum();
    // 获取跑批状态
    this.getRunBatchStatus();
    // }
  },
  methods: {
    initmounted () {
      // // 青海VUE_APP_BASE_QUERYMENU为true不请求菜单
      // 
      // if (!process.env.VUE_APP_BASE_QUERYMENU) {

      // if (this.hasMenu && this.CommonUtil.isBlank(sessionStorage.getItem('shenjiMenuTree'))) {
      if (this.hasMenu) {

        getUserRes().then((response) => {
          this.applications = [];
          response.data.application.forEach((app, index) => {
            // 设置左侧应用栏数据
            this.applications.push({
              img: require(`../style/images/icon0.png`),
              name: app.name,
              id: app.id,
              homepage: app.homepage || '/ams/first',
            });
          });
          this.menugroup = [];
          // 设置引用栏弹出二级菜单数据
          response.data.menugroup.forEach((grp) => {
            const menuList = [];
            grp.menuList.forEach((menu) => {
              menuList.push({
                id: menu.id,
                name: menu.name,
                path: this.getCleanSrc(menu.src),
              });
            });
            if (!this.menugroup[grp.appuuid]) {
              this.menugroup[grp.appuuid] = [];
            }
            this.menugroup[grp.appuuid].push({
              id: grp.id,
              name: grp.name,
              path: grp.navurl,
              children: menuList,
            });
          });
          let sSTree = [];
          for (let i = 0; i < this.applications.length; i++) {
            sSTree.push(this.menugroup[this.applications[i].id]);
          }
          let sSLTree = { first: this.applications, second: sSTree };
          sessionStorage.setItem("shenjiMenuTree", JSON.stringify(sSLTree));
          this.$store.dispatch('app/setMenuData', sSLTree)
          let listTree = JSON.parse(sessionStorage.getItem("shenjiMenuTree"));
          this.moremenugroup = listTree.second;
          this.moremenugroupId = listTree.first;
        })
          .catch((error) => {
            this.applications = []

          });
      }
      // }
      if (this.CommonUtil.isBlank(sessionStorage.getItem('sysDict'))) {
        var sysDict = JSON.parse(sessionStorage.getItem("sysDict"));
        if (sysDict == null) {
          cacheDict().then((resp) => {
            sessionStorage.setItem("sysDict", JSON.stringify(resp.data));
          });
        }
      }
      getUnReadRemind().then((resp) => {
        if (resp.data <= 99) {
          this.settingList[0].count = resp.data;
        } else {
          this.settingList[0].count = "···";
        }
        if (resp.data !== 0) {
          this.isThereReminder = true;
        }
      });
    },
    init () {
      querySystemTask().then((resp) => { });
    },
    /* initWebSocket() {
      this.webSocket = this.getWebSocket()
    },*/
    /**
     *
     * 使用说明：
     * 1、WebSocket客户端通过回调函数来接收服务端消息。例如：webSocket.onmessage
     * 2、WebSocket客户端通过send方法来发送消息给服务端。例如：webSocket.send();
     */
    getWebSocket (personuuid) {
      const wsuri =
        this.AmsWebsocket.getWSBaseUrl(this.AmsModules.BASE) +
        personuuid +
        "systemTask"; // 连接地址，可加参数
      // WebSocket客户端 PS：URL开头表示WebSocket协议 中间是域名端口 结尾是服务端映射地址
      this.webSocket = new WebSocket(wsuri); // 建立与服务端的连接
      // 当服务端打开连接
      this.webSocket.onopen = function (event) { };
      // 发送消息
      this.webSocket.onmessage = function (event) {
        func1(event);
      };
      const func2 = function func3 (val) {
        var dataObj = JSON.parse(val.data);
        if (dataObj.taskStatus === "2" || dataObj.taskStatus === 2) {
          let html = "";
          if (dataObj.taskUrl !== undefined && dataObj.taskUrl !== "") {
            html =
              '<a style="font-style: normal;color: #17e1e1;text-decoration: underline;cursor: pointer;" href="/#' +
              dataObj.taskUrl +
              '" id="messageTrack">' +
              dataObj.taskName +
              "</a>";
          } else {
            html =
              '<span style="font-style: normal;color: #17e1e1;text-decoration: underline;cursor: pointer;" id="messageTrack">' +
              dataObj.taskName +
              "</span>";
          }
          this.$notify({
            dangerouslyUseHTMLString: true,
            title: "已完成",
            message: html,
            type: "success",
            duration: 2000,
            position: "bottom-right",
          });
        }
      };
      const func1 = func2.bind(this);
      // this.webSocket.onclose = function(event) {
      // }
      // 通信失败
      this.webSocket.onerror = function (event) { };
    },
    currentIndexChange () {
      // const dis = this.isShrink ? 110 : 120
      // this.$nextTick(() => {
      //   const offset = this.$refs.navDom[this.currentIndex].offsetTop - dis
      //   
      //   this.scrollTop = {
      //     allowScroll: true,
      //     offset: offset,
      //     complete: () => {
      //       this.scrollTop = false
      //     }
      //   }
      // })
    },
    // menuEnter() {
    //   //this.isShrink = false
    //   this.isShowTreeList = true
    // },
    menuLeave () {
      this.currentIndex = -1;
      this.isShowTreeList = false;
      this.isShowSettingList = false;
    },
    getStyle (img) {
      return {
        background: `url(${img}) no-repeat center center`,
        "background-size": "100% 100%",
      };
    },
    selectMenu (app, index) {
      this.currentIndex = index;
      if (index != 0 && index != 'todo') {
        this.isShowTreeList = true;
        // this.$nextTick(()=> {
        //   let _offsetLeft=0;
        //   if(index==1){
        //     _offsetLeft=(1.5*230)-40;
        //   }
        //   if(index==2){
        //     _offsetLeft=0.6*230;
        //   }
        //   const boxActive = document.getElementsByClassName('tree-out-box')[0];
        //   boxActive.style.paddingLeft=_offsetLeft+"px";
        // })
      } else if (index == 0) { // 首页
        this.isShowTreeList = false;
        this.$router.push({ path: '/ams/first' })
        this.$store.commit('aceState/setRightFooterTags', {
          type: 'active',
          val: {
            name: '首页',
            path: '/ams/first'
          }
        })
      } else { // 我的待办
        this.isShowTreeList = false;
        this.$router.push({ path: "/base/frameto?url=%2Famis%2FworkBench%2FtoApplyMes" });
      }
      // this.isShowTreeList = true;
      this.isShowSettingList = false;
      this.nowAppName = app.name;
      this.isShowToolsList = false;
    },
    action (type) {
      if (type === "prev") {
        this.currentIndex = this.currentIndex === 0 ? 0 : this.currentIndex - 1;
      } else if (type === "next") {
        this.currentIndex =
          this.currentIndex === this.applications.length - 1
            ? this.applications.length - 1
            : this.currentIndex + 1;
      }
    },
    jumpHome () {
      this.$router.push({ path: "/ams/first" });
    },
    getCleanSrc (src) {
      if (src.indexOf("&resUUID") !== -1) {
        src = src.split("&resUUID")[0];
      } else if (src.indexOf("?resUUID") !== -1) {
        src = src.split("?resUUID")[0];
      }
      return src;
    },
    async logout () {
      sessionStorage.clear();
      localStorage.clear();
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
      this.$store.commit("aceState/setRightFooterTags", {
        type: "closeAll",
        val: "",
      });
    },
    goresetpassword () {
      this.$router.push({ path: "/repassword" });
    },
    logoutRemind () {
      this.$router.push({ path: "/base/remind" });
    },
    todowork () {
      this.$router.push({ path: "/base/frameto?url=%2Famis%2FworkBench%2FtoApplyMes" });
    },
    showWith (obj) {
      this.isShowToolsList = obj;
    },
    widthChange () {
      this.isShrink = !this.isShrink;
    },
    selectMenuIn () {
      this.$store.commit("aceState/setRightFooterTags", {
        type: "closeAll",
        val: "",
      });
      this.$router.push({
        path: this.applications[0].homepage || "/nopermission",
      });
    },
    showHelp () {
      this.showHelpWidth = !this.showHelpWidth;
    },
    // 父节点不可选中
    ifFather (data) {
      if (data.children) {
        return true;
      } else {
        return false;
      }
    },
    handleNodeClick (data) {
      if (data.id <= 1000) {
      } else {
        this.loading = true;
        this.showHelpHeight = true;
        let id = data.id;
        getByMenuId(id).then((resp) => {
          if (resp.code === 0 && resp.data !== null) {
            if (resp.data.helpDocument !== "") {
              document.getElementById("readonlyChild").innerHTML =
                resp.data.helpDocument;
            } else {
              document.getElementById("readonlyChild").innerHTML =
                "<p>暂无新手引导</p>";
            }
            this.loading = false;
          } else if (resp.code === 0 && resp.data === null) {
            document.getElementById("readonlyChild").innerHTML =
              "<p>暂无新手引导</p>";
            this.loading = false;
          }
        });
      }
    },
    // 获取未读消息列表
    getUditDataNum () {
      getUditDataList().then((res) => {
        this.UditNum = res.data;
      })
    },
    // 获取报批状态
    getRunBatchStatus () {
      getAllRunTaskRel().then(resp => {
        let runBatchList = resp.data;
        let runStatusList = runBatchList.map(i => {
          return i.runStatus
        });
        // runStatus：1、待运行；2、运行中；3、运行成功；4、运行失败
        // 是否为运行失败
        let RunFailed = runStatusList.some(i => {
          return i == 4
        })
        let operation = runStatusList.some(i => {
          return i == 2
        })
        let runSuccessfully = runStatusList.some(i => {
          return i == 3
        })

        if (RunFailed) {
          this.runStatus = 4;
        } else if (operation) {
          this.runStatus = 2;
        } else {
          this.runStatus = 3;
        }
      })
    },
    jumptTo (path, name) {
      this.$router.push({ path: path });
    },
    jumpToFullSearch () {

      this.$router.push({ path: '/base/frameto?url=%2Famis%2FsolrCall%2FtoList' });
    }
  },
};
</script>

<style lang="scss" scoped>
.left-menu {
  height: 75px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  background: #e0eaf3;
  // box-shadow: 7px 5px 14px 0px #dde8f1;
  box-shadow: 0px 10px 20px 0px #dfe8f1; /*下边阴影  黄色*/
  border-bottom: 1.5px solid #dde6f0;

  .top-open {
    float: left;
    .logo-text {
      width: 65px;
      height: 11px;
      position: absolute;
      top: 36px;
      left: 20px;
    }
    .logo-Words {
      color: #303030;
      font-size: 24px;
      margin-left: 30px;
      font-weight: bold;
      min-width: 120px;
      /*width: 320px;*/
      margin-right: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .logo-icon {
      margin-left: 30px;
      margin-left: 16px;
      img {
        width: 248px;
        height: 41px;
        cursor: pointer;
      }
    }
    .logo-wrap {
      // margin-right: 200px;
    }
    .menu {
      margin-top: 0px;
      .icon {
        font-size: 16px;
        cursor: pointer;
        &:active {
          opacity: 0.6;
        }
        &-disable {
          cursor: not-allowed;
          color: grey;
        }
      }
      .list {
        margin: 10px 0;
        max-height: 415px;
        margin-left: 10px;
        perspective: 500px;
        //overflow-y: auto;
        &::-webkit-scrollbar {
          width: 0;
        }
        .box {
          // width: 90px;
          // height: 50px;
          // padding: 5px 0;
          cursor: pointer;
          // margin: 0 25px 0 25px;
          // margin-left: 25px;
          position: relative;
          color: #303030;
          padding: 8px 20px;
          // transition: 0.5s;
          color: #31456a;
          .img {
            width: 26px;
            height: 26px;
            margin-bottom: 8px;
          }
          .name {
            font-family: PingFangHK-Semibold;
            font-size: 14px;

            letter-spacing: 0.3px;
            text-align: center;
            font-weight: 600;
            // line-height: 14px;
            min-width: 58px;
          }

          &-active {
            // background: #E3EDF7;
            // background: radial-gradient(7px at top left, #bbcddb , #e3edf7);
            // box-shadow: inset -6px -3px 3px 0px rgba(255,255,255,1);
            // background: -webkit-radial-gradient(top left, circle, transparent 70%, #2d85ff 30%);

            color: #529ed4;
            border-radius: 4px;
            background: url("../style/images/box-active.png") no-repeat top
              center;
            background-size: container; // 最长边完全显示
            // background-attachment:fixed; /*背景图片不会随着页面的滚动而滚动。*/
          }
        }
      }
    }
  }
  .search-btn-box {
    margin-right: 47px;
    .search-box {
      cursor: pointer;
      border: 1px solid rgba(77, 148, 199, 1);
      border-radius: 10px;
      width: 200px;
      height: 38px;
      padding: 0 20px;
      box-shadow: 0 0 15px #bcd1e4 inset;
      // box-shadow:-10px 0px 2px -15px #fff inset,   /*左边阴影*/
      //       0px -10px 2px -15px #fff inset,  /*上边阴影*/
      //       10px 0px 2px -15px  #bed2e5 inset,  /*右边阴影*/
      //       0px 10px 2px -15px #bed2e5 inset; /*下边阴影*/
      ::v-deep .el-input {
        border: none;
        flex: 1;
        .el-input__inner {
          padding: 0;
          border: none;
          cursor: pointer !important;
          &::placeholder {
            font-size: 12px;
            color: #7b8499;
            letter-spacing: 0.26px;
            line-height: 14px;
            font-weight: 400;
          }
          &:focus {
            border: none;
          }
        }
      }
      img {
        width: 18px;
        cursor: pointer;
      }
    }
    .search-icon {
      color: #abc4df;
      font-size: 18px;
      // margin-left: 20px;
      font-weight: 600;
      height: 18px;
      cursor: pointer;
    }
    .el-icon-bell {
      margin-top: 4px;
    }
    .runStatus-icon {
      // box-shadow: 3px 0px 3px 0px rgba(254,254,254,1), 0px 1px 5px 0px rgba(155,187,216,1);
      width: 5px;
      height: 5px;
      border-radius: 100%;
      display: inline-block;
      margin-left: 3px;
    }
    .runing-icon {
      background-image: linear-gradient(180deg, #ffcb4a 0%, #fa6f3e 100%);
    }
    .run-successfully-icon {
      background-image: linear-gradient(180deg, #70da8a 0%, #1ab47f 100%);
    }
    .run-failed-icon {
      // background: red;
      // color: #fc6190;
      font-weight: 900;
      font-size: 20px;
      vertical-align: middle;
      background-image: -webkit-linear-gradient(
        180deg,
        #fa5c88 0%,
        #dd292b 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .badge-icon {
      // margin-left: 20px;
      // margin-right: 20px;
      margin: 0 30px;
      cursor: pointer;
      height: 18px;
    }
    .task-box {
      display: flex;
      align-items: center;
    }
  }
  .bottom-open {
    margin-right: 40px;
    .search-box {
      .search-input {
        background: #3d424b;
        border: 1px solid rgba(168, 172, 178, 0.3);
        font-family: BebasNeue;
        font-size: 11.38px;
        color: #8691a2;
        letter-spacing: 0;
        width: 90px;
        height: 28px;
        padding-left: 4px;
        margin-bottom: 9px;
        position: relative;
      }
      > i {
        font-size: 16px;
        margin-right: 2px;
        color: #8691a2;
        margin-left: -20px;
        z-index: 10;
        margin-bottom: 9px;
        cursor: pointer;
      }
      &::before {
        content: "";
        position: absolute;
        top: -10px;
        left: 0;
        right: 0;
        height: 1px;
        background: #505866;
      }
    }
    .label-wang {
      cursor: pointer;
      position: relative;
      // margin-right: 14px;
    }
    .label-open {
      color: #303030;
      letter-spacing: 0;
      padding-left: 10px;
      cursor: pointer;
      span {
        font-size: 20px;
        line-height: 20px;
        color: #303030;
        background: transparent;
        width: 26px;
        height: 26px;
        margin-right: 30px;
      }
    }
  }
  .tools-list {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
  }
  .setting-list {
    width: 160px;
    // height: 128px;
    right: 30px;
    top: 72px;
    z-index: 20201231;
    .setting-list-content {
      background: #e3edf7;
      border: none;
      border-radius: 6px !important;
      box-shadow: -7px -5px 25px 2px rgba(255, 255, 255, 1),
        7px 5px 25px 2px rgba(211, 224, 236, 1);
    }
    &-line {
      padding-left: 45px;
      line-height: 32px;
      height: 32px;
      font-family: PingFangHK-Regular;
      font-size: 10px;
      color: #31456a;
      letter-spacing: 0.21px;
      line-height: 30px;
      font-weight: 400;
      &:hover {
        box-shadow: 0px -5px 15px 0px rgba(255, 255, 255, 1),
          0px 5px 15px 0px rgba(255, 255, 255, 1),
          0px 0px 0px 0px rgba(255, 255, 255, 1),
          0px 0px 0px 0px rgba(255, 255, 255, 1);
        transform: translate3d(0, 0, 0);
        position: relative;
        z-index: 100;
      }
      // &:first-child:hover {
      //   box-shadow: 0px 0px 0px 0px rgba(255,255,255,1),0px 5px 15px 0px rgba(255,255,255,1);
      // }
      // &:last-child:hover {
      //   box-shadow: 0px -5px 15px 0px rgba(255,255,255,1),0px 0px 0px 0px rgba(255,255,255,1);
      // }
      .name-box {
        margin-left: 10px;
        height: 100%;
        cursor: pointer;
        .count {
          display: inline-block;
          margin-left: 3px;
          // height: 14px;
          // line-height: 14px;
          // padding: 0 2px;
          // font-family: DINCondensed-Bold;
          // font-size: 10px;
          // color: #ffffff;
          // letter-spacing: 0.75px;
          // border-radius: 7px;

          border-radius: 10px;
          color: #ffffff;
          display: inline-block;
          font-size: 10px;
          height: 16px;
          line-height: 16px;
          padding: 0 5px;
          text-align: center;
          white-space: nowrap;
          border: 1px solid #ffffff;

          &-red {
            background: red;
          }
          &-green {
            background: #006320;
          }
        }
      }
    }
  }
  .tree-out-box {
    backdrop-filter: blur(7px) brightness(100%);
    top: 65px;
    left: 0;
    z-index: 999;
    width: 100%;
    display: flex;
    justify-content: center;
    border-top: none !important;
    min-height: 570px;
    opacity: 0.94;
    background-image: linear-gradient(180deg, #cfe1f3 0%, #fafcfe 100%);
    box-shadow: -7px -5px 15px 0px rgba(255, 255, 255, 1);
  }
  .tree-list {
    height: 530px;
    width: 230px;
    // opacity: 0.5;
    background: #e3edf7;
    background: #ffffff;
    background: #ebf2fa;
    box-shadow: 5px 8px 14px 0px rgba(220, 235, 251, 1),
      -7px -5px 15px 0px rgba(255, 255, 255, 1);
    border-radius: 5px;
    margin-left: 20px;
    margin-top: 8px;
    color: #434851;
    &-back {
      // box-shadow: 0 4px 10px 0 rgb(3 136 238 / 38%);
      // border-top: 2px solid;
      // z-index: 1000;
      // opacity: 0.6;
      background: #e3edf7;
      background: #ffffff;
      background: #eff5fb;
      border: 1px solid rgba(77, 148, 199, 0.8);
      box-shadow: 5px 8px 14px 0px rgba(147, 194, 228, 1),
        -7px -5px 15px 0px rgba(255, 255, 255, 1);
      border-radius: 5px;
    }
    &-content {
      // backdrop-filter: blur(8px);
      // background: hsla(0, 0%, 100%, 0.6);
      // width: 150px;
      height: 100%;
      overflow-y: auto;
      .tree-list-tit {
        font-family: PingFang-SC-Heavy;
        font-size: 14px;
        color: #31456a;
        letter-spacing: 1.03px;
        text-align: center;
        text-shadow: 0 1px 2px #9bbbd8;
        font-weight: 800;
        margin: 15px 0;
        opacity: 1;
        img {
          margin-right: 5px;
        }
      }
    }
    &-new-box {
      display: none;
      position: absolute;
      top: 29px;
      left: -5.5vw;
      padding-top: 20px;
    }
    &-new {
      width: 16.5vw;
      height: auto;
      max-height: 60vh;
      //background: #FFFFFF;
      //box-shadow: 5px 8px 14px 1px #DCEBFB;
      border-radius: 5px 5px 5px 5px;
      transition: display 0.3s ease;
      backdrop-filter: blur(7px) brightness(100%);
      background-image: linear-gradient(180deg, #cfe1f3 0%, #fafcfe 100%);
      box-shadow: 5px 8px 14px 1px #dcebfb;
    }
  }
  @media screen and (min-width: 960px) and (max-width: 1400px) {
    .tree-list-new-box {
      left: -4.5vw;
    }
  }
  @media screen and (min-device-width: 960px) and (max-device-width: 1400px) {
    .tree-list-new-box {
      left: -4.5vw;
    }
  }
  @media screen and (min-width: 2000px) and (max-width: 2500px) {
    .tree-list-new-box {
      left: -6vw;
    }
  }
  @media screen and (min-device-width: 2000px) and (max-device-width: 2500px) {
    .tree-list-new-box {
      left: -6vw;
    }
  }
  @media screen and (min-width: 2500px) {
    .tree-list-new-box {
      left: -6.5vw;
    }
  }
  @media screen and (min-device-width: 2500px) {
    .tree-list-new-box {
      left: -6.5vw;
    }
  }
  .box-new:hover {
    color: #529ed4;
    border-radius: 4px;
    background: url("../style/images/box-active.png") no-repeat top center;
    background-size: container; // 最长边完全显示
  }
  .box-new:hover > .tree-list-new-box,
  .tree-list-new-box:hover {
    display: block;
  }
  .top {
    margin-top: 0;
    .logo {
      width: 30px;
      height: 30px;
      margin-bottom: 20px;
    }
    .menu {
      .icon {
        font-size: 20px;
        &:active {
          opacity: 0.6;
        }
        &-disable {
          cursor: not-allowed;
          color: grey;
        }
      }
      .list {
        margin: 15px 0 15px 0;
        max-height: 300px;
        &::-webkit-scrollbar {
          width: 0;
        }
        .box {
          padding: 4px;
          &:not(:last-child) {
            margin-bottom: 20px;
          }
          cursor: pointer;
          &-active {
            background: #d70010;
            border-radius: 4px;
          }
          .img {
            width: 31px;
            height: 31px;
            outline: none;
          }
        }
      }
    }
  }
  .unfold-icon {
    font-size: 26px;
  }
  .label-wang {
    border-radius: 100%;
    border: 1px solid #ccc;
    background: #fff;
    width: 42px;
    height: 42px;
    background: url(../../../../assets/img/user.png) 0 0;
    background-size: 100% 100%;
  }
  .label-word {
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    color: #303030;
    display: inline-block;
    text-align: center;
    line-height: 34px;
    padding: 5px;
    cursor: pointer;
    overflow: hidden;
    font-weight: bold;
    white-space: nowrap;
    position: relative;
  }
  .bottom {
    font-size: 20px;
    color: #ffffff;
    .label-wang {
      margin-bottom: 10px;
    }
    .label-open,
    .label-search {
      display: inline-block;
      width: 28px;
      height: 28px;
      border-radius: 4px;
      text-align: center;
      line-height: 28px;
      margin-bottom: 61px;
      color: #525a65;
      cursor: pointer;
    }
    .label-open {
      background: #aab5c8;
    }
    .label-search {
      border: 1px solid #585e65;
      margin-bottom: 12px;
    }
  }
  .shrink-btn {
    color: #ffffff;
    cursor: pointer;
  }
}
.shrink-btn-div-open {
  margin-right: -40px;
  background: #353a43;
  border-radius: 100%;
  padding: 0px 3px 0px 10px;
  float: right;
  height: 38px;
  line-height: 38px;
}
.shrink-btn-div-close {
  margin-right: -40px;
  background: #353a43;
  border-radius: 100%;
  padding: 0px 3px 0px 10px;
  float: right;
  height: 38px;
  line-height: 38px;
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.6s;
}
.slide-fade-enter,
.slide-fade-leave-to {
  opacity: 0;
}
.setting-btn {
  font-size: 20px;
  color: #ffffff;
  cursor: pointer;
}
.showAnimation-enter-active,
.showAnimation-leave-active {
  transition: all 0.5s;
}
.showAnimation-enter,
.showAnimation-leave-to {
  opacity: 0;
}

.setting-fade-enter-active,
.setting-fade-leave-active {
  transition: all 0.5s;
}
.setting-fade-enter,
.setting-fade-leave-to {
  opacity: 0;
}
.setting-btn-right {
  margin-left: 16px;
  margin-right: 15px;
}
.setting-btn-Upright {
  transform: rotate(90deg);
}
.label-wang-in {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background-color: red;
}
.somehelp {
  position: absolute;
  top: 588px;
  right: 25px;
  background-color: #aab5c8;
  display: inline-block;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  border-radius: 100%;
  font-weight: bolder;
  cursor: pointer;
  display: none;
}
.page-left {
  position: absolute;
  top: 200px;
  right: 30px;
  width: 260px;
  height: 620px;
  background: #fff;
  padding: 15px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  z-index: 1002;
}
.page-close {
  position: fixed;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  background-color: rgba(0, 0, 0, 0.5);
}
.tools-menu-small {
  height: 590px;
  width: 100%;
  overflow: auto;
}
.readonlyTo {
  width: 50vw;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;
  z-index: 1001;
  animation: whiteIn 0.8s forwards;
}
.readonlyChild {
  position: absolute;
  top: 0;
  right: 0;
  width: 50vw;
  height: 100vh;
  background-color: #fff;
  padding: 15px;
  animation: whiteIn 0.8s forwards;
  overflow: auto;
}
@keyframes whiteIn {
  0% {
    width: 0;
  }
  100% {
    width: 50vw;
  }
}
.readonlyToX {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  border-radius: 100%;
  background-color: #333;
  color: #fff;
  line-height: 20px;
  text-align: center;
  z-index: 1001;
  cursor: pointer;
}
>>> .el-tree {
  // 不可全选样式
  .el-tree-node {
    .is-leaf + .el-checkbox .el-checkbox__inner {
      display: inline-block;
    }
    .el-checkbox .el-checkbox__inner {
      display: none;
    }
  }
}
</style>
