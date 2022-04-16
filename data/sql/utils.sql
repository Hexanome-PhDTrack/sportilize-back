SHOW TABLES;

SELECT * FROM user_entity;
SELECT * FROM sport_entity;

SELECT COUNT(*) FROM sport_entity;

DROP TABLE IF EXISTS sport_entity;

-- erase all data but not the table
TRUNCATE TABLE sport_entity; 

-- delete sport_entity with id 2147483647
DELETE FROM sport_entity WHERE id = 2147483647;