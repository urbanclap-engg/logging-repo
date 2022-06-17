# Logging Solution

A uniform logging soution to simplify logging adoption across systems by abstrating out and maintaing underlying logging dependecies. 

# Working
* It uses winston internally currently and provides functionality of log rotation on a daily basis. 
* Given all dependecies are controlled via the abstraction, testing on single service can be used to rollout changes throughout the system. 

## Functions
* **initLogger :**
    - Used to initite logger for the service
    - Params : service or log index name 

      ```
      const Logger = require('@uc/logging-repo').initLogger(LOG_INDEX_NAME);
      ```


* **info :**
    - Used to log given data in info mode
    - Params : json key:value pair

    ```
    let data = {};
    data.key_1 = 'event_name';
    data.key_1_value = eventName;
    data.key_2 = 'event_type';
    data.key_2_value = eventType;
    data.key_3 = "info";
    data.key_3_value = (info === null || info === undefined) ? "" : info.toString();
    if (responseTime != null || responseTime != undefined) {
      data.numkey_1 = 'response_time_ms';
      data.numkey_1_value = responseTime;
    }
    if (dataLength != null || dataLength != undefined) {
      data.numkey_2 = 'data_length';
      data.numkey_2_value = dataLength;
    }
    data.log_type = LOG_TYPE;
    data.message = JSON.stringify({
      service_name: serviceName,
      message: message
    });
    Logger.info(data);
    ```


* **error :**
    - Used to log given data in error mode
    - Params : json key:value pair

    ```
    let data = {};
    data.key_1 = 'event_name';
    data.key_1_value = eventName;
    data.key_2 = 'event_type';
    data.key_2_value = eventType;
    if (cacheKey){
      data.key_3 = "cache_key";
      data.key_3_value = cacheKey;
    }
    if (responseTime != null || responseTime != undefined) {
      data.numkey_1 = 'response_time_ms';
      data.numkey_1_value = responseTime;
    }
    if (dataLength != null || dataLength != undefined) {
      data.numkey_2 = 'data_length';
      data.numkey_2_value = dataLength;
    }
    data.error_message = JSON.stringify(error);
    data.log_type = LOG_TYPE;
    data.message = JSON.stringify({
      service_name: serviceName
    });
    Logger.error(data);
     ```

* **debug :**
    - Used to log given data in debug mode
    - Params : json key:value pair

   ```
    let data = {};
    data.key_1 = 'event_name';
    data.key_1_value = eventName;
    data.key_2 = 'event_type';
    data.key_2_value = eventType;
    if (cacheKey){
      data.key_3 = "cache_key";
      data.key_3_value = cacheKey;
    }
    data.log_type = LOG_TYPE;
    data.message = JSON.stringify({
      info : debugInfo,
    });
    Logger.debug(data);
     ```

* **exitAfterFlush :**
    - Flushes the logs to the files and exit

    ```
    Logger.exitAfterFlush();
    ```
