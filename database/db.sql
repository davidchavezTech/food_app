CREATE DATABASE food_app;

USE food_app;

CREATE TABLE orders(
    id INT(4) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_ID varchar(4) NOT NULL,
    --user_ID INT(4),
    fecha varchar(19) NOT NULL,
    cliente varchar(500) NOT NULL,
    orden varchar(500) NOT NULL,
    driver varchar(50) NOT NULL,
    total INT(3) NOT NULL,
    estado varchar(10) NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_ID) REFERENCES usuarios(user_ID)
);
DESCRIBE orders;

mysql -u david -p
6mdU6ytND4bSJ4J.$

ALTER TABLE ordenes
--MODIFY fecha timestamp NOT NULL 
--ADD ↑

