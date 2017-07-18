// Generated by LiveScript 1.5.0
(function(){
  var fs, p, Message, bitcore, superagent, wallet, generateKeys, guid, request, simple, status, methods, start, stop, info, getContainerList, create, update, method, getContainer, out$ = typeof exports != 'undefined' && exports || this, toString$ = {}.toString;
  fs = require('fs');
  p = require('prelude-ls');
  Message = require('bitcore-message');
  bitcore = require('bitcore-lib');
  superagent = require('superagent');
  wallet = require('./wallet.js');
  generateKeys = wallet.generateKeys;
  guid = function(){
    var s4;
    s4 = function(){
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  };
  request = function(config, path, body, cb){
    var mnemonic, name, node, parts, type, urlPart, ck, url, requestid, message, privateKey2, signature, req;
    mnemonic = config.mnemonic, name = config.name, node = config.node;
    parts = path.match(/^([A-Z]+) (\/.+)$/);
    type = parts[1].toLowerCase();
    urlPart = parts[2].replace(/:name/, name);
    ck = generateKeys(mnemonic);
    url = node + "" + urlPart;
    requestid = guid();
    message = p.join(';')(
    p.map(JSON.stringify)(
    [urlPart, body, requestid]));
    privateKey2 = bitcore.PrivateKey.fromWIF(ck.privateKey);
    signature = Message(message).sign(privateKey2);
    req = superagent[type](url);
    return req.send(body).set('requestid', requestid).set('address', ck.address).set('signature', signature).end(cb);
  };
  simple = curry$(function(path, config, cb){
    return request(config, path, {}, function(err, data){
      cb(err, data != null ? data.text : void 8);
    });
  });
  status = simple("GET /container/status/:name");
  methods = simple("GET /container/methods/:name");
  start = simple("POST /container/start/:name");
  stop = simple("POST /container/stop/:name");
  info = simple("GET /container/:name");
  out$.getContainerList = getContainerList = simple("GET /containers");
  create = curry$(function(config, data, cb){
    if (toString$.call(data).slice(8, -1) !== 'Object') {
      return cb("Data Must be an Object");
    }
    if (toString$.call(data.files).slice(8, -1) !== 'Object') {
      return cb("'files' is required field");
    }
    if (toString$.call(data.name).slice(8, -1) !== 'String') {
      return cb("'name' is required field");
    }
    return request({
      files: config.files,
      name: config.name
    }, "POST /container/create", data, function(err, data){
      cb(err, data != null ? data.text : void 8);
    });
  });
  update = curry$(function(config, data, cb){
    if (toString$.call(data).slice(8, -1) !== 'Object') {
      return cb("Data Must be an Object");
    }
    if (toString$.call(data.affectedFiles).slice(8, -1) !== 'Object') {
      return cb("'affected-files' is required field");
    }
    if (toString$.call(data.deletesFiles).slice(8, -1) !== 'Array') {
      return cb("'deletes-files' is required field");
    }
    if (toString$.call(data.name).slice(8, -1) !== 'String') {
      return cb("'name' is required field");
    }
    return request({
      affectedFiles: data.affectedFiles,
      deletesFiles: data.deletesFiles,
      name: config.name
    }, "POST /container/update", data, function(err, data){
      cb(err, data != null ? data.text : void 8);
    });
  });
  method = curry$(function(config, method, data, cb){
    if (toString$.call(data).slice(8, -1) !== 'Object') {
      return cb("Data Must be Object");
    }
    return request(config, "POST /container/:name/" + method, data, function(err, data){
      cb(err, data != null ? data.text : void 8);
    });
  });
  out$.getContainer = getContainer = function(config){
    return {
      status: status(config),
      create: create(config),
      start: start(config),
      stop: stop(config),
      method: method(config),
      methods: methods(config),
      info: info(config)
    };
  };
  function curry$(f, bound){
    var context,
    _curry = function(args) {
      return f.length > 1 ? function(){
        var params = args ? args.concat() : [];
        context = bound ? context || this : this;
        return params.push.apply(params, arguments) <
            f.length && arguments.length ?
          _curry.call(context, params) : f.apply(context, params);
      } : f;
    };
    return _curry();
  }
}).call(this);
