<template>
  <div v-if="isShow">
    <div
      class="absolute w-full top-[calc(100%/12*3.7)] h-[calc(100%/12*1)] flex items-center justify-center"
    >
      <p class="text-black text-2xl font-black">參賽登記</p>
    </div>

    <!-- Step 1 -->
    <div
      class="absolute w-full top-[calc(100%/12*4.5)] h-[calc(100%/12*1)]"
      v-if="step == state.emailVerify"
    >
      <div class="relative w-[80%] ml-[10%] h-[50%] flex items-center mt-[5%]">
        <p class="text-black w-4/12 float-left">電子郵件</p>
        <div class="w-8/12 float-right">
          <input
            class="w-full h-full p-1"
            type="text"
            id=""
            placeholder="輸入電子郵件"
            @input="inputEmail = $event.target.value"
          />
          <!-- <span class="w-full text-xs text-red-600" id="passwordHelp">電子郵件格式錯誤</span>   -->
        </div>
      </div>

      <div class="flex space-x-2 justify-center mt-[10%]">
        <button
          type="button"
          class="inline-block px-12 py-3 bg-gradient-to-b from-yellow-300 to-yellow-500 hover:from-yellow-200 hover:to-yellow-400 text-gray-600 font-black text-2xl uppercase shadow-md focus:ring-0 active:shadow-lg transition duration-150 ease-in-out border-2 border-yellow-200"
          @click="emailVerifyProceed"
        >
          繼續
        </button>
      </div>
    </div>

    <div
      class="absolute w-full top-[calc(100%/12*4.5)] h-[calc(100%/12*1)]"
      v-if="step == state.newUser || step == state.existUser"
    >
      <div class="relative w-[80%] ml-[10%] h-[50%] flex items-center mt-[5%]">
        <p class="text-black w-4/12 float-left">電子郵件</p>
        <div class="w-8/12 float-right flex flex-row">
          <input
            ref="emailField"
            :disabled="step == state.existUser"
            class="w-full h-full p-1"
            type="text"
            id=""
            placeholder="輸入電子郵件"
            @input="inputEmail = $event.target.value"
          />
        </div>
      </div>

      <div
        class="relative w-[80%] ml-[10%] mt-[5%] mb-[5%]"
        v-if="step == state.existUser"
      >
        <p class="text-black w-full text-center text-xl">
          歡迎回來 {{ userData.username }}
        </p>
        <p class="text-black w-full text-center text-xl">
          今日剩餘的遊玩次數: {{ userData.maxtime - userData.playtime }}
        </p>
      </div>

      <div
        class="relative w-[80%] ml-[10%] h-[50%] flex items-center mt-[5%]"
        v-if="step == state.newUser"
      >
        <p class="text-black w-4/12 float-left">UID</p>
        <div class="w-8/12 float-right flex flex-row">
          <input
            class="w-full h-full p-1"
            type="text"
            id=""
            placeholder="輸入《絕地求生M》UID"
            @input="userData.gameuid = $event.target.value"
          />
        </div>
      </div>

      <div
        class="relative w-[80%] ml-[10%] h-[50%] flex items-center mt-[5%]"
        v-if="step == state.newUser"
      >
        <p class="text-black w-4/12 float-left">姓名</p>
        <div class="w-8/12 float-right flex flex-row">
          <input
            class="w-full h-full p-1"
            type="text"
            id=""
            placeholder="輸入姓名"
            @input="userData.username = $event.target.value"
          />
        </div>
      </div>

      <div
        class="relative w-[80%] ml-[10%] h-[50%] flex items-center mt-[5%]"
        v-if="step == state.newUser"
      >
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

      <div
        class="relative w-[80%] ml-[10%] h-[50%] flex items-center mt-[5%]"
        v-if="step == state.newUser && this.userData.group == '學生組'"
      >
        <p class="text-black w-4/12 float-left">選擇地區</p>
        <div class="w-8/12 float-right flex flex-row">
          <select
            ref="cityField"
            class="bear-dates bg-white w-[50%] h-[100%] mr-2 p-1"
            @change="selectedCity = $event.target.value"
          >
            <option disabled selected>選縣市</option>
            <option v-for="e in entity" :key="e.city">
              {{ e.city }}
            </option>
          </select>
          <select
            ref="zoneField"
            class="bear-dates bg-white w-[50%] h-[100%] p-1"
            @change="selectedZone = $event.target.value"
          >
            <option disabled selected>選鄉政區</option>
            <option v-for="z in zoneList" :key="z">
              {{ z }}
            </option>
          </select>
        </div>
      </div>

      <div
        class="relative w-[80%] ml-[10%] h-[50%] flex items-center mt-[5%]"
        v-if="step == state.newUser && this.userData.group == '學生組'"
      >
        <p class="text-black w-4/12 float-left">選擇學校</p>
        <div class="w-8/12 float-right flex flex-row">
          <select
            ref="schoolField"
            class="bear-dates bg-white w-[100%] h-[100%] p-1"
            @change="selectedSchool = $event.target.value"
          >
            <option disabled selected>選學校</option>
            <option v-for="s in schoolList" :key="s">
              {{ s }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex space-x-2 justify-center mt-[5%]">
        <button
          type="button"
          class="inline-block px-12 py-3 bg-gradient-to-b from-yellow-300 to-yellow-500 hover:from-yellow-200 hover:to-yellow-400 text-gray-600 font-black text-2xl uppercase shadow-md focus:ring-0 active:shadow-lg transition duration-150 ease-in-out border-2 border-yellow-200"
          @click="newOrExistUserProceed"
        >
          繼續
        </button>
      </div>
    </div>

    <Modal :data="modalData" @modal-confirm="onModalConfirm" />
  </div>
</template>

<style>
.button-group :active {
  background-color: red;
}
</style>

<script>
import table from "../assets/schools.json";
export default {
  name: "JujutsuRegist",
  props: ["show", "firebase"],
  data() {
    return {
      isShow: false,
      firebaseInstance: null,
      entity: {},
      groupBtnActive: {
        backgroundColor: "darkorange",
      },
      groupBtnNormal: {
        backgroundColor: "orange",
      },
      selectedCity: null,
      zoneList: [],
      selectedZone: null,
      selectedSchool: null,
      schoolList: [],
      inputEmail: "",
      modalData: {
        show: false,
        message: "",
      },
      state: {
        emailVerify: 0,
        existUser: 1,
        newUser: 2,
        complete: 3,
      },
      step: 0,
      userData: {
        username: "",
        gameuid: "",
        emailaddress: "",
        group: "",
        datecreate: "",
        lastplaytimestamp: 0,
        lastplaydate: "",
        playtime: 1,
        maxtime: 3,
        entity: {
          city: "",
          zone: "",
          school: "",
        },
      },
      teamData: {
        teamname: "",
        score: 0,
      },
    };
  },
  mounted() {
    // var startTime = performance.now()
    var entity = {};
    for (var i = 0; i < table.length; i++) {
      if (table[i]["縣市名稱"] === "" || table[i]["區域名稱"] === "") continue;
      if (entity.hasOwnProperty(table[i]["縣市名稱"])) {
        if (
          entity[table[i]["縣市名稱"]]["zone"].includes(table[i]["區域名稱"])
        ) {
        } else entity[table[i]["縣市名稱"]]["zone"].push(table[i]["區域名稱"]);

        if (
          entity[table[i]["縣市名稱"]]["school"].hasOwnProperty(
            table[i]["區域名稱"]
          )
        ) {
          entity[table[i]["縣市名稱"]]["school"][table[i]["區域名稱"]].push(
            table[i]["學校名稱"]
          );
        } else {
          entity[table[i]["縣市名稱"]]["school"][table[i]["區域名稱"]] = [
            table[i]["學校名稱"],
          ];
        }
      } else
        entity[table[i]["縣市名稱"]] = {
          city: table[i]["縣市名稱"],
          zone: [table[i]["區域名稱"]],
          school: { [table[i]["區域名稱"]]: [table[i]["學校名稱"]] },
        };
    }
    this.entity = entity;

    // console.log(entity);
    // var endTime = performance.now()
    // console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)
  },
  methods: {
    onModalConfirm(e) {
      this.modalData = {
        show: false,
        message: "",
      };
    },
    async emailVerifyProceed(e) {
      if (
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.inputEmail)
      ) {
        this.userData.emailaddress = this.inputEmail;
        // Check in firebase
        let result = {};
        let user = null;
        await this.firebaseInstance
          .userExist(this.userData.emailaddress)
          .then(function (resp) {
            console.log(resp);
            result = resp;
            user = resp.data;
          });
        if (user != null) {
          this.userData = user;
          const remainPlaytime = this.userData.maxtime - this.userData.playtime;

          console.log("go");

          // Out of chance
          if (remainPlaytime == 0) {
            this.modalData = {
              show: true,
              message: "本日可玩次數已用完，請明日再來",
            };
            return;
          }
        }
        // Pass
        // Check existing
        if (result.exist) {
          this.step = this.state.existUser;
        } else {
          this.step = this.state.newUser;
          console.log(this.step);
          this.$nextTick(() => {
            this.$refs.emailField.setAttribute("disabled", true);
          });
        }
      } else {
        this.modalData = {
          show: true,
          message: "請輸入正確的電子郵件格式",
        };
      }
    },
    async newOrExistUserProceed(e) {
      let pattern = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
      let error = "";
      let isSocialGroup = this.userData.group != "學生組";

      if (this.step == this.state.newUser) {
        if (
          this.userData.gameuid.length > 0 &&
          (this.userData.gameuid.length < 5 ||
            this.userData.gameuid.length > 12)
        )
          error += "遊戲UID必須介於5~12位數字之間";

        if (this.userData.username == "") error += "\n請輸入姓名";
        if (pattern.test(this.userData.username))
          error += "\n姓名請勿包含特殊文字";

        if (this.userData.group == "") error += "\n尚未選擇組別";

        if (!isSocialGroup) {
          if (
            this.$refs.cityField.selectedIndex == 0 ||
            this.$refs.zoneField.selectedIndex == 0
          )
            error += "\n尚未選擇地區";

          if (this.$refs.schoolField.selectedIndex == 0)
            error += "\n尚未選擇學校";
        }

        if (error != "") {
          this.modalData = {
            show: true,
            message: error,
          };
          return;
        }

        if (isSocialGroup) {
          this.userData.entity = {
            city: "",
            zone: "",
            school: this.userData.group,
          };
        } else {
          this.userData.entity = {
            city: this.selectedCity,
            zone: this.selectedZone,
            school: this.selectedSchool,
          };
        }

        console.log("Add user then submit team");
        await this.firebaseInstance.addUser(this.userData);
      }
      await this.firebaseInstance.submitTeam(this.userData);

      this.step = this.step.complete;
      console.log(this.userData);
      this.$emit("complete", this.userData);
    },
  },
  computed: {},
  watch: {
    selectedCity: function (newVal, oldVal) {
      this.$refs.zoneField.selectedIndex = 0;
      this.$refs.schoolField.selectedIndex = 0;
      if (this.entity.hasOwnProperty(newVal))
        this.zoneList = this.entity[newVal]["zone"];
      else this.zoneList = [];
    },
    selectedZone: function (newVal, oldVal) {
      if (
        this.entity.hasOwnProperty(this.selectedCity) &&
        this.entity[this.selectedCity]["school"].hasOwnProperty(newVal)
      )
        this.schoolList = this.entity[this.selectedCity]["school"][newVal];
      else this.schoolList = [];
    },
    show: function (newVal, oldVal) {
      this.isShow = newVal;
      console.log("show update");
      if (this.isShow == false) {
        this.step = 0;
        this.userData = {
          username: "",
          gameuid: "",
          emailaddress: "",
          group: "",
          datecreate: "",
          lastplaytimestamp: 0,
          lastplaydate: "",
          playtime: 1,
          maxtime: 3,
          entity: {
            city: "",
            zone: "",
            school: "",
          },
        };
      }
    },
    firebase: function (newVal, oldVal) {
      this.firebaseInstance = this.firebase;
    },
  },
};
</script>
