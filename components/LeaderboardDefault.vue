<template>
  <div>
    <div
        v-if="mode != 'result'"
        class="absolute w-full top-[calc(100%/12*3.7)] h-[calc(100%/12*1)] flex items-center justify-center"
      >
        <p class="text-black text-2xl font-black">{{ title }}</p>
      </div>
      <div :class="teamContainerNormalMode">
        <!-- <div :class="teamFormNormalMode">
          <p class="text-black w-5/12 float-left text-xs mobile:text-sm">選擇組別</p>
          <div class="w-7/12 float-right">
            <div class="w-full inline-flex shadow-md hover:shadow-lg focus:shadow-lg" role="group">
              <button
                type="button"
                class="w-[50%] rounded-l inline-block px-4 py-2.5 text-black font-medium text-xs leading-tight uppercase border-l-2 border-t-2 border-b-2 border-r-2 border-yellow-200"
                value="學生組"
                @click="onClickStudentGroup"
                :style="
                  userData.group == '學生組' ? groupBtnActive : groupBtnNormal
                "
              >學生組</button>
              <button
                type="button"
                class="w-[50%] rounded-r inline-block px-4 py-2.5 text-black font-medium text-xs leading-tight uppercase border-r-2 border-t-2 border-b-2 border-yellow-200"
                value="社會組"
                @click="onClickSocialGroup"
                :style="
                  userData.group == '社會組' ? groupBtnActive : groupBtnNormal
                "
              >社會組</button>
            </div>
          </div>
        </div> -->

        <!-- <div :class="teamFormNormalMode">
          <p class="text-black w-5/12 float-left text-xs mobile:text-sm">搜尋即時校際積分</p>
          <div class="w-7/12 float-right flex flex-row">
            <input
              :disabled="userData.group != '學生組'"
              class="w-full h-full p-1"
              type="text"
              id
              placeholder="輸入學校名稱"
              @input="filterName = $event.target.value"
            />
          </div>
        </div> -->
        <div :class="mode == 'result' ? teamListResultMode : teamListNormalMode">
          <div
            ref="team"
            :id="t.teamname == '社會組' ? 'social' : null"
            v-for="(t, index) in filterList"
            :key="t.teamname"
            class
          >
            <div :class="t.teamname === focus ? teamFocusClass : teamNormalClass">
              <div class="flex flex-row">
                <img
                  class="object-contain"
                  v-if="t.rank == 0"
                  src="~/assets/icons8-1st-place-medal-48.png"
                  width="24px"
                  height="24px"
                />
                <img
                  class="object-contain"
                  v-if="t.rank == 1"
                  src="~/assets/icons8-2nd-place-medal-48.png"
                  width="24px"
                  height="24px"
                />
                <img
                  class="object-contain"
                  v-if="t.rank == 2"
                  src="~/assets/icons8-3rd-place-medal-48.png"
                  width="24px"
                  height="24px"
                />
                <div v-if="t.rank > 2" style="width: 24px" />
                <p
                  class="pr-1 self-center text-white text-xs mobile:text-sm"
                >{{ "#" + (t.rank + 1) }}</p>
                <p class="self-center text-white text-xs mobile:text-sm">{{ t.teamname }}</p>
              </div>
              <div class="flex">
                <p class="text-white self-center text-xs mobile:text-sm">{{ t.score }}</p>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="mode != 'result'"
          class="flex space-x-2 justify-center mt-[5%]"
        >
          <button
            type="button"
            class="inline-block px-12 py-3 bg-gradient-to-b from-yellow-300 to-yellow-500 hover:from-yellow-200 hover:to-yellow-400 text-gray-600 font-black text-2xl uppercase shadow-md focus:ring-0 active:shadow-lg transition duration-150 ease-in-out border-2 border-yellow-200"
            @click="onProceed"
          >{{ proceedBtnLabel }}</button>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: "LeaderboardDefault",
  props: [
  "mode",
  "focus",
  "filterList",
  "title",
  "proceedBtnLabel",
  "teamListResultMode",
  "teamListNormalMode",
  "teamContainerNormalMode",],
  data() {
    return {
       teamNormalClass: {
                flex: true,
                "flex-row": true,
                "bg-gray-800/20": true,
                "p-2": true,
                "mb-1": true,
                "justify-between": true,
                rounded: true,
                "max-h-[40px]": true,
            },
            teamFocusClass: {
                flex: true,
                "flex-row": true,
                "bg-gray-800/60": true,
                "p-2": true,
                "mb-1": true,
                "justify-between": true,
                rounded: true,
                "focus-team": true,
                "max-h-[40px]": true,
            },
            filterName: "",
    };
  },
  watch: {
    
  },
  methods: {
   onProceed(e) {
            this.$emit("proceed", e);
            this.filterName = "";
        },
  },
};
</script>
