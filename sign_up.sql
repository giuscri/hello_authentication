drop table if exists main;
create table main(username text primary key, passwd_hash text not null, session_token text);
insert into main(username, passwd_hash) values ('usr', '76a2173be6393254e72ffa4d6df1030a');
