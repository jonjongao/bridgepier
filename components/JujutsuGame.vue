<template>
  <div v-if="isShow">
    <div class="absolute w-full top-0 h-[calc(100%/12*9.5)]">
      
    </div>
    <div class="absolute w-full top-[calc(100%/12*1.2)] h-[calc(100%/12*1)]">
      <div
        class="relative w-[65%] ml-[18%] h-[100%] flex items-center justify-center"
      >
        <p class="w-[55%] text-white text-center select-none text-2xl mobile:text-3xl">分數</p>
        <p class="w-[45%] text-white text-center select-none text-2xl mobile:text-3xl"></p>
        <!-- <p class="w-[45%] text-white text-center select-none text-2xl mobile:text-3xl">{{ gameUpdate.score }}</p> -->
      </div>
      <div
        class="relative w-[65%] ml-[18%] h-[50%] mt-[3%] flex items-center justify-center"
      >
        <p class="w-[55%] text-white text-center select-none text-lg mobile:text-xl">吃手數</p>
        <p class="w-[45%] text-white text-center select-none text-lg mobile:text-xl"></p>
        <!-- <p class="w-[45%] text-white text-center select-none text-lg mobile:text-xl">{{ gameUpdate.feeded }}</p> -->
      </div>
    </div>

    

    <div v-if="showResultBox" class="absolute w-full top-[calc(100%/12*4.8)] h-[calc(100%/12*1)]">
      <div
        class="relative w-[80%] ml-[10%] h-[100%] flex items-center justify-center"
      >
        <p class="text-white select-none text-2xl mobile:text-3xl">分數提升</p>
      </div>
      <div
        class="relative w-[80%] ml-[10%] h-[140%] "
      >
        <p class="flex items-center justify-center my-2 text-white select-none text-md mobile:text-2xl">{{ userData.entity.city+userData.entity.school }}</p>
        <p class="flex items-center justify-center my-3 text-white select-none text-md mobile:text-2xl"><span class="pr-1">{{ clampFromScore }}</span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"/>
</svg><span class="pl-1 text-yellow-400">{{ userTeamData.score }}</span></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "JujutsuGame",
  props: ["list", "show", "mode", "data", "team","game","gameUpdate"],
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
      userTeamData:{},
      showResultBox:false,
      scoreOnStart:0,
    };
  },
  methods: {
      getTeamScroe()
      {

      }
  },
  mounted() {},
  computed: {
    clampFromScore(){
      return Math.max(this.userTeamData.score-this.gameResultData.score,0);
    }
  },
  watch: {
    show: function (newVal, oldVal) {
      this.isShow = newVal;
      // console.log("show update");
      if(this.isShow)
      {
        for(const i in this.team)
        {
            if(this.team[i].teamname==this.userData.entity.city+this.userData.entity.school)
            {
              this.scoreOnStart = this.team[i].score;
                break;
            }
        }
      }
      else
      {
        this.showResultBox=false;
      }
    },
    data: function (newVal, oldVal) {
      // console.log("on userdata update");
      // console.log(newVal);
      this.userData = newVal;
      // console.log(this.userData);
    },
    team: function (newVal, oldVal) {
      // console.log("team update");
      let arr = [];
      this.teamData = newVal;
      for (const key in newVal) {
        arr.push({
          teamname: newVal[key].teamname,
          score: newVal[key].score,
        });
      }
      this.teamList = arr;
      // console.log(this.teamList);
    },
    game:function(newVal,oldVal){
        // console.log("game result update");

        for(const i in this.team)
        {
            if(this.team[i].teamname==this.userData.entity.city+this.userData.entity.school)
            {
                // console.log("found user data");
                this.userTeamData = this.team[i];
                break;
            }
        }
        // console.log("done user team");
        // console.log(this.userTeamData);
        this.gameResultData = newVal;
        

        setTimeout(()=>
        {
            this.showResultBox=true;
        },250);
    }
  },
};
</script>
