define(["require", "exports", "module", "../app"], function(require, exports, module) {
var app = require('../app');
var File = module.exports = Backbone.Model.extend({ 
  
  url: function () {
    var info = this.get('info')
      , path = this.get('path')
    ;
    
    if(info) {
      if(path === '/') path = '';
      return path + '/' + (info.name || info.fileName);
    } else {
      return path;
    }
  },
  
  sync: function (method, model, options) {
    var self = this
      , args = arguments
    ;
      
    function next() {
    }
    
    var info = model.get('info')
      , data = model.get('data')
    ;
    
    if(method === 'create' && (info || data)) {
      var form;
      
      if(info) {
        form = new FormData();
        form.append('data', info);
      } else if(data || data === '') {
        form = data;
      }
      
      // use custom sync
      var url = _.isFunction(model['url']) ? model['url']() : model['url'];
      url = app.get('appUrl') + url;
      
      // manually build req
      var xhr = new XMLHttpRequest();
      
      // post
      xhr.open('POST', url);
      
      // add key
      xhr.setRequestHeader('x-dssh-key', app.get('authKey'));
      
      // send the multipart form
      xhr.send(form);
      
      // sync
      xhr.addEventListener('readystatechange', function () {
        if (typeof options.success === 'function') {
          options.success();
        }
        self.trigger('sync');
      });
      
    } else {
      // use original sync
      Backbone.sync.apply(model, args);
    }
  }
  
});

});
