-- upload to db the questions
-- users need to answer when they register

USE social;

-- create fictional user
INSERT INTO `users` (`id`, `username`, `email`, `password`, `name`)
VALUES (0, "0", "0", "0", "0");

-- create posts
INSERT INTO `posts` (`id`, `desc`, `userid`) VALUES (0, "Do we live in a simulation?", 0);
INSERT INTO `posts` (`id`, `desc`, `userid`) VALUES (1, "Can a person imagine a new color?", 0);
INSERT INTO `posts` (`id`, `desc`, `userid`) VALUES (2, "Do you believe in strong ideas to generate safety?", 0);
