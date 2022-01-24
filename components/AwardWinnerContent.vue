<template>
  <div :class="cellContentClass">
    <p class="mb-4 mobile:text-2xl text-lg font-extrabold">
      {{ awardData === null ? "將於" + initialDate + "公佈" : awardData.date+'得獎名單' }}
    </p>
    <p class="mb-2 mobile:text-lg text-sm">
      {{
        awardData === null
          ? "敬請期待"
          : awardData.username[0] + " " + awardData.gameuid[0]
      }}
    </p>
    <p class="mb-2 mobile:text-lg text-sm">
      {{
        awardData === null
          ? "敬請期待"
          : awardData.username[1] + " " + awardData.gameuid[1]
      }}
    </p>
    <p class="mb-2 mobile:text-lg text-sm">
      {{
        awardData === null
          ? "敬請期待"
          : awardData.username[2] + " " + awardData.gameuid[2]
      }}
    </p>
    <p class="mb-2 mobile:text-lg text-sm">
      {{
        awardData === null
          ? "敬請期待"
          : awardData.username[3] + " " + awardData.gameuid[3]
      }}
    </p>
  </div>
</template>

<script>
export default {
  name: "AwardWinnerContent",
  props: ["initialDate", "awardData"],
  data() {
    return {
      cellContentClass: {
        "m-[20px]": false,
        "text-sm": false,
        "text-[gold]": true,
        "text-center":true,
      },
    };
  },
  computed: {},
  watch: {},
};
</script>
