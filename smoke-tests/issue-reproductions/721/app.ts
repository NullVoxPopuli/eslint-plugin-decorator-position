function State() {
  return (...decoratorArgs: any[]) => {
    /* This is totally a decorator */
    console.log(decoratorArgs);
  };
}

export class MyComponent {
  checkedClass = () => {};
  disabledClass = () => {};

  @State() classes = ['toggle', this.checkedClass(), this.disabledClass()]
    .filter(Boolean)
    .join(' ');
}
