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
  unmounted() {
    const dbRef = ref(getDatabase());
    dbRef.off();
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
        const data = snapshot.val();
        return {
          exist: true,
          result: true,
          message: "此電子郵件已被使用",
          data: data,
        };
      } else {
        return {
          exist: false,
          result: true,
          message: "新的使用者",
          data: null,
        };
      }
    },
    async submitUser(data) {
      if (this.response.exist) this.updateUser(data);
      else this.addUser(data);
    },
    async addUser(data) {
      console.log("-------add user");
      console.log(data);
      console.log("---------------");
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

        onValue(ref(db, "teams/" + id), (snapshot) => {
          const data = snapshot.val();
          this.$emit("team-update-unit", {
            key: snapshot.key,
            data: snapshot.val(),
          });
        });
      }
    },
    async updateTeam(userData, resultData) {
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
      const snapshot = await get(child(dbRef, "teams/" + id));
      if (snapshot.exists()) {
        oldScore = snapshot.val().score;

        console.log("get old score:" + oldScore);

        update(ref(db), {
          ["teams/" + id + "/score"]: oldScore + resultData.score,
        });
      }
    },
    async addOnPlaytime(userData){
      const id = userData.emailaddress.replace("@", "-at-").replace(".", "-dot-");
      const dbRef = ref(getDatabase());
      const db = getDatabase();
      const snapshot = await get(child(dbRef, "users/" + id));
      if (snapshot.exists()) {
        const oldPlaytime = snapshot.val().playtime;
        update(ref(db), {
          ["users/" + id + "/playtime"]: oldPlaytime + 1,
        });
      }
    },
    async addBonusMaxPlaytime(userData){
      const id = userData.emailaddress.replace("@", "-at-").replace(".", "-dot-");
      const dbRef = ref(getDatabase());
      const db = getDatabase();
      const snapshot = await get(child(dbRef, "users/" + id));
      if (snapshot.exists()) {
        update(ref(db), {
          ["users/" + id + "/maxtime"]: 6,
        });
      }
    },
    async getTeam() {
      console.log("try get team data");
      const dbRef = ref(getDatabase());
      const db = getDatabase();
      const snapshot = await get(child(dbRef, "teams"));
      if (snapshot.exists()) {
        const list = snapshot.val();
        this.$emit("team-update", list);

        setTimeout(() => {
          // onValue(ref(db,"teams"),(snapshot)=>{
          //   const data = snapshot.val();
          //   console.log("team data refresh");
          //   console.log(data);
          // });
          for (var key in list) {
            console.log("try listen:" + key);
            const teamRef = ref(db, "teams/" + key);
            onValue(teamRef, (snapshot) => {
              const data = snapshot.val();
              this.$emit("team-update-unit", {
                key: snapshot.key,
                data: snapshot.val(),
              });
            });
          }
        }, 1000);
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
