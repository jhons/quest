
  var cuestionarios = [
    {id: 1, nombre: 'Cuestionario 1', preguntas: 3 },
    {id: 2, nombre: 'Cuestionario 2', preguntas: 10 },
    {id: 3, nombre: 'Cuestionario 3', preguntas: 2 }
  ];

  var preguntas = [
    {id: 1, cuestionario: 1, enunciado: 'Pregunta 1', tipo: 'text', opciones: []},
    {id: 2, cuestionario: 1, enunciado: 'Pregunta 2', tipo: 'radio', opciones: [{valor: 'Si'}, {valor: 'No'}]},
    {id: 3, cuestionario: 1, enunciado: 'Pregunta 3', tipo: 'select', opciones: [{valor: 'Opcion 1'}, {valor: 'Opcion 2'}]},
    {id: 4, cuestionario: 2, enunciado: 'Pregunta 1', tipo: 'text', opciones: []},
    {id: 5, cuestionario: 2, enunciado: 'Pregunta 2', tipo: 'radio', opciones: [{valor: 'Si'}, {valor: 'No'}]},
    {id: 6, cuestionario: 2, enunciado: 'Pregunta 3', tipo: 'select', opciones: [{valor: 'Opcion 1'}, {valor: 'Opcion 2'}]},
    {id: 7, cuestionario: 2, enunciado: 'Pregunta 4', tipo: 'textarea', opciones: []},
    {id: 8, cuestionario: 2, enunciado: 'Pregunta 5', tipo: 'checkbox', opciones: [{valor: 'Opcion 1'}, {valor: 'Opcion 2'}]},
    {id: 9, cuestionario: 2, enunciado: 'Pregunta 6', tipo: 'number', opciones: []},
    {id: 10, cuestionario: 2, enunciado: 'Pregunta 7', tipo: 'url', opciones: []},
    {id: 11, cuestionario: 2, enunciado: 'Pregunta 8', tipo: 'email', opciones: []},

  ];

  function buscarCuestionario (cuestionarioId) {
    return cuestionarios[buscarCuestionarioKey(cuestionarioId)];
  };

  function buscarCuestionarioKey (cuestionarioId) {
    for (var key = 0; key < cuestionarios.length; key++) {
      if (cuestionarios[key].id == cuestionarioId) {
        return key;
      }
    }
  };

  function buscarPregunta (preguntaId) {
    return preguntas[buscarPreguntaKey(preguntaId)];
  };

  function buscarPreguntaKey (preguntaId) {
    for (var key = 0; key < preguntas.length; key++) {
      if (preguntas[key].id == preguntaId) {
        return key;
      }
    }
  };

  function buscarPreguntasCuestionario (cuestionarioId) {
    return preguntas.filter(function (pregunta) {
      return pregunta.cuestionario == parseInt(cuestionarioId)
    })
  };

  var List = Vue.extend({
    template: '#cuestionario-lista',
    data: function () {
      return {cuestionarios: cuestionarios, searchKey: ''};
    },
    computed : {
      filtradoCuestionarios: function () {
        var self = this;

        console.log(self.cuestionarios, self.searchKey)
        if(!self.searchKey) {
          return self.cuestionarios
        }
        return self.cuestionarios.filter(function (cuestionario) {
          return cuestionario.nombre.indexOf(self.searchKey) !== -1
        })
      }
  }
  });

  var Cuestionario = Vue.extend({
    template: '#cuestionario',
    data: function () {
      return {cuestionario: buscarCuestionario(this.$route.params.cuestionario_id), preguntas: buscarPreguntasCuestionario(this.$route.params.cuestionario_id)};
    },
    computed : {
      filtradoPreguntas: function () {
        var self = this;

        return self.preguntas.filter(function (pregunta) {
          return pregunta.cuestionario == parseInt(self.$route.params.cuestionario_id)
        })

      }
    },
    methods: {
      isInArray: function(needle) {
        const haystack = ['text', 'number', 'email', 'url'];
        const inArray = haystack.includes(needle);
        return inArray;
      }
    }
  });

  var CuestionarioEditar = Vue.extend({
    template: '#cuestionario-editar',
    data: function () {
      return {cuestionario: buscarCuestionario(this.$route.params.cuestionario_id)};
    },
    methods: {
      actualizarCuestionario: function () {
        var cuestionario = this.cuestionario;
        cuestionarios[buscarCuestionarioKey(cuestionario.id)] = {
          id: cuestionario.id,
          nombre: cuestionario.nombre,
          preguntas: cuestionario.preguntas
        };
        router.push('/');
      }
    }
  });

  var CuestionarioBorrar = Vue.extend({
    template: '#cuestionario-borrar',
    data: function () {
      return {cuestionario: buscarCuestionario(this.$route.params.cuestionario_id)};
    },
    methods: {
      borrarCuestionario: function () {
        cuestionarios.splice(buscarCuestionarioKey(this.$route.params.cuestionario_id), 1);
        router.push('/');
      }
    }
  });

  var NuevoCuestionario = Vue.extend({
    template: '#nuevo-cuestionario',
    data: function () {
      return {cuestionario: {nombre: '', preguntas: ''}
      }
    },
    methods: {
      createCuestionario: function() {
        var cuestionario = this.cuestionario;
        cuestionarios.push({
          id: Math.random().toString().split('.')[1],
          nombre: cuestionario.nombre,
          preguntas: cuestionario.preguntas
        });
        router.push('/');
      }
    }
  });


  var CuestionarioPreguntas = Vue.extend({
    template: '#cuestionario-preguntas',
    data: function () {
      return { preguntas: preguntas, cuestionario: buscarCuestionario(this.$route.params.cuestionario_id) };
    },
    computed : {
      filtradoPreguntas: function () {
        var self = this;

        return self.preguntas.filter(function (pregunta) {
          return pregunta.cuestionario == parseInt(self.$route.params.cuestionario_id)
        })

      }
    }
  });


  var PreguntaEditar = Vue.extend({
    template: '#pregunta-editar',
    data: function () {
      return {pregunta: buscarPregunta(this.$route.params.pregunta_id), cuestionario: buscarCuestionario(this.$route.params.cuestionario_id)};
    },
    methods: {
      actualizarPregunta: function () {
        var pregunta = this.pregunta;
        var cuestionario = this.cuestionario;

        preguntas[buscarPreguntaKey(pregunta.id)] = {
          id: pregunta.id,
          cuestionario: cuestionario.id,
          enunciado: pregunta.enunciado,
          tipo: pregunta.tipo,
          opciones: pregunta.opciones
        };
        router.push('/cuestionario/' + cuestionario.id + '/preguntas');
      },
      nuevaOpcion: function() {
        this.pregunta.opciones.push(Vue.util.extend({}, this.opcion))
      },
      borrarOpcion: function (index) {
        Vue.delete(this.pregunta.opciones, index);
      },
      isInArray: function(needle) {
        const haystack = ['radio', 'checkbox', 'select'];
        const inArray = haystack.includes(needle);
        return inArray;
      },
      onChange:function(e){
        if (this.isInArray(e.target.value)) {
          this.pregunta.opciones = [{}];
        } else {
          this.pregunta.opciones = [];
        }
      }
    }
  });

  var PreguntaBorrar = Vue.extend({
    template: '#pregunta-borrar',
    data: function () {
      return {pregunta: buscarPregunta(this.$route.params.pregunta_id), cuestionario: buscarCuestionario(this.$route.params.cuestionario_id)};
    },
    methods: {
      borrarPregunta: function () {
        var cuestionario = this.cuestionario;
        preguntas.splice(buscarPreguntaKey(this.$route.params.pregunta_id), 1);
        router.push('/cuestionario/' + this.$route.params.cuestionario_id + '/preguntas');
      }
    }
  });

  var NuevaPregunta = Vue.extend({
    template: '#nueva-pregunta',
    data: function () {
      return {pregunta: {cuestionario: parseInt(this.$route.params.cuestionario_id), enunciado: '', tipo: 'text', opciones: []}, cuestionario: buscarCuestionario(this.$route.params.cuestionario_id)}
    },
    methods: {
      createPregunta: function() {
        var pregunta = this.pregunta;
        console.log(pregunta);
        var cuestionario = this.cuestionario;
        preguntas.push({
          id: Math.random().toString().split('.')[1],
          cuestionario: cuestionario.id,
          enunciado: pregunta.enunciado,
          tipo: pregunta.tipo,
          opciones: pregunta.opciones
        });
        router.push('/cuestionario/' + cuestionario.id + '/preguntas');
      },
      nuevaOpcion: function() {
        this.pregunta.opciones.push(Vue.util.extend({}, this.opcion))
      },
      borrarOpcion: function (index) {
        Vue.delete(this.pregunta.opciones, index);
      },
      isInArray: function(needle) {
        const haystack = ['radio', 'checkbox', 'select'];
        const inArray = haystack.includes(needle);
        return inArray;
      },
      onChange:function(e){
        if (this.isInArray(e.target.value)) {
          this.pregunta.opciones = [{}];
        } else {
          this.pregunta.opciones = [];
        }
      }
    }
  });

  var router = new VueRouter({
    routes: [{path: '/', component: List, name: 'root'},
      {path: '/cuestionario/:cuestionario_id', component: Cuestionario, name: 'cuestionario'},
      {path: '/nuevo-cuestionario', component: NuevoCuestionario},
      {path: '/cuestionario/:cuestionario_id/editar', component: CuestionarioEditar, name: 'cuestionario-editar'},
      {path:   '/cuestionario/:cuestionario_id/borrar', component: CuestionarioBorrar, name: 'cuestionario-borrar'},
      {path:   '/cuestionario/:cuestionario_id/preguntas', component: CuestionarioPreguntas, name: 'cuestionario-preguntas'},
      {path:   '/preguntas/:cuestionario_id/nueva', component: NuevaPregunta, name: 'nueva-pregunta'},
      {path:   '/pregunta/:pregunta_id/cuestionario/:cuestionario_id/editar', component: PreguntaEditar, name: 'pregunta-editar'},
      {path:   '/pregunta/:pregunta_id/cuestionario/:cuestionario_id/borrar', component: PreguntaBorrar, name: 'pregunta-borrar'},
  ]});

  new Vue({
    el: '#app',
    router: router,
    template: '<router-view></router-view>'
  });
