var config = {};

config.backend = {};
config.backend.ip = "localhost";
config.backend.port = 8081;
config.backend.home = 'http://' + config.backend.ip + ":" + config.backend.port;
config.backend.login = "/login";
config.backend.logout = "/logout";
config.backend.admin = "/api/admin";
config.backend.player = "/api/player";

config.frontend = {};
config.frontend.ip = "0.0.0.0";
config.frontend.port = 8080;
config.frontend.home = 'http://' + config.frontend.ip + ":" + config.frontend.port;

config.database = {};
config.database.path = "../static/private/database";
config.database.admin = config.database.path + "/admin";

config.log = {};
config.log.path = "../statis/private/log";

config.elastic = {};
config.elastic.path = "D:/Project/els/app/elasticsearch/6.4.0/bin/elasticsearch.bat";
config.elastic.config = "d:/Project/els/app/elasticsearch/6.4.0/config/elasticsearch.yml";
config.elastic.ip = "localhost";
config.elastic.port = 9200;
config.elastic.home = config.elastic.ip + ":" + config.elastic.port;

config.kibana = {};
config.kibana.path = "D:/Project/els/app/kibana/6.4.0/bin/kibana.bat";
config.kibana.config = "d:/Project/els/app/kibana/6.4.0/config/kibana.yml";
config.kibana.ip = "localhost";
config.kibana.port = 5601;
config.kibana.home = config.kibana.ip + ":" + config.kibana.port;

config.authen = {};
config.authen.privatekey = "../static/private/salt/private.key";
config.authen.publickey = "../static/private/salt/public.key";
config.authen.method = "RS256";

config.gm = {};
config.gm.ip = "49.213.72.182";
config.gm.port = 8111;
config.gm.key = "(@dm1nS#cr3tKey!)";
config.gm.method = "SHA256";

module.exports = config;