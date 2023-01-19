import { useNavigate } from 'react-router-dom';


  export const Friend = ({ friend }) => {

    const navi = useNavigate();
    const handleFriendProfile = (friend) => {
      navi("/profile/" + friend.id);
      window.location.reload(false);
    };

    return (
      <div className="user">
        <div className="userInfo">
          <img
            src={"/upload/" + friend.profilePic}
            alt=""
          />
          <div className="online" />
          <span onClick={() => handleFriendProfile(friend)}>{friend.name}</span>
        </div>
      </div>
    )
};

export default Friend;
