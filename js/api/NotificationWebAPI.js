
module.exports = {
    getAll: function(success, failure) {
        var notifications = JSON.parse(localStorage.getItem('notifications'));
        setTimeout(function(){
            success(notifications);
        }, 0);
    },
};
