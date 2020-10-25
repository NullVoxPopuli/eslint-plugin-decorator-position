export class Foo {
  @attr title;

  @belongsTo('user') author;
  @hasMany('comments') comments;

  @tracked uninitialized;
  @tracked initialized = 2;


  @foo
  get myMethod() {

  }

  @foo
  myMethod2() {

  }

  @foo
  async myMethod3() {

  }
}
