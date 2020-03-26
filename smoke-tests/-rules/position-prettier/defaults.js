export class Foo {
  @attr title;

  @belongsTo('user') author;
  @hasMany('comments') comments;

  @hasMany('comments', {
    something: true,
    multiline: true,
  })
  otherComments;

  @tracked uninitialized;
  @tracked initialized = 2;

  @foo
  get myMethod() {}

  @foo
  myMethod2() {}

  @foo
  async myMethod3() {}
}
