<template>
  <div v-if="isShow">
    <div
      v-if="mode != 'result'"
      class="absolute w-full top-[calc(100%/12*3.7)] h-[calc(100%/12*1)] flex items-center justify-center"
    >
      <p class="text-black text-2xl font-black">{{ title }}</p>
    </div>
    <div :class="teamContainerNormalMode">
      <div :class="teamFormNormalMode">
        <p class="text-black w-4/12 float-left">選擇組別</p>
        <div class="w-8/12 float-right">
          <div
            class="w-full inline-flex shadow-md hover:shadow-lg focus:shadow-lg"
            role="group"
          >
            <button
              type="button"
              class="w-[50%] rounded-l inline-block px-6 py-2.5 text-black font-medium text-xs leading-tight uppercase"
              value="學生組"
              @click="onClickStudentGroup"
              :style="
                userData.group == '學生組' ? groupBtnActive : groupBtnNormal
              "
            >
              學生組
            </button>
            <button
              type="button"
              class="w-[50%] rounded-r inline-block px-6 py-2.5 text-black font-medium text-xs leading-tight uppercase"
              value="社會組"
              @click="onClickSocialGroup"
              :style="
                userData.group == '社會組' ? groupBtnActive : groupBtnNormal
              "
            >
              社會組
            </button>
          </div>
        </div>
      </div>

      <div :class="teamFormNormalMode">
        <p class="text-black w-4/12 float-left">搜尋學校名稱</p>
        <div class="w-8/12 float-right flex flex-row">
          <input
            :disabled="userData.group != '學生組'"
            class="w-full h-full p-1"
            type="text"
            id=""
            placeholder="輸入學校名稱"
            @input="filterName = $event.target.value"
          />
        </div>
      </div>
      <div :class="mode == 'result' ? teamListResultMode : teamListNormalMode">
        <div
          ref="team"
          :id="t.teamname == '社會組' ? 'social' : null"
          v-for="(t, index) in filterList"
          :key="t.teamname"
          class=""
        >
          <div :class="isUserTeam(t) ? teamFocusClass : teamNormalClass">
            <div class="flex flex-row">
              <img
                v-if="index == 0"
                src="~/assets/icons8-1st-place-medal-48.png"
                width="24px"
                height="24px"
              />
              <img
                v-if="index == 1"
                src="~/assets/icons8-2nd-place-medal-48.png"
                width="24px"
                height="24px"
              />
              <img
                v-if="index == 2"
                src="~/assets/icons8-3rd-place-medal-48.png"
                width="24px"
                height="24px"
              />
              <div v-if="index > 2" style="width: 24px" />
              <p class="pr-1 text-sm self-center text-white">
                {{ "#" + index }}
              </p>
              <p class="text-sm self-center text-white">{{ t.teamname }}</p>
            </div>
            <div>
              <p class="text-white">{{ t.score }}</p>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="mode != 'result'"
        class="flex space-x-2 justify-center mt-[5%]"
      >
        <button
          type="button"
          class="inline-block px-12 py-3 bg-gradient-to-b from-yellow-300 to-yellow-500 hover:from-yellow-200 hover:to-yellow-400 text-gray-600 font-black text-2xl uppercase shadow-md focus:ring-0 active:shadow-lg transition duration-150 ease-in-out border-2 border-yellow-200"
          @click="onProceed"
        >
          {{ proceedBtnLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "JujutsuLeaderboard",
  props: ["list", "show", "mode", "data", "team"],
  data() {
    return {
      isShow: false,
      title: "排行榜",
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
      },
      teamActiveClass: {
        flex: true,
        "flex-row": true,
        "bg-gray-800/20": true,
        "p-2": true,
        "mb-1": true,
        "justify-between": true,
        rounded: true,
        transition: true,
        "duration-150": true,
        "scale-105": true,
        "ease-in-out": true,
        "delay-150": true,
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
      },
      teamListNormalMode: {
        "bg-gray-800/20": true,
        rounded: true,
        relative: true,
        "w-[80%]": true,
        "ml-[10%]": true,
        "mt-[5%]": true,
        "h-[400%]": true,
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
        "h-[350%]": true,
        "overflow-auto": true,
        "px-3": true,
        "py-2": true,
      },
      teamContainerNormalMode: {
        absolute: true,
        "w-full": true,
        "top-[calc(100%/12*4.5)]": true,
        "top-[calc(100%/12*5.5)]": false,
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
      return (
        teamValue.teamname ==
        this.userData.entity.city + this.userData.entity.school
      );
    },
    onClickStudentGroup(e) {
      this.userData.group = e.target.value;

      if (this.mode == "anony") this.filterName = "";
      else if (this.mode == "focus") {
        this.filterName = "";
        this.scrollToUserTeam(".focus-team");
      }
    },
    onClickSocialGroup(e) {
      this.userData.group = e.target.value;

      this.scrollToUserTeam("#social");
    },
    scrollToUserTeam(selector) {
      this.$nextTick(() => {
        console.log("try scroll");
        console.log(this.mode);
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
      console.log("team update");
      console.log(teamData);
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
      this.teamList = arr;
      console.log("current mode:" + this.mode);
      console.log("current show:" + this.isShow);
      if (this.mode != "anony") {
        this.scrollToUserTeam(".focus-team");
      }
    },
  },
  mounted() {},
  computed: {
    filterList() {
      if (this.filterName.length > 0) {
        let arr = [];
        for (var k in this.teamList) {
          if (this.teamList[k].teamname.includes(this.filterName))
            arr.push(this.teamList[k]);
        }
        return arr;
      } else {
        return this.teamList;
      }
    },
  },
  watch: {
    show: function (newVal, oldVal) {
      this.isShow = newVal;
    },
    mode: function (newVal, oldVal) {
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

      switch (newVal) {
        case "anony":
          this.title = "TOP20排行榜";
          this.proceedBtnLabel = "參加比賽";
          break;
        default:
          this.title = "排行榜";
          this.proceedBtnLabel = "繼續";
          break;
      }

      if (newVal == "result") {
        this.teamContainerNormalMode["top-[calc(100%/12*4.5)]"] = false;
        this.teamContainerNormalMode["top-[calc(100%/12*5.5)]"] = true;
        this.teamFormNormalMode["mt-[5%]"] = false;
        this.teamFormNormalMode["mt-[3%]"] = true;
      } else {
        this.teamContainerNormalMode["top-[calc(100%/12*4.5)]"] = true;
        this.teamContainerNormalMode["top-[calc(100%/12*5.5)]"] = false;
        this.teamFormNormalMode["mt-[5%]"] = true;
        this.teamFormNormalMode["mt-[3%]"] = false;
      }
    },
    data: function (newVal, oldVal) {
      console.log("on userdata update");
      console.log(newVal);
      this.userData = newVal;
      console.log(this.userData);
    },
    team: function (newVal, oldVal) {
      this.buildTeamList(newVal);
    },
  },
};
</script>
