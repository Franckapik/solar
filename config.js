const Influx = require('influx');

config = {
cron_solaire : '06 * * * *',
solaireSchema : {
  host: 'localhost',
  database: 'domotique',
  schema: [{
    measurement: 'solaire',
    fields: {
      ensoleillement: Influx.FieldType.INTEGER,
      courant_charge: Influx.FieldType.INTEGER,
      capacite_batterie: Influx.FieldType.INTEGER,
      conso_auj: Influx.FieldType.INTEGER,
      conso_mois: Influx.FieldType.INTEGER,
      conso_totale: Influx.FieldType.INTEGER,
      produite_auj: Influx.FieldType.INTEGER,
      produite_mois: Influx.FieldType.INTEGER,
      produite_totale: Influx.FieldType.INTEGER
    },
    tags: [
      'energie_solaire'
    ]
  }]
},
meteoSchema : {
  host: 'localhost',
  database: 'domotique',
  schema: [{
    measurement: 'meteo',
    fields: {
      current_temp: Influx.FieldType.INTEGER,
      imageUrl: Influx.FieldType.STRING,
      skytext: Influx.FieldType.STRING,
      current_hum: Influx.FieldType.INTEGER,
      sky_code: Influx.FieldType.INTEGER,
      next_low: Influx.FieldType.INTEGER,
      next_high: Influx.FieldType.INTEGER,
      next_precip: Influx.FieldType.INTEGER,
      sensor_temp: Influx.FieldType.INTEGER,
      sensor_hum: Influx.FieldType.INTEGER
    },
    tags: [
      'weather'
    ]
  }]
}
}
module.exports = config;
