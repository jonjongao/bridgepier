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

    <div
      class="absolute flex top-[calc(100%/12*10)] h-[calc(100%/12*1)] w-full justify-center pointer-events-none"
    >
      <button
        class="relative w-[50%] h-[150%] bottom-[50%] pointer-events-auto"
        type="button"
        :style="returnStyle"
        @click="onClickSubmit"
      ></button>
    </div>

    <div
      class="absolute top-[calc(calc(100%/12*6))] w-full h-[calc(100%/12*1)] px-8 text-sm text-white"
      :style="returnStyle"
    >
      <p>
        填寫UID的用戶，即可參加虎你好運勢888發財金抽獎活動，同時可獲得遊戲限量虛寶！
      </p>
    </div>
    <div
      class="absolute w-full h-[calc(100%/12*1)] top-[calc(100%/12*7)] px-8"
      :style="returnStyle"
    >
      <div class="relative w-full top-[0%] h-[50%]">
        <p class="text-white w-2/12 float-left py-1">UID</p>
        <input
          class="w-10/12 float-right p-1"
          id="input-gameuid"
          placeholder="請輸入《絕地求生M》UID"
          minlength="5"
          maxlength="12"
          pattern="[0-9]*"
          type="text"
          inputmode="numeric"
          @input="onGameUIDFieldChange"
        />
      </div>
      <div class="relative w-full mt-[5%] h-[50%]">
        <p class="text-white w-2/12 float-left py-1">姓名</p>
        <input
          class="w-10/12 float-right p-1"
          type="text"
          id="input-username"
          placeholder="請輸入姓名"
          @input="onUserNameFieldChange"
        />
      </div>
      <div class="relative w-full mt-[5%] h-[50%]">
        <p class="text-white w-2/12 float-left py-1">生日</p>
        <select
          class="bear-years bg-white h-[100%] p-1"
          ref="years"
          @change="onYearFieldChange"
        ></select>
        <select
          class="bear-months bg-white h-[100%] p-1"
          ref="months"
          @change="onMonthFieldChange"
        ></select>
        <select
          class="bear-dates bg-white h-[100%] p-1"
          ref="dates"
          @change="onDayFieldChange"
        ></select>
      </div>
    </div>

    <div :style="resultStyle">
      <div
        class="absolute w-full h-[calc(100%/12*1)] top-[calc(100%/12*1.5)] text-center"
      >
        <p class="align-middle text-2xl font-white font-bold">
          {{ yearLabel }} {{ monthDaylabel }}
        </p>
      </div>

      <div
        class="absolute w-1/2 h-[calc(100%/12*0.5)] top-[calc(100%/12*3.03)] pl-[20%]"
      >
        <p class="font-extrabold">{{ luckTypeLabel[0] + "指數" }}</p>
      </div>
      <div
        class="absolute w-1/2 h-[calc(100%/12*0.5)] top-[calc(100%/12*3.56)] pl-[20%]"
      >
        <p class="font-extrabold">{{ luckTypeLabel[1] + "指數" }}</p>
      </div>
      <div
        class="absolute w-1/2 h-[calc(100%/12*0.5)] top-[calc(100%/12*3.03)] pl-[5%] right-[0%]"
      >
        <p class="font-extrabold">{{ luckTypeLabel[2] + "指數" }}</p>
      </div>
      <div
        class="absolute w-1/2 h-[calc(100%/12*0.5)] top-[calc(100%/12*3.56)] pl-[5%] right-[0%]"
      >
        <p class="font-extrabold">{{ luckTypeLabel[3] + "指數" }}</p>
      </div>

      <div
        class="absolute w-full h-[calc(100%/12*3.9)] top-[calc(100%/12*4.3)] px-8"
      >
        <div
          class="absolute left-[66.5%] w-[calc((100%-40%)/4)] h-[100%] top-0"
          style="writing-mode: vertical-rl; text-orientation: upright"
        >
          <Poem :poemData="poemData[0]" />
        </div>
        <div
          class="absolute left-[50.5%] w-[calc((100%-40%)/4)] h-[100%] top-0"
          style="writing-mode: vertical-rl; text-orientation: upright"
        >
          <Poem :poemData="poemData[1]" />
        </div>
        <div
          class="absolute left-[34.5%] w-[calc((100%-40%)/4)] h-[100%] top-0"
          style="writing-mode: vertical-rl; text-orientation: upright"
        >
          <Poem :poemData="poemData[2]" />
        </div>
        <div
          class="absolute left-[18.5%] w-[calc((100%-40%)/4)] h-[100%] top-0"
          style="writing-mode: vertical-rl; text-orientation: upright"
        >
          <Poem :poemData="poemData[3]" />
        </div>
      </div>

      <div class="absolute w-full h-[calc(100%/12*1)] top-0">
        <button
          class="relative w-[30%] h-[100%] top-0 right-0 float-right"
          type="button"
          @click="onClickReturn"
        ></button>
      </div>

      <div class="absolute w-full h-[calc(100%/12*1)] top-[calc(100%/12*9)]">
        <button
          class="relative w-[60%] h-[100%] top-0 left-0 float-left"
          :style="couponStyle"
          type="button"
          @click="onClickCopyCoupon"
        ></button>
        <button
          class="relative w-[40%] h-[100%] top-0 right-0 float-right"
          :style="couponStyle"
          type="button"
          @click="onClickRedeemCoupon"
        ></button>
        <button
          class="relative w-full h-[80%]"
          type="button"
          @click="onClickFacebookShare"
        ></button>
        <button
          class="relative w-full h-[100%]"
          type="button"
          @click="onClickDownloadApp"
        ></button>
      </div>
    </div>

    <div
      class="absolute w-full h-[240px] top-[calc(100%/12*1.9)]"
      :style="onReturnVisibility"
    >
      <swiper
        ref="mySwiper"
        :options="swiperOptions"
        :style="{ height: respHeight * sliderHeightRatio + 'px' }"
      >
        <swiper-slide :class="slideClass">
          <p class="mb-4">
            01/24~01/31【#CNY2022 口令紅包】 輸入指定通關密語，可獲得相應獎勵
          </p>
          <p class="mb-4">
            01/25~02/07 【迎新春 拿紅包】
            玩家完成任務，開啟紅包可獲得獎勵；輸入好友的邀請碼開啟紅包可獲得額外加碼獎勵
          </p>
          <p class="mb-4">
            01/26~02/08 【新春快樂：兌換】 完成每日任務即可兌換豐富獎勵
          </p></swiper-slide
        >
        <swiper-slide :class="slideClass">
          <p class="mb-4">
            01/28~02/10【春節幸運輪盤】 玩家可通過購買指針，可進行最多3次的抽獎
          </p>
          <p class="mb-4">
            01/29~02/02【春節組隊】
            和好友組隊遊戲可獲得獎勵
          </p>
          <p class="mb-4">
            01/29~02/07【鴻運長龍】 邀請好友拼接長龍，按累計遊戲場次數解鎖相關進度獎勵
          </p></swiper-slide
        >
        <swiper-slide :class="slideClass">
          <p class="mb-4">
            01/31~02/01【新春好禮】 大年初一當天在線達60分鐘即可獲得獎勵
          </p>
          <p class="mb-4">
            01/31~02/03【紅包雨】
            晚上8：00−8：30，遊戲大廳內會持續下起紅包雨，點擊紅包可獲得獎勵
          </p>
          <p class="mb-4">
            02/01~02/03【#YearofTiger 口令紅包】 輸入指定通關密語，可獲得相應獎勵
          </p>
          <p class="mb-4">
            02/04~02/06【新春週末】 累計進入top10達10次可獲得獎勵
          </p></swiper-slide
        >

        <swiper-slide
          v-for="page in awardPageData"
          :key="page.date"
          :class="slideClass"
        >
          <AwardWinnerContent :initialDate="'不久後'" :awardData="page" />
        </swiper-slide>
        <div class="swiper-pagination bottom-0" slot="pagination"></div>
      </swiper>
    </div>

    <Modal :data="modalData" @modal-confirm="onModalConfirm" />
    <Firebase
      ref="firebase"
      :data="userData"
      @verify-result="onUserVerifyResult"
      @award-result="onAwardResult"
    />
  </div>
</template>

<style>
.swiper-pagination-bullet-active {
  opacity: 1;
  background: white;
}
</style>

<script>
import { dates, months, years } from "../assets/calender";
import luckTbl from "../assets/table.json";
import { Swiper, SwiperSlide, directive } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
export default {
  name: "NuxtTutorial",
  components: {
    Swiper,
    SwiperSlide,
  },
  directives: {
    swiper: directive,
  },
  data() {
    return {
      swiperOptions: {
        slidesPerView: 1.105,
        centeredSlides: true,
        spaceBetween: "2.1%",
        pagination: {
          el: ".swiper-pagination",
        },
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
      },
      unityInstance: null,
      flkty: null,
      w2hRatio: 1.922705314009662,
      h2wRatio: 0.5201005025125628,
      sliderHeightRatio: 0.3015075376884422,
      respHeight: 796,
      respWidth: 414,
      nowState: "",
      returnStyle: {
        display: "none",
      },
      resultStyle: {
        display: "none",
      },
      onReturnVisibility: {
        visibility: "hidden",
      },
      flickityOpts: {
        autoPlay: true,
        adaptiveHeight: true,
        prevNextButtons: false,
        pageDots: true,
      },

      slideClass: {
        "bg-[#2f242099]": true,
        rounded: true,
        "p-5": true,
        "mobile:text-sm": true,
        "text-xs": true,
        "text-[gold]": true,
      },
      cellContentClass: {
        "m-[20px]": true,
        "mobile:text-sm": true,
        "text-xs": true,
        "text-[gold]": true,
      },
      awardPage1: {
        display: "none",
      },
      awardPage2: {
        display: "none",
      },
      awardPage3: {
        display: "none",
      },
      awardPageStyle: {
        display: "none",
        height: "240px",
      },
      awardPageData: [
        // {
        //   date:"hello",
        //   username:["hello"],
        //   gameuid:["hello"]
        // },
      ],
      awardPageData1: null,
      awardPageData2: null,
      awardPageData3: null,
      yearLabel: "",
      monthDaylabel: "",
      luckLvlLabel: "",
      poemData: [null, null, null, null],
      luckTypeLabel: ["整體", "財富", "健康", "感情"],
      gameUidFieldLength: 0,
      gameUidFieldVerified: false,
      userNameFieldVerified: false,
      modalData: null,
      couponStyle: {
        display: "none",
      },
      userData: {
        phoneNumber: null,
        emailAddress: null,
        userName: null,
        dateBirth: null,
        gameUid: null,
        luckData: null,
      },
      userBirthday: {
        year: null,
        month: null,
        day: null,
      },
    };
  },
  beforeMount() {
    document.addEventListener("onReceiveEventFromUnity", (e) => {
      const j = JSON.parse(e.detail);
      const key = j["state"];
      switch (key) {
        case "return":
          this.nowState = "return";
          this.postMessageToParent("on-mainmenu", "200");
          break;
        case "start_play":
          this.nowState = "start_play";
          this.postMessageToParent("on-startplay", "200");
          break;
        case "result":
          const hasUid = j["hasuid"] === "True";
          this.nowState = "result";
          this.postMessageToParent("on-result", "200");
          break;
        case "update_award":
          if (j["data"] == "") return;
          const awardData = JSON.parse(j["data"]);
          if (Object.keys(awardData).length === 0) return;
          // console.log(awardData);

          onAwardResult(awardData);
          break;
        case "update_luck":
          let luckData = JSON.parse(j["data"]);
          const luckLvl = luckData.lvl;

          this.yearLabel = luckData.lunarYearLabel;
          this.monthDaylabel = luckData.monthDayLabel;
          this.luckLvlLabel = luckData.lvlStr;
          for (var i = 0; i < this.poemData.length; i++) {
            const arr = [i, i + 4, i + 8, i + 12, i + 16];
            this.poemData[i] = {
              type: this.luckTypeLabel[i],
              text: luckTbl[luckLvl]["poem"][arr[luckData.differ[i]]],
            };
          }
          luckData.date = this.nowYYYYMMDD;
          this.userData.luckData = luckData;
          this.$refs.firebase.submitUser(this.userData);
          break;
      }

      this.returnStyle.display = this.nowState === "return" ? "block" : "none";
      this.onReturnVisibility.visibility =
        this.nowState === "return" ? "visible" : "hidden";
      this.resultStyle.display = this.nowState === "result" ? "block" : "none";
      this.couponStyle.display = this.gameUidFieldVerified ? "block" : "none";
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

    dates("option");
    months("option");
    years("option", 1922, 2022);
    this.$refs.years.value = 2022;
    this.onYearFieldChange({ target: this.$refs.years });
    this.onMonthFieldChange({ target: this.$refs.months });
    this.onDayFieldChange({ target: this.$refs.dates });
    this.onResize();

    this.$refs.firebase.getAward();
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

      this.awardPageStyle.height =
        this.respHeight * this.sliderHeightRatio + "px";
    },
    getAwardPageData(index) {
      try {
        // console.log(this.awradPageData[index - 1]);
        return this.awardPageData[index - 1];
      } catch (e) {
        console.log("get award page data error");
      }
    },
    onReceiveEventFromUnity(e) {},
    onGameUIDFieldChange(e) {
      if (e.target.value.length > 0) {
        const str = e.target.value;
        const lastChar = str.charAt(str.length - 1);
        if (isNaN(parseInt(lastChar))) {
          e.target.value = str.slice(0, -1);
          return;
        }
      }
      this.gameUidFieldLength = e.target.value.length;
      if (e.target.value.length >= 5 && e.target.value.length <= 12) {
        this.gameUidFieldVerified = true;
      } else {
        this.gameUidFieldVerified = false;
      }
      this.userData.gameUid = e.target.value;
      if (this.unityInstance != null)
        this.unityInstance.SendMessage(
          "輸入《絕地求生M》UID",
          "OnReceiveDialogInputValue",
          e.target.value
        );
    },
    onUserNameFieldChange(e) {
      if (e.target.value.length > 0) this.userNameFieldVerified = true;
      else this.userNameFieldVerified = false;
      this.userData.userName = e.target.value;
      if (this.unityInstance != null)
        this.unityInstance.SendMessage(
          "輸入姓名",
          "OnReceiveDialogInputValue",
          e.target.value
        );
    },
    onYearFieldChange(e) {
      this.userBirthday.year = e.target.value;
      if (this.unityInstance != null)
        this.unityInstance.SendMessage(
          "西元",
          "OnReceiveDialogInputValue",
          e.target.value
        );
    },
    onMonthFieldChange(e) {
      const val = this.zhMonthToNumber(e.target.value).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });
      this.userBirthday.month = val;
      if (this.unityInstance != null)
        this.unityInstance.SendMessage("月", "OnReceiveDialogInputValue", val);
    },
    onDayFieldChange(e) {
      const val = parseInt(e.target.value).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });
      this.userBirthday.day = val;
      if (this.unityInstance != null)
        this.unityInstance.SendMessage("日", "OnReceiveDialogInputValue", val);
    },
    onModalConfirm(e) {
      this.modalData = null;
    },
    onClickSubmit(e) {
      const field = document.getElementById("input-gameuid");
      if (field.value.length > 0 && this.gameUidFieldVerified == false) {
        this.modalData = {
          show: true,
          message: "遊戲UID必須介於5~12位數字之間",
        };
        this.postMessageToParent("on-submit", "406");
        return;
      }
      if (this.userNameFieldVerified == false) {
        this.modalData = {
          show: true,
          message: "請輸入姓名",
        };
        this.postMessageToParent("on-submit", "406");
        return;
      }

      this.userData.dateBirth = this.userBirthdayYYYYMMDD;
      this.$refs.firebase.verifyUser(this.userData);
      this.postMessageToParent("on-submit", "200");
    },
    onClickCopyCoupon(e) {
      // alert("已複製到剪貼簿");
      this.modalData = {
        show: true,
        message: "已複製到剪貼簿",
      };
      var temp = document.createElement("input");
      temp.value = "BTRUZBZQ79";
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      document.body.removeChild(temp);
      this.postMessageToParent("copy-coupon", "200");
    },
    onClickRedeemCoupon(e) {
      window.open("https://pubgm.tw/redeem");
      this.postMessageToParent("redeem-coupon", "200");
    },
    onClickFacebookShare(e) {
      FB.ui(
        {
          method: "share",
          hashtag: "#虎你好運",
          href: "https://pubgm-2022-firstquarter-event.com.tw/",
        },
        function (response) {}
      );
      this.postMessageToParent("fb-share", "200");
    },
    onClickDownloadApp(e) {
      window.open("https://pubgm.tw/tigeryear");
      this.postMessageToParent("download-app", "200");
    },
    onClickReturn(e) {
      if (this.unityInstance != null)
        this.unityInstance.SendMessage("Main Camera", "Return");
      this.postMessageToParent("click-return", "200");
    },
    onUserVerifyResult(e) {
      if (e.exist && e.result) {
        // Update existing user
        if (this.unityInstance != null)
          this.unityInstance.SendMessage("Main Camera", "StartPlay");
      } else if (e.result) {
        // New user
        if (this.unityInstance != null)
          this.unityInstance.SendMessage("Main Camera", "StartPlay");
      } else {
        // Error
        this.modalData = {
          show: true,
          message: e.message,
        };
      }
    },
    onAwardResult(e) {
      const awardData = e;
      let pageData = [];
      for (var p = 0; p < awardData["pages"].length; p++) {
        const aPage = awardData["pages"][p];
        pageData.push(aPage);
      }
      this.awardPageData = pageData;
      this.awardPageStyle.display = "block";
    },
    zhMonthToNumber(month) {
      const m = [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月",
      ];
      for (var i = 0; i < m.length; i++) {
        if (month === m[i]) return i + 1;
      }
      return -1;
    },
    postMessageToParent(type, data) {
      const e = {
        key: type,
        value: data,
      };
      window.parent.postMessage(e, "*");
      console.log('game post message:',e);
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
  },
};
</script>
