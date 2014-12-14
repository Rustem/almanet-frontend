
module.exports = {
    getAll: function(success, failure) {
        var notifications = JSON.parse(localStorage.getItem('notifications'));
        setTimeout(function(){
            success(notifications);
        }, 0);
    },

    userHasRead: function(details, success, failure) {
        var rawNotifs = JSON.parse(localStorage.getItem('notifications')) || [],
            notif = null;
        for(var i = 0; i<rawNotifs.length; i++) {
            var cur = rawNotifs[i];
            if(cur.id === details.notification_id) {
                cur.is_new = false;
                notif = cur;
                break;
            }
        }
        localStorage.setItem('notifications', JSON.stringify(rawNotifs));
        setTimeout(function() {
            success(notif);
        }, 0);
    },
};
