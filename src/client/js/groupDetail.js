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

        const asideGroups = document.querySelectorAll(".video-group-wrapper")[1]

        let avatar;
        if(group.thumbURL){
            avatar = `<img src="${group.thumbURL}">`
        }
        else{
            avatar = `<span>${group.name[0]}</span>`
        }
        asideGroups.insertAdjacentHTML("beforeend", `
            <a href="/groups/${group.name}" class="group-set">
                <div class="img-wrapper">
                    ${avatar}
                </div>
                <span>${group.name[0]}</span>
            </a>
        `)
    }
    else{
        followBtn.innerText = "그룹 가입"
        method = "POST";
        globalFollower -= 1;
        follower.innerText = addComma(globalFollower);
        newVideo.classList.toggle("js-display-none");

        const asideGroups = document.querySelectorAll(".video-group-wrapper")[1].querySelectorAll(".group-set");
        for (const g of asideGroups) {
            if(g.querySelector("span").innerText === group.name){
                g.remove();
            }
        }
    }
}

followBtn.addEventListener("click", clickFollowHandle)