export default ({ app, store }, inject) => {
  inject("post2parent", {
    message({ key = "", value = "" }) {
      const e = {
        key: key,
        value: value,
      };
      window.parent.postMessage(e, "*");
      console.log("[plugin]game post message:", e);
    },
  });
};
