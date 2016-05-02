/**
 * Created by GDH on 2016/4/21.
 */
function update_info() {
    $.ajax({
        type: "POST",
        url:"./php/query.php?"+Math.random(),
        data:"type=employee&admin="+true,
        dataType: "json",
        success: function(data) {
            console.log(data);
            if(data.success){
                var tb=$("#content").find("table tbody");
                tb.empty();
                delete data.success;
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
                        dom.attr("info",info).html(html);
                        tb.append(dom);
                    }
                }
            }else if(data&&data.login===false){
                window.location.href="login.html";
            }
        },
        error: function (msg) {
            console.log(msg);
        }
    })
}
update_info();
$("#search_input").keyup(function(){
    var tr=$("#content").find("tbody tr");
    var txt=this.value.replace(/(^\s+)|(\s+$)/g,"").toLowerCase();
    for(var i=0;i<tr.length;i++) {
        if (tr.eq(i).attr("info").toLowerCase().search(txt) > -1) {
            tr.eq(i).show();
        }else{
            tr.eq(i).hide();
        }
    }
});
$("#add_employee").click(function () {
    $("#add_form").show();
    $("#shadow").show();
    $("#employee_id").focus();
});
var add_form=$("#add_form");
add_form.find("h2").mousedown(function (ev) {
    disX=ev.clientX-add_form.offset().left;
    disY=ev.clientY-add_form.offset().top;
    $(document).bind("mousemove",function (ev)
    {
        var l=ev.clientX-disX;
        var t=ev.clientY-disY;

        if(l<0)
        {
            l=0;
        }
        else if(l>$(document).outerWidth()-add_form.outerWidth())
        {
            l=$(document).outerWidth()-add_form.outerWidth();
        }

        if(t<0)
        {
            t=0;
        }
        else if(t>$(document).outerHeight()-add_form.outerHeight())
        {
            t=$(document).outerHeight()-add_form.outerHeight();
        }
        add_form.css("left",l);
        add_form.css("top",t);
    });

    $(document).mouseup(function ()
    {
        $(document).unbind("mousemove");
        $(document).unbind("mouseup");

    });

    return false;
});
add_form.find("h2 span").click(function(e){
    e.stopPropagation();
    $("#add_form").hide();
    $("#shadow").hide();
});
add_form.find("input:button").click(function () {
    var employee_id=$("#employee_id").val();
    var employee_name=$("#employee_name").val();
    var sex=$("input[name='sex']:checked").val();
    var types=$("input[name='types']:checked").val();
    var dept_id=$("#dept_id").find("option:selected").val();
    if(types=="专家"){
        dept_id="0";
    }
    var pwd=$("#pwd1");
    var pwd1=pwd.val();
    var pwd2=$("#pwd2").val();
    if(employee_id&&employee_name&&sex&&types&&dept_id&&pwd1&&pwd2){
        if(pwd1===pwd2){
            $.ajax({
                type: "POST",
                url: "./php/update.php?"+Math.random(),
                data: {"employee_id": employee_id,"employee_name": employee_name,"sex": sex,
                    "types": types,"dept_id": dept_id,"pwd": $.md5(pwd1),"type": "add_employee"},
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
            pwd.focus();
            alert("两次密码输入不同，请重新输入");
        }
    }else{
        alert("请填满信息");
    }
});
$("#specialist").click(function(){
    $('#dept_id').hide();
    $('#for_dept_id').hide();
});$("#employee").click(function(){
    $('#dept_id').show();
    $('#for_dept_id').show();
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