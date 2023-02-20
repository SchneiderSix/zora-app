import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { Await, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import { useState } from "react";
import { fontSize } from "@mui/system";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const { isLoading, error, data } = useQuery(["user"], () =>
    makeRequest.get("/users/find/" + userId).then((res) => {
      return res.data;
    })
  );

  const { isLoading: rIsLoading, data: relationshipData } = useQuery(
    ["relationship"],
    () =>
      makeRequest.get("/relationships?followedUserId=" + userId).then((res) => {
        return res.data;
      })
  );

  const getLastFive = async (id) => {
    const data = await makeRequest.get("/users/five/" + id);
    return data;
  };

  const prom = async (re1, re2) =>{
    const res1 = re1;
    const res2 = re2;
    await Promise.all([res1, res2]);
  }
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (following) => {
      if (following){
        makeRequest.get("/users/find/friends/" + currentUser.id).then((res) => {
          const network = {};
          //Add bocked users to the network
          network["block"]= makeRequest.get(`users/blocked/${currentUser.id}`);
          const userFriends = [];
          for (let i of Object.values(res.data)) {
            userFriends.push(i.id);
          }
          //Don't add userId of current profile (unfollowed) for network 
          userFriends.pop(userId);
          network["?"+currentUser.id] = userFriends;
          for (let i of network["?"+currentUser.id]) {
            if (!network[i])
              network[i] = [];
            getLastFive(i).then((user) =>{
            for (let j of Object.values(user.data)){
              network[i].push(j.id);
            }
            //Last iteration
            if (i === userFriends[userFriends.length - 1]) {
              makeRequest.post(`/users/simple`, network).then((response) => {
                prom(makeRequest.put(`/users/reco/friend/${currentUser.id}/${Object.values(response.data["recommendation"])[0]}`),
                window.location.reload()
                );
              });
            }
          });
          }
        });
        return makeRequest.delete("/relationships?userId=" + userId);
      }
      makeRequest.get("/users/find/friends/" + currentUser.id).then((res) => {
        const network = {};
        //Add bocked users to the network
        network["block"]= makeRequest.get(`users/blocked/${currentUser.id}`);
        const userFriends = [];
        for (let i of Object.values(res.data)) {
          userFriends.push(i.id);
        }
        userFriends.push(userId);
        network["?"+currentUser.id] = userFriends;
        for (let i of network["?"+currentUser.id]) {
          if (!network[i])
            network[i] = [];
          getLastFive(i).then((user) =>{
          for (let j of Object.values(user.data)){
            network[i].push(j.id);
          }
          //Last iteration
          if (i === userFriends[userFriends.length - 1]) {
            makeRequest.post(`/users/simple`, network).then((response) => {
              prom(makeRequest.put(`/users/reco/friend/${currentUser.id}/${Object.values(response.data["recommendation"])[0]}`),
              makeRequest.put(`/users/checkreco/${currentUser.id}/${Object.values(response.data["recommendation"])[0]}`),
              window.location.reload()
              );
            });
          }
        });
        }
      });
      return makeRequest.post("/relationships", { userId });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["relationship"]);
      },
    }
  );

  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id));
    //window.location.reload();
  };

  const handleBlock = () => {
    makeRequest.put(`/users/block/${currentUser.id}/x`)//.then(()=>{makeRequest.delete("/relationships?userId=" + userId)});
    .then(() => window.location.reload());
  };

  const navigate = useNavigate()

  return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
            <img src={data.coverPic} alt="" className="cover" />
            <img src={data.profilePic} alt="" className="profilePic" />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              
              <div className="center">
                <span>{data.username}</span>
                <span className="at">@{data.name}</span>

                <div className="info">
                  <div className="item">
                   {data.city ? <PlaceIcon /> : ""}
                    <span>{data.city}</span>
                  </div>
                  <div className="item">
                    {data.website ? <LanguageIcon /> : ""}
                    <span>{data.website}</span>
                  </div>
                </div>
                {rIsLoading ? (
                  "loading"
                ) : userId === currentUser.id ?
                <>
                  <button onClick={() => setOpenUpdate(true)}>update</button>
                  <button onClick={() => navigate(`/profile/${currentUser.id}/stats`)}>stats</button>
                </>
                  
                : (
                  <>
                  <button onClick={handleFollow}>
                    {relationshipData.includes(currentUser.id)
                      ? "Following"
                      : "Follow"}
                  </button>
                  <button onClick={handleBlock}>block</button>
                  </>
                )
                }
              </div>
            </div>
            <Posts userId={userId} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
