USE [master]
GO
CREATE LOGIN [ejercicioDai] WITH PASSWORD=N'x', DEFAULT_DATABASE=[ejercicioDai], CHECK_EXPIRATION=OFF,
CHECK_POLICY=OFF

USE [ejercicioDai]
GO
CREATE USER [ejercicioDai] FOR LOGIN [ejercicioDai]
ALTER ROLE [db_owner] ADD MEMBER [ejercicioDai]