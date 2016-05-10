create table person(
  person_id serial primary key,
  name varchar(10) not null,
  del_flg smallint not null default 0
);

create table item_setting(
  unique_id serial primary key,
  item_setting_id integer not null,
  person_id integer not null,
  name varchar(10) not null,
  in_out_type smallint not null,
  view_order integer,
  del_flg smallint not null default 0,
  unique(item_setting_id, person_id),
  foreign key(person_id) references person(person_id)
);
create unique index item_setting_person_item on item_setting(item_setting_id, person_id);
create index item_setting_view_order on item_setting(view_order);

create table bank(
  unique_id serial primary key,
  bank_id integer not null,
  person_id integer not null,
  bank_name varchar(10),
  del_flg smallint not null default 0,
  view_order integer,
  unique(bank_id, person_id),
  foreign key(person_id) references person(person_id)
);
create unique index bank_bank_person on bank(bank_id, person_id);
create index bank_view_order on bank(view_order);

create table payment(
  unique_id serial primary key,
  payment_id integer not null,
  person_id integer not null,
  bank_id integer not null,
  item_id integer not null,
  day timestamp not null default current_timestamp,
  del_flg smallint not null default 0,
  unique(payment_id, person_id),
  foreign key (person_id) references person(person_id),
  foreign key (bank_id, person_id) references bank(bank_id, person_id),
  foreign key (item_id, person_id) references item_setting(item_setting_id, person_id)
);
create unique index payment_payment_person on payment(payment_id, person_id);
create index payment_bank on payment(bank_id);
create index payment_item on payment(item_id);

alter table payment add price integer;
alter table person add user_id varchar(10);
alter table person add password varchar(20);


create table monthly(
  unique_id serial primary key,
  monthly_id integer not null,
  person_id integer not null,
  name varchar(20) not null,
  bank_id integer not null,
  item_id integer not null,
  price integer not null,
  day smallint not null default 1,
  del_flg smallint not null default 0,
  foreign key (person_id) references person(person_id),
  foreign key (item_id, person_id) references item_setting(item_setting_id, person_id),
  foreign key (bank_id, person_id) references bank(bank_id, person_id)
);
  create unique index monthly_id_person on monthly(monthly_id, person_id);
  create index monthly_item_id on monthly(monthly_id);



create view zandaka as select bank.bank_id, bank.view_order, bank.del_flg, bank.person_id, bank_name, coalesce(sum(price),0) zandaka from bank left join payment on (bank.person_id = payment.person_id and bank.bank_id = payment.bank_id) group by bank.unique_id;
alter table person alter column password type varchar(150);
