/**
 * 文档解析工具
 * @type {{definitions: any, getRefName(*): *, getType(*=): *, getDefinition(*): *}}
 */
const parse = {
  parseSameObject: 0,
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
    let result = {name: '', desc: '', type: ''};
    if (!schema) return result;
    if (schema.type === 'array') {
      if (schema.items.type) {
        result.name = schema.items.type;
      } else {
        const ref = schema.items.$ref;
        result.name = this.getRefName(ref);
      }
      result.type = 'array';
      result.desc = 'Array<' + result.name + '>';
    } else if (schema.type) {
      result.type = schema.type;
      result.name = schema.type;
      result.desc = schema.type;
    } else {
      result.type = 'object';
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
  },
  /**
   * 解析对象JSON
   * @param type
   */
  parseObject(type) {
    const def = this.getDefinition(type.name);
    if (!def) return;
    let object = {};
    for (const key in def.properties) {
      const fieldType = this.getType(def.properties[key]);
      if (fieldType.type === 'string') {
        object[key] = 'string';
      } else if (fieldType.type === 'integer') {
        object[key] = 0;
      } else if (fieldType.type === 'number') {
        object[key] = 1.1;
      } else if (fieldType.type === 'boolean') {
        object[key] = false;
      } else if (fieldType.type === 'array') {
        object[key] = this.parseArray(fieldType);
      } else if (fieldType.type === 'object') {
        if (this.parseSameObject++ > 2) {
          this.parseSameObject = 0;
          return;
        }
        object[key] = this.parseObject(fieldType) || 'object';
      }
    }
    return object;
  },
  /**
   * 解析数组JSON
   * @param type
   * @returns {any[]}
   */
  parseArray(type) {
    let resultArr = new Array(3);
    if (type.name === 'string') {
      return resultArr.fill('string');
    } else if (type.name === 'integer') {
      return resultArr.fill(0);
    } else if (type.name === 'number') {
      return resultArr.fill(0.0);
    } else if (type.name === 'boolean') {
      return resultArr.fill(false);
    } else {
      return resultArr.fill(this.parseObject(type));
    }
  }
};

export default parse;