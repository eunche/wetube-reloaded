// SCSS
import "../scss/styles.scss";

// JS
import getFirstAlphabet from "./getFirstAlphabet";

// 유저 프로필 avatar-default 맨앞글자로 변경시키는 코드
try {
  const avatarDefault = document.querySelector(".js-avatar-default");
  avatarDefault.innerText = getFirstAlphabet(avatarDefault.innerText);
} catch {}
