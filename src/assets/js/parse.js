const parse = {
  definitions: JSON.parse(sessionStorage.definitions),
  getRefName(ref) {
    return ref.replace('#/definitions/', '');
  },
  getType(schema) {
    let result = {name: '', desc: ''};
    if (!schema) return result;
    if (schema.type === 'array') {
      if (schema.items.type) {
        result.name = schema.items.type;
        result.desc = schema.items.type;
      } else {
        const ref = schema.items.$ref;
        result.name = this.getRefName(ref);
        result.desc = 'Array<' + this.getRefName(ref) + '>';
      }
    } else if (schema.type) {
      result.name = schema.type;
      result.desc = schema.type;
    } else {
      result.name = this.getRefName(schema.$ref);
      result.desc = result.name;
    }
    return result;
  },
  getDefinition(name) {
    return this.definitions[name];
  }
};

export default parse;