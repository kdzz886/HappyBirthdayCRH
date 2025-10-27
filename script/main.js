let audioUrl = "";
let audio = null;
let isPlaying = false;

// 导入自定义数据并插入到页面
const fetchData = () => {
  fetch("customize.json")
    .then(res => res.json())
    .then(data => {
      const dataArr = Object.keys(data);

      dataArr.forEach(customData => {
        if (data[customData] !== "") {
          if (customData === "imagePath") {
            document
              .querySelector(`[data-node-name*="${customData}"]`)
              .setAttribute("src", data[customData]);
          } else if (customData === "fonts") {
            data[customData].forEach(font => {
              const link = document.createElement("link");
              link.rel = "stylesheet";
              link.href = font.path;
              document.head.appendChild(link);
              document.body.style.fontFamily = font.name;
            });
          } else if (customData === "music") {
            audioUrl = data[customData];
            audio = new Audio(audioUrl);
            audio.preload = "auto";
            audio.loop = true; // ✅ 循环播放
          } else {
            document.querySelector(`[data-node-name*="${customData}"]`).innerText = data[customData];
          }
        }

        // 数据加载完后绑定启动按钮
        if (dataArr.length === dataArr.indexOf(customData) + 1) {
          document.querySelector("#startButton").addEventListener("click", startExperience);
        }
      });
    });
};

// 启动动画与音乐播放
function startExperience() {
  document.querySelector(".startSign").style.display = "none";
  playMusic();
  animationTimeline();
}

// 尝试播放音乐（带重试逻辑）
function playMusic() {
  if (!audio) return;
  audio.volume = 1.0;

  audio.play().then(() => {
    isPlaying = true;
    playPauseButton.classList.add("playing");
    console.log("音乐播放成功 🎵");
  }).catch(err => {
    console.warn("⚠️ 音乐首次播放失败，1 秒后自动重试", err);
    setTimeout(() => {
      audio.play().then(() => {
        isPlaying = true;
        playPauseButton.classList.add("playing");
      }).catch(e => console.error("❌ 音乐播放仍失败：", e));
    }, 1000);
  });
}

// 暂停音乐
function pauseMusic() {
  if (!audio) return;
  audio.pause();
  isPlaying = false;
  playPauseButton.classList.remove("playing");
}

// 切换播放状态
function togglePlay(play) {
  if (!audio) return;
  play ? playMusic() : pauseMusic();
}

// 绑定播放按钮事件
const playPauseButton = document.getElementById("playPauseButton");
playPauseButton.addEventListener("click", () => {
  togglePlay(!isPlaying);
});

// --------------------- 动画部分保持不变 ---------------------

const animationTimeline = () => {
  const textBoxChars = document.getElementsByClassName("hbd-chatbox")[0];
  const hbd = document.getElementsByClassName("wish-hbd")[0];

  textBoxChars.innerHTML = `<span>${textBoxChars.innerHTML.split("").join("</span><span>")}</span>`;
  hbd.innerHTML = `<span>${hbd.innerHTML.split("").join("</span><span>")}</span>`;

  const ideaTextTrans = { opacity: 0, y: -20, rotationX: 5, skewX: "15deg" };
  const ideaTextTransLeave = { opacity: 0, y: 20, rotationY: 5, skewX: "-15deg" };

  const tl = new TimelineMax();

  tl.to(".container", 0.1, { visibility: "visible" })
    .from(".one", 0.7, { opacity: 0, y: 10 })
    .from(".two", 0.4, { opacity: 0, y: 10 })
    .to(".one", 0.7, { opacity: 0, y: 10 }, "+=2.5")
    .to(".two", 0.7, { opacity: 0, y: 10 }, "-=1")
    .from(".three", 0.7, { opacity: 0, y: 10 })
    .to(".three", 0.7, { opacity: 0, y: 10 }, "+=2")
    .from(".four", 0.7, { scale: 0.2, opacity: 0 })
    .from(".fake-btn", 0.3, { scale: 0.2, opacity: 0 })
    .staggerTo(".hbd-chatbox span", 0.5, { visibility: "visible" }, 0.05)
    .to(".fake-btn", 0.1, { backgroundColor: "#8FE3B6" })
    .to(".four", 0.5, { scale: 0.2, opacity: 0, y: -150 }, "+=0.7")
    .from(".idea-1", 0.7, ideaTextTrans)
    .to(".idea-1", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-2", 0.7, ideaTextTrans)
    .to(".idea-2", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-3", 0.7, ideaTextTrans)
    .to(".idea-3 strong", 0.5, {
      scale: 1.2,
      x: 10,
      backgroundColor: "rgb(21, 161, 237)",
      color: "#fff"
    })
    .to(".idea-3", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-4", 0.7, ideaTextTrans)
    .to(".idea-4", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-5", 0.7, {
      rotationX: 15,
      rotationZ: -10,
      skewY: "-5deg",
      y: 50,
      z: 10,
      opacity: 0
    }, "+=0.5")
    .to(".idea-5 .smiley", 0.7, { rotation: 90, x: 8 }, "+=0.4")
    .to(".idea-5", 0.7, { scale: 0.2, opacity: 0 }, "+=2")
    .staggerFrom(".idea-6 span", 0.8, {
      scale: 3, opacity: 0, rotation: 15, ease: Expo.easeOut
    }, 0.2)
    .staggerTo(".idea-6 span", 0.8, {
      scale: 3, opacity: 0, rotation: -15, ease: Expo.easeOut
    }, 0.2, "+=1")
    .staggerFromTo(".baloons img", 2.5, { opacity: 0.9, y: 1400 }, { opacity: 1, y: -1000 }, 0.2)
    .from(".lydia-dp", 0.5, {
      scale: 3.5, opacity: 0, x: 25, y: -25, rotationZ: -45
    }, "-=2")
    .from(".hat", 0.5, { x: -100, y: 350, rotation: -180, opacity: 0 })
    .staggerFrom(".wish-hbd span", 0.7, {
      opacity: 0, y: -50, rotation: 150, skewX: "30deg", ease: Elastic.easeOut.config(1, 0.5)
    }, 0.1)
    .staggerFromTo(".wish-hbd span", 0.7, {
      scale: 1.4, rotationY: 150
    }, {
      scale: 1, rotationY: 0, color: "#ff69b4", ease: Expo.easeOut
    }, 0.1, "party")
    .from(".wish h5", 0.5, { opacity: 0, y: 10, skewX: "-15deg" }, "party")
    .staggerTo(".eight svg", 1.5, {
      visibility: "visible", opacity: 0, scale: 80, repeat: 3, repeatDelay: 1.4
    }, 0.3)
    .to(".six", 0.5, { opacity: 0, y: 30, zIndex: "-1" })
    .staggerFrom(".nine p", 1, ideaTextTrans, 1.2)
    .to(".last-smile", 0.5, { rotation: 90 }, "+=1");

  // 重新播放
  const replyBtn = document.getElementById("replay");
  replyBtn.addEventListener("click", () => {
    tl.restart();
    playMusic(); // 点击重播时也重新播放音乐
  });
};

// 启动
fetchData();
