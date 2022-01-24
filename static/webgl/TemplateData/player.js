var container = document.querySelector("#unity-container");
var canvas = document.querySelector("#unity-canvas");
var loadingBar = document.querySelector("#unity-loading-bar");
var progressBarFull = document.querySelector("#unity-progress-bar-full");

var buildUrl = "webgl/" + "Build";
var loaderUrl = buildUrl + "/webgl.loader.js";
var config = {
    dataUrl: buildUrl + "/webgl.data.unityweb",
    frameworkUrl: buildUrl + "/webgl.framework.js.unityweb",
    codeUrl: buildUrl + "/webgl.wasm.unityweb",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "Battleham",
    productName: "PUBGM 2022 LunarYear",
    productVersion: "1.0",
    // showBanner: unityShowBanner,
    matchWebGLToCanvasSize: true, // Uncomment this to separately control WebGL canvas render size and DOM element size.
    // devicePixelRatio: 1, // Uncomment this to override low DPI rendering on high DPI displays.
};

if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    // container.className = "unity-mobile";
    // Avoid draining fillrate performance on mobile devices,
    // and default/override low DPI mode on mobile browsers.
    config.devicePixelRatio = 1;
} else {
    // container.style.width = "414px";
    // container.style.height = "796px";
    // canvas.style.width = "414px";
    // canvas.style.height = "796px";
}

loadingBar.style.display = "block";

var script = document.createElement("script");
script.src = loaderUrl;
script.onload = () => {
    createUnityInstance(canvas, config, (progress) => {
        progressBarFull.style.width = 100 * progress + "%";
    }).then((unityInstance) => {
        document.dispatchEvent(new CustomEvent('onUnityInstanceCreated', {detail: unityInstance}));
        loadingBar.style.display = "none";
    }).catch((message) => {
        alert(message);
    });
};
document.body.appendChild(script);
