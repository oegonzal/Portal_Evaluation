(function() {
    "use strict";
    
    var module = angular.module("p1");

    module.animation('.slide', [slide]);

    function slide() {
    	return {
		    beforeAddClass: function(element, doneFn) {
		    	//element.css('display', 'none');
		    	/*
		      	console.log("Inside add of animation slider.");
		      	jQuery(element).animate({
                    //opacity: 0.25,
                    //left:    "+450",
                    height:  "toggle",
                }, 500);
                */
                /*
                $(element).show("slide", {
		             direction: "right"
		         }, 2000);
		         */
		    },

		    beforeRemoveClass: function(element, doneFn) {
		    	/*
		    	element.css('display', 'none');
		    	console.log("Inside remove of animation slider.");
		      	jQuery(element).animate({
                    //opacity: 0.25,
                    //left:    "+450",
                    height:  "toggle",
                }, 500);
                */
                /*
                $(element).hide("slide", {
		             direction: "left"
		         }, 2000);
		         */
		    }
    	}
    }

}());