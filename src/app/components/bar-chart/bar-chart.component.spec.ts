import { GestionApiService } from './../../services/gestion-api.service';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BarChartComponent } from './bar-chart.component';
//import { HttpClientModule } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BarChartComponent', () => {
  let component: BarChartComponent;
  let fixture: ComponentFixture<BarChartComponent>;

  // Será un array de un objeto que contenga categoria y totalResults, estará inicializado a un array vacío.
  let mockApiData: { categoria: string; totalResults: number }[] = [];

  // Declara un BehaviorSubject falso para usar en las pruebas. Asignar un valor inicial al objeto que contiene categoria y totalResults.
  const fakeSubject = new BehaviorSubject<{ categoria: string; totalResults: number }[]>(mockApiData);

  // Creamos un mock para sustituir GestionApiService. 
  // Contiene un método cargarCategoria que recibe un string categoria y no devulve nada.
  const mockGestionService = {
    cargarCategoria: (categoria: string) => {}
  };

  // Necesitamos añadir el sustituto de HttpClient
  // De providers, como sustituiremos GestionApiService, como useValue, necesitaremos añadir {datos$: fakeSubject, mockGestionService}
  // En este caso, cuando queremos hacer uso de GestionApiService, estaremos haciendo uso de mockGestionService y fakeSubject
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BarChartComponent ],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: GestionApiService, useValue: {datos$: fakeSubject, mockGestionService} }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  // TEST 1
  // Verificamos que el componente se crea correctamente
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TEST 2
  // Comprobamos si podemos ejecutar el método ngOnInit
  // No se ejecuta la lógica del ngOnInit
  it('Se puede ejecutar ngOnInit', () => {

    // Espía el método ngOnInit (no ejecutará la lógica interna)
    spyOn(component, "ngOnInit");

    // Ejecutamos el método (sin uso de lógica interna)
    component.ngOnInit();

    // Verifica la llamada
    expect(component.ngOnInit).toHaveBeenCalled();

  });

  // TEST 3
  // Comprobamos si podemos ejecutar el método ngOnInit
  // Se ejecuta la lógica de ngOnInit
  it('El método ngOnInit se ejecuta correctamente', () => {

    // Espía el método ngOnInit (ejecutará la lógica interna)
    spyOn(component, 'ngOnInit').and.callThrough();

    // Eejecuamos la llamada al método (usa lógica interna)
    component.ngOnInit();

    // Verifica que se hace la llamada
    expect(component.ngOnInit).toHaveBeenCalled();

  });

  // TEST 4
  // Necesitaremos 2 espías uno por cada método
  // Usaremos un mockData, será un objeto que contenga un valor de categoria y totalResults
  // Haremos uso de fakeSubject (el fake BehaviorSubject). Simularemos el next de este BehaviorSubject pasándole el mockData
  it('Comprobamos si podemos llamar a actualizarValoresChart y actualizarChart', () => {

    // Espias de los métodos
    spyOn(component, 'actualizarValoresChart');
    spyOn(component, 'actualizarChart');

    // Simulación de emisión de datos desde el observable
    const mockData = { categoria: 'science', totalResults: 10 }
    fakeSubject.next([mockData]);

    // Verificación que se han llamado los métodos
    expect(component.actualizarValoresChart).toHaveBeenCalled();
    expect(component.actualizarChart).toHaveBeenCalled();

  });

  // TEST 5
  // Cargaremos el mockApiData de valores e inicializaremos la variable apiData del componente con este mockApiData (No asignar todos los valores)
  // Crearemos un mockData, con los datos de categoria y totalResults que no existen en el mockApiData, para pasar estos valores al método actualizarValoresChart
  // Si el método actualizarValoresChart, se ha ejecutado correctamente, mediante el método find, podemos comprobar a ver si los valores de mockData se han insertado en component.apiData
  // Al hacer uso de .find, devolverá el objeto encontrado, los que hemos puesto en mockData.
  // Por tanto, esperamos que ese objeto devuelto exista y que el valor totalResults sea igual al totalResults de mockData
  it('Comprobamos si podemos ejecutar actualizarValoresChart', () => {

    // Espía sobre el método para comprobar que se llama con los parámetros correctamente
    spyOn(component, 'actualizarValoresChart').and.callThrough();

    // Carga de datos en mockApiData
    mockApiData = [
      { categoria: 'economy', totalResults: 5 },
      { categoria: 'science', totalResults: 10 },
      { categoria: 'technology', totalResults: 12 } // mockData a añadir en apiData
    ];

    // Inicializamos apiData del componente con los dos primeros valores
    component.apiData = mockApiData.slice(0, 2);

    // Llamada al método con el tercer valor (nuevo dato)
    component.actualizarValoresChart(mockApiData[2].categoria, mockApiData[2].totalResults)

    // Verifica la llamada con los argumentos correctamente
    expect(component.actualizarValoresChart).toHaveBeenCalledWith(
      mockApiData[2].categoria,
      mockApiData[2].totalResults
    )

    // Uso de find para buscar el nuevo dato en apiData
    const result = component.apiData.find(
      item => item.categoria == mockApiData[2].categoria
    )

    // Verificamos que el objeto existe (se ha insertado)
    expect(result).toBeTruthy();

    // Verificamos que el totalResults coincide con el que hemos añadido
    expect(result?.totalResults).toEqual(mockApiData[2].totalResults)

  });
});
