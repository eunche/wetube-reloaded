import addComma from "./addComma";

let globalFollower = group.follower.length;

const follower = document.querySelector(".js-follower");
const followBtn = document.querySelector(".js-follow-btn");
const newVideo = document.querySelector(".js-new-video");


follower.innerHTML = addComma(globalFollower);

let method;
if(group.follower.find(f => String(f) === String(user._id))){
    method = "DELETE";
    newVideo.classList.remove("js-display-none");
}
else{
    method = "POST";
}

const clickFollowHandle = async (event) => {
    const data = {
        groupId: group._id,
    };
    const response = await fetch(`/api/groups/${user._id}/follow`, {
        method,
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    })

    if(method === "POST"){
        followBtn.innerText = "그룹 탈퇴";
        method = "DELETE";
        globalFollower += 1;
        follower.innerText = addComma(globalFollower);
        newVideo.classList.toggle("js-display-none");
    }
    else{
        followBtn.innerText = "그룹 가입"
        method = "POST";
        globalFollower -= 1;
        follower.innerText = addComma(globalFollower);
        newVideo.classList.toggle("js-display-none");
    }
}

followBtn.addEventListener("click", clickFollowHandle)