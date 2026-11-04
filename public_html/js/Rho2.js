/* Generated power ModelRho (@VERSION 2.0) 
* Model Name: Rho Engine. Version: 2.0. Author: Enrique Chavarriaga
* Copyright 2024. Compilation date: Fri Feb 16 2024.
* Dual licensed under the MIT or GPL Version 2 licenses (http://www.devrho.com/license)
*/


var RHO = (function () {  
'use strict';
//Content definition component module



/*-----------------------------------------------------
*=Var[flag_debug]: FLAG_DEBUG
* Description: Global variable to enable console debug messages
*-----------------------------------------------------*/
var FLAG_DEBUG = false;

/*-----------------------------------------------------
*=Function[debug]: DEBUG
* Description: Take the console messages, as long as FLAG_DEBUG=true
*-----------------------------------------------------*/
var DEBUG = function (text, error) { 
  if (FLAG_DEBUG===true){
    text = "["+(new Date()).toLocaleString()+"] "+text;
    if (error) console.error(text, error.toString());
    else console.log(text);
  } 
};

/*-----------------------------------------------------
*=Var[index_id]: INDEX
* Description: Define index for generate ID.
*-----------------------------------------------------*/
var INDEX = 1;

/*-----------------------------------------------------
*=Const[gen_id]: genId
* Description: Generate ID.
*-----------------------------------------------------*/
const genId = prefix => `${prefix}_${INDEX++}`;

/*-----------------------------------------------------
*=Const[specials]: SPECIALS
* Description: Regular expression specials.
*-----------------------------------------------------*/
const SPECIALS = `\{}[]()?^$:`;

/*-----------------------------------------------------
*=Const[pattern_specials]: patternSpecials
* Description: Modify special patterns of a regular expression.
*-----------------------------------------------------*/
const patternSpecials = (t) => { 
  let s = "";
  for(let i=0; i<t.length; i++) s += (SPECIALS.indexOf(t[i])==-1 ? '':'\\')+t[i];  
  return s;
};

/*-----------------------------------------------------
*=Const[regexp_start_end]: RegExpStartEnd
* Description: Get results of an expression with start and end.
*-----------------------------------------------------*/
const RegExpStartEnd = (start, end, source, asArray=true) => { 
  let reg = new RegExp(`(?<=${patternSpecials(start)})[\\s\\S]*?(?=${patternSpecials(end)})`, 'g'),
      result = [];
  source.replace(reg, (str) => { 
    result.push(str);
    return str; 
  });
  return asArray ? result : result[0];
};

/*-----------------------------------------------------
*=Object[validator]: Validator
* Description: Administration of validation for any Rho language
*-----------------------------------------------------*/
var Validator = {};

//* Object Validator: Definitions Properties   
Validator.rules = {}; //List of rules  
Validator.messages = {}; //List of the messages the rules

//* Object Validator: Definitions Methods 
//init: Initialize basic validators
Validator.init = function(){
  //Registrar validadores
  this.add("required", / /, "The '{name}' attribute is mandatory.");
  this.add("digits", /^\d+$/, "The attribute '{name}' must be a numeric digit");
  this.add("number", /^[-+]?\d+(\.\d+)?$/, "The attribute '{name}' must be a decimal number. Use '.' as decimal separator.");
  this.add("integer", /^[-]?\d+(\.\d+)?$/, "The attribute '{name}' must be an integer.");
  this.add("boolean", /(true|false)/, "The attribute '{name}' is not boolean.");
  this.add("identifier", /^[a-zA-Z0-9_.\-]+$/, "The '{name}' attribute must be an identifier. Use a-z, A-Z, 0-9, '_' or '-'.");
  this.add("variable", /^[a-zA-Z0-9_]+$/, "The attribute '{name}' must be a variable name. Use a-z, A-Z, 0-9 or '_'.");
  this.add("classcss", /^[ a-zA-Z0-9_.:\-]+$/, "The '{name}' attribute must be a CSS class name. Use a-z, A-Z, 0-9 or '_' or '-' or ':' o '.'.");
  this.add("email", /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i, "The attribute '{name}' must have email format.");
  this.add("url", /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i, "The attribute '{name}' must have URL format");
};

//add: Add a new validator
Validator.add = function(key, rule, message){
  this.rules[key] = rule;
  this.messages[key] = message;
};

//message: Get a message from a rule
Validator.message = function(key, name){
  return this.messages[key].replace(/{name}/g, name);
};

//exec: Execute validation of field
Validator.exec = function(key, name, value){
  if (key=="required"){
    return true;
  } 
  var rule = this.rules[key] ? new RegExp(this.rules[key]) : null;
  if (rule && !rule.test(value)) throw new Error(this.message(key, name));
  return true;
};

//execOptions: Validate options the field
Validator.execOptions = function(name, options, value){
  if (options.indexOf(value)==-1) 
    throw new Error(`The option "${value}" doesn't exist for "${name}". Possible values = ${options}.`);
  return true;
};

//apply: Apply a set of validators
Validator.apply = function(validator, name, value, _default){
  if (validator.indexOf("required")==-1 && value==null && _default==null) return true;
  if (value && validator.indexOf("options:")==0) this.execOptions(name, validator.replace("options:",""), value!=null ? value : _default);
  validator.split(",").forEach(key => { this.exec(key, name, value); });
  return true;
};


  //* Initialize object 
Validator.init();
  //* End Initialize

/*-----------------------------------------------------
*=Function[set_value]: setValue
* Description: Save and validate the information of a class or object property.
*-----------------------------------------------------*/
var setValue = function (variable, value, name, ref, validator, _default) { 
  if (ref.data!=null) value = ref.data.setValue(variable, value);
  if (validator!=null) Validator.apply(validator, ref.toString()+"."+name, ref.data.apply(value), _default);
  return value;
};

/*-----------------------------------------------------
*=Function[get_value]: getValue
* Description: Obtain and validate the information of a property of a class or of an object
*-----------------------------------------------------*/
var getValue = function (variable, name, ref, validator, _default) { 
  let value = variable;
  if (typeof variable=="string" && ref.data) value = ref.data.apply(variable);
  if (value==null && _default!=null) value = _default;
  if (validator!=null) Validator.apply(validator, ref.toString()+"."+name, value);
  return value;
};

/*-----------------------------------------------------
*=Function[load_sync_client]: loadSync
* Description: Obtain XML, JSON files synchronously via AJAX.
*-----------------------------------------------------*/
var loadSync = function (type, url, data) { 
  let formData = new FormData();
  if (data!=null)
    for (let key in data) formData.append(key, data[key]);
  
  //Ejecutar carga asincrónica
  let xhr = new XMLHttpRequest(), 
      result,
      transferComplete = function() {
        if (this.readyState == 4 && this.status == 200) 
          switch(type){
            case "XML": result = this.responseXML; break;
            case "JSON": result = JSON.parse(this.responseText); break;
            case "TXT": result = this.responseText; break;
          }
        else throw new Error(this.responseText);
      },
      transferFailed = function(event){ 
        throw new Error(`An error occurred while transferring the file "${url}".`); 
      };
  xhr.addEventListener("load", transferComplete, false);
  xhr.addEventListener("error", transferFailed, false);
  xhr.open("GET", url, false);
  xhr.send(formData);
  return result;
};

/*-----------------------------------------------------
*=Function[extend]: extend
* Description: Deep extension of objects.
*-----------------------------------------------------*/
var extend = function (out) { 
  out = out || {};
  //Realizar copia
  for (let i = 1; i < arguments.length; i++) {
    let obj = arguments[i];
    if (!obj) continue;

    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object'){
          if(obj[key] instanceof Array == true) out[key] = obj[key].slice(0);
          else out[key] = extend(out[key], obj[key]);
        }
        else out[key] = obj[key];
      }
      else if (typeof obj[key] == "function")
        eval(`out[key] = ${obj[key].toString()}`);
    }
  }
  //Retornar resultado
  return out;
};

/*-----------------------------------------------------
*=Function[gup]: gup
* Description: Function to obtain parameters of the URL.
*-----------------------------------------------------*/
var gup = function (param) { 
  let name = param.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]"),
      regex = new RegExp(`[\\?&]${name}=([^&#]*)`),
      results = regex.exec(window.location.href);
  return results ? results[1] : null;
};

/*-----------------------------------------------------
*=Component[templates]: Templates
* Description: Template engine (motor) management like EJS, Hojan, Mustache etc.
*-----------------------------------------------------*/
var Templates = (function () {  

//Content definition component


/*-----------------------------------------------------
*=Var[map_templates]: _map
* Description: Map of templates available for the different engines.
*-----------------------------------------------------*/
var _map = {};

/*-----------------------------------------------------
*=Var[motors_rel]: _motors_rel
* Description: Relationship map between a template and its template engine (motor).
*-----------------------------------------------------*/
var _motors_rel = {};

/*-----------------------------------------------------
*=Var[motors]: _motors
* Description: Available template engines.
*-----------------------------------------------------*/
var _motors = {};

/*-----------------------------------------------------
*=Function[templates_register]: register
* Description: Register template on the map.
*-----------------------------------------------------*/
var register = function (nameMotor, key, body) { 
  let motor = _motors[nameMotor];
  if (!motor) throw `Template engine ${nameMotor} doesn't exist`;
  _map[key] = motor.compile(body);
  _motors_rel[key] = motor;
};

/*-----------------------------------------------------
*=Function[templates_add_motor]: addMotor
* Description: Add motor o template engine.
*-----------------------------------------------------*/
var addMotor = function (motor) { 
  _motors[motor.name] = motor;
};

/*-----------------------------------------------------
*=Function[templates_load_xml]: loadXML
* Description: Load template list from XML file or XMLDocument.
*-----------------------------------------------------*/
var loadXML = function (nameMotor, entry) { 
  let doc = typeof entry == "string" ? RHO.loadSync("XML", entry) : entry instanceof XMLDocument ? entry : null;
  if (!doc) throw `Not a path or XMLDocument`;
  //Cargar documento XML
  let templs = doc.documentElement.getElementsByTagName("Template"), result = [];
  for(let i=0; i<templs.length; i++) {
    let templ = templs[i];
    register(nameMotor, templ.getAttribute("id"), templ.textContent);
    result.push(templ.getAttribute("id"));
  }
  return result;
};

/*-----------------------------------------------------
*=Function[templates_load_json]: loadJSON
* Description: Load template list from JSON file or JSON.
*-----------------------------------------------------*/
var loadJSON = function (nameMotor, entry) { 
  let source = typeof entry == "string" ? RHO.loadSync("JSON", entry) : typeof entry == "object" ? entry : {}, result = [];
  for (let key in source) { 
    register(nameMotor, key, source[key]);
    result.push(key);
  }
  return result;
};

/*-----------------------------------------------------
*=Function[templates_load_txt]: loadTXT
* Description: Load template list from TXT pattern file.
*-----------------------------------------------------*/
var loadTXT = function (nameMotor, body) { 
  //TODO: crear pattern para implementación de fichero
};

/*-----------------------------------------------------
*=Function[templates_render]: render
* Description: Apply or render the template with the specific data.
*-----------------------------------------------------*/
var render = function (key, data) { 
  if (!_map[key]) throw `Template key="${key}" doesn't exist`;
  let motor = _motors_rel[key];
  return motor.render(_map[key], data);
};

/*-----------------------------------------------------
*=Function[templates_apply]: apply
* Description: Apply or render online with the data.
*-----------------------------------------------------*/
var apply = function (source, data, name='Plain') { 
  if (!_motors[name]) throw `Motor template name="${name}" doesn't exist`;
  return _motors[name].render(source, data);
};

/*-----------------------------------------------------
*=Function[templates_apply_plain]: applyPlain
* Description: Apply Plain online with the data.
*-----------------------------------------------------*/
var applyPlain = function (source, data, encode) { 
  return _motors.Plain.render(source, data, encode);
};

/*-----------------------------------------------------
*=Function[templates_exist]: exist
* Description: Validate exist template inis register.
*-----------------------------------------------------*/
var exist = function (source, name='Plain') { 
  return !!_map[source];
};

/*-----------------------------------------------------
*=Class[base_motor]: BaseMotor
* Description: Abstract class for the definition of template engine.
*-----------------------------------------------------*/
class BaseMotor { 

//Constructor BaseMotor
constructor (name) {
  //Properties 
  this.name = name; //Name template engine.
}

//Definitions Get's/Set's
//* Class BaseMotor: Definitions Methods and Static Methods
//Method: compile. Description: Compile with template engine.
compile (key, source){}

//Method: render. Description: Apply or render the template with the specific data.
render (source, data){}

toString() { return "BaseMotor"; }

}

/*-----------------------------------------------------
*=Class[plain_motor]: PlainMotor
* Description: Definition of template plain engine.
*-----------------------------------------------------*/
class PlainMotor extends BaseMotor { 

//Constructor PlainMotor
constructor () {
  super('Plain');
  //Properties 
}

//Definitions Get's/Set's
//* Class PlainMotor: Definitions Methods and Static Methods
//Method: compile. Description: Compile plain engine
compile (body){
  return body;
}

//Method: render. Description: Apply plain engine.
render (source, data, encode=false){
  if (!source || !data) return source;
  return source.replace(/\{\{([\w.\[\]@_=]*)\}\}/g, (str, key) => {
    let v = null;
    if (typeof data == "object" && data.ELEMENT_NODE===undefined) {
      let keys = key.split(".");
      if (keys.length==1) v = data[key];
      else {
        v = data[keys[0]];
        if (v) for (let i = 1; i < keys.length; i++) v = v[keys[i]];
      }
    } 
    else 
      v = key[0]=="@" ? 
        data.getAttribute(key.substr(1)) : 
      key[0]=="*" ? 
        elem.textContent : 
      elem.getElementsByTagName(str) ? 
        elem.getElementsByTagName(str).textContent : "";
    return (typeof v !== "undefined" && v !== null) ? (encode ? encodeURIComponent(v) : v) : "";
  }); 
}

toString() { return "PlainMotor"; }

}

/*-----------------------------------------------------
*=Class[ejs_motor]: EJSMotor
* Description: Definition of template EJS (Embedded JavaScript templating) engine.
*-----------------------------------------------------*/
class EJSMotor extends BaseMotor { 

//Constructor EJSMotor
constructor () {
  super('EJS');
  //Properties 
}

//Definitions Get's/Set's
//* Class EJSMotor: Definitions Methods and Static Methods
//Method: compile. Description: Compile EJS engine
compile (body){
  return EJS.compile(body);
}

//Method: render. Description: Apply EJS engine.
render (execute, data){
  return execute(data);
}

toString() { return "EJSMotor"; }

}

/*-----------------------------------------------------
*=Class[hogan_motor]: HoganMotor
* Description: Definition of template Hogan engine. Hogan is a compiler for the Mustache templating language.
*-----------------------------------------------------*/
class HoganMotor extends BaseMotor { 

//Constructor HoganMotor
constructor () {
  super('Hogan');
  //Properties 
}

//Definitions Get's/Set's
//* Class HoganMotor: Definitions Methods and Static Methods
//Method: compile. Description: Compile Hogan engine
compile (body){
  return Hogan.compile(body);
}

//Method: render. Description: Apply Hogan engine.
render (execute, data){
  return execute.render(data);
}

toString() { return "HoganMotor"; }

}

/*-----------------------------------------------------
*=Class[handlebars_motor]: HandlebarsMotor
* Description: Definition of template Handlebars engine. Hogan is a compiler for the Mustache templating language.
*-----------------------------------------------------*/
class HandlebarsMotor extends BaseMotor { 

//Constructor HandlebarsMotor
constructor () {
  super('Handlebars');
  //Properties 
}

//Definitions Get's/Set's
//* Class HandlebarsMotor: Definitions Methods and Static Methods
//Method: compile. Description: Compile Handlebars engine
compile (body){
  return Handlebars.compile(body);
}

//Method: render. Description: Apply Handlebars engine.
render (execute, data){
  return execute(data);
}

toString() { return "HandlebarsMotor"; }

}



/*-----------------------------------------------------
* Module Initialize: InitTemplates  
*-----------------------------------------------------*/
function InitTemplates() { 
  //Inicializar motortes de templates
  addMotor(new PlainMotor());
  addMotor(new EJSMotor());
  addMotor(new HoganMotor());
  addMotor(new HandlebarsMotor());

}
InitTemplates();

/*-----------------------------------------------------
* Component Definition: Templates  
*-----------------------------------------------------*/
return {
  //Content 
  register: register, //* Type: Function
  addMotor: addMotor, //* Type: Function
  loadXML: loadXML, //* Type: Function
  loadJSON: loadJSON, //* Type: Function
  loadTXT: loadTXT, //* Type: Function
  render: render, //* Type: Function
  apply: apply, //* Type: Function
  applyPlain: applyPlain, //* Type: Function
  exist: exist, //* Type: Function
  BaseMotor: BaseMotor, //* Type: Class
  //Properties 
  //Methods 
  toString: function() { return "Templates"; }
};
})(); 

/*-----------------------------------------------------
*=Component[factory]: Factory
* Description: Factory to render tools (dialog boxes, menus, graphic elements, web pages, containers, components, etc.) based on 'Templates'.
*-----------------------------------------------------*/
var Factory = (function () {  

//Content definition component


/*-----------------------------------------------------
*=Const[factory_error_definition]: errorDefinition
* Description: Error definition.
*-----------------------------------------------------*/
const errorDefinition = (def, name, error) => `Component definition error "${def}". Error: The undefined "${name}" parameter.`+(error? ` Error: ${error}.`:'');

/*-----------------------------------------------------
*=Const[factory_error_create]: errorCreation
* Description: Error creation.
*-----------------------------------------------------*/
const errorCreation = (name, type, error) => `Error creating ${name} component "${type}". Error: ${error.toString()}`;

/*-----------------------------------------------------
*=Const[factory_reserved_words]: RESERVED_WORK
* Description: Reserved words.
*-----------------------------------------------------*/
const RESERVED_WORK = ["isComponent","refDOM","childrenDOM","template","builder","setting","elements","render","bind","execute","on","mapping","redenring","binding","nested","nestedSync"];

/*-----------------------------------------------------
*=Const[factory_valid_component]: validComponent
* Description: Validate component existence with 'type' and 'name'.
*-----------------------------------------------------*/
const validComponent = (type, design) => {
  if (!_components[type]) throw new Error(`There is no defined component named "${type}"`);
  let builder = _components[type][design];
  if (!builder) throw new Error(`In component type "${type}", "${design}" is not defined.`);
  return builder;    
};

/*-----------------------------------------------------
*=Var[factory_components]: _components
* Description: Available components.
*-----------------------------------------------------*/
var _components = {};

/*-----------------------------------------------------
*=Function[factory_get_params]: getParams
* Description: Get list parameters (name and value).
*-----------------------------------------------------*/
var getParams = function (str) { 
  let result = {};
  try {
    str.split(";").forEach(field =>{
      let index = field.indexOf("=");
      if (index==-1) throw 'Parameter error: ${field}';
      let name = field.substr(0, index).trim();
      result[name] = field.substr(index+1).trim();
    });
  }
  catch(e){ throw new Error(errorDefinition('Parameters', str, e)); }
  return result;
};

/*-----------------------------------------------------
*=Class[factory_component_base]: ComponentBase
* Description: Abstract class to define components based on 'Templates'.
*-----------------------------------------------------*/
class ComponentBase { 

//Constructor ComponentBase
constructor () {
  //Properties 
  this.id = null; //A new identifier is generated when the component is redeployed.
  this.template = null; //Tamplate name.
  this.builder = null; //Reference a builder component.  
  this._settings = null;
  this.refDOM = null; //Reference to the rendered DOM element.
  this.childrenDOM = null; //List of elements defined with 'key' in the Template.
  this.on = {}; //Object to define list of template events.
  this.attrs = null; //Modify attributes of childrenDOM before binding elements.
  this.info = null; //Reference to the associated information by default.
  this.mapping = null; //Mapping between template elements and nested components.
  this.nested = {}; //Reference to nested components.
  this.nestedSync = true; //Render nested elements asynchronously.
  this.rendering = null; //Save the component rendering and you are ready to apply the 'bind' function.
  this.binding = {}; //Binding between template childs and nested components.
  this.visible = true; //Show component.
}

//Definitions Get's/Set's  
get isComponent() { return true; }
  
get settings() { return this._settings; }  
set settings(value) { 
  //Agregar elementos al componente pero validar que no sean palabras reservadas
  if (typeof value != "object") return;
  this._settings = value;  
  for (let name in this._settings)
    if (RHO.Factory.RESERVED_WORK.indexOf(name)==-1 && !this[name]) this[name] = this._settings[name];
   }

//* Class ComponentBase: Definitions Methods and Static Methods
//Method: messageError. Description: Error in component.
messageError (name, type, error){
  return `<div crho="RhoError" class="alert alert-danger" role="alert">Error ${name} in component "${type}". Error: ${error.toString()}</div>`;
}

//Method: setDOMAttributes. Description: Apply attribute change to component elements.
setDOMAttributes (entry, values){
  //Función para modificar atributos de un elemento DOM del componente
  const setAttributes = (element, attrs) => {
    if (!element) return;
    for(let name in attrs) {
      let value = attrs[name];
      switch(name){
        case "class": case "removeClass":
          let list = value.split(" ");
          list.forEach(s => element.classList[name=="class"? "add":"remove"](s)); 
          break;
        default: element.setAttribute(name, value);
      }
    }
  };
  //Determinar el tipo de entrada
  if (typeof entry == "string") {
    if (entry=="*") setAttributes(this.refDOM, values);
    else if (this.childrenDOM[entry]) setAttributes(this.childrenDOM[entry], values);
    else throw new Error(`There is no keyed item "${entry}" in "${this.type}".`); 
  }
  else if (typeof entry == "object")
  	for (let name in entry) {
      if (name=="*") setAttributes(this.refDOM, entry[name]);
      else if (this.childrenDOM[name]) setAttributes(this.childrenDOM[name], entry[name]);
      else throw new Error(`There is no keyed item "${name}" in "${this.type}".`);
    }
}

//Method: render. Description: Render a component.
render (settings){
  if (settings) this.settings = settings;
  try {
    //Generar identificador
    if (!this.id) this.id = genId(this.template.replace(/[.]/g,'_'));
    
    //Renderizar elementos anidados
    if (this.mappings){
      this.bindings = {};
      for (let key in this.mappings){
        let map = this[key];
        //Si el elemento es un Array 
        if (Array.isArray(map)){
          this.bindings[key] = [];
          map.forEach( item => {
            if(this.info) item.info = this.info; 
            this.bindings[key].push(item.render(settings));
          });
        }
        //Si el elemento es un Component Object 
        else if (typeof map=="object" && map.isComponent) {
          if(this.info) map.info = this.info;
          this.bindings[key] = map.render(settings);
        }
        //Si el elemento es un Map
        else {
          let mapRendering = {};
          for (let index in map) {
            if(this.info) map[index].info = this.info; 
            mapRendering[index] = map[index].render(settings);
          };
          this.bindings[key] = mapRendering;
        }
      }
    }
    //Ejecutar evento antes de renderizar
    if (typeof this.onRender=="function") this.onRender();
    
    //Renderizar herramienta
    this.rendering = RHO.Templates.render(this.template, this);
  }
  catch(e) { 
    console.error(e);
    this.rendering = this.messageError("RENDER", this.template, e);
  }
  //Retornar resultado
  return this.rendering;
}

//Method: bind. Description: Bind a component.
bind (container){
  if (!this.rendering) throw new Error(`Error rendering component'${this.template}' or the rendering was not done`);
  if (!container) container = document.body;
  
  //Crear elemento
  let tmp = document.createElement("div"), node;
  tmp.innerHTML = this.rendering.trim();
  this.refDOM = tmp.firstChild;
  while(tmp.children.length>0) {
    node = tmp.children.item(0);
    if (node.id==this.id) this.refDOM = node;
    container.appendChild(tmp.children.item(0));
  }
  
  //Hay error en la renderización
  if (this.refDOM.getAttribute("crho")=="RhoError") return this.refDOM;

  this.refDOM.component = this; 
  try {
    //Obtener lista de elementos hijos DOM
    let arrayInit = [];  
    this.childrenDOM = {};
    this.builder.keys.forEach(key => {
      let element = this.refDOM.querySelector(`[key=${key}]`);
      if (element) {
        element.component = this;
        element.refDOM = this.refDOM;
      }
      arrayInit.push(element);
      //Enlazar eventos al elemento
      if (this.on[key])
        for (let name in this.on[key]) {
          try{ eval(`element[name] = function(event){ this.component.on.${key}.${name}(event, this.component); }`); }
          catch(e) { throw new Error(`Error creating event ${this.type}.on.${key}.${name}`); }
        }
      //Agregar elemento DOM
      this.childrenDOM[key] = element;
    });
    
    //Actualizar atributos 
    if (this.attrs) this.setDOMAttributes(this.attrs);

    //Ejecutar función de inicialización
    if (this.init) this.init(arrayInit);

    //Renderización de elementos anidados
    if (this.bindings) {
      this.nested = {};
      for (let bkey in this.bindings) {
        let map = this[bkey], key = this.mappings[bkey], nestedContainer = key=="*" ? this.refDOM : this.childrenDOM[key];
        if (Array.isArray(map))
          map.forEach((item, index) => {
            this.nested[item.id] = item;
            //Renderizar de forma sincrónica o asincrónica
            if (item.nestedSync) item.bind(nestedContainer, this.bindings[bkey][index]);
            else setTimeout( () => item.bind(nestedContainer, this.bindings[bkey][index]), 10);
          });
        else if (typeof map=="object" && map.isComponent){
          this.nested[map.id] = map;
          //Renderizar de forma sincrónica o asincrónica
          if (map.nestedSync) map.bind(nestedContainer, this.bindings[bkey]);
          else setTimeout( () => map.bind(nestedContainer, this.bindings[bkey]), 10);
        }
        else
          for (let index in map) {
            let item = map[index];
            this.nested[item.id] = item;
            if (item.nestedSync) item.bind(nestedContainer, this.bindings[bkey][index]);
            else setTimeout( () => item.bind(nestedContainer, this.bindings[bkey][index]), 10);
          }
      }
    }
    
    //Crear eventos en el refDOM 
    for (let name in this.on)
      this.refDOM.addEventListener(name, function(event) {
        if (this.component.on && this.component.on[event.type]) {
          let fevent = this.component.on[event.type]; 
          eval(`${fevent}(event, this.component)`)
        } 
      });
    
    //Visibilidad
    if (typeof this.visible=="boolean" && this.visible===false) this.hide();
    
    //Ejecutar evento de después de enlazar ref, elements, container
    if (typeof this.onBind=="function") this.onBind(this.refDOM, this.childrenDOM, container);
  }
  catch(e) { 
    let error = document.createElement("div");
    error.innerHTML = this.messageError("BIND", this.template, e);
    this.refDOM.appendChild(error.firstChild);
  }
  
  //Retornar resultado
  return this.refDOM;
}

//Method: renderAndBind. Description: Execute render a bind functions.
renderAndBind (settings, container){
  //Renderizar y enlazar
  this.render(settings);
  return this.bind(container);
}

//Method: destroy. Description: Remove DOM element from page.
destroy (){
  //Eliminar contenedor
  if (this.refDOM) this.refDOM.remove();
}

//Method: show. Description: Show element.
show (){
  this.refDOM.style.display = null;
  return this;
}

//Method: hide. Description: Hide element.
hide (){
  this.refDOM.style.display = "none";
  return this;
}

toString() { return "ComponentBase"; }

}

/*-----------------------------------------------------
*=Class[factory_component_builder]: ComponentBuilder
* Description: Tool builder based on a definition of templates and events.
*-----------------------------------------------------*/
class ComponentBuilder { 

//Constructor ComponentBuilder
constructor (def, source) {
  //Properties 
  this.key = def; //Key tool.
  this.type = null; //Class name the tool.
  this.refClass = null; //Reference class the tool.
  this.design = null; // Design component.
  this.template = null; //Template name.
  this.init = null; //Init function.
  this.methods = {}; //Methods list.
  this.events = {}; //Events list.
  this.keys = []; //Keys defined in the component.
  //* Initialize class 
  let params = getParams(this.key), 
      body = RegExpStartEnd(`[#(RHO_COMPONENT:${this.key})]`, `[(RHO_COMPONENT)]`, source, false);
  if (!body) throw new Error(errorDefinition(this.def, 'Body'));
  this.init = RegExpStartEnd(`[#(INIT)]`, `[(INIT)]`, source, false);
  this.defineType(params);
  this.defineDesign(params);
  this.defineTemplate(params, body);
  this.defineMethods(body);
  this.defineEvents(body);
  //* End Initialize
}

//Definitions Get's/Set's
//* Class ComponentBuilder: Definitions Methods and Static Methods
//Method: defineType. Description: Obtain and validate type and class of the parameters..
defineType (params){
  //Validar type
  if (!params.Type) throw new Error(errorDefinition(this.def, 'Type'));
  //Obtener redferencia a objeto
  this.type = params.Type;
  this.type.split(".").forEach(s => {
    this.refClass = this.refClass ? this.refClass[s] : window[s];
    if (!this.refClass) throw new Error(errorDefinition(this.def, this.type));
  });
}

//Method: defineDesign. Description: Obtain and validate design of the parameters.
defineDesign (params){
  if (!params.Design) params.Design = "Basic";
  this.design = params.Design;
}

//Method: defineTemplate. Description: Obtain and validate template of the parameters.
defineTemplate (params, body){
  //Obtener plantilla
  let vals = [body.indexOf('[#(INIT'), body.indexOf('[#(METHOD'), body.indexOf('[#(EVENT')],
      index = Infinity; 
  vals.forEach(i => { if (i>0) index = Math.min(index,i); });
  //Obtener nombre y cuerpo de la plantilla
  let tmpl = index==Infinity ? body : body.substr(0, index);
  this.template = `${this.type}.${this.design}`;
  //Registrar template
  RHO.Templates.register(params.Template || 'Plain', this.template, tmpl);
  //Obtener keys de elementos definidos en la plantilla
  let reg = new RegExp(`(?<= key=")[a-zA-Z\d]*?(?=")|(?<= key=')[a-zA-Z\d]*?(?=')`, 'g');
  tmpl.replace(reg, (str) => this.keys.push(str));
}

//Method: defineMethods. Description: Get methods list from the component.
defineMethods (body){
  let list = RegExpStartEnd(`[#(METHOD:`, `)]`, body);
  //Obtener lista de eventos
  if (!list) return;
  list.forEach(str => {
    let params = getParams(str);
    if (!params.Name) throw new Error(errorDefinition(params, 'Method'));
    this.methods[params.Name] = {
      args: params.Arguments || "",
      body: RegExpStartEnd(`[#(METHOD:${str})]`, `[(METHOD)]`, body, false)
    };
  });
}

//Method: defineEvents. Description: Get events list from the component.
defineEvents (body){
  let list = RegExpStartEnd(`[#(EVENT:`, `)]`, body);
  //Obtener lista de eventos
  if (!list) return;
  list.forEach(str => {
    let params = getParams(str);
    if (!params.Key || !params.Name) throw new Error(errorDefinition(params, 'Event'));
    if (!this.events[params.Key]) this.events[params.Key] = {};
    this.events[params.Key][params.Name] = RegExpStartEnd(`[#(EVENT:${str})]`, `[(EVENT)]`, body, false);
  });
}

//Method: associate. Description: Associate elements to new component.
associate (newComp){
  //Asociar template y builder
  newComp.template = this.template;
  newComp.builder = this;
  
  //Crear función de inicio
  if (this.init)
    try { eval(`newComp.init = function([${this.keys.toString()}]) { ${this.init} }`); }
    catch(e) { throw new Error( errorCreation('init', this.type, e) ); }  
  
  //Crear lista de métodos
  for (let name in this.methods){
    let method = this.methods[name];
    try { eval(`newComp['${name}'] = function(${method.args}) { ${method.body} }`); }
    catch(e) { throw new Error( errorCreation('method', this.type, e) ); } 
  }
  
  //Crear lista de eventos
  for (let key in this.events){
    let element = this.events[key];
    if (!newComp.on[key]) newComp.on[key] = {};
    for (let name in element)
    	try { eval(`newComp.on['${key}']['${name}'] = function(event) { ${element[name]} }`); }
    	catch(e) { throw new Error( errorCreation('event', this.type, e) ); }
  }
  return newComp;
}

//Method: create. Description: Create tool.
create (settings){
  return this.associate(new this.refClass(settings));
}

toString() { return "ComponentBuilder"; }

}

/*-----------------------------------------------------
*=Object[component]: Component
* Description: Administration of components.
*-----------------------------------------------------*/
var Component = {};

//* Object Component: Definitions Properties 

//* Object Component: Definitions Methods 
//register: Register tool and append in _components.
Component.register = function(source){
  //Cargar lista de estilos a la página web
  let styles = RegExpStartEnd(`[#(RHO_STYLES:`, `)]`, source);
  styles.forEach(name => { 
    let id = `styles_${name.trim()}`;
    if (document.getElementById(id)) document.getElementById(id).remove();
    let node = document.createElement("style");
    node.id = id;
    node.textContent = RegExpStartEnd(`[#(RHO_STYLES:${name})]`, `[(RHO_STYLES)]`, source, false);
    document.body.appendChild(node);
  });

  //Cargar componentes del source
  let defs = RegExpStartEnd(`[#(RHO_COMPONENT:`, `)]`, source);
  if (!defs) throw new Error(`There are no component definitions. Source: \n${source}`); 
  defs.forEach(def =>  {
    let builder = new ComponentBuilder(def, source);
    if (!_components[builder.type]) _components[builder.type] = {};
    if (_components[builder.type][builder.design]) console.log(`The '${builder.key}' component is overwritten.`);
    _components[builder.type][builder.design] = builder;
  });
};

//create: Create a new component.
Component.create = function(type, design, settings){
  let builder = validComponent(type, design);
  return builder.create(settings);
};

//associate: Associate elements to external component.
Component.associate = function(type, design, newComp){
  let builder = validComponent(type, design);
  return builder.associate(newComp);
};

//exist: Exist component by 'type' y 'name'.
Component.exist = function(type, design){
  return _components[type]!=null && _components[type][design]!=null;
};





/*-----------------------------------------------------
* Module Initialize: Components  
*-----------------------------------------------------*/
function Components() { 
  //Code init component

}
Components();

/*-----------------------------------------------------
* Component Definition: Factory  
*-----------------------------------------------------*/
return {
  //Content 
  RESERVED_WORK: RESERVED_WORK, //* Type: Const
  ComponentBase: ComponentBase, //* Type: Class
  Component: Component, //* Type: Object
  //Properties 
  //Methods 
  toString: function() { return "Factory"; }
};
})(); 

/*-----------------------------------------------------
*=Component[ds]: DS
* Description: Definition and registration the data source
*-----------------------------------------------------*/
var DS = (function () {  

//Content definition component


/*-----------------------------------------------------
*=Var[map_ds]: _map
* Description: Map of data sources
*-----------------------------------------------------*/
var _map = {};

/*-----------------------------------------------------
*=Function[eval_json]: evalJSON
* Description: Evaluate a field in JSON
*-----------------------------------------------------*/
var evalJSON = function (ref, selector) { 
  try {
    let result = ref, s = selector.split(".");
    for(let i=0; i<s.length; i++){
      result = result[s[i]];
      if (!result) break;
    } 
    return result; 
  } catch(e) { console.error(`Error in evaluate JSON selector="${selector}".`, e.toString(), ref); }
  return null;
};

/*-----------------------------------------------------
*=Class[source]: Source
* Description: Abstract class for the definition of Data Sources
*-----------------------------------------------------*/
class Source { 

//Constructor Source
constructor (alias, doc, type) {
  //Properties 
  this.doc = doc; //Reference document data source
  this.alias = alias; //Document name
  this.type = type; //Type of data source (XML, JSON, TXT)
}

//Definitions Get's/Set's
//* Class Source: Definitions Methods and Static Methods
toString() { return "Source"; }

}

/*-----------------------------------------------------
*=Class[source_json]: SourceJSON
* Description: JSON written data source
*-----------------------------------------------------*/
class SourceJSON extends Source { 

//Constructor SourceJSON
constructor (alias, doc, data) {
  super(alias, (typeof doc == 'string') ? loadSync('JSON', doc, data) : doc, 'JSON');
  //Properties 
}

//Definitions Get's/Set's
//* Class SourceJSON: Definitions Methods and Static Methods
//Method: load. Description: Create the AJAX request and load the JSON document and store in 'doc'
load (doc, data){
  if (typeof doc == "string") return loadSync("JSON", doc, data);
  return doc;
}

//Method: get. Description: Get information from the JSON object
get (selector){return evalJSON(this.doc, selector);}

toString() { return "SourceJSON"; }

}

/*-----------------------------------------------------
*=Class[source_xml]: SourceXML
* Description: XML written data source
*-----------------------------------------------------*/
class SourceXML extends Source { 

//Constructor SourceXML
constructor (alias, doc, data) {
  super(alias, this.load(doc, data), 'XML');
  //Properties 
  this.root = this.doc ? this.doc.documentElement:null; //XML root element
}

//Definitions Get's/Set's
//* Class SourceXML: Definitions Methods and Static Methods
//Method: load. Description: Create the AJAX request and load the XML document and store in 'doc'
load (doc, data){
  if (typeof doc == "string") return loadSync("XML", doc, data);
  return doc;
}

//Method: get. Description: Get information from the XML document
get (selector){
  return this.root.querySelector(selector);
}

toString() { return "SourceXML"; }

}

/*-----------------------------------------------------
*=Class[source_txt]: SourceTXT
* Description: TXT written data source
*-----------------------------------------------------*/
class SourceTXT extends Source { 

//Constructor SourceTXT
constructor (alias, doc) {
  super(alias, doc, 'TXT');
  //Properties 
}

//Definitions Get's/Set's
//* Class SourceTXT: Definitions Methods and Static Methods
//Method: load. Description: Create the AJAX request and load the TXT content and store in 'doc'
load (doc, data){
  return loadSync("TXT", doc, data);
}

//Method: get. Description: Get information from the TXT document
get (value){
  return this.doc;
}

toString() { return "SourceTXT"; }

}

/*-----------------------------------------------------
*=Function[register_source]: registerSource
* Description: Register Data Source XML, JSON, TXT on the map
*-----------------------------------------------------*/
var registerSource = function (type, alias, doc, data) { 
  type = type.toUpperCase();
  if (_map[alias]) console.log(`Data source "${type}" "${alias}" registered. It will be overwritten.`);

  //Registrar data XML
  switch(type){
    case "XML": _map[alias] = new SourceXML(alias, doc, data); break;
    case "JSON": _map[alias] = new SourceJSON(alias, doc, data); break;
    case "TXT": _map[alias] = new SourceTXT(alias, doc, data); break;
    default: throw new Error(`Data type "${type}" not proccssed.`);
  }
  return _map[alias];
};

/*-----------------------------------------------------
*=Function[get_source]: getSource
* Description: Get a registered data source
*-----------------------------------------------------*/
var getSource = function (alias) { 
  if (typeof alias!="string") return null;
  let source = _map[alias];
  if (source==null) throw new Error(`No exist Source "${alias}".`);
  return source;
};

/*-----------------------------------------------------
*=Class[data]: Data
* Description: Abstract class for data management
*-----------------------------------------------------*/
class Data { 

//Constructor Data
constructor (alias, selector) {
  //Properties 
  this._source = getSource(alias); //Reference to data source
  this.selector = selector; //Field selector
  this.ref = this._source!=null ? this._source.get(selector) : alias; //Reference to an information
}

//Definitions Get's/Set's
//* Class Data: Definitions Methods and Static Methods
toString() { return "Data"; }

}

/*-----------------------------------------------------
*=Class[data_json]: DataJSON
* Description: Information management of a JSON data source
*-----------------------------------------------------*/
class DataJSON extends Data { 

//Constructor DataJSON
constructor (alias, selector) {
  super(alias, selector);
  //Properties 
}

//Definitions Get's/Set's
//* Class DataJSON: Definitions Methods and Static Methods
//Method: get. Description: Get reference to JSON property
get (selector){
  return evalJSON(this.ref, selector);
}

//Method: set. Description: Save information in JSON property
set (value, field){
  try {
    if (field){
      let s = field.split(".");
      if (s.length==1) {
        if (value!==null) this.ref[field] = value;
        else delete this.ref[field];
      }
      else {
        let result = this.ref;
        s.forEach(i => { result = result[i]; });
        if (value!==null) result[s.length-1] = value;
        else delete result[s.length-1];
      }
    }
    else this.ref = value;
    return value;
  }
  catch(e) { console.error(`Error set data selector "${field}". Message: ${e.toString()}.`); }
}

//Method: getRef. Description: Get the reference value
getRef (){
  return typeof this.ref=="object" ? JSON.stringify(this.ref) : this.ref;
}

toString() { return "DataJSON"; }

}

/*-----------------------------------------------------
*=Class[data_xml]: DataXML
* Description: Information management of a XML data source
*-----------------------------------------------------*/
class DataXML extends Data { 

//Constructor DataXML
constructor (alias, selector) {
  super(alias, selector);
  //Properties 
}

//Definitions Get's/Set's
//* Class DataXML: Definitions Methods and Static Methods
//Method: get. Description: Get reference to XML element
get (selector){
  let items = selector.split("@");
  if (items.length==1) return this.ref.querySelector(selector);
  else if (items.length==2){
    let element = items[0]=="" ? this.ref : this.ref.querySelector(items[0]);
    if (items[1]=="*") return this.ref.textContent;
    return this.ref.getAttribute(items[1]);
  }
  return null;
}

//Method: set. Description: Save information in XML element
set (value, selector){
  try {
    let items = selector.split("@");
    if (items.length==1) this.ref.textContent = value;
    else if (items.length==2){
      let element = items[0]=="" ? this.ref : this.ref.querySelector(items[0]);
      if (items[1]=="*") this.ref.textContent = value;
      else this.ref.setAttribute(items[1], value);
    }
    return value;
  }
  catch(e) { console.error(`Error set data selector "${field}". Message: ${e.toString()}.`); }
}

//Method: getRef. Description: Get the reference value
getRef (){
  return this.ref.outerHTML;
}

toString() { return "DataXML"; }

}

/*-----------------------------------------------------
*=Class[data_txt]: DataTXT
* Description: Information management of a TXT data source
*-----------------------------------------------------*/
class DataTXT extends Data { 

//Constructor DataTXT
constructor (name, ref, config) {
  super(name, ref, 'TXT');
  //Properties 
  this.name = null; //Name selector
  this.pattern = null; //Search pattern in TXT data source
  //* Initialize class 
  //Manejo de errores
  if (!config) throw new Error(`There is no "pattern" definition for ${this.toString()}.`);
  if (!config.name || !config.start || !config.end) throw new Error(`Specification of the wrong pattern in ${this.toString()}. It is mandatory to define the fields: "name", "start" and "end".`);
  //Procesamiento del patrón
  if (!(new RegExp(/\w+$/).test(config.name))) throw new Error(`The field "name" error in the ${this.toString()} pattern. It must be [a-zA-Z0-9_].`);
  this.name = config.name;
  this.pattern = `(?<=${patternSpecials(config.start)})[\\s\\S]*?(?=${patternSpecials(config.end)})`;
  //* End Initialize
}

//Definitions Get's/Set's
//* Class DataTXT: Definitions Methods and Static Methods
//Method: get. Description: Get reference to TXT information
get (selector){
  let reg = new RegExp(this.pattern, "g"),
      result = reg.exec(this.ref);
  return result && result[0];
}

//Method: set. Description: Save information in TXT information
set (value, selector){
  try {
    //TODO: Por implementar
    return value;
  }
  catch(e) { console.error(`Error set data selector "${field}". Message: ${e.toString()}.`); }
}

//Method: getRef. Description: Get the reference value
getRef (){
  return this.ref;
}

toString() { return "DataTXT"; }

}

/*-----------------------------------------------------
*=Class[data_manager]: DataManager
* Description: Data source manager
*-----------------------------------------------------*/
class DataManager { 

//Constructor DataManager
constructor (list) {
  //Properties 
  this.data = this.init(list); //Referencia the data manager
}

//Definitions Get's/Set's
//* Class DataManager: Definitions Methods and Static Methods
//Method: init. Description: Initialize data source manager
init (list){
  for(let key in list){
    let item = list[key];
    this.create(key, item.alias, item.selector, item.config);
  }
  return list;
}

//Method: create. Description: Create Data Source XML, JSON and TXT
create (key, alias, selector, config){
  let source = getSource(alias), data = null;
  //Crear data
  switch(source.type){
    case "XML": data = new DataXML(alias, selector); break;
    case "JSON": data = new DataJSON(alias, selector); break;
    case "TXT": data = new DataTXT(alias, selector, config); break;
  }
  //Register data
  this[key] = data;
}

//Method: createByType. Description: Create Data Source by type (XML, JSON, TXT)
createByType (key, type, ref, selector){
  let data = null;
  //Crear data
  switch(type){
    case "XML": data = new DataXML(ref, selector); break;
    case "JSON": data = new DataJSON(ref, selector); break;
    case "TXT": data = new DataXTX(ref, selector); break;
  }
  //Register data
  this[key] = data;
}

//Method: setValue. Description: Set value in a data source
setValue (source, value){
  //Determinar el campo actual
  if (typeof source != "string" || source.indexOf("{[")!=0 || source.indexOf("]}")!=source.length-2) return value;
  if (typeof value == "string" && value.indexOf("{[")==0 && value.indexOf("]}")==value.length-2) return value;
  //Guardar en fuente de datos
  let ks = source.substr(2,source.length-4).split(":"), data = this[ks[0]];
  if (data==null) throw new Error(`No source exists with alias: "${ks[0]}".`);
  data.set(value, ks[1]);
  return source;
}

//Method: apply. Description: Apply templates on data sources
apply (source){
  if (typeof source != "string") return source;
  let _getData = (body) => {
        let ks = body.split(":"), data = this[ks[0]];
        if (data)
          switch(ks.length){
            case 1: return data.getRef(); 
            case 2: return data.get(ks[1]);
          }
        return null;
      };
  //Formato para aplicar fuentes de datos: {[key[:selector]]}
  if (source.indexOf("{[")==0 && source.indexOf("]}")==source.length-2) 
    return _getData(source.substr(2,source.length-4));
  //Formato para aplicar fuentes de datos: {{key[:selector]}}
  return source.replace(/\{\{([\w\d$#!:\-_\*\.@]*)\}\}/g, (str, body) => _getData(body));  
}

toString() { return "DataManager"; }

}

/*-----------------------------------------------------
*=Class[rest_client]: RESTClient
* Description: REST Rho Client
*-----------------------------------------------------*/
class RESTClient { 

//Constructor RESTClient
constructor (url, token) {
  //Properties 
  this.url = url; //Url where the REST service is defined.
  this.token = token; //Token definition for the REST request.
}

//Definitions Get's/Set's
//* Class RESTClient: Definitions Methods and Static Methods
//Method: toQueryString. Description: Convert object params to query string.
toQueryString (query){
  return typeof query=="object" ? "?" + Object.entries(query).map(([k,v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&') : "";
}

//Method: toBodyString. Description: Convert request body to string.
toBodyString (body){
  return typeof body=="object" ? JSON.stringify(body) : typeof body== "string" ? body : null;
}

//Method: createXHR. Description: Create XHR.
createXHR (method, path, query, isAsync){
  //Crear petición AJAX
  let xhr = new XMLHttpRequest();
  xhr.open(method, `${this.url}${path}/${this.toQueryString(query)}`, isAsync); 
  xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
  if (this.token) xhr.setRequestHeader("token", this.token);
  return xhr;
}

//Method: sync. Description: Synchronous REST request.
sync (method, path, query, body){
  let xhr = this. createXHR(method, path, query, false);
  //Envió de petición
  xhr.send(this.toBodyString(body));
  //Procesamiento de la respuesta
  switch(xhr.status){
    case 200: return JSON.parse(xhr.responseText);
    case 400:
      let error = JSON.parse(xhr.responseText);
      throw new Error(error.message);
    default : throw new Error(xhr.responseText);
  }
}

//Method: async. Description: Asynchronous REST request.
async (method, path, ref, query, body){
  //Crear petición AJAX
  let xhr = this.createXHR(method, path, query, true);
  xhr.onreadystatechange = function (e) {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      let error = null;
      switch(xhr.status){
        case 200: 
          if (typeof ref.onDone == "function") ref.onDone(JSON.parse(xhr.responseText));
          else error = "OnDone event was not defined.";
          break;
        case 400: error = JSON.parse(xhr.responseText).message; break;
        default : error = xhr.responseText;
      }
      if (typeof ref.onError == "function") ref.onError(error);	
      else throw new Error("OnError event was not defined.");
    }
  };
  xhr.send(this.toBodyString(body));  
}

//Method: login. Description: Login and set the working token.
login (path, user, password){
  let result = this.sync("POST", path, {User: user, Password: password});
  this.token = result.Token;
}

toString() { return "RESTClient"; }

}



/*-----------------------------------------------------
* Module Initialize: InitDS  
*-----------------------------------------------------*/
function InitDS() { 
  //TODO: por hacer

}
InitDS();

/*-----------------------------------------------------
* Component Definition: DS  
*-----------------------------------------------------*/
return {
  //Content 
  registerSource: registerSource, //* Type: Function
  getSource: getSource, //* Type: Function
  DataManager: DataManager, //* Type: Class
  RESTClient: RESTClient, //* Type: Class
  //Properties 
  //Methods 
  toString: function() { return "DS"; }
};
})(); 

/*-----------------------------------------------------
*=Component[jsondsl]: JSONDSL
* Description: Definition and registration of a JSON language (JSON-based grammars)
*-----------------------------------------------------*/
var JSONDSL = (function () {  

//Content definition component


/*-----------------------------------------------------
*=Enum[element_type]: ElementType
* Description: Element Type (Array, Object, Map)
*-----------------------------------------------------*/
var ElementType = {};
Object.defineProperty(ElementType, "Object", {enumerable: true, writable: false, value: 'Object'});
Object.defineProperty(ElementType, "Array", {enumerable: true, writable: false, value: 'Array'});
Object.defineProperty(ElementType, "Map", {enumerable: true, writable: false, value: 'Map'});

/*-----------------------------------------------------
*=Class[property]: Property
* Description: Administration the property of language element
*-----------------------------------------------------*/
class Property { 

//Constructor Property
constructor (_name, STRUCT, _element) {
  //Properties 
  this._name = _name; //Property Name
  this._stop = STRUCT.STOP ? STRUCT.STOP : false; //Flag to stop the execution of a program
  this._hasValid = STRUCT.VALID ? STRUCT.VALID : false; //Validates the existence of a property
  this._element = _element; //Reference to its parent element
}

//Definitions Get's/Set's
get name() { return this._name; } 
get stop() { return this._stop; } 
get hasValid() { return this._hasValid; } 
get element() { return this._element; } 
//* Class Property: Definitions Methods and Static Methods
//Method: valid. Description: Validate the property element
valid (element){
  //Validar propiedad
  try{ 
    if (this.hasValid) return element[this.name]; 
  }
  catch(e){ 
    DEBUG(this.toString() + ": Valid attibute '"+this.name+"'. ", e); 
    if (this.stop) {
      e.message = "Stop program element key='"+this.element.key+"' by error property element. "+e.message;
      throw e;
    }
  }
}

toString() { return "Property"; }

}

/*-----------------------------------------------------
*=Class[child]: Child
* Description: Administration the child of element
*-----------------------------------------------------*/
class Child { 

//Constructor Child
constructor (key, STRUCT, element) {
  //Properties 
  this.key = key; //Element Identifier
  this.type = STRUCT.TYPE; //Element type
  this.keyRef = STRUCT.KEY_REF; //Por type Object, Array and Map it refers to field dodne defines the key of the class to create.
  this.required = STRUCT.REQUIRED ? STRUCT.REQUIRED : false; //It determines that the property is required element
  this.stop = STRUCT.STOP ? STRUCT.STOP : false; //Flag to stop the execution of a program
  this.element = element; //Element definition reference
}

//Definitions Get's/Set's
//* Class Child: Definitions Methods and Static Methods
//Method: valid. Description: Validate the child element
valid (ref){
  //Validar elemento hijo
  try{
    if (this.required && ref[this.key]==null) 
      throw new Error(`Required element from key="${this.key}."`); 
  }
  catch(e){ 
    DEBUG(`${this.toString()}: Valid element "${this.key}".`, e); 
    if (this.stop) {
      e.message = "Stop program element key='"+this.element.name+"' by error child element. "+e.message;
      throw e;
    }
  }
}

toString() { return "Child"; }

}

/*-----------------------------------------------------
*=Class[element]: Element
* Description: Abstract element of a Rho language
*-----------------------------------------------------*/
class Element { 

//Constructor Element
constructor (language, key, STRUCT) {
  //Properties 
  this.language = language; //Reference to JSON-based DSL
  this.key = key; //Key of Rho element
  this.STRUCT = STRUCT; //Element structure
  this.nameClass = STRUCT.CLASS; //Associated class name
  this.properties = {}; //List of properties defined in the class
  this.children = {}; //Rho child elements
}

//Definitions Get's/Set's
//* Class Element: Definitions Methods and Static Methods
//Method: hasChild. Description: Check if you have a child element
hasChild (name){
  return this.children[name]!=null;
}

//Method: getChild. Description: Get a child element
getChild (name){
  return this.children[name];
}

//Method: compile. Description: Compile element of the JSON-based DSL
compile (){
  //Obtener elementos hijos
  for(let key in this.STRUCT.CHILDREN){
    let child = this.STRUCT.CHILDREN[key], element = null;
    if (typeof child.KEY == "string") element = this.language.getElement(child.KEY);
    else if (Array.isArray(child.KEY)){
      element = {};
      child.KEY.forEach(name => { element[name] = this.language.getElement(name); });
    }
    this.children[key] = new Child(key, child, element);
  } 
  
  //Obtener propiedades
  for(let name in this.STRUCT.PROPERTIES) 
    this.properties[name] = new Property(name, this.STRUCT.PROPERTIES[name] || {}, this);
}

//Method: create. Description: Create a new Rho element
create (ref, parent, context, key){
  //Validar elementos
  for (let key in this.children) this.children[key].valid(ref);
  
  //Crear intancia de elemento
  let newElement = eval(`new ${this.nameClass}(this, parent, ref)`);
  newElement.init(context, key);
  
  //Validar atributos
  for(let name in this.properties) this.properties[name].valid(newElement, context);
  
  return newElement;
}

//Method: createChild. Description: Create child Rho element
createChild (name, ref, parent, context){
  let def = this.children[name], newChild = null;
  let createElement = (element, language, index) => {
    let result;
    if (def.keyRef){
      let keyRef = element[def.keyRef], refElement = def.element[keyRef];
      if (refElement) result = refElement.create(element, parent, context, index);
      else throw new Error(`It doesn't exist in the grammar KeyRho="${keyRef}".`);
    } 
    else if (def.element) result = def.element.create(element, parent, context, index);
    else {
      let defElement = language.getElement(element.key);
      if (defElement) result = defElement.create(element, parent, context, index);
      else throw new Error(`It doesn't exist in the grammar KeyRho="${element.key}".`);
    }
    return result;
  };
  
  //Determinar tipo de dato
  if (def.type==ElementType.Object) {
    if (typeof ref=="object")
      newChild = createElement(ref, this.language);
    else 
      throw new Error(`Error create child name "${name}" is not Object in parent key="${this.key}".`);
  }
  else if (def.type==ElementType.Array){
    newChild = [];
    if (Array.isArray(ref)) 
      ref.forEach((ref, i) => {
        let item = createElement(ref, this.language, i);
        if (item) newChild.push(item);
      });
    else 
      throw new Error(`Error create child name "${name}" is not Array in parent key="${this.key}".`);
  }
  else if (def.type==ElementType.Map){
    newChild = {};
    if (typeof ref == "object") 
      for (let key in ref) {
        let item = createElement(ref[key], this.language, key);
        if (item) newChild[key] = item;
      }
    else 
      throw new Error(`Error create child name "${name}" is not Map in parent key="${this.key}".`);
  }
  else 
    throw new Error(`Error create child name "${name}" in parent key="${this.key}".`);
  return newChild;
}

//Method: newChild. Description: Create a class instance of a Rho child element, independent of its type
newChild (name, ref, parent, context){
  //Validar referencia
  if (typeof ref !="object") throw new Error(`Error create child name "${name}" is not Object in parent key="${this.key}".`);
  //Determinar tipo de dato
  return this.children[name].element.create(ref, parent, context);
}

toString() { return "Element"; }

}

/*-----------------------------------------------------
*=Class[language]: Language
* Description: Definition of a JSON-based DSL. It contain the list of elements of language
*-----------------------------------------------------*/
class Language { 

//Constructor Language
constructor (alias, GRAMMAR) {
  //Properties 
  this.ALIAS = alias; //Name of JSON-based DSL
  this.GRAMMAR = GRAMMAR; //Grammar of JSON-based DSL
  this.elements = {}; //Elements/Tags of Rho language
}

//Definitions Get's/Set's
//* Class Language: Definitions Methods and Static Methods
//Method: compile. Description: Compile the list of elements of JSON-based DSL
compile (){
  let ELEMENTS = this.GRAMMAR.ELEMENTS;
  
  //Crear elementos
  for (let key in ELEMENTS)
    this.elements[key] = new Element(this, key, ELEMENTS[key]);
  
  //Compilar elementos
  for (let key in ELEMENTS)
    this.elements[key].compile();
  
  //Obtener elemento root
  this.root = this.elements[this.GRAMMAR.ROOT];
}

//Method: getElement. Description: Get Rho language element
getElement (key){
  return this.elements[key];
}

//Method: createRoot. Description: Create object of the root element
createRoot (program){
  return this.root.create(program.code, null, program.context);
}

//Method: createElement. Description: Create element to JSON-based DSL
createElement (elementId, reference, parent, context){
  return this.elements[elementId].create(reference, parent, context);
}

toString() { return "Language"; }

}

/*-----------------------------------------------------
*=Var[languages]: languages
* Description: List of JSON-based DSLs available in the system
*-----------------------------------------------------*/
var languages = {};

/*-----------------------------------------------------
*=Function[register_language]: register
* Description: Register JSON-based DSL
*-----------------------------------------------------*/
var register = function (alias, GRAMMAR, xrho) { 
  //Registrar DSL
  let language = new Language(alias, GRAMMAR);
  language.compile();
  languages[alias] = language;
  //Registrar objetos en variable global
  if (typeof xrho == "object" && global) 
    for (let key in xrho) global[key] = xrho[key];
  return language;
};

/*-----------------------------------------------------
*=Function[get_language]: get
* Description: Get JSON-based DSL
*-----------------------------------------------------*/
var get = function (alias) { 
  //Retornar DSL
  return languages[alias];
};

/*-----------------------------------------------------
*=Function[load_code]: loadCode
* Description: Load DSL-JSON code
*-----------------------------------------------------*/
var loadCode = function (params) { 
  if (params==null) throw new Error ("Error load code JSON (params=null)");
  //Retornar Fuente de datos
  if (params.json) return params.json;
  if (params.url) return loadSync("JSON", params.url, params.data);
  throw new Error ("Error load code JSON params(url=null, json=null)");
};

/*-----------------------------------------------------
*=Class[base]: Base
* Description: Base element of a JSON-based DSL language
*-----------------------------------------------------*/
class Base { 

//Constructor Base
constructor (_def, _parent, _ref) {
  //Properties 
  this._def = _def; //Reference to the definition of the element
  this._parent = _parent; //Reference to the parent element Rho
  this.ref = _ref; //Reference to the program code
  this.root = this._parent ? this._parent.root : this; //Reference a root element
  this.data = new DS.DataManager({}); //Access to the program as a data source
  this.context = null; //Program context reference
  //* Initialize class 
  this.data.createByType("p", "JSON", this.ref);
  //* End Initialize
}

//Definitions Get's/Set's
get def() { return this._def; } 
get parent() { return this._parent; } 
//* Class Base: Definitions Methods and Static Methods
//Method: init. Description: Initialize the base class
init (context, key){
  //Actualización de propiedades base
  this.context = context;
  //Evaluar evento inInit
  this.onInit(key);
}

//Method: run. Description: Run Rho program functionality
run (){
  //Lógica de ejecución del elemento
  for(let name in this.def.children)
    if (this.ref[name])
      this.createChild(name, this.ref[name], this.context);
  //Evento de ejecución 
  this.onRun();
}

//Method: create. Description: Create a new Rho element
create (){}

//Method: createChild. Description: Create a new Rho child element
createChild (name, ref, context){
  this.onBeforeCreateChild(name, ref, context);
  let newElement = this.def.createChild(name, ref, this, context), key;
  this[name] = newElement;
  //Ejecutar nuevo elemento dependiendo del tipo de elemento
  if (newElement)
    switch(this.def.getChild(name).type){
      case ElementType.Object: 
        newElement.run();
        break;
      case ElementType.Array: 
        newElement.forEach(item => item.run());
        break;
      case ElementType.Map: 
        for (key in newElement) newElement[key].run();
        break;
    }
  this.onAfterCreateChild(name, newElement, context);
  return newElement;
}

//Method: modifyChild. Description: Modify a new Rho child element
modifyChild (name, ref, index){
  //Validar si existe definición del hijo
  if (!this.def.hasChild(name)) throw new Error(`There is no definition of "${name}" for element "${this.toString()}".`);
  
  //Actualizar referencia y recrear elemento hijo
  if (index==null) {
    let newElement = this.createChild(name, ref, this.context);
    this.ref[name] = ref;
    return newElement;
  }
  
  //Actualizar referencia y crear elemento hijo
  this.onBeforeAppendChild(name, ref, index);
  let newChild = this.def.newChild(name, ref, this, this.context);
  switch(this.def.getChild(name).type){
    case ElementType.Array: 
      if (index>=0){
        this.ref[name].splice(index,0,ref);
        this[name].splice(index,0,newChild);
      }
      else {
        this.ref[name].push(ref);
        this[name].push(newChild);
      }
      break;
    case ElementType.Map: 
      this.ref[name][index] = ref;
      this[name][index] = newChild;
      break;
  }
  newChild.run();
  this.onAfterAppendChild(name, ref, index);
  return newChild;
}

//Method: removeChild. Description: Delete a new Rho child element
removeChild (name, index){
  //Validar si existe definición del hijo
  if (!this.def.hasChild(name)) throw new Error("There is no definition of '"+name+"' for element "+this.toString());
  
  let def = this.def.getChild(name);
  
  //Eliminar referencia y remover elemento hijo
  if (index==null) {
    if (def.required) throw new Error("The '"+name+"' element can not be removed for element "+this.toString());
    this[name].onRemove();
    delete this.ref[name];
    delete this[name];
    return;
  }
  
  //Remover uno de los elemento hijos
  this.onRemove();
  switch(def.type){
    case ElementType.Array: 
      if (0<=index && index<this.ref[name].length ){
        this.ref[name].splice(index,1);
        this[name].splice(index,1);
      }
      break;
    case ElementType.Map: 
      delete this.ref[name][index];
      delete this[name][index];
      break;
  }
}

//Method: onInit. Description: Class initialization event associated with the Rho element
onInit (){}

//Method: onRun. Description: Function execution event associated with the Rho element
onRun (){}

//Method: onBeforeCreateChild. Description: Event when creating a Rho child element
onBeforeCreateChild (){}

//Method: onAfterCreateChild. Description: Event that runs before creating a Rho child element
onAfterCreateChild (){}

//Method: onBeforeAppendChild. Description: Event that runs after creating a Rho child element
onBeforeAppendChild (){}

//Method: onAfterAppendChild. Description: Event after adding a Rho child element
onAfterAppendChild (){}

//Method: onRemove. Description: Event when Rho element is removed
onRemove (){}

toString() { return "Base"; }

}

/*-----------------------------------------------------
*=Class[component_element]: Component
* Description: Abstract class of component element.
*-----------------------------------------------------*/
class Component extends Base { 

//Constructor Component
constructor (def, parent, ref, _code) {
  super(def, parent, ref);
  //Properties 
  this.code = _code; //The KEY of the Rho language.  
  this._design = '{[p:design]}';
  this.index = null; //Index o key for component element in Map or Array.  
  this._events = '{[p:events]}';  
  this._visible = '{[p:visible]}';
  this._info = '{[p:info]}'; //Redefine info.
  this._attrs = '{[p:attrs]}'; //Redefine attributes.  
  this._settings = null;
  this.id = null; //A new identifier is generated when the component is redeployed.
  this.template = null; //Tamplate name.
  this.builder = null; //Reference a builder component.
  this.refDOM = null; //Reference to the rendered DOM element.
  this.childrenDOM = null; //List of elements defined with 'key' in the Template.
  this.on = {}; //Object to define list of template events.
  this.mapping = null; //Mapping between template elements and nested components.
  this.nested = {}; //Reference to nested components.
  this.nestedSync = true; //Render nested elements asynchronously.
  this.rendering = null; //Save the component rendering and you are ready to apply the 'bind' function.
  this.binding = {}; //Binding between template childs and nested components.
}

//Definitions Get's/Set's  
get design() { return getValue(this._design, "design", this, null,'Basic'); }  
set design(value) { this._design = setValue(this._design, value, "design", this, null,'Basic'); }
  
get events() { return getValue(this._events, "events", this); }  
set events(value) { this._events = setValue(this._events, value, "events", this); }
  
get visible() { return getValue(this._visible, "design", this, null,'Basic'); }  
set visible(value) { this._visible = setValue(this._visible, value, "design", this, null,'Basic'); }
  
get info() { return RHO.getValue(this._info, "info", this); }  
set info(value) { this._info = RHO.setValue(this._info, value, "info", this); }
  
get attrs() { return RHO.getValue(this._attrs, "attrs", this); }  
set attrs(value) { this._attrs = RHO.setValue(this._attrs, value, "attrs", this); }
  
get isComponent() { return true; }
  
get settings() { return this._settings; }  
set settings(value) { 
  //Agregar elementos al componente pero validar que no sean palabras reservadas
  if (typeof value != "object") return;
  this._settings = value;  
  for (let name in this._settings)
    if (RHO.Factory.RESERVED_WORK.indexOf(name)==-1 && !this[name]) this[name] = this._settings[name];
 }

//* Class Component: Definitions Methods and Static Methods
//Method: onInit. Description: Init JSON Component.
onInit (index){
  //Crear component si no existe
  this.index = index;
  if (this.ref.id) this.id = this.ref.id;
  if (this.ref.settings) this.settings = this.ref.settings;
  if (this.ref.on) this.on = this.ref.on;
  
  if (RHO.Factory.Component.exist(this.def.STRUCT.CLASS, this.design)){
  	RHO.Factory.Component.associate(this.def.STRUCT.CLASS, this.design, this);
    //TODO: Falta revisar
    //Asociar eventos externos
    for (let key in this.events) 
      try {
        let event = this.events[key], name = event.substr(event.lastIndexOf(".")+1);
        if (RHO.Factory.RESERVED_WORK.indexOf(name)==-1) eval(`this[key] = ${event}`);
      }
      catch(e) { throw new Error(`Error creating event ${this.template}.${name}`); }
  }
  else throw new Error( `There is no component of type "${this.def.STRUCT.CLASS}" and name "${this.design}".`);
}

//Method: messageError. Description: Error in component.
messageError (name, type, error){
  return `<div crho="RhoError" class="alert alert-danger" role="alert">Error ${name} in component "${type}". Error: ${error.toString()}</div>`;
}

//Method: setDOMAttributes. Description: Apply attribute change to component elements.
setDOMAttributes (entry, values){
  //Función para modificar atributos de un elemento DOM del componente
  const setAttributes = (element, attrs) => {
    if (!element) return;
    for(let name in attrs) {
      let value = attrs[name];
      switch(name){
        case "class": case "removeClass":
          let list = value.split(" ");
          list.forEach(s => element.classList[name=="class"? "add":"remove"](s)); 
          break;
        default: element.setAttribute(name, value);
      }
    }
  };
  //Determinar el tipo de entrada
  if (typeof entry == "string") {
    if (entry=="*") setAttributes(this.refDOM, values);
    else if (this.childrenDOM[entry]) setAttributes(this.childrenDOM[entry], values);
    else throw new Error(`There is no keyed item "${entry}" in "${this.type}".`); 
  }
  else if (typeof entry == "object")
  	for (let name in entry) {
      if (name=="*") setAttributes(this.refDOM, entry[name]);
      else if (this.childrenDOM[name]) setAttributes(this.childrenDOM[name], entry[name]);
      else throw new Error(`There is no keyed item "${name}" in "${this.type}".`);
    }
}

//Method: render. Description: Render a component.
render (settings){
  if (settings) this.settings = settings;
  try {
    //Generar identificador
    if (!this.id) this.id = genId(this.template.replace(/[.]/g,'_'));
    
    //Renderizar elementos anidados
    if (this.mappings){
      this.bindings = {};
      for (let key in this.mappings){
        let map = this[key];
        //Si el elemento es un Array 
        if (Array.isArray(map)){
          this.bindings[key] = [];
          map.forEach( item => {
            if(this.info) item.info = this.info; 
            this.bindings[key].push(item.render(settings));
          });
        }
        //Si el elemento es un Component Object 
        else if (typeof map=="object" && map.isComponent) {
          if(this.info) map.info = this.info;
          this.bindings[key] = map.render(settings);
        }
        //Si el elemento es un Map
        else {
          let mapRendering = {};
          for (let index in map) {
            if(this.info) map[index].info = this.info; 
            mapRendering[index] = map[index].render(settings);
          };
          this.bindings[key] = mapRendering;
        }
      }
    }
    //Ejecutar evento antes de renderizar
    if (typeof this.onRender=="function") this.onRender();
    
    //Renderizar herramienta
    this.rendering = RHO.Templates.render(this.template, this);
  }
  catch(e) { 
    console.error(e);
    this.rendering = this.messageError("RENDER", this.template, e);
  }
  //Retornar resultado
  return this.rendering;
}

//Method: bind. Description: Bind a component.
bind (container){
  if (!this.rendering) throw new Error(`Error rendering component'${this.template}' or the rendering was not done`);
  if (!container) container = document.body;
  
  //Crear elemento
  let tmp = document.createElement("div"), node;
  tmp.innerHTML = this.rendering.trim();
  this.refDOM = tmp.firstChild;
  while(tmp.children.length>0) {
    node = tmp.children.item(0);
    if (node.id==this.id) this.refDOM = node;
    container.appendChild(tmp.children.item(0));
  }
  
  //Hay error en la renderización
  if (this.refDOM.getAttribute("crho")=="RhoError") return this.refDOM;

  this.refDOM.component = this; 
  try {
    //Obtener lista de elementos hijos DOM
    let arrayInit = [];  
    this.childrenDOM = {};
    this.builder.keys.forEach(key => {
      let element = this.refDOM.querySelector(`[key=${key}]`);
      if (element) {
        element.component = this;
        element.refDOM = this.refDOM;
      }
      arrayInit.push(element);
      //Enlazar eventos al elemento
      if (this.on[key])
        for (let name in this.on[key]) {
          try{ eval(`element[name] = function(event){ this.component.on.${key}.${name}(event, this.component); }`); }
          catch(e) { throw new Error(`Error creating event ${this.type}.on.${key}.${name}`); }
        }
      //Agregar elemento DOM
      this.childrenDOM[key] = element;
    });
    
    //Actualizar atributos 
    if (this.attrs) this.setDOMAttributes(this.attrs);

    //Ejecutar función de inicialización
    if (this.init) this.init(arrayInit);

    //Renderización de elementos anidados
    if (this.bindings) {
      this.nested = {};
      for (let bkey in this.bindings) {
        let map = this[bkey], key = this.mappings[bkey], nestedContainer = key=="*" ? this.refDOM : this.childrenDOM[key];
        if (Array.isArray(map))
          map.forEach((item, index) => {
            this.nested[item.id] = item;
            //Renderizar de forma sincrónica o asincrónica
            if (item.nestedSync) item.bind(nestedContainer, this.bindings[bkey][index]);
            else setTimeout( () => item.bind(nestedContainer, this.bindings[bkey][index]), 10);
          });
        else if (typeof map=="object" && map.isComponent){
          this.nested[map.id] = map;
          //Renderizar de forma sincrónica o asincrónica
          if (map.nestedSync) map.bind(nestedContainer, this.bindings[bkey]);
          else setTimeout( () => map.bind(nestedContainer, this.bindings[bkey]), 10);
        }
        else
          for (let index in map) {
            let item = map[index];
            this.nested[item.id] = item;
            if (item.nestedSync) item.bind(nestedContainer, this.bindings[bkey][index]);
            else setTimeout( () => item.bind(nestedContainer, this.bindings[bkey][index]), 10);
          }
      }
    }
    
    //Crear eventos en el refDOM 
    for (let name in this.on)
      this.refDOM.addEventListener(name, function(event) {
        if (this.component.on && this.component.on[event.type]) {
          let fevent = this.component.on[event.type]; 
          eval(`${fevent}(event, this.component)`)
        } 
      });
    
    //Visibilidad
    if (typeof this.visible=="boolean" && this.visible===false) this.hide();
    
    //Ejecutar evento de después de enlazar ref, elements, container
    if (typeof this.onBind=="function") this.onBind(this.refDOM, this.childrenDOM, container);
  }
  catch(e) { 
    let error = document.createElement("div");
    error.innerHTML = this.messageError("BIND", this.template, e);
    this.refDOM.appendChild(error.firstChild);
  }
  
  //Retornar resultado
  return this.refDOM;
}

//Method: renderAndBind. Description: Execute render a bind functions.
renderAndBind (settings, container){
  //Renderizar y enlazar
  this.render(settings);
  return this.bind(container);
}

//Method: destroy. Description: Remove DOM element from page.
destroy (){
  //Eliminar contenedor
  if (this.refDOM) this.refDOM.remove();
}

//Method: show. Description: Show element.
show (){
  this.refDOM.style.display = null;
  return this;
}

//Method: hide. Description: Hide element.
hide (){
  this.refDOM.style.display = "none";
  return this;
}

toString() { return "Component"; }

}



/*-----------------------------------------------------
* Module Initialize: InitJSONDSL  
*-----------------------------------------------------*/
function InitJSONDSL() { 
  //TODO: por hacer

}
InitJSONDSL();

/*-----------------------------------------------------
* Component Definition: JSONDSL  
*-----------------------------------------------------*/
return {
  //Content 
  Language: Language, //* Type: Class
  register: register, //* Type: Function
  get: get, //* Type: Function
  loadCode: loadCode, //* Type: Function
  Base: Base, //* Type: Class
  Component: Component, //* Type: Class
  //Properties 
  //Methods 
  toString: function() { return "JSONDSL"; }
};
})(); 

/*-----------------------------------------------------
*=Component[engine]: Engine
* Description: Rho program execution administration
*-----------------------------------------------------*/
var Engine = (function () {  

//Content definition component


/*-----------------------------------------------------
*=Enum[pragram_state]: ProgramState
* Description: Status of execution of a Rho program
*-----------------------------------------------------*/
var ProgramState = {};
Object.defineProperty(ProgramState, "INIT", {enumerable: true, writable: false, value: 0});
Object.defineProperty(ProgramState, "RUN", {enumerable: true, writable: false, value: 1});
Object.defineProperty(ProgramState, "FINISH", {enumerable: true, writable: false, value: 2});
Object.defineProperty(ProgramState, "ERROR", {enumerable: true, writable: false, value: 3});

/*-----------------------------------------------------
*=Var[_programs]: _programs
* Description: Registration of Rho programs executed in the Rho Engine
*-----------------------------------------------------*/
var _programs = [];

/*-----------------------------------------------------
*=Var[_name_programs]: _namePrograms
* Description: Registration of Rho program names executed in the Rho Engine
*-----------------------------------------------------*/
var _namePrograms = {};

/*-----------------------------------------------------
*=Object[programs]: Programs
* Description: Object for the administration of Rho programs
*-----------------------------------------------------*/
var Programs = {};

//* Object Programs: Definitions Properties 

//* Object Programs: Definitions Methods 
//exist: Valid if there is a Rho program
Programs.exist = function(name){
  return _namePrograms[name] != null;
};

//get: Get the reference to the object a Rho program executed
Programs.get = function(name){
  let founds = _namePrograms[name];
  if (founds==null) return null;
  if (founds.lenght==1) return founds[0];
  return founds;
};

//append: Add a new Rho program
Programs.append = function(program){
  if (_namePrograms[name]==null) _namePrograms[name] = [];
  _namePrograms[name].push(program);
  _programs.push(program); 
};



/*-----------------------------------------------------
*=Class[program]: Program
* Description: Encapsulates the execution of a Rho program
*-----------------------------------------------------*/
class Program { 

//Constructor Program
constructor (name, DSL, nameLanguage, code, context) {
  //Properties 
  this.state = ProgramState.INIT; //Status of execution of the Psi program  
  this._name = name;
  this.timestamps = {}; //Runtime marks of a Rho program
  this.DSL = null; //Type of DSL used: JSON (JSON-based DSL), XML (XML-based DSL)
  this.code = null; //Rho source program
  this.language = null; //Reference to the object of definition of the Rho language
  this.object = null; //Rho object
  this.context = null; //Rho program execution context
  //* Initialize class 
  this.init(DSL, nameLanguage, code, context);
  //* End Initialize
}

//Definitions Get's/Set's  
get name() { return this._name; }

//* Class Program: Definitions Methods and Static Methods
//Method: init. Description: Start Rho program execution
init (DSL, nameLanguage, code, context){
  try {
    DEBUG(`${this.toString()}: Init program "${this.name}". Language: "${nameLanguage}".`);
    this.timestamps[ProgramState.INIT] = new Date();
    //Inicializar propiedades
    this.DSL = DSL;
    this.language = DSL.get(nameLanguage);
    this.code = this.DSL.loadCode(code);
    this.context = context;
  } catch(e) { this.error(e); }
}

//Method: error. Description: Process Rho program execution error
error (error){
  DEBUG(`${this.toString()}: Error program "${this.name}".`, error);
  this.state = ProgramState.ERROR;
  this.timestamps[ProgramState.ERROR] = new Date();
  throw error;
}

//Method: run. Description: Run Rho program in requested language
run (){
  DEBUG(`${this.toString()}: Evaluate program "${this.name}".`);
  this.state = ProgramState.RUN;
  this.timestamps[ProgramState.RUN] = new Date();
  
  //Ejecutar programa Rho
  this.object = this.language.createRoot(this);
  this.object.run();
}

//Method: finish. Description: Finish Rho program execution
finish (){
  DEBUG(`${this.toString()}: Finish program "${this.name}".`);
  this.state = ProgramState.FINISH;
  this.timestamps[ProgramState.FINISH] = new Date();
}

//Method: start. Description: Start Rho program evaluation and return Rho object
start (){
  try {
    this.run();
    this.finish();
    return this.object;
  } catch(e) { this.error(e); }
}

toString() { return "Program"; }

}

/*-----------------------------------------------------
*=Function[load_lib]: loadLib
* Description: Load a JavaScript library generated in Rho Engine.
*-----------------------------------------------------*/
var loadLib = function (name, path='/js/rho/') { 
  $("body").append(`<script type='text/javascript' src='${path}${name}.js'/>`);
};

/*-----------------------------------------------------
*=Function[run_jsondsl]: runJSONDSL
* Description: Execute a Rho program. Requires the name of the language (nameLanguage), the name of the Rho program (name), the Rho source code (source), and the context of the Rho program (context).
*-----------------------------------------------------*/
var runJSONDSL = function (nameLanguage, name, source, context) { 
  //Registrar programa en DataSource 
  DS.registerSource("json", name, source);
  //Ejecutar programa Rho 
  var program = new Program(name, JSONDSL, nameLanguage, source, context);
  return program.start();
};



/*-----------------------------------------------------
* Module Initialize: InitRho  
*-----------------------------------------------------*/
function InitRho() { 
}
InitRho();

/*-----------------------------------------------------
* Component Definition: Engine  
*-----------------------------------------------------*/
return {
  //Content 
  ProgramState: ProgramState, //* Type: Enum
  Programs: Programs, //* Type: Object
  Program: Program, //* Type: Class
  loadLib: loadLib, //* Type: Function
  runJSONDSL: runJSONDSL, //* Type: Function
  //Properties 
  //Methods 
  toString: function() { return "Engine"; }
};
})(); 


/*-----------------------------------------------------
* Module Definition: RHO  
*-----------------------------------------------------*/
return {
  //Elements programmings 
  FLAG_DEBUG: FLAG_DEBUG,
  DEBUG: DEBUG,
  Validator: Validator,
  setValue: setValue,
  getValue: getValue,
  loadSync: loadSync,
  extend: extend,
  gup: gup,
  Templates: Templates,
  Factory: Factory,
  DS: DS,
  JSONDSL: JSONDSL,
  Engine: Engine,
  toString: function() { return "RHO"; }
};
})(); 


