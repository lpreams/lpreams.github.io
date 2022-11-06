#ifdef GL_ES
precision highp float;
#endif

#define NUM_BLOBS 200

uniform vec2 u_resolution;
uniform float u_pointsx[NUM_BLOBS];
uniform float u_pointsy[NUM_BLOBS];
uniform float u_pointscolr[NUM_BLOBS];
uniform float u_pointscolg[NUM_BLOBS];
uniform float u_pointscolb[NUM_BLOBS];

void main() {

  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  
  float nearestDist = 10.0;
  float nearestR = 0.0;
  float nearestG = 0.0;
  float nearestB = 0.0;
  
  // find the nearest point, and record its rgb 
  for (int i=0; i<NUM_BLOBS; ++i) {
    vec2 point = vec2(u_pointsx[i], u_pointsy[i]).xy / u_resolution.xy;
    float xx = point.x - uv.x;
    float yy = point.y - uv.y;
    float dist = xx*xx + yy*yy;
    if (dist < nearestDist) {
      nearestDist = dist;
      nearestR = u_pointscolr[i];
      nearestG = u_pointscolg[i];
      nearestB = u_pointscolb[i];
    }
  }
  
  gl_FragColor = vec4(nearestR, nearestG, nearestB, 1.0);
  
}
