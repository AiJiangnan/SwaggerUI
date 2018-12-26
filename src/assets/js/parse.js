/**
 * 文档解析工具
 * @type {{definitions: any, getRefName(*): *, getType(*=): *, getDefinition(*): *}}
 */
const parse = {
  /**
   * 从本地会话存储取得对象资源
   */
  definitions: JSON.parse(sessionStorage.definitions),
  /**
   * 通过对象引用获取对象名称
   * @param ref 对象引用
   * @returns {*} 对象名称
   */
  getRefName(ref) {
    if (!ref) return;
    return ref.replace('#/definitions/', '');
  },
  /**
   * 通过对象schema获取类型信息
   * @param schema
   * @returns {{name: string, desc: string}} name：对象类型名称，desc：对象展示的类型名称
   */
  getType(schema) {
    let result = {name: '', desc: ''};
    if (!schema) return result;
    if (schema.type === 'array') {
      if (schema.items.type) {
        result.name = schema.items.type;
      } else {
        const ref = schema.items.$ref;
        result.name = this.getRefName(ref);
      }
      result.desc = 'Array<' + result.name + '>';
    } else if (schema.type) {
      result.name = schema.type;
      result.desc = schema.type;
    } else {
      result.name = this.getRefName(schema.$ref);
      result.desc = result.name;
    }
    return result;
  },
  /**
   * 通过对象类型名称获取对象资源
   * @param name 对象类型名称
   * @returns {*} 对象资源
   */
  getDefinition(name) {
    return this.definitions[name];
  }
};

export default parse;