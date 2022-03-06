<template>
    <div v-if="show">
        <div class="bg-gray-800/90 absolute top-0 w-full h-[400px]" :class="moveClass">
            <div :class="teamContainerNormalMode">
                <div :class="teamFormNormalMode">
                    <p class="text-white w-5/12 float-left text-xs mobile:text-sm">選擇組別</p>
                    <div class="w-7/12 float-right">
                        <div
                            class="w-full inline-flex shadow-md hover:shadow-lg focus:shadow-lg"
                            role="group"
                        >
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
                </div>

                <div :class="teamFormNormalMode">
                    <p class="text-white w-5/12 float-left text-xs mobile:text-sm">搜尋即時校際積分</p>
                    <div class="w-7/12 float-right flex flex-row">
                        <input
                            ref="schoolInput"
                            :disabled="userData.group != '學生組'"
                            class="w-full h-full p-1"
                            type="text"
                            id
                            placeholder="輸入學校名稱"
                            @input="filterName = $event.target.value"
                        />
                    </div>
                </div>
                <div :class="mode == 'result' ? teamListResultMode : teamListNormalMode">
                    <div
                        ref="team"
                        :id="t.teamname == '社會組' ? 'social' : null"
                        v-for="(t, index) in filterList"
                        :key="t.teamname"
                        class
                    >
                        <div
                            :class="t.teamname === focusTeam ? teamFocusClass : teamNormalClass"
                        >
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
                                <p
                                    class="self-center text-white text-xs mobile:text-sm"
                                >{{ t.teamname }}</p>
                            </div>
                            <div class="flex">
                                <p
                                    class="text-white self-center text-xs mobile:text-sm"
                                >{{ t.score }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="relative top-[400px] w-full h-[32px] flex justify-center">
                <button
                    type="button"
                    @click="clickShow"
                    class="bg-gray-800/60 relative w-[40%] h-full flex justify-center rounded-b-md drop-shadow-md border-b-2 border-l-2 border-r-2 border-white/20"
                >
                    <p class="self-center text-white">{{ isShow ? '收起校際排行榜' : '搜尋校際排行榜' }}</p>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "LeaderboardOverall",
    props: [
        "show",
        "mode",
        "teamList",
        "title"],
    data() {
        return {
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
            groupBtnActive: {
                backgroundColor: "darkorange",
            },
            groupBtnNormal: {
                backgroundColor: "orange",
            },
            teamContainerNormalMode: {
                // absolute: true,
                "absolute": true,
                "w-full": true,
                "top-[calc(100%/12*0.5)]": true,
                "h-[calc(100%/12*1.4)]": true,
            },
            teamListNormalMode: {
                "bg-gray-800/20": true,
                rounded: true,
                relative: true,
                "w-[80%]": true,
                "ml-[10%]": true,
                "mt-[5%]": true,
                // "h-[400%]": true,
                "h-[550%]": true,
                "overflow-auto": true,
                "px-3": true,
                "py-2": true,
            },
            teamListResultMode: {
                "bg-gray-800/20": true,
                rounded: true,
                relative: true,
                "w-[80%]": true,
                "ml-[10%]": true,
                "mt-[3%]": true,
                "h-[430%]": true,
                "overflow-auto": true,
                "px-3": true,
                "py-2": true,
            },
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
                "bg-gray-400/60": true,
                "p-2": true,
                "mb-1": true,
                "justify-between": true,
                rounded: true,
                "focus-team": true,
                "max-h-[40px]": true,
            },
            teamFormNormalMode: {
                relative: true,
                "w-[80%]": true,
                "ml-[10%]": true,
                "h-[50%]": true,
                flex: true,
                "items-center": true,
                "mt-[5%]": true,
                "mt-[3%]": false,
            },
            overlayClass: {
                "bg-red-400/50": true,
                "absolute": true,
                "top-[0%]": true,
                "w-full": true,
                "h-[calc(100%/12*6)]": true,
                "translate-y-[-400px]": true,
            },
            moveClass: {
                "translate-y-[-400px]": true,
                "translate-y-[0px]": false,
                "ease-in-out": true,
                "duration-300": true,
            },
            filterName: "",
            isShow: false,
            focusTeam: "",
        };
    },
    watch: {
        show: function (newVal, oldVal) {
            // console.log("overall update show:" + newVal);
        },
    },
    mounted() {
        // console.log("overall mounted");
    },
    unmounted() {
        // console.log("overall unmounted");
    },
    computed: {
        filterList() {
            let beginArr = this.teamList;
            let idx = this.indexOfUserTeam(this.teamList);

            if (idx >= 0) {
                //beginArr[idx]["isUserTeam"] = true;
                this.focusTeam = this.userData.group == '社會組' ? '社會組' : beginArr[idx].teamname;
            }
            else
                this.focusTeam = '';

            //第一層運算, 根據模式組成隊伍陣列
            switch (this.mode) {
                case "anony":
                    beginArr = this.teamList.slice(0, 20);
                    break;
                case "focus":
                    // let idx = this.indexOfUserTeam(this.teamList);
                    let min = Math.max(0, idx - 3);
                    let med1 = Math.min(idx, this.teamList.length);
                    let med2 = Math.max(0, idx);
                    let max = Math.min(idx + 4, this.teamList.length);
                    let arr1 = this.teamList.slice(min, med1);
                    let arr2 = this.teamList.slice(med2, max);
                    beginArr = arr1.concat(arr2);
                    break;
            }
            //利用第一層的陣列做搜尋欄的篩選

            if (this.filterName.length > 0) {
                let arr = [];
                // console.log(beginArr);
                for (var k in beginArr) {
                    if (beginArr[k].teamname == 'undefined') continue;
                    if (beginArr[k].teamname == null) continue;
                    if (beginArr[k].teamname.includes(this.filterName)) {
                        arr.push(beginArr[k]);
                    }
                }
                return arr;
            }
            else {
                return beginArr;
            }
        },
    },
    methods: {
        onProceed(e) {
            this.$emit("proceed", e);
            this.$refs.schoolInput.value = ""
            this.filterName = "";
        },
        clickShow(e) {
            this.isShow = !this.isShow;
            this.setShow(this.isShow);
        },
        setShow(toggle) {
            if (this.isShow) {
                this.moveClass['translate-y-[-400px]'] = false;
                this.moveClass['translate-y-[0px]'] = true;
            }
            else {
                this.moveClass['translate-y-[-400px]'] = true;
                this.moveClass['translate-y-[0px]'] = false;
            }
        },
        onClickStudentGroup(e) {
            this.userData.group = e.target.value;
            this.$refs.schoolInput.value = "";
            this.filterName = "";
        },
        onClickSocialGroup(e) {
            this.userData.group = e.target.value;
            this.$refs.schoolInput.value = "";
            this.filterName = "";
            this.scrollToUserTeam("#social");
        },
        scrollToUserTeam(selector) {
            this.$nextTick(() => {
                // console.log("try scroll");
                // console.log(this.mode);
                let el = document.querySelector(selector);
                if (el != null) {
                    el.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                        inline: "nearest",
                    });
                }
            });
        },
        indexOfUserTeam(arr) {
            for (var i = 0; i < arr.length; i++) {
                if (this.isUserTeam(arr[i]))
                    return i;
            }
            return -1;
        },
        isUserTeam(teamValue) {
            if (teamValue.teamname == "社會組" && this.userData.group == "社會組")
                return true;
            return (teamValue.teamname ==
                this.userData.entity.city + this.userData.entity.school);
        },
    },
};
</script>
