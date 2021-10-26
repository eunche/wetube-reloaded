import { handleDeleteComment } from "./watchModule";
import * as followingToggle from "./followingToggle";

const commentDeleteBtns = document.querySelectorAll(".js-delete-btn");

for (const deleteBtn of commentDeleteBtns) {
  deleteBtn.addEventListener("click", handleDeleteComment);
}

if(user){
  followingToggle.init();
}