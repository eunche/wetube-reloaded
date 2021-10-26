import { handleDeleteComment } from "./watchModule";

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const commentTextarea = form.querySelector("#commentTextarea");
const btn = form.querySelector("button");

const addComment = (id, text, createdAt) => {
  const videoComments = document.querySelector(".video__comments");
  let date = new Date(createdAt.slice(0,10));
  let hours = Number(createdAt.slice(11,13)) + 9
  let times = createdAt.slice(13,16);
  if(hours >= 24){
    hours -= 24;
    hours = "00" + hours;
    hours = hours.slice(-2);
    date.setDate(date.getDate() + 1);
  }

  let avatarHTML;
  if(user.avatarURL === "/static/img/global/profile-user.png"){
    avatarHTML = `
      <div class="text-avatar">
        <span>${user.username[0]}</span>
      </div>
    `
  }
  else{
    avatarHTML = `<img src="${user.avatarURL}">`;
  }
  const resultCreatedAt = `${(date.getFullYear())}-${("0"+(date.getMonth()+1)).slice(-2)}-${date.getDate()} - ${hours}${times}`
  const newComment = `
    <li class="comment" data-id="${id}">
      <div class="contents">
        <a class="avatar" href="/users/${user._id}">
          ${avatarHTML}
        </a>
        <a class="contents__username" href="/users/${user._id}">eunche</a>
        <span class="contents__comment-text">${text}</span>
        <div class="related-btns"></div>
      </div>
      <div class="createdAt">
        <span>${resultCreatedAt}</span>
      </div>
    </li>
  `;
  videoComments.insertAdjacentHTML("afterbegin", newComment);
  // document
  //   .querySelector(".js-delete-btn")
  //   .addEventListener("click", handleDeleteComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const text = commentTextarea.value;
  const videoId = videoContainer.dataset.video_id;

  if (text === "") {
    return;
  }

  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (response.status === 201) {
    commentTextarea.value = "";
    const { _id:id, text, createdAt } = await response.json();
    addComment(id, text, createdAt);
  }
};

form.addEventListener("submit", handleSubmit);
