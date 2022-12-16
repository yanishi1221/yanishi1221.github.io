function toPage(pageId) {
    //document.querySelector(`#${pageId}`).scrollIntoView();
    const buttonSection = document.querySelectorAll('.BT');
    const SectionNum = document.querySelectorAll('section');
    buttonSection.forEach(BT => {
        console.log("BT.getAttribute('destination')",BT.getAttribute('destination'),'pageId',pageId)
        SectionNum.forEach(section=>{
            if(section.id === pageId){
                section.classList.remove("hidden");
            }else{
                section.classList.add("hidden");
            }
                   
                })
  
        // if (BT.getAttribute('destination') === pageId ) {
        //     SectionNum.forEach(section=>{
        //         section.classList.remove("hidden");
        //     })

        // }else {
        //     SectionNum.forEach(section=>{
        //         section.classList.add("hidden");
        //     })
           

        // }
    })
}

gameResultsPopup();
childSelection();
var childNum = 0;


function gameResultsPopup() {
    $("#unversity").hide()
    $('#popupContent2').hide()
    var gameResultsTimes = 0;
    var popupClickedTimes = 0
    $("#tableNext1").on("click", function (e) {
        gameResultsTimes += 1;
        if (gameResultsTimes == 1) {
            $("#tableBack1").removeAttr('onclick');
            $("#unversity").show(500)
            $("#popup").css("display", "none")
        } else if (gameResultsTimes == 2) {
            $("#popup").css("display", "block")
            $("#popup").animate({ top: '300px' })
            $("#tableNext1").css('opacity','0.3')
            $("#tableBack1").css('opacity','0.3')

        }
        //    else if(tableclickedTimes == 2){
        //$("#popupContent").html(popupText)

        //    }
    })
    $("#tableBack1").on("click", function (e) {
        gameResultsTimes -= 1;
        if (gameResultsTimes == 0) {
            $("#unversity").hide();
        } else if (gameResultsTimes == 2) {
            $("#popup").animate({ top: '1000px;' })
        }
    })
    $(".popupBtn").on("click", function (e) {
        $('#popupContent1').hide()
        $('#popupContent2').show()
        $('#popupNo').hide();
        $('#popupYes').html('Countinue');
        $("#popupYes").attr('onclick', "toPage('S4')");

    })


}

function childSelection() {
    d3.csv("story.csv", function (data) {
        console.log('story')
        d3.select('#ChildBox')
            .selectAll('.child')
            .on('mouseover', function () {
                childNum = d3.select(this).attr('value')
                d3.selectAll('.bgCity')
                    .html(data[childNum].City)
                d3.selectAll('.bgSchools')
                    .html(data[childNum].Top140)
                d3.selectAll('#childDescriptionThird')
                    .html(data[childNum].Story)
                d3.selectAll('.gamePicture')
                    .html('<img src="./images/Map' + data[childNum].Picture + '" alt="' + data[childNum].City + ' City View"></img>')
                $('#columnGroup').children().removeClass()
                d3.select('#ColChild' + childNum)
                    .attr('class', 'selectColumn')
    
            })
        console.log(childNum)

        var BioclickedTimes = 0;



        $("#bioNext2").on("click", function (e) {
            BioclickedTimes += 1;
            console.log('Next', BioclickedTimes)
            if (BioclickedTimes == 1) {
                $("#bioBack").removeAttr('onclick');
                $("#bioNext2").attr('id', "bioNext3");
                $("#childDescriptionFirst").css("display", "none");
                $("#childDescriptionSecond").css("display", "block");
                $(".bgInforGDP").html(data[childNum].GDP)
                $(".bgInforIncome").html(data[childNum].Household)
                $('.gamePicture').html('<img src="./images/' + data[childNum].Picture + '" alt="' + data[childNum].City + 'City View"></img>')
            } else if (BioclickedTimes == 2) {

                $("#bioNext3").attr('onclick', "toPage('S3')");
            }
        });
        $("#bioBack").on("click", function (e) {
            BioclickedTimes -= 1;
            console.log('Back', BioclickedTimes)
            if (BioclickedTimes == 0) {
                $("#bioBack").attr('onclick', "toPage('p-1')");
                $("#bioNext3").attr('id', "bioNext2");
                $("#childDescriptionFirst").css("display", "block");
                $("#childDescriptionSecond").css("display", "none");
                $("#bgInforGDP").empty();
                $("#bgInforIncome").empty();
                $('.gamePicture').html('<img src="./images/Map' + data[childNum].Picture + '" alt="Map' + data[childNum].City + '"></img>')
            } else if (BioclickedTimes == 1) {

                $("#bioNext3").removeAttr('onclick');
            }
        })
    })

}

