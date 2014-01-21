/* database.sql  */

DROP TABLE IF EXISTS `app_callback`;

CREATE TABLE `app_callback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_code` varchar(100) DEFAULT NULL,
  `tmp_secret_key` varchar(50) DEFAULT NULL,
  `app_secret_key` varchar(50) DEFAULT NULL,
  `screen_name` varchar(100) DEFAULT NULL,
  `event_name` varchar(100) DEFAULT NULL,
  `timestamp` bigint DEFAULT NULL,
  `synchronized_flag` tinyint DEFAULT 0,
  `ins_dt` datetime NOT NULL,
  `ins_process_id` varchar(255) DEFAULT NULL,
  `upd_dt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `upd_process_id` varchar(255) DEFAULT NULL,
  `del_flag` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
