type Service = {
  foo: number;
};

export class Foo {
  @service('addon-name/-private/do-not-use/the-name-of-the-service')
  declare someObfuscatedPrivateService: Service;
}
