-- upload to db the questions
-- users need to answer when they register

USE social;

-- create fictional user
INSERT INTO `users` (`id`, `username`, `email`, `password`, `name`)
VALUES (0, "0", "0", "0", "0");

-- create posts
INSERT INTO `posts` (`id`, `desc`, `userid`) VALUES (0, "Are you a human?0", 0);
INSERT INTO `posts` (`id`, `desc`, `userid`) VALUES (1, "Are you a human?1", 0);
INSERT INTO `posts` (`id`, `desc`, `userid`) VALUES (2, "Are you a human?2", 0);
