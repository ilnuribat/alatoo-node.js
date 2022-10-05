drop table if exists "groupUsers";
drop table if exists users;
drop table if exists groups;

create table users (
	id serial primary key,
	name text,
	gpa float,
	age int,
	type text
);

create table groups(
	id serial primary key,
	name text
);

create table "groupUsers"(
  id serial primary key,
  "userId" int,
  "groupId" int,
  role text,
  constraint "fkey_userId" foreign key("userId") references users(id) on delete cascade,
  constraint "fkey_groupId" foreign key ("groupId") references groups(id) on delete cascade
);

insert into users(id, name, gpa, age) values 
	(1, 'Ilnur', NULL, 29),
	(2, 'Dim', NULL, 35),
	(3, 'Baitur', 3.8, 17),
	(4, 'Torokeldi', 3.5, 17),
	(5, 'Artur', 3.3, 24),
	(6, 'Kadyrmamat', 3.3, 18),
	(7, 'Beka', 3.2, 17),
	(8, 'Kadyrali', 1, 17),
	(9, 'Nastya', 1.1, 18);

insert into groups(id, name) values 
	(1, 'ska20b'), (2, 'ska20a');

insert into "groupUsers"("userId", "groupId", role) values
	(1, 2, 'adviser'),
	(2, 1, 'adviser'),
	(3, 1, 'student'),
	(4, 1, 'student'),
	(5, 1, 'student'),
	(6, 1, 'student'),
	(7, 2, 'student'),
	(8, 2, 'student'),
	(9, 2, 'student');
