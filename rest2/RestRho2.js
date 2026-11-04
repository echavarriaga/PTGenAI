/* Generated power ModelRho (@VERSION 2.0) 
* Model Name: RestRho. Version: 1.5.0. Author: Enrique Chavarriaga
* Copyright 2025. Compilation date: Tue Apr 08 2025.
* Dual licensed under the MIT or GPL Version 2 licenses (http://www.devrho.com/license)
*/


const RHO = require("../rho/Rho2.js");
const express = require("express");
const JSONbig = require("json-bigint");
const mariadb = require("mariadb");
const mysql = require("mysql");
const fs = require("fs");
const handlebars = require("handlebars");
const crypto = require("crypto");
const log4js = require("log4js");
const marked = require("marked");
const OpenAI = require("openai");
const Groq = require("groq-sdk");
const punycode = require("punycode");

/*-----------------------------------------------------
*=Var[logger]: logger
* Description: Definition logger.
*-----------------------------------------------------*/
var logger = null;

/*-----------------------------------------------------
*=Object[CRYPTO]: CRYPTO
* Description: Management of encryption and decryption of information the RestRho.
*-----------------------------------------------------*/
var CRYPTO = {};

//* Object CRYPTO: Definitions Properties   
CRYPTO.Config = {pwdHmac: 'poop', wordKey: 'shit', hashedIV: 'crap'}; //Config crypto for field the tables.  
CRYPTO.Key = null; //Encryption object using double encryption.  
CRYPTO.ResizedIV = null; //Desencryption object using double encryption.

//* Object CRYPTO: Definitions Methods 
//init: Initialize crypto for RestRho.
CRYPTO.init = function(){
  // Create a hash using the SHA-256 algorithm for the provided hashedIV in the configuration. 
  let iv = crypto.createHash("sha256").update(this.Config.hashedIV).digest();
  // Initialize ResizedIV as a Buffer with a size of 16 bytes.
  this.ResizedIV = Buffer.allocUnsafe(16);
  // Copy the computed hash 'iv' into the ResizedIV buffer.
  iv.copy(this.ResizedIV);
  // Create a key using the HMAC-SHA256 algorithm with the provided pwdHmac in the configuration as the secret key.
  this.Key = crypto.createHmac('sha256', this.Config.pwdHmac).update(this.Config.wordKey).digest();
};

//cipher: Run apply cipher
CRYPTO.cipher = function(text){
  // Create a cipher using the AES-256 algorithm, initialized with the derived key and the resized IV.
  const cipher = crypto.createCipheriv("aes256", this.Key, this.ResizedIV);
  // Encrypt the input text using the created cipher, concatenate the results, convert it to a hexadecimal string, and return the encrypted text.
  return Buffer.concat([cipher.update(text.toString()), cipher.final()]).toString('hex');
};

//decipher: Run apply decipher.
CRYPTO.decipher = function(text){
  // Create a decipher using the AES-256 algorithm, initialized with the derived key and the resized IV.
  const decipher = crypto.createDecipheriv("aes256", this.Key, this.ResizedIV);
  // Decrypt the input text in hexadecimal format using the created decipher, concatenate the results, and return the decrypted text as a string.
  return Buffer.concat([decipher.update(text, 'hex'), decipher.final(),]).toString();
};



/*-----------------------------------------------------
*=Component[sql]: SQL
* Description: Component SQL Rho.
*-----------------------------------------------------*/
global.SQL = (function () {  
'use strict';
//Content definition component


/*-----------------------------------------------------
*=Var[map]: Map
* Description: Reference to the active database list.
*-----------------------------------------------------*/
var Map = {};

/*-----------------------------------------------------
*=Function[run_operation]: runOperation
* Description: Run operation of the table.
*-----------------------------------------------------*/
var runOperation = function (req, res, dbName, tableName, operation) { 
  try {
    let db = Map[dbName];
    
    //Validar token de usuario si está habilitado
    if (db.EnableToken) db.Registry.validate(req);

    //Ejecutar operación
    let table = db.Tables[tableName], 
        sql = table.getSQL(operation, req),
        values = table.getParameters(operation, req);
    //Execute operation the table for database
    console.info(`SQL: ${sql}`);
    switch(db.Connector) {
      case "mariadb": DBRest.executeMariaDB(req, res, db, sql, values, operation, table); break; 
      case "mysql": DBRest.executeMySQL(req, res, db, sql, values, operation, table); break;
    }
  }
  catch (error) { DBRest.error(req, res, error.message, error.content); }
};

/*-----------------------------------------------------
*=Function[copy_map]: copyMap
* Description: Copy a map according to an array of Keys.
*-----------------------------------------------------*/
var copyMap = function (map) { 
  let result = {};
  for (let key in map)
    result[key] = (typeof map[key] == 'object') ? Object.assign({}, map[key]) : map[key];
  return result;
};

/*-----------------------------------------------------
*=Class[database]: Database
* Description: Root class definition of databases for SQLRho.
*-----------------------------------------------------*/
class Database extends RHO.JSONDSL.Base { 

//Constructor Database
constructor (def, parent, ref) {
  super(def, parent, ref);
  //Properties 
  this._Name = '{[p:Name]}'; //Name database
  this._Description = '{[p:Description]}'; //Description database.
  this._Connector = '{[p:Connector]}'; //Type of database connector to use.
  this._EnableToken = '{[p:EnableToken]}'; //Enable token database connector.
  this._Pool = '{[p:Pool]}'; //Definition of a pool for the database.
  this.Definitions = null; //List of custom definitions.
  this.Tables = null; //List of tables available in RestRho.  
  this._Schema = DBRest.SCHEMAS[this.Name];
  this._LLM = '{[p:LLM]}'; //Reference to LLM.
  this._DirTemplates = '{[p:DirTemplates]}'; //Directory templates.
  this.Settings = null; //Setting configuration Database in file json.
}

//Definitions Get's/Set's  
get Name() { return RHO.getValue(this._Name, "Name", this, "required"); }  
set Name(value) { this._Name = RHO.setValue(this._Name, value, "Name", this, "required"); }
  
get Description() { return RHO.getValue(this._Description, "Description", this); }  
set Description(value) { this._Description = RHO.setValue(this._Description, value, "Description", this); }
  
get Connector() { return RHO.getValue(this._Connector, "Connector", this); }  
set Connector(value) { this._Connector = RHO.setValue(this._Connector, value, "Connector", this); }
  
get EnableToken() { return RHO.getValue(this._EnableToken, "EnableToken", this, null,true); }  
set EnableToken(value) { this._EnableToken = RHO.setValue(this._EnableToken, value, "EnableToken", this, null,true); }
  
get Pool() { return RHO.getValue(this._Pool, "Pool", this); }  
set Pool(value) { this._Pool = RHO.setValue(this._Pool, value, "Pool", this); }
  
get Schema() { return this._Schema; }
  
get LLM() { return RHO.getValue(this._LLM, "LLM", this); }  
set LLM(value) { this._LLM = RHO.setValue(this._LLM, value, "LLM", this); }
  
get DirTemplates() { return RHO.getValue(this._DirTemplates, "DirTemplates", this); }  
set DirTemplates(value) { this._DirTemplates = RHO.setValue(this._DirTemplates, value, "DirTemplates", this); }

//* Class Database: Definitions Methods and Static Methods
//Method: createPool. Description: Create MariaDB or MySQL database pool.
createPool (){
  switch(this.Connector){
    case "mariadb": return mariadb.createPool(this.ref.Pool);
    case "mysql": return mysql.createPool(this.ref.Pool);
  }
  return null;
}

//Method: onRun. Description: Create Pool.
onRun (){
  Map[this.Name] = this;
  //Crear registry en DBRest
  let body = `SQL.Map['${this.Name}'].Registry.login(req, res);`;
  APP.post(`/${this.Name}/login`, new Function("req", "res", body));
  //Crear template access in DBRest
  body = `SQL.Map['${this.Name}'].getTemplate(req, res);`;
  APP.get(`/${this.Name}/template`, new Function("req", "res", body));
  //Crear el fichero de configuración
  this.actionSettings("load");
}

//Method: onAfterCreateChild. Description: Add list definitions in database.
onAfterCreateChild (){
  if (this.Definitions) {
  	for (let name in this.context.definitions) 
      if (!this.Definitions[name]) this.Definitions[name] = this.context.definitions[name];
  }
  else if (this.context && this.context.definitions) 
    this.Definitions = this.context.definitions;
}

//Method: actionSettings. Description: Apply actons over setting configurations.
actionSettings (action, params){
  const dirPath = `${__dirname}/templates/${this.DirTemplates || ""}`;
  if (!fs.existsSync(dirPath) || !fs.lstatSync(dirPath).isDirectory())
    fs.mkdirSync(dirPath, { recursive: true });
  const filePath = `${dirPath}/settings.json`;
  switch(action) {
    case "load": 
      if (fs.existsSync(filePath)) 
        return this.Settings = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      this.Settings = {Templates: {}};
      break;
    case "addView": 
      if (!this.Settings.Templates[params.user])
        this.Settings.Templates[params.user] = [];
      if (this.Settings.Templates[params.user].includes(params.view)) return;
      this.Settings.Templates[params.user].push(params.view);
      break;
    case "listView": 
      if (!this.Settings.Templates[params.user])
        this.Settings.Templates[params.user] = [];
      this.Settings.Templates[params.user].push(params.view);
      return this.Settings.Templates[params.user];
      break;
  }
  fs.writeFileSync(filePath, JSON.stringify(this.Settings), 'utf8');
}

//Method: getTemplate. Description: Create action to obtain the rendering of a template defined in the database.
getTemplate (req, res){
  if (!req.query.name) DBRest.error(req, res, `No define name "${req.query.name}".`);
  let ref = this.Templates[req.query.name];
  if (!ref) DBRest.error(`No exist template whit name="${req.query.name}".`);
  let context = typeof req.body=="object" ? req.body : req.body=="string" && !!req.body ? JSON.parse(req.body) : {};
  req.setEncoding("utf8");
  logger.info(`Template: /${this.Name}/template/ ${req.query.name}.`);
  res.write( ref.apply(context) );
  res.end();
}

toString() { return "Database"; }

}

/*-----------------------------------------------------
*=Class[user_register]: UserRegister
* Description: User information registered in RestRho.
*-----------------------------------------------------*/
class UserRegister { 

//Constructor UserRegister
constructor (alias, info, minutes) {
  //Properties 
  this.Token = null; //Token registry.
  this.Expiration = null; //Token expiration date.
  this.Info = info; //User information.
  this.Minutes = minutes; //Minutes expiration token.
  //* Initialize class 
  this.createToken(alias);
  //* End Initialize
}

//Definitions Get's/Set's
//* Class UserRegister: Definitions Methods and Static Methods
//Method: updateExpiration. Description: Update expiration token.
updateExpiration (){
  this.Expiration = new Date(new Date().getTime()+this.Minutes*1000*60);
}

//Method: createToken. Description: Create token.
createToken (alias){
  this.updateExpiration();
  this.Token = CRYPTO.cipher(`${alias}|${this.Expiration.toISOString()}`);
}

//Method: valideToken. Description: Validate token with the registered one.
valideToken (token){
  if (new Date()>this.Expiration) throw new Error('Token has expired.');
  this.updateExpiration();
}

toString() { return "UserRegister"; }

}

/*-----------------------------------------------------
*=Class[registry]: Registry
* Description: User registration database. Creation and administration of login and token.
*-----------------------------------------------------*/
class Registry extends RHO.JSONDSL.Base { 

//Constructor Registry
constructor (def, parent, ref) {
  super(def, parent, ref);
  //Properties 
  this._Table = '{[p:Table]}'; //Name table
  this._User = '{[p:User]}'; //Alias User.
  this._Password = '{[p:Password]}'; //List of fields to decrypt.
  this.Users = {}; //Registered users in the RestRho.
  this._ValidityMinutes = '{[p:ValidityMinutes]}'; //Validity in minutes of the token.
}

//Definitions Get's/Set's  
get Table() { return RHO.getValue(this._Table, "Table", this); }  
set Table(value) { this._Table = RHO.setValue(this._Table, value, "Table", this); }
  
get User() { return RHO.getValue(this._User, "User", this); }  
set User(value) { this._User = RHO.setValue(this._User, value, "User", this); }
  
get Password() { return RHO.getValue(this._Password, "Password", this); }  
set Password(value) { this._Password = RHO.setValue(this._Password, value, "Password", this); }
  
get ValidityMinutes() { return RHO.getValue(this._ValidityMinutes, "ValidityMinutes", this); }  
set ValidityMinutes(value) { this._ValidityMinutes = RHO.setValue(this._ValidityMinutes, value, "ValidityMinutes", this); }

//* Class Registry: Definitions Methods and Static Methods
//Method: login. Description: Get name table for key.
login (req, res){
  let query = `SELECT * FROM ${this.Table} WHERE ${this.User}=?`,
      registry = this;
  logger.info(`Register user "${this.User}" connected in "${this._parent.Pool.database}".`);
  this._parent.Pool
    .query(query, [req.query.User])
    .then(rows => {
      try {
        //Validación de clave
        if (rows.length==0) throw new Error("User or password error.");
        let loginUser = rows[0];
        if (loginUser[registry.Password]!=req.query.Password) throw new Error("User or password error.");
       
        //Registrar usuario
        logger.info(`User "${loginUser}" connected in "${this._parent.Pool.database}".`);
        let userRegister = new SQL.UserRegister(req.query.User, loginUser, registry.ValidityMinutes);
        registry.Users[userRegister.Token] = userRegister;
       
        //Devolver resultado.
        DBRest.send(req, res, {ValidityMinutes: userRegister.Minutes, Token: userRegister.Token}); 
      }
      catch (error) { DBRest.error(req, res, error.message); }
    })
    .catch(error => DBRest.error(req, res, error.message));
}

//Method: validate. Description: Get SQL sentence for execute operation.
validate (req){
  //Obtener token
  let token = req.headers.token;
  if (!token) throw new Error("Undefined token.");
  //Validar el token
  let user = this.Users[token];
  if (!user) throw new Error("Invalid token.");
  try { user.valideToken(token); }
  catch(e){
    //Eliminar token por error en la validación
    delete this.Users[token];
    throw e;
  }
}

//Method: remove. Description: Remove user from user registry.
remove (){}

toString() { return "Registry"; }

}

/*-----------------------------------------------------
*=Class[template]: Template
* Description: Definition of templates for use in the transformation of SQL results.
*-----------------------------------------------------*/
class Template extends RHO.JSONDSL.Base { 

//Constructor Template
constructor (def, parent, ref) {
  super(def, parent, ref);
  //Properties 
  this.Name = null; //Name template.
  this._Dir = '{[p:Dir]}'; //Directory
  this._File = '{[p:File]}'; //Template file.
  this.Body = null; //Body template.
  this.BodyView = null; //Body template version.
  this._LLM = '{[p:LLM]}'; //Reference to LLM.
  this.Views = {}; //Map of template versions by user.
  this.Map = null; //Map to manage geTemplate
}

//Definitions Get's/Set's  
get Dir() { return RHO.getValue(this._Dir, "Dir", this); }  
set Dir(value) { this._Dir = RHO.setValue(this._Dir, value, "Dir", this); }
  
get File() { return RHO.getValue(this._File, "File", this); }  
set File(value) { this._File = RHO.setValue(this._File, value, "File", this); }
  
get TemplateView() { return `${this.Name}.view`; }
  
get LLM() { return RHO.getValue(this._LLM, "LLM", this); }  
set LLM(value) { this._LLM = RHO.setValue(this._LLM, value, "LLM", this); }

//* Class Template: Definitions Methods and Static Methods
//Method: onInit. Description: Load template file.
onInit (key){
  this.Name = key ? key : this.ref.Name;
  if (!this.LLM) this.LLM = this.parent.LLM;
  this.register();
}

//Method: register. Description: Register template in the motor template.
register (dir, file){
  if (dir) this.Dir = dir;
  if (file) this.File = file;
  if (this.File) {
    this.Body = fs.readFileSync(`${__dirname}/templates/${this.Dir}/${this.File}`, 'utf8');
  	RHO.Templates.register("Handlebars", this.Name, this.Body);
  }
}

//Method: mapInit. Description: Initialize map of a request template.
mapInit (name, dir, file){
  this.Name = name;
  if (!this.Map) this.Map = {};
  const refMap = this.Map[this.Name];
  this.register(dir, file);
  if (refMap)
    this.BodyView = refMap.BodyView;
}

//Method: mapSave. Description: Save map of a request template.
mapSave (){
  if (this.Map)
  	this.Map[this.Name] = { Body: this.Body, BodyView: this.BodyView };
}

//Method: apply. Description: Apply template.
apply (req, res, context){
  const action = req.query.action, user = req.query.user, view = req.query.view, message = req.query._message_llm;
  //Procesar apply completion LLM
  if (message && this.LLM && action == "completion") {
    let llm = DBRest.MapLLM[this.LLM];
    if (!!llm) {
      //Crear prompt para la plantilla 
      if (!llm.Prompt) throw `Prompt is not defined for template '${llm.Path}'`;
      let petition = llm.Prompt.replace("{message}", message).replace("{template}", this.BodyView || this.Body);
      llm.completion(req, res, this, {role: "user", content: petition}, context);
      this.mapSave();
      return null;
    }
  }
  //Procesar acción del usuario 
  switch(action) {
    case "reset":  this.resetView(); break;
    case "append": this.appendView(user, view); break;
    case "save":   this.saveView(user, view, user); break;
    case "change": this.changeView(user, view); break;
    case "edit": 
      const body = this.adminTemplate(action, (this.BodyView) ? this.TemplateView : this.Name, context);
      return DBRest.send(req, res, body);
    case "replace": this.replaceView(req.query.body); break;
  }
  //Renderizar página segín solicitud
  this.mapSave();
  return this.applyRender((this.BodyView) ? this.TemplateView : this.Name, context);
}

//Method: resetView. Description: Reset view to original.
resetView (){
	this.BodyView = null; 
  this.register(); 
}

//Method: appendView. Description: Create a version in the memory of the template per active version or by default per user.
appendView (user, view){
  if (!this.Views[user]) this.Views[user] = {};
  this.Views[user][view] = (this.BodyView) ? this.BodyView : this.Body;
}

//Method: saveView. Description: Create a version on the disk of the template version or by default per user.
saveView (user, view){
  view = view.split('-').pop();
  const dirPath = `${__dirname}/templates/_users_/${user}/${this.Dir}/${view}`;
	if (!fs.existsSync(dirPath) || !fs.lstatSync(dirPath).isDirectory())
    try { fs.mkdirSync(dirPath, { recursive: true });  } 
    catch (error) { throw `Error creating directory: ${dirPath}'`; } 
  const filePath = `${dirPath}/${this.File}`;
	fs.writeFileSync(filePath, (this.BodyView) ? this.BodyView : this.Body, 'utf8');
  this.root.actionSettings("addView", {view: view, user: user});
}

//Method: loadView. Description: Get version in the disk of the template per active vesion or by default per user.
loadView (user, view){
  const dirPath = `${__dirname}/templates/_users_/${user}/${this.Dir}/${view.split('-').pop()}`;
  if (fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory()) {
    const filePath = `${dirPath}/${this.File}`;
    if (fs.existsSync(filePath)) 
      	return fs.readFileSync(filePath, 'utf8');
  }
  return false;
}

//Method: changeView. Description: Change a version of the template per active LLM or by default per user.
changeView (user, view){
 	if (!(this.Views[user] && this.Views[user][view])) {
    const version = this.loadView(user, view);
    if (!version) return false;
    this.BodyView = version;
    RHO.Templates.register("Handlebars", this.TemplateView, version);
    this.appendView(user, view);
  }
  else this.BodyView = this.Views[user][view];
}

//Method: replaceView. Description: Replace versión
replaceView (body){
 	if (body) this.BodyView = body;
  RHO.Templates.register("Handlebars", this.TemplateView, this.BodyView);
}

//Method: applyRender. Description: Apply rendering and 
applyRender (template, context){
  try { return RHO.Templates.render(template, context);  }
  catch(e) { return this.adminTemplate("error", template, e.message); }
}

//Method: adminTemplate. Description: Template version management.
adminTemplate (action, template, message){
  let title, alert;
  switch (action) {
    case "error": 
      title = `Error Template '<b>${template}</b>'`; 
      alert = "danger";
      break;
    case "edit": 
      if (!this.BodyView) this.BodyView = this.Body;
      title = `Edit Template '<b>${template}</b>'`; 
      message = `Modify the template as needed, then submit (button "<b>replace</b>") the changes to view them.'`; 
      alert = "info";
      break;
  }
  this.mapSave();
  return `<div class="p-4 overflow-auto" style="width: 100vw; height: 100vh; position: absolute; top: 0; left: 0;">
    <h5 class="border-bottom py-2 mb-3">${title}</h5> 
    <div class="alert alert-${alert} mb-3" role="alert"><i class="fa-solid fa-circle-info fa-lg me-2"></i> ${message}</div>
    <h6>Code Transform</h6>
    <textarea id="textareaBodyView" class="form-control w-100 mb-3" rows="20">${this.BodyView}</textarea>
    <button type="button" class="btn btn-success py-0" onclick="setTimeout(() => CHAT.replace('textareaBodyView'),200)">Replace</button>
    <button type="button" class="btn btn-warning py-0" onclick="setTimeout(() => CHAT.reset(),200)">Reset</button>
    <button type="button" class="btn btn-info py-0" onclick="setTimeout(() => PRHO.started(),200)">Go Main!!</button>
  </div>`;
}

//Method: render. Description: It is rendered by making a request to an LLM to obtain a template transformed via IAGen.
render (req, res, result, context){
  this.BodyView = result.content;
  RHO.Templates.register("Handlebars", this.TemplateView, this.BodyView);
  this.mapSave();
  DBRest.send(req, res, this.applyRender(this.TemplateView, context));
}

toString() { return "Template"; }

}

/*-----------------------------------------------------
*=Class[table]: Table
* Description: Table class definition of databases.
*-----------------------------------------------------*/
class Table extends RHO.JSONDSL.Base { 

//Constructor Table
constructor (def, parent, ref) {
  super(def, parent, ref);
  //Properties 
  this.Name = null; //Name table.
  this._Encrypt = '{[p:Encrypt]}'; //List of fields to encrypt.
  this._Decrypt = '{[p:Decrypt]}'; //List of fields to decrypt.
  this._Uses = '{[p:Uses]}'; //Definition of default operators.
  this.Operations = null; //List of custom operations.
}

//Definitions Get's/Set's  
get Encrypt() { return RHO.getValue(this._Encrypt, "Encrypt", this); }  
set Encrypt(value) { this._Encrypt = RHO.setValue(this._Encrypt, value, "Encrypt", this); }
  
get Decrypt() { return RHO.getValue(this._Decrypt, "Decrypt", this); }  
set Decrypt(value) { this._Decrypt = RHO.setValue(this._Decrypt, value, "Decrypt", this); }
  
get Uses() { return RHO.getValue(this._Uses, "Uses", this); }  
set Uses(value) { this._Uses = RHO.setValue(this._Uses, value, "Uses", this); }
  
get Describe() { return DBRest.SCHEMAS[this.root.Name][this.Name].Describe; }

//* Class Table: Definitions Methods and Static Methods
//Method: onInit. Description: Get name table for key.
onInit (key){
  this.Name = key;
  //this.Describe = this.parent.Schema[key].Describe;
}

//Method: completeSentences. Description: Complete sentences SQL.
completeSentences (clauses){
  let change = (key, sentence) => clauses[key] = sentence.replace("%", clauses[key]),
      refTables, ref, result;
  for (let key in clauses)
    switch(key) {
      case "Where": change(key, " WHERE % "); break;
      case "Join": change(key, ", % "); break;
      case "GroupBy": change(key, " GROUP BY % "); break;
      case "OrderBy": change(key, " ORDER BY % "); break;
      case "Having": change(key, " HAVING % "); break;
      case "Limit": change(key, " LIMIT % "); break;
      case "Distinct": clauses[key] = (clauses[key] === true) ? " DISTINCT " :""; break;
      case "InnerJoin": case "LeftJoin": case "RightJoin":
        refTables = clauses[key], result = "";
        for (ref in refTables) result += ` ${key.replace("Join", "").toUpperCase()} JOIN ${ref} ON ${refTables[ref]} `;
        clauses[key] = result;
        break;
    }
}

//Method: getSQL. Description: Get SQL sentence for execute operation.
getSQL (name, req){
  let operation = this.Operations[name], 
      newDefinition = typeof req.body=="object" ? req.body : req.body=="string" && !!req.body ? JSON.parse(req.body) : {};
  
  //Obtener nueva configuración
  if (!!newDefinition.Clauses && typeof newDefinition.Clauses.Fields == "string") {
    let params = newDefinition.Clauses.Fields.toUpperCase().split(",");
    switch (operation.Ref.Method) {
      case "put":
        let fields = {};
        params.forEach(name => {
          if (!!operation.Clauses.Fields[name]) fields[name] = `=:${name}`;
        });
        newDefinition.Clauses.Fields = fields;
        break;
      case "post":
        newDefinition.Clauses = { Fields: params.toString(), Values: ":"+params.join(",:")};
        break;
    }
  }
  //Procesar configuración
  let clauses = Object.assign({}, operation.Clauses, newDefinition.Clauses);
	this.completeSentences(clauses);
  //TODO: Transformar carácteres especiales
  let sql = operation.Ref.getSQL( Object.assign({Table: this.Name + (!!operation.Alias ? ` ${operation.Alias}` : "")}, clauses), this.root.Schema[this.Name] );
  sql = sql.replaceAll('&#x27;', "'");
  return sql;
}

//Method: getParameters. Description: Get the list of req values to execute the SQL statement.
getParameters (name, req){
  let operation = this.Operations[name],
      params = operation.Ref.getParameters(req, operation.Parameters);
  //Desencriptar valores
  if (!!this.Decrypt && Array.isArray(this.Decrypt))
    this.Decrypt.forEach(name => {
      if (params[name]) params[name] = CRYPTO.decipher(params[name]);
    });
  return params;
}

//Method: applyTransform. Description: Transform result SQL statements.
applyTransform (req, res, name, rows){
  let operation = this.Operations[name];
  if (!!operation) return operation.applyTransform(req, res, rows);
  return rows;
}

//Method: getInfo. Description: Get the information of the table and its operations.
getInfo (operations){
  let result = {Describe: this.Describe, Operations: [], Name: this.Name}, index = 1;
  if (!operations) operations = Object.keys(this.Operations);
  for (let index=0; index<operations.length; index++) {
    let name = operations[index], operation = this.Operations[name];
    if (!!operation)
      result.Operations.push({
        Index: index+1, Name: name, SQL: this.getSQL(name, {body: {}}), Describe: operation.Describe,
        Body: JSON.stringify( Object.assign(copyMap(operation.ref), {Table: this.Name} ) )
      });
  } 
  return result;
}

toString() { return "Table"; }

}

/*-----------------------------------------------------
*=Class[operation]: Operation
* Description: Operation of a table.
*-----------------------------------------------------*/
class Operation extends RHO.JSONDSL.Base { 

//Constructor Operation
constructor (def, parent, ref) {
  super(def, parent, ref);
  //Properties 
  this.Key = null; //Key operation.
  this._Definition = '{[p:Definition]}'; //Name definition
  this._Alias = '{[p:Alias]}'; //Alias table.
  this._Action = '{[p:Action]}'; //Action operation table.
  this._Parameters = '{[p:Parameters]}'; //Parameters for query definition.
  this._Clauses = '{[p:Clauses]}'; //Modifications on the definition of SQL.
  this.Ref = null; //Reference to definition.
  this._Template = '{[p:Template]}'; //Name template.
  this.RefTemplate = null; //Reference template to lis Database.
  this.Describe = null; //Reference table operation description.
}

//Definitions Get's/Set's  
get Definition() { return RHO.getValue(this._Definition, "Definition", this); }  
set Definition(value) { this._Definition = RHO.setValue(this._Definition, value, "Definition", this); }
  
get Alias() { return RHO.getValue(this._Alias, "Alias", this); }  
set Alias(value) { this._Alias = RHO.setValue(this._Alias, value, "Alias", this); }
  
get Action() { return RHO.getValue(this._Action, "Action", this); }  
set Action(value) { this._Action = RHO.setValue(this._Action, value, "Action", this); }
  
get Parameters() { return RHO.getValue(this._Parameters, "Parameters", this); }  
set Parameters(value) { this._Parameters = RHO.setValue(this._Parameters, value, "Parameters", this); }
  
get Clauses() { return RHO.getValue(this._Clauses, "Clauses", this); }  
set Clauses(value) { this._Clauses = RHO.setValue(this._Clauses, value, "Clauses", this); }
  
get Template() { return RHO.getValue(this._Template, "Template", this); }  
set Template(value) { this._Template = RHO.setValue(this._Template, value, "Template", this); }

//* Class Operation: Definitions Methods and Static Methods
//Method: onInit. Description: Get Name for key.
onInit (key){
  this.Key = key;
  this.RefTemplate = !!this.Template && this.root.Templates && this.root.Templates[this.Template];
}

//Method: onRun. Description: Get Name of operation.
onRun (){
  let info = {db: this.root.Name, table: this.parent.Name, action: this.Action},
      body = `SQL.runOperation(req, res, "${info.db}", "${info.table}", "${this.Key}");`;
  this.Ref = this.root.Definitions[this.Definition || this.Key];
  if (!this.Ref) throw new Error(`Error in operation in Table Name "${info.table}". There is not Definition "${this.Definition || this.Key}".`);
  this.Describe = `Method: '${this.Ref.Method}'. URL: http://localhost${this.Ref.Path(info)}.`;
  logger.info(this.Describe);
  APP[this.Ref.Method](this.Ref.Path(info), new Function("req", "res", body));
}

//Method: applyTransform. Description: Apply transform SQL statement to result executing.
applyTransform (req, res, rows){
  return this.applyTemplate(req, res, (!!this.Transform) ? this.Transform.apply(rows) : rows );
}

//Method: applyTemplate. Description: Apply transform to transform SQL statement to result executing. Apply LLM if configured.
applyTemplate (req, res, rows){
  if (!!this.RefTemplate) return this.RefTemplate.apply(req, res, rows);
  return rows;
}

toString() { return "Operation"; }

}

/*-----------------------------------------------------
*=Class[transform]: Transform
* Description: Transform result SQL statements.
*-----------------------------------------------------*/
class Transform extends RHO.JSONDSL.Base { 

//Constructor Transform
constructor (def, parent, ref) {
  super(def, parent, ref);
  //Properties 
  this._Type = '{[p:Type]}'; //Transformation type (Psoition, ToArray)
}

//Definitions Get's/Set's  
get Type() { return RHO.getValue(this._Type, "Type", this); }  
set Type(value) { this._Type = RHO.setValue(this._Type, value, "Type", this); }

//* Class Transform: Definitions Methods and Static Methods
//Method: apply. Description: Apply transformation result SQL statement.
apply (rows){
  let  method = `apply${this.Type}`;
  if (!!this[method]) return this[method](rows);
  throw new Error(`No transformation type exists: '${this.Type}'.`);
}

//Method: applyPosition. Description: Get nth position (Index)
applyPosition (rows){
  if (typeof this.ref.Index == "number") {
    // Check if the index is within the range of the rows array.
    if (rows.length == 0) throw new Error(`Information not available.`);
    if (this.ref.Index < rows.length) return rows[this.ref.Index];
    throw new Error(`Query out of range. Index: ${this.ref.Index}. Length: ${rows.length}`);
  }
  throw new Error(`Position is not of type number. Type is '${typeof this.ref.Index}'.`);
}

//Method: applyToArray. Description: Get the array of a Field
applyToArray (rows){
  if (typeof this.ref.Field == "string") {
    // Initialize an object 'result' and assign the rows to the field specified in '_ref.Field'.
    let result = [], name = this.ref.Field;
    rows.forEach(row => result.push(row[name]));
    return result;
  }
	throw new Error(`ToArray is not of type string. Type Field is '${typeof this.ref.Field}'.`);
}

//Method: applyGroup. Description: Create a JSON grouped by a Field
applyGroup (rows){
  if (typeof this.ref.Field == "string") {
    let result = {}, name = this.ref.Field;
    rows.forEach(row => {
      let key = row[name];
      // If the key is not already a property in 'result', create an array for it.
      if (!result[key]) result[key] = [];
      // Remove the field from the row and push the modified row into the array corresponding to the key.
      delete row[name];
      result[key].push(row);
    });
    return result;
  }
	throw new Error(`Group is not of type string. Type Field is '${typeof this.ref.Field}'.`);
}

//Method: applyMap. Description: Apply transformation Map
applyMap (rows){
  if (typeof this.ref.Field == "string") {
    // Initialize an object 'result' and assign the rows to the field specified in '_ref.Field'.
    let result = {};
    result[this.ref.Field] = rows;
    return result;
  }
	throw new Error(`ToArray is not of type string. Type Field is '${typeof this.ref.Field}'.`);
}

toString() { return "Transform"; }

}



/*-----------------------------------------------------
* Module Initialize: SQLInit  
*-----------------------------------------------------*/
function SQLInit() { 
  handlebars.registerHelper("x", function(expression, options) {
    // you can change the context, or merge it with options.data, options.hash
    var result, context = this;
    result = (function() {
      try { return eval(expression); } 
      catch (e) { console.warn('Expression: {{x \'' + expression + '\'}}\nJS-Error: ', e, '\nContext: ', context); }
    }).call(context); // to make eval's lexical this=context
    return result;
  });
  handlebars.registerHelper("xif", function(expression, options) {
    return handlebars.helpers["x"].apply(this, [expression, options]) ? options.fn(this) : options.inverse(this);
  });

}
SQLInit();

/*-----------------------------------------------------
* Component Definition: SQL  
*-----------------------------------------------------*/
return {
  //Content 
  Map: Map, //* Type: Var
  runOperation: runOperation, //* Type: Function
  copyMap: copyMap, //* Type: Function
  Database: Database, //* Type: Class
  UserRegister: UserRegister, //* Type: Class
  Registry: Registry, //* Type: Class
  Template: Template, //* Type: Class
  Table: Table, //* Type: Class
  Operation: Operation, //* Type: Class
  Transform: Transform, //* Type: Class
  //Properties 
  //Methods 
  toString: function() { return "SQL"; }
};
})(); 

/*-----------------------------------------------------
*=DSL[sql_rho]: SQLRho
* Description: JSON-based DSL definition SQL.
*-----------------------------------------------------*/
var GAMMAR_SQL_RHO = {
  NAME: "SQLRho",
  ELEMENTS: {
    "database": {
      CLASS: "SQL.Database",
      CHILDREN: { 
        "Registry": { KEY: "registry", TYPE: "Object" },
        "Templates": { KEY: "template", TYPE: "Map" },
        "Tables": { KEY: "table", TYPE: "Map" } 
      }
    },
    "registry": {
      CLASS: "SQL.Registry",
      CHILDREN: null
    },
    "template": {
      CLASS: "SQL.Template",
        PROPERTIES: { "Dir": {VALID: true}, "File": {VALID: true} },
      CHILDREN: null
    },
    "table": {
      CLASS: "SQL.Table",
      CHILDREN: { "Operations": { KEY: "operation", TYPE: "Map" } }
    },
    "operation": {
      CLASS: "SQL.Operation",
      CHILDREN: { "Transform": { KEY: "transform", TYPE: "Object" } }
    },
    "transform": {
      CLASS: "SQL.Transform",
      PROPERTIES: { "Type": {VALID: true} },
      CHILDREN: null
    }
  },
  ROOT: "database"
};
RHO.JSONDSL.register("SQLRho", GAMMAR_SQL_RHO); 

/*-----------------------------------------------------
*=Function[started]: started
* Description: Registering and litening list of available servers.
*-----------------------------------------------------*/
var started = function (app, refAxios) { 
  // Initialize the CRYPTO module.
  logger.info(`Started Application RestRho.`);
  APP = app;
  CRYPTO.init();
  axios = refAxios;
  // Initialize the API for the DBRestRho and Read.
  let dir = `${__dirname}/rest/`;
  // Read all files in the 'rest/' directory and process each JSON file.
  let files = fs.readdirSync(dir);
  files.forEach(name => {
    let file = `${dir}/${name}`;
    if (fs.statSync(file).isFile()) {
      // Load the JSON code from the file using RHO.loadSync.
      let CODE = RHO.loadSync("JSON", file);
      // Run the DSL-JSON program for DBRestRho using the loaded code.
      RHO.Engine.runJSONDSL("DBRestRho", `program_${CODE.Name}`, {json: CODE});
      logger.debug(`Register DBRestRho: ${CODE.Name}`);
    }
  });
};

/*-----------------------------------------------------
*=Component[db_rest]: DBRest
* Description: Component Dartabase Rho.
*-----------------------------------------------------*/
global.DBRest = (function () {  
'use strict';
//Content definition component


/*-----------------------------------------------------
*=Var[schemas]: SCHEMAS
* Description: Reference to the active database list.
*-----------------------------------------------------*/
var SCHEMAS = {};

/*-----------------------------------------------------
*=Var[mapprompt]: MapPrompt
* Description: Reference to prompts list.
*-----------------------------------------------------*/
var MapPrompt = {};

/*-----------------------------------------------------
*=Var[mapllm]: MapLLM
* Description: Reference to open LLMs list.
*-----------------------------------------------------*/
var MapLLM = {};

/*-----------------------------------------------------
*=Var[reftemplete]: RefTemplate
* Description: Reference to template.
*-----------------------------------------------------*/
var RefTemplate = null;

/*-----------------------------------------------------
*=Function[error]: error
* Description: Return message error.
*-----------------------------------------------------*/
var error = function (req, res, message) { 
  try {
    if (!res.headerSent) {
      res.writeHead(400, {'Content-Type': 'application/json'});
      // Write and Log an error message.
      res.write( JSONbig.stringify({message: message}) );
      logger.error(message);
      res.end();
    }
  }
  catch(error) { logger.info(error.message); }
  
};

/*-----------------------------------------------------
*=Function[send]: send
* Description: Return result json.
*-----------------------------------------------------*/
var send = function (req, res, result) { 
  res.writeHead(200, {'Content-Type': 'application/json'});
  // Write the JSON representation of the 'result' object to the response.
  res.write( JSONbig.stringify(result) );
  res.end();
};

/*-----------------------------------------------------
*=Function[apply_crypto_fields]: applyCryptoFields
* Description: Apply crypto fields result information.
*-----------------------------------------------------*/
var applyCryptoFields = function (req, rows, encrypt) { 
  //Aplicar encriptación en lista de campos si los hay
  if (!encrypt) return;
  if (Array.isArray(rows)) 
    rows.forEach(row => {
      encrypt.forEach(key => { 
        // For each key specified in 'encrypt', encrypt the corresponding value in the 'row'.
        if (row[key]) row[key] = CRYPTO.cipher(row[key]); 
      });
    });
  else if (req.method=="POST" && rows.insertId!==0) // Check if the request method is POST and rows exist elements.
    // Encrypt value using CRYPTO cipher.
    rows.insertId = CRYPTO.cipher(rows.insertId);
};

/*-----------------------------------------------------
*=Function[execute_mariadb]: executeMariaDB
* Description: Execute a DBRest Api operation from MariaDB.
*-----------------------------------------------------*/
var executeMariaDB = function (req, res, db, sql, values, operation, table) { 
  const pool = db.createPool();
  req.setEncoding("utf8");
  // Execute a query using the connection pool MariaDB with named placeholders and the provided SQL statement and values.
  async function executeQuery() {
    let connection;
    try {
      // Obtener una conexión del pool
      let connection = await pool.getConnection();
      // Apply cryptographic transformations to specified fields in the result set.
      let rows = await connection.query(sql, values, { namedPlaceholders: true });
			// Return the transformed result using the specified operation and transform.
      let transform = table.applyTransform(req, res, operation, rows);
      if (transform) send(req, res, transform);
    } catch (error) {
      DBRest.error(req, res, error.message);
    } finally {
      if (connection) connection.release(); // Liberar la conexión de vuelta al pool
    }
	}
  executeQuery();
};

/*-----------------------------------------------------
*=Function[execute_mysql]: executeMySQL
* Description: Execute a DBRest Api operation from MySQL.
*-----------------------------------------------------*/
var executeMySQL = function (req, res, pool, sql, values, operation, table) { 
  req.setEncoding("utf8");
  try {
    // Execute a SQL query using the connection pool with the provided SQL statement and values.
    pool.query(sql, values, function (error, rows, fields) {
      if (error) return DBRest.error(req, res, error.message);
      // Apply cryptographic transformations to specified fields in the result set.
      applyCryptoFields(req, rows, table.Encrypt);
      // Return the transformed result using the specified operation and transform.
      let transform = table.applyTransform(req, res, operation, rows);
      if (transform) send(req, res, transform);
    });
  } 
  catch (error) { DBRest.error(req, res, error.message); }
};

/*-----------------------------------------------------
*=Function[execute_programs_db]: executeProgramsDB
* Description: Execute programs DBRestRho configurated.
*-----------------------------------------------------*/
var executeProgramsDB = function (CODE, definitions, rows) { 
  let schemas = getSchemasByDatabase(rows, CODE.Name), program = `program_db_${CODE.Name}`;
  // Create operations basic (Update, Select, Insert, Delete, SelectAll, Where) of the Tables.
  for (let name in CODE.Tables) createOperationsByUses(CODE.Tables[name], schemas[name]);
  // Run a SQLRho program using the RhoEngine.
  RHO.Engine.runJSONDSL("SQLRho", program, {json: CODE}, {definitions: definitions});
  // Log an informational message indicating the creation of a connection and the execution of the RhoProgram.
  logger.info(`Created connection '${CODE.Name}' and executed RhoProgram '${program}'`);
  //Execute foreign key by databases
};

/*-----------------------------------------------------
*=Function[build_insert]: buildInsert
* Description: Build definition for an Insert SQL.
*-----------------------------------------------------*/
var buildInsert = function (fields) { 
	let params = [];
  //Definir parámetros
  fields.forEach( name => params.push(name.toUpperCase()) );
  return {Parameters: {query: params}, Clauses: { Fields: params.toString(), Values: ":"+params.join(",:")}};
};

/*-----------------------------------------------------
*=Function[build_update]: buildUpdate
* Description: Build definition for an Updape SQL.
*-----------------------------------------------------*/
var buildUpdate = function (key, fields) { 
	let result = {Parameters: {query: []}, Clauses: { key: key, Fields: {}}};
  fields.forEach((name) => {
    let field = name.toUpperCase();
    result.Clauses.Fields[field] = `=:${field}`;
    result.Parameters.query.push(field);
  });
  return result;
};

/*-----------------------------------------------------
*=Function[create_operations_by_uses]: createOperationsByUses
* Description: Create operations by uses.
*-----------------------------------------------------*/
var createOperationsByUses = function (table, schema) { 
  if (table.Uses){
    if (!table.Operations) table.Operations = {};
    // Iterate through each operation (Insert, Update, Delete, Select, SelectAll, SelectWhere) in the 'Uses' array.
    table.Uses.forEach(oper => {
      switch(oper) {
        case "Insert": table.Operations[oper] = buildInsert(schema.Fields); break;
        case "Update": table.Operations[oper] = buildUpdate(schema.Key, schema.Fields); break;
        case "Delete": table.Operations[oper] = { Clauses: { key: schema.Key } }; break;
        case "Select": table.Operations[oper] = { Clauses: { key: schema.Key }, Transform: { Type: "Position", Index: 0 } }; break;
        case "SelectAll": case "SelectWhere": table.Operations[oper] = { }; break;
      }
    });
  }
};

/*-----------------------------------------------------
*=Function[get_schemas_by_database]: getSchemasByDatabase
* Description: Create Schema By Database.
*-----------------------------------------------------*/
var getSchemasByDatabase = function (rows, dbName) { 
  let schemas = {}, dbSchemas = {};
  SCHEMAS[dbName] = {};
  // Build schemas for tables to create automatic operations based on the provided 'rows'.
  rows.forEach(row => {
    let table = schemas[row.TABLE_NAME];
    // If the table schema does not exist, initialize it and add an entry in 'SCHEMAS' for the specific table.
    if (!table) {
      table = schemas[row.TABLE_NAME] = {Key: null, Fields: []};
      SCHEMAS[dbName][row.TABLE_NAME] = {Key: null, Fields: [], Describe: "", ForeingKeys: ""};
    }
    // Check if the column has a key.
    if (!!row.COLUMN_KEY) table.Key = SCHEMAS[dbName][row.TABLE_NAME].Key = row.COLUMN_NAME.toUpperCase(); 
    else table.Fields.push(row.COLUMN_NAME.toUpperCase());
    SCHEMAS[dbName][row.TABLE_NAME].Fields.push(row.COLUMN_NAME.toUpperCase());
    SCHEMAS[dbName][row.TABLE_NAME].Describe += ` ${row.COLUMN_NAME.toUpperCase()} ${row.COLUMN_TYPE.toUpperCase()} ${row.IS_NULLABLE=='NO' ? 'NOT NULL' : 'NULL'} ${row.EXTRA.toUpperCase()},`;
  });
  for (let name in SCHEMAS[dbName]) 
    SCHEMAS[dbName][name].Describe = `CREATE TABLE ${name.toUpperCase()}( ${SCHEMAS[dbName][name].Describe} PRIMARY KEY (${SCHEMAS[dbName][name].Key}) USING BTREE{{foreignKeys}});\n`;
  return schemas;
};

/*-----------------------------------------------------
*=Function[get_foreign_keys_by_database]: getForeignKeysByDatabase
* Description: Create Foreign Keys By Database.
*-----------------------------------------------------*/
var getForeignKeysByDatabase = function (rows, dbName) { 
  let dbMap = SCHEMAS[dbName];
  // Build ferign keys for tables to create automatic operations based on the provided 'rows'.
  rows.forEach(row => {
    let table = dbMap[row.TABLE_NAME];
    table.ForeingKeys += `, KEY ${row.CONSTRAINT_NAME} (${row.COLUMN_NAME}), CONSTRAINT ${row.CONSTRAINT_NAME} FOREIGN KEY (${row.COLUMN_NAME}) REFERENCES ${row.REFERENCED_TABLE_NAME} (${row.REFERENCED_COLUMN_NAME})`;                   
  });
  for (let name in dbMap) dbMap[name].Describe = dbMap[name].Describe.replace('{{foreignKeys}}', dbMap[name].ForeingKeys);
};

/*-----------------------------------------------------
*=Function[get_db_info]: getDBInfo
* Description: Get information by RestRho.
*-----------------------------------------------------*/
var getDBInfo = function (server, dbName) { 
  let db = SQL.Map[dbName];
  if (!db) throw `There is no '${bdName}' database available.`;
  let defs = server.ref.Definitions,
      dbMap ={Name: dbName, Tables: [], Definitions: {Map: defs, String: JSON.stringify(defs), Array: Object.keys(defs).join(", ")}};
  Object.keys(db.Tables)
    .forEach(tableName => {
    let table = db.Tables[tableName];
    dbMap.Tables.push(table.getInfo());
  });
	return dbMap;
};

/*-----------------------------------------------------
*=Function[get_base_file]: getBaseFile
* Description: Validate that the dir and file exist in the 'templates' directory.
*-----------------------------------------------------*/
var getBaseFile = function (req, res, run, dirBase='/templates') { 
  req.setEncoding("utf8");
  try {
    const dirPath = `${__dirname}${dirBase}${req.query.dir}`;
    if (fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory()) {
      const filePath = `${dirPath}/${req.query.file}`;
    	if (fs.existsSync(filePath)) run(req, res, filePath);
      else DBRest.error(req, res, `The file '${filePath}' was not found.`);
  	}
  	else DBRest.error(req, res, `The directory '${dirPath}' was not found.`);
  } 
  catch (error) { DBRest.error(req, res, error.message); }
};

/*-----------------------------------------------------
*=Function[get_file]: getFile
* Description: Get with apply file.
*-----------------------------------------------------*/
var getFile = function (req, res) { 
  getBaseFile(req, res, function(req, res, filePath) {
    switch(req.query.action) {
      case "save":
        const llm =req.query.llm;
        if (llm && MapLLM[llm]) MapLLM[llm].manageMessage();
        fs.writeFileSync(filePath, req.query.body, 'utf8');
        break;
    }
    DBRest.send(req, res, fs.readFileSync(filePath, 'utf8'));
  }, "");
};

/*-----------------------------------------------------
*=Function[get_template]: getTemplate
* Description: Get by template from file.
*-----------------------------------------------------*/
var getTemplate = function (req, res) { 
  getBaseFile(req, res, function(req, res, filePath) {
    RefTemplate.mapInit(req.query.NameTemplate, req.query.dir, req.query.file);
    if (req.query.Prompt) RefTemplate.LLM = req.query.Prompt;
    const rendering = RefTemplate.apply(req, res, req.body);
    if (rendering) DBRest.send(req, res, rendering);
  });
};

/*-----------------------------------------------------
*=Class[server]: Server
* Description: Root class definition of the Server Api RESTful Rho.
*-----------------------------------------------------*/
class Server extends RHO.JSONDSL.Base { 

//Constructor Server
constructor (def, parent, ref) {
  super(def, parent, ref);
  //Properties 
  this._Name = '{[p:Name]}'; //Name of DBRest
  this._Description = '{[p:Description]}'; //Description of DBRest.
  this._Connector = '{[p:Connector]}'; //Type of database connector to use.
  this._Databases = '{[p:Databases]}'; //Database or project list defined in DBRestRho.
  this.Definitions = null; //List of SQL execution definitions for a database.
  this._Chats = '{[p:Chats]}'; //List Chats Connections.
  this.Map = {}; //Register of available databases.
  this._LLM = '{[p:LLM]}'; //Reference a LLM for Template.
}

//Definitions Get's/Set's  
get Name() { return RHO.getValue(this._Name, "Name", this, "required"); }  
set Name(value) { this._Name = RHO.setValue(this._Name, value, "Name", this, "required"); }
  
get Description() { return RHO.getValue(this._Description, "Description", this); }  
set Description(value) { this._Description = RHO.setValue(this._Description, value, "Description", this); }
  
get Connector() { return RHO.getValue(this._Connector, "Connector", this); }  
set Connector(value) { this._Connector = RHO.setValue(this._Connector, value, "Connector", this); }
  
get Databases() { return RHO.getValue(this._Databases, "Databases", this); }  
set Databases(value) { this._Databases = RHO.setValue(this._Databases, value, "Databases", this); }
  
get Chats() { return RHO.getValue(this._Chats, "Chats", this); }  
set Chats(value) { this._Chats = RHO.setValue(this._Chats, value, "Chats", this); }
  
get LLM() { return RHO.getValue(this._LLM, "LLM", this); }  
set LLM(value) { this._LLM = RHO.setValue(this._LLM, value, "LLM", this); }

//* Class Server: Definitions Methods and Static Methods
//Method: createConnectionMariaDB. Description: Create connection to MariaDB database.
createConnectionMariaDB (CODE, definitions){
  const pool = mariadb.createPool(CODE.Pool);
  async function getSchema() {
    let connection, sql, rows;
    try {
      // Obtener una conexión del pool
      connection = await pool.getConnection();
      // Ejecutar la función de procesamiento con los resultados
      sql = `SELECT TABLE_NAME, COLUMN_NAME, COLUMN_KEY, COLUMN_DEFAULT, COLUMN_TYPE, IS_NULLABLE, EXTRA 
             FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='${CODE.Pool.database}'`;
      rows = await connection.query(sql);
      logger.info(`Connected MariaDB to: ${CODE.Pool.database}.`);
      executeProgramsDB(CODE, definitions, rows);
			// Crear llaves foraneas de la BD para los prompts dinámicos
      sql = `SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME 
             FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = '${CODE.Pool.database}' AND REFERENCED_TABLE_NAME IS NOT NULL;`;
      rows = await connection.query(sql);
      getForeignKeysByDatabase(rows, CODE.Name);
    } catch (error) {
      return logger.fatal(`Error connecting: ${error.message}`);
    } finally {
      if (connection) connection.release(); // Liberar la conexión de vuelta al pool
    }
	}
  getSchema();
}

//Method: createConnectionMySQL. Description: Create connection to MySQL database.
createConnectionMySQL (CODE, definitions){
  let sql = `SELECT TABLE_NAME, COLUMN_NAME, COLUMN_KEY, COLUMN_DEFAULT, COLUMN_TYPE, IS_NULLABLE, EXTRA FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='${CODE.Pool.database}'`
      connection = mysql.createConnection(CODE.Pool);
  connection.connect(function(error) {
  	if (error) return logger.fatal(`Error connecting: ${error.stack}`);
    logger.info(`Connected MySQL to: ${CODE.Pool.database}.`);
    connection.query(sql, function (error, rows, fields) {
      if (error) return logger.fatal("Error getting the schemas: " + error.stack);
      executeProgramsDB(CODE, definitions, rows);
    });
	});
}

//Method: onRun. Description: Create express and server rest.
onRun (){
  try{
    // Set the directory path for database files.
    let dir = `${__dirname}/db/`;
    // Iterate through each database file in the 'Databases' array.
    this.Databases.forEach(dbFile => {
      let CODE = RHO.loadSync("JSON", dir+dbFile), definitions = this.Definitions;
      // Switch based on the database connector type in the loaded CODE.
      switch(CODE.Connector) {
        case "mariadb": this.createConnectionMariaDB(CODE, definitions); break;
        case "mysql": this.createConnectionMySQL(CODE, definitions); break;
        default: throw `There is no database connector '${CODE.Connector}'.`;
      }
      //Create action get file
      logger.info(`Method: 'post'. URL: http://localhost/${this.Name}/getFile.`);
      APP.post(`/${this.Name}/getFile`, DBRest.getFile);
      //Create get template.
      RefTemplate = this.Template;
      logger.info(`Method: 'post'. URL: http://localhost/${this.Name}/getTemplate.`);
      APP.post(`/${this.Name}/getTemplate`, DBRest.getTemplate);
    });
  }
  catch(e){ 
    logger.error(`Error creating server [${this.Name}]: ${e.message}`); 
    throw e;  
  }
}

toString() { return "Server"; }

}

/*-----------------------------------------------------
*=Class[definition]: Definition
* Description: Definition class for SQL execute from database.
*-----------------------------------------------------*/
class Definition extends RHO.JSONDSL.Base { 

//Constructor Definition
constructor (def, parent, ref) {
  super(def, parent, ref);
  //Properties 
  this._Name = '{[p:Name]}'; //Name definition  
  this._Method = this.ref.Method || 'get';
  this._Clauses = '{[p:Clauses]}'; //Clauses of an SQL statement.  
  this._SQL = handlebars.compile(this.ref.SQL);  
  this._Path = handlebars.compile(this.ref.Path);
  this._Parameters = '{[p:Parameters]}'; //List of values to substitute in the SQL template.
}

//Definitions Get's/Set's  
get Name() { return RHO.getValue(this._Name, "Name", this); }  
set Name(value) { this._Name = RHO.setValue(this._Name, value, "Name", this); }
  
get Method() { return this._Method; }
  
get Clauses() { return RHO.getValue(this._Clauses, "Clauses", this); }  
set Clauses(value) { this._Clauses = RHO.setValue(this._Clauses, value, "Clauses", this); }
  
get SQL() { return this._SQL; }
  
get Path() { return this._Path; }
  
get Parameters() { return RHO.getValue(this._Parameters, "Parameters", this); }  
set Parameters(value) { this._Parameters = RHO.setValue(this._Parameters, value, "Parameters", this); }

//* Class Definition: Definitions Methods and Static Methods
//Method: onInit. Description: Initialize DBRest operation definition.
onInit (key){
  this.Name = key;
}

//Method: getSQL. Description: Apply template.
getSQL (data, schema){
  data = Object.assign({}, this.Clauses, data);
  // Process each key-value pair in the 'data' object.
  for (let key in data) {
    let item = data[key];
    // Check if the value associated with the key is an object.
    if (typeof item  == "object"){
      let result = "";
      // Iterate through the properties of the object and concatenate them into a string.
      for (let i in item) result += `${i}${item[i]},`;
      data[key] = result.substr(0, result.length-1);
    }
    else if (key=="fields" && typeof item == "string" && item=="*")
      data[key] = schema.Fields.toString();
  }
  return this.SQL(data);
}

//Method: getParameters. Description: Get the list of req values (params, query, body) for execute the SQL statement.
getParameters (req, paramsOperation){
  let result = {}, 
      map = typeof req.body=="object" ? req.body : !!req.body && req.body=="string" ? JSON.parse(req.body) : {},
      params = Object.assign({}, this.Parameters, paramsOperation, map.Parameters);
  // Review the three types of Request parameters: params, query, body
  for (let key in params){
    let item = params[key];
    // If the parameter is an array, extract each named parameter from the request property.
    if (Array.isArray(item)) item.forEach(name => result[name] = req[key][name]);
    else throw new Error(`Error in definition of param '${item.toString()}' in definition '${this.Name}'.`);
  }
  return result;
}

toString() { return "Definition"; }

}

/*-----------------------------------------------------
*=Function[run_prompt]: runPrompt
* Description: Run dynamic prompt  of the rest.
*-----------------------------------------------------*/
var runPrompt = function (req, res, promptName) { 
  try {
    let prompt = MapPrompt[promptName];
    req.setEncoding("utf8");
    res.type('text/plain');
    send(req, res, prompt.build());
  }
  catch (error) { DBRest.error(req, res, error.message); }
};

/*-----------------------------------------------------
*=Class[prompt]: Prompt
* Description: Build dynamic prompts to train an AI.
*-----------------------------------------------------*/
class Prompt extends RHO.JSONDSL.Base { 

//Constructor Prompt
constructor (def, parent, ref) {
  super(def, parent, ref);
  //Properties 
  this._Name = '{[p:Name]}'; //Name prompt  
  this._Method = this.ref.Method || 'get';  
  this._Action = `/${this.parent.Name}${this.ref.Action}` || '/prompt';
  this._Template = '{[p:Template]}'; //Template handlebar to transform prompt.
  this._Database = '{[p:Database]}'; //Database reference to obtain the training prompt.
  this._File = '{[p:File]}'; //Name file output prompt.
}

//Definitions Get's/Set's  
get Name() { return RHO.getValue(this._Name, "Name", this); }  
set Name(value) { this._Name = RHO.setValue(this._Name, value, "Name", this); }
  
get Method() { return this._Method; }
  
get Action() { return this._Action; }
  
get Template() { return RHO.getValue(this._Template, "Template", this); }  
set Template(value) { this._Template = RHO.setValue(this._Template, value, "Template", this); }
  
get Database() { return RHO.getValue(this._Database, "Database", this); }  
set Database(value) { this._Database = RHO.setValue(this._Database, value, "Database", this); }
  
get File() { return RHO.getValue(this._File, "File", this); }  
set File(value) { this._File = RHO.setValue(this._File, value, "File", this); }

//* Class Prompt: Definitions Methods and Static Methods
//Method: onInit. Description: Initialize prompts.
onInit (key){
  this.Name = key;
}

//Method: onRun. Description: Create action prompt.
onRun (){
  if (!!MapPrompt[this.Name]) throw new Error(`The Prompt '${this.Name}' is already defined.`);
  //Create prompt action
  let body = `DBRest.runPrompt(req, res, "${this.Name}");`;
  MapPrompt[this.Name] = this;
  logger.info(`Method. '${this.Method}'. Path. [Prompt]${this.Action}`);
  APP[this.Method](this.Action, new Function("req", "res", body));
}

//Method: getDBInfo. Description: Obtain filtered information to build the prompt.
getDBInfo (){
  let server = this.root, db = SQL.Map[this.Database.Name];
  if (!db) throw `There is no '${this.Database.Name}' database available.`;
  let defs = server.ref.Definitions, refTables = this.Database.Tables, refTemplates = this.Database.Templates,
      dbMap ={Name: this.Database.Name, Tables: [], Templates: [], Definitions: {Map: defs, String: JSON.stringify(defs), Array: Object.keys(defs).join(", ")}};
  Object.keys(this.Database.Tables).forEach(tableName => {
    let table = db.Tables[tableName], operations = (typeof refTables[tableName] == "string") ? null : refTables[tableName];
    dbMap.Tables.push(table.getInfo(operations));
  });
  let templates = (typeof this.Database.Templates == "string") ? Object.keys(db.Templates) : this.Database.Templates;
  templates.forEach((name, index) => {
    let template = db.Templates[name];
    if (!!template) dbMap.Templates.push({Index: index+1, Name: name, Body: template.getBody()});
  });
	return dbMap;
}

//Method: build. Description: Build prompt for database.
build (req, res){
  //Load template 
  let nameTemplate = `Prompt.${this.Name}`;
  RHO.Templates.register("Handlebars", nameTemplate, fs.readFileSync(`${__dirname}/templates/prompt/${this.Template}`, 'utf8'));

  //Build prompt text
  let result = RHO.Templates.render(nameTemplate, this.getDBInfo());
  fs.writeFile(`${__dirname}/templates/prompt/${this.File}`, result, (err) => {
    if (err) console.error(`Error save file: `, err);
  });
  return result;
}

toString() { return "Prompt"; }

}

/*-----------------------------------------------------
*=Class[chat]: Chat
* Description: Definition class for Chat Connection.
*-----------------------------------------------------*/
class Chat extends RHO.JSONDSL.Base { 

//Constructor Chat
constructor (def, parent, ref) {
  super(def, parent, ref);
  //Properties 
  this._Name = '{[p:Name]}'; //Name chat.
  this._Api = '{[p:Api]}'; //Uses api library for connection.
  this._ApiKey = '{[p:ApiKey]}'; //API KEY de connection
  this.ApiRef = null; //Reference to the API object  
  this._Body = !!this.ref.Body ? this.ref.Body : {model: 'gpt-3.5-turbo'};
}

//Definitions Get's/Set's  
get Name() { return RHO.getValue(this._Name, "Name", this); }  
set Name(value) { this._Name = RHO.setValue(this._Name, value, "Name", this); }
  
get Api() { return RHO.getValue(this._Api, "Api", this); }  
set Api(value) { this._Api = RHO.setValue(this._Api, value, "Api", this); }
  
get ApiKey() { return RHO.getValue(this._ApiKey, "ApiKey", this); }  
set ApiKey(value) { this._ApiKey = RHO.setValue(this._ApiKey, value, "ApiKey", this); }
  
get Body() { return this._Body; }

//* Class Chat: Definitions Methods and Static Methods
//Method: onInit. Description: Initialize Chat Connection.
onInit (key){
  this.Name = key;
}

//Method: onRun. Description: Create default header and configuring.
onRun (key){
  switch (this.Api){
    case "openia": this.ApiRef = new OpenAI({ apiKey:this.ApiKey }); break;
    case "groq": this.ApiRef = new Groq({ apiKey:this.ApiKey }); break;
  }
}

//Method: completion. Description: Create and run LLM Chat.
completion (req, res, ref, body, obj, context){
  try {
    body = Object.assign({}, this.Body, body);  
    //Execution function 
    async function execute(chat, body) {
      try {
        let response;
        //Handling according to the API used
        switch (chat.Api){
          case "openia": response = await chat.ApiRef.chat.completions.create(body); break;
          case "groq": response = await chat.ApiRef.chat.completions.create(body); break;
        }
        
        //Error handling depending on the API
        let error = response["error"];
        if (error) throw new Error(`Code '${error["error"]}': ${error["message"]}`);
        if (!response["choices"] && response["choices"].length == 0) throw new Error(`Code 'length_empty': There are no response messages.`);
        
        //Obtener resultado de la respuesta
        response = response.choices[0].message;
        if (obj) {
          if (ref.History) ref.Stack[req.query.user].push(response);
          obj.render(req, res, response, context);
        }
        else ref.render(req, res, response);
      } catch (error) {
        DBRest.error(req, res, error.message);
      }
    }
    execute(this, body);
  } catch (error) {
     DBRest.error(req, res, error.message);
  }
}

toString() { return "Chat"; }

}

/*-----------------------------------------------------
*=Function[run_llm]: runLLM
* Description: Run LLM of the rest.
*-----------------------------------------------------*/
var runLLM = function (req, res, name, method) { 
  try {
    let llm = MapLLM[name], completion = `${method}Completion`;
    req.setEncoding("utf8");
    llm[completion](req, res);
  }
  catch (error) { DBRest.error(req, res, error.message); }
};

/*-----------------------------------------------------
*=Function[clean_history_llm]: cleanHistoryLLM
* Description: Clean history user the LLM.
*-----------------------------------------------------*/
var cleanHistoryLLM = function (req, res, name) { 
  try {
    let llm = MapLLM[name];
    req.setEncoding("utf8");
    llm.cleanHistory(req, res);
  }
  catch (error) { DBRest.error(req, res, error.message); }
};

/*-----------------------------------------------------
*=Class[llm]: LLM
* Description: Definition class for LLM.
*-----------------------------------------------------*/
class LLM extends RHO.JSONDSL.Base { 

//Constructor LLM
constructor (def, parent, ref) {
  super(def, parent, ref);
  //Properties 
  this._Name = '{[p:Name]}'; //Name model.
  this._Method = '{[p:Method]}'; //Method get or post.
  this._History = '{[p:History]}'; //Preserve the history of the conversation.
  this._UseMarked = '{[p:UseMarked]}'; //Use Markdown markup transformation.
  this._Complete = '{[p:Complete]}'; //Full LLM JSON response.  
  this._Path = `/${this.parent.Name}${this.ref.Path}`;
  this._Chat = '{[p:Chat]}'; //Name Chat.
  this.RefChat = null; //Reference Chat Connection.  
  this._Config = !!this.ref.Config ? this.ref.Config : {model: 'gpt-3.5-turbo'};
  this._Prompt = '{[p:Prompt]}'; //Create a custom prompt for template questions
  this.Stack = {}; //Map users message.
  this._Messages = '{[p:Messages]}'; //List of messages for the defined LLM.
  this._ResponseJSON = '{[p:ResponseJSON]}'; //Flag message content format JSON.
}

//Definitions Get's/Set's  
get Name() { return RHO.getValue(this._Name, "Name", this); }  
set Name(value) { this._Name = RHO.setValue(this._Name, value, "Name", this); }
  
get Method() { return RHO.getValue(this._Method, "Method", this, null,'get'); }  
set Method(value) { this._Method = RHO.setValue(this._Method, value, "Method", this, null,'get'); }
  
get History() { return RHO.getValue(this._History, "History", this, null,false); }  
set History(value) { this._History = RHO.setValue(this._History, value, "History", this, null,false); }
  
get UseMarked() { return RHO.getValue(this._UseMarked, "UseMarked", this, null,false); }  
set UseMarked(value) { this._UseMarked = RHO.setValue(this._UseMarked, value, "UseMarked", this, null,false); }
  
get Complete() { return RHO.getValue(this._Complete, "Complete", this, null,false); }  
set Complete(value) { this._Complete = RHO.setValue(this._Complete, value, "Complete", this, null,false); }
  
get Path() { return this._Path; }
  
get Chat() { return RHO.getValue(this._Chat, "Chat", this); }  
set Chat(value) { this._Chat = RHO.setValue(this._Chat, value, "Chat", this); }
  
get Config() { return this._Config; }
  
get Prompt() { return RHO.getValue(this._Prompt, "Prompt", this); }  
set Prompt(value) { this._Prompt = RHO.setValue(this._Prompt, value, "Prompt", this); }
  
get Messages() { return RHO.getValue(this._Messages, "Messages", this, null,null); }  
set Messages(value) { this._Messages = RHO.setValue(this._Messages, value, "Messages", this, null,null); }
  
get ResponseJSON() { return RHO.getValue(this._ResponseJSON, "ResponseJSON", this, null,null); }  
set ResponseJSON(value) { this._ResponseJSON = RHO.setValue(this._ResponseJSON, value, "ResponseJSON", this, null,null); }

//* Class LLM: Definitions Methods and Static Methods
//Method: onInit. Description: Initialize LLMs.
onInit (key){
  this.Name = key;
}

//Method: onRun. Description: Create action LLM.
onRun (){
  if (!!MapLLM[this.Name]) throw new Error(`The LLM '${this.Name}' is already defined.`);
  //Create LLM action POST
  let body = `DBRest.runLLM(req, res, "${this.Name}", "${this.Method}");`;
  MapLLM[this.Name] = this;
  logger.info(`Method. '${this.Method}'. Path. [LLM]${this.Path}`);
  APP[this.Method](this.Path, new Function("req", "res", body));
  //Add clean history
  body = `DBRest.cleanHistoryLLM(req, res, "${this.Name}");`;
  APP.get(`${this.Path}/cleanHistory`, new Function("req", "res", body));
  logger.info(`Method. 'post'. Path. [LLM]${this.Path}/cleanHistory`);
  //Add renference
  if (this.parent.Chats && this.parent.Chats[this.Chat])
    this.RefChat = this.parent.Chats[this.Chat];
  //Loader Messages
	this.initMessages();
}

//Method: cleanHistory. Description: Clean history messages.
cleanHistory (req, res){
  const user = req.query.user;
  if (!user) throw `No define user "${user}".`;
  this.Stack[user] = null; 
  req.setEncoding("utf8");
	res.write( JSON.stringify({cleaned: true}) );
  res.end();
}

//Method: initMessages. Description: Init messages and historic message the users.
initMessages (){
  this.Stack = {};
  if (this.Messages)
    for (let message of this.Messages) {
      message.content = fs.readFileSync(`${__dirname}/prompt/${message.file}`, 'utf8');
      delete message.file;
    }
}

//Method: manageMessage. Description: Managing LLM Messages.
manageMessage (user, petition){
  if (!user) throw `No define user "${user}".`;
  let messages = [];
  //Initialize configured user messages
  if (this.History) {
    if (!this.Stack[user]) this.Stack[user] = [].concat(this.Messages) || [];
    messages = this.Stack[user]; 
  }
  else if (this.Messages)
    messages = this.Messages;
  //Incluir messages de system
  messages.push(petition);
  if (this.History) this.Stack[user] = messages;
  let body = Object.assign({}, this.Config, {messages: messages});
  return body;
}

//Method: completion. Description: Create and run LLM Chat.
completion (req, res, obj, petition, context){
  try {
    let body = this.manageMessage(req.query.user, petition);  
    if (!this.RefChat) return DBRest.error(req, res, `No define Chat Connection '${this.Chat}'.`);
    this.RefChat.completion(req, res, this, body, obj, context);
  } catch (error) {
     DBRest.error(req, res, error.message);
  }
}

//Method: postCompletion. Description: Execute completion POST.
postCompletion (req, res){
  let petition = typeof req.body=="object" ? req.body : req.body=="string" && !!req.body ? JSON.parse(req.body) : null;
  if (!petition) return DBRest.error(req, res, `No define petition for LLM.`);
  this.completion(req, res, null, petition);
}

//Method: getCompletion. Description: Execute completion GET.
getCompletion (req, res){
  if (!req.query.content) return DBRest.error(req, res, `No define content for chat LLM.`);
  let petition = { "role": "user", "content": req.query.content };
  this.completion(req, res, null, petition);
}

//Method: applyMarked. Description: Apply markup to the LLM JSON structure.
applyMarked (messagesUser){
  let result = [];
  for (let item of messagesUser) 
  	result.push( (item.role == 'user') ? item : {role: item.role, content: marked.parse(item.content)} );
	return result;
}

//Method: render. Description: Process OpenAI messages to do transformation.
render (req, res, message){
  let response, stackHistory;
  //Procesar respuesta
  if (this.ResponseJSON) 
    	message.content = message.content.replaceAll("```", "").trim();
  //Procesar historial
  if (this.History) this.Stack[req.query.user].push(message);
  req.setEncoding("utf8");
  //Devolver respuesta según configuración
  if (this.Complete) {
    stackHistory = this.History ? this.Stack[req.query.user] : message;
    response = JSONbig.stringify( this.UseMarked ? this.applyMarked(stackHistory) : stackHistory );
  }
  else response = this.UseMarked ? marked.parse(message.content) : message.content;
  res.write(response);
  res.end();
}

toString() { return "LLM"; }

}



/*-----------------------------------------------------
* Module Initialize: DBRestInit  
*-----------------------------------------------------*/
function DBRestInit() { 
  // Configure the logging system using log4js.
  log4js.configure({
    appenders: { everything: { type: 'file', filename: 'logs.log' } },
    categories: { default: { appenders: ['everything'], level: 'ALL' } }
  });
  // Create a logger instance using log4js.
  logger = log4js.getLogger();
  RHO.Templates.register("Handlebars", "model.json", fs.readFileSync(`${__dirname}/llm/templates/json.html`, 'utf8'));
  RHO.Templates.register("Handlebars", "model.sql", fs.readFileSync(`${__dirname}/llm/templates/sql.html`, 'utf8'));

}
DBRestInit();

/*-----------------------------------------------------
* Component Definition: DBRest  
*-----------------------------------------------------*/
return {
  //Content 
  SCHEMAS: SCHEMAS, //* Type: Var
  MapPrompt: MapPrompt, //* Type: Var
  MapLLM: MapLLM, //* Type: Var
  RefTemplate: RefTemplate, //* Type: Var
  error: error, //* Type: Function
  send: send, //* Type: Function
  applyCryptoFields: applyCryptoFields, //* Type: Function
  executeMariaDB: executeMariaDB, //* Type: Function
  executeMySQL: executeMySQL, //* Type: Function
  executeProgramsDB: executeProgramsDB, //* Type: Function
  buildInsert: buildInsert, //* Type: Function
  buildUpdate: buildUpdate, //* Type: Function
  createOperationsByUses: createOperationsByUses, //* Type: Function
  getSchemasByDatabase: getSchemasByDatabase, //* Type: Function
  getForeignKeysByDatabase: getForeignKeysByDatabase, //* Type: Function
  getDBInfo: getDBInfo, //* Type: Function
  getBaseFile: getBaseFile, //* Type: Function
  getFile: getFile, //* Type: Function
  getTemplate: getTemplate, //* Type: Function
  Server: Server, //* Type: Class
  Definition: Definition, //* Type: Class
  runPrompt: runPrompt, //* Type: Function
  Prompt: Prompt, //* Type: Class
  Chat: Chat, //* Type: Class
  runLLM: runLLM, //* Type: Function
  cleanHistoryLLM: cleanHistoryLLM, //* Type: Function
  LLM: LLM, //* Type: Class
  //Properties 
  //Methods 
  toString: function() { return "DBRest"; }
};
})(); 

/*-----------------------------------------------------
*=DSL[db_rest_rho]: DBRestRho
* Description: JSON-based DSL definition RestRho.
*-----------------------------------------------------*/
var GAMMAR_DB_REST_RHO = {
  NAME: "DBRestRho",
  ELEMENTS: {
    "server": {
      CLASS: "DBRest.Server",
      CHILDREN: { 
        "Definitions": { KEY: "definition", TYPE: "Map" },
        "Prompts": { KEY: "prompt", TYPE: "Map" },
        "Chats": { KEY: "chat", TYPE: "Map" },
        "LLMs": { KEY: "llm", TYPE: "Map" },
        "Template": { KEY: "template", TYPE: "Object" }
      }
    },
    "definition": {
      CLASS: "DBRest.Definition",
      CHILDREN: null
    },
    "prompt": {
      CLASS: "DBRest.Prompt",
      CHILDREN: null
    },
    "chat": {
      CLASS: "DBRest.Chat",
      PROPERTIES: {"Api": {VALID: true}, "ApiKey": {VALID: true}},
      CHILDREN: null
    },
    "llm": {
      PROPERTIES: {"Path": {VALID: true}, "NameChat": {VALID: true}},
      CLASS: "DBRest.LLM",
      CHILDREN: null
    },
    "template": {
      CLASS: "SQL.Template",
      CHILDREN: null
    }
  },
  ROOT: "server"
};
RHO.JSONDSL.register("DBRestRho", GAMMAR_DB_REST_RHO); 



/*-----------------------------------------------------
* Section export server nodejs
*-----------------------------------------------------*/

// Var: logger. Definition logger.
exports.logger = logger;

// Component: SQL. Component SQL Rho.
exports.SQL = SQL;

// Function: started. Registering and litening list of available servers.
exports.started = started;

// Component: DBRest. Component Dartabase Rho.
exports.DBRest = DBRest;

