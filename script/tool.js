/**
 * Created by GDH on 2016/4/21.
 */
function update_info() {
    $.ajax({
        type: "POST",
        url:"./php/query.php?"+Math.random(),
        data: "type=apply&admin="+true,
        dataType: "json",
        success: function(data) {
            if(data.success){
                delete data.success;
                var tb=$("#content").find("table tbody");
                tb.empty();
                for(var i in data){
                    if(data.hasOwnProperty(i)){
                        var dom=$("<tr></tr>");
                        var html="",info="";
                        for(var j in data[i]){
                            if(data[i].hasOwnProperty(j)){
                                html+="<td>"+data[i][j]+"</td>";
                                info+="-"+data[i][j];
                            }
                        }
                        html+="<td class='operate'>借出工具</td>";
                        dom.attr("info",info).html(html);
                        tb.append(dom);
                    }
                }
            }else if(data&&data.login===false){
                window.location.href="login.html";
            }
        },
        error: function(msg){
            console.log(msg);
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
$("#add_tool").click(function () {
    $("#add_form").show();
    $("#shadow").show();
    $("#tool_id").focus();
});
function drag(ev) {
    var obj=ev.data;
    disX=ev.clientX-obj.offset().left;
    disY=ev.clientY-obj.offset().top;
    $(document).bind("mousemove",function (ev)
    {
        var l=ev.clientX-disX;
        var t=ev.clientY-disY;

        if(l<0)
        {
            l=0;
        }
        else if(l>$(document).outerWidth()-obj.outerWidth())
        {
            l=$(document).outerWidth()-obj.outerWidth();
        }

        if(t<0)
        {
            t=0;
        }
        else if(t>$(document).outerHeight()-obj.outerHeight())
        {
            t=$(document).outerHeight()-obj.outerHeight();
        }
        obj.css("left",l);
        obj.css("top",t);
    });

    $(document).mouseup(function ()
    {
        $(document).unbind("mousemove");
        $(document).unbind("mouseup");

    });

    return false;
}
var add_form=$("#add_form");
add_form.find("h2").bind("mousedown",add_form,drag);
add_form.find("h2 span").click(function(e){
    e.stopPropagation();
    $("#add_form").hide();
    $("#shadow").hide();
});
add_form.find("input:button").click(function () {
    var tool_id=$("#tool_id").val();
    var tool_name=$("#tool_name").val();
    var prices=$("#prices").val();
    var dept_id=$("#dept_id").find("option:selected").val();
    if(isNaN(prices)){
        alert("价格输入错误");
    }
    else if(tool_id&&tool_name&&prices&&dept_id){
        $.ajax({
            type: "POST",
            url: "./php/update.php?"+Math.random(),
            data: {"tool_id": tool_id,"tool_name": tool_name,
                "prices": prices,"dept_id": dept_id,"type": "add_tool"},
            dataType: "json",
            success: function(data){
                if(data.success){
                    update_info();
                    alert("添加成功");
                }else if(data.error){
                    alert(data.error)
                }
            },
            error: function (msg) {
                alert(msg.responseText);
            }
        })
    }else{
        alert("请填满信息");
    }
});
$("#prices").keyup(function () {
    var val=this.value;
   if(isNaN(val)){
       this.value=val.substring(0,val.length-1);
   }
});
var lend_tool=$("#lend_tool");
lend_tool.find("h2").bind("mousedown",lend_tool,drag);
lend_tool.find("h2 span").click(function(e){
    e.stopPropagation();
    $("#lend_tool").hide();
    $("#shadow").hide();
});
lend_tool.find("input:button").click(function (){
    var employee_id=$("#employee_id").val();
    if(employee_id){
        $.ajax({
            type: "POST",
            url: "./php/update.php?"+Math.random(),
            data: {"tool_id": lend_tool_id,"employee_id": employee_id,"type": "lend_tool"},
            dataType: "json",
            cache: false,
            success: function(data){
                console.log(data);
                if(data.success){
                    update_info();
                    alert("操作成功！");
                }else if(data&&data.error){
                    console.log(data.error);
                    alert(data.error);
                }
            },
            error: function(msg){
                alert(msg.responseText);
            }
        })
    }else{
        alert("请填写员工号!");
    }
});
$("#content").find("table tbody").click(function(e) {
    var $target = $(e.target || e.srcElement);
    if ($target.hasClass("operate")) {
        var tr=$target.parent();
        var tb=tr.children();
        if(tb.eq(5).text()=="在库"){
            lend_tool.show();
            $("#shadow").show();
            $("#employee_id").focus();
            lend_tool_id=tb.eq(0).text();
        }else{
            alert("错误，此工具以被借出！")
        }
    }
});
$("#logout").click(function(){
    $.ajax({
        type: "POST",
        url:"./php/login_logout.php?"+Math.random(),
        data: {"type": "logout"},
        dataType: "text",
        cache: false,
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