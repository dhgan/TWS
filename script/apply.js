/**
 * Created by GDH on 2016/4/21.
 */
function update_info() {
    $.ajax({
        type: "POST",
        url:"./php/query.php?"+Math.random(),
        data: "type=apply&admin=false",
        dataType: "json",
        success: function(data) {
            if(data.success){
                delete data.success;
                var tb=$("#content").find("table tbody");
                tb.empty();
                for(var i in data){
                    if(data.hasOwnProperty(i)){
                        var dom=$("<tr></tr>");
                        var html="",info=[];
                        for(var j in data[i]){
                            if(data[i].hasOwnProperty(j)){
                                html+="<td>"+data[i][j]+"</td>";
                                info.push(data[i][j]);
                            }
                        }
                        html+="<td class='operate'>申请工具</td>";
                        dom.attr("info",info).html(html);
                        tb.append(dom);
                    }
                }
            }else if(data&&data.login===false){
                window.location.href="login.html";
            }
        }
    })
}
update_info();
$("#search_input").keyup(function(){
    var tr=$("#content").find("tbody tr");
    var txt=$("#search_input").val().replace(/(^\s+)|(\s+$)/g,"").toLowerCase();
    for(var i=0;i<tr.length;i++) {
        if (tr.eq(i).attr("info").toLowerCase().search(txt) > -1) {
            tr.eq(i).show();
        }else{
            tr.eq(i).hide();
        }
    }
});
$("#content").find("table tbody").click(function(e){
    var $target=$(e.target||e.srcElement);
    if($target.hasClass("operate")){
        var $tr=$target.parent();
        var $td=$tr.children();
        if($td.eq(5).text()=="在库"){
            $.ajax({
                type: "POST",
                url:"./php/update.php?"+Math.random(),
                data: {"tool_id": $td.eq(0).text(),"type": "add_apply"},
                dataType: "json",
                success: function(data) {
                    if(data.success){
                        update_info();
                        alert("申请成功");
                    }else if(data&&data.error){
                        alert(data.error);
                    }
                },
                error: function(msg){
                    alert(msg.responseText);
                    console.log(msg);
                }
            })
        }else{
            alert("申请失败，非在库工具不能申请！");
        }
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