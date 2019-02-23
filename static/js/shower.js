//shower performs the function of hiding and showing the loading 
//gif when requesting analysis from the backend. it also shows the legend when the analysis is done
var shower = {};
shower.show = function (){
    $(".loaderToggle").removeClass("hidden");
};
shower.hide = function(){
    $(".loaderToggle").addClass("hidden");
}

shower.legend = function(){
    $(".postanalysislegenditem").removeClass("hidden");
}