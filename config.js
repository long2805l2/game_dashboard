var config = {};

config.backend = {};
config.backend.ip = "localhost";
config.backend.port = 4210;
config.backend.home = 'http://' + config.backend.ip + ":" + config.backend.port;
config.backend.login = "/login";
config.backend.logout = "/logout";
config.backend.admin = "/api/admin";
config.backend.player = "/api/player";

config.frontend = {};
config.frontend.ip = "localhost";
config.frontend.port = 4200;
config.frontend.home = 'http://' + config.frontend.ip + ":" + config.frontend.port;

config.database = {};
config.database.path = "../static/private/database";
config.database.admin = config.database.path + "/admin";

config.log = {};
config.log.path = "../statis/private/log";

config.authen = {};
config.authen.privatekey = "../static/private/salt/private.key";
config.authen.publickey = "../static/private/salt/public.key";
config.authen.method = "RS256";

config.gm = {};
config.gm.ip = "49.213.72.182";
config.gm.port = 8010;
config.gm.key = "(@dm1nS#cr3tKey!)";
config.gm.method = "SHA256";

module.exports = config;