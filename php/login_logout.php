<?php
header("Content-type: text/html charset=utf-8");
session_start();
if($_POST['type']=="login"){
	$host="localhost";
	$db_user="root";
	$db_pass="1234";
	$db_name="tws";
	$db_id=$_POST['id'];
	$db_pwd=$_POST['pwd'];
	$db_admin=$_POST['admin'];
	$conn=mysqli_connect($host,$db_user,$db_pass);
	mysqli_select_db($conn,$db_name);
	if($conn==false){
		echo "fail to connect to Mysql.";
		exit();
	}
	if($db_admin=='true'){
		$sql="select pwd from admin where admin_id='".$db_id."'";
	}else{
		$sql="select pwd,dept_id,types from employee where employee_id='".$db_id."'";
	}
	$result=mysqli_query($conn,$sql);
	if(mysqli_num_rows($result)){
		while($row=mysqli_fetch_assoc($result)){
			if($row['pwd']==$db_pwd){
				$_SESSION['user']=$db_id;
				$_SESSION['admin']=$db_admin=='true';
				if($db_admin=='false'){
					$_SESSION['dept_id']=$row['dept_id'];
					$_SESSION['types']=$row['types'];
				}else{
					$_SESSION['dept_id']="";
					$_SESSION['types']="admin";
				}
				echo '{"success": true}';
			}else{
				echo '{"success": false}';
			}
		}
	}else{
		echo '{"success": false}';
	}	
}else if($_POST["type"]=='logout'){
	unset($_SESSION['user']);
	unset($_SESSION['dept_id']);
	unset($_SESSION['types']);
	echo '{"success": true}';
}
?>