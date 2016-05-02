/**
 * Created by GDH on 2016/4/21.
 */
(function () {
    $.ajax({
        type: "POST",
        url:"./php/query.php?"+Math.random(),
        data: "type=myInfo&admin=false",
        dataType: "json",
        success: function(data) {
            if(data.success){
                delete data.success;
                var info=$("#content").find("table tbody tr span");
                for(var i in data[0]){
                    if(data[0].hasOwnProperty(i)){
                        info.filter("."+i).text(data[0][i]);
                    }
                }
            }else if(data&&data.login===false){
                window.location.href="login.html";
            }
        }
    })
})();
$("#sure_btn").click(function(){
   var old_pwd=$("#old_pwd").val();
    if(old_pwd){
        var new_pwd=$("#new_pwd").val();
        var new_pwd1=$("#new_pwd1").val();
        if(new_pwd&&new_pwd1){
            if(new_pwd===new_pwd1){
                $.ajax({
                    type: "POST",
                    url:"./php/update.php?"+Math.random(),
                    data: {'new_pwd':$.md5(new_pwd),'old_pwd':$.md5(old_pwd),"type": "update_pwd"},
                    dataType: "json",
                    success: function(data) {
                        if(data.success){
                            alert("更新密码成功");
                        }else if(data&&data.error){
                            alert(data.error);
                        }
                    },
                    error: function (msg) {
                        alert(msg.responseText);
                        console.log(msg);
                    }
                })
            }else {
                alert("错误: 两次输入的新密码不同！");
            }
        }else{
            alert("请填写完新密码！");
        }
    }else{
        alert("请填写原密码")
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