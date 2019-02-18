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