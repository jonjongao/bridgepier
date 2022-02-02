<template>
  <div v-if="isShow">
    <div
      class="absolute w-full top-[calc(100%/12*3.7)] h-[calc(100%/12*1)] flex items-center justify-center"
    >
      <p class="text-black text-2xl font-black">{{ title }}</p>
    </div>
    <div class="absolute w-full top-[calc(100%/12*4.5)] h-[calc(100%/12*1)]">
      <div class="relative w-[80%] ml-[10%] h-[50%] flex items-center mt-[5%]">
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
              @click="userData.group = $event.target.value"
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
              @click="userData.group = $event.target.value"
              :style="
                userData.group == '社會組' ? groupBtnActive : groupBtnNormal
              "
            >
              社會組
            </button>
          </div>
        </div>
      </div>

      <div class="relative w-[80%] ml-[10%] h-[50%] mt-[5%] flex items-center">
        <p class="text-black w-4/12 float-left">搜尋學校名稱</p>
        <div class="w-8/12 float-right flex flex-row">
          <input
            class="w-full h-full p-1"
            type="text"
            id=""
            placeholder="輸入學校名稱"
            @input=""
          />
        </div>
      </div>
      <div
        class="bg-gray-800/20 rounded relative w-[80%] ml-[10%] mt-[5%] h-[400%] overflow-auto px-2 py-1"
      >
        <div v-for="(t, index) in teamList" :key="t.teamname" class="">
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

      <div class="flex space-x-2 justify-center mt-[5%]">
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
    };
  },
  methods: {
    onProceed(e) {
      this.$emit("complete", this.userData);
    },
    isUserTeam(teamValue) {
      return (
        teamValue.teamname ==
        this.userData.entity.city + this.userData.entity.school
      );
    },
  },
  mounted() {
    let m = this.mode == null ? "" : this.mode;
    switch (m) {
      case "anony":
        this.title = "TOP20排行榜";
        this.proceedBtnLabel = "參加比賽";
        break;
      default:
        this.title = "排行榜";
        this.proceedBtnLabel = "繼續";
        break;
    }
  },
  computed: {},
  watch: {
    show: function (newVal, oldVal) {
      this.isShow = newVal;
    },
    mode: function (newVal, oldVal) {},
    data: function (newVal, oldVal) {
      console.log("on userdata update");
      console.log(newVal);
      this.userData = newVal;
      console.log(this.userData);
    },
    team: function (newVal, oldVal) {
      console.log("team update");
      console.log(newVal);
      let arr = [];
      this.teamData = newVal;
      // newVal.keys().forEach(el => {
      //   console.log(el);
      //   arr.push({
      //     teamname: el.teamname,
      //     score: el.score
      //   });
      // });
      for (const key in newVal) {
        console.log(newVal[key]);
        arr.push({
          teamname: newVal[key].teamname,
          score: newVal[key].score,
        });
      }
      arr.sort(function (a, b) {
        return b.score - a.score;
      });
      this.teamList = arr;

      this.$nextTick(() => {
        let el = document.querySelector(".focus-team");
        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      });
    },
  },
};
</script>
