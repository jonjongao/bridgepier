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
  apiKey: "AIzaSyD2rEYk-A2zGup1sUvJ4KovgJTqUcW4pj8",
  authDomain: "pubgm-22lunar.firebaseapp.com",
  databaseURL:
    "https://pubgm-22lunar-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pubgm-22lunar",
  storageBucket: "pubgm-22lunar.appspot.com",
  messagingSenderId: "321154347303",
  appId: "1:321154347303:web:56ecdcdb64a26f4551b902",
  measurementId: "G-5HJ5TMG6J1",
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
    async userExist(data) {
      let id = data.gameUid + "_" + data.userName + "_" + data.dateBirth;
      if (data.gameUid != "none" || data.gameUid != null) id = data.gameUid;

      const dbRef = ref(getDatabase());
      const db = getDatabase();
      const snapshot = await get(child(dbRef, `users/` + id));
      if (snapshot.exists()) {
        if (data.gameUid != "none" || data.gameUid != null) {
          if (
            (data.userName == snapshot.val().username) == false ||
            (data.dateBirth == snapshot.val().datebirth) == false
          ) {
            return {
              exist: true,
              result: false,
              message: "此UID已被使用，且輸入的姓名或生日和紀錄不相符",
            };
          }
        }

        return {
          exist: true,
          result: true,
          message: "加入新的抽籤資料",
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

      const email = data.emailAddress === null ? "" : data.emailAddress;
      const number = data.phoneNumber === null ? "" : data.phoneNumber;
      const name = data.userName;
      const birth = data.dateBirth;
      const uid =
        data.gameUid === null || data.gameUid == "" ? "none" : data.gameUid;

      let id = uid + "_" + name + "_" + birth;
      if (data.gameUid != "none" || data.gameUid != null) id = uid;

      if (data.gameUid == "none" || data.gameUid == null) {
        const post = await push(ref(db, "users"));
        set(post, {
          datecreate: unixtime,
          mailaddress: email,
          phonenumber: number,
          username: name,
          datebirth: birth,
          gameuid: uid,
          hasaward: false,
          dateaward: "",
          chim: {
            [this.now]: {
              servertime: unixtime,
              date: data.luckData.date,
              lvl: data.luckData.lvl,
              lvlStr: data.luckData.lvlStr,
              lunarYearLabel: data.luckData.lunarYearLabel,
              monthDayLabel: data.luckData.monthDayLabel,
              differ: data.luckData.differ,
            },
          },
        });
      } else {
        await set(ref(db, "users/" + id), {
          datecreate: unixtime,
          mailaddress: email,
          phonenumber: number,
          username: name,
          datebirth: birth,
          gameuid: uid,
          hasaward: false,
          dateaward: "",
          chim: {
            [this.now]: {
              servertime: unixtime,
              date: data.luckData.date,
              lvl: data.luckData.lvl,
              lvlStr: data.luckData.lvlStr,
              lunarYearLabel: data.luckData.lunarYearLabel,
              monthDayLabel: data.luckData.monthDayLabel,
              differ: data.luckData.differ,
            },
          },
        });
      }
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
