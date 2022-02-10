<template>
  <div>
    <div v-if="isShow">
      <LeaderboardDefault
        :mode="mode"
        :focus="focusTeam"
        :filterList="filterList"
        :title="title"
        :proceedBtnLabel="proceedBtnLabel"
        :teamListResultMode="teamListResultMode"
        :teamListNormalMode="teamListNormalMode"
        :teamContainerNormalMode="teamContainerNormalMode"
        @proceed="onProceed"
      />
    </div>
    <div>
      <LeaderboardOverall
        :show="showOverall && step >= 0"
        :mode="'overall'"
        :userData="userData"
        :teamList="teamList"
        :title="title"
        @proceed="onProceed"
      />
    </div>
  </div>
</template>

<script>
import LeaderboardDefault from "./LeaderboardDefault.vue";
export default {
  name: "JujutsuLeaderboard",
  props: ["list", "step", "show", "showOverall", "mode", "data", "team"],
  data() {
    return {
      isShow: false,
      title: "排行榜",
      state: "",
      proceedBtnLabel: "開始遊戲",
      groupBtnActive: {
        backgroundColor: "darkorange",
      },
      groupBtnNormal: {
        backgroundColor: "orange",
      },
      userData: {
        username: "",
        emailaddress: "",
        group: "",
        entity: {
          city: "",
          zone: "",
          school: "",
        },
      },
      teamData: {},
      teamList: [],
      teamNormalClass: {
        flex: true,
        "flex-row": true,
        "bg-gray-800/20": true,
        "p-2": true,
        "mb-1": true,
        "justify-between": true,
        rounded: true,
        "max-h-[40px]": true,
      },
      teamFocusClass: {
        flex: true,
        "flex-row": true,
        "bg-gray-800/60": true,
        "p-2": true,
        "mb-1": true,
        "justify-between": true,
        rounded: true,
        "focus-team": true,
        "max-h-[40px]": true,
      },
      teamListNormalMode: {
        "bg-gray-800/20": true,
        rounded: true,
        relative: true,
        "w-[80%]": true,
        "ml-[10%]": true,
        "mt-[5%]": true,
        // "h-[400%]": true,
        "h-[550%]": true,
        "overflow-auto": true,
        "px-3": true,
        "py-2": true,
      },
      teamListResultMode: {
        "bg-gray-800/20": true,
        rounded: true,
        relative: true,
        "w-[80%]": true,
        "ml-[10%]": true,
        "mt-[3%]": true,
        "h-[430%]": true,
        "overflow-auto": true,
        "px-3": true,
        "py-2": true,
      },
      teamContainerNormalMode: {
        absolute: true,
        "w-full": true,
        "top-[calc(100%/12*4.5)]": true,
        "top-[calc(100%/12*6.3)]": false,
        "h-[calc(100%/12*1)]": true,
      },
      teamFormNormalMode: {
        relative: true,
        "w-[80%]": true,
        "ml-[10%]": true,
        "h-[50%]": true,
        flex: true,
        "items-center": true,
        "mt-[5%]": true,
        "mt-[3%]": false,
      },
      filterName: "",
      focusTeam: "",
    };
  },
  methods: {
    onProceed(e) {
      this.$emit("complete", this.userData);
      this.filterName = "";
    },
    isUserTeam(teamValue) {
      if (teamValue.teamname == "社會組" && this.userData.group == "社會組")
        return true;
      return (teamValue.teamname ==
        this.userData.entity.city + this.userData.entity.school);
    },
    // onClickStudentGroup(e) {
    //   this.userData.group = e.target.value;
    //   if (this.mode == "anony")
    //     this.filterName = "";
    //   else if (this.mode == "focus") {
    //     this.filterName = "";
    //     this.scrollToUserTeam(".focus-team");
    //   }
    // },
    // onClickSocialGroup(e) {
    //   this.userData.group = e.target.value;
    //   this.scrollToUserTeam("#social");
    // },
    scrollToUserTeam(selector) {
      this.$nextTick(() => {
        // console.log("try scroll");
        // console.log(this.mode);
        let el = document.querySelector(selector);
        if (el != null) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      });
    },
    buildTeamList(teamData) {
      // console.log("team update");
      // console.log(teamData);
      //隊伍清單更新
      let arr = [];
      this.teamData = teamData;
      for (const key in teamData) {
        arr.push({
          teamname: teamData[key].teamname,
          score: teamData[key].score,
        });
      }
      //根據分數排序
      arr.sort(function (a, b) {
        return b.score - a.score;
      });
      // if (this.mode == 'anony') {
      //   //匿名模式(主選單)限制20個單位
      //   arr.length = 20;
      // }
      let rankShift = 0;
      for (var i = 0; i < arr.length; i++) {
        if (i > 0) {
          if (arr[i].score == arr[i - 1].score) {
            arr[i].rank = arr[i - 1].rank;
            rankShift--;
          }
          else {
            arr[i].rank = i + rankShift;
          }
        }
        else {
          //名次
          arr[i].rank = i;
        }
      }
      this.teamList = arr;
      // console.log("current mode:" + this.mode);
      // console.log("current show:" + this.isShow);
      console.log("build teamlist");
      this.$nextTick(() => {
        if (this.mode != "anony") {
          this.scrollToUserTeam(".focus-team");
        }
      });
    },
    indexOfUserTeam(arr) {
      for (var i = 0; i < arr.length; i++) {
        if (this.isUserTeam(arr[i]))
          return i;
      }
      return -1;
    },
  },
  mounted() {
    console.log("mode=" + this.mode + " show=" + this.show);
    if (this.mode == "overall")
      this.isShow = true;
    this.state = "hide";
  },
  computed: {
    filterList() {
      let beginArr = this.teamList.concat();
      let idx = this.indexOfUserTeam(this.teamList);

      if (idx >= 0) {
        //beginArr[idx]["isUserTeam"] = true;
        this.focusTeam = this.userData.group == '社會組' ? '社會組' : beginArr[idx].teamname;
      }
      else
        this.focusTeam = '';

      //第一層運算, 根據模式組成隊伍陣列
      switch (this.mode) {
        case "anony":
          beginArr = this.teamList.slice(0, 20);
          break;
        case "focus":
        case "result":
          console.log("show in focus");
          // let idx = this.indexOfUserTeam(this.teamList);
          let min = Math.max(0, idx - 3);
          let med1 = Math.min(idx, this.teamList.length);
          let med2 = Math.max(0, idx);
          let max = Math.min(idx + 4, this.teamList.length);
          let arr1 = this.teamList.slice(min, med1);
          let arr2 = this.teamList.slice(med2, max);
          if(arr1.length>3 || arr2.length>4)
          {
            console.log("incorrect array size, early break");
            break;
          }
          beginArr = arr1.concat(arr2);
          // console.log(arr1);
          // console.log(arr2);
          break;
      }
      //利用第一層的陣列做搜尋欄的篩選
      if (this.filterName.length > 0) {
        let arr = [];
        for (var k in beginArr.length) {
          if (beginArr[k].teamname.includes(this.filterName))
            arr.push(beginArr[k]);
        }
        return arr;
      }
      else {
        return beginArr;
      }
    },
    modeState() {
      if (this.state == "")
        return this.mode;
      return this.mode + "-" + this.state;
    },
  },
  watch: {
    show: function (newVal, oldVal) {
      this.isShow = newVal;
    },
    mode: function (newVal, oldVal) {
      console.log("mode:" + newVal);
      if (newVal == "anony") {
        this.filterName = "";
        this.userData = {
          username: "",
          emailaddress: "",
          group: "",
          entity: {
            city: "",
            zone: "",
            school: "",
          },
        };
      }
      //有anony, focus, 還會追加overall
      switch (newVal) {
        case "anony":
          this.title = "即時校際積分排行";
          this.proceedBtnLabel = "開始遊戲";
          break;
        default:
          this.title = "目前積分排行";
          this.proceedBtnLabel = "繼續";
          break;
      }
      if (newVal == "result") {
        this.teamContainerNormalMode["top-[calc(100%/12*4.5)]"] = false;
        this.teamContainerNormalMode["top-[calc(100%/12*6.3)]"] = true;
        this.teamFormNormalMode["mt-[5%]"] = false;
        this.teamFormNormalMode["mt-[3%]"] = true;
      }
      else {
        this.teamContainerNormalMode["top-[calc(100%/12*4.5)]"] = true;
        this.teamContainerNormalMode["top-[calc(100%/12*6.3)]"] = false;
        this.teamFormNormalMode["mt-[5%]"] = true;
        this.teamFormNormalMode["mt-[3%]"] = false;
      }
    },
    data: function (newVal, oldVal) {
      // console.log("on userdata update");
      // console.log(newVal);
      this.userData = newVal;
      // console.log(this.userData);
    },
    team: function (newVal, oldVal) {
      this.buildTeamList(newVal);
    },
  },
  components: { LeaderboardDefault }
};
</script>
