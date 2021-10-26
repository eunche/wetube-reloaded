import * as followingToggle from "./followingToggle";

if(user){
    const newVideo = document.querySelector(".js-new-video");
    
    
    if(group.follower.find(f => String(f) === String(user._id))){
        newVideo.classList.remove("js-display-none");
    }
    
    const handleNewVideoButton = async (event) => {
        if(followingToggle.method === "POST"){
            newVideo.classList.toggle("js-display-none");
        }
        else{
            newVideo.classList.toggle("js-display-none");
        }
    }
    
    followingToggle.followBtn.addEventListener("click", handleNewVideoButton)
    
    followingToggle.init();
}