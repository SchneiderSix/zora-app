import { db } from "../api/connect";

class Notification {
    constructor(sendID, receiverID, type) {
        this.sendID = sendID;
        this.receiverID = receiverID;
        this.type = type;
    };

    static notifSave() {
        q = `INSERT INTO notifications (sendID, receiverID, type) VALUES ${this.sendID, this.receiverID, this.type}`;
        db.query(q, function (error) {
            if (error) throw error;
            console.log('inserted into query');
        });
    };
};

export default Notification;