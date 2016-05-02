create database tws;
	
use tws;

create table dept(
	dept_id varchar(15) primary key,
	dept_name varchar(40);
);
insert into dept values
("1","Construction Device Repair"),("2","Automobile Repair"),("3","Appliance Repair"),("4","Computer Repair"),("0","");

create table company(
  company_id VARCHAR (15) PRIMARY KEY ,
  company_name VARCHAR (15) not null,
  country VARCHAR (15) not NULL
);
insert into company values
("1","New York","New York"),("2","Los Angeles","Los Angeles"),("3","Chicago","Chicago"),("4","Houston","Houston"),
("5","Philadelphia","Philadelphia"),("6","Detroit","Detroit"),("7","San francisco","San francisco"),("8","Boston","Boston");

create table admin(
	admin_id varchar(15) primary key,
	admin_name varchar(20) not null,
	company_id VARCHAR (15) NOT  NULL,
	sex varchar(4) not null,
	pwd varchar(35) not null,
	FOREIGN KEY (company_id) REFERENCES company(company_id)
);

insert into admin values("156","gdh","3","男","e2fc714c4727ee9395f324cd2e7f331f");
insert into admin values("201","New York","1","女","e2fc714c4727ee9395f324cd2e7f331f");
insert into admin values("202","Los Angeles","2","男","e2fc714c4727ee9395f324cd2e7f331f");
insert into admin values("203","Chicago","3","女","e2fc714c4727ee9395f324cd2e7f331f");
insert into admin values("204","Houston","4","男","e2fc714c4727ee9395f324cd2e7f331f");
insert into admin values("205","Philadelphia","5","女","e2fc714c4727ee9395f324cd2e7f331f");
insert into admin values("206","Detroit","6","男","e2fc714c4727ee9395f324cd2e7f331f");
insert into admin values("207","San francisco","7","女","e2fc714c4727ee9395f324cd2e7f331f");
insert into admin values("208","Boston","8","男","e2fc714c4727ee9395f324cd2e7f331f");

create table employee(
	employee_id varchar(15) primary key,
	employee_name varchar(20) not null,
	sex varchar(4) not null,
	pwd varchar(40) not null,
	company_id VARCHAR (15) not null,
	dept_id varchar(15) DEFAULT null,
	types VARCHAR (15) not null,
	foreign key(dept_id) references dept(dept_id),
	foreign key(company_id) references company(company_id)
);
insert into employee values
("7353","gg","man","e2fc714c4727ee9395f324cd2e7f331f","1","1","一般员工"),
("5521","mm","woman","e2fc714c4727ee9395f324cd2e7f331f","3","0","专家");


create table tool(
  tool_id varchar(15) PRIMARY KEY,
  tool_name varchar(20) not null,
  prices double(10,2) not null,
  dept_id VARCHAR (15) not null,
  company_id VARCHAR (15) not null,
  state VARCHAR (15) not null,
  FOREIGN key(dept_id) REFERENCES dept(dept_id),
  FOREIGN KEY (company_id) REFERENCES company(company_id)
);
insert into tool values
("1","tool1","100","1","1","在库"),("2","tool2","300","3","3","在库"),
("3","tool3","210","2","2","在库"),("4","tool4","160","4","4","在库");
insert into tool values
("5","tool3","210","2","2","在库"),("10","tool4","160","4","4","在库"),
("6","tool3","210","2","2","在库"),("9","tool4","160","4","4","在库"),
("7","tool3","210","2","2","在库"),("8","tool4","160","4","4","在库");
insert into tool values
("11","tool5","500","1","1","在库"),("16","tool5","160","3","3","在库"),
("12","tool6","180","3","3","在库"),("15","tool7","100","3","3","在库"),
("13","tool7","280","1","1","在库"),("14","tool6","300","1","1","在库");
insert into tool values
("18","tool8","300","1","2","在库"),("17","tool8","190","1","3","在库");


create table lend_record(
  register_id VARCHAR(15) PRIMARY KEY ,
  employee_id VARCHAR (15) not null,
  tool_id VARCHAR(15) not null,
  company_id VARCHAR(15) not null,
  lend_date date not null,
  lend_time time not null,
  return_date date,
  return_time time,
  state VARCHAR (15) not null,
  FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
  FOREIGN KEY (tool_id) REFERENCES tool(tool_id),
  FOREIGN KEY (company_id) REFERENCES company(company_id)
);
insert into lend_record values
("1","7353","1","1",CURRENT_DATE,CURRENT_TIME ,null ,null ,"正常"),
("2","7353","1","1",CURRENT_DATE,CURRENT_TIME ,null ,null ,"正常");
insert into lend_record values
("3","5521","2","3",CURRENT_DATE-1,CURRENT_TIME,CURRENT_DATE,CURRENT_TIME ,"正常"),
("4","5521","7","2",CURRENT_DATE-1,CURRENT_TIME, CURRENT_DATE,CURRENT_TIME ,"正常");
insert into lend_record values
("5","5521","1","3",CURRENT_DATE-1,CURRENT_TIME,CURRENT_DATE,CURRENT_TIME ,"正常"),
("6","5521","8","2",CURRENT_DATE-1,CURRENT_TIME,null,null,"正常");
insert into lend_record values
("7","7353","1","3",CURRENT_DATE-1,CURRENT_TIME,CURRENT_DATE,CURRENT_TIME ,"正常"),
("8","7353","8","2",CURRENT_DATE-1,CURRENT_TIME,CURRENT_DATE,CURRENT_TIME,"正常");


create table apply_record(
  apply_id VARCHAR (15) PRIMARY KEY,
  employee_id VARCHAR (15) not null,
  tool_id VARCHAR(15) not null,
  apply_date date not null,
  apply_time time not null,
  state VARCHAR (15) not null,
  FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
  FOREIGN KEY (tool_id) REFERENCES tool(tool_id)
);
INSERT  INTO apply_record VALUEs("101","7353","2",CURRENT_DATE ,CURRENT_TIME ,"已同意");
INSERT  INTO apply_record VALUEs("102","7353","3",CURRENT_DATE ,CURRENT_TIME ,"已拒绝");
INSERT  INTO apply_record VALUEs("103","7353","3",CURRENT_DATE ,CURRENT_TIME ,"申请中");
INSERT  INTO apply_record VALUEs("104","7353","2",CURRENT_DATE ,CURRENT_TIME ,"已取工具");
INSERT  INTO apply_record VALUEs("105","5521","2",CURRENT_DATE ,CURRENT_TIME ,"已同意");
INSERT  INTO apply_record VALUEs("106","5521","3",CURRENT_DATE ,CURRENT_TIME ,"已取工具");
INSERT  INTO apply_record VALUEs("107","5521","3",CURRENT_DATE ,CURRENT_TIME ,"申请中");
INSERT  INTO apply_record VALUEs("108","5521","2",CURRENT_DATE ,CURRENT_TIME ,"已拒绝");
