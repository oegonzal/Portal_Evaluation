(function() {
	"use strict";

	angular.module("p1")
	.factory('socket', function ($rootScope) {
	  var socket = io.connect('http://sl73vlporapd001:8443');
	  return {
	  	io: socket,
	    on: function (eventName, callback) {
	      socket.on(eventName, function () {  
	        var args = arguments;
	        $rootScope.$apply(function () {
	          callback.apply(socket, args);
	        });
	      });
	    },
	    emit: function (eventName, data, callback) {
	      socket.emit(eventName, data, function () {
	        var args = arguments;
	        $rootScope.$apply(function () {
	          if (callback) {
	            callback.apply(socket, args);
	          }
	        });
	      })
	    }
	  };
	});
}());