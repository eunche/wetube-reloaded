import { handleDeleteComment } from "./watchModule";

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const btn = form.querySelector("button");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = `
    <li class="video__comment" data-id="${id}">
        <i class="fas fa-comment"></i>
        <span> ${text} </span>
        <span class="js-delete-btn">❌</span>
    </li>
  `;
  videoComments.insertAdjacentHTML("afterbegin", newComment);
  document
    .querySelector(".js-delete-btn")
    .addEventListener("click", handleDeleteComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const text = textarea.value;
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
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

form.addEventListener("submit", handleSubmit);
