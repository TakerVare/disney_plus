USE movie_db;

INSERT INTO users (name, email, password_hash) VALUES
('Alice', 'alice@example.com', 'hash1'),
('Bob', 'bob@example.com', 'hash2'),
('Charlie', 'charlie@example.com', 'hash3');

INSERT INTO saga (name, description) VALUES
('Star Wars', 'Epic space saga'),
('Marvel Universe', 'Superhero movies universe');

INSERT INTO movies (name, description, url, length, director, year, saga_id) VALUES
('Star Wars: A New Hope', 'Classic space adventure', 'http://example.com/sw4', 121, 'George Lucas', 1977, 1),
('Iron Man', 'Origin of Iron Man', 'http://example.com/ironman', 126, 'Jon Favreau', 2008, 2),
('Inception', 'Mind bending thriller', 'http://example.com/inception', 148, 'Christopher Nolan', 2010, NULL);

INSERT INTO favorites (user_id, movie_id) VALUES
(1, 1),
(1, 2),
(2, 2),
(3, 3);

INSERT INTO categories (name, description) VALUES
('Action', 'Action-packed movies'),
('Sci-Fi', 'Science fiction movies'),
('Thriller', 'Suspenseful movies');

INSERT INTO movies_categories (movie_id, category_id) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 2),
(3, 2),
(3, 3);

INSERT INTO casting (name, bio, birthdate) VALUES
('Harrison Ford', 'Famous actor known for Star Wars and Indiana Jones', '1942-07-13'),
('Robert Downey Jr.', 'Famous for Iron Man role', '1965-04-04'),
('Leonardo DiCaprio', 'Acclaimed actor known for Inception', '1974-11-11');

INSERT INTO movies_cast (movie_id, cast_id, role) VALUES
(1, 1, 'Han Solo'),
(2, 2, 'Tony Stark'),
(3, 3, 'Dom Cobb');
