CREATE TABLE recipes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  est_time_to_make_in_min INT,
  description VARCHAR(100)
);

CREATE TABLE ingredients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  amount VARCHAR(100),
  recipe_id INT
);

CREATE TABLE steps (
  id INT PRIMARY KEY AUTO_INCREMENT,
  number INT NOT NULL,
  directions VARCHAR(100),
  recipe_id INT
);