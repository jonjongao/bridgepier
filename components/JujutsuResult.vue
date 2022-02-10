<template>
  <div v-if="isShow">
    <div class="absolute w-full top-[0%] h-[calc(100%/12*1)] pointer-events-none">
      <button
        class="relative w-[20%] h-[100%] ml-[80%] pointer-events-auto z-10"
        type="button"
        @click="onClickReturn"
      ></button>
    </div>
    <div
      class="absolute w-full top-[calc(100%/12*4)] h-[calc(100%/12*1)] flex items-center justify-center"
    >
      <button
        class="relative w-[55%] h-[100%]"
        type="button"
        @click="onClickDownloadApp"
      ></button>
    </div>
    <div
      class="absolute w-full top-[calc(100%/12*11)] h-[calc(100%/12*1)] flex items-center justify-center"
    >
      <button
        class="relative w-[80%] h-[100%]"
        type="button"
        @click="onClickFacebookShare"
      ></button>
    </div>
  </div>
</template>

<script>
export default {
  name: "JujutsuResult",
  props: ["show"],
  data() {
    return {
      isShow: false,
    };
  },
  methods: {
    onClickReturn(e) {
      this.$emit("click-return", e);
    },
    onClickDownloadApp(e) {
      this.$emit("click-download", e);
    },
    onClickFacebookShare(e) {
      this.$emit("click-share", e);
    },
  },
  mounted() {},
  computed: {},
  watch: {
    show: function (newVal, oldVal) {
      this.isShow = newVal;
      console.log("show update");
    },
  },
};
</script>
