
var templateTagString="tp"

var tagCache = new Map();

// Polyfill
if (!NodeList.prototype.forEach && Array.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }

class TagCache {
    constructor(elem){
        this.list = new Array(elem);
        this.cachedValue= null;
    }

    set cache(value){
        this.cachedValue = value;

        this.list.forEach(element => {
            element.innerHTML = value;
        });
    }
    get cache(){
        return this.cachedValue;
    }
}

function getMarkupForTemlate(templateName, elem){
    
    
    if (tagCache.get(templateName)!=null){
        if ( tagCache.get(templateName).cachedValue == null){
            tagCache.get(templateName).list.push(elem);
        }else{
            elem.innerHTML = tagCache.get(templateName).cachedValue;
        }
         
    } 
    else{
        tagCache.set(templateName,new TagCache(elem));
      fetch("/layout/"+templateName+".html")
    .then(function(response) {
        if(response.ok) {
          return response.text();
        } else {
          console.log('Response error: '+response.status);
        }
      }).then(function(html) {
        tagCache.get(templateName).cache=html;
        
      })
      .catch(function(value,index,  error) {
        console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
      });  
    }
    
}

function templateTagFilter(value) {
    var elem = Element(value);
    elem.tag
}

function registerTemplateTag(customTagName) {
    var XFooProto = Object.create(HTMLElement.prototype);

    XFooProto.createdCallback = function() {
    /*this.innerHTML = */getMarkupForTemlate(customTagName.replace(templateTagString+"-",""),this);
    };

    var XFoo = document.registerElement(customTagName, {prototype: XFooProto});
}

function registerTemplateTagAlt(customTagName) {
    Array.from(document.getElementsByTagName(customTagName)).forEach(element => {
        getMarkupForTemlate(customTagName.replace(templateTagString+"-",""),element);
    });
    
}

function registerTemplateTags(tagNames){
    tagNames.forEach(name => {
        registerTemplateTagAlt(name);
    });
}

function getAllPageTemplateTag() {
    var tags = document.getElementsByTagName("*");
    var filteredTags = Array.from(tags,item => item.tagName.toLowerCase()).filter(function(value, index, self){
        return value.startsWith(templateTagString+"-") && self.indexOf(value) === index;
    });
    console.log(" Number of custom tag: "+filteredTags.length)
    registerTemplateTags(filteredTags);
}

getAllPageTemplateTag();

