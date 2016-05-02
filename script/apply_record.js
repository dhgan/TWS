/**
 * Created by GDH on 2016/4/21.
 */
function update_info() {
    $.ajax({
        type: "POST",
        url:"./php/query.php?"+Math.random(),
        data: "type=apply_record&admin=false",
        dataType: "json",
        success: function(data) {
            if(data.success){
                delete data.success;
                var html1="",html2="";
                for(var i in data) {
                    if(data.hasOwnProperty(i)){
                        var html="";
                        for (var j in data[i]) {
                            if (data[i].hasOwnProperty(j)) {
                                html += "<td>" + data[i][j] + "</td>";
                            }
                        }
                        if(data[i].state=="申请中"||data[i].state=="已同意"){
                            html1 += "<tr>"+html+"<td class='operate'>取消申请</td></tr>";
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
}
update_info();
$("#content").find("table tbody").click(function(e){
    var $target=$(e.target||e.srcElement);
    if($target.hasClass("operate")){
        var $tr=$target.parent();
        var $td=$tr.children();
        $.ajax({
            type: "POST",
            url: "./php/update.php?" + Math.random(),
            data: {"apply_id": $td.eq(0).text(), "type": "cancel_apply"},
            dataType: "json",
            success: function (data) {
                console.log(data);
                if (data.success) {
                    update_info();
                    alert("取消申请成功");
                } else if (data && data.error) {
                    alert(data.error);
                }
            },
            error: function (msg) {
                console.log(msg);
            }
        })
    }
});
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