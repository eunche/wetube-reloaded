import addComma from "./addComma";


export const follower = document.querySelector(".js-follower");
export const followBtn = document.querySelector(".js-follow-btn");

export let globalFollower = group.follower.length;
export let method;


export const init = () => {
    followBtn.addEventListener("click", clickFollowHandle)

    follower.innerHTML = addComma(globalFollower);

    if(group.follower.find(f => String(f) === String(user._id))){
        method = "DELETE";
    }
    else{
        method = "POST";
    }
}

export const clickFollowHandle = async (event) => {
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
                <span>${group.name}</span>
            </a>
        `)
    }
    else{
        followBtn.innerText = "그룹 가입"
        method = "POST";
        globalFollower -= 1;
        follower.innerText = addComma(globalFollower);

        const asideGroups = document.querySelectorAll(".video-group-wrapper")[1].querySelectorAll(".group-set");
        for (const g of asideGroups) {
            if(g.querySelectorAll("span")[g.querySelectorAll("span").length-1].innerText === group.name){
                g.remove();
            }
        }
    }
}