type Service = unknown;

function service(name) {
  return function decorator(target: unknown, key: string, descriptor?: PropertyDescriptor): void {
    console.log(target, key, descriptor);
  };
}
export default class Foo {
  @service('addon-name/-private/do-not-use/the-name-of-the-service')
  declare someObfuscatedPrivateService: Service;

  @service('addon-name/-private/do-not-use/the-name-of-the-service') declare shortName: Service;
}
