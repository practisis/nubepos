/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
/*var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        var uuid = device.uuid;
		alert(uuid);
    }
};*/

 function onDeviceReady(){
	//alert(device.uuid);
	/*try {
      var uuid = device.uuid;
	  alert(uuid);
	} catch (e) {
      alert(e);
    }*/
	//alert('entra');
    var db = window.openDatabase("Database", "1.0", "BarWifi",200000);
    db.transaction(iniciaDB, errorCB, successCB);
	datosuser();
 }
 
 // Transaction error callback
    //
 function errorCB(tx,err){
    console.log("Error processing SQL: "+err);
 }

    // Transaction success callback
    //
 function successCB(){
    console.log("success!");
 }
 
 function iniciaDB(tx){
		//tx.executeSql('DROP TABLE IF EXISTS LOGINDATA');
    tx.executeSql('CREATE TABLE IF NOT EXISTS LOGINDATA (id integer primary key AUTOINCREMENT, maquina text,ip text,registrado integer,username text,pass text)');
 }
 
 function ingresadatos(cual,data){
	 console.log(data);
    var db = window.openDatabase("Database", "1.0", "BarWifi", 200000);
    db.transaction(
	function (tx){
		if(cual==1)
			tx.executeSql('INSERT INTO LOGINDATA (ip,maquina) VALUES (?,?);',[data,$('#barracaja').html()]);	
		if(cual==2){
			var midata=data.split('|');
			tx.executeSql('UPDATE LOGINDATA SET username=?,pass=?,maquina=?,registrado=1',[midata[0],midata[1],midata[2]]);
			$('#barrascaja').html(midata[2]);
		}
	},errorCB,successCB);
 }
    
 
 function datosuser(){
    var db = window.openDatabase("Database", "1.0", "BarWifi", 200000);
    db.transaction(sacadatos, errorCB, successCB);
 }
	
 function sacadatos(tx){
	tx.executeSql('SELECT * FROM LOGINDATA',[], function (tx,res){
		var ip='';
		var registrado=0;
		var usern='';
		var pass='';
		var maquina='';
		for(i=0;i<res.rows.length;i++){
			var item=res.rows.item(i);
			ip=item.ip;
			registrado=item.registrado;
			usern=item.username;
			pass=item.pass;
			maquina=item.maquina;
		}
		if(ip==''){
			if(registrado==0){
					setTimeout(function(){
					$('#inicio').slideUp(100,function(){
						$('#formip').slideDown(700);
					});
					},1500);
			}
		}else{
			if(registrado==1&&usern!=''&&pass!=''){
				console.log("1");
				$('#ipnumber').val(ip);
				$('#user').val(usern);
				$('#pass').val(pass);
				$('#barrascaja').html(maquina);
				Login();
			}else{
				//console.log("Ahora");
				console.log("2");
				setTimeout(function(){
					$('#ipnumber').val(ip);
					$('#inicio').slideUp(100,function(){
						$('#formlogin').slideDown(700);
					});
				},1500);
			}
		}
    });    
 }
 
function Resetear(){
	 var db = window.openDatabase("Database", "1.0", "BarWifi", 200000);
	 db.transaction(
	function (tx){
		tx.executeSql('DELETE FROM LOGINDATA',[],function(tx,res){
		window.location.reload(true);
	})},errorCB,successCB);
}