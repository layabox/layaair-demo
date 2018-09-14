attribute vec4 a_Position;
uniform mat4 u_MvpMatrix;

void main()
{
  gl_Position = u_MvpMatrix * a_Position;
}