import{M as e,P as t,Q as n,_t as r,bt as i,gt as a,i as o,s,u as c}from"./C1veogOm.js";import"./xihTtKlq.js";var l=t(`<canvas class="svelte-1fpnid3"></canvas> <div class="blur-overlay svelte-1fpnid3"></div>`,1);function u(t,u){r(u,!0);let d=s(u,`darkMode`,3,!1),f={colour_1:[.85,.2,.2,1],colour_2:[0,156/255,1,1],colour_3:[0,0,0,1]},p={colour_1:[20/255,15/255,90/255,1],colour_2:[40/255,5/255,70/255,1],colour_3:[3/255,3/255,15/255,1]},m,h,g,_,v,y,b,x,S;function C(e,t){let n=h.createShader(e);if(!n)throw Error(`Failed to create shader`);if(h.shaderSource(n,t),h.compileShader(n),!h.getShaderParameter(n,h.COMPILE_STATUS)){let e=h.getShaderInfoLog(n);throw h.deleteShader(n),Error(`Shader compilation error: `+e)}return n}function w(){let e=m.getContext(`webgl`);if(!e)throw Error(`WebGL not supported`);h=e;let t=C(h.VERTEX_SHADER,`
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `),n=C(h.FRAGMENT_SHADER,`
    precision highp float;
    uniform float iTime;
    uniform vec2 iResolution;
    uniform vec4 colour_1;
    uniform vec4 colour_2;
    uniform vec4 colour_3;

    #define PIXEL_SIZE_FAC 700.0
    #define SPIN_EASE 0.5
    #define spin_amount 0.7
    #define contrast 1.5

    void mainImage(out vec4 fragColor, in vec2 fragCoord) {
	   //Convert to UV coords (0-1) and floor for pixel effect
    float pixel_size = length(iResolution.xy)/PIXEL_SIZE_FAC;
    vec2 uv = (floor(fragCoord.xy*(1.0/pixel_size))*pixel_size - 0.5*iResolution.xy)/length(iResolution.xy) - vec2(0.0, 0.0);
    float uv_len = length(uv);

    //Adding in a center swirl, changes with iTime. Only applies meaningfully if the 'spin amount' is a non-zero number
    float speed = (iTime*SPIN_EASE*0.1) + 302.2;
    float new_pixel_angle = (atan(uv.y, uv.x)) + speed - SPIN_EASE*20.*(1.*spin_amount*uv_len + (1. - 1.*spin_amount));
    vec2 mid = (iResolution.xy/length(iResolution.xy))/2.;
    uv = (vec2((uv_len * cos(new_pixel_angle) + mid.x), (uv_len * sin(new_pixel_angle) + mid.y)) - mid);

	//Now add the paint effect to the swirled UV
    uv *= 30.;
    speed = iTime*(1.);
	vec2 uv2 = vec2(uv.x+uv.y);

    for(int i=0; i < 5; i++) {
		uv2 += uv + cos(length(uv));
		uv  += 0.5*vec2(cos(5.1123314 + 0.353*uv2.y + speed*0.131121),sin(uv2.x - 0.113*speed));
		uv  -= 1.0*cos(uv.x + uv.y) - 1.0*sin(uv.x*0.711 - uv.y);
	}

    //Make the paint amount range from 0 - 2
    float contrast_mod = (0.25*contrast + 0.5*spin_amount + 1.2);
	float paint_res =min(2., max(0.,length(uv)*(0.035)*contrast_mod));
    float c1p = max(0.,1. - contrast_mod*abs(1.-paint_res));
    float c2p = max(0.,1. - contrast_mod*abs(paint_res));
    float c3p = 1. - min(1., c1p + c2p);

    vec4 ret_col = (0.3/contrast)*colour_1 + (1. - 0.3/contrast)*(colour_1*c1p + colour_2*c2p + vec4(c3p*colour_3.rgb, c3p*colour_1.a)) + 0.3*max(c1p*5. - 4., 0.) + 0.4*max(c2p*5. - 4., 0.);

    fragColor = ret_col;
    }

	void main() {
		vec4 fragColor;
		mainImage(fragColor, gl_FragCoord.xy);
		gl_FragColor = fragColor;
	}
  `);if(!t||!n)throw Error(`Failed to create shaders`);let r=h.createProgram();if(!r)throw Error(`Failed to create program`);if(g=r,h.attachShader(g,t),h.attachShader(g,n),h.linkProgram(g),!h.getProgramParameter(g,h.LINK_STATUS)){let e=h.getProgramInfoLog(g);throw Error(`Program link error: `+e)}let i=h.getUniformLocation(g,`iTime`),a=h.getUniformLocation(g,`iResolution`),o=h.getUniformLocation(g,`colour_1`),s=h.getUniformLocation(g,`colour_2`),c=h.getUniformLocation(g,`colour_3`);if(i===null||a===null||o===null||s===null||c===null)throw Error(`Failed to get uniform locations: required uniforms not found in shader`);let l=new Float32Array([-1,-1,1,-1,-1,1,1,1]),u=h.createBuffer();h.bindBuffer(h.ARRAY_BUFFER,u),h.bufferData(h.ARRAY_BUFFER,l,h.STATIC_DRAW);let d=h.getAttribLocation(g,`position`);h.enableVertexAttribArray(d),h.vertexAttribPointer(d,2,h.FLOAT,!1,0,0),_=i,v=a,y=o,b=s,x=c,S=performance.now(),O()}let T,E=!1,D=0;function O(e){if(!E)return;let t=e??performance.now();if(t-D<33.333333333333336){T=requestAnimationFrame(O);return}D=t;let n=(t-S)*.001;h.viewport(0,0,m.width,m.height),h.useProgram(g),h.uniform1f(_,n),h.uniform2f(v,m.width,m.height);let r=d()?p:f;h.uniform4f(y,r.colour_1[0],r.colour_1[1],r.colour_1[2],r.colour_1[3]),h.uniform4f(b,r.colour_2[0],r.colour_2[1],r.colour_2[2],r.colour_2[3]),h.uniform4f(x,r.colour_3[0],r.colour_3[1],r.colour_3[2],r.colour_3[3]),h.drawArrays(h.TRIANGLE_STRIP,0,4),T=requestAnimationFrame(O)}function k(){m.width=window.innerWidth,m.height=window.innerHeight}o(()=>{k(),window.addEventListener(`resize`,k),E=!0,w();let e=()=>{document.hidden?(E=!1,T&&cancelAnimationFrame(T)):(E=!0,D=0,T=requestAnimationFrame(O))};return document.addEventListener(`visibilitychange`,e),()=>{window.removeEventListener(`resize`,k),document.removeEventListener(`visibilitychange`,e),T&&cancelAnimationFrame(T)}});var A=l(),j=n(A);c(j,e=>m=e,()=>m),i(2),e(t,A),a()}export{u as default};