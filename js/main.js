$(function () {
    var cv = window.cv;
    
    $("#cv_name").text(cv.profile.name);
    $("#cv_surname").text(cv.profile.surname);
    $("#cv_title").text(cv.profile.title);
    $("#me_avatar").css("background-image", 'url("' + cv.profile.avatar + '")');
    placeSocialLinks(cv.social);
    placeSkills(cv.skills);
    
    function placeSocialLinks(social) {
        $("a.social_icon").attr("target", "_blank");
        
        $.each(social, function (key, value) {
            $("a.social_icon." + key).attr('href', value);
        });
    }
    
    function placeSkills(skills) {
        var container = $(".skills");
        
        // Randomize skills
        while (skills.length > 0) {
            var rand = Math.floor(Math.random() * skills.length);
            var spliced = skills.splice(rand, 1)[0];
            
            appendSkill(container, spliced);
        }
    }
    
    function appendSkill(container, skill) {
        $('<span></span>')
            .addClass('skill')
            .addClass('skill-' + skill.score)
            .text(skill.title)
            .attr('title', skill.description ? skill.description : skill.title)
            .appendTo(container);
    }
    
    $('a[href*=#]').each(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname && this.hash.replace(/#/,'') ) {
            var $targetId = $(this.hash), 
                $targetAnchor = $('[name=' + this.hash.slice(1) +']');
            
            var $target = $targetId.length ? $targetId : $targetAnchor.length ? $targetAnchor : false;
            
            if ($target) {
                var targetOffset = $target.offset().top;

                $(this).click(function() {
                    $("#nav li a").removeClass("active");
                    $(this).addClass('active');
                    $('html, body').animate({scrollTop: targetOffset}, 1000);
                    return false;
                });
            }
        }
    });
    
    setTimeout(function () {
        $("body").removeClass("noscroll");
        $("#loading_layer").fadeOut(2000, function () {
            $("#loading_layer").remove();
        });
    }, 500);
    
});