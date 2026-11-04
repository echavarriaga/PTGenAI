/* Generated power ModelRho (@VERSION 2.0) 
* Model Name: RhoPortable. Version: 3.0. Author: Enrique Chavarriaga
* Copyright 2025. Compilation date: Mon Apr 07 2025.
* Dual licensed under the MIT or GPL Version 2 licenses (http://www.devrho.com/license)
*/


/*-----------------------------------------------------
*=Object[message]: MESSAGE
* Description: Manage message toast.
*-----------------------------------------------------*/
var MESSAGE = {};

//* Object MESSAGE: Definitions Properties 

//* Object MESSAGE: Definitions Methods 
//error: Show error toast.
MESSAGE.error = function(message){ alert(message); };

//warning: Show warning message.
MESSAGE.warning = function(message){ alert(message); };

//info: Show information message.
MESSAGE.info = function(message){ alert(message); };

//spinner: Show/Hide spinner.
MESSAGE.spinner = function(view=false){ $(".spinner-container")[view ? "removeClass":"addClass"]("d-none"); };



/*-----------------------------------------------------
*=Object[context]: CONTEXT
* Description: Web application context.
*-----------------------------------------------------*/
var CONTEXT = {};

//* Object CONTEXT: Definitions Properties 

//* Object CONTEXT: Definitions Methods 


/*-----------------------------------------------------
*=Object[rest]: REST
* Description: Define RestRho connection.
*-----------------------------------------------------*/
var REST = {};

//* Object REST: Definitions Properties   
REST.URL = null; //URL RestRho.  
REST.ActionMetric = null; //Action to send metrics data per page.  
REST.Token = null; //Token user.

//* Object REST: Definitions Methods 
//init: Init REST and metrics
REST.init = function(url, action){
  this.URL = url;
  this.ActionMetric = action;
};

//getURL: Build AJAX request URL.
REST.getURL = function(action, info){
  let params = info ? '?'+$.param(info) : '';
  return `${this.URL}${action}${params}`;
};

//getFail: Function for handling AJAX request errors.
REST.getFail = function(jqXHR, textStatus, errorThrown){
  let error;
  if (jqXHR.responseJSON && jqXHR.responseJSON.message) error = jqXHR.responseJSON.message;
  else 
    switch(textStatus) {
      case "timeout": error = "Error due to timeout."; break; 
      case "abort": error = "I abort sending the request."; break; 
      case "parsererror": error = "Response processing error."; break;
      default: error = `${textStatus}: ${ (!!errorThrown) ? errorThrown : "Unknown."}`;
    }
  // Optionally process the HTTP status code
  switch(jqXHR.status) {
    case 200: case 400: break;
    case 404: error += " Resource not found (404)."; break;
    case 500: error += " Server error (500)."; break;
    default: error += ` Server error (Status=${jqXHR.status}).`;
  }    
  MESSAGE.error(error);
};

//send: Send REST.
REST.send = function(method, action, done, ref, info, body){
  if (body && typeof body == 'object') body = JSON.stringify(body);
  let settings = { dataType: "json", contentType: 'application/json',  method: method, processData: false, headers: {token: this.Token} };
  if (body) settings.data = body;
  $.ajax( REST.getURL(action, info), settings )
    .done(function(data) { done(data, ref); })
    .fail(REST.getFail);
};

//post: Post REST.
REST.post = function(action, done, ref, info, body){ this.send("POST", action, done, ref, info, body); };

//get: Get REST.
REST.get = function(action, done, ref, info, body){ this.send("GET", action, done, ref, info, body); };

//delete: Delete REST.
REST.delete = function(action, done, ref, info, body){ this.send("DELETE", action, done, ref, info, body); };

//put: Put REST.
REST.put = function(action, done, ref, info, body){ this.send("PUT", action, done, ref, info, body); };

//getToken: Get Token from RestRho.
REST.getToken = function(action, data, ref){
  let done = (data, page) => { 
    REST.Token = data.Token; 
    page.openNext(data);
  };
  this.post(action, done, ref, data);
};

//getFile: Get file.
REST.getFile = function(action, done, data){
  this.post(action, done, null, data);
};

//chatLLM: Make a call to an APIRESTfull ChatLLM.
REST.chatLLM = function(method, action, done, ref, user, body, dataType = 'html'){
  let settings = { dataType: dataType, contentType: 'application/json',  method: method, processData: false, headers: {token: this.Token} },
      context = {user: user ? user : "Anonymous"};
  if (method == "POST") settings.data = (typeof body == "object") ? JSON.stringify(body) : body;
  else context.content = body.content;
  $.ajax( REST.getURL(action, context), settings )
    .done(function(data) { done(data, ref); })
    .fail(REST.getFail);
};

//chatLLMJson: Make a call to an APIRESTfull ChatLLM with JSON data type.
REST.chatLLMJson = function(method, action, done, ref, user, body){
  this.chatLLM(method, action, done, ref, user, body, "json");
};

//generateUUID: Generate UUID.
REST.generateUUID = function(){
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] % 16), v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

//metricSend: Send metric for page.
REST.metricSend = function(type, description){
  let user = PRHO.CONTEXT["user"], app = PRHO.CONTEXT["app"];
  if (this.ActionMetric){
    let settings = { dataType: "html", contentType: 'application/json',  method: "POST", processData: false, headers: {token: this.Token} },
        info = {
          USER: user.Alias ? user.Alias : "_system", APP: app.Name, APP_UUID: app.UUID, 
          PAGE: user.Page, PAGE_UUID: user.UUID, TYPE: type, TIMESPAN: new Date().toISOString().replace('T', ' ').slice(0, 19), DESCRIPTION: description
        };
    $.ajax( REST.getURL(this.ActionMetric, info), settings )
      .done(function(data) { })
      .fail(function(jqXHR, textStatus, errorThrown) { console.log(textStatus, errorThrown); });
  }
};

//metricPage: Initialize metrics for a web page.
REST.metricPage = function(page){
  PRHO.CONTEXT["user"].Page = page;
  PRHO.CONTEXT["user"].UUID = page == "sign-in" ? PRHO.CONTEXT["app"].UUID : this.generateUUID();
  this.metricSend("start page");
};

//metricType: Save page metric type.
REST.metricType = function(){};



/*-----------------------------------------------------
*=Object[chat]: CHAT
* Description: Chat to change RESTRho or Portable templates.
*-----------------------------------------------------*/
var CHAT = {};

//* Object CHAT: Definitions Properties   
CHAT.Map = {}; //Map for managing chats per page.  
CHAT.Template = 'PRHO_TemplateChat'; //Template Chat.  
CHAT.CurrentPage = null; //Current running page.

//* Object CHAT: Definitions Methods 
//init: Init chat configuration.
CHAT.init = function(path){
  if (!RHO.Templates.exist(this.Template, 'Handlebars'))
    RHO.Templates.register('Handlebars', this.Template, PRHO.loadSync("TXT", `${path}/chat.html`));
};

//render: Render chat.
CHAT.render = function(page){
  if (!this.Map[page.Name]) this.Map[page.Name] = [];
  this.CurrentPage = page;
  return RHO.Templates.render(this.Template, page.Chat);
};

//cloneElement: Clone element chat
CHAT.cloneElement = function(id){
  let ref = document.querySelector(`#${id}`), copy = ref.cloneNode();
  copy.innerHTML = ref.innerHTML;
  $(copy).removeAttr("id").removeClass("d-none");
  return copy;
};

//getUserChat: Get chat message.
CHAT.getUserChat = function(content=''){
  return this.cloneElement("userChat").outerHTML;
};

//cleanItems: Clean history chat.
CHAT.cleanItems = function(){
  let bodyChat = document.querySelector("#body-chat-rho"), last = bodyChat.lastChild;
  this.Map[this.CurrentPage.Name] = [];
  bodyChat.innerHTML = "";
  bodyChat.appendChild(last);
};

//getUserView: Get view user.
CHAT.getUserView = function(content){
  let view = this.cloneElement("userView");
  $(view).find(".datetime").text( new Date().toISOString().replace("T", " ").replace("Z", "") );
  $(view).find(".content").text( content );
  return view.outerHTML;
};

//getRobotView: Get view robot.
CHAT.getRobotView = function(start, action){
  const difMs = Math.abs(start.getTime() - new Date().getTime());
  let view = this.cloneElement("robotView");
  $(view).find(".action").text( action );
  $(view).find(".timestamp").text( difMs / 1000 );
  return view.outerHTML;
};

//start: Start chat page.
CHAT.start = function(){
  let bodyChat = document.querySelector("#body-chat-rho"), arrayPage = this.Map[this.CurrentPage.Name];
  bodyChat.innerHTML = "";
  for (const role of arrayPage) $(bodyChat).append(role);
  //Manejo de user/rol and view
  $(bodyChat).append( this.getUserChat() );
  $('#nameView').val(PRHO.CONTEXT?.user?.View || "");
  $(bodyChat).find(":last-child").on('keypress', function(event) {
    event.stopImmediatePropagation();
    if (event.key === 'Enter') setTimeout(() => CHAT.completion(), 200);
  });
};

//run: Execute LLM transformation
CHAT.run = function(config, body = null){
  const bodyChat = document.querySelector("#body-chat-rho"), last = bodyChat.lastElementChild, startDate = new Date(), 
        contentUser = last?.lastElementChild?.value, arrayItems = this.Map[this.CurrentPage.Name], page = CHAT.CurrentPage;
  //Determinar si hay texto
  if (config.action == "completion" && !contentUser.trim()) return false;
  //Inciar envio de petición
  arrayItems.push( this.getUserView(contentUser) );
  last?.remove();
  //Procesar página web
  if (CHAT.CurrentPage) {
    const addLLMToPage = (page, info) => {
      if (!!page && !!page.Context && !!page.Context.Action)
        page.Context.LLM = info; 
    };
    let user = (!!CONTEXT.user && !!CONTEXT.user.Alias) ? CONTEXT.user.Alias : "system",
        info = Object.assign({user: user, _message_llm: contentUser}, config);
    try {	
      addLLMToPage(page, info);
      if (page.Fragments)
      	for (const frag of page.Fragments) 
        	addLLMToPage(PRHO.MapFragments[frag.split(":")[0]], info);
    } catch(e) { console.error(e); }
  }
  //Manejo de contestación de robot
  let robot = this.getRobotView( startDate, config.action );
  $(bodyChat).append(robot);
  arrayItems.push(robot);
  //Ejecución de de la página
  CHAT.CurrentPage.open();
};

//completion: Completion chat for completion page.
CHAT.completion = function(){
  this.run({action: "completion"});
};

//reset: Reset template page.
CHAT.reset = function(){
  this.run({action: "reset"});
};

//append: Append memory template page.
CHAT.append = function(view){
  if (!view) return MESSAGE.warning("The append on the memory template name is null. Enter a valid name; if it exists, it will be automatically overwritten.");
  this.run({action: "append", view: `${this.CurrentPage.Name}-${view}`}); 
};

//save: Save template in the disk page.
CHAT.save = function(view){
  if (!view) return MESSAGE.warning("The saved on the disk template name is null. Enter a valid name; if it exists, it will be automatically overwritten.");
  this.run({action: "save", view: `${this.CurrentPage.Name}-${view}`}); 
};

//change: Change template page.
CHAT.change = function(view){
  if (!view) return MESSAGE.warning("The template name to change is null. Enter an existing name; if it doesn't exist, no transformation will be performed.");
  this.run({action: "change", view: view });
};

//edit: Edit template page.
CHAT.edit = function(){
  this.run({action: "edit"}); 
};

//replace: Replace version template active.
CHAT.replace = function(textareaId){
  const body = document.getElementById(textareaId).value;
  /*let page = CHAT.CurrentPage;
  if (page?.Context.Body && CONTEXT[page?.Context?.Body]) 
    CONTEXT[page.Context.Body].FileView = body;
  else if (page?.Context?.Config) 
    page.Context.Config.FileView = body;
  else if (page?.Context) 
    page.Context.Config = {FileView: body};      
  else 
    page.Context = {Config: {FileView: body}};*/
  this.run({action: "replace", body: body}); 
};



/*-----------------------------------------------------
*=Var[ref_handler]: HANDLER
* Description: Reference to run PortableRho
*-----------------------------------------------------*/
var HANDLER = null;

/*-----------------------------------------------------
*=Component[prho]: PRHO
* Description: A lightweight and user-friendly templating language designed for efficiently creating single-page applications. It simplifies the process of structuring dynamic content, allowing developers to focus on building interactive and responsive interfaces with minimal overhead.
*-----------------------------------------------------*/
var PRHO = (function () {  
'use strict';
//Content definition component


/*-----------------------------------------------------
*=Var[path_templates]: PathTemplate
* Description: Path template pages and fragments pages.
*-----------------------------------------------------*/
var PathTemplate = "templates";

/*-----------------------------------------------------
*=Var[context]: CONTEXT
* Description: Contexto disponible.
*-----------------------------------------------------*/
var CONTEXT = {"user": {}};

/*-----------------------------------------------------
*=Const[map_templates]: MapTemplates
* Description: Reference the active template list.
*-----------------------------------------------------*/
const MapTemplates = {};

/*-----------------------------------------------------
*=Const[map_pages]: MapPages
* Description: Reference the pages list.
*-----------------------------------------------------*/
const MapPages = {};

/*-----------------------------------------------------
*=Const[map_fragments]: MapFragments
* Description: Reference the fragments list.
*-----------------------------------------------------*/
const MapFragments = {};

/*-----------------------------------------------------
*=Var[version]: Version
* Description: Version get file.
*-----------------------------------------------------*/
var Version = "1.0";

/*-----------------------------------------------------
*=Function[run]: run
* Description: Run program PRho.
*-----------------------------------------------------*/
var run = function (name, url) { 
  let RHO_CODE = PRHO.loadSync("JSON", url),
      PROGRAM = RHO.Engine.runJSONDSL("PRho", name, {json: RHO_CODE});
  //Execute additional code
  PROGRAM.doSomething();
  return PROGRAM;
};

/*-----------------------------------------------------
*=Function[started]: started
* Description: Started page web application.
*-----------------------------------------------------*/
var started = function () { 
  const config = HANDLER.Started;
  try {
    if (!config || !config.Page || !config.Container) 
      return MESSAGE.error(`Error in definition in the Started startup object: ${JSON.stringify(config)}. Validate your configuration in the PRho program.`) ;
    openPage(config.Page, config.Container);
  } 
  catch (error) { MESSAGE.error(`Error started page "${config.Page}" application. Error: ${error.message}`); }
};

/*-----------------------------------------------------
*=Function[load_sync]: loadSync
* Description: Get file by version.
*-----------------------------------------------------*/
var loadSync = function (type, url, data) { 
  return RHO.loadSync(type, url, {version: Version}, true);
};

/*-----------------------------------------------------
*=Function[init]: init
* Description: Run program PRho and initialize with page set to 'Started'.
*-----------------------------------------------------*/
var init = function (name, url, path = 'templates', version = '1.0') { 
  try {
    PathTemplate = path;
    Version = version;
    //Init error and chat
    $(document.body).append(PRHO.loadSync("TXT", `${PathTemplate}/error.html`));
    CHAT.init(path);
    //Run program
    HANDLER = run(name, url).root;
    started();
  }
  catch (error) { MESSAGE.error(`Error initializing program PRho '${name}' (URL: ${url}). Error:${error.message}`); }
};

/*-----------------------------------------------------
*=Function[init_app]: initApp
* Description: Init app config metrics.
*-----------------------------------------------------*/
var initApp = function (name) { 
  PRHO.CONTEXT["app"] = { Name: name, UUID: REST.generateUUID()};
  REST.metricSend("init app");
};

/*-----------------------------------------------------
*=Function[init_signin]: initSignIn
* Description: Init sign-in config metrics.
*-----------------------------------------------------*/
var initSignIn = function (title, icon, color) { 
	PRHO.CONTEXT["sign-in"] = { Title: title, Icon: icon, Color: color};
};

/*-----------------------------------------------------
*=Function[init_user]: initUser
* Description: Init user config metrics.
*-----------------------------------------------------*/
var initUser = function (alias, icon, color) { 
	PRHO.CONTEXT["user"] = { Alias: alias, Icon: icon, Color: color, ColorMain: color};
};

/*-----------------------------------------------------
*=Function[open_page]: openPage
* Description: Open a page defined in PRho.
*-----------------------------------------------------*/
var openPage = function (name, container) { 
  try {
    let page = MapPages[name];
    if (!page) return MESSAGE.error(`Page '${name}' not found.`);
		REST.metricPage(name);
    page.open(container);
  }
  catch (error) { MESSAGE.error(error.message); }
};

/*-----------------------------------------------------
*=Class[handler]: Handler
* Description: A root element responsible for managing the creation of portable pages. It serves as the foundational component in the development process, enabling seamless generation and organization of pages optimized for flexibility and mobility. This root element simplifies the structure, making it easier to adapt pages to sdifferent platforms and devices, ensuring portability and ease of use.
*-----------------------------------------------------*/
class Handler extends RHO.JSONDSL.Base { 

//Constructor Handler
constructor (def, parent, ref) {
  super(def, parent, ref);
  //Properties 
  this._Started = '{[p:Started]}'; //Reference object for the PRho home page.
  this._View = '{[p:View]}'; //Execution view of the entire application.
}

//Definitions Get's/Set's  
get Started() { return RHO.getValue(this._Started, "Started", this, "required"); }  
set Started(value) { this._Started = RHO.setValue(this._Started, value, "Started", this, "required"); }
  
get View() { return RHO.getValue(this._View, "View", this); }  
set View(value) { this._View = RHO.setValue(this._View, value, "View", this); }

//* Class Handler: Definitions Methods and Static Methods
//Method: onInit. Description: Execute init code!
onInit (key){
  //Por implementar!!
}

//Method: getView. Description: Get view to apply to the entire application
getView (){
  if (this.View) 
  	return { action: "change", view: this.View, user: CONTEXT?.user?.Alias ? CONTEXT.user.Alias : "system" };
	return null;
}

//Method: doSomething. Description: Do something more ...
doSomething (){}

toString() { return "Handler"; }

}

/*-----------------------------------------------------
*=Class[template]: Template
* Description: Definition of templates for use in the transformation of Fragments Pages results.
*-----------------------------------------------------*/
class Template extends RHO.JSONDSL.Base { 

//Constructor Template
constructor (def, parent, ref) {
  super(def, parent, ref);
  //Properties 
  this.Name = null; //Name template.
  this._Dir = '{[p:Dir]}'; //Directory
  this._File = '{[p:File]}'; //Template file.
}

//Definitions Get's/Set's  
get Dir() { return RHO.getValue(this._Dir, "Dir", this); }  
set Dir(value) { this._Dir = RHO.setValue(this._Dir, value, "Dir", this); }
  
get File() { return RHO.getValue(this._File, "File", this, "required"); }  
set File(value) { this._File = RHO.setValue(this._File, value, "File", this, "required"); }

//* Class Template: Definitions Methods and Static Methods
//Method: onInit. Description: Load template file.
onInit (key){
  this.Name = key;
  MapTemplates[this.Name] = this;
}

//Method: render. Description: Render template.
render (context){
  if (!RHO.Templates.exist(this.Name, 'Handlebars')) {
    const url = `${PathTemplate}${this.Dir ? '/'+this.Dir : ''}/${this.File}`;
    RHO.Templates.register('Handlebars', this.Name, PRHO.loadSync("TXT", url));
  }
  return RHO.Templates.render(this.Name, context);
}

toString() { return "Template"; }

}

/*-----------------------------------------------------
*=Class[base]: Base
* Description: Base para transformar ...
*-----------------------------------------------------*/
class Base extends RHO.JSONDSL.Base { 

//Constructor Base
constructor (def, parent, ref) {
  super(def, parent, ref);
  //Properties 
  this._Name = '{[p:Name]}'; //Name file transform.
  this._Template = '{[p:Template]}'; //Template reference.
  this._Container = '{[p:Container]}'; //Reference to the DOM element where the transformation is added.
  this._Config = '{[p:Config]}'; //Config page initial.
  this._Context = '{[p:Context]}'; //Reference to the page context. A request to ReshRho to obtain a JSON is configurable. Use '*' to have the full context available.
  this._Empty = '{[p:Empty]}'; //Clear page/fragment container to add rendering.
  this._Next = '{[p:Next]}'; //Reference next page.
  this._Append = '{[p:Append]}'; //Add Rendering: Use 'start' to add as the first item in the Container, or 'end' to add as the last item in the Container.
}

//Definitions Get's/Set's  
get Name() { return RHO.getValue(this._Name, "Name", this); }  
set Name(value) { this._Name = RHO.setValue(this._Name, value, "Name", this); }
  
get Template() { return RHO.getValue(this._Template, "Template", this); }  
set Template(value) { this._Template = RHO.setValue(this._Template, value, "Template", this); }
  
get Container() { return RHO.getValue(this._Container, "Container", this); }  
set Container(value) { this._Container = RHO.setValue(this._Container, value, "Container", this); }
  
get Config() { return RHO.getValue(this._Config, "Config", this, null,{}); }  
set Config(value) { this._Config = RHO.setValue(this._Config, value, "Config", this, null,{}); }
  
get Context() { return RHO.getValue(this._Context, "Context", this); }  
set Context(value) { this._Context = RHO.setValue(this._Context, value, "Context", this); }
  
get Empty() { return RHO.getValue(this._Empty, "Empty", this, null,'yes'); }  
set Empty(value) { this._Empty = RHO.setValue(this._Empty, value, "Empty", this, null,'yes'); }
  
get Next() { return RHO.getValue(this._Next, "Next", this); }  
set Next(value) { this._Next = RHO.setValue(this._Next, value, "Next", this); }
  
get Append() { return RHO.getValue(this._Append, "Append", this, null,'end'); }  
set Append(value) { this._Append = RHO.setValue(this._Append, value, "Append", this, null,'end'); }

//* Class Base: Definitions Methods and Static Methods
//Method: getContext. Description: Get context according to the definition.
getContext (){
  const METHODS = ["get","post","delete","put"];
  switch(typeof this.Context){
    case "string": return (this.Context == "*") ? CONTEXT : CONTEXT[this.Context];
    case "object": 
      let done = new Function("data", "page", (this.Context.Key ? `CONTEXT["${this.Context.Key}"] = data; ` : "") + "page.render(data);");
      if (!!this.Context.Action){
        const method = this.Context.Method ? this.Context.Method : "get";
        if (!METHODS.includes(method)) 
          MESSAGE.error(`Error in definition of URL method '${this.Context.Method}'. Use: get, post, delete or put.`);
        let paramBody = this.Context.Body ? CONTEXT[this.Context.Body] : this.Context.Config ? $.extend({}, this.Context.Config) : null,
            paramInfo = this.Context.Info || this.Context.LLM ? $.extend({}, this.Context.Info,this.Context.LLM) : this.root.getView();
        //Revisar si se está ejecutado una vista de la palicación
        if (!paramInfo?.action) 
          paramInfo = $.extend(paramInfo, this.root.getView());
        //Realizar petición REST
      	REST[method](this.Context.Action, done, this, paramInfo, paramBody);
      }
      else if (!!this.Context.ChatLLM)
        REST.chatLLM(this.Context.Method, this.Context.ChatLLM, done, this, PRHO.CONTEXT?.user?.Alias, CONTEXT[this.Context.Body]);
      break;
  }
}

//Method: open. Description: Open page o fragment HTML.
open (container, keyContext){
  this.Container = (typeof container == "string") ? document.querySelector(`${container}`) : (container instanceof Element) ? container : this.Container;  
  if (!this.Container) 
    return MESSAGE.error(`Error opening page/fragment '${this.Name}', unable to get a DOM element to transform.`) ;
  //Render page with definition context
  if (this.Template && !MapTemplates[this.Template]) 
    if (!(this.Context && this.Context.Replace == "yes")) 
      return MESSAGE.error(`There is no template '${this.Template}' defined.`);
  if (this.Context) {
    let context = this.getContext();
    if (context) this.render(context);
  }
  else this.render(!keyContext ? null : keyContext == "*" ? CONTEXT : CONTEXT[keyContext]);
}

//Method: render. Description: Redering page.
render (context){
  let map = { ...this.Config, ...context },
      rendering = (!!this.Context && this.Context.Replace == "yes") ? context : this.Template ? MapTemplates[this.Template].render(map) : context;
  if (this.Empty == "yes") $(this.Container).empty();
  switch(this.Append){
    case "start": $(this.Container).prepend(rendering); break;
    case "end":   $(this.Container).append(rendering); break;
    default:      return MESSAGE.error(`The Append attribute can only take values 'start' or 'end'. Currently Append=${this.Append}.`);
  }
  this.onAfterRender();
}

//Method: openNext. Description: Open next page reference in Next.
openNext (){
  if (this.Next) {
    let page = MapPages[this.Next];
    if (!page) return MESSAGE.error(`The page with name '${this.Next}' does not exist.`);
    page.open();
  }
}

//Method: onAfterRender. Description: After render event.
onAfterRender (){}

toString() { return "Base"; }

}

/*-----------------------------------------------------
*=Class[page]: Page
* Description: The Page element is used to specify a page that will be displayed in the application. It acts as a container for the content and layout of the page, defining what the user will see and interact with. By using the Page element, developers can easily manage and organize the structure of different views, ensuring smooth navigation and user experience within the application.
*-----------------------------------------------------*/
class Page extends Base { 

//Constructor Page
constructor (def, parent, ref) {
  super(def, parent, ref);
  //Properties 
  this._Preloads = '{[p:Preloads]}'; //List of HTML fragments before rendering the web page.
  this._Fragments = '{[p:Fragments]}'; //List of fragments HTML of the rendered web page.
  this._Chat = '{[p:Chat]}'; //Load the Chat for page management.
}

//Definitions Get's/Set's  
get Preloads() { return RHO.getValue(this._Preloads, "Preloads", this); }  
set Preloads(value) { this._Preloads = RHO.setValue(this._Preloads, value, "Preloads", this); }
  
get Fragments() { return RHO.getValue(this._Fragments, "Fragments", this); }  
set Fragments(value) { this._Fragments = RHO.setValue(this._Fragments, value, "Fragments", this); }
  
get Chat() { return RHO.getValue(this._Chat, "Chat", this); }  
set Chat(value) { this._Chat = RHO.setValue(this._Chat, value, "Chat", this); }

//* Class Page: Definitions Methods and Static Methods
//Method: onInit. Description: Init page.
onInit (key){
  this.Name = key;
  MapPages[this.Name] = this;
}

//Method: loadFragment. Description: Load fragment page.
loadFragment (key, container){
  let fragment = MapFragments[key];
  //Validate existence of fragment
  if (!fragment) return MESSAGE.error(`No fragment HTML with identifier '${key}' was found.`) ;
  //Render fragment and add to page
  fragment.open(container); 
}

//Method: open. Description: Open page o fragment HTML.
open (container, keyContext){
  MESSAGE.spinner(true);
  //Preload fragments page
  if (Array.isArray(this.Preloads))
    this.Preloads.forEach((fragment, index) => {
      console.log(`Index ${index}: ${fragment}`);
    });
  //Renderize page
  super.open(container, keyContext);
}

//Method: onAfterRender. Description: After render event.
onAfterRender (){
  //Add fragments within the current page.
  if (Array.isArray(this.Fragments))
    this.Fragments.forEach((spec) => {
      let index = spec.indexOf(":"); 
      if (index == -1) return MESSAGE.error(`The specification of a fragment is: [key]:[container]. Fragment: ${spec}`) ;
      this.loadFragment(spec.substr(0, index), spec.substr(index+1));
    });
  //Add chat to Page
  if (typeof this.Chat == "object") {
    const rendering = CHAT.render(this);
    $(this.Container).append(rendering);
  }
  MESSAGE.spinner(false);
}

toString() { return "Page"; }

}

/*-----------------------------------------------------
*=Class[fragment]: Fragment
* Description: The Fragment element is used to specify a page that will be displayed in the application. It acts as a container for the content and layout of the page, defining what the user will see and interact with. By using the Page element, developers can easily manage and organize the structure of different views, ensuring smooth navigation and user experience within the application.
*-----------------------------------------------------*/
class Fragment extends Base { 

//Constructor Fragment
constructor (def, parent, ref) {
  super(def, parent, ref);
  //Properties 
}

//Definitions Get's/Set's
//* Class Fragment: Definitions Methods and Static Methods
//Method: onInit. Description: Init page.
onInit (key){
  this.Name = key;
  MapFragments[this.Name] = this;
}

toString() { return "Fragment"; }

}



/*-----------------------------------------------------
* Module Initialize: PortableInit  
*-----------------------------------------------------*/
function PortableInit() { 
  //Add helpers to Handlebars
  Handlebars.registerHelper("x", function(expression, options) {
    // you can change the context, or merge it with options.data, options.hash
    var result, context = this;
    result = (function() {
      try { return eval(expression); } 
      catch (e) { console.warn('Expression: {{x \'' + expression + '\'}}\nJS-Error: ', e, '\nContext: ', context); }
    }).call(context); // to make eval's lexical this=context
    return result;
  });
  Handlebars.registerHelper("xif", function(expression, options) {
    return Handlebars.helpers["x"].apply(this, [expression, options]) ? options.fn(this) : options.inverse(this);
  });

}
PortableInit();

/*-----------------------------------------------------
* Component Definition: PRHO  
*-----------------------------------------------------*/
return {
  //Content 
  PathTemplate: PathTemplate, //* Type: Var
  CONTEXT: CONTEXT, //* Type: Var
  MapTemplates: MapTemplates, //* Type: Const
  MapPages: MapPages, //* Type: Const
  MapFragments: MapFragments, //* Type: Const
  Version: Version, //* Type: Var
  run: run, //* Type: Function
  started: started, //* Type: Function
  loadSync: loadSync, //* Type: Function
  init: init, //* Type: Function
  initApp: initApp, //* Type: Function
  initSignIn: initSignIn, //* Type: Function
  initUser: initUser, //* Type: Function
  openPage: openPage, //* Type: Function
  Handler: Handler, //* Type: Class
  Template: Template, //* Type: Class
  Base: Base, //* Type: Class
  Page: Page, //* Type: Class
  Fragment: Fragment, //* Type: Class
  //Properties 
  //Methods 
  toString: function() { return "PRHO"; }
};
})(); 

/*-----------------------------------------------------
*=DSL[grammar_prho]: PRho
* Description: JSON-based DSL definition
*-----------------------------------------------------*/
var GRAMMAR_PRHO = {
  NAME: "PRho",
  ELEMENTS: {
    "handler": {
      CLASS: "PRHO.Handler",
      CHILDREN: { 
        "Templates": { KEY: "template", TYPE: "Map" },
        "Pages": { KEY: "page", TYPE: "Map" },
        "Fragments": { KEY: "fragment", TYPE: "Map" }
      }
    },
    "template": { CLASS: "PRHO.Template", CHILDREN: null },
    "page": {
      CLASS: "PRHO.Page",
      CHILDREN: null
    },
    "fragment": { CLASS: "PRHO.Fragment", CHILDREN: null }
  },
  ROOT: "handler"
};
RHO.JSONDSL.register("PRho", GRAMMAR_PRHO); 


