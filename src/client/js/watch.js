import { handleDeleteComment } from "./watchModule";

const commentDeleteBtns = document.querySelectorAll(".js-delete-btn");

for (const deleteBtn of commentDeleteBtns) {
  deleteBtn.addEventListener("click", handleDeleteComment);
}
