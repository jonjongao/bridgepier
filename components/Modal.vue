<template>
  <div :class="modalClass">
    <div
      class="relative flex flex-col w-[75%] rounded-xl bg-[#262626] text-white"
    >
      <p class="p-8 text-xl text-center" style="white-space: pre-line">
        {{ data == null ? "" : data.message.trim() }}
      </p>
      <button
        type="button"
        class="w-full h-[60px] bottom-0 bg-[#262626] border-t border-white/20 rounded-b-xl text-xl font-black text-yellow-400"
        @click="onClickConfirm"
      >
        確定
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  props: ["data"],
  data() {
    return {
      modalClass: {
        absolute: true,
        grid: true,
        "place-items-center": true,
        "top-0": true,
        "left-0": true,
        "w-full": true,
        "h-full": true,
        "z-20": true,
        "bg-black/50": true,
        visible: false,
        invisible: true,
        "pointer-events-none": true,
      },
      setting: {
        show: false,
        message: "",
      },
    };
  },
  watch: {
    data: function (newVal, oldVal) {
      // console.log(newVal);
      if (newVal == null || Boolean(newVal.show) == false) {
        this.modalClass.visible = false;
        this.modalClass.invisible = true;
        this.modalClass["pointer-events-none"] = true;
      } else {
        this.modalClass.visible = true;
        this.modalClass.invisible = false;
        this.modalClass["pointer-events-none"] = false;
      }
    },
  },
  methods: {
    onClickConfirm(e) {
      this.$emit("modal-confirm", e);
    },
  },
};
</script>
