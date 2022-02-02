<template>
  <div v-if="isShow">
    <div class="absolute w-full top-[calc(100%/12*1.2)] h-[calc(100%/12*1)]">
      <div
        class="relative w-[35%] ml-[18%] h-[100%] flex items-center justify-center"
      >
        <p class="text-white text-3xl select-none">分數</p>
      </div>
      <div
        class="relative w-[35%] ml-[18%] h-[50%] mt-[3%] flex items-center justify-center"
      >
        <p class="text-white select-none">擊倒</p>
      </div>
    </div>

    <div class="absolute w-full top-[calc(100%/12*4.8)] h-[calc(100%/12*1)]">
      <div
        class="relative w-[80%] ml-[10%] h-[100%] flex items-center justify-center"
      >
        <p class="text-white text-3xl select-none">{{ userData.entity.city+userData.entity.school }}</p>
        <!-- <p class="text-white text-2xl select-none">新北市市立桃子腳國中</p> -->
      </div>
      <div
        class="relative w-[80%] ml-[10%] h-[140%] flex items-center justify-center"
      >
        <p class="text-white text-2xl select-none">{{ userTeamData.score + '->' + (userTeamData.score+gameResultData.score) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "JujutsuGame",
  props: ["list", "show", "mode", "data", "team","game"],
  data() {
    return {
      isShow: false,
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
      gameResultData:{},
      userTeamData:{}
    };
  },
  methods: {
      getTeamScroe()
      {

      }
  },
  mounted() {},
  computed: {},
  watch: {
    show: function (newVal, oldVal) {
      this.isShow = newVal;
      console.log("show update");
    },
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
      for (const key in newVal) {
        console.log(newVal[key]);
        arr.push({
          teamname: newVal[key].teamname,
          score: newVal[key].score,
        });
      }
      this.teamList = arr;
      console.log(this.teamList);
    },
    game:function(newVal,oldVal){
        console.log("game result update");
        console.log(newVal);
        this.gameResultData = newVal;

        for(const i in this.teamList)
        {
            console.log(this.teamList[i]);
            if(this.teamList[i].teamname==this.userData.entity.city+this.userData.entity.school)
            {
                console.log("found user data");
                this.userTeamData = this.teamList[i];
                break;
            }
        }
        console.log("done user team");
        console.log(this.userTeamData);
    }
  },
};
</script>
