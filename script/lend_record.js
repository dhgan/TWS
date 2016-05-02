/**
 * Created by GDH on 2016/4/21.
 */
(function () {
    $.ajax({
        type: "POST",
        url:"./php/query.php?"+Math.random(),
        data: "type=lend_record&admin=false",
        dataType: "json",
        success: function(data) {
            if(data.success){
                delete data.success;
                var html1="",html2="";
                for(var i in data) {
                    if(data.hasOwnProperty(i)){
                        var html="";
                        for (var j in data[i]) {
                            if (data[i].hasOwnProperty(j)&&data[i][j]) {
                                html += "<td>" + data[i][j] + "</td>";
                            }
                        }
                        if(!data[i].return_date){
                            html1 += "<tr>"+html+"</tr>";
                        }else{
                            html2 += "<tr>"+html+"</tr>"
                        }
                    }
                }
                var tbs= $("#content").find("table tbody");
                tbs.eq(0).html(html1);
                tbs.eq(1).html(html2);
            }else if(data&&data.login===false){
                window.location.href="login.html";
            }
        }
    })
})();
$("#logout").click(function(){
    $.ajax({
        type: "POST",
        url:"./php/login_logout.php?"+Math.random(),
        data: {"type": "logout"},
        dataType: "text",
        success: function(data) {
            data=JSON.parse(data);
            if(data.success){
                window.location.href="login.html";
            }else if(data&&data.error){
                alert(data.error);
            }
        },
        error: function (msg) {
            alert(msg.responseText);
            console.log(msg);
        }
    })
});