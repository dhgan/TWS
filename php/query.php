<?php
/**
 * Created by PhpStorm.
 * User: GDH
 * Date: 2016/4/21
 * Time: 16:14
 */
header("Content-type: text/html; charset=utf-8");
session_start();
$html=array("success"=>false);
if(!isset($_SESSION['user'])||($_SESSION["admin"] xor $_POST["admin"]=="true")) {
    $html["login"]=false;
}
else if(isset($_SESSION['user'])){
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
    if($_POST["type"]=="apply_record"){
        if($_SESSION["admin"]){
            $sql="select apply_id,employee_id,a.tool_id,company_name,apply_date,apply_time,a.state
                  from apply_record a,tool t,company c
                  where a.tool_id=t.tool_id and t.company_id=c.company_id
                  order by apply_date,apply_time desc";
        }else{
            $sql="select apply_id,employee_id,a.tool_id,company_name,apply_date,apply_time,a.state
                  from apply_record a,tool t,company c
                  where a.tool_id=t.tool_id and t.company_id=c.company_id and employee_id= ".$_SESSION['user']."
                  order by apply_date,apply_time desc";
        }
    }
    else if($_POST["type"]=="lend_record"){
        if($_SESSION["admin"]){
            $sql="select register_id,employee_id,tool_id,company_name,lend_date,lend_time,return_date,return_time from lend_record l,company c
      where l.company_id=c.company_id order by return_date,return_time desc";
        }else{
            $sql="select register_id,employee_id,tool_id,company_name,lend_date,lend_time,return_date,return_time
              from lend_record l,company c
              where l.company_id=c.company_id and employee_id= ".$_SESSION['user']." order by return_date,return_time desc";
        }
    }else if($_POST["type"]=="apply"){
        if(isset($_SESSION['types'])&&$_SESSION['types']=='一般员工'){
            $sql="select tool_id,tool_name,prices,company_name,dept_name,state from tool t,dept d,company c
              where t.company_id=c.company_id and t.dept_id=d.dept_id and t.dept_id= ".$_SESSION["dept_id"]." order by tool_id";
        }else{
            $sql="select tool_id,tool_name,prices,company_name,dept_name,state from tool t,dept d,company c
              where t.company_id=c.company_id and t.dept_id=d.dept_id order by tool_id";
        }
    }else if($_POST["type"]=="myInfo"){
        if($_SESSION['admin']){
            $sql="select admin_id,admin_name,sex,company_name ".
                  "from admin a,company c ".
                  "where a.admin_id=".$_SESSION['user']." and a.company_id=c.company_id";
        }else{
            $sql="select employee_id,employee_name,sex,company_name,dept_name,types ".
                "from employee e,company c,dept d ".
                "where e.employee_id=".$_SESSION['user']." and e.company_id=c.company_id and e.dept_id=d.dept_id";
        }
    }else if($_POST["type"]=="employee"){
        $sql="select employee_id,employee_name,sex,company_name,dept_name,types
              from employee e,company c,dept d
              where e.company_id=c.company_id and e.dept_id=d.dept_id order by employee_name";
    }
    if($result=mysqli_query($conn,$sql)){
        if(mysqli_num_rows($result)){
            $html["success"]=true;
            while($row=mysqli_fetch_assoc($result)){
                array_push($html,$row);
            }
        }
    }
}
echo json_encode($html);
