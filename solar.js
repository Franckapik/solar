const Influx = require('influx');
const ModbusRTU = require("modbus-serial");
const Promise = require('bluebird');
const client = new ModbusRTU();
const config = require('./config');
const sensor = require('node-dht-sensor');
const weather = require('weather-js');
const solaireDB = new Influx.InfluxDB(config.solaireSchema)
const meteoDB = new Influx.InfluxDB(config.meteoSchema)
var temp;
var hum;

//Functions appelées

mainSolaire();
mainWeather();

//SOLAIRE
function mainSolaire() {

  client.connectRTU("/dev/ttyUSB0", {
      baudRate: 115200
    })
    .then(function() {
      client.setTimeout(2000)
      return readModbus([0x3101, 0x310D, 0x311A, 0x3304, 0x3306, 0x330A, 0x330C, 0x330E, 0x3312])
    }).then(arrayOfresults => {
      solaireWrite(arrayOfresults);
    }).catch(function(e) {
      console.log(e.message);
    });
}

//METEO
function mainWeather() {

  weather.find({
    search: 'Dingé, FR',
    degreeType: 'C'
  }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      sensorRead.then((sensor)=> {
        weatherWrite(result, sensor);
      })

    }
  });
}

//lecture des capteurs
var sensorRead = new Promise(function(resolve, reject) {
  sensor.read(11, 4, function(err, temperature, humidity) {
    if (err) {
      reject(err);
    } else {
      temp = temperature.toFixed(1);
      hum = humidity.toFixed(1);
      resolve([temp, hum]);
    }
  })
});

function readModbus(adress) {
  return Promise.map(adress, (number) => {
    return client.readInputRegisters(number, 1);
  }, {
    concurrency: 1
  });
}


//ecriture des données en DB
function solaireWrite(arrayOfvalues) {
  console.log('Insertion DB');
  solaireDB.writePoints([{
    measurement: 'solaire',
    fields: {
      ensoleillement: arrayOfvalues[0].data,
      courant_charge: arrayOfvalues[1].data,
      capacite_batterie: arrayOfvalues[2].data,
      conso_auj: arrayOfvalues[3].data,
      conso_mois: arrayOfvalues[4].data,
      conso_totale: arrayOfvalues[5].data,
      produite_auj: arrayOfvalues[6].data,
      produite_mois: arrayOfvalues[7].data,
      produite_totale: arrayOfvalues[8].data
    }
  }])
}

function weatherWrite(result, sensor) {
  meteoDB.writePoints([{
    measurement: 'meteo',
    fields: {
      current_temp: result[0].current.temperature,
      imageUrl: result[0].current.imageUrl,
      skytext: result[0].current.skytext,
      current_hum: result[0].current.humidity,
      sky_code: result[0].current.skycode,
      next_low: result[0].forecast[2].low,
      next_high: result[0].forecast[2].high,
      next_precip: result[0].forecast[2].precip,
      sensor_temp: sensor[0],
      sensor_hum: sensor[1]
    }
  }])
}
