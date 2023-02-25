import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { useState } from "react";
import { socket } from '../../index.js';

const Notification = () => {
    const { currentUser } = useContext(AuthContext);
    const [isTimeouted, setIsTimeouted] = useState(false);
    const [desc, setDesc] = useState('');

    socket.on('sendNotification', (data) => {
        setIsTimeouted(true);
        setDesc(data.notiText);
        setTimeout(() => {
            setIsTimeouted(false);
            setDesc('');
        }, 4000);
    });

    return (
        <div>
            {isTimeouted === true && 
                <div className="notif">{desc}</div>
            }
        </div>
    )
}

export default Notification;