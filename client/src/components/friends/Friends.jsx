import { useNavigate } from 'react-router-dom';


  export const Friend = ({ friend }) => {

    const navi = useNavigate();
    const handleFriendProfile = (friend) => {
      navi("/profile/" + friend.id);
      window.location.reload(false);
    };

    return (
      <div className="user">
        <div className="user-info">
          <div>
          <img style={{borderRadius: "100%", width: 40, objectFit: "cover"}}
            src={friend.profilePic}
            alt=""
          />
          </div>
          <div></div>
          <span onClick={() => handleFriendProfile(friend)}>{friend.name}</span>
        </div>
      </div>
    )
};

export default Friend;
