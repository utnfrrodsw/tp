create database if not exists homeService;
create user if not exists root @'%' identified by 'root';
grant all on homeService.* to root @'%';