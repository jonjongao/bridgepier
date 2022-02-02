<template>
  <div
    id="unity-container"
    class="relative bg-gray-100 w-full max-w-[414px] max-h-[796px]"
    :style="{ height: respHeight + 'px' }"
    ref="unityContainer"
  >
    <canvas
      id="unity-canvas"
      :width="respWidth + 'px'"
      :height="respHeight + 'px'"
      class="w-full"
    ></canvas>
    <div id="unity-loading-bar">
      <div id="unity-logo"></div>
      <div id="unity-progress-bar-empty">
        <div id="unity-progress-bar-full"></div>
      </div>
    </div>

    <!-- <Checker /> -->

    <Firebase ref="firebase" @team-update="onTeamUpdate" />
    <JujutsuLeaderboard :show="step==state.titleLeaderboard" :mode="'anony'" @complete="onTitleLeaderboardComplete" />
    <JujutsuRegist :show="step==state.regist" :firebase="firebaseInstance" @complete="onRegistComplete" />
    <JujutsuLeaderboard :show="step==state.userLeaderboard" :team="teamData" :mode="'focus'" :data="userData" @complete="onUserLeaderboardComplete" />
    <JujutsuGame :show="step==state.gameplay" :team="teamData" :data="userData" :game="gameResultData" />
  </div>
</template>

<style></style>

<script>
export default {
  name: "NuxtTutorial",
  components: {},
  directives: {},
  data() {
    return {
      unityInstance: null,
      firebaseInstance:null,
      w2hRatio: 1.922705314009662,
      h2wRatio: 0.5201005025125628,
      sliderHeightRatio: 0.3015075376884422,
      respHeight: 796,
      respWidth: 414,
      nowState: "",
      userData: null,
      teamData:null,
      gameResultData:null,
      step: -1,
      state: {
        none: -1,
        titleLeaderboard: 0,
        regist: 1,
        userLeaderboard: 2,
        gameplay: 3,
        result:4
      },
    };
  },
  beforeMount() {
    document.addEventListener("onReceiveEventFromUnity", (e) => {
      console.log(e.detail);
      const j = JSON.parse(e.detail);
      const key = j["state"];
      switch(key)
      {
        case "game-result":
          if (j["data"] == "") return;
          const data = JSON.parse(j["data"]);
          const numFeededFinger = data["feeded"];
          const numKill = data["killed"];
          const lvl = data["lvl"];
          const score = data["score"];
          this.gameResultData={
            feeded:numFeededFinger,
            killed:numKill,
            lvl:lvl,
            score: score
          };

          this.firebaseInstance.updateTeam(this.userData, this.gameResultData);
          break;
      }
    });
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    document.addEventListener("onUnityInstanceCreated", (e) => {
      let instance = e.detail;
      this.unityInstance = e.detail;
      document.addEventListener("click", function (e) {
        if (e.target.id == "unity-canvas") {
          // Clicked on canvas
          document.activeElement.blur();
          instance.SendMessage("Main Camera", "FocusCanvas", "1");
        } else {
          // Clicked outside of canvas
          instance.SendMessage("Main Camera", "FocusCanvas", "0");
        }
      });

      document.addEventListener("touchend", function (e) {
        if (e.target.id == "unity-canvas" && e.touches.length == 1) {
          // Clicked on canvas
          document.activeElement.blur();
          instance.SendMessage("Main Camera", "FocusCanvas", "1");
        } else {
          // Clicked outside of canvas
          instance.SendMessage("Main Camera", "FocusCanvas", "0");
        }
      });

      this.postMessageToParent("game-initialized", "200");

      
    });

    this.onResize();

    this.step=this.state.titleLeaderboard;

    this.firebaseInstance = this.$refs.firebase;

    
  },
  unmounted() {
    window.removeEventListener("resize", this.onResize);
    document.removeEventListener("onUnityInstanceCreated");
  },
  methods: {
    onResize() {
      if (this.$refs.unityContainer == null) {
        this.respWidth = 414;
        this.respHeight = 796;
      } else {
        this.respWidth = this.$refs.unityContainer.clientWidth;
        this.respHeight =
          this.$refs.unityContainer.clientWidth * 1.922705314009662;
      }
      document.querySelector("#unity-canvas").style.width =
        this.respWidth + "px";
      document.querySelector("#unity-canvas").style.height =
        this.respHeight + "px";
    },
    postMessageToParent(type, data) {
      const e = {
        key: type,
        value: data,
      };
      window.parent.postMessage(e, "*");
      console.log("game post message:", e);
    },
    onRegistComplete(userData){
      console.log("regist complete:"+userData);
      this.userData = userData;
      this.firebaseInstance.getTeam();
      // this.step=this.state.userLeaderboard;
    },
    onTitleLeaderboardComplete(e){
      this.step=this.state.regist;
      // this.onUserLeaderboardComplete();
    },
    onUserLeaderboardComplete(e){
      this.step=this.state.gameplay;
      if (this.unityInstance != null)
          this.unityInstance.SendMessage("Main Camera", "StartPlay");
    },
    onTeamUpdate(teamData)
    {
      this.teamData = teamData;
      this.step=this.state.userLeaderboard;
    }
  },
  computed: {
    userBirthdayYYYYMMDD: {
      get: function () {
        return (
          this.userBirthday.year +
          "-" +
          this.userBirthday.month +
          "-" +
          this.userBirthday.day
        );
      },
      set: function (years, months, dates) {
        this.userBirthday.year = years;
        this.userBirthday.month = months;
        this.userBirthday.day = dates;
      },
    },
    nowYYYYMMDD() {
      const d = new Date();
      const mm = d.getMonth() + 1; // getMonth() is zero-based
      const dd = d.getDate();
      d.getHours();
      d.getMinutes();
      d.getSeconds();

      return [
        d.getFullYear(),
        mm.toLocaleString("zh-TW", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        }),
        dd.toLocaleString("zh-TW", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        }),
      ].join("-");
    },
  },
};
</script>
