<template>
  <div class="home w100 h100 flex a-center j-start flex-column homezz">
    <div class="top flex a-center j-between flex-row flex1 flex-shrink">
      <div class="right flex a-end j-center flex-column">
        <div class="bottom-card a-center j-between flex-row">
          <div
            class="top-card flex j-start flex-row skin-shadow"
            :class="{
              backgroundColor:
                index === 0 ? 'skin-wbgColor-1' : 'skin-wbgColor-2',
            }"
          >
            <div
              class="top-card-left flex-shrink skin-bgColor flex a-center j-center"
            >
              <img src="../../../../styles/image/c3.png" class="img" />
            </div>
            <div class="top-card-right">
              <div class="title">待办事项</div>
              <div v-for="(text, index) in todoData" :key="index" class="line">
                <span @click="toDoJumpFlow(text, index)" class="notes-text">{{
                  text.applyTitle
                }}</span>
                &lt;!&ndash;
                <span
                  v-if="text.icon"
                  :style="{ color: text.iconColor, width: text.width }"
                  class="icon"
                  >{{ text.icon }}</span
                >
                &ndash;&gt;
              </div>
              <span class="card-more" @click="gotodowork()">更多</span>
            </div>
          </div>
          <!--          <div class="top-card-box">-->
          <div
            v-for="(item, index) in cardList"
            :key="index"
            class="top-card flex j-start flex-row skin-shadow"
            :class="{
              backgroundColor:
                index === 0 ? 'skin-wbgColor-1' : 'skin-wbgColor-2',
            }"
          >
            <div
              class="top-card-left flex-shrink skin-bgColor flex a-center j-center"
            >
              <img :src="item.img" class="img" />
            </div>
            <div class="top-card-right">
              <div class="title">{{ item.title }}</div>
              <div v-for="(text, i) in item.des" :key="i" class="line">
                <span @click="toDoJump(text.index, index)" class="notes-text">{{
                  text.text
                }}</span>
                <span
                  v-if="text.icon"
                  :style="{ color: text.iconColor, width: text.width }"
                  class="icon"
                  >{{ text.icon }}</span
                >
                <i
                  v-if="text.iconStatus"
                  :class="text.iconStatus"
                  :style="{ color: text.iconColor }"
                ></i>
              </div>
              <span class="card-more" @click="moreJump(item)">更多</span>
            </div>
          </div>
          <!--          </div>-->
        </div>
      </div>
      <div>
        <toolsTemplateIndex />
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogFormVisible"
      top="10vh"
      title="消息详情"
      width="50%"
      v-model="this.PopUpContent"
      :close-on-click-modal="false"
    >
      <span class="visible-span">消息标题</span>
      <p class="visible-p1">{{ this.PopUpContent[0].text }}</p>
      <span class="visible-span">消息内容</span>
      <p class="visible-p2">{{ this.PopUpContent[0].content }}</p>
    </el-dialog>
  </div>
</template>

<script>
import { getRemindByDescTime, updateRemind } from "@/api/base/base";
import { getRunTaskRelByPage } from "@/api/analysis/auditmodelresult";
import toolsTemplateIndex from "@/components/public/base/tools-template-index.vue";
import { auditDataList } from "@/api/starflow";
import dayjs from "dayjs";
export default {
  components: {
    toolsTemplateIndex,
  },
  data() {
    return {
      resultSpiltObjects: {},
      work: [
        {
          text: "暂无待办事项",
        },
      ],
      cardList: [
        {
          img: require("../../../../styles/image/提醒.png"),
          title: "提醒事项",
          path: "",
          des: [],
        },
        {
          img: require("../../../../styles/image/c1.png"),
          title: "审计预警",
          path: "",
          des: [],
        },
      ],
      TopTodo: [
        {
          text: "暂无待办事项",
          iconColor: "#D81020",
          icon: "",
          url: "",
          title: "",
          content: "",
        },
      ],
      pageQuery: {
        condition: {},
        pageNo: 1,
        pageSize: 5,
      },
      warningMatters: [
        {
          text: "暂无预警事项",
          iconColor: "#D81020",
          icon: "",
          url: "",
          title: "",
          content: "",
        },
      ],
      dialogFormVisible: false,
      PopUpContent: [
        {
          text: "",
          content: "",
        },
      ],
      todoData: [], //待办工作流
      //审核信息的状态
      applyInfo: {
        //业务主键
        appDataUuid: "",
        //版本
        versionUuid: "",
        //业务主键批量提交
        detailUuids: "",
        //业务审核状态,0未提交，1审核中，2审核中，3审核不通过
        status: "",
        //业务方法的成功失败0成功，1失败
        mstate: "",
        //流程方法的成功失败0成功，1失败
        fstate: "",
        //是否更新业务代码
        isUpdate: "",
        //流程方法的成功失败0成功，1失败
        Newfstate: "",
        //收回，终止业务方法的成功失败0成功，1失败
        newMstate: "",
      },
      applyDetail: {
        type: "",
        isEdit: false,
      },
      flowSet: {
        opinionList: true,
        opinion: true,
        nextStep: true,
        done: false,
      },
      //初始化审批页面参数
      flowItem: {
        wftype: "",
        applyUuid: "",
        detailUuids: "",
        versionUuid: "",
        workEffortId: "",
        activityId: "",
      },
      projectStatus: "",
    };
  },
  mounted() {
    getRemindByDescTime().then((resp) => {
      this.cardList[0].des = [];
      for (let i = 0; i < 5; i++) {
        this.cardList[0].des.push({
          text: resp.data.records[i].remindTitle,
          iconColor: "#D81020",
          icon: "",
          url: resp.data.records[i].modeUrl,
          content: resp.data.records[i].remindContent,
          index: i,
          Uuid: resp.data.records[i].remindUuid,
        });
        if (resp.data.records[i].readStatus === 0) {
          this.cardList[0].des[i].icon = " NEW";
        }
      }
    });
    let query1 = { runTaskUuid: null };
    query1.runTaskUuid = "1";
    this.pageQuery.condition = query1;
    getRunTaskRelByPage(this.pageQuery, this.resultSpiltObjects).then(
      (resp) => {
        // this.warningMatters = resp.data.records;
        this.cardList[1].des = [];
        for (let i = 0; i < 5; i++) {
          this.cardList[1].des.push({
            text:
              resp.data.records[i].model.modelName +
              "—" +
              dayjs(resp.data.records[i].runStartTime).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
            url: `/analysis/warningresult/${resp.data.records[i].runTaskUuid}`,
            content: resp.data.records[i].remindContent,
            index: i,
            Uuid: resp.data.records[i].runTaskUuid,
          });
          if (resp.data.records[i].runStatus == 1) {
            this.cardList[1].des[i].iconStatus = "el-icon-video-play";
            this.cardList[1].des[i].iconColor = "blue";
          } else if (resp.data.records[i].runStatus == 2) {
            this.cardList[1].des[i].iconStatus = "el-icon-loading";
            this.cardList[1].des[i].iconColor = "#666666";
          } else if (resp.data.records[i].runStatus == 3) {
            this.cardList[1].des[i].iconStatus = "el-icon-success";
            this.cardList[1].des[i].iconColor = "green";
          } else if (resp.data.records[i].runStatus == 5) {
            this.cardList[1].des[i].iconStatus = "el-icon-circle-close";
            this.cardList[1].des[i].iconColor = "#ff0000";
          } else {
            this.cardList[1].des[i].iconStatus = "el-icon-error";
            this.cardList[1].des[i].iconColor = "red";
          }
        }
      }
    );
    this.gettodowork();
  },
  methods: {
    formatter(num) {
      return num < 10 ? "0" + num.toFixed(0) : num.toFixed(0);
    },
    formatter1(num) {
      return num.toFixed(1);
    },
    activeTags(item) {
      this.$store.commit("aceState/setRightFooterTags", {
        type: item.type,
        val: item.val,
      });
    },
    toDoJumpFlow(row, index) {
      if (row.currentState == "CAL_SENT") {
        this.updateToAccepted(row);
        if (!this.partyAssignment) {
          this.common.alertMsg(4, "数据更新失败");
          return;
        }
      }
      this.applyInfo.appDataUuid = row.appDataUuid;
      this.applyInfo.versionUuid = row.versionUuid;
      this.applyInfo.detailUuids = row.detailUuids;
      //待办列表里，默认审核状态是审核中value=1
      this.applyInfo.status = "1";
      //待办列表里，默认业务方法执行状态是空
      this.applyInfo.mstate = "";
      //待办列表里，默认流程方法执行状态是空
      // this.applyInfo.fstate = "";
      //待办列表里，默认流程方法执行状态是空
      this.applyInfo.newFstate = "";
      //业务数据是否更新过业务代码
      // this.applyInfo.isUpdate = "";
      //初始化vuex里的审核状态，或者覆盖之前存储的值
      this.$store.dispatch("applyInfo/setApplyInfo", this.applyInfo);
      //跳转页面，name值可以动态获取row.apptype;
      this.applyDetail.type = row.applyType;
      this.flowItem.applyUuid = row.applyUuid;
      this.flowItem.appDataUuid = row.appDataUuid;
      this.flowItem.versionUuid = row.versionUuid;
      this.flowItem.detailUuids = row.detailUuids;
      //用来区分主子项目
      this.flowItem.planTag = row.temp2;
      console.log(this.applyDetail.type);
      this.flowItem.workEffortId = row.workEffortId;
      this.flowItem.temp1 = row.temp1;
      this.flowItem.wftype = this.dict.flowValueFun(row.applyType);
      this.rojectType = row.workflowPackageId;
      this.$router.push({
        name: "todoDetail",
        params: {
          approvalData: row,
          applyDetail: this.applyDetail,
          flowSet: this.flowSet,
          flowItem: this.flowItem,
          projectStatus: this.projectStatus,
        },
      });
    },
    toDoJump(data, index) {
      if (index == 0) {
        // 判断条件增加空判断
        if (
          this.cardList[0].des[data].url === "" ||
          this.cardList[0].des[data].url == null
        ) {
          this.dialogFormVisible = true;
          this.PopUpContent = [];
          this.PopUpContent.push({
            text: this.cardList[0].des[data].text,
            content: this.cardList[0].des[data].content,
          });
          // 点击提醒事项会直接刷新页面
          // location.reload();
        } else {
          this.$router.push({ path: this.cardList[0].des[data].url });
        }
        updateRemind(this.cardList[0].des[data].Uuid).then((result) => {
          if (result.code === 0) {
            this.getList();
          } else {
            this.$notify({ success: "失败", message: "标记已阅失败" });
          }
        });
      } else {
        console.log(this.cardList[1].des[data].url);
        this.$router.push({ path: this.cardList[1].des[data].url });
      }
    },
    getList() {
      // 刷新提醒事项
      getRemindByDescTime().then((resp) => {
        this.cardList[0].des = [];
        for (let i = 0; i < 5; i++) {
          this.cardList[0].des.push({
            text: resp.data.records[i].remindTitle,
            iconColor: "#D81020",
            icon: "",
            url: resp.data.records[i].modeUrl,
            content: resp.data.records[i].remindContent,
            index: i,
            Uuid: resp.data.records[i].remindUuid,
          });
          if (resp.data.records[i].readStatus === 0) {
            this.cardList[0].des[i].icon = " NEW";
          }
        }
      });
    },
    gettodowork() {
      let params = {
        applyTitle: "",
        applyTypeName: "",
        pageNo: 1,
        pageSize: 5,
      };
      auditDataList(params).then((res) => {
        console.log(res, "ress");
        // this.todoData = response.data.data.entities;
      });
      // this.$axios
      //   .get("/starflow/applyMes/sf/apply/auditDataList", {
      //     params: {
      //       applyTitle: '',
      //       applyTypeName: '',
      //       pageNo: 1,
      //       pageSize: 5,
      //     },
      //   })
      //   .then((response) => {
      //     console.log(response,"222");
      //     this.todoData = response.data.data.entities;
      //     // this.todoTotal = response.data.data.count;
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   });
    },
    gotodowork() {
      this.$router.push({
        path: "/todowork",
      });
    },
    moreJump(data) {
      if (data.title === "提醒事项") {
        this.$router.push({ path: "/base/remind" });
        this.$store.commit("aceState/setRightFooterTags", {
          type: "active",
          val: {
            name: "系统提醒",
            path: "/base/remind",
          },
        });
      } else {
        this.$router.push({ path: "/analysis/auditwarning" });
        this.$store.commit("aceState/setRightFooterTags", {
          type: "active",
          val: {
            name: "预警结果",
            path: "/analysis/warningresult",
          },
        });
      }
    },
    toDoSomeJump() {
      this.$router.push({
        path: "/base/frameto?url=psbcaudit/todoInfo/todoInfoList",
      });
    },
    displayItem(data) {
      let thisItem = document.getElementsByClassName("bottom");
      for (let i = 0; i < thisItem.length; i++) {
        thisItem[i].style.zIndex = 1;
      }
      thisItem[data].style.zIndex = 10;
    },
    action(data, index) {
      if (data === "before") {
        if (index + 1 === 4) {
          index = -1;
        }
        this.displayItem(index + 1);
      } else if (data === "next") {
        if (index - 1 === -1) {
          index = 4;
        }
        this.displayItem(index - 1);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.homezz {
  height: calc(100vh) !important;
  background: #fff url("../../../../styles/image/bg.png") left center no-repeat !important;
  background-size: 100% 100% !important;
}
.home {
  //background: #FFFFFF;
  // background-size: 82%;
  // background-position-x: -130px;
  // background-position-y: 2px;
  padding-bottom: 12px;
  .top {
    // background: grey;
    width: 85%;
    margin-left: 5%;
    margin-right: 5%;
    .left {
      flex: 1;
      height: 100%;
      position: relative;
      top: -57px;
      .day-wrap {
        width: 100%;
        height: 450px;
        background: url("../../../../styles/image/bg-home@2x.png") no-repeat
          center center;
        background-size: 465px 443px;
        .num {
          font-family: BebasNeue;
          font-size: 236px;
          color: #d70010;
          letter-spacing: 7px;
          text-align: center;
          text-shadow: 0 15px 12px rgba(138, 0, 11, 0.25);
        }
        .text {
          font-family: PingFangSC-Medium;
          font-size: 34px;
          color: #070707;
          letter-spacing: 0.85px;
          text-align: center;
          top: 50%;
          margin-top: 110px;
        }
      }
      .calendar-wrap {
        border-radius: 13px;
        width: 386px;
        height: 90px;
        border: 1px solid #eb3a52;
        margin-top: 20px;
        .enlarge {
          top: 10px;
          right: 10px;
          height: 12px;
          width: 12px;
          cursor: pointer;
        }
        .box {
          width: 37px;
          height: 56px;
          font-size: 12px;
          color: #6b6e76;
          text-align: center;
          line-height: 14px;
          &:not(:last-child) {
            margin-right: 14px;
          }
          &-active {
            border: 1px solid #ff6599;
            box-shadow: 0 4px 16px -4px #1a1c1f,
              inset 1px 1px 3px 0 rgba(0, 0, 0, 0.5);
            border-radius: 8px;
            color: #d70010;
          }
          .label {
            font-family: PingFangSC-Light;
            margin-bottom: 8px;
          }
          .value {
            font-family: Helvetica;
          }
        }
      }
    }
    .right {
      // width: 500px;
      position: relative;
      top: -30px;
      .top-card-box {
        display: flex;
      }
      .top-card {
        background: #ffffff;
        box-shadow: 17px 17px 34px 0 rgba(0, 0, 0, 0.1);
        border-radius: 25.2px;
        padding: 27px;
        width: 23vw;
        min-width: 450px;
        position: relative;
        margin: 20px;
        height: 230px;
        &-left {
          background: #ffffff;
          border: 1px solid #d8d8d8;
          border-radius: 12.6px;
          width: 67px;
          height: 67px;
          margin-right: 27px;
          .img {
            width: 36px;
          }
        }
        &-right {
          // width: calc(100% - 67px -27px - 27px);
          .title {
            font-family: PingFangSC-Regular;
            font-size: 20.16px;
            color: #333333;
            line-height: 26.88px;
            margin-bottom: 14px;
          }
          .des {
            font-family: PingFangSC-Regular;
            font-size: 14.7px;
            color: rgba(51, 51, 51, 0.5);
            text-align: justify;
            line-height: 29.57px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
        }
      }
      .bottom-card {
        width: 50vw;
        min-width: 600px;
        margin-top: 40px;
        position: relative;
      }
      .daiban {
        width: 48vw;
        min-width: 540px;
        margin-top: 50px;
      }
    }
  }
  .bottom {
    height: 106px;
    width: 90%;
    background: #559ed4;
    box-shadow: 10px 10px 20px 0 rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    position: absolute;
    user-select: none;
    .line3,
    .line2 {
      width: 20%;
    }
    .line4 {
      .btn {
        background: #c8ff8c;
        border-radius: 24px;
        width: 213px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #333333;
        letter-spacing: 2.8px;
        cursor: pointer;
      }
    }
    .line1 {
      padding-left: 30px;
      width: 30%;
      .right {
        .p1 {
          font-family: PingFangSC-Regular;
          font-size: 24px;
          color: #ffffff;
          line-height: 70px;
          width: 520px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: center;
        }
        .p2 {
          font-family: PingFangSC-Semibold;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
          line-height: 20px;
        }
      }
    }
    .line {
      text-align: left;
      height: 100%;
      &:not(:last-child) {
        border-right: 1px solid #21364e;
      }
      .title {
        font-family: PingFangSC-Semibold;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.5);
        text-align: center;
        line-height: 24px;
      }
      .count-font {
        font-family: BebasNeue;
        font-size: 56px;
        color: #ffffff;
        height: 60px;
        line-height: 60px;
      }
    }
  }
}
.card-more {
  position: absolute;
  right: 20px;
  bottom: 5px;
  font-family: PingFangSC-Regular;
  font-size: 13.5px;
  color: #559ed4 !important;
  letter-spacing: 0;
  text-align: justify;
  line-height: 22px;
  cursor: pointer;
}
.visible-span {
  width: 95%;
  margin: 2.5% 2.5% 0.5%;
  display: inline-block;
  font-size: 24px;
}
.visible-p1 {
  width: 95%;
  margin: 0.5% 2.5% 2.5%;
  padding: 10px;
  border: 1px solid #ddfdff;
  font-size: 16px;
  border-radius: 6px;
  display: inline-block;
  height: 40px;
  overflow: auto;
}
.visible-p2 {
  width: 95%;
  margin: 0.5% 2.5% 2.5%;
  padding: 10px;
  border: 1px solid #ddfdff;
  font-size: 16px;
  border-radius: 6px;
  display: inline-block;
  line-height: 27px;
  height: 400px;
  overflow: auto;
}
.notes-text {
  line-height: 25px;
  cursor: pointer;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: calc(100% - 40px);
  display: inline-block;
}
.title-bottom {
  font-size: 18px;
  font-family: PingFangSC-Semibold;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  line-height: 24px;
}
.title-bottom-top {
  font-size: 18px;
  font-family: PingFangSC-Semibold;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  line-height: 24px;
}
.date {
  font-family: BebasNeue;
  font-size: 30px;
  color: #fff;
  height: 60px;
  line-height: 70px;
}
.right {
  height: 60px;
}
.bottom-father {
  height: 124px;
  width: 100%;
  position: relative;
  margin-top: 20px;
}
.top-card-right {
  table-layout: fixed;
  width: 80%;
}
.bottom-after {
  content: "";
  display: block;
  width: 86%;
  height: 18px;
  border-bottom-left-radius: 100px;
  border-bottom-right-radius: 100px;
  position: absolute;
  bottom: 0;
  left: 7%;
  color: #fff;
  text-align: center;
}
.bottom-animate {
  animation: booani 0.6s linear forwards;
}
@keyframes booani {
  0% {
    width: 0;
    height: 0;
    bottom: 18px;
    left: 50%;
  }
  30% {
    height: 80px;
    width: 85%;
    bottom: 18px;
    left: 7.5%;
  }
  80% {
    height: 130px;
    width: 100%;
    bottom: 18px;
    left: 0;
  }
  100% {
    height: 106px;
    width: 90%;
    bottom: 18px;
    left: 5%;
  }
}
.showDetailedIn {
  width: 40%;
  height: 20%;
  margin-top: 30%;
  display: inline-block;
  font-size: 24px;
  margin-right: 2.5%;
  text-align: left;
  margin-left: 2.5%;
}
.showDetailedOut {
  width: 40%;
  height: 20%;
  margin-bottom: 20%;
  display: inline-block;
  font-size: 24px;
  margin-right: 2.5%;
  text-align: left;
  margin-left: 2.5%;
}
.showDetailedIn span {
  display: inline-block;
  width: 60px;
  height: 60px;
  border-radius: 100%;
  background-color: #888;
  float: left;
  line-height: 60px;
  margin-top: -12px;
  text-align: center;
  margin-right: 10px;
  font-size: 24px;
  font-weight: bold;
  color: #fff;
}
.showDetailedOut span {
  display: inline-block;
  width: 60px;
  height: 60px;
  border-radius: 100%;
  background-color: #888;
  float: left;
  line-height: 60px;
  margin-top: -12px;
  text-align: center;
  margin-right: 10px;
  font-size: 24px;
  font-weight: bold;
  color: #fff;
}
</style>
