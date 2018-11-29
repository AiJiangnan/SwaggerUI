<template>
  <div id="data">
    <table cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td>1</td>
        <td>2</td>
        <td>3</td>
        <td>4</td>
      </tr>
      <tr>
        <td>5</td>
        <td>6</td>
        <td>7</td>
        <td>8</td>
      </tr>
      <tr>
        <td>9</td>
        <td>0</td>
        <td>1</td>
        <td>2</td>
      </tr>
      <tr>
        <td>3</td>
        <td>4</td>
        <td>2</td>
        <td>1</td>
      </tr>
    </table>
  </div>
  <!--<div>
    <h2>{{url}}</h2>
    <p>{{method}}</p>
    <pre>{{api}}</pre>
  </div>-->
</template>

<script>

  export default {
    name: "apidoc",
    props: {
      url: {type: String, default: ''},
      method: {type: String, default: ''},
      api: {type: Object, default: null}
    },
    data() {
      return {
        definitions: JSON.parse(sessionStorage.definitions)
      }
    }
  }
</script>

<style scoped>

  #data {
    padding: 20px;
  }

  #data table {
    width: 21cm;
    border: 2px solid;
  }

  #data td {
    padding: 8px;
    border: 1px solid;
  }

</style>