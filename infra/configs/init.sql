CREATE
USER textvault_user WITH PASSWORD 'textvaultpwd';

CREATE
DATABASE textvault WITH
    OWNER textvault_user
    ENCODING 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    template=template0;

GRANT ALL PRIVILEGES ON DATABASE
textvault TO textvault_user;