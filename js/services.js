(function() {
   'use strict';

   /* Services */

   angular.module('myApp.services', [])

      // put your services here!
      // .service('serviceName', ['dependency', function(dependency) {}]);

    .factory('messageList', ['fbutil', function(fbutil) {
      return fbutil.syncArray('messages', {limit: 10000, endAt: null});
    }])
    .factory('songs', ['fbutil','$firebase', function(fbutil,$firebase) {
      var service={}
      service.load=0;
      service.list=[];
      service.batch=10;
      service.fetch=function(callback){
        service.load=service.load+service.batch;
        var more=$firebase(fbutil.ref('songs').orderByChild("key").limitToLast(service.load)).$asArray();
        more.$loaded().then(function() {
          for(var x=0;x<service.batch;x++){
            service.list.push(more[x]);
          }
          callback();
        });
      }
      return service;
    }])
    .factory('days', ['fbutil', function(fbutil) {
      return fbutil.syncArray('days', {limit: 2000, endAt: null});
    }])
    .factory('artistList', ['fbutil', function(fbutil) {
      return fbutil.syncArray('artists', {limit: 100, endAt: null});
    }])
    .factory('artistPage', ['fbutil','$firebase', function(fbutil,$firebase) {
      var service={}
      service.artist={}
      service.songs=[]
      service.fetchSongs=function(songs){
        angular.forEach(Object.keys(songs||[]).reverse(),function(song_key){
          var song=$firebase(fbutil.ref('songs/'+song_key)).$asObject();
          song.$loaded().then(function(){
            service.artist.works.push(song);
          });
        });
      }
      service.fetch=function(artist_id){
        service.artist=$firebase(fbutil.ref('artists/'+artist_id)).$asObject()
        service.artist.$loaded().then(function(){
          service.artist['works']=[];
          service.fetchSongs(service.artist.songs);
        })
      }

      return service;
    }]);


})();
