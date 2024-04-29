//じゃんけん用のSCRIPTを書いてください

function shuffleContent(container) {
	var content = container.find("> *");
    console.log(content);
	var total = content.size();
	content.each(function() {
		content.eq(Math.floor(Math.random()*total)).prependTo(container);
	});
}


$("#start,#correct_area").on("click",function(){
    const question = Math.ceil(Math.random()*3);  //0～1小数点
    $("#ans01,#ans02,#ans03").hide();
    $("#start").fadeOut(function(){
        $("#question_aera").fadeIn();
    
        if(question == 1){
            shuffleContent($("#ans01 .ans_li"));
            $("#ans01").fadeIn();
        }
        if(question == 2){
            shuffleContent($("#ans02 .ans_li"));
            $("#ans02").fadeIn();
        }
        if(question == 3){
            shuffleContent($("#ans03 .ans_li"));
            $("#ans03").fadeIn();
        }
        
    });
});

// カウント
let anscount = 0;

$(".ans_li li").on('click', function(e){
    $("#question_aera").fadeOut();
    anscount++;
    console.log(anscount);
    // $("#correct_area").addClass("sumi");
    // $(e.target).addClass("sentakushita");

    $("#question_aera").fadeOut(function(){

        if($(e.target).hasClass('seikai')){
            $("#correct_area").append('<div class="correct ttl">今日もいい日になりそう！</div>');
        } else {
            $("#correct_area").append('<div class="incorrect ttl">今日は無理せずゆっくりすごしてね</div>');
        }

        if(anscount == 2){
            $("#end_area").fadeIn();
        } else {
            $("#correct_area").append('<p class="close">あと一問</p>');
        }

        // ２カウントになったら
        $("#correct_area").on('click', function(){

            if(anscount == 2){
                confirm.log(anscount);
                $("#end_area").fadeIn();
            } else {
                $("#correct_area").hide();
                $("#question_aera").fadeIn();
            }
        });
    });
});
