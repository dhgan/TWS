var connect= function(){
	var id=$("#login_username").val();
	var pwd=$("#login_userpwd").val();
	if(!id||!pwd){
		alert("用户名和密码不能为空！");
		return ;
	}
	var loginData={"id": id, "pwd": $.md5(pwd),"type": "login"};
	loginData.admin=$("#login_admin").prop("checked")?true:false;
	$.ajax({
		type: "POST",
		url: "./php/login_logout.php?"+Math.random(),
		data: loginData,
		dataType: 'text',
		success: function(data){
            var json=JSON.parse(data);
			if(json&&json.success){
				if(loginData.admin){
					window.location.href="employee.html";
				}else{
					window.location.href="apply_record.html";
				}
			}else{
				alert("账号或密码错误！");
			}
		},
		error: function(msg){
			console.log(msg);
			alert("网络连接失败！");
		}
	});
};
$("#login_submit").click(connect);
$("#login_userpwd").keydown(function(e){
	e=e||window.event;
	if(e.keyCode===13) connect();
});