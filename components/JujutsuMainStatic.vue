<template>
  <div
    id="unity-container"
    class="relative bg-gray-100 w-full max-w-[414px] max-h-[796px]"
    :style="{ height: respHeight + 'px' }"
    ref="unityContainer"
  >

    <img src="../assets/game_bg.jpg"/>
    <!-- <Checker /> -->
    <div class="absolute w-full h-full top-0" v-if="step != state.gameplay" />
    <Firebase ref="firebase" @team-update="onTeamUpdate" @team-update-unit="onTeamUpdateInUnit" />
  
    <!-- <JujutsuResult
      :show="step == state.result"
      @click-return="onClickReturn"
      @click-download="onClickDownloadApp"
      @click-share="onClickFacebookShare"
    />
   
    <JujutsuRegist
      :show="step == state.regist"
      :firebase="firebaseInstance"
      @complete="onRegistComplete"
    />
    <JujutsuGame
      :show="step == state.gameplay"
      :team="teamData"
      :data="userData"
      :game="gameResultData"
      :gameUpdate="gameUpdateData"
    /> -->
     <JujutsuLeaderboard
      ref="leaderboard"
      :step="step"
      :show="canShowLeaderboard"
      :showOverall="canShowOverallLeaderboard"
      :team="teamData"
      :mode="leaderboardMode"
      :data="userData"
      @complete="onLeaderboardComplete"
    />

    <Modal :data="modalData" @modal-confirm="onModalConfirm" />
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
      modalData: {
        show: false,
        message: "",
        class: "",
        callback: null,
        confirm: "確定"
      },
      unityInstance: null,
      firebaseInstance: null,
      w2hRatio: 1.922705314009662,
      h2wRatio: 0.5201005025125628,
      sliderHeightRatio: 0.3015075376884422,
      respHeight: 796,
      respWidth: 414,
      nowState: "",
      userData: null,
      teamData: null,
      gameResultData: null,
      gameUpdateData: {
        feeded: 0,
        killed: 0,
        lvl: 1,
        score: 0,
      },
      step: -1,
      state: {
        none: -1,
        titleLeaderboard: 0,
        regist: 1,
        userLeaderboard: 2,
        gameplay: 3,
        result: 4,
      },
      shareUrl: "https://pubgm-2022-firstquarter-event.com.tw",
      downloadUrl: "https://pubgm.tw/tigeryear",
      leaderboardMode: "",
    };
  },
  beforeMount() {
    
    
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    
    this.$post2parent.message({ key: 'game-initialized', value: 200 });

    this.onResize();

    this.firebaseInstance = this.$refs.firebase;

    this.firebaseInstance.getTeam();

     this.setStep(this.state.titleLeaderboard);
  },
  unmounted() {
    window.removeEventListener("resize", this.onResize);
    document.removeEventListener("onUnityInstanceCreated");
  },
  methods: {
    parseGameData(json) {
      const data = JSON.parse(json);
      const numFeededFinger = data["feeded"];
      const numKill = data["killed"];
      const lvl = data["lvl"];
      const score = data["score"];
      return {
        feeded: numFeededFinger,
        killed: numKill,
        lvl: lvl,
        score: score,
      };
    },
    onModalConfirm(e) {
      if (this.modalData.callback != null) this.modalData.callback();
      this.modalData = {
        show: false,
        message: "",
        callback: null,
        confirm: "確定",
      };
    },
    onResize() {
      if (this.$refs.unityContainer == null) {
        this.respWidth = 414;
        this.respHeight = 796;
      } else {
        this.respWidth = this.$refs.unityContainer.clientWidth;
        this.respHeight =
          this.$refs.unityContainer.clientWidth * 1.922705314009662;
      }
    
    },
    setStep(state) {
      // console.log("set state to:" + state);
      switch (state) {
        case this.state.none:
          break;
        case this.state.titleLeaderboard:
          this.leaderboardMode = "anony";
          this.gameUpdateData = {
            feeded: 0,
            killed: 0,
            lvl: 1,
            score: 0,
          };
          // console.log("set anony");
          this.$post2parent.message({ key: 'on-mainmenu', value: 200 });
          break;
        case this.state.regist:
          this.$post2parent.message({ key: 'on-registering', value: 200 })
          break;
        case this.state.userLeaderboard:
          this.leaderboardMode = "focus";
          // console.log("set focus");
          break;
        case this.state.gameplay:
          this.$post2parent.message({ key: 'on-startplay', value: 200 })
          break;
        case this.state.result:
          this.leaderboardMode = "result";
          // console.log("set result");
          this.$post2parent.message({ key: 'on-result', value: 200 })
          break;
      }
      this.step = state;
    },
    onRegistComplete(userData) {
      // console.log("regist complete:" + userData);
      this.userData = userData;
      this.setStep(this.state.userLeaderboard);
      this.firebaseInstance.addOnPlaytime(this.userData);
    },
    onTitleLeaderboardComplete(e) {
      // this.step=this.state.regist;
      this.setStep(this.state.regist);
      // this.onUserLeaderboardComplete();
    },
    onUserLeaderboardComplete(e) {
      // this.step=this.state.gameplay;
      this.setStep(this.state.gameplay);

      this.modalData = {
        show: true,
        message: "點擊宿儺手指\n提升三級盔先生武器\n下方能量條集滿後\n攻擊武器會升等\n同時增加攻擊傷害\n挑戰限時內擊敗更多敵人\n提升校際積分！\n\n點擊開始後將立即開始遊戲",
        class: "text-sm mobile:text-base",
        confirm: "開始！",
        callback: () => {
          this.unityInstance.SendMessage("Main Camera", "WaitAndStart");
        },
      };

      if (this.unityInstance != null) {
        if (this.userData.gameuid == "") {
          // console.log("user play in normal mode");
          this.unityInstance.SendMessage("Main Camera", "PlayInNormalMode");
        } else {
          // console.log("user play in bonus mode");
          this.unityInstance.SendMessage("Main Camera", "PlayInBonusMode");
        }
        this.unityInstance.SendMessage("Main Camera", "StartPlay");
      }
    },
    onTeamUpdate(teamData) {
      this.teamData = teamData;
      // console.log("---on team update all");
      // console.log(this.teamData);
      // console.log("--------");
      if (this.step == this.state.regist)
        this.setStep(this.state.userLeaderboard);
      // this.step=this.state.userLeaderboard;
    },
    onTeamUpdateInUnit(team) {
      // console.log("---on team update:" + team.key);
      //如果當前teamData已有該隊伍的key
      if (this.teamData != null && this.teamData.hasOwnProperty(team.key)) {
        this.teamData[team.key].score = team.data.score;
        // console.log("update " + team.key + " score to " + team.data.score);
        this.$refs.leaderboard.buildTeamList(this.teamData);
      }
      //如果是新隊伍
      else {
        if (this.teamData == null) this.teamData = {};
        this.teamData[team.key] = team.data;
        // console.log("ref new team");
        // console.log("regist " + team.key + " with data " + team.data.score);
        this.$refs.leaderboard.buildTeamList(this.teamData);
      }
    },
    onLeaderboardComplete(e) {
      switch (this.step) {
        case this.state.titleLeaderboard:
          this.onTitleLeaderboardComplete();
          break;
        case this.state.userLeaderboard:
          this.onUserLeaderboardComplete();
          break;
        case this.state.result:
          // console.log("on result leaderboard complete");
          break;
      }
    },
    onClickReturn(e) {
      if (this.unityInstance != null)
        this.unityInstance.SendMessage("Main Camera", "Return");
      this.$post2parent.message({ key: 'click-return', value: 200 })
    },
    onClickDownloadApp(e) {
      window.open("https://pubgm.tw/tigeryear");
      this.$post2parent.message({ key: 'download-app', value: 200 })
    },
    onClickFacebookShare(e) {
      FB.ui(
        {
          method: "share",
          hashtag: "#絕地盃宿儺手指校際賽",
          href: "https://pubgm-2022-firstquarter-event.com.tw/sukunafinger1/",
        },
        function (response) { }
      );
      this.$post2parent.message({ key: 'fb-share', value: 200 })

      if (this.userData.maxtime == 6) {
        // console.log("already boost maxplaytime");
        this.modalData = {
          show: true,
          message: "已領過今日的分享增益，請明日再回來分享以獲得增益",
        };
      } else {
        this.firebaseInstance.addBonusMaxPlaytime(this.userData);
        this.userData.maxtime = 6;
        this.$post2parent.message({ key: 'on-bonus-playtime', value: 200 })
        this.modalData = {
          show: true,
          message: "獲得增益: 遊玩上限+3！",
        };
      }
    },
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
    canShowLeaderboard() {
      if (
        this.step == this.state.titleLeaderboard ||
        this.step == this.state.userLeaderboard ||
        this.step == this.state.result
      )
        return true;
      else return false;
    },
    canShowOverallLeaderboard() {
      if (this.step == this.state.gameplay)
        return false;
      return true;
    },
  },
};
</script>
