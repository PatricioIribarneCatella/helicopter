# TP-Helicoptero

Sitio: _https://patricioiribarnecatella.github.io/helicopter/_

Helicóptero realizado con [_WebGL_](https://webglfundamentals.org/), [_JS_](https://developer.mozilla.org/es/docs/Web/JavaScript), [_JQuery_](https://jquery.com/) y [_glMatrix_](http://glmatrix.net/docs/index.html) (_Sistemas Gráficos - FIUBA_)

Para generar _build.js_ se utiliza [_rollup_](https://rollupjs.org/guide/en/)

```bash
 $ rollup --config
```

### Run

```bash
 $ ./run.sh
```

#### Controles

- Desplazamiento:
  - _Arrow Keys - ASDW_: horizontal
  - _UpPag/DownPag - Q/E_: vertical

- Vehículo:
  - _H_: abrir/cerrar los motores
  - _T_: extender/retraer las trenes de aterrizaje
  - _P_: abrir/cerrar la puerta

- Cámaras:
  - _1_: Global
  - _2_: Orbital
  - _3_: Lateral
  - _4_: Superior
  - _5_: Trasera

  - _Mouse_:
    - Cursor: desplazamiento orbital para cámaras _1_ y _2_.
    - Scroll: _Zoom In/Out_

