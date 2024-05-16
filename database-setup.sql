-- 데이터베이스 생성
CREATE DATABASE lightswitch;

-- 사용자 생성
CREATE ROLE lightswitch2024 WITH LOGIN PASSWORD 'switchlight2024!';

ALTER USER lightswitch2024 WITH SUPERUSER;

GRANT ALL PRIVILEGES ON database lightswitch to lightswitch2024;

-- -- public 스키마에 대한 권한 부여
-- GRANT USAGE ON SCHEMA public TO lightswitch2024;
-- GRANT CREATE ON SCHEMA public TO lightswitch2024;

-- -- public 스키마의 기존 테이블에 대한 권한 부여
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO lightswitch2024;

-- -- public 스키마의 기존 시퀀스에 대한 권한 부여
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO lightswitch2024;

-- -- 향후 생성될 테이블과 시퀀스에 대한 권한 부여
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO lightswitch2024;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO lightswitch2024;