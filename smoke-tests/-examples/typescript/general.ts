function decorator(target: unknown, key: string, descriptor?: PropertyDescriptor): void {

  console.log(target, key, descriptor);
}
export default class Foo {
  @decorator foo: unknown;
}
