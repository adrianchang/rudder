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

// SHORTCUT to DOM Elements

var DeviceFactory = {
  devices : [],

  getDevices: function(){
    return this.devices;
  },

  getDevice: function(id){
    var device_found = this.devices.filter(function(device){
      return device.id == id;
    });
    return device_found[0];
  },

  reset: function(){
    devices = [];
  }

}

function addDevice(name, address) {

    var button1 = document.createElement("button");
    button1.style.width = "100%";
    button1.style.padding = "10px";
    button1.style.fontSize = "16px";
    button1.textContent = name + ": " + address;

    button1.addEventListener("click", function () {

        document.getElementById("services").innerHTML = "";
        connect(address);
    });

    document.getElementById('app-main').appendChild(button1);
}

function handleError(error) {

    var msg;

    if (error.error && error.message) {

        var errorItems = [];

        if (error.service) {

            errorItems.push("service: " + (uuids[error.service] || error.service));
        }

        if (error.characteristic) {

            errorItems.push("characteristic: " + (uuids[error.characteristic] || error.characteristic));
        }

        msg = "Error on " + error.error + ": " + error.message + (errorItems.length && (" (" + errorItems.join(", ") + ")"));
    }

    else {

        msg = error;
    }

    // alert(msg, "error");

    if (error.error === "read" && error.service && error.characteristic) {

        reportValue(error.service, error.characteristic, "Error: " + error.message);
    }
}

function handleError2(error) {
    //alert("ERROR: " + error);
}

function advertisingSuccess(result){
    // alert(result.status);
}

function initializeSuccess(result) {

    if (result.status === "enabled") {

        //alert("Bluetooth is enabled:", "status");
        //alert(result);
        //bluetoothle.startAdvertising(success, handleError,{});
    }

    else {

        document.getElementById("start-scan").disabled = true;

        alert("Bluetooth is not enabled:", "status");
        alert(result, "status");
    }
}

function stopScan() {

    new Promise(function (resolve, reject) {

        bluetoothle.stopScan(resolve, reject);

    }).then(stopScanSuccess, handleError);
}

function stopScanSuccess() {
    if (!foundDevices.length) {

        //alert("NO DEVICES FOUND");
    }
    else {

        //alert("Found " + foundDevices.length + " devices.", "status");
    }
}


function enableSuccess(result) {
    //alert("enable success");
    // Listen to State Changes
    firebase.auth().onAuthStateChanged(onAuthStateChanged);
}




function startScanSuccess(result) {
    if (result.status === "scanStarted") {
        //alert("Scanning for devices (will continue to scan until you select a device)...", "status");
    }
    else if (result.status === "scanResult") {
        if (!foundDevices.some(function (device) {

            return device.address === result.address;

        })) {
            //alert('FOUND DEVICE:');
            //alert(result);
            // ANDROID find IOS
            // alert(result.name);
            foundDevices.push(result);
            // IOS find ANDROID
            // service
            // alert(result.advertisement.serviceUuids);
            //alert(result.address);
            //addDevice(result.name, result.advertisement.serviceUuids);
            var user = firebase.auth().currentUser;
            var nameRef = firebase.database().ref('nearby/'+user.uid+'/name/'+result.name);

            if(cordova.platformId==="android"){
                if(result.name == "0001"){ // jeffrey
                    nameRef.set("ubPF0W67kzX2maHQbKcPo7ZYpFe2");
                }
                else if(result.name == "0002"){
                    nameRef.set("xj81wEzStnZPvCwraYf7PBsmQvM2");
                }
                else if(result.name == "0003"){
                    nameRef.set("5xJvrutRKscEQvxSeRMIQCCUNW23");
                }
                else if(result.name == "0004"){ //yya
                    nameRef.set("oES6cTH1upaLGxDZu791niVTiir1");
                }
                else {
                    // DO NOTHING
                    nameRef.set("oES6cTH1upaLGxDZu791niVTiir1");
                }
            }
            else {
                 if(result.advertisement.serviceUuids == "0001"){ // jeffrey
                    nameRef.set("ubPF0W67kzX2maHQbKcPo7ZYpFe2");
                }
                else if(result.advertisement.serviceUuids == "0002"){
                    nameRef.set("xj81wEzStnZPvCwraYf7PBsmQvM2");
                }
                else if(result.advertisement.serviceUuids == "0003"){
                    nameRef.set("5xJvrutRKscEQvxSeRMIQCCUNW23");
                }
                else if(result.advertisement.serviceUuids == "0004"){ //yya
                    nameRef.set("oES6cTH1upaLGxDZu791niVTiir1");
                }
                else {
                    // DO NOTHING
                    nameRef.set("oES6cTH1upaLGxDZu791niVTiir1");
                }
            }
        }
    }
    else stopScan(stopScanSuccess,handleError);
}

function update_list(updated_users) {

  // clear the existing list
  $('#users .list li').remove();

  $.each(updated_users, function(index,device) {

   firebase.database().ref('/users/' + device.id).once('value').then(function(snapshot) {
            if(snapshot && snapshot.val() !== null){
              var username = snapshot.val().firstName + ' ' + snapshot.val().lastName;
              $('#users .list').append('<li><h3 class="name">' + username + '</h3></li>');
            }
        });

  });

};


function discover() {
    alert("start discovering");
    //document.getElementById("page1").setAttribute("style", "display: none");
    //document.getElementById("users").setAttribute("style", "display: block");
    bluetoothSerial.setDeviceDiscoveredListener(function(device) {
        alert("Found " + device.name + " id: " + device.address);
        //addDevice(device.name,device.address);
        update_list(DeviceFactory.getDevices());
        //要先按subscribe
        firebase.database().ref('/users/' + device.id).once('value').then(function(snapshot) {
          if(snapshot && snapshot.val() !== null){
              var username = snapshot.val().firstName + ' ' + snapshot.val().lastName;
              alert("he's our user " + username);
            }
        });
    });
    bluetoothSerial.discoverUnpaired(discoverSuccess, handleError2);
}

function discoverSuccess(result) {
}

function startBluetooth (result) {
    alert("firebase initialized");
    return new Promise (function (resolve, reject) {
        bluetoothSerial.isEnabled(
            function() {
                alert("Bluetooth is enabled");
                resolve(0);
            },
            function() {
                bluetoothSerial.enable(resolve, reject);
            }
        );
    });
}


var currentUID;
var macAddr = 0;

function Peripheral(uid){
    // alert('before');
    bluetoothle.initialize();
    bluetoothle.initializePeripheral(initializeSuccess, handleError, params = {
    "request": true});
    // alert('after');
    var services;
    if(uid == "ubPF0W67kzX2maHQbKcPo7ZYpFe2"){ // jeffrey
        services = "0001";
    }
    else if(uid == "xj81wEzStnZPvCwraYf7PBsmQvM2") // cmc4010@gmail.com
    {
        services = "0002";
    }
    else if(uid == "5xJvrutRKscEQvxSeRMIQCCUNW23") // bob@gmail.com
    {
        services = "0003";
    }
    else if(uid == "oES6cTH1upaLGxDZu791niVTiir1") // yya@gmail.com
    {
        services = "0004";
    }
    else {
        services = "0000"; // OTHER
    }

    // alert(services);

    if(cordova.platformId==="ios"){
        bluetoothle.addService(advertisingSuccess, handleError,params = {
          service: ["1234"],
        });
        // IPHONE
        // can change both
        bluetoothle.startAdvertising(advertisingSuccess, handleError, params = {
        "services":["1234"],"name":services,});
    }
    else{
          bluetoothle.addService(advertisingSuccess, handleError,params = {
          service: services,
          characteristics: [
            {
              uuid: "ABCD",
              permissions: {
                read: true,
                write: true,
                //readEncryptionRequired: true,
                //writeEncryptionRequired: true,
              },
              properties : {
                read: true,
                writeWithoutResponse: true,
                write: true,
                notify: true,
                indicate: true,
                //authenticatedSignedWrites: true,
                //notifyEncryptionRequired: true,
                //indicateEncryptionRequired: true,
              }
            }
          ]
        });

        // ANDROID
        // can only change service

        // NOTE 3 CANNOT

        bluetoothle.startAdvertising(advertisingSuccess, handleError, params = {
        "service":services,"name":"sdasIphone",});
    }
}

var app = {
    // Application Constructor
    initialize: function() {
        alert('initialize');
        this.bindEvents();
        bluetoothle.initialize(initializeResult, params);
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {

        document.addEventListener('deviceready', this.onDeviceReady, false);
        window.addEventListener('load', this.onLoad, false);
    },

    // device ready Event Handler
    onDeviceReady: function() {
        
        app.receivedEvent('deviceready');
        
    },

    // load Event Handler
    onLoad: function() {
        
        Peripheral();
        new Promise(function (resolve) {
            bluetoothle.initialize(resolve, { request: true, statusReceiver: false });
        }).then(initializeSuccess, handleError).then(function(){
            app.receivedEvent('load');
        })

    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {

        if(id === 'deviceready'){
            // SECOND
            // document.getElementById("users").setAttribute("style", "display: none");
            // Initialize Firebase and Enable Bluetooth
            
            // alert('device ready');

            // new Promise (function (resolve, reject) {
            //     var config = {
            //     apiKey: "AIzaSyA76YvV_3AS-5DVG2qgQKcRnNCONTYytXY",
            //     authDomain: "rudder-5b10f.firebaseapp.com",
            //     databaseURL: "https://rudder-5b10f.firebaseio.com",
            //     projectId: "rudder-5b10f",
            //     storageBucket: "rudder-5b10f.appspot.com",
            //     messagingSenderId: "939306544177"
            //     };
            //     firebase.initializeApp(config);
            //     resolve(0);
            // }).then(startBluetooth, handleError
            // ).then(enableSuccess, handleError);

              
            //startBluetooth().then(enableSuccess, handleError);
            
            
        }
        else if(id === 'load'){
            // FIRST
            // App page
            //bluetoothSerial.setDiscoverable(0);

            // alert('load');

            // var config = {
            //     apiKey: "AIzaSyA76YvV_3AS-5DVG2qgQKcRnNCONTYytXY",
            //     authDomain: "rudder-5b10f.firebaseapp.com",
            //     databaseURL: "https://rudder-5b10f.firebaseio.com",
            //     projectId: "rudder-5b10f",
            //     storageBucket: "rudder-5b10f.appspot.com",
            //     messagingSenderId: "939306544177"
            // };
            // firebase.initializeApp(config);

            new Promise (function (resolve, reject) {
                var config = {
                apiKey: "AIzaSyA76YvV_3AS-5DVG2qgQKcRnNCONTYytXY",
                authDomain: "rudder-5b10f.firebaseapp.com",
                databaseURL: "https://rudder-5b10f.firebaseio.com",
                projectId: "rudder-5b10f",
                storageBucket: "rudder-5b10f.appspot.com",
                messagingSenderId: "939306544177"
                };
                firebase.initializeApp(config);
                resolve(0);
            }).then(function(){
                // alert('oh my');
                firebase.auth().onAuthStateChanged(function(user){
                    if (user) {
                        // user is signed in
                        // PERFORM ADVERTISEMENT
                        // alert(user.uid)
                        if(cordova.platformId==="android"){
                            setInterval(function(){ Peripheral(user.uid); }, 3000);
                        }
                        // PERFORM DISCOVERY
                        setInterval(function(){ bluetoothle.isScanning(isScanningSuccessAndScan); }, 3000);
                        // discover();
                    }   
                    else {
                        // don't discover
                    }
                });
            });

            // if(cordova.platformId==="android"){
            //     setInterval(function(){ Peripheral();}, 3000);
            // }

            var stopp=false;
            function isScanningSuccessAndScan(result){
                if(result.isScanning==true){
                    stopScan(stopScanSuccess,handleError);
                    stopp=true;
                }
                else {
                    setTimeout(function(){ if(stopp==false)stopScan(stopScanSuccess,handleError);}, 3000);
                    foundDevices = [];
                    bluetoothle.startScan(startScanSuccess, handleError, { "services": [],"allowDuplicates": false });
                }
            }

            // document.getElementById("b-discover").addEventListener("click", function(){
            //     if (cordova.platformId === "ios") {
            //         stopp=false;
            //         bluetoothle.isScanning(isScanningSuccessAndScan);
            //     }
            //     else{
            //         stopp=false;
            //         bluetoothle.isScanning(isScanningSuccessAndScan);
            //     }
            // }, false);
        }

        // console.log('Received Event: ' + id);
    }
};

app.initialize();
