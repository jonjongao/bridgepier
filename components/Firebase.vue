<template></template>

<script>
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getDatabase,
  ref,
  set,
  child,
  get,
  onValue,
  update,
  serverTimestamp,
  push,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB2bcVEy4mBxgwRBhT2aN58xnT66gk5QIU",
  authDomain: "pubgm-jujutsu.firebaseapp.com",
  projectId: "pubgm-jujutsu",
  storageBucket: "pubgm-jujutsu.appspot.com",
  messagingSenderId: "89669436824",
  appId: "1:89669436824:web:8655c9548e0db0f9b717ed",
  measurementId: "G-R2E7ECSZCH",
  databaseURL:
    "https://pubgm-jujutsu-default-rtdb.asia-southeast1.firebasedatabase.app",
};

export default {
  name: "Firebase",
  props: ["data"],
  data() {
    return {
      _config: firebaseConfig,
      response: {
        exist: null,
        result: null,
        message: null,
      },
    };
  },
  mounted() {
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
  },
  watch: {},
  methods: {
    async verifyUser(data) {
      this.response = await this.userExist(data);
      if (this.response.exist) {
        this.$emit("verify-result", this.response);
      } else {
        this.$emit("verify-result", this.response);
      }
    },
    async userExist(email) {
      let id = email.replace("@", "-at-").replace(".", "-dot-");
      console.log(id);

      const dbRef = ref(getDatabase());
      const db = getDatabase();
      const snapshot = await get(child(dbRef, "users/" + id));
      if (snapshot.exists()) {
        return {
          exist: true,
          result: true,
          message: "此電子郵件已被使用",
        };
      } else {
        return {
          exist: false,
          result: true,
          message: "新的使用者",
        };
      }
    },
    async submitUser(data) {
      if (this.response.exist) this.updateUser(data);
      else this.addUser(data);
    },
    async updateUser(data) {
      let id = data.gameUid + "_" + data.userName + "_" + data.dateBirth;
      if (data.gameUid != "none" || data.gameUid != null) id = data.gameUid;
      const dbRef = ref(getDatabase());
      const db = getDatabase();
      const snapshot = await get(child(dbRef, `users/` + id));

      if (snapshot.exists()) {
        set(ref(db, "users/" + id + "/chim/" + this.now), {
          servertime: serverTimestamp(),
          date: data.luckData.date,
          lvl: data.luckData.lvl,
          lvlStr: data.luckData.lvlStr,
          lunarYearLabel: data.luckData.lunarYearLabel,
          monthDayLabel: data.luckData.monthDayLabel,
          differ: data.luckData.differ,
        });
      }
    },
    async addUser(data) {
      const unixtime = serverTimestamp();
      // const unixtime = Date.now();
      // RealtimeDB版本
      const db = getDatabase();
      const id = data.emailaddress.replace("@", "-at-").replace(".", "-dot-");

      data.datecreate = unixtime;
      data.lastplaytimestamp = unixtime;
      data.lastplaydate = this.now;

      await set(ref(db, "users/" + id), data);
    },
    async submitTeam(data) {
      const id =
        data.group == "社會組"
          ? "社會組"
          : data.entity.city +
            "-" +
            data.entity.zone +
            "-" +
            data.entity.school;
      const teamname =
        data.group == "社會組"
          ? "社會組"
          : data.entity.city + data.entity.school;
      const dbRef = ref(getDatabase());
      const db = getDatabase();
      const snapshot = await get(child(dbRef, "teams/" + id));
      if (snapshot.exists()) {
      } else {
        await set(ref(db, "teams/" + id), {
          teamname: teamname,
          score: 0,
        });
      }
    },
    async updateTeam(userData,resultData) {
      const id =
        userData.group == "社會組"
          ? "社會組"
          : userData.entity.city +
            "-" +
            userData.entity.zone +
            "-" +
            userData.entity.school;
      const teamname =
        userData.group == "社會組"
          ? "社會組"
          : userData.entity.city + userData.entity.school;
      const dbRef = ref(getDatabase());
      const db = getDatabase();
      let oldScore = 0;
      const snapshot = await get(child(dbRef, "teams/"+id));
      if (snapshot.exists()) {
        oldScore = snapshot.val().score;
      }
      console.log("get old score:"+oldScore);

      update(ref(db), {
        ["teams/" + id+"/score"]: oldScore + resultData.score,
      });
    },
    async getTeam() {
      console.log("try get team data");
      const dbRef = ref(getDatabase());
      const db = getDatabase();
      const snapshot = await get(child(dbRef, "teams"));
      if (snapshot.exists()) {
        const list = snapshot.val();
        console.log("done fetch team data");
        console.log(list);
        this.$emit("team-update", list);
      }
    },
    encryptUserName(username) {
      let en = "";
      const replaceLength = username.length - 1 - 1;
      if (replaceLength < 0) {
      } else if (replaceLength == 0) {
        en = username[0] + "*";
      } else {
        en = username[0];
        for (var i = 0; i < replaceLength; i++) {
          en += "*";
        }
        en += username[username.length - 1];
      }
      return en;
    },
  },
  computed: {
    now() {
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
