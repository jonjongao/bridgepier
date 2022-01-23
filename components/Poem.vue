<template>
  <div>
    <p class="text-lg font-extrabold leading-none text-[#5D0E18]">{{ poemData===null ? defTitle : poemData.type }}</p>
    <p class="pt-4 text-sm font-bold leading-none">
     {{ poemData===null? defText : poemData.text}}
    </p>
  </div>
</template>

<script>
export default {
  name: "Poem",
  props: ["poemData"],
  data() {
    return {
      defTitle: "類別",
      defText: "煮豆燃豆萁，豆在釜中泣。本是同根生，相煎何太急"
    };
  },
  computed: {},
  watch: {},
};
</script>
