CREATE TABLE `branches` (
	`id` varchar(36) NOT NULL,
	`name` varchar(30) NOT NULL,
	`full_address` varchar(100) NOT NULL,
	`latitude` decimal(10,8) NOT NULL,
	`longitude` decimal(11,8) NOT NULL,
	`phone` varchar(10) NOT NULL,
	CONSTRAINT `branches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employee_roles` (
	`id` varchar(36) NOT NULL,
	`name` varchar(30) NOT NULL,
	CONSTRAINT `employee_roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `employee_roles_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `employee_to_roles` (
	`employee_id` varchar(36) NOT NULL,
	`role_id` varchar(36) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `employees` (
	`employee_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`branch_id` varchar(36) NOT NULL,
	CONSTRAINT `employees_employee_id` PRIMARY KEY(`employee_id`)
);
--> statement-breakpoint
CREATE TABLE `user_roles` (
	`id` varchar(36) NOT NULL,
	`name` varchar(30) NOT NULL,
	CONSTRAINT `user_roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_roles_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `user_to_roles` (
	`user_id` varchar(36) NOT NULL,
	`role_id` varchar(36) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`name` varchar(30) NOT NULL,
	`surname` varchar(30) NOT NULL,
	`email` varchar(100) NOT NULL,
	`password` varchar(32) NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `employee_to_roles` ADD CONSTRAINT `employee_to_roles_employee_id_employees_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`employee_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee_to_roles` ADD CONSTRAINT `employee_to_roles_role_id_employee_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `employee_roles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employees` ADD CONSTRAINT `employees_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employees` ADD CONSTRAINT `employees_branch_id_branches_id_fk` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_to_roles` ADD CONSTRAINT `user_to_roles_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_to_roles` ADD CONSTRAINT `user_to_roles_role_id_user_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `user_roles`(`id`) ON DELETE no action ON UPDATE no action;