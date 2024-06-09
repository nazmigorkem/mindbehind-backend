CREATE TABLE `branches` (
	`id` varchar(36) NOT NULL,
	`name` varchar(30),
	`full_address` varchar(100),
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`phone` varchar(10),
	CONSTRAINT `branches_id` PRIMARY KEY(`id`)
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
CREATE TABLE `roles` (
	`id` varchar(36) NOT NULL,
	`name` varchar(30),
	CONSTRAINT `roles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`name` varchar(30),
	`surname` varchar(30),
	`email` varchar(100),
	`password` varchar(32),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `employee_to_roles` ADD CONSTRAINT `employee_to_roles_employee_id_employees_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`employee_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee_to_roles` ADD CONSTRAINT `employee_to_roles_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employees` ADD CONSTRAINT `employees_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employees` ADD CONSTRAINT `employees_branch_id_branches_id_fk` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE no action ON UPDATE no action;