//evals that are in use
global.locked_evals = [];

var sockets = function(io){

    io.on('connection', function (socket) {
      
      socket.on('check_locked_evals', function(data) {
        socket.emit("locked_evals_update", {locked_evals: global.locked_evals});
      });

      //console.log("A user has just connected.");
      socket.on('eval_opened', function(data) {
        data["id"] = socket.id;
        //TODO: before adding eval to array check if its there first, if is dont add and send update, else add and send update
        if(!checkIfEvalIsInUse(global.locked_evals, data.eval)){
          global.locked_evals.push(data);
        }
        
        socket.broadcast.emit("locked_evals_update", {locked_evals: global.locked_evals});
        console.log("Global array after evals_opened add: " + JSON.stringify(global.locked_evals));
      });

      socket.on('eval_closed', function(data) {
        removeLockedEvalBySocketId(global.locked_evals, socket.id);
        socket.broadcast.emit("locked_evals_update", {locked_evals: global.locked_evals});
        console.log("Global array after eval_closed remove: " + JSON.stringify(global.locked_evals));
      });

      socket.on('user_logout', function(data) {
        removeLockedEvalByUserId(global.locked_evals, data.user);
        socket.broadcast.emit("locked_evals_update", {locked_evals: global.locked_evals});
        console.log("Global array after user_logout remove: " + JSON.stringify(global.locked_evals));
      });

      socket.on('disconnect', function (data) {
        removeLockedEvalBySocketId(global.locked_evals, socket.id);
        socket.broadcast.emit("locked_evals_update", {locked_evals: global.locked_evals});
        console.log("A user has just disconnected. Evals: " + JSON.stringify(global.locked_evals));
      });

    });

    function removeLockedEvalBySocketId(array, idToRemove) {
      for(var i = 0; i < array.length; i++) {
        if(array[i].id == idToRemove){
          array.splice(i, 1);
          //return;
        }
      }
    };

    function removeLockedEvalByUserId(array, idToRemove) {
      for(var i = 0; i < array.length; i++) {
        if(array[i].user == idToRemove){
          array.splice(i, 1);
          //return;
        }
      }
    };

    function checkIfEvalIsInUse(array, idToAdd) {
      for(var i = 0; i < array.length; i++) {
        if(array[i].eval == idToAdd){
          return true;
        }
      }
      return false;
    }
}

module.exports = sockets;
