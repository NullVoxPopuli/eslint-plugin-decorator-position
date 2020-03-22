// TODO: use json-schema instead
function assertConfig(options, schema = {}) {
  const { ALLOWED_OPTIONS } = schema;

  function validateConfigSet(configSet, configName) {
    if (!Array.isArray(configSet)) {
      throw new TypeError(`Option ${configName} must be an array`);
    }

    for (const config of configSet) {
      if (typeof config === 'string') {
        continue;
      }

      if (Array.isArray(config)) {
        const [name, configOptions] = config;

        if (typeof name !== 'string') {
          throw new TypeError(
            `Array entry's first element in ${configName} must be a string. Received: ${name}`
          );
        }

        if (!configOptions) {
          continue;
        }

        if (typeof configOptions === 'object') {
          if (Array.isArray(configOptions)) {
            throw new TypeError(
              `Array entry's config options in ${configName} must not be an array. Only object is allowed`
            );
          }

          assertKeys(configOptions, ['withArgs']);
        }
        continue;
      }

      throw new Error(
        `Entry in ${configName} must be either a string or array. Received: ${config}`
      );
    }
  }

  Object.keys(options).forEach(key => {
    if (!ALLOWED_OPTIONS.includes(key)) {
      throw new Error(`Option ${key} is not recognized.`);
    }

    validateConfigSet(options[key], key);
  });
}

module.exports = {
  assertConfig,
};

function assertKeys(obj, keyList) {
  const keys = Object.keys(obj);

  keys.forEach(key => {
    if (!keyList.includes(key)) {
      throw new Error(`Key ${key} is not allowed in the decorator config`);
    }
  });
}
