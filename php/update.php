<?php
/**
 * Created by PhpStorm.
 * User: GDH
 * Date: 2016/4/21
 * Time: 16:14
 */
header("Content-type: text/html; charset=utf-8");
try{
    session_start();
    /*$_POST['type']='pick_tool';
    $_POST['apply_id']='14614823825521';*/
    $html=array("success"=>false);
    if(isset($_SESSION['user'])&&isset($_POST['type'])){
        $host="localhost";
        $db_user="root";
        $db_pass="1234";
        $db_name="tws";
        $conn=mysqli_connect($host,$db_user,$db_pass);
        mysqli_select_db($conn,$db_name);
        if($conn==false){
            echo "fail to connect to Mysql.";
            exit();
        }
        if($_POST['type']=="add_employee"){
            $sql="select *from employee where employee_id=".$_POST["employee_id"];
            $result=mysqli_query($conn,$sql);
            if(mysqli_num_rows($result)){
                $html["error"]="员工号已存在，请重新输入！";
            }else{
                $sql="select company_id from admin where admin_id= '".$_SESSION["user"]."'";
                $result=mysqli_query($conn,$sql);
                $row=mysqli_fetch_assoc($result);
                $sql="insert into employee (employee_id,employee_name,sex,company_id,types,dept_id,pwd)
            values( '" .$_POST["employee_id"]. "', '" .$_POST["employee_name"]. "','" .$_POST["sex"].
                    "','" .$row['company_id']. "', '" .$_POST["types"]. "','" .$_POST["dept_id"]. "','" .$_POST["pwd"]. "')";
                $result=mysqli_query($conn,$sql);
                if($result) {
                    $html["success"] = true;
                }
            }
        }
        else if($_POST['type']=="add_tool"){
            $sql="select *from tool where tool_id=".$_POST["tool_id"];
            $result=mysqli_query($conn,$sql);
            if(mysqli_num_rows($result)){
                $html["error"]="工具号已存在，请重新输入！";
            }else{
                $sql="select company_id from admin where admin_id= '".$_SESSION["user"]."'";
                $result=mysqli_query($conn,$sql);
                $row=mysqli_fetch_assoc($result);
                $sql="insert into tool (tool_id,tool_name,company_id,prices,dept_id,state)
            values( '" .$_POST["tool_id"]. "', '" .$_POST["tool_name"]. "','" .$row["company_id"].
                    "', '" .$_POST["prices"]. "','" .$_POST["dept_id"]. "','在库')";
                $result=mysqli_query($conn,$sql);
                if($result) {
                    $html["success"] = true;
                }
            }
        }
        else if($_POST['type']=='add_apply'){
            $sql="select state from tool where tool_id=".$_POST["tool_id"];
            $result=mysqli_query($conn,$sql);
            if(mysqli_num_rows($result)){
                $row=mysqli_fetch_assoc($result);
                if($row["state"]=="在库"){
                    $sql="select *from apply_record where (state='申请中' or state='已同意') and tool_id='".$_POST["tool_id"]."' and employee_id='".$_SESSION['user']."'";
                    $result=mysqli_query($conn,$sql);
                    if(mysqli_num_rows($result)){
                        $html['error']="你已申请此工具，请勿重新申请！";
                    }
                    else{
                        $s=time().$_SESSION['user'];
                        $sql="insert into apply_record (apply_id,employee_id,tool_id,apply_date,apply_time,state)
                          VALUES ('".$s."','".$_SESSION["user"]."','".$_POST["tool_id"]."',current_date,current_time,'申请中')";
                        $result=mysqli_query($conn,$sql);
                        $html["success"]=true;
                    }
                }else{
                    $html['error']="工具不在库，申请失败！";
                }
            }
        }
        else if($_POST['type']=='cancel_apply'){
            $sql="select state from apply_record where apply_id='".$_POST["apply_id"]."'";
            $result=mysqli_query($conn,$sql);
            if(mysqli_num_rows($result)){
                $row=mysqli_fetch_assoc($result);
                if($row["state"]!="已提取"){
                    $sql="update apply_record set state='已取消' where apply_id='".$_POST["apply_id"]."'";
                    $result=mysqli_query($conn,$sql);
                    $html["success"]=true;
                }else{
                    $html['error']="工具已提取，取消申请失败！";
                }
            }
        }
        else if($_POST['type']=='reject_apply'||$_POST['type']=='agree_apply'||$_POST['type']=='pick_tool'){
            $sql="select employee_id,tool_id from apply_record where apply_id='".$_POST["apply_id"]."'";
            $result=mysqli_query($conn,$sql);
            $row=mysqli_fetch_assoc($result);
            $tool_id=$row['tool_id'];
            $employee_id=$row['employee_id'];
            $sql="select company_id from tool where tool_id='".$tool_id."'";
            $result=mysqli_query($conn,$sql);
            $row=mysqli_fetch_assoc($result);
            $sql="select company_id from admin where admin_id='".$_SESSION['user']."'";
            $result=mysqli_query($conn,$sql);
            $row1=mysqli_fetch_assoc($result);
            if($row['company_id']==$row1['company_id']){
                if($_POST['type']=='reject_apply') {
                    $sql = "select state from apply_record where apply_id='" . $_POST["apply_id"] . "'";
                    $result = mysqli_query($conn, $sql);
                    if (mysqli_num_rows($result)) {
                        $row = mysqli_fetch_assoc($result);
                        if ($row["state"] != "已提取") {
                            $sql = "update apply_record set state='已拒绝' where apply_id='" . $_POST["apply_id"] . "'";
                            $result = mysqli_query($conn, $sql);
                            $html["success"]=true;
                        } else {
                            $html['error'] = "工具已提取，拒绝申请失败！";
                        }
                    }
                }
                else if($_POST['type']=='agree_apply'){
                    $sql="select *from apply_record where state='已同意' and tool_id='".$tool_id."'";
                    $result=mysqli_query($conn,$sql);
                    if(!mysqli_num_rows($result)){
                        $sql="update apply_record set state='已同意' where apply_id='".$_POST["apply_id"]."'";
                        $result=mysqli_query($conn,$sql);
                        $html["success"]=true;
                    }else{
                        $html['error']="他人已请求此工具成功，同意申请失败！";
                    }
                }
                else{
                    $sql="select *from tool where state='在库' and tool_id='".$tool_id."'";
                    $result=mysqli_query($conn,$sql);
                    if(mysqli_num_rows($result)){
                        $sql="update apply_record set state='已提取' where apply_id='".$_POST["apply_id"]."'";
                        $result=mysqli_query($conn,$sql);
                        $sql="insert into lend_record
                          (register_id,employee_id,company_id,tool_id,lend_date,lend_time,state)
                          VALUES ('".time().$employee_id."','".$employee_id."','".$row1['company_id']."','".$tool_id."',CURRENT_DATE ,CURRENT_TIME ,'正常')";
                        $result=mysqli_query($conn,$sql);
                        $sql="update tool set state='已借出' where tool_id='".$tool_id."'";
                        $result=mysqli_query($conn,$sql);
                        $html["success"]=true;
                    }else{
                        $html['error']="操作失败，工具已被借出！";
                    }
                }
            }else{
                $html['error']="操作失败，工具与你不在同一公司！";
            }
        }
        else if($_POST['type']=='lend_back'){
            $sql="update lend_record set return_date=CURRENT_DATE, return_time=CURRENT_TIME
                  where register_id=" .$_POST['register_id'];
            if(mysqli_query($conn,$sql)){
                $sql="select company_id from admin where admin_id='".$_SESSION['user']."'";
                $result=mysqli_query($conn,$sql);
                $row=mysqli_fetch_assoc($result);
                $sql="update tool set state='在库',company_id=".$row['company_id']." where tool_id=".$_POST['tool_id'];
                if(mysqli_query($conn,$sql)){
                    $html["success"]=true;
                }
            }
        }
        else if($_POST['type']=="lend_tool"){
            $sql="select *from employee where employee_id='".$_POST['employee_id']."'";
            $result=mysqli_query($conn,$sql);
            if($row=mysqli_fetch_assoc($result)){
                $dept_id=$row['dept_id'];
                $sql="select company_id from admin where admin_id= '".$_SESSION['user']."'";
                $result=mysqli_query($conn,$sql);
                $row=mysqli_fetch_assoc($result);
                $company_id=$row['company_id'];
                $sql="select state,company_id,dept_id from tool where tool_id= '".$_POST['tool_id']."'";
                $result=mysqli_query($conn,$sql);
                $row=mysqli_fetch_assoc($result);
                if($row['company_id']==$company_id){
                    if($row['state']=='在库'){
                        if($dept_id=="0"||$dept_id==$row['dept_id']) {
                            $sql="update tool set state='已借出' where tool_id='".$_POST['tool_id']."'";
                            $result=mysqli_query($conn,$sql);
                            $sql="insert into lend_record
                            (register_id,employee_id,company_id,tool_id,lend_date,lend_time,state)
                            VALUES ('".time().$_POST['employee_id']."','".$_POST['employee_id']."','".$company_id."','".$_POST['tool_id']."',CURRENT_DATE ,CURRENT_TIME ,'正常')";
                            $result=mysqli_query($conn,$sql);
                            $html['success']=true;
                        }
                        else{
                            $html['error']='错误，一般员工不能跨部门借工具！';
                        }
                    }
                    else{
                        $html['error']="工具已被借出或已被其它人申请成功！";
                    }
                }
                else{
                    $html['error']="错误：不能借出非本公司工具！";
                }
            }else{
                $html['error']="员工号输入错误";
            }
        }
        else if($_POST['type']=='update_pwd'){
            if($_SESSION['admin']){
                $sql="select pwd from admin where admin_id='".$_SESSION['user']."'";
                $result=mysqli_query($conn,$sql);
                $row=mysqli_fetch_assoc($result);
                if($row['pwd']==$_POST['old_pwd']){
                    $sql="update admin set pwd= '".$_POST['new_pwd']."' where admin_id='".$_SESSION['user']."'";
                    if(mysqli_query($conn,$sql)){
                        $html['success']=true;
                    }
                }else{
                    $html['error']="原密码输入错误，请重试！";
                }
            }else{
                $sql="select pwd from employee where employee_id='".$_SESSION['user']."'";
                $result=mysqli_query($conn,$sql);
                $row=mysqli_fetch_assoc($result);
                if($row['pwd']==$_POST['old_pwd']){
                    $sql="update employee set pwd= '".$_POST['new_pwd']."' where employee_id='".$_SESSION['user']."'";
                    if(mysqli_query($conn,$sql)){
                        $html['success']=true;
                    }
                }else{
                    $html['error']="原密码输入错误，请重试！";
                }
            }

        }
    }
}catch(ErrorException $e){
    $html['error']=$e;
}

echo json_encode($html);