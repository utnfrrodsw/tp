function DetalleServicio() {
const fecha='03/11/01';
const text= 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deleniti accusantium laborum esse labore iusto commodi ducimus id earum dolores necessitatibus quo, quasi provident corporis repellendus. Deserunt sed incidunt doloremque aperiam.'
  return (
    <div className='container'>
      <div className='date'>{fecha}</div>
      <div className='titulo'>123</div>
      <div className='img'><img src="https://unavatar.io/kikobeats?ttl=1h" alt="not found" /></div>
      <div className='descripcion'>{text+text}</div>
      <div className="pres"><button>Presupuestar</button></div>
    </div>
  );
}

export default DetalleServicio;