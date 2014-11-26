
module.exports = {
    getAll: function(success, failure) {
        var users = JSON.parse(localStorage.getItem('users'));
        setTimeout(function(){
            success(users);
        }, 0);
    },
};
