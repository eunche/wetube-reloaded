const deleteCommentElement = (commentElement) => {
  commentElement.remove();
};

export const handleDeleteComment = async (event) => {
  const myVideoContainer = document.getElementById("videoContainer");
  const videoId = myVideoContainer.dataset.video_id;
  const commentWrapper = event.target.parentNode;
  const commentId = commentWrapper.dataset.id;

  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentId }),
  });

  if (response.status === 200) {
    deleteCommentElement(commentWrapper);
  }
};
