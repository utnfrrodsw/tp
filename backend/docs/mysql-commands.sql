create database if not exists homeService;
create user if not exists dsw @'%' identified by 'dsw';
grant all on homeService.* to dsw @'%';