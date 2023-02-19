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
          <img
            src={friend.profilePic}
            alt=""
          />
          </div>
          <div className='online'></div>
          <span onClick={() => handleFriendProfile(friend)}>{friend.name}</span>
        </div>
      </div>
    )
};

export default Friend;
