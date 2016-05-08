INSERT INTO PERSON (NAME, USER_ID, PASSWORD) VALUES ('立松','test','test');

INSERT INTO ITEM_SETTING (ITEM_SETTING_ID, PERSON_ID, IN_OUT_TYPE, VIEW_ORDER, NAME) VALUES(1,1,0,1,'食費');
INSERT INTO ITEM_SETTING (ITEM_SETTING_ID, PERSON_ID, IN_OUT_TYPE, VIEW_ORDER, NAME) VALUES(2,1,0,2,'交通費');
INSERT INTO ITEM_SETTING (ITEM_SETTING_ID, PERSON_ID, IN_OUT_TYPE, VIEW_ORDER, NAME) VALUES(3,1,0,3,'生活費');
INSERT INTO ITEM_SETTING (ITEM_SETTING_ID, PERSON_ID, IN_OUT_TYPE, VIEW_ORDER, NAME) VALUES(4,1,0,4,'交際費');
INSERT INTO ITEM_SETTING (ITEM_SETTING_ID, PERSON_ID, IN_OUT_TYPE, VIEW_ORDER, NAME) VALUES(5,1,1,1,'給料');
INSERT INTO ITEM_SETTING (ITEM_SETTING_ID, PERSON_ID, IN_OUT_TYPE, VIEW_ORDER, NAME) VALUES(-99,1,0,1,'不明金');
INSERT INTO ITEM_SETTING (ITEM_SETTING_ID, PERSON_ID, IN_OUT_TYPE, VIEW_ORDER, NAME) VALUES(-98,1,1,1,'不明金');
INSERT INTO ITEM_SETTING (ITEM_SETTING_ID, PERSON_ID, IN_OUT_TYPE, VIEW_ORDER, NAME) VALUES(-97,1,0,1,'振替');
INSERT INTO ITEM_SETTING (ITEM_SETTING_ID, PERSON_ID, IN_OUT_TYPE, VIEW_ORDER, NAME) VALUES(-96,1,1,1,'振替');

INSERT INTO BANK (BANK_ID, PERSON_ID, BANK_NAME, VIEW_ORDER) VALUES(0,1,'お財布',1);
INSERT INTO BANK (BANK_ID, PERSON_ID, BANK_NAME, VIEW_ORDER) VALUES(1,1,'三井住友',2);
INSERT INTO BANK (BANK_ID, PERSON_ID, BANK_NAME, VIEW_ORDER) VALUES(2,1,'三菱東京UFJ',3);

INSERT INTO PAYMENT (PAYMENT_ID, PERSON_ID, BANK_ID, ITEM_ID, PRICE) VALUES (1,1,1,1,1200);
INSERT INTO PAYMENT (PAYMENT_ID, PERSON_ID, BANK_ID, ITEM_ID, PRICE) VALUES (2,1,2,2,300);
INSERT INTO PAYMENT (PAYMENT_ID, PERSON_ID, BANK_ID, ITEM_ID, PRICE) VALUES (3,1,2,3,300);

update person set user_id = test, password = test where person_id = 1;



//ダミーデータ
INSERT INTO PAYMENT (PAYMENT_ID, PERSON_ID, BANK_ID, ITEM_ID, PRICE, DAY) VALUES (20,1,1,1,-34000,'2016-03-01');
INSERT INTO PAYMENT (PAYMENT_ID, PERSON_ID, BANK_ID, ITEM_ID, PRICE, DAY) VALUES (21,1,1,2,-20000,'2016-03-01');
INSERT INTO PAYMENT (PAYMENT_ID, PERSON_ID, BANK_ID, ITEM_ID, PRICE, DAY) VALUES (22,1,1,3,-15000,'2016-03-01');
INSERT INTO PAYMENT (PAYMENT_ID, PERSON_ID, BANK_ID, ITEM_ID, PRICE, DAY) VALUES (23,1,1,4,-9000,'2016-03-01');
INSERT INTO PAYMENT (PAYMENT_ID, PERSON_ID, BANK_ID, ITEM_ID, PRICE, DAY) VALUES (24,1,1,5,200000,'2016-03-01');
INSERT INTO PAYMENT (PAYMENT_ID, PERSON_ID, BANK_ID, ITEM_ID, PRICE, DAY) VALUES (25,1,1,1,-27000,'2016-02-01');
INSERT INTO PAYMENT (PAYMENT_ID, PERSON_ID, BANK_ID, ITEM_ID, PRICE, DAY) VALUES (26,1,1,2,-1500,'2016-02-01');
INSERT INTO PAYMENT (PAYMENT_ID, PERSON_ID, BANK_ID, ITEM_ID, PRICE, DAY) VALUES (27,1,1,3,-35000,'2016-02-01');
INSERT INTO PAYMENT (PAYMENT_ID, PERSON_ID, BANK_ID, ITEM_ID, PRICE, DAY) VALUES (28,1,1,4,-4000,'2016-02-01');
INSERT INTO PAYMENT (PAYMENT_ID, PERSON_ID, BANK_ID, ITEM_ID, PRICE, DAY) VALUES (29,1,1,5,230000,'2016-02-01');
