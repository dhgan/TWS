/**
 * Created by GDH on 2016/4/21.
 */
function update_info() {
    $.ajax({
        type: "POST",
        url:"./php/query.php?"+new Date().getTime(),
        data: "type=lend_record&admin="+true,
        dataType: "json",
        success: function(data) {
            if(data.success){
                delete data.success;
                var html1="",html2="";
                for(var i in data) {
                    if(data.hasOwnProperty(i)){
                        var html="",info=[];
                        for (var j in data[i]) {
                            if (data[i].hasOwnProperty(j)&&data[i][j]) {
                                html += "<td>" + data[i][j] + "</td>";
                                info.push(data[i][j]);
                            }
                        }
                        if(!data[i].return_date){
                            html1 += "<tr>"+html+"<td class='operate'>归还工具</td></tr>";
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
            url:"./php/update.php?"+new Date().getTime(),
            data: {"register_id": $td.eq(0).text(),"tool_id": $td.eq(2).text(),"type": "lend_back"},
            dataType: "json",
            success: function(data) {
                if(data.success){
                    update_info();
                    alert("归还成功");
                }else if(data&&data.error){
                    alert(data.error);
                }
            },
            error: function(msg){
                alert(msg.responseText);
                console.log(msg);
            }
        })
    }
});
$("#logout").click(function(){
    $.ajax({
        type: "POST",
        url:"./php/login_logout.php?"+new Date().getTime(),
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