// 유저 프로필 avatar-default의 user.name을 맨앞글자로 변경시키는 코드
const getFirstAlphabet = (text) => {
  return text.charAt(0);
};

try {
  const avatarDefault = document.querySelector(".js-avatar-default");
  avatarDefault.innerText = getFirstAlphabet(avatarDefault.innerText);
} catch {}
