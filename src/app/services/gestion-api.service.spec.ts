import { TestBed } from '@angular/core/testing';
import { GestionApiService } from './gestion-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RespuestaNoticias } from '../interfaces/interfaces';

describe('GestionApiService', () => {
  // Inicialización del servicio
  let service: GestionApiService;

  // Mock para sustituir el HttpCliente
  let httpMock: HttpTestingController;

  // Import de los modulos necesarios, como por ejemplo para simular HttpClient
  beforeEach(() => {

    TestBed.configureTestingModule({

      // Importamos el httpClienteTestingModule (no importamos httpClient)
      imports:[HttpClientTestingModule],

      // En providers, añadimos el servicio que vamos a utilizar
      providers: [GestionApiService]
    });

    // Inyectamos el servicio al TestBed
    service = TestBed.inject(GestionApiService);

    // Inyectamos el httpTestingController al TestBed
    httpMock = TestBed.inject(HttpTestingController);

  });

  // Verificamos httpMock que no queden respuestas pendientes
  afterEach(() => {
    httpMock.verify();
  });

  // TEST 1
  // Verificamos que el servicio se crea correctamente
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TEST 2
  // Simulamos sin ejecutar la lógica para comprobar si se puede llamar al método cargarCategoria
  it("Comprobar si podemos llamar al método cargarCategoria", () => {

    // Sustituye temporalmente el método real por un espía (no ejecutará la lógica interna)
    spyOn(service, 'cargarCategoria');

    // Ejecuta la llamada al método (sin uso de la lógica interna)
    service.cargarCategoria('technology');

    // Verifica la llamada con el argumento "technology"
    expect(service.cargarCategoria).toHaveBeenCalledWith('technology');

  });
  
  // TEST 3
  // Comprobamos que nuestro BehaviorSubject lee los datos correctamente
  it('Debería cargar los datos en el BehaviorSubject correctamente', () => {

    // Categoría para la petición a la API
    const categoria = 'technology';

    // Necesitaremos un mock de tipo RespuestasNoticias para simular la respuesta del servidor 
    const mockResponse: RespuestaNoticias = {

      // Respuesta del servidor
      status: 'ok',

      // Total de resultados
      totalResults: 3,

      // Objetos Article
      articles: [
        {
          source: {
            id: '111',
            name: 'Ejemplo1'
          },
          author: 'Autor1',
          title: 'Título1',
          description: 'Descripción1',
          url: 'https://ejemplo.com',
          urlToImage: 'https://ejemplo.com/image.jpg',
          publishedAt: '2024-03-11TE04:45:29Z',
          content: 'Contenido1'
        },
        {
          source: {
            id: '222',
            name: 'Ejemplo2'
          },
          author: 'Autor2',
          title: 'Título2',
          description: 'Descripción2',
          url: 'https://ejemplo.com',
          urlToImage: 'https://ejemplo.com/image.jpg',
          publishedAt: '2024-03-11TE04:45:29Z',
          content: 'Contenido2'
        },
        {
          source: {
            id: '333',
            name: 'Ejemplo3'
          },
          author: 'Autor3',
          title: 'Título3',
          description: 'Descripción3',
          url: 'https://ejemplo.com',
          urlToImage: 'https://ejemplo.com/image.jpg',
          publishedAt: '2024-03-11TE04:45:29Z',
          content: 'Contenido3'
        }
      ]
    };

    // Ejecutamos la lógica de cargarCategoria para testear que el BehaviorSuject funciona correctamente
    service.cargarCategoria(categoria)

    // Simulamos una llamada API y esperamos una respuesta y que sea de tipo GET
    // Recordar que hacemos uso de HttpTestingController, no de httpClient, por tanto, estamos simulando la llamada API
    const request = httpMock.expectOne("https://newsapi.org/v2/top-headlines?country=us&category="+categoria+"&apiKey="+service.apiKey);
    expect(request.request.method).toBe('GET');

    // Simulamos que la respuesta del servidor sea nuestro mockResponse (flush)
    request.flush(mockResponse);

    // datos$ tendría que modificarse con los datos simulados (categoria=technology y totalResults=3), por tanto data contendrá esos datos.
    // Aquí habrá que hacer el subscribe de datos$, y comprobaremos que data esté definido y que data.categoria y data.totalResults son iguales a nuestra categoria y totalResults
    service.datos$.subscribe( data => {
      expect(data).toBeDefined();
      expect(data?.categoria).toBe(categoria);
      expect(data?.totalResults).toBe(mockResponse.totalResults);
    });
  });
});
