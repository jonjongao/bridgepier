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
      let id = this.getUserID(email);
      console.log(id);

      const dbRef = ref(getDatabase());
      const db = getDatabase();
      const snapshot = await get(child(dbRef, "users/" + id));
      if (snapshot.exists()) {
        // const timeStamp = new Date().getTime();
        // const yesterdayTimeStamp = timeStamp - 24 * 60 * 60 * 1000;
        // const yesterdayDate = new Date(yesterdayTimeStamp);

        let data = snapshot.val();
        let date1 = new Date(0);
        date1.setUTCMilliseconds(data.lastplaytimestamp);
        let date2 = new Date();
        const diffInDays = date2.getDate() - date1.getDate();

        if (diffInDays >= 1) {
          await this.resetPlaytime(data);
          data.playtime = 0;
          data.maxtime = 3;
        }

        return {
          exist: true,
          result: true,
          message: "此電子郵件已被使用",
          data: data,
          diffDays: diffInDays,
        };
      } else {
        return {
          exist: false,
          result: true,
          message: "新的使用者",
          data: null,
          diffDays: 0,
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
      const id = this.getUserID(data.emailaddress);

      data.datecreate = unixtime;
      data.lastplaytimestamp = unixtime;
      data.lastplaydate = this.now;

      await set(ref(db, "users/" + id), data);

      this.$post2parent.message({key:'new-user',value:id})
    },
    async submitTeam(data) {
      const userID = this.getUserID(data.emailaddress);
      const id = this.getTeamID(data);
      const teamname = this.getTeamName(data);
      const dbRef = ref(getDatabase());
      const db = getDatabase();
      const snapshot = await get(child(dbRef, "teams/" + id));
      if (snapshot.exists()) {
      } else {
        await set(ref(db, "teams/" + id), {
          teamname: teamname,
          score: 0,
          member: {
            [userID]: 0,
          },
        });

        this.$post2parent.message({key:'new-team',value:id})

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
      const dbRef = ref(getDatabase());
      const db = getDatabase();

      const userID = this.getUserID(userData.emailaddress);
      const todayHistoryPath = "users/" + userID + "/history/" + this.now;
      const historyNode = await get(child(dbRef, todayHistoryPath));
      let liveHighscore = 0;
      if (historyNode.exists()) {
        console.log("update highscore");
        if (resultData.score > historyNode.val().highscore) {
          liveHighscore = resultData.score;
          update(ref(db), {
            [todayHistoryPath + "/highscore"]: resultData.score,
          });
        } else liveHighscore = historyNode.val().highscore;
      } else {
        console.log("add hightscore");
        set(ref(db, todayHistoryPath), {
          highscore: resultData.score,
        });
        liveHighscore = resultData.score;
      }

      const teamID = this.getTeamID(userData);
      const teamname = this.getTeamName(userData);

      let oldScore = 0;
      const teamPath = "teams/" + teamID;
      const memberPath = "teams/" + teamID + "/member/" + userID;
      const memberNode = await get(child(dbRef, memberPath));
      if (memberNode.exists()) {
        update(ref(db), {
          [memberPath]: liveHighscore,
        });

        // oldScore = memberNode.val().score;

        // console.log("get old score:" + oldScore);

        // update(ref(db), {
        //   ["teams/" + teamID + "/score"]: oldScore + resultData.score,
        // });
      } else {
        set(ref(db, memberPath), liveHighscore);
      }

      const allMemberPath = "teams/" + teamID + "/member";
      const allMemberNode = await get(child(dbRef, allMemberPath));
      if (allMemberNode.exists()) {
        const data = allMemberNode.val();
        console.log("-----all member");
        console.log(data);
        console.log("---------------");
        let scoreSum = 0;
        for (var key in data) {
          scoreSum += data[key];
        }
        update(ref(db), {
          ["teams/" + teamID + "/score"]: scoreSum,
        });
      } else {
        // set(ref(db,"teams/"+teamID+"/score"),0);
      }
    },
    async resetPlaytime(userData) {
      const id = this.getUserID(userData.emailaddress);
      const dbRef = ref(getDatabase());
      const db = getDatabase();
      const snapshot = await get(child(dbRef, "users/" + id));
      if (snapshot.exists()) {
        await update(ref(db), {
          ["users/" + id + "/playtime"]: 0,
          ["users/" + id + "/maxtime"]: 3,
        });
      }
    },
    async addOnPlaytime(userData) {
      const id = this.getUserID(userData.emailaddress);
      const dbRef = ref(getDatabase());
      const db = getDatabase();
      const snapshot = await get(child(dbRef, "users/" + id));
      if (snapshot.exists()) {
        const oldPlaytime = snapshot.val().playtime;
        update(ref(db), {
          ["users/" + id + "/playtime"]: oldPlaytime + 1,
          ["users/" + id + "/lastplaydate"]: this.now,
          ["users/" + id + "/lastplaytimestamp"]: serverTimestamp(),
        });
      }
    },
    async updateUserUID(userData) {
      const id = this.getUserID(userData.emailaddress);
      const dbRef = ref(getDatabase());
      const db = getDatabase();
      const snapshot = await get(child(dbRef, "users/" + id));
      if (snapshot.exists()) {
        update(ref(db), {
          ["users/" + id + "/gameuid"]: userData.gameuid,
        });
      }
    },
    async addBonusMaxPlaytime(userData) {
      const id = this.getUserID(userData.emailaddress);
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
    getTeamID(userData) {
      return userData.group == "社會組"
        ? "社會組"
        : userData.entity.city +
            "-" +
            userData.entity.zone +
            "-" +
            userData.entity.school;
    },
    getTeamName(userData) {
      return userData.group == "社會組"
        ? "社會組"
        : userData.entity.city + userData.entity.school;
    },
    getUserID(emailaddress) {
      return emailaddress.replaceAll("@", "-at-").replaceAll(".", "-dot-");
    },
  },
  computed: {
    now() {
      const d = new Date();
      const mm = d.getMonth() + 1; // getMonth() is zero-based
      const dd = d.getDate();

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
    yestday() {
      const timeStamp = new Date().getTime();
      const yesterdayTimeStamp = timeStamp - 24 * 60 * 60 * 1000;
      const yesterdayDate = new Date(yesterdayTimeStamp);
      const mm = yesterdayDate.getMonth() + 1; // getMonth() is zero-based
      const dd = yesterdayDate.getDate();

      return [
        yesterdayDate.getFullYear(),
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
